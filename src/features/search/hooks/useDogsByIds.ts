import { useQuery } from 'react-query';
import { getDogsByIds } from '..';

export const useDogsByIds = (dogIds: string[]) => {
    return useQuery(
      ['dogsByIds', dogIds],
      () => getDogsByIds(dogIds),
      { enabled: !!dogIds.length } // only run the query if dogIds is not an empty array
    );
  };