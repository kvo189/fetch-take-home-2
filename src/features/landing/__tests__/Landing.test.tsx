import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Landing from '..';
import { HelmetProvider } from 'react-helmet-async';
import * as router from 'react-router';

const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
});

test('navigates to login on Get Started button click', async () => {

  render(
    <MemoryRouter>
      <HelmetProvider>
        <Landing />
      </HelmetProvider>
    </MemoryRouter>
  );

  const getStartedButton = screen.getByText(/Get Started/i);
  fireEvent.click(getStartedButton);
  expect(navigate).toHaveBeenCalledWith('/auth/login');
});
