
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
    job.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-97.7431, 30.2672], // Centered on USA
        zoom: 3
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
      if (!job.address || !job.address.street) return;
      
      // Normally we would geocode the address, but for this example
      // we'll use predefined coordinates based on state
      const coordinates = getCoordinatesForLocation(job.address);
      
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
      budgetContent.textContent = `$${job.budget}`;
      
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
// In a real app, you would use a geocoding service
function getCoordinatesForLocation(address: Job['address']) {
  if (!address) return null;
  
  // This is a simplified mapping for demonstration purposes
  // In a real app, you would use geocoding to get precise coordinates
  const stateCoordinates: Record<string, [number, number]> = {
    'Texas': [-97.7431, 30.2672],
    'California': [-118.2437, 34.0522],
    'New York': [-74.0060, 40.7128],
    'Illinois': [-87.6298, 41.8781],
    'Colorado': [-104.9903, 39.7392],
    'Oregon': [-122.6784, 45.5152],
    'Florida': [-80.1918, 25.7617],
    'Arizona': [-112.0740, 33.4484],
    'Washington': [-122.3321, 47.6062],
    'Nevada': [-115.1398, 36.1699],
  };
  
  // Add some randomness to prevent markers from overlapping
  const randomizeCoordsSlightly = (coords: [number, number]): [number, number] => {
    return [
      coords[0] + (Math.random() - 0.5) * 0.05,
      coords[1] + (Math.random() - 0.5) * 0.05
    ];
  };
  
  if (address.state && stateCoordinates[address.state]) {
    return randomizeCoordsSlightly(stateCoordinates[address.state]);
  }
  
  // Default to center of USA
  return [-97.7431, 30.2672];
}
