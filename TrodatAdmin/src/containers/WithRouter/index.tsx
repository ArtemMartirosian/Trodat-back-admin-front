import React, {Suspense} from "react";
import {Spin} from "antd";

type WithRouterProps = {
  children: any;
};

const WithRouter: React.FC<WithRouterProps> = ({children}) => {
  return (
    <Suspense fallback={<Spin tip="Loading..." size="large" fullscreen />}>
      {children}
    </Suspense>
  );
};

export default WithRouter;