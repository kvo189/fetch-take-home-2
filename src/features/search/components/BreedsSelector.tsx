import { OptionBase, Select } from 'chakra-react-select';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { useDogBreeds } from '../hooks/useDogBreeds';


interface BreedOption extends OptionBase {
  label: string;
  value: string;
}

interface BreedsSelectorProps {
  onBreedsChange: (selectedBreeds: string[]) => void;
}

const BreedsSelector = ({onBreedsChange }: BreedsSelectorProps) => {
  const { breeds = [], error, isLoading } = useDogBreeds();

  const handleBreedsChange = (
    selectedOptions: readonly BreedOption[],
  ) => {
    if (selectedOptions) {
      onBreedsChange([...selectedOptions.map(breedOption => breedOption.value)]);
    } else {
      onBreedsChange([]);
    }
  };

  if (error) return <div>Failed to fetch dog breeds</div>

  const options = breeds.map((breed) => ({ value: breed, label: breed })); // Assuming breeds is an array of strings

  /* @ts-ignore */
  return (
    <FormControl p={4} className='w-full z-[11] !p-0'>
      <FormLabel>Select breed(s)</FormLabel>
      {
        <Select
          isMulti
          name='colors'
          options={!isLoading ? options : []}
          placeholder='Select breeds...'
          closeMenuOnSelect={false}
          className='z-[11] lg:w-[300px] lg:max-w-[300px] p-0'
          // @ts-ignore
          selectedOptionStyle='check'
          hideSelectedOptions={false}
          useBasicStyles 
          onChange={handleBreedsChange}
        />
      }
    </FormControl>
  );
};

export default BreedsSelector;