import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Box } from '@chakra-ui/react';
import InputSuggestionsDropdown from '../components/InputSuggestionsDropdown';
import { Location, getLocationsByZIPCodes, searchLocation } from '..'; // Replace with the actual import path for Location type
import { containsOnlyDigits } from '../utils/containsOnlyDigits';
import { getSuggestedZipCodes } from '../utils/getSuggestedZipcodes';
import { useDebounce } from '@uidotdev/usehooks';
import { findClosestZipCode } from '../utils/findClosestZipCode';
import { findCenterPoint } from '../utils/findCenterPoint';
import { getBoundingBox } from '../utils/getBoundingBox';
import { isStateAbbreviation } from '../utils/isStateAbbreviation';
import { useLocationContext } from '@/context/LocationContext';
import { useIsMount } from '@/hooks/useIsMount';
import { calculateDistance } from '../utils/calculateDistance';

type CityStatePair = { cityName: string; state: string };

type LocationSearchInputProps = {
  className?: string;
};

const LocationSearchInput = ({ className }: LocationSearchInputProps) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [foundLocations, setFoundLocations] = useState<Location[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<CityStatePair[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const {
    locationData,
    setLocationData,
    selectedLocation,
    setSelectedLocation,
    searchDistance,
    setSearchDistance,
    selectedState,
    setSelectedState,
  } = useLocationContext();
  const [shouldHideDropdown, setShouldHideDropdown] = useState<boolean>(false);
  const isMount = useIsMount();

  useEffect(() => {
    if (locationData?.city) {
      setSearchInput(locationData.city);
      setShouldHideDropdown(true);
    }
  }, [locationData]);

  useEffect(() => {
    if (shouldHideDropdown) return setShouldHideDropdown(false);
    if (containsOnlyDigits(searchInput)) {
      handleZipCodesSearch(); // Handle ZIP code input
    } else {
      handleCitySearch(); // Handle city name input
    }
  }, [debouncedSearchInput]);

  useEffect(() => {
    if (searchDistance == 0) {
      return;
    }

    if (selectedLocation && !isMount) {
      const boundingBox = getBoundingBox(
        { lat: selectedLocation.latitude, lon: selectedLocation.longitude },
        searchDistance
      );
      searchLocation({ geoBoundingBox: boundingBox, size: 10000 }).then((res) => {
        const locationsWithDistance = res.results
          .map((targetLocation) => ({
            ...targetLocation,
            distanceFromSelected: calculateDistance(selectedLocation, targetLocation),
          }))
          .filter((location) => location.distanceFromSelected <= searchDistance);
        setLocationData({
          ...locationData,
          city: selectedLocation.city,
          state: selectedState,
          locations: locationsWithDistance,
          zipCodes: Array.from(new Set(locationsWithDistance.map((location) => location.zip_code))),
          center: { lat: selectedLocation.latitude, lon: selectedLocation.longitude },
          boundingBox: boundingBox,
        });
      });
    }
  }, [selectedLocation, searchDistance]);

  useEffect(() => {
    if (isMount) return; // ignore effect on initial render
    setSearchInput('');
    // Clear other related states
    setFoundLocations([]);
    setSuggestedCities([]);
    setShowDropdown(false);
    // setSelectedLocation(null);
  }, [selectedState]);

  const handleCitySearch = () => {
    if (
      searchInput.length < 3 ||
      (debouncedSearchInput === selectedLocation?.city && selectedState === selectedLocation?.state)
    ) {
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    searchLocation({
      city: searchInput,
      states: selectedState ? [selectedState] : undefined,
      size: 100,
    }).then((res) => {
      const uniqueCitiesSet = new Set<string>();

      // Create a set with unique stringified city-state combinations
      res.results.forEach((location: Location) => {
        uniqueCitiesSet.add(JSON.stringify({ cityName: location.city, state: location.state }));
      });
      // Convert set back to an array of objects
      const uniqueCities: CityStatePair[] = Array.from(uniqueCitiesSet).map((item: string) => JSON.parse(item));
      setFoundLocations(res.results);
      setSuggestedCities(uniqueCities);
      if (uniqueCities.length > 0) setShowDropdown(true);
      setIsSearching(false);
    });
  };

  const handleZipCodesSearch = () => {
    const zipCodesArray = getSuggestedZipCodes(searchInput);
    if (!zipCodesArray.length) return;
    if (debouncedSearchInput === selectedLocation?.zip_code) return;
    setIsSearching(true);
    getLocationsByZIPCodes(zipCodesArray).then((res) => {
      const filteredLocations = res.filter((location) => location !== null);
      setFoundLocations(filteredLocations);
      if (filteredLocations.length > 0) setShowDropdown(true);
      setIsSearching(false);
    });
  };

  const selectCity = (city: CityStatePair) => {
    setSearchInput(city.cityName);
    const foundLocationsByCity = foundLocations.filter(
      (location) => location.city === city.cityName && location.state === city.state
    );
    setSelectedLocation(findClosestZipCode(findCenterPoint(foundLocationsByCity), foundLocationsByCity));
  };

  const selectLocationByZIPCode = (location: Location) => {
    setSearchInput(location.zip_code);
    setSelectedLocation(location);
  };

  const memoizedFoundLocations = useMemo(
    () =>
      foundLocations.map((loc) => ({ key: loc.zip_code, value: loc, label: `${loc.zip_code} ${loc.city}, ${loc.state}` })),
    [foundLocations]
  );

  const memoizedSuggestedCities = useMemo(
    () =>
      suggestedCities.map((city) => ({
        key: city.cityName + city.state,
        value: city,
        label: `${city.cityName}, ${city.state}`,
      })),
    [suggestedCities]
  );

  const suggestions = containsOnlyDigits(searchInput) ? memoizedFoundLocations : memoizedSuggestedCities;

  const onSelect = useCallback(
    (value: Location | CityStatePair) => {
      if (!searchDistance) {
        setSearchDistance(10);
      }
      if (selectedState !== value.state && isStateAbbreviation(value.state)) {
        setSelectedState(value.state);
      }
      if (containsOnlyDigits(searchInput)) {
        selectLocationByZIPCode(value as Location);
      } else {
        selectCity(value as CityStatePair);
      }
    },
    [containsOnlyDigits, searchInput, selectLocationByZIPCode, selectCity, searchDistance]
  );

  return (
    <Box className={`${className} relative rounded-lg`}>
      <label className='font-semibold' htmlFor='input-location-search'>
        City or zip code
      </label>
      <Input
        id='input-location-search'
        type='text'
        placeholder='Enter a city or zip code'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onFocus={() => {
          if (foundLocations.length > 0) {
            setShowDropdown(true);
          }
        }}
        className='w-full rounded-lg p-2'
        bg={'white'}
        // disabled={isSearching || searchDistance == 0 || selectedState === ''}
      />
      {/* Location Suggestions Dropdown */}
      <InputSuggestionsDropdown
        suggestions={suggestions}
        onSelect={onSelect}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />
    </Box>
  );
};

export default LocationSearchInput;
