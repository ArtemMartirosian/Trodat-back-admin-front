import React from "react";
import {createBrowserRouter} from "react-router-dom";
import WithRouter from "./containers/WithRouter";
import Private from "./containers/Private";
import Layout from "./containers/Layout";
import Customers from "./pages/Customers";

const Login = React.lazy(() => import('./pages/Login'));
const News = React.lazy(() => import('./pages/News'));
const Products = React.lazy(() => import('./pages/Products'));
const Home = React.lazy(() => import('./pages/Home'));
const Category = React.lazy(() => import('./pages/Category'));
const Contacts = React.lazy(() => import('./pages/Contacts'));
const Orders = React.lazy(() => import('./pages/Orders'));

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <WithRouter>
        <Login />
      </WithRouter>
    ),
  },
  {
    path: "/",
    element: (
      <Private>
        <Layout />
      </Private>
    ),
    id: 'admin',
    children: [
      {
        path: '',
        id: 'home',
        element: (
          <WithRouter>
            <Home />
          </WithRouter>
        )
      },
      {
        path: 'products',
        id: 'products',
        element: (
          <WithRouter>
            <Products />
          </WithRouter>
        )
      },
      {
        path: 'category',
        id: 'category',
        element: (
          <WithRouter>
            <Category />
          </WithRouter>
        )
      },
      {
        path: 'news',
        id: 'news',
        element: (
          <WithRouter>
            <News />
          </WithRouter>
        )
      },
      {
        path: 'users',
        id: 'users',
        element: (
            <WithRouter>
              <Customers />
            </WithRouter>
        )
      },
      {
        path: 'contacts',
        id: 'contacts',
        element: (
            <WithRouter>
              <Contacts />
            </WithRouter>
        )
      },
      {
        path: 'orders',
        id: 'orders',
        element: (
            <WithRouter>
              <Orders />
            </WithRouter>
        )
      },

    ]
  },

]);