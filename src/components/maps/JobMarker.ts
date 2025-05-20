
import mapboxgl from 'mapbox-gl';
import { Job } from '@/types';
import { getCoordinatesForAddress } from './MapUtils';
import { JobPopup } from './JobPopup';

export const createJobMarker = (job: Job, map: mapboxgl.Map): mapboxgl.Marker | null => {
  // Skip jobs without proper location data
  if (!job.address) return null;
  
  // Get coordinates from job address
  const coordinates = getCoordinatesForAddress(job.address);
  if (!coordinates) return null;

  // Create popup content using the JobPopup component
  const { createPopupElement } = JobPopup({ job, jobId: job.id });
  const popupContent = createPopupElement();
  
  // Create the popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setDOMContent(popupContent);
  
  // Create and return the marker
  return new mapboxgl.Marker({ color: "#4338ca" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
};

export const updateJobMarkers = (
  jobs: Job[],
  map: mapboxgl.Map,
  markerRefs: { [key: string]: mapboxgl.Marker }
): void => {
  // Clear all existing markers
  Object.values(markerRefs).forEach(marker => marker.remove());
  
  // Add markers for filtered jobs and store references
  jobs.forEach(job => {
    const marker = createJobMarker(job, map);
    if (marker) {
      markerRefs[job.id] = marker;
    }
  });
  
  // Fit map to markers if there are any
  if (Object.keys(markerRefs).length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    
    Object.values(markerRefs).forEach(marker => {
      bounds.extend(marker.getLngLat());
    });
    
    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  }
};
