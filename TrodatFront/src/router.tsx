import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import WithRouter from './containers/WithRouter';
import Layout from './containers/Layout';
import ErrorFallback from './components/ErrorFallBack';


const Home = React.lazy(() => import('./pages/Home'));
const Account = React.lazy(() => import('./pages/Account'));
const Catalog = React.lazy(() => import('./pages/Catalog'));


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  
    errorElement: <ErrorFallback />,
    children: [
      {
        path: '',
        id: 'home',
        element: (
          <WithRouter>
            <Home />
          </WithRouter>
        ),
      },
      {
        path: 'account',
        id: 'account',
        element: (
            <WithRouter>
              <Account />
            </WithRouter>
        ),
      },
      {
        path: 'catalog',
        id: 'catelog',
        element: (
            <WithRouter>
              <Catalog />
            </WithRouter>
        ),
      },

    ],
  },
]);
