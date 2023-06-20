/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import {
  ActionFunction,
  LoaderFunction,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import ErrorPage from './ErrorPage';

interface IRoute {
  path: string;
  Element: JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: JSX.Element;
}

const basePath = import.meta.env.VITE_BASE_PATH;

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes('$')
    ? fileName.replace('$', ':')
    : fileName.replace(/\/index/, '');

  routes.push({
    path:
      fileName === 'index'
        ? `/${basePath}`
        : `/${basePath}/${normalizedPathName.toLowerCase()}`,
    // @ts-ignore
    Element: pages[path].default,
    // @ts-ignore
    loader: pages[path]?.loader as unknown as LoaderFunction | undefined,
    // @ts-ignore
    action: pages[path]?.action as unknown as ActionFunction | undefined,
    // @ts-ignore
    ErrorBoundary: ErrorPage,
  });
}

// get all routes other than defined routes
routes.push({
  path: '*',
  Element: <ErrorPage />,
  ErrorBoundary: <ErrorPage />,
});

const router = createBrowserRouter(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    // @ts-ignore
    element: <Element />,
    ErrorBoundary: ErrorPage,
  }))
);

const App = () => {
  // Request interceptor for API calls
  axios.interceptors.request.use(
    async (config) => {
      const userStorage = getLocalStorageItem(StorageKeyEnum.USER_STORAGE);
      if (userStorage?.token) {
        config.headers['Authorization'] = `Bearer ${userStorage.token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  return <RouterProvider fallbackElement={<ErrorPage />} router={router} />;
};

export default App;
