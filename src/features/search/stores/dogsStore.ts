import { create, StateCreator } from 'zustand';
import { Dog } from '../types';

interface DogsState {
    // favoriteDogs: Dog[];
    favoriteDogIds: string[];
    // filters: DogSearchQuery;
    // sorting: string;
    // searchCurrentPage: number;
    // showFavoritesOnly: boolean;
    addFavorite: (dog: Dog) => void;
    removeFavorite: (dogId: string) => void;
    toggleFavorite: (dog: Dog) => void;
    // toggleFavoritesOnly: () => void;
    // setFilters: (filters: DogSearchQuery) => void;
    // setSorting: (sorting: string) => void;
    // setSearchCurrentPage: (page: number) => void;
}

const dogsStateCreator: StateCreator<DogsState> = (set) => ({
    // favoriteDogs: [],
    favoriteDogIds: JSON.parse(localStorage.getItem('favoriteDogs') || '[]'),
    // filters: initialState,
    // sorting: 'breed:asc',
    // searchCurrentPage: 0,
    // showFavoritesOnly: false,

    addFavorite: (dog) => {
        set((state) => {
            const newFavoriteDogIds = [...state.favoriteDogIds, dog.id];
            localStorage.setItem('favoriteDogs', JSON.stringify(newFavoriteDogIds));
            return { favoriteDogIds: newFavoriteDogIds };
        })
    },

    removeFavorite: (dogId) => {
        set((state) => {
            const newFavoriteDogIds = state.favoriteDogIds.filter((id) => id !== dogId);
            localStorage.setItem('favoriteDogs', JSON.stringify(newFavoriteDogIds));
            return { favoriteDogIds: newFavoriteDogIds };
        })
    },

    toggleFavorite: (dog: Dog) => {
        set((state) => {
            let newFavoriteDogIds;
            if (state.favoriteDogIds.includes(dog.id)) {
                newFavoriteDogIds = state.favoriteDogIds.filter((id) => id !== dog.id);
            } else {
                newFavoriteDogIds = [...state.favoriteDogIds, dog.id];
            }
            localStorage.setItem('favoriteDogs', JSON.stringify(newFavoriteDogIds));
            return { favoriteDogIds: newFavoriteDogIds };
        })
    },
    // toggleFavoritesOnly: () =>
    //   set((state) => ({ showFavoritesOnly: !state.showFavoritesOnly })),
});

const useDogsStore = create(dogsStateCreator);

export default useDogsStore;
