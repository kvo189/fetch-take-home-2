import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import * as router from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Login } from '../../routes/Login';

describe('Form Tests', () => {
  // Mock localStorage
  Storage.prototype.getItem = jest.fn(() => JSON.stringify(true)); // example
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();

  test('Sign in button should be disabled if fields are not filled in', async () => {
    const onSuccess = jest.fn();
    await render(<LoginForm onSuccess={onSuccess} />);
    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.clear(screen.getByLabelText(/email/i));

    // Initially, both input fields are empty, so the button should be disabled
    let button = screen.getByRole('button', { name: /sign in/i });

    expect(button).toBeDisabled();

    // Filling only name field, the button should still be disabled
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    expect(button).toBeDisabled();

    // Filling only email field, the button should still be disabled
    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    expect(button).toBeDisabled();

    // Filling both fields, the button should be enabled
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');

    button = screen.getByRole('button', { name: /sign in/i }); // query again to get the updated button state
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
    expect(button).not.toBeDisabled();

    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.clear(screen.getByLabelText(/email/i));
  });
});

jest.mock('@/config', () => ({
  FETCH_BASE_URL: 'http://localhost:3000',
}));

const navigate = jest.fn();
// Mock API call if any
jest.mock('@/features/auth/api/authService', () => ({
  loginWithNameAndEmail: jest.fn().mockResolvedValue(true),
}));

describe('Login Tests', () => {

  beforeEach(() => {
    localStorage.clear(); // Clear all items from storage to prevent any persisted values
  });

  afterEach(() => {
    cleanup(); // clean up the rendered components.
  });

  test('navigates to /search on successful login', async () => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

    await render(
      <MemoryRouter>
        <HelmetProvider>
          <Login />
        </HelmetProvider>
      </MemoryRouter>
    );

    // simulate filling the form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');

    // simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.clear(screen.getByLabelText(/email/i));
    // assert whether navigation has occurred to the expected route
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/search');
    });
  });


});