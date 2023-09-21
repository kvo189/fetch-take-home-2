import { SelectedLocationSet, useLocationContext } from '@/features/search/contexts/LocationContext';
import { SetStateAction } from 'react';
import { StateAbbreviation } from '../types/StateAbbreviation';
import { Location, searchLocation } from '@/features/search';
import { getBoundingBox } from '../utils/getBoundingBox';
import { calculateDistance } from '../utils/calculateDistance';

function useLocationData() {
  const {
    locationData,
    setLocationData,
    searchDistance,
    setSearchDistance,
    selectedState,
    setSelectedState,
    selectedLocation,
    setSelectedLocation,
  } = useLocationContext();

  const updateSearchDistance = (newDistance: number) => {
    setSearchDistance(newDistance);
    if (!newDistance) {
      updateSelectedState(''); // reset selected state if no distance is selected
      return;
    }
    if (selectedLocation) {
      console.log({selectedLocation});
      updateSelectedLocationSetWithDistance(selectedLocation, newDistance);
    }
  };

  const updateSelectedState = (newState: StateAbbreviation) => {
    setSelectedState(newState);
    if (newState === '') {
      updateSelectedLocation(null); // reset location data if no state is selected
      updateSelectedLocationSet(null);
    }
    if (newState === '' && searchDistance) {
      setSearchDistance(0); // reset search distance if no state is selected
    }
  };

  const updateSelectedLocation = (newLocation: Location | null) => {
    if (selectedLocation === newLocation) return;
    setSelectedLocation(newLocation);

    if (!newLocation) {
      updateSelectedLocationSet(null);
      return ;
    }
    const effectiveSearchDistance = searchDistance || 10; // default search boundary to 10 miles
    if (!searchDistance) {
      updateSearchDistance(effectiveSearchDistance);
    }
    updateSelectedLocationSetWithDistance(newLocation, effectiveSearchDistance);
  };

  const updateSelectedLocationSetWithDistance = async (location: Location, distance: number) => {
    const boundingBox = getBoundingBox({ lat: location.latitude, lon: location.longitude }, distance);

    try {
      const res = await searchLocation({ geoBoundingBox: boundingBox, size: 10000 });
      const locationsWithDistance = res.results
        .map((targetLocation) => ({
          ...targetLocation,
          distanceFromSelected: calculateDistance(location, targetLocation),
        }))
        .filter((location) => location.distanceFromSelected <= distance);

        updateSelectedLocationSet({
        ...locationData,
        locations: locationsWithDistance,
        boundingBox: boundingBox,
      });
    } catch (error) {
      console.error('Error searching locations:', error);
      // Handle any other error logging or user feedback here
    }
  }

  const updateSelectedLocationSet = (newLocationSet: SelectedLocationSet | null) => {
    setLocationData(newLocationSet);
  };

  return {
    locationData,
    searchDistance,
    selectedState,
    updateSearchDistance,
    updateSelectedState,
    updateSelectedLocation
  };
}

export default useLocationData;
