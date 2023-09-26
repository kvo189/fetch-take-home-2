import { AspectRatio, Box, Center, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { Dog } from '../types';

interface DogsListingProps {
    dogs: Dog[];
}

export const DogsListing = ({dogs}: DogsListingProps) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }} width={'100%'} spacing={6}>
      {dogs.map((dog) => (
        <Box key={dog.id} borderWidth='1px' borderRadius='lg' boxShadow='base'>
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
            <Text>Zip code: {dog.zip_code}</Text>
            <Text>{dog.distance} miles away</Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};
