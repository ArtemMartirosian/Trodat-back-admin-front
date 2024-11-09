import React, {FC, ReactNode, useState} from 'react';
import Auth from '../../contexts/Auth';

const AuthProvider: FC<{children: ReactNode}> = ({children}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const onLogin = (username: string) => {
    setIsLogin(true);
    setUser(username);
  };

  return (
    <Auth.Provider value={{
      user,
      isLogin,
      onLogin
    }}
    >
      { children }
    </Auth.Provider>
  );
};

export default AuthProvider;