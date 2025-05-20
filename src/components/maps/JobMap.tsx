
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Job } from "@/types";
import { format } from "date-fns";

// You'll need to replace this with your Mapbox public token
// For a real application, use environment variables
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHh4aDI1amYwNGo0MmtvNzZuajQwbm9zIn0.u3HO34iH4h9XlJbbomlHSw";

interface JobMapProps {
  jobs: Job[];
  searchTerm: string;
}

export function JobMap({ jobs, searchTerm }: JobMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      // Initialize the map centered on Iloilo City
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [122.5642, 10.7202], // Center on Iloilo City
        zoom: 14 // Higher zoom level to show a partial area of the city
      });
      
      newMap.on('load', () => {
        setMapLoaded(true);
      });
      
      map.current = newMap;
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Clean up on unmount
      return () => {
        newMap.remove();
        map.current = null;
      };
    }
  }, []);

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

  // Add or update markers when jobs or search term changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear all existing markers
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    // Add markers for filtered jobs
    filteredJobs.forEach(job => {
      // Skip jobs without proper location data
      if (!job.address) return;
      
      // Use the coordinates from the job address
      const coordinates = getCoordinatesForAddress(job.address);
      
      if (!coordinates) return;

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 max-w-xs';
      
      // Popup header (visible without clicking)
      const headerContent = document.createElement('div');
      headerContent.className = 'font-semibold text-primary cursor-pointer hover:underline';
      headerContent.textContent = job.title;
      headerContent.onclick = () => window.location.href = `/job/${job.id}`;
      
      const budgetContent = document.createElement('div');
      budgetContent.className = 'text-sm text-muted-foreground';
      budgetContent.textContent = `₱${job.budget}`;
      
      // Details content (expanded view)
      const detailsContent = document.createElement('div');
      detailsContent.className = 'mt-2 hidden';
      detailsContent.id = `details-${job.id}`;
      
      const description = document.createElement('p');
      description.className = 'text-sm mt-1 line-clamp-3';
      description.textContent = job.description;
      
      const location = document.createElement('div');
      location.className = 'text-xs text-muted-foreground mt-1';
      location.textContent = `📍 ${getLocationInfo(job)}`;
      
      const schedule = document.createElement('div');
      schedule.className = 'text-xs text-muted-foreground mt-1';
      schedule.textContent = `🕒 ${getDateInfo(job)}`;
      
      const skills = document.createElement('div');
      skills.className = 'text-xs mt-2 flex flex-wrap gap-1';
      job.skills.slice(0, 3).forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'bg-primary/10 text-primary px-1 rounded text-xs';
        skillTag.textContent = skill;
        skills.appendChild(skillTag);
      });
      
      const viewButton = document.createElement('a');
      viewButton.href = `/job/${job.id}`;
      viewButton.className = 'mt-2 bg-primary text-white text-xs px-3 py-1 rounded block text-center';
      viewButton.textContent = 'View Details';
      
      detailsContent.appendChild(description);
      detailsContent.appendChild(location);
      detailsContent.appendChild(schedule);
      detailsContent.appendChild(skills);
      detailsContent.appendChild(viewButton);
      
      // Toggle details on header click
      headerContent.addEventListener('click', (e) => {
        e.preventDefault();
        const details = document.getElementById(`details-${job.id}`);
        if (details) {
          details.classList.toggle('hidden');
        }
      });
      
      // Assemble popup
      popupContent.appendChild(headerContent);
      popupContent.appendChild(budgetContent);
      popupContent.appendChild(detailsContent);
      
      // Create popup and marker
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setDOMContent(popupContent);
      
      const marker = new mapboxgl.Marker({ color: "#4338ca" })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);
      
      markerRefs.current[job.id] = marker;
    });
    
    // Fit map to markers if there are any
    if (Object.keys(markerRefs.current).length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      Object.values(markerRefs.current).forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [filteredJobs, mapLoaded, searchTerm]);
  
  return (
    <div className="h-[calc(100vh-200px)] w-full rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="h-full w-full" />
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
        coords[0] + (Math.random() - 0.5) * 0.002,
        coords[1] + (Math.random() - 0.5) * 0.002
      ];
    }
  }
  
  // Default to a random location in Iloilo City if no match
  const defaultCoord = [122.5642, 10.7202]; // Center of Iloilo City
  return [
    defaultCoord[0] + (Math.random() - 0.5) * 0.01,
    defaultCoord[1] + (Math.random() - 0.5) * 0.01
  ];
}
