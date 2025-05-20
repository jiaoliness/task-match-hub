import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Job } from "@/types";
import { format } from "date-fns";

// For a real application, use environment variables
const GOOGLE_MAPS_API_KEY = "AIzaSyDtLTRUsAsi0T94ts1t5Fx3JiVri2KWx9A";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 10.7202, // Iloilo City center
  lng: 122.5642
};

interface JobMapProps {
  jobs: Job[];
  searchTerm: string;
}

// Create a custom chat bubble marker icon
function createChatBubbleIcon(jobTitle: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Set canvas size
  const width = 120;
  const height = 40;
  const pointerHeight = 8; // Small pointer for subtle look
  canvas.width = width;
  canvas.height = height + pointerHeight;

  // Clear canvas
  ctx.clearRect(0, 0, width, height + pointerHeight);

  // Draw chat bubble background (blue)
  ctx.fillStyle = '#4338ca';
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  
  // Draw rounded rectangle for bubble
  const radius = 8;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw small triangle pointer at bottom center
  const pointerWidth = 12;
  ctx.beginPath();
  ctx.moveTo(width / 2 - pointerWidth / 2, height);
  ctx.lineTo(width / 2, height + pointerHeight);
  ctx.lineTo(width / 2 + pointerWidth / 2, height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw text (white, centered)
  ctx.font = '600 12px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  // Truncate and add ellipsis if needed
  const maxLength = 15;
  const displayText = jobTitle.length > maxLength 
    ? jobTitle.substring(0, maxLength) + '...' 
    : jobTitle;
  
  ctx.fillText(displayText, width / 2, height / 2);

  return {
    url: canvas.toDataURL(),
    size: new google.maps.Size(width, height + pointerHeight), // Include pointer in size
    anchor: new google.maps.Point(width / 2, height + pointerHeight), // Anchor at bottom center of pointer
    scaledSize: new google.maps.Size(width, height + pointerHeight)
  };
}

export function JobMap({ jobs, searchTerm }: JobMapProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get job location info for display
  const getLocationInfo = (job: Job) => {
    if (job.address) {
      const { street, city, state, zipCode, country } = job.address;
      const parts = [street, city, state, zipCode, country].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    return "Remote";
  };

  // Format the date information based on scheduling type
  const getDateInfo = (job: Job) => {
    if (job.schedulingType === "specific" && job.specificDate) {
      return format(new Date(job.specificDate), "MMM d, yyyy");
    } else if (job.schedulingType === "flexible" && job.weeklyPreference) {
      return job.weeklyPreference.join(', ');
    }
    return "Flexible";
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update markers when jobs or search term changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // Add new markers
    const bounds = new google.maps.LatLngBounds();

    filteredJobs.forEach(job => {
      if (!job.address) return;

      const coordinates = getCoordinatesForAddress(job.address);
      if (!coordinates) return;

      const position = { lat: coordinates[1], lng: coordinates[0] };
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position,
        map,
        title: job.title,
        icon: createChatBubbleIcon(job.title),
        optimized: false // Disable marker optimization for custom icons
      });

      marker.addListener('click', (e: google.maps.MapMouseEvent) => {
        e.stop();
        setSelectedJob(job);
      });

      markersRef.current[job.id] = marker;
    });

    // Only fit bounds when the jobs list or search term changes
    if (Object.keys(markersRef.current).length > 0 && !map.getBounds()) {
      setTimeout(() => {
        map.fitBounds(bounds);
      }, 100);
    }
  }, [map, filteredJobs, searchTerm]);

  if (!isLoaded) {
    return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="h-[calc(100vh-200px)] w-full rounded-lg overflow-hidden border">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
          scrollwheel: true,
          disableDoubleClickZoom: true,
          maxZoom: 18,
          minZoom: 10,
        }}
      >
        {selectedJob && (
          <InfoWindow
            position={{
              lat: getCoordinatesForAddress(selectedJob.address)![1],
              lng: getCoordinatesForAddress(selectedJob.address)![0]
            }}
            onCloseClick={() => setSelectedJob(null)}
            options={{
              disableAutoPan: true,
              pixelOffset: new google.maps.Size(0, -40)
            }}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => window.location.href = `/job/${selectedJob.id}`}>
                {selectedJob.title}
              </h3>
              <p className="text-sm text-muted-foreground">₱{selectedJob.budget}</p>
              <p className="text-sm mt-1 line-clamp-3">{selectedJob.description}</p>
              <p className="text-xs text-muted-foreground mt-1">📍 {getLocationInfo(selectedJob)}</p>
              <p className="text-xs text-muted-foreground mt-1">🕒 {getDateInfo(selectedJob)}</p>
              <div className="text-xs mt-2 flex flex-wrap gap-1">
                {selectedJob.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              <a
                href={`/job/${selectedJob.id}`}
                className="mt-2 bg-primary text-white text-xs px-3 py-1 rounded block text-center"
              >
                View Details
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

// Helper function to get coordinates based on location
// This function returns actual coordinates for Iloilo City locations
function getCoordinatesForAddress(address: Job['address']) {
  if (!address) return null;
  
  // Specific coordinates for various locations in Iloilo City
  const iloiloLocations: Record<string, [number, number]> = {
    'SM City Iloilo': [122.5613, 10.7133],
    'Plazuela de Iloilo': [122.5530, 10.7208],
    'Iloilo Business Park': [122.5684, 10.7135],
    'Atria Park District': [122.5518, 10.7156],
    'Iloilo City Hall': [122.5647, 10.7063],
    'Smallville Complex': [122.5523, 10.7166],
    'Festive Walk Mall': [122.5670, 10.7156],
    'Esplanade': [122.5706, 10.6968],
    'GT Town Center': [122.5843, 10.7198],
    'Robinson\'s Place Iloilo': [122.5429, 10.6970],
    'University of San Agustin': [122.5664, 10.7011],
    'West Visayas State University': [122.5686, 10.7039],
    'Iloilo Provincial Capitol': [122.5640, 10.7015],
    'Iloilo Doctors\' Hospital': [122.5603, 10.7040],
    'St. Paul\'s Hospital': [122.5630, 10.7072],
    'Molo Church': [122.5496, 10.6962],
    'Jaro Cathedral': [122.5664, 10.7235],
    'Central Philippine University': [122.5612, 10.7234],
    'La Paz Public Market': [122.5734, 10.7149],
    'Calle Real': [122.5658, 10.6960],
  };
  
  // Extract location from street address
  for (const [location, coords] of Object.entries(iloiloLocations)) {
    if (address.street && address.street.includes(location)) {
      // Add slight randomness to prevent exact overlap
      return [
        coords[0],
        coords[1]
      ];
    }
  }
  
  // Default to a random location in Iloilo City if no match
  const defaultCoord = [122.5642, 10.7202]; // Center of Iloilo City
  return [
    defaultCoord[0],
    defaultCoord[1]
  ];
}
