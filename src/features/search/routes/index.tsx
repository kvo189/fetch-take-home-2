import { Route, Routes } from 'react-router-dom';
import { DogSearch } from './DogSearch';
import Locator from './Locator';

export const SearchRoutes = () => {
  return (
    <Routes>
      <Route path='/dog' element={<DogSearch />} />
      <Route path='/' element={<Locator />} />
    </Routes>
  );
};
