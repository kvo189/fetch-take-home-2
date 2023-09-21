import { useState, useEffect, useCallback, useMemo } from 'react';
import { Select, Button, Box, SimpleGrid, Center, Text, Image, AspectRatio } from '@chakra-ui/react';
import { Dog, DogSearchQuery } from '../types/types';
import { getDogSearchResults, getDogBreeds, getDogsByIds } from '..';
import { useLocationContext } from '@/features/search/contexts/LocationContext';
import Slider from '../components/Slider';
import { StatePicker } from '../components/StatePicker';
import { DistancePicker } from '../components/DistancePicker';
import LocationSearchInput from '../components/LocationSearchInput';
import { SearchDrawer } from '../components/SearchDrawer';
import { calculatePageEndIndex } from '../utils/calculatePageEndIndex';
import { sortDogsByDistance } from '../utils/sortDogsByDistance';

interface FilterProps {
  searchCount: number;
  filters: DogSearchQuery;
  setFilters: React.Dispatch<React.SetStateAction<DogSearchQuery>>;
  breeds: string[];
  sorting: string;
  setSorting: React.Dispatch<React.SetStateAction<string>>;
  handleSliderChange: (value: number[]) => void;
  handleSearch: () => void;
}

export const DogSearch = () => {
  const { locationData } = useLocationContext();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<DogSearchQuery>({ breeds: [], ageMin: undefined, ageMax: undefined });
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pagination, setPagination] = useState({ currentPageResults: 0, pageSize: 25, totalPage: 0, totalResults: 0 });
  const [sorting, setSorting] = useState<string>('breed:asc');
  const [searchCount, setSearchCount] = useState<number>(0);

  useEffect(() => {
    console.log(currentPage, 'changed page', pagination, 'pagination');
  }, [currentPage, pagination]);

  const fetchData = useCallback(async () => {
    try {
      const sortOptions = ['age:asc', 'age:desc', 'breed:asc', 'breed:desc', 'name:asc', 'name:desc'];
      const searchParams: DogSearchQuery = {
        ...filters,
        breeds: filters.breeds?.filter(Boolean) || undefined,
        zipCodes: Array.from(new Set(locationData?.locations.map((location) => location.zip_code))),
        sort: sortOptions.includes(sorting) ? sorting : undefined,
        from: currentPage * pagination.pageSize,
        size: pagination.pageSize,
      };

      console.log('fetching data with params...', searchParams, locationData);

      const dogsSearchResponse = await getDogSearchResults(searchParams);
      let dogsResponse = dogsSearchResponse.resultIds.length ? await getDogsByIds(dogsSearchResponse.resultIds) : [];
      console.log(locationData?.locations, dogsResponse);
      dogsResponse = dogsResponse.map((dog) => {
        const calculatedDist = locationData?.locations
          .find((loc) => loc.zip_code === dog.zip_code)
          ?.distanceFromSelected?.toFixed(2);
        return calculatedDist ? { ...dog, distance: parseFloat(calculatedDist) } : dog;
      });
      if (sorting === 'distance:asc' || sorting === 'distance:desc') {
        dogsResponse = sortDogsByDistance(dogsResponse, sorting);
      }
      setDogs(dogsResponse);
      setSearchCount((prevCount) => prevCount + 1);
      setPagination((prevPagination) => ({
        ...prevPagination,
        currentPageResults: dogsSearchResponse.resultIds.length,
        totalResults: dogsSearchResponse.total,
        totalPage: Math.ceil(dogsSearchResponse.total / prevPagination.pageSize),
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [filters, sorting, currentPage, locationData]);

  const handleSearch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log('A parameter affecting the search has changed.', {
      locationData,
      currentPage,
      sorting,
      ageMin: filters.ageMin,
      ageMax: filters.ageMax,
      breeds: filters.breeds,
    });

    fetchData();
  }, [locationData, currentPage, sorting, filters.ageMin, filters.ageMax, filters.breeds]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getDogBreeds();
        setBreeds(response);
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      }
    })();
  }, []);

  const handleSliderChange = useCallback((value: number[]) => {
    setFilters((prevFilters) => ({ ...prevFilters, ageMin: value[0], ageMax: value[1] }));
  }, []);

  const filterProps = useMemo(
    () => ({
      searchCount,
      filters,
      setFilters,
      breeds,
      sorting,
      setSorting,
      handleSliderChange,
      handleSearch,
    }),
    [searchCount, filters, breeds, sorting, handleSliderChange, handleSearch]
  );

  return (
    <Box id='div-dog-search-container' className='w-full flex flex-col lg:flex-row mx-auto gap-3 p-4'>
      <SearchDrawer
        header='Search filters'
        drawerText='Filter search'
        Body={<FiltersContent filterProps={filterProps} />}
        Footer={<FiltersContentFooter filterProps={filterProps} />}
      ></SearchDrawer>

      <div className='flex flex-col w-full gap-4'>
        {(pagination.totalResults && (
          <div className='flex flex-col sm:flex-row gap-3 justify-center md:justify-between items-center w-100 [&>*]:flex-1'>
            <div className=''>
              Showing {pagination.pageSize * currentPage + 1} -{' '}
              {calculatePageEndIndex(currentPage, pagination.pageSize, pagination.totalResults)} of {pagination.totalResults}{' '}
              available dogs
            </div>
            <div className='flex gap-4'>
              <Button onClick={() => currentPage > 0 && setCurrentPage((page) => page - 1)}>Prev</Button>

              <Select
                maxW={'100px'}
                value={currentPage + 1}
                onChange={(e) => {
                  const selectedPage = parseInt(e.target.value);
                  if (!isNaN(selectedPage)) {
                    setCurrentPage(selectedPage - 1);
                  }
                }}
              >
                {Array.from({ length: pagination.totalPage }, (_, index) => index + 1).map((pageNum) => (
                  <option key={pageNum} value={pageNum}>
                    {pageNum}
                  </option>
                ))}
              </Select>

              <Button onClick={() => currentPage + 1 < pagination.totalPage && setCurrentPage((page) => page + 1)}>
                Next
              </Button>
            </div>

            <div className='hidden sm:block px-2 text-right'>
              Page: {currentPage + 1}/{pagination.totalPage}
            </div>
          </div>
        )) ||
          ''}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }} width={'100%'} spacing={6}>
          {dogs.map((dog) => (
            <Box key={dog.id} borderWidth='1px' borderRadius='lg' boxShadow='base'>
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
                <Text>{dog.distance} miles away</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </div>
    </Box>
  );
};

const FiltersContent: React.FC<{ filterProps: FilterProps }> = ({ filterProps }) => {
  const { selectedLocation } = useLocationContext();
  const { searchCount, filters, setFilters, breeds, sorting, setSorting, handleSliderChange } = filterProps;
  return (
    <div id='div-filters-container' className='flex flex-col w-full gap-2'>
      <p className=''>
        <span className='font-semibold'>Search count:</span>
        <br />
        {searchCount}
      </p>
      <p className=''>
        <span className='font-semibold'>Selected location:</span>
        <br />
        {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.state} ${selectedLocation.zip_code}` : `none`}
      </p>
      <DistancePicker />
      <StatePicker />
      <LocationSearchInput />
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
          <option value='age:asc'>Age - Ascending</option>
          <option value='age:desc'>Age - Descending</option>
          <option value='breed:asc'>Breed - Ascending</option>
          <option value='breed:desc'>Breed - Descending</option>
          <option value='distance:asc'>Distance - Ascending</option>
          <option value='distance:desc'>Distance - Descending</option>
          <option value='name:asc'>Name - Ascending</option>
          <option value='name:desc'>Name - Descending</option>
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
