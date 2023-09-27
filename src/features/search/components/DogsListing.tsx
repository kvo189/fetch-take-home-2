import { Box, Button, SimpleGrid, Text } from '@chakra-ui/react';
import { Dog } from '../types';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import useDogsStore from '../stores/dogsStore';
import { DogCard } from './DogCard';

interface DogsListingProps {
  dogs: Dog[];
  loading: boolean;
}

export const DogsListing = ({ dogs, loading }: DogsListingProps) => {
  const { favoriteDogIds, toggleFavorite } = useDogsStore();

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4, '2xl': 5 }} width={'100%'} spacing={6}>
      {dogs.map((dog) => (
        <Box key={dog.id} borderWidth='1px' borderRadius='lg' boxShadow='base' className='relative'>
          <Box className='!absolute right-0  !rounded-full'>
            <Button
              className='absolute right-1 top-1 z-10 !bg-[#ffffffb9] hover:!bg-white !px-0 !rounded-full focus:outline-none'
              onClick={() => toggleFavorite(dog)}
            >
              {favoriteDogIds.includes(dog.id) ? (
                <FaHeart className='text-xl text-red-800  transition-all duration-1000'></FaHeart>
              ) : (
                <FaRegHeart className='text-xl text-red-800  transition-all duration-1000'></FaRegHeart>
              )}
            </Button>
          </Box>
          <DogCard dog={dog}></DogCard>
        </Box>
      ))}
      {dogs.length === 0 && !loading && <Text>No dogs found</Text>}
    </SimpleGrid>
  );
};

export { DogCard };
