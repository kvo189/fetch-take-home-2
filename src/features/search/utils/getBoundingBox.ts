import { Coordinates, BoundingBox } from '..';

export function getBoundingBox(center: Coordinates, distanceInMiles: number): BoundingBox {
    const earthRadiusInMiles = 3958.8;

    // Calculate lat and lon changes for the given distance
    const deltaLat = distanceInMiles / earthRadiusInMiles * (180 / Math.PI);
    const deltaLon = distanceInMiles / (earthRadiusInMiles * Math.cos((Math.PI * center.lat) / 180)) * (180 / Math.PI);

    // Create bounding box
    const top = { lat: center.lat + deltaLat, lon: center.lon };
    const left = { lat: center.lat, lon: center.lon - deltaLon };
    const bottom = { lat: center.lat - deltaLat, lon: center.lon };
    const right = { lat: center.lat, lon: center.lon + deltaLon };

    return { top, left, bottom, right };
}

// Example usage
// const center: Coordinates = { lat: 40.7128, lon: -74.0060 };
// const distanceInMiles = 10;

// const boundingBox = getBoundingBox(center, distanceInMiles);
// console.log(boundingBox);
