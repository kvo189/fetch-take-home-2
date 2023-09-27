import { useQuery } from 'react-query';
import { Location, searchLocations } from '..';
import { getBoundingBox } from '../utils/getBoundingBox';
import { calculateDistance } from '../utils/calculateDistance';
import { LocationArea } from '@/features/search/stores/locationStore';

export interface SearchAreaParams {
  location: Location | null;
  distance: number;
}

export const useLocationsWithinDistance = (params: SearchAreaParams | null) => {
  const { location, distance } = params || {};

  const queryKey = [
    'locationsWithinDistance',
    JSON.stringify(location),
    distance,
  ];

  return useQuery(queryKey, async () => {
    if (!location || !distance) return null;

    const boundingBox = getBoundingBox({
      lat: location.latitude,
      lon: location.longitude,
    }, distance);

    try {
      const locations = await searchLocations({
        geoBoundingBox: boundingBox,
        states: [location.state],
        size: 120,
      });

      const locationsWithDistance = locations
        .map((targetLocation) => ({
          ...targetLocation,
          distanceFromSelected: calculateDistance(location, targetLocation),
        }))
        .filter((location) => location.distanceFromSelected <= distance);

      return {
        locations: locationsWithDistance,
        boundingBox: boundingBox,
      } as LocationArea;
    } catch (error) {
      console.error("Error in useLocationsWithinDistance", error);
      throw error;
    }
  }, {
    enabled: !!location && !!distance,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
