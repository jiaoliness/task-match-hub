
// Helper function to get coordinates based on location
export function getCoordinatesForAddress(address: any) {
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

// Mapbox access token
export const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHh4aDI1amYwNGo0MmtvNzZuajQwbm9zIn0.u3HO34iH4h9XlJbbomlHSw";
