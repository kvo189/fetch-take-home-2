import { ChangeEvent } from 'react';
import { Select } from '@chakra-ui/react';
import useLocationStore from '../stores/locationStore';

interface DistancePickerProps {
  className?: string;
}

const distanceOptions: number[] = [0, 2, 4, 6, 8, 10, 15, 20];

export const DistancePicker = ({ className }: DistancePickerProps) => {

  const { searchDistance, setSearchDistance } = useLocationStore((state) => ({
    searchDistance: state.searchDistance,
    setSearchDistance: state.setSearchDistance,
  }));

  const handleDistanceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDistance = +e.target.value as unknown as number;
    setSearchDistance(newDistance);
  };

  return (
    <div className={`${className}`}>
      <label className='font-semibold' htmlFor='select-distance'>
        Search within
      </label>
      <Select id='select-distance' background={'white'} value={searchDistance} onChange={handleDistanceChange}>
        {distanceOptions.map((dist) => (
          <option key={dist} value={dist}>
            {dist === 0 ? 'All distances' : `${dist} miles`}
          </option>
        ))}
      </Select>
    </div>
  );
};
