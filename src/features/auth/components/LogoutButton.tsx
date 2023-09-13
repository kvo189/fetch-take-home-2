import { logout } from '..';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {

  const handleLogout = () => {
    console.log('LOGGING OUT');
    logout()
      .then(() => {
        onLogout();  // Invoke the onLogout function passed in as a prop
      })
      .catch((error) => console.error('Error logging out:', error));
  }

  return <button onClick={handleLogout}>Log Out</button>;
};
