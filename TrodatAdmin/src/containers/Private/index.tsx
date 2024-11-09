import React, {useContext} from 'react';
import Auth from "../../contexts/Auth";
import {Navigate, Outlet, useLocation} from "react-router";

type PrivatePropsType = {
  redirectPath?: string;
  children?: any;
};

const Private: React.FC<PrivatePropsType> = ({redirectPath = '/auth', children}) => {
  const { isLogin } = useContext(Auth);
  const location = useLocation();
  console.log('isLogin', isLogin);
  if (!isLogin) {
    return <Navigate to={redirectPath} replace state={{ from: location.pathname + location.search }} />;
  }

  return children || <Outlet />;
};
export default Private;