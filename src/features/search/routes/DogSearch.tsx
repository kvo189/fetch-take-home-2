import { Layout } from '../components/Layout';
import { useState, useEffect, useCallback } from 'react';
import { Select, Button, Box, SimpleGrid, Center, VStack, Text, Image, AspectRatio, filter } from '@chakra-ui/react';
import { Dog, DogSearchQuery } from '../types/types';
import { getDogSearchResults, getDogBreeds, getDogsByIds } from '..';
import { useLocationContext } from '@/context/LocationContext';
import Slider from '../components/Slider';
import { StatePicker } from '../components/StatePicker';
import { StateAbbreviation } from '../types/StateAbbreviation';
import { DistancePicker } from '../components/DistancePicker';
import LocationSearchInput from '../components/LocationSearchInput';
import { SearchDrawer } from '../components/SearchDrawer';

interface FilterProps {
  searchCount: number;
  selectedState: StateAbbreviation;
  setSelectedState: React.Dispatch<React.SetStateAction<StateAbbreviation>>;
  searchDistance: number;
  setSearchDistance: React.Dispatch<React.SetStateAction<number>>;
  filters: DogSearchQuery;
  setFilters: React.Dispatch<React.SetStateAction<DogSearchQuery>>;
  breeds: string[];
  sorting: 'asc' | 'desc';
  setSorting: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  handleSliderChange: (value: number[]) => void;
  handleSearch: () => void;
}

export const DogSearch = () => {
  const [selectedState, setSelectedState] = useState<StateAbbreviation>('AL');
  const [searchDistance, setSearchDistance] = useState<number>(10); // Search distance in miles
  const { locationData, setLocationData } = useLocationContext();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<DogSearchQuery>({ breeds: [], ageMin: undefined, ageMax: undefined, zipCodes: [] });
  const [currentPage, setCurrentPage] = useState<number>(0); // Pagination
  const [pagination, setPagination] = useState({
    currentPageResults: 0,
    pageSize: 25,
    totalPage: 0,
    total: 0,
  });
  const [sorting, setSorting] = useState<'asc' | 'desc'>('asc');
  const [searchCount, setSearchCount] = useState<number>(0);

  const handleSearch = async () => {
    fetchData(); // Trigger dog search when the search button is clicked
  };

  const fetchData = useCallback(async () => {
    // if (searchCount > 10) return;
    try {
      const searchParams: DogSearchQuery = {
        ...filters,
        breeds: filters.breeds?.filter((breed) => breed !== '') || undefined,
        zipCodes: filters.zipCodes?.filter((zip) => zip !== '') || undefined,
        sort: `breed:${sorting}`,
        from: currentPage * pagination.pageSize,
        size: pagination.pageSize,
      };
      console.log('search params', searchParams);

      const dogsSearchResponse = await getDogSearchResults(searchParams);
      const dogsResponse = await getDogsByIds(dogsSearchResponse.resultIds);
      setDogs(dogsResponse);
      setSearchCount(searchCount + 1);
      setPagination({
        ...pagination,
        currentPageResults: dogsSearchResponse.resultIds.length,
        total: dogsSearchResponse.total,
        totalPage: Math.ceil(dogsSearchResponse.total / pagination.pageSize),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [filters, sorting, currentPage]);

  const updateFilters = useCallback((newFilters: DogSearchQuery) => {
    console.log('updating filters')
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }, []);

  useEffect(() => {
    const newFilters = {
      ...filters,
      zipCodes: locationData?.zipCodes,
    };
    console.log(newFilters);
    setCurrentPage(0); // Reset pagination
    updateFilters(newFilters); // Update filters (asynchronous operation)
  }, [locationData, updateFilters, filters.breeds, filters.ageMin, filters.ageMax, sorting]);

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

    if (locationData) {
      setSelectedState(locationData.state);
      setSearchDistance(locationData.searchDistance);
      fetchData();
    }
  }, []);

  const handleSliderChange = (value: number[]) => {
    updateFilters({ ageMin: value[0], ageMax: value[1] });
  };

  const filterProps: FilterProps = {
    searchCount,
    selectedState,
    setSelectedState,
    searchDistance,
    setSearchDistance,
    filters,
    setFilters,
    breeds,
    sorting,
    setSorting,
    handleSliderChange,
    handleSearch,
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);


  const handlePrevPage = () => {
    if (currentPage <= 0 ) return;
    setCurrentPage(currentPage - 1);
  }

  const handleNextPage = () => {
    if (currentPage === pagination.totalPage) return;
    setCurrentPage(currentPage + 1);
  }

  return (
    <Box id='div-dog-search-container' className='w-full flex flex-col lg:flex-row mx-auto gap-3 p-4'>
      <SearchDrawer
        header='Search filters'
        drawerText='Filter search'
        Body={<FiltersContent filterProps={filterProps} />}
        Footer={<FiltersContentFooter filterProps={filterProps} />}
      ></SearchDrawer>

      <div className='flex flex-col w-full gap-4'>
        {(pagination.total && (
          <div className='flex justify-between items-center w-100'>
            <div className=''>
              Showing {currentPage + 1} - {pagination.currentPageResults} of {pagination.total}{' '}
              available dogs
            </div>
            <div className='flex gap-4'>
              <Button onClick={handlePrevPage}>Prev</Button>
              <Select placeholder={`${currentPage + 1}/${pagination.totalPage}`}>
                <option value='option1'>Option 1</option>
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
              </Select>
              <Button onClick={handleNextPage}>Next</Button>
            </div>
          </div>
        )) ||
          ''}
        <SimpleGrid minChildWidth='200px' width={'100%'} spacing={6}>
          {dogs.map((dog) => (
            <Box key={dog.id} borderWidth='1px' borderRadius='lg' boxShadow='base' maxWidth={'200px'}>
              <Center>
                <Box width='100%'>
                  <AspectRatio ratio={1}>
                    <Image
                      src={dog.img}
                      alt={dog.name}
                      width='100%'
                      height='100%'
                      objectFit={'cover'}
                      borderTopRadius='lg'
                    />
                  </AspectRatio>
                </Box>
              </Center>
              <Box p={4}>
                <Text className='font-bold'>{dog.name}</Text>
                <Text>{dog.breed}</Text>
                <Text>{dog.age} years old</Text>
                <Text>Zip code: {dog.zip_code}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </div>
    </Box>
  );
};

const FiltersContent: React.FC<{ filterProps: FilterProps }> = ({ filterProps }) => {
  const {
    searchCount,
    selectedState,
    setSelectedState,
    searchDistance,
    setSearchDistance,
    filters,
    setFilters,
    breeds,
    sorting,
    setSorting,
    handleSliderChange,
  } = filterProps;
  return (
    <div id='div-filters-container' className='flex flex-col w-full gap-2'>
      <h1 className='text-lg'>Search count: {searchCount}</h1>
      <DistancePicker
        selectedDistance={searchDistance}
        onDistanceChange={(d: number) => setSearchDistance(d)}
        selectedState={selectedState}
      />
      <StatePicker
        selectedState={selectedState}
        onStateChange={(newState: StateAbbreviation) => setSelectedState(newState)}
        selectedDistance={searchDistance}
      />
      <LocationSearchInput selectedState={selectedState} searchDistance={searchDistance} />
      <div id='div-breed-select-container' className='w-full'>
        <label className='font-semibold' htmlFor='select-breeds'>
          Select breed
        </label>
        <Select
          id='select-breeds'
          placeholder='All breeds'
          value={filters.breeds && filters.breeds[0] ? filters.breeds[0] : ''}
          onChange={(e) => {
            setFilters({ ...filters, breeds: [e.target.value] });
          }}
          bg={'white'}
        >
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </Select>
      </div>
      <div id='div-breed-sort-container' className='w-full'>
        <label className='font-semibold' htmlFor='select-breeds-sort'>
          Sort by breed
        </label>
        <Select value={sorting} onChange={(e) => setSorting(e.target.value as 'asc' | 'desc')} bg={'white'}>
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </Select>
      </div>
      <Slider
        className='py-6 w-full'
        min={0}
        max={15}
        selectedValues={[filters.ageMin ?? 0, filters.ageMax ?? 15]}
        handleSliderChange={handleSliderChange}
      ></Slider>
    </div>
  );
};

const FiltersContentFooter: React.FC<{ filterProps: FilterProps }> = ({ filterProps }) => {
  const { handleSearch } = filterProps;
  return (
    <Button onClick={handleSearch} className='mx-auto'>
      Search
    </Button>
  );
};
