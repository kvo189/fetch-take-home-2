import { Route, Routes } from 'react-router-dom';

import { Login } from './Login';
/**
 * Defines the routing for authentication features.
 * Currently, it includes the login route.
 */
export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  );
};
