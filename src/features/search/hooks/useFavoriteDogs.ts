import { useCallback, useMemo } from 'react';
import { Dog, DogSearchQuery, getDogsByIds } from '..';
import { useQuery } from 'react-query';

export const useFavoriteDogs = (favoriteDogIds: string[], filters: DogSearchQuery, sorting: string = 'breed:asc', currentSearchPage: number) => {
    const pageSize = 25;
    const sortFavoriteDogs = (dogs: Dog[]) => {
        switch (sorting) {
            case 'age:asc':
                return [...dogs].sort((a, b) => a.age - b.age);
            case 'age:desc':
                return [...dogs].sort((a, b) => b.age - a.age);
            case 'breed:asc':
                return [...dogs].sort((a, b) => a.breed.localeCompare(b.breed));
            case 'breed:desc':
                return [...dogs].sort((a, b) => b.breed.localeCompare(a.breed));
            case 'name:asc':
                return [...dogs].sort((a, b) => a.name.localeCompare(b.name));
            case 'name:desc':
                return [...dogs].sort((a, b) => b.name.localeCompare(a.name));
            default:
                return dogs;
        }
    };

    // // Fetch the dogs based on favoriteDogIds only
    const fetchData = useCallback(async () => {
        let favoriteDogs = favoriteDogIds.length ? await getDogsByIds(favoriteDogIds) : [];
        favoriteDogs = favoriteDogs.filter((dog) => (
            dog.age >= (filters.ageMin || 0) &&
            dog.age <= (filters.ageMax || 999) &&
            (filters.breeds?.includes(dog.breed) || filters.breeds?.length === 0)
        ));
        return favoriteDogs;
    }, [favoriteDogIds ]);


    const { data: fetchedDogs = [], error, isLoading } = useQuery(['favoriteDogs', favoriteDogIds], fetchData, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        // enabled: shouldFetch,
    });

    const favoriteDogs = useMemo(() => {
        const filtered = fetchedDogs.filter((dog) => (
            dog.age >= (filters.ageMin || 0) &&
            dog.age <= (filters.ageMax || 999) &&
            (filters.breeds?.includes(dog.breed) || filters.breeds?.length === 0)
        ))
        return sortFavoriteDogs(filtered).slice(currentSearchPage * pageSize, (currentSearchPage + 1) * pageSize);
    }, [fetchedDogs, filters, currentSearchPage]);

    const favoritePagination = useMemo(() => {
        const totalResults = favoriteDogs.length;
        const totalPage = Math.ceil(totalResults / pageSize);
        return { totalResults, pageSize, totalPage };
    }, [favoriteDogs, pageSize, ]);

    return {
        favoriteDogs: favoriteDogs, // Return only the dogs for the current page
        error,
        favoritePagination,
        isLoading
    };
};
