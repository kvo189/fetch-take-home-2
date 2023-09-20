import { ChangeEvent } from 'react';
import { Select } from '@chakra-ui/react';

interface DistancePickerProps {
  selectedDistance: number;
  onDistanceChange: (selectedDistance: number) => void;
  className?: string;
}

export const DistancePicker = ({ selectedDistance, onDistanceChange, className }: DistancePickerProps) => {
  const distances: number[] = [0, 2, 4, 6, 8, 10, 15, 20];

  const defaultSelectedState = selectedDistance || distances[0];

  const handleDistanceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDistance = e.target.value as unknown as number;
    onDistanceChange(newDistance);
  };

  return (
    <div className={`${className}`}>
      <label className='font-semibold' htmlFor='select-distance'>
        Search within
      </label>
      <Select id="select-distance" background={'white'} value={defaultSelectedState} onChange={handleDistanceChange}>
        {distances.map((dist) => (
          <option key={dist} value={dist}>
            {dist === 0 ? 'All distances' : `${dist} miles`}
          </option>
        ))}
      </Select>
    </div>
  );
};
