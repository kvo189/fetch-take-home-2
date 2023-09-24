import { Location } from '../types'

export const isWithinDistance = (center: { latitude: number; longitude: number }, location: Location, maxDistanceInMiles: number): boolean => {
    const R = 3958.8; // Radius of the Earth in miles
    const lat1 = center.latitude * (Math.PI / 180);
    const lon1 = center.longitude * (Math.PI / 180);
    const lat2 = location.latitude * (Math.PI / 180);
    const lon2 = location.longitude * (Math.PI / 180);

    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;

    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance <= maxDistanceInMiles;
};
