import { Box, Button, Heading, Input, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Coordinates, GeoBoundingBox, Location, LocationSearchResult, getLocationsByZIPCodes, searchLocation } from '..';
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

const Locator = () => {
  // Existing state variables
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<StateAbbreviation>('AL');
  const [searchInput, setSearchInput] = useState<string>('');
  const [foundLocations, setFoundLocations] = useState<Location[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
  const [citySelected, setCitySelected] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { locationData, setLocationData } = useLocationContext();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  // const [zipCodeInput, setZipCodeInput] = useState<string>('');
  // const [map, setMap] = useState<Map | null>(null);
  // const [center, setCenter] = useState<LatLngLiteral>({ lat: 40.7128, lng: -74.006 }); // Default to New York City
  // const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [mapInfo, setMapInfo] = useState<{ center: Coordinates | null; bounds: GeoBoundingBox | null }>({
    center: null,
    bounds: null,
  });

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    setIsSearching(true);
    // if cityInput starts with a number, it's probably a zip code
    if (containsOnlyDigits(searchInput)) {
      const zipCodesArray = getSuggestedZipCodes(searchInput);
      if (!zipCodesArray.length) {
        return setIsSearching(false);
      }
      getLocationsByZIPCodes(zipCodesArray).then((res: Location[]) => {
        console.log('LocationsByZIPCodes', res);
        setFoundLocations(res);
        setIsSearching(false);
      });
    } else {
      if (searchInput.length < 3 || (debouncedSearchInput === citySelected && showDropdown)) {
        setShowDropdown(false);
        return;
      }
      searchLocation({
        city: searchInput,
        states: [selectedState],
        size: 1000,
      }).then((res: LocationSearchResult) => {
        const uniqueCities = Array.from(new Set(res.results.map((location) => location.city)));
        setFoundLocations(res.results);
        setSuggestedCities(uniqueCities);
        if (uniqueCities.length > 0) {
          setShowDropdown(true);
        }
        setIsSearching(false);
      });
    }
  }, [debouncedSearchInput, selectedState]);

  const selectCity = (city: string) => {
    setSearchInput(city);
    setCitySelected(city);
    const uniqueZipCodes = Array.from(
      new Set(foundLocations.filter((location) => location.city === city).map((location) => location.zip_code))
    );
    setZipCodes(uniqueZipCodes);
    const selectedLocation = foundLocations.find((location) => location.city === city && location.state === selectedState);
    setSelectedLocation(selectedLocation || null);

    setLocationData({
      ...locationData,
      city,
      state: selectedState,
      zipCodes: uniqueZipCodes,
      // center: findCenterPoint
    });
  };

  useEffect(() => {
    if (selectedLocation) {
      const boundingBox = getBoundingBox(
        { lat: selectedLocation.latitude, lon: selectedLocation.longitude },
        100 // 100 miles
      );

      searchLocation({ geoBoundingBox: boundingBox }).then((res: LocationSearchResult) => {
        // Do something with the results
        console.log('New Locations:', res);
      });
    }
  }, [selectedLocation]);

  // useEffect(() => {
  //   const zipCodesArray = getSuggestedZipCodes(zipCodeInput);
  //   console.log(zipCodesArray);
  //   if (!zipCodesArray?.length || zipCodesArray.length > 100) return;
  //   // Fetch locations for these ZIP codes
  //   getLocationsByZIPCodes(zipCodesArray)
  //     .then((res: Location[]) => {
  //       console.log('getLocationsByZIPCodes', res);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching locations:', error);
  //     });
  // }, [zipCodeInput]);

  const handleMapChange = (newCenter: LatLng, newBounds: LatLngBounds) => {
    console.log(`center: ${newCenter}`, 'bounds', newBounds);
    const center: Coordinates = { lat: newCenter.lat, lon: newCenter.lng };
    const bounds: GeoBoundingBox = {
      top_right: { lat: newBounds.getNorth(), lon: newBounds.getEast() },
      bottom_left: { lat: newBounds.getSouth(), lon: newBounds.getWest() },
    };
    console.log('converted bounds', bounds);
    setMapInfo({ center, bounds });
  };

  return (
    <>
      <Layout title='Locator' heading='Select a state and zip code'>
        <Box className='w-full flex flex-col items-center mx-auto gap-3 max-w-2xl'>
          <StatePicker selectedState={selectedState} onStateChange={(newState) => setSelectedState(newState)} />
          <Box className='relative w-full bg-white rounded-lg'>
            <Input
              type='text'
              placeholder='Enter a city'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (suggestedCities.length > 0) {
                  setShowDropdown(true);
                }
              }}
              className='w-full rounded-lg p-2 '
            />

            {showDropdown && suggestedCities.length > 0 && (
              <Box
                className='absolute z-[5000] border rounded max-h-52 overflow-y-auto cursor-pointer w-full bg-white'
                ref={dropdownRef}
              >
                <UnorderedList styleType={'none'} margin={0} className='list-none m-0' tabIndex={0}>
                  {suggestedCities.map((city) => (
                    <ListItem
                      key={city}
                      onClick={() => selectCity(city)}
                      className='py-1 hover:bg-gray-200 px-4'
                      tabIndex={0}
                    >
                      {city}
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
            )}
          </Box>
          {/* <Input
            type='text'
            className='w-full rounded-lg p-2'
            bg='white'
            onChange={(e) => setZipCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
          ></Input> */}

          {zipCodes.length > 0 && (
            <Text mt={2} className='mt-5 text-lg'>
              You have selected{' '}
              <span className='font-semibold'>
                {citySelected}, {selectedState}
              </span>
            </Text>
          )}

          {/* <Text className='my-3'>{zipCodes.join(', ')}</Text> */}

          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            isDisabled={zipCodes.length === 0}
            onClick={() => navigate('./dog')}
          >
            Continue
          </Button>
          <SearchMap
            locations={testLocations}
            maxDistanceInMiles={100}
            center={{ latitude: 33.569398, longitude: -86.782584 }}
            onMapChange={handleMapChange}
            // ref={setMap}
            // onBoundsChange={onBoundsChange}
          ></SearchMap>
        </Box>
      </Layout>
    </>
  );
};

export default Locator;
