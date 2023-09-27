import { useEffect, useState } from 'react';
import { Input, Box, List, ListItem, Spinner } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import Downshift from 'downshift';
import { useLocationsLookup } from '../hooks/useLocationsLookup';
import { useIsMount } from '@/hooks/useIsMount';
import useLocationStore from '../stores/locationStore';
import { useLocationsWithinDistance } from '../hooks/useLocationWithinDistance';


type LocationSearchInputProps = {
  className?: string;
};

const SearchInput = ({ className }: LocationSearchInputProps) => {
  const isMount = useIsMount();
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const { selectedState, selectedLocation, setSelectedLocation, searchDistance, setSelectedLocationArea } = useLocationStore(
    (state) => ({
      selectedState: state.selectedState,
      selectedLocation: state.selectedLocation,
      setSelectedLocation: state.setSelectedLocation,
      searchDistance: state.searchDistance,
      setSelectedLocationArea: state.setSelectedLocationArea,
    })
  );

  const { data: locations, isLoading: isLoadingSuggestions } = useLocationsLookup({
    searchParams: { states: selectedState ? [selectedState] : undefined, searchTerm: debouncedSearchInput, size: 10000 },
  });

  const { data: selectedLocationArea } = useLocationsWithinDistance({
    location: selectedLocation,
    distance: searchDistance,
  });

  useEffect(() => {
    if (selectedLocation?.suggestionText) {
      setSearchInput(selectedLocation.suggestionText);
    }
  }, []);

  useEffect(() => {
    if (!selectedLocationArea) return;
    setSelectedLocationArea(selectedLocationArea);
  }, [selectedLocationArea]);

  useEffect(() => {
    if (isMount) return;
    setSearchInput('');
  }, [selectedState]);

  return (
    <Downshift
      onChange={(selectedItem) => (selectedItem.zip_code ? setSelectedLocation(selectedItem) : null)}
      itemToString={(item) => (item ? item.suggestionText : '')}
    >
      {({ getRootProps, getInputProps, getItemProps, getMenuProps, isOpen }) => (
        <Box {...getRootProps()} position='relative' id='search-input-container' className={`flex-1 ${className}`}>
          <label className='font-semibold' htmlFor='input-search-location'>
            State or ZIP code
          </label>
          <Input
            {...getInputProps({
              onChange: (e) => setSearchInput((e.target as HTMLInputElement).value),
              value: searchInput,
              id: 'input-search-location',
              bg: 'white',
            })}
            className='relative'
          />

            
          {isLoadingSuggestions && <Spinner className='absolute z-[5000] right-2 top-1/2 translate-y-1/2' emptyColor='gray.200' color='blue.500'></Spinner>}
          <List
            {...getMenuProps()}
            className='absolute z-[5000] rounded max-h-52 overflow-y-auto cursor-pointer w-full bg-white'
          >
            {isOpen &&
              locations &&
              locations.map((location, index) => (
                <ListItem
                  {...getItemProps({
                    key: location.suggestionText,
                    index,
                    item: location,
                    className: 'py-1 hover:bg-gray-200 px-4',
                  })}
                >
                  {location.suggestionText}
                </ListItem>
              ))}
            {isOpen && !isLoadingSuggestions && locations?.length === 0 && <div>No locations found</div>}
          </List>

        </Box>
      )}
    </Downshift>
  );
};
export default SearchInput;
