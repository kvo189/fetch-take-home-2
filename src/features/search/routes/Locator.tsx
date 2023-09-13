import { Box, Button, Heading, Input, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Location, LocationSearchResult, searchLocation } from '..';
import { StatePicker } from '../components/StatePicker';
import { StateAbbreviation } from '../types/StateAbbreviation';
import { Layout } from '../components/Layout2';
import { useDebounce } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '@/context/LocationContext';

const Locator = () => {
  // Existing state variables
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<StateAbbreviation>('AL');
  const [cityInput, setCityInput] = useState<string>('');
  const [foundLocations, setFoundLocations] = useState<Location[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
  const [citySelected, setCitySelected] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedCityInput = useDebounce(cityInput, 500);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { locationData, setLocationData } = useLocationContext();


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
    if (cityInput.length >= 3) {
      setIsSearching(true);
      searchLocation({ city: cityInput, states: [selectedState], size: 1000 }).then((res: LocationSearchResult) => {
        const uniqueCities = Array.from(new Set(res.results.map((location) => location.city)));
        setFoundLocations(res.results);
        setSuggestedCities(uniqueCities);
        if (uniqueCities.length > 0) {
          setShowDropdown(true);
        }
        setIsSearching(false);
      });
    } else {
      setShowDropdown(false);
    }
  }, [debouncedCityInput, selectedState]);

  const selectCity = (city: string) => {
    console.log('selectCity', city);
    setShowDropdown(false);
    setCityInput(city);
    setCitySelected(city);
    const uniqueZipCodes = Array.from(new Set(foundLocations.filter((location) => location.city === city).map((location) => location.zip_code)));
    setZipCodes(uniqueZipCodes);
    
    setLocationData({
      ...locationData,
      city,
      state: selectedState,
      zipCodes,
    });
  };

  return (
    <Layout title='Locator' heading='Select a state and zip code'>
      <Box className='w-full flex flex-col items-center mx-auto gap-3 max-w-2xl'>
        <StatePicker selectedState={selectedState} onStateChange={(newState) => setSelectedState(newState)} />
        <Box className='relative w-full bg-white rounded-lg'>
          <Input
            type='text'
            placeholder='Enter a city'
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onFocus={() => {
              if (suggestedCities.length > 0) {
                setShowDropdown(true);
              }
            }}
            className='w-full rounded-lg p-2 '
          />

          {showDropdown && suggestedCities.length > 0 && (
            <Box className='absolute z-50 border rounded max-h-52 overflow-y-auto cursor-pointer w-full bg-white' ref={dropdownRef}>
              <UnorderedList styleType={'none'} margin={0} className='list-none m-0' tabIndex={0}>
                {suggestedCities.map((city) => (
                  <ListItem key={city} onClick={() => selectCity(city)} className='py-1 hover:bg-gray-200 px-4' tabIndex={0}>
                    {city}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}
        </Box>

        {zipCodes.length > 0 && (
          <Text mt={2} className='mt-5 text-lg'>
            You have selected{' '}
            <span className='font-semibold'>
              {citySelected}, {selectedState}
            </span>
          </Text>
        )}

        <Text className='my-3'>{zipCodes.join(', ')}</Text>

        <Button bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} isDisabled={zipCodes.length === 0} onClick={() => navigate('./location')}>
          Continue
        </Button>
      </Box>
    </Layout>
  );
};

export default Locator;
