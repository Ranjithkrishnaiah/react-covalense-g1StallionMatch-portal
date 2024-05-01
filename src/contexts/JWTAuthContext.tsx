import React, { createContext, ReactNode, useEffect } from 'react';
// utils
import { isValidToken, setSession } from '../utils/JWT';
// @types
import { AuthUser, JWTContextType } from '../@types/auth';


// ----------------------------------------------------------------------

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};
const USER : AuthUser = localStorage.getItem('user') as AuthUser
const TOKEN = localStorage.getItem('accessToken')
function AuthProvider({ children }: AuthProviderProps) {

  const [authentication, setAuthentication] = React.useState(TOKEN?isValidToken(TOKEN) ? true: false : false);
  const [guestAuth, setGuestAuth ] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser>(USER);
  const [logout, setLogout] = React.useState(false);
  const accessToken = window.localStorage.getItem('accessToken');
  const onLogout = () => {

    if(logout){
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('user');
      window.localStorage.clear();
      window.sessionStorage.clear();
      setSession(null);
      setAuthentication(false);
      setUser(null);
      setLogout(false);
      setGuestAuth(false);
    }
  }


  useEffect(() => {
    const initialize = async () => {
      try {
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
        } else {
          onLogout()
        }
      } catch (err) {
        console.error(err);
        window.localStorage.removeItem("accessToken")
        setAuthentication(false)
        setSession(null)
      }
    };

    initialize();
    onLogout()
  }, [logout, isValidToken(accessToken? accessToken:"")]);

  return (
    <AuthContext.Provider
      value={ {
        method: 'jwt',
        authentication,
        setAuthentication,
        guestAuth,
        setGuestAuth,
        user,
        setUser,
        setLogout
      } }
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
