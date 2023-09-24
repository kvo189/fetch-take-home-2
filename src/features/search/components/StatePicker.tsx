import { ChangeEvent } from 'react';
import { Select } from '@chakra-ui/react';
import { STATES, StateAbbreviation } from '../types/StateAbbreviation'; // Replace with your actual import path
import useLocationStore from '../stores/locationStore';

interface StatePickerProps {
  className?: string;
}

export const StatePicker = ({ className }: StatePickerProps) => {

  const { selectedState, setSelectedState } = useLocationStore((state) => ({
    selectedState: state.selectedState,
    setSelectedState: state.setSelectedState,
  }));

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value as StateAbbreviation);
  };

  return (
    <div className={`${className}`}>
      <label className='font-semibold' htmlFor='select-state'>
        State
      </label>
      <Select id='select-state' background={'white'} value={selectedState} onChange={handleStateChange}>
        {STATES.map((state) => (
          <option key={state} value={state}>
            {state === '' ? 'All states' : state}
          </option>
        ))}
      </Select>
    </div>
  );
};