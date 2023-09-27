import { AspectRatio, Box, Center, Image, Text } from '@chakra-ui/react';
import { Dog } from '../types';

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
  