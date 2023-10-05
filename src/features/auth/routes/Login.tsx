import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { LoginForm } from '../components/LoginForm';
/**
 * Login page component. 
 * Presents the user with a form to log into their account. 
 * Navigates to the search route upon successful login.
 */
export const Login = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Log in to your account" heading='Login'>
      <LoginForm onSuccess={() => navigate('/search')} />
    </Layout>
  );
};
