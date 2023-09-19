import { ChangeEvent } from 'react';
import { Select} from '@chakra-ui/react';

interface DistancePickerProps {
  selectedDistance: number;
  onDistanceChange: (selectedDistance: number) => void;
}

export const DistancePicker = ({ selectedDistance, onDistanceChange }: DistancePickerProps) => {
  const distances: number[] = [
    10,
    20,
    30,
    40,
    50,
    75,
    100,
  ];

  const defaultSelectedState = selectedDistance || distances[0];

  const handleDistanceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDistance = e.target.value as unknown as number;
    onDistanceChange(newDistance);
  };

  return (
    <Select background={'white'} value={defaultSelectedState} onChange={handleDistanceChange}>
      {distances.map((dist) => (
        <option key={dist} value={dist}>
          {dist} miles
        </option>
      ))}
    </Select>
  );
};
