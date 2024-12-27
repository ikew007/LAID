import {ReactNode, useState} from "react";
import {AuthContext} from "../contexts/AuthContext.tsx";
import {decodeJwt} from "../utils/jwtUtils.ts";

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('accessToken');
    const decoded = decodeJwt(token);
    const isExpired = decoded?.exp && decoded.exp < Date.now() / 1000;
    return Boolean(token && !isExpired);
  });

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};