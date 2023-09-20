import { ChangeEvent } from 'react';
import { Select } from '@chakra-ui/react';
import { STATES, StateAbbreviation } from '../types/StateAbbreviation'; // Replace with your actual import path
import { useLocationContext } from '@/context/LocationContext';

interface StatePickerProps {
  className?: string;
}

export const StatePicker = ({ className }: StatePickerProps) => {
  const { searchDistance, setSearchDistance, selectedState, setSelectedState } = useLocationContext();
  const defaultSelectedState = selectedState || STATES[0];

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value as StateAbbreviation;
    setSelectedState(newState);
    if (!newState && searchDistance) {
      setSearchDistance(0); // reset search distance if no state is selected
    }
  };

  return (
    <div className={`${className}`}>
      <label className='font-semibold' htmlFor='select-state'>
        State
      </label>
      <Select id='select-state' background={'white'} value={defaultSelectedState} onChange={handleStateChange}>
        {STATES.map((state) => (
          <option key={state} value={state}>
            {state === '' ? 'All states' : state}
          </option>
        ))}
      </Select>
    </div>
  );
};