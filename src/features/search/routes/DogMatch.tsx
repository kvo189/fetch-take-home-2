import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Dog } from '..';
import { ContentLayout } from '@/components/Layout/ContentLayout';
import { Box, Button, Container, Text } from '@chakra-ui/react';
import { DogCard } from '../components/DogsListing';

const DogMatch = () => {
  const navigate = useNavigate();
  const matchedDog = JSON.parse(localStorage.getItem('matchedDog') || '') as Dog;

  useEffect(() => {
    if (!matchedDog) {
      navigate('/search');
    }
  }, [matchedDog, history]);

  if (!matchedDog) {
    return null;
  }

  return (
    <ContentLayout title={'Pawfect Match Found!'} heading={'Congratulations, You Have Found a Match!'}>
      <Container className='flex flex-col items-center'>
        <Box className='w-80 max-w-xs m-auto' borderRadius='lg' boxShadow='base'>
          <DogCard dog={matchedDog} />
        </Box>
        <Text textAlign='center' mt={4}>
          We are delighted to announce that you have been matched with a loving companion! Your journey to adopt a loving pet
          is almost complete. Take your time to get to know your matched companion and feel the joy they bring into your
          life.
        </Text>
        <Text textAlign='center' mt={4} mb={6}>
          If you feel ready, contact the shelter and arrange a visit to meet your new friend. Remember, adoption is a big
          responsibility. Ensure you are ready to provide a loving and caring home to your new companion.
        </Text>
        <Button colorScheme='blue' variant='outline' onClick={() => navigate('../dog')}>
          Go Back
        </Button>
      </Container>
    </ContentLayout>
  );
};

export default DogMatch;
