import {createContext} from "react";

interface IAuthContext {
  isLogin: boolean;
  user: null | string;
  onLogin: (username: string) => void;
}

const authContextDefaults: IAuthContext = {
  isLogin: false,
  user: null,
  onLogin: () => null
};

export default createContext<IAuthContext>(authContextDefaults);