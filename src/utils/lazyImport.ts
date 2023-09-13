import * as React from 'react';

/**
 * lazyImport Utility Function
 * 
 * Purpose:
 * The `lazyImport` utility function enables code-splitting in a React application by allowing for named imports with `React.lazy`.
 * 
 * Parameters:
 * - `factory`: A function that returns a promise which resolves to the imported module.
 * - `name`: The name of the exported component within the imported module.
 * 
 * Usage:
 * To utilize `lazyImport`, the following syntax is recommended:
 * ```javascript
 * const { ComponentName } = lazyImport(() => import('./ComponentFile'), 'ComponentName');
 * ```
 * 
 * Benefits:
 * This utility allows specific components to be loaded lazily, thus reducing the initial bundle size and potentially improving application performance.
 * 
 * Technical Notes:
 * This approach is a workaround for the current limitation in React's native `lazy` function, which doesn't support named exports. The function makes use of JavaScript's dynamic import feature to lazily load only the specified named export from a module.
 */
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: React.lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}
