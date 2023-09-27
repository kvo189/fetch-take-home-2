import { Route, Routes } from 'react-router-dom';
import { DogSearch } from './DogSearch';
import Locator from './Locator';
import DogMatch from './DogMatch';

export const SearchRoutes = () => {
  return (
    <Routes>
      <Route path='/match' element={<DogMatch />} />
      <Route path='/dog' element={<DogSearch />} />
      <Route path='/' element={<Locator />} />
    </Routes>
  );
};
