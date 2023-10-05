import { logout } from '..';

interface LogoutButtonProps {
  onLogout: () => void;
}

/**
 * LogoutButton Component.
 * 
 * Provides a button to allow users to log out.
 * 
 * Props:
 * - `onLogout`: Callback executed after successful logout.
 */
export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {

  const handleLogout = () => {
    logout()
      .then(() => {
        onLogout();  // Invoke the onLogout function passed in as a prop
      })
      .catch((error) => console.error('Error logging out:', error));
  }

  return <button onClick={handleLogout}>Log Out</button>;
};
