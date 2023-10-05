import { Button, ChakraProvider } from '@chakra-ui/react';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import customHistory from '@/lib/history';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = () => {
  return (
    <div className='text-red-500 w-screen h-screen flex flex-col justify-center items-center' role='alert'>
      <h2 className='text-lg font-semibold'>Ooops, something went wrong :( </h2>
      <Button className='mt-4' onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </div>
  );
};

const queryClient = new QueryClient();

type AppProviderProps = {
  children: React.ReactNode;
};

/**
 * AppProvider Component
 * 
 * - Provides essential contexts and error handling for the application.
 * - Includes:
 *   - Chakra UI theming and styling.
 *   - Data fetching with `react-query`.
 *   - Error boundary for top-level errors with a fallback UI.
 *   - Async component loading via Suspense with a loading state.
 *   - SEO management with `react-helmet-async`.
 *   - History-based routing with `react-router-dom`.
 * 
 * @param {React.ReactNode} children - React components to be wrapped with the providers.
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-screen h-screen'>
              {/* <Spinner size="xl" /> */}
              Loading...
            </div>
          }
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <HelmetProvider>
              {/* 
            // @ts-ignore */}
              <HistoryRouter history={customHistory}>{children}</HistoryRouter>
            </HelmetProvider>
          </ErrorBoundary>
        </Suspense>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
