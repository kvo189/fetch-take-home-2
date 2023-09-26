import React from 'react';
import { Select } from '@chakra-ui/react'; // Adjust import as needed

interface SortSelectorProps {
  sorting: 'asc' | 'desc' | string;
  setSorting: React.Dispatch<React.SetStateAction<'asc' | 'desc' | string>>;
}

const SortSelector: React.FC<SortSelectorProps> = ({ sorting, setSorting }) => (
  <div id='div-sort-container' className='w-full'>
    <label className='font-semibold' htmlFor='select-breeds-sort'>
      Sort by
    </label>
    <Select
      value={sorting}
      onChange={(e) => setSorting(e.target.value as 'asc' | 'desc')}
      bg={'white'}
    >
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
);

export default SortSelector;
