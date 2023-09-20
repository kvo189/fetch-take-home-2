import { Coordinates, BottomLeftTopRight } from '..';

export function getBoundingBox(center: Coordinates, distanceInMiles: number): BottomLeftTopRight {
    const earthRadiusInMiles = 3958.8;
  
    // Calculate lat and lon changes for the given distance
    const deltaLat = distanceInMiles / earthRadiusInMiles * (180 / Math.PI);
    const deltaLon = distanceInMiles / (earthRadiusInMiles * Math.cos((Math.PI * center.lat) / 180)) * (180 / Math.PI);
  
    // Create bounding box corners
    const top_right = { lat: center.lat + deltaLat, lon: center.lon + deltaLon };
    const bottom_left = { lat: center.lat - deltaLat, lon: center.lon - deltaLon };
  
    return { top_right, bottom_left };
  }
