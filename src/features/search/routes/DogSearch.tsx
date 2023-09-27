import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Box,
  Spinner,
  FormControl,
  FormLabel,
  Switch,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useToast,
} from '@chakra-ui/react';
import { DogSearchQuery } from '../types';
import Slider from '../components/Slider';
import { StatePicker } from '../components/StatePicker';
import { DistancePicker } from '../components/DistancePicker';
import { SearchDrawer } from '../components/SearchDrawer';
import SearchInput from '../components/SearchInput';
import useLocationStore from '../stores/locationStore';
import BreedsSelector from '../components/BreedsSelector';
import { DogsListing } from '../components/DogsListing';
import Pagination from '../components/Pagination';
import SortSelector from '../components/SortSelector';
import { useDogsSearch } from '../hooks/useDogsSearch';
import { useFavoriteDogs } from '../hooks/useFavoriteDogs';
import useDogsStore from '../stores/dogsStore';
import { Head } from '@/components/Head/Head';
import { getMatchedDog } from '..';
import { useNavigate } from 'react-router';

interface FilterProps {
  searchCount: number;
  filters: DogSearchQuery;
  setFilters: React.Dispatch<React.SetStateAction<DogSearchQuery>>;
  sorting: string;
  setSorting: React.Dispatch<React.SetStateAction<string>>;
  handleSliderChange: (value: number[]) => void;
  handleSearch: () => void;
}

export const DogSearch = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedLocationArea } = useLocationStore((state) => ({
    selectedLocationArea: state.selectedLocationArea,
  }));
  const [filters, setFilters] = useState<DogSearchQuery>({ breeds: [], ageMin: undefined, ageMax: undefined });
  const [currentSearchPage, setCurrentSearchPage] = useState<number>(0);
  const [sorting, setSorting] = useState<string>('breed:asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favoriteDogIds } = useDogsStore();
  const {
    favoriteDogs,
    favoritePagination,
    isLoading: isFavoritesLoading,
    error: favDogsError,
  } = useFavoriteDogs(favoriteDogIds, filters, sorting, currentSearchPage);

  const {
    dogs,
    pagination,
    handleSearch,
    searchCount,
    isLoading: isLoadingDogs,
    error: searchDogsError,
  } = useDogsSearch(filters, sorting, currentSearchPage, selectedLocationArea, !showFavoritesOnly);

  const handleSliderChange = useCallback((value: number[]) => {
    setFilters((prevFilters) => ({ ...prevFilters, ageMin: value[0], ageMax: value[1] }));
  }, []);

  useEffect(() => {
    setCurrentSearchPage(0);
  }, [selectedLocationArea, showFavoritesOnly]);

  useEffect(() => {
    if (!searchDogsError || favDogsError) return;
    const title = 'Search Error';
    const desc =
      (searchDogsError ? (searchDogsError as unknown as Error)?.message : (favDogsError as unknown as Error)?.message) ||
      'Failed to fetch dogs';

    toast({
      title: title,
      description: desc,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [searchDogsError, favDogsError, toast]);

  const handleFavoriteOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const handleFindMatch = () => {
    getMatchedDog(favoriteDogIds)
      .then((matchId) => {
        const matchedDog = favoriteDogs.find((dog) => dog.id === matchId);
        if (!matchedDog) {
          throw new Error('No match found.');
        }
        // Store matched dog in localStorage
        localStorage.setItem('matchedDog', JSON.stringify(matchedDog));

        // Redirect to /match
        navigate('../match');
      })
      .catch((error) => {
        toast({
          title: 'Matching Error',
          description: `Cannot find match - ${error.message || 'No match found.'}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const filterProps = useMemo(
    () => ({
      searchCount,
      filters,
      setFilters,
      sorting,
      setSorting,
      handleSliderChange,
      handleSearch,
    }),
    [searchCount, filters, sorting, handleSliderChange, handleSearch]
  );

  return (
    <>
      <Head title='Dog Search' description='Find your favorite dog for adoption!'></Head>
      <Box
        id='div-dog-search-container'
        className={`relative w-full flex flex-col lg:flex-row mx-auto gap-3 p-4 ${
          (isLoadingDogs || isFavoritesLoading) && 'h-screen overflow-hidden'
        }`}
      >
        <SearchDrawer
          header='Search filters'
          drawerText='Filter search'
          Body={<FiltersContent filterProps={filterProps} />}
          Footer={
            <FiltersContentFooter
              handleSearch={handleSearch}
              handleFavoriteOnly={handleFavoriteOnly}
              showFavoritesOnly={showFavoritesOnly}
              handleFindMatch={handleFindMatch}
            />
          }
        ></SearchDrawer>
        <div className='flex flex-col w-full gap-4 relative p-4'>
          <Pagination
            currentPage={currentSearchPage}
            setCurrentPage={setCurrentSearchPage}
            pagination={showFavoritesOnly ? favoritePagination : pagination}
          ></Pagination>
          <DogsListing dogs={showFavoritesOnly ? favoriteDogs : dogs}></DogsListing>

          {(isLoadingDogs || isFavoritesLoading) && (
            <div
              id='dog-search-overlay'
              className='absolute w-screen h-screen -left-4 lg:w-[105%] lg:left-0 lg:-top-4 bg-black z-20 opacity-50 '
            >
              <div id='LOADER' className='absolute top-1/2 left-1/2 -translate-1/2'>
                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
              </div>
            </div>
          )}
        </div>
      </Box>
    </>
  );
};

const FiltersContent: React.FC<{ filterProps: FilterProps }> = ({ filterProps }) => {
  const { selectedLocation } = useLocationStore((state) => ({
    selectedLocation: state.selectedLocation,
  }));
  const { searchCount, filters, setFilters, sorting, setSorting, handleSliderChange } = filterProps;
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
      <SearchInput />
      <BreedsSelector
        onBreedsChange={(breeds) => {
          setFilters({ ...filters, breeds: breeds });
        }}
      />
      <SortSelector sorting={sorting} setSorting={setSorting} />

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

const FiltersContentFooter = ({
  handleSearch,
  handleFavoriteOnly,
  showFavoritesOnly,
  handleFindMatch,
}: {
  handleSearch: () => void;
  handleFavoriteOnly: () => void;
  handleFindMatch: () => void;
  showFavoritesOnly: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box className='flex flex-col w-full gap-6'>
      <FormControl className='flex items-center justify-center'>
        <FormLabel htmlFor='favorite-only-switch' mb='0'>
          Show favorites only?
        </FormLabel>
        <Switch id='favorite-only-switch' isChecked={showFavoritesOnly} onChange={handleFavoriteOnly} />
      </FormControl>
      <Box className='flex justify-between'>
        <Button colorScheme={'blue'} onClick={handleSearch} className='mx-auto'>
          Search
        </Button>
        <Button colorScheme={'blue'} onClick={onOpen} className='mx-auto'>
          Find Match
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Find Your Perfect Match!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                You've selected some adorable dogs as your favorites. Let’s find out which one is your ideal match for
                adoption! By clicking <b>Find My Match</b>, a special match will be made from your list of favorited dogs,
                leading you one step closer to finding your perfect companion. Ready to meet your match?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' variant={'outline'} mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme='blue' onClick={handleFindMatch}>
                Find My Match
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};
