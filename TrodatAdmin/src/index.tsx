import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import AuthProvider from "./containers/AuthProvider";
import './index.css';
import Notification from "./contexts/Notification";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Notification.Provider value={{name: 'Ant Design'}}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Notification.Provider>
  </React.StrictMode>
);