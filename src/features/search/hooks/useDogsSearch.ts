import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { DogSearchQuery } from '../types';
import { getDogSearchResults, getDogsByIds } from '../api/dogService';
import { sortDogsByDistance } from '../utils/sortDogsByDistance';
import { LocationArea } from '../stores/locationStore';

export const useDogsSearch = (filters: DogSearchQuery, sorting: string, currentPage: number, selectedLocationArea: LocationArea | null, shouldSearch: boolean ) => {
  const [pagination, setPagination] = useState({ currentPageResults: 0, pageSize: 25, totalPage: 0, totalResults: 0 });
  const [searchCount, setSearchCount] = useState(0);

  const fetchData = useCallback(async () => {
    const sortOptions = ['age:asc', 'age:desc', 'breed:asc', 'breed:desc', 'name:asc', 'name:desc'];
    const searchParams = {
      ...filters,
      breeds: filters.breeds?.filter(Boolean) || undefined,
      zipCodes: Array.from(new Set(selectedLocationArea?.locations.map((location) => location.zip_code))),
      sort: sortOptions.includes(sorting) ? sorting : undefined,
      from: currentPage * pagination.pageSize,
      size: pagination.pageSize,
    };

    const dogsSearchResponse = await getDogSearchResults(searchParams);
    let dogsResponse = dogsSearchResponse.resultIds.length ? await getDogsByIds(dogsSearchResponse.resultIds) : [];

    dogsResponse = dogsResponse.map((dog) => {
      const calculatedDist = selectedLocationArea?.locations
        .find((loc) => loc.zip_code === dog.zip_code)
        ?.distanceFromSelected?.toFixed(2);
      return calculatedDist ? { ...dog, distance: parseFloat(calculatedDist) } : dog;
    });

    if (sorting === 'distance:asc' || sorting === 'distance:desc') {
      dogsResponse = sortDogsByDistance(dogsResponse, sorting);
    }

    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPageResults: dogsSearchResponse.resultIds.length,
      totalResults: dogsSearchResponse.total,
      totalPage: Math.ceil(dogsSearchResponse.total / prevPagination.pageSize),
    }));

    setSearchCount((count) => count + 1);
    return dogsResponse;
  }, [filters.ageMin, filters.ageMax, filters.breeds, sorting, currentPage, selectedLocationArea]);

  const {
    data: dogs = [],
    error,
    refetch: handleSearch, // used to refetch the data whenever desired.
    isLoading,
  } = useQuery(['dogsSearch', filters, sorting, currentPage, selectedLocationArea], fetchData, {
    keepPreviousData: true, // keep displaying the old data until the new data comes in when we re-run the query.
    refetchOnWindowFocus: false, // disable refetching when the window is focused.
    enabled: shouldSearch,
  });


  return {
    dogs,
    searchCount,
    pagination,
    error,
    handleSearch,
    isLoading,
  };
};
