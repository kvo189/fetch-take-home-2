import { useState, useEffect, useCallback } from 'react';
import { Input, Select, Button, Box, SimpleGrid, Center, VStack, Text } from '@chakra-ui/react';
import { Dog, DogSearchQuery } from '../types/types';
import { getDogSearchResults, getDogBreeds, searchLocation, getDogsByIds } from '..';
import { useLocationContext } from '@/context/LocationContext';

export const Layout = () => {

  const initialState = { breeds: [], ageMin: undefined, ageMax: undefined, zipCodes: [] };
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<DogSearchQuery>(initialState);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<'asc' | 'desc'>('asc');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [statesFilter, setStatesFilter] = useState<string>('');
  const [searchCount, setSearchCount] = useState<number>(0);

  const { locationData } = useLocationContext();

  const handleSearch = async () => {
    // Trigger dog search when the search button is clicked
    fetchData();
  };

  const fetchData = useCallback(async () => {
    if (searchCount > 10 ) return;
    try {
      const searchParams = {
        ...filters,
        sort: `breed:${sorting}`,
      };
      console.log('search params', searchParams)
      const dogsSearchResponse = await getDogSearchResults(searchParams);
      const dogsResponse = await getDogsByIds(dogsSearchResponse.resultIds);
      setDogs(dogsResponse);
      setSearchCount(searchCount + 1)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [filters, sorting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: keyof DogSearchQuery) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    updateFilters({ [key]: value });
  };

  const updateFilters = useCallback((newFilters: DogSearchQuery) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  useEffect(() => {
    if (!locationData) return;
    const { city, state, zipCodes } = locationData;
    // Update local states
    setCityFilter(city);
    setStatesFilter(state);
    // Update filters (asynchronous operation)
    updateFilters({ zipCodes });
  }, [locationData, updateFilters]);

  useEffect(() => {
    // Any logic that needs to be run when filters are updated
    // can be put here, including fetchData.
    if (filters.zipCodes?.length) {
      fetchData();
    }
  }, [filters, fetchData]);


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

  return (
    <Box id='search-layout' p={4}>
      <h1 className='text-lg mb-6'>Search count: {searchCount}</h1>
      <VStack spacing={4}>
        <Input placeholder="Search by breed" value={searchQuery} onChange={e => handleInputChange(e, 'breeds')} />
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
        <Select value={sorting} onChange={(e) => setSorting(e.target.value as 'asc' | 'desc')}>
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
