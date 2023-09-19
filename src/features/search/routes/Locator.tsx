import { Box, Button, Heading, Input, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import {
  Coordinates,
  GeoBoundingBox,
  Location,
  LocationSearchQuery,
  LocationSearchResult,
  getLocationsByZIPCodes,
  searchLocation,
} from '..';
import { StatePicker } from '../components/StatePicker';
import { StateAbbreviation } from '../types/StateAbbreviation';
import { Layout } from '../components/Layout2';
import { useDebounce } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '@/context/LocationContext';
import SearchMap from '../components/SearchMap';
import { testLocations } from '../utils/testLocations';
import { LatLng, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral, Map } from 'leaflet';
import { findCenterPoint } from '../utils/findCenterPoint';
import { containsOnlyDigits } from '../utils/containsOnlyDigits';
import { getSuggestedZipCodes } from '../utils/getSuggestedZipcodes';
import { getBoundingBox } from '../utils/getBoundingBox';
import { findClosestZipCode } from '../utils/findClosestZipCode';
import { MapContainer, Marker, Popup, Rectangle, TileLayer } from 'react-leaflet';
import { DistancePicker } from '../components/DistancePicker';
import { InputSuggestionsDropdown } from '../components/InputSuggestionsDropdown';

// Handle click outside dropdown logic
const useHandleClickOutside = (ref: any, handler: Function) => {
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};

const Locator = () => {
  // Existing state variables
  const [selectedState, setSelectedState] = useState<StateAbbreviation>('AL');
  const [searchInput, setSearchInput] = useState<string>('');
  const [foundLocations, setFoundLocations] = useState<Location[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { locationData, setLocationData } = useLocationContext();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<Map | null>(null); // Get leaflet map instance
  const [searchDistance, setSearchDistance] = useState<number>(25); // Search distance in miles

  useHandleClickOutside(dropdownRef, () => setShowDropdown(false));

  useEffect(() => {
    setIsSearching(true);
    if (containsOnlyDigits(searchInput)) {
      handleZipCodesSearch(); // Handle ZIP codes
    } else {
      handleCitySearch(); // Handle city names
    }
  }, [debouncedSearchInput, selectedState]);

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

  const handleCitySearch = () => {
    if (searchInput.length < 3 || debouncedSearchInput === selectedLocation?.city) {
      setShowDropdown(false);
      return;
    }
    searchLocation({
      city: searchInput,
      states: [selectedState],
      size: 10000,
    }).then((res) => {
      const uniqueCities = Array.from(new Set(res.results.map((location) => location.city)));
      setFoundLocations(res.results);
      setSuggestedCities(uniqueCities);
      if (uniqueCities.length > 0) setShowDropdown(true);
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

  useEffect(() => {
    if (selectedLocation) {
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
          boundingBox: boundingBox,
        });

        if (map) {
          map.fitBounds([
            [boundingBox.top_right.lat, boundingBox.top_right.lon],
            [boundingBox.bottom_left.lat, boundingBox.bottom_left.lon],
          ]);
        }
      });
    }
  }, [selectedLocation, searchDistance]);

  return (
    <>
      <Layout title='Locator' heading='Select a state and zip code'>
        <Box className='w-full flex flex-col items-center mx-auto gap-3 max-w-2xl'>
          <StatePicker selectedState={selectedState} onStateChange={(newState) => setSelectedState(newState)} />
          <DistancePicker
            selectedDistance={searchDistance}
            onDistanceChange={(newDist) => setSearchDistance(newDist)}
          ></DistancePicker>
          <Box className='relative w-full bg-white rounded-lg'>
            {/* Search input */}
            <Input
              type='text'
              placeholder='Enter a city or zip code'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (suggestedCities.length > 0) {
                  setShowDropdown(true);
                }
              }}
              className='w-full rounded-lg p-2 '
            />
            {/* Location Suggestions Dropdown */}
            <InputSuggestionsDropdown
              suggestions={
                containsOnlyDigits(searchInput)
                  ? foundLocations.map((loc) => {
                      return { key: loc.zip_code, value: loc, label: `${loc.zip_code} ${loc.city}, ${loc.state}` };
                    })
                  : suggestedCities.map((city) => {
                      return { key: city, value: city, label: city };
                    })
              }
              onSelect={(value) => {
                if (containsOnlyDigits(searchInput)) {
                  selectLocationByZIPCode(value);
                } else {
                  selectCity(value);
                }
              }}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          </Box>
          {/* Location prompt */}
          {locationData?.zipCodes && locationData?.zipCodes?.length > 0 && (
            <Text mt={2} className='mt-5 text-lg'>
              You have selected{' '}
              <span className='font-semibold'>
                {locationData?.city}, {selectedState}
              </span>
            </Text>
          )}
          {/* Continue button */}
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            isDisabled={!locationData?.zipCodes || locationData?.zipCodes.length === 0}
            onClick={() => navigate('./dog')}
          >
            Continue
          </Button>
          {/* Map */}
          {locationData?.center.lat} {locationData?.center.lon}
          <div className='w-full relative'>
            <MapContainer
              center={locationData?.center ? [locationData?.center.lat, locationData?.center.lon] : [33.456412, -86.801904]}
              zoom={10}
              whenReady={() => console.log('Map ready')}
              style={{ height: '400px', width: '100%' }}
              ref={setMap}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

              {locationData && (
                <>
                  <Marker position={[locationData.center.lat, locationData.center.lon]}>
                    <Popup>{`Locations to search: ${locationData?.locations?.length}`}</Popup>
                  </Marker>
                  <Rectangle
                    bounds={[
                      [locationData.boundingBox.top_right.lat, locationData.boundingBox.top_right.lon],
                      [locationData.boundingBox.bottom_left.lat, locationData.boundingBox.bottom_left.lon],
                    ]}
                  ></Rectangle>
                </>
              )}
            </MapContainer>
          </div>
        </Box>
      </Layout>
    </>
  );
};

export default Locator;
