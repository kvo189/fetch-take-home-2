import { haversineDistance } from '@/utils/haversineDistance';
import { Location } from '@/features/search/';

export function findLocationClosestToCenter(locations: Location[]): Location {
    const totalLocations = locations.length;
    const centerLatitude = locations.reduce((sum, loc) => sum + loc.latitude, 0) / totalLocations;
    const centerLongitude = locations.reduce((sum, loc) => sum + loc.longitude, 0) / totalLocations;

    return locations.reduce((closestLocation, location) => {
        const distanceToCenter = haversineDistance(centerLatitude, centerLongitude, location.latitude, location.longitude);
        const distanceToClosest = haversineDistance(centerLatitude, centerLongitude, closestLocation.latitude, closestLocation.longitude);

        return distanceToCenter < distanceToClosest ? location : closestLocation;
    }, locations[0]);
}
