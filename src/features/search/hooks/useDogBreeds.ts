import { useQuery } from 'react-query';
import { getDogBreeds } from '../api/dogService';

async function fetchDogBreeds() {
  try {
    const response = await getDogBreeds();
    return response;
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    throw error;
  }
}

export function useDogBreeds() {
  const { data: breeds, error, isLoading } = useQuery('dogBreeds', fetchDogBreeds, {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false, // disable refetching when the window is focused.
  });
  return { breeds, error, isLoading };
}