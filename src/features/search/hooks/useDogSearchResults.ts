import { DogSearchQuery, } from '../types';
import { useQuery } from 'react-query';
import { getDogSearchResults } from '..';

export const useDogSearchResults = (queryParameters: DogSearchQuery) => {
  return useQuery(['dogSearchResults', queryParameters], () => getDogSearchResults(queryParameters));
};