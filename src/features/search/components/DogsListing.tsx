import { AspectRatio, Box, Button, Center, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { Dog } from '../types';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import useDogsStore from '../stores/dogsStore';

interface DogsListingProps {
  dogs: Dog[];
}

export const DogsListing = ({ dogs }: DogsListingProps) => {
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
          <Center>
            <Box width='100%'>
              <AspectRatio ratio={1}>
                <Image src={dog.img} alt={dog.name} width='100%' height='100%' objectFit={'cover'} borderTopRadius='lg' />
              </AspectRatio>
            </Box>
          </Center>
          <Box p={4}>
            <Text className='font-bold'>{dog.name}</Text>
            <Text>{dog.breed}</Text>
            <Text>{dog.age} years old</Text>
            <Text>ZIP: {dog.zip_code}</Text>
            {dog.distance && <Text>{dog.distance} miles away</Text>}
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export const DogCard = ({ dog }: { dog: Dog }) => {
  return (
    <>
      <Center>
        <Box width='100%'>
          <AspectRatio ratio={1}>
            <Image src={dog.img} alt={dog.name} width='100%' height='100%' objectFit={'cover'} borderTopRadius='lg' />
          </AspectRatio>
        </Box>
      </Center>
      <Box p={4}>
        <Text className='font-bold'>{dog.name}</Text>
        <Text>{dog.breed}</Text>
        <Text>{dog.age} years old</Text>
        <Text>ZIP: {dog.zip_code}</Text>
        {dog.distance && <Text>{dog.distance} miles away</Text>}
      </Box>
    </>
  );
};
