import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Box } from '@chakra-ui/react';
import InputSuggestionsDropdown from '../components/InputSuggestionsDropdown';
import { Location, getLocationsByZIPCodes, searchLocation } from '..'; // Replace with the actual import path for Location type
import { StateAbbreviation } from '../types/StateAbbreviation';
import { containsOnlyDigits } from '../utils/containsOnlyDigits';
import { getSuggestedZipCodes } from '../utils/getSuggestedZipcodes';
import { useDebounce } from '@uidotdev/usehooks';
import { findClosestZipCode } from '../utils/findClosestZipCode';
import { findCenterPoint } from '../utils/findCenterPoint';
import { getBoundingBox } from '../utils/getBoundingBox';
import { useLocationContext } from '@/context/LocationContext';
import { useIsMount } from '@/hooks/useIsMount';

type LocationSearchInputProps = {
  selectedState: StateAbbreviation;
  searchDistance: number;
  className?: string;
};

const LocationSearchInput = ({ selectedState, searchDistance, className }: LocationSearchInputProps) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [foundLocations, setFoundLocations] = useState<any[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { locationData, setLocationData } = useLocationContext();
  const { selectedLocation, setSelectedLocation } = useLocationContext();
  const [shouldHideDropdown, setShouldHideDropdown] = useState<boolean>(false);
  const isMount = useIsMount();

  console.log('search dist', searchDistance)

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
      setLocationData(undefined);
      setSelectedLocation(null);
      setSearchInput('');
      return;
    }

    if (selectedLocation && !isMount) {
      const boundingBox = getBoundingBox(
        { lat: selectedLocation.latitude, lon: selectedLocation.longitude },
        searchDistance
      );
      searchLocation({ geoBoundingBox: boundingBox, size: 10000 }).then((res) => {
        setLocationData({
          ...locationData,
          city: selectedLocation.city,
          state: selectedState,
          locations: res.results,
          zipCodes: Array.from(new Set(res.results.map((location) => location.zip_code))),
          center: { lat: selectedLocation.latitude, lon: selectedLocation.longitude },
          searchDistance: searchDistance,
          boundingBox: boundingBox,
        });
      });
    }
  }, [selectedLocation, searchDistance]);

  useEffect(() => {
    console.log('selected state', selectedState, isMount, locationData)
    if (isMount) return; // ignore effect on initial render
    console.log(locationData)
    setSearchInput('');
    // Clear other related states
    setFoundLocations([]);
    setSuggestedCities([]);
    setShowDropdown(false);
    setSelectedLocation(null);
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
      states: [selectedState],
      size: 100,
    }).then((res) => {
      const uniqueCities = Array.from(new Set(res.results.map((location) => location.city)));
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

  const selectCity = (city: string) => {
    setSearchInput(city);
    const foundLocationsByCity = foundLocations.filter((location) => location.city === city);
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
    () => suggestedCities.map((city) => ({ key: city, value: city, label: city })),
    [suggestedCities]
  );

  const suggestions = containsOnlyDigits(searchInput) ? memoizedFoundLocations : memoizedSuggestedCities;

  const onSelect = useCallback(
    (value: any) => {
      if (containsOnlyDigits(searchInput)) {
        selectLocationByZIPCode(value);
      } else {
        selectCity(value);
      }
    },
    [containsOnlyDigits, searchInput, selectLocationByZIPCode, selectCity]
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
      {/* searching? {isSearching.toString()}  d {searchDistance} s {selectedState} */}
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
