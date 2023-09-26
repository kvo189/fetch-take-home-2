import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
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
  const { selectedLocationArea } = useLocationStore((state) => ({
    selectedLocationArea: state.selectedLocationArea,
  }));
  const [filters, setFilters] = useState<DogSearchQuery>({ breeds: [], ageMin: undefined, ageMax: undefined });
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sorting, setSorting] = useState<string>('breed:asc');
  const { dogs, pagination, handleSearch, searchCount } = useDogsSearch(filters, sorting, currentPage, selectedLocationArea);

  // const searchCount = 0;

  useEffect(() => {
    console.log(currentPage, 'changed page', pagination, 'pagination');
  }, [currentPage, pagination]);

  const handleSliderChange = useCallback((value: number[]) => {
    setFilters((prevFilters) => ({ ...prevFilters, ageMin: value[0], ageMax: value[1] }));
  }, []);

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
    <Box id='div-dog-search-container' className='w-full flex flex-col lg:flex-row mx-auto gap-3 p-4'>
      <SearchDrawer
        header='Search filters'
        drawerText='Filter search'
        Body={<FiltersContent filterProps={filterProps} />}
        Footer={<FiltersContentFooter filterProps={filterProps} />}
      ></SearchDrawer>
      <div className='flex flex-col w-full gap-4'>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagination={pagination}></Pagination>
        <DogsListing dogs={dogs || []}></DogsListing>
      </div>
    </Box>
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

const FiltersContentFooter: React.FC<{ filterProps: FilterProps }> = ({ filterProps }) => {
  const { handleSearch } = filterProps;
  return (
    <Button onClick={handleSearch} className='mx-auto'>
      Search
    </Button>
  );
};
