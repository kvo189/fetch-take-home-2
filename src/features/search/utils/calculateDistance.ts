import { Location } from '..';

export const toRadians = (degrees: number): number => {
    return (degrees * Math.PI) / 180;
};

export const calculateDistance = (
    selectedLocation: Location,
    targetLocation: Location
): number => {
    const earthRadiusM = 3958.8;// Radius of the Earth in miles
    const lat1 = toRadians(selectedLocation.latitude);
    const lon1 = toRadians(selectedLocation.longitude);
    const lat2 = toRadians(targetLocation.latitude);
    const lon2 = toRadians(targetLocation.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusM * c;
};