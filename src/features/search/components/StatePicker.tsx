import { ChangeEvent } from 'react';
import { Select } from '@chakra-ui/react';
import { StateAbbreviation } from '../types/StateAbbreviation'; // Replace with your actual import path

interface StatePickerProps {
  selectedState: StateAbbreviation;
  onStateChange: (selectedState: StateAbbreviation) => void;
  className?: string;
  selectedDistance?: number;
}

export const StatePicker = ({ selectedState, onStateChange, className, selectedDistance }: StatePickerProps) => {
  const defaultSelectedState = selectedState || states[0];

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value as StateAbbreviation;
    onStateChange(newState);
  };

  return (
    <div className={`${className}`}>
      <label className='font-semibold' htmlFor='select-state'>
        State
      </label>
      <Select id='select-state' background={'white'} value={defaultSelectedState} onChange={handleStateChange}>
        {states.map((state) => (
          <option key={state} value={state}>
            {state === '' ? 'All states' : state}
          </option>
        ))}
      </Select>
    </div>
  );
};

const states: StateAbbreviation[] = [
  '',
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'DC',
];
