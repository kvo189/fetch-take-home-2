import { Route, Routes } from 'react-router-dom';
import { DogSearch } from './DogSearch';
import Locator from './Locator';
import { LocationProvider } from '@/context/LocationContext';

export const SearchRoutes = () => {

  return (
    <LocationProvider>
      <Routes>
        <Route path='' element={<Locator />} />
        <Route path='/dog' element={<DogSearch />} />
      </Routes>
    </LocationProvider>
  );
};
