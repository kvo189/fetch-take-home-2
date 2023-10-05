import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';

/**
 * App Component
 * 
 * - Serves as the application's root component.
 * - Wraps the main application routes (`AppRoutes`) with essential providers (`AppProvider`).
 */
const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
