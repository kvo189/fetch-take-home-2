import { useState, useEffect } from 'react';
import { Input, Select, Button, Box, SimpleGrid, Center, VStack, Text } from '@chakra-ui/react';
import { Dog, DogSearchQuery } from '../types';
import { getDogSearchResults, getDogBreeds, searchLocation, getDogsByIds } from '..';
import { useLocationContext } from '@/context/LocationContext';

export const Layout = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<DogSearchQuery>({
    breeds: undefined,
    ageMin: undefined,
    ageMax: undefined,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statesFilter, setStatesFilter] = useState('');
  
  const { locationData } = useLocationContext();

  const fetchData = async () => {
    try {
      const response = await getDogSearchResults({
        ...filters,
        size: pagination.pageSize,
        from: (pagination.currentPage - 1) * pagination.pageSize,
        sort: `breed:${sorting}`,
      });
      const resultIds = response.resultIds; // Fetch details of the dogs by their IDs
      const dogsResponse = await getDogsByIds(resultIds);
      setDogs(dogsResponse);
      console.log('getDogSearchResults response:', response);
    } catch (error) {
      console.error('Error fetching dog data:', error);
    }

    try {
      // Perform location search
      const locationSearchQuery = {
        city: cityFilter,
        states: statesFilter ? [statesFilter] : undefined,
        // Add other filters as needed
      };
      const locationResponse = await searchLocation(locationSearchQuery);
      console.log('Location search response:', locationResponse);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleSearch = async () => {
    // Trigger dog search when the search button is clicked
    fetchData();
  };

  // Fetch dog breeds when the component mounts
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await getDogBreeds();
        setBreeds(response);
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    console.log('Search Layout mounted');
    const { city, state, zipCodes } = locationData;
    setCityFilter(city);
    setStatesFilter(state);
    setFilters({ ...filters, zipCodes });
    if (city || state || zipCodes.length) { 
      fetchData();
    }
    console.log({ city, state, zipCodes });
  }, []);

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Input placeholder='Search by breed' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Input
          placeholder='Min Age'
          type='number'
          value={filters.ageMin || ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              ageMin: parseInt(e.target.value, 10) || undefined,
            })
          }
        />
        <Input
          placeholder='Max Age'
          type='number'
          value={filters.ageMax || ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              ageMax: parseInt(e.target.value, 10) || undefined,
            })
          }
        />
        <Input placeholder='City' value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
        <Input placeholder='State' value={statesFilter} onChange={(e) => setStatesFilter(e.target.value)} />
        <Input
          maxLength={5}
          placeholder='Zip Codes (comma-separated)'
          value={filters.zipCodes || ''}
          onChange={(e) => setFilters({ ...filters, zipCodes: e.target.value.split(',') })}
        />
        <Select
          placeholder='All breeds'
          value={filters.breeds && filters.breeds[0] ? filters.breeds[0] : ''}
          onChange={(e) => {
            const selectedValue = e.target.value;
            console.log('Selected value:', selectedValue);
            setFilters({ ...filters, breeds: [e.target.value] });
          }}
        >
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </Select>
        <Select value={sorting} onChange={(e) => setSorting(e.target.value)}>
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </VStack>

      <SimpleGrid columns={3} spacing={4}>
        {dogs.map((dog) => (
          <Box key={dog.id} borderWidth='1px' borderRadius='lg' p={4} boxShadow='base'>
            <Center>
              <img src={dog.img} alt={dog.name} width='100' height='100' />
            </Center>
            <Text>{dog.name}</Text>
            <Text>{dog.breed}</Text>
            <Text>{dog.age} years old</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
