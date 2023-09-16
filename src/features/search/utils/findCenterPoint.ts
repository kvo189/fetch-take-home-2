import { Location } from '..';

export const findCenterPoint = (locations: Location[]): { lat: number; lon: number } => {
    const totalLocations = locations.length;
    const latitude = locations.reduce((sum, loc) => sum + loc.latitude, 0) / totalLocations;
    const longitude = locations.reduce((sum, loc) => sum + loc.longitude, 0) / totalLocations;
    return { lat: latitude, lon: longitude };
};