import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import { memo, useEffect, useRef } from 'react';

// Handle click outside dropdown logic
const useHandleClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
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

interface InputSuggestionDropdownProps {
  suggestions: { key: string, value: any; label: string }[];
  onSelect: (value: any) => void;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputSuggestionsDropdown = ({ suggestions, onSelect, showDropdown, setShowDropdown }: InputSuggestionDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useHandleClickOutside(dropdownRef, () => setShowDropdown(false));

  const handleSelect = (suggestion: { value: any; label: string }) => {
    onSelect(suggestion.value);
    setShowDropdown(false);
  }

  if (!showDropdown) {
    return null;
  }

  return (
    <Box
      className='absolute z-[5000] border rounded max-h-52 overflow-y-auto cursor-pointer w-full bg-white'
      ref={dropdownRef}
    >
      <UnorderedList styleType={'none'} margin={0} className='list-none m-0' tabIndex={0}>
        {suggestions.map((suggestion: { key: string, value: any; label: string }) => (
          <ListItem
            key={suggestion.key}
            onClick={() => handleSelect(suggestion)}
            className='py-1 hover:bg-gray-200 px-4'
            tabIndex={0}
          >
            {suggestion.label}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default memo(InputSuggestionsDropdown);
