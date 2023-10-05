import { create, StateCreator } from 'zustand';
import { Dog } from '../types';

interface DogsState {
    favoriteDogIds: string[];
    addFavorite: (dog: Dog) => void;
    removeFavorite: (dogId: string) => void;
    toggleFavorite: (dog: Dog) => void;
}

const dogsStateCreator: StateCreator<DogsState> = (set) => ({
    favoriteDogIds: JSON.parse(localStorage.getItem('favoriteDogs') || '[]'),

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
});

const useDogsStore = create(dogsStateCreator);

export default useDogsStore;
