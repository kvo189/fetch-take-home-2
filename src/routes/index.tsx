import Landing from '@/features/landing';
import { lazyImport } from '@/utils/lazyImport';
import { useRoutes } from 'react-router-dom';

const { AuthRoutes } = lazyImport(() => import('@/features/auth'), 'AuthRoutes');
const { SearchRoutes } = lazyImport(() => import('@/features/search'), 'SearchRoutes');

/**
 * AppRoutes Component
 * 
 * - Manages main application routes.
 * - Uses `lazyImport` for asynchronous component loading:
 *   - AuthRoutes: Handles authentication related routes (`/auth/*`).
 *   - SearchRoutes: Manages search-related routes (`/search/*`).
 * - Default route (`/`) renders the `Landing` component.
 */
export const AppRoutes = () => {
  const commonRoutes = [{ path: '/', element: <Landing /> }];
  const authRoutes = [
    {
      path: '/auth/*',
      element: <AuthRoutes />,
    },
  ];
  const searchRoutes = [
    {
      path: '/search/*',
      element: <SearchRoutes />,
    }
  ]
  const element = useRoutes([...authRoutes, ...commonRoutes, ...searchRoutes]);

  return element;
};
