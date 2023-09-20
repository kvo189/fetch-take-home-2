import { Dog } from '..';

export const sortDogsByDistance = (dogs: Dog[], sortOrder = 'distance:asc') => {
    return dogs.sort((a, b) => {
        if (a.distance === undefined || a.distance === null) return 1;
        if (b.distance === undefined || b.distance === null) return -1;

        if (sortOrder === 'distance:asc') {
            return a.distance - b.distance;
        } else if (sortOrder === 'distance:desc') {
            return b.distance - a.distance;
        }

        return 0;
    });
};