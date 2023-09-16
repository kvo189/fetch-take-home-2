// Function to calculate the bounding box given the central point and radius (in km)
export function calculateBoundingBox(latitude: number, longitude: number, radius: number): { top: number, left: number, bottom: number, right: number } {
    const earthRadius = 6371; // Earth radius in km
    
    // Calculate latitude and longitude deltas
    const deltaLat = (radius / earthRadius) * (180 / Math.PI);
    const deltaLon = (radius / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    
    return {
      top: latitude + deltaLat,
      bottom: latitude - deltaLat,
      left: longitude - deltaLon,
      right: longitude + deltaLon,
    };
  }
  