import React from "react";
import {Outlet} from "react-router";
import {useClassName} from "../../utils/cn";
import Sidebar from "../Sidebar";
import './style.scss';

const Layout = () => {
  const cn = useClassName('layout');

  return (
    <div className={cn()}>
      <Sidebar />
      <div className={cn('outlet-wrapper')}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;