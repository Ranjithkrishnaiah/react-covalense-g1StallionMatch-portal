import { UserCredential } from 'firebase/auth';
import React from 'react';

// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | Record<string, any>;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
};

export enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

export type JWTContextType = {
  method: 'jwt';
  authentication: boolean;
  guestAuth: boolean;
  setGuestAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthentication: React.Dispatch<React.SetStateAction<boolean>>;
  user: AuthUser;
  setUser: React.Dispatch<React.SetStateAction<AuthUser>>;
  setLogout: React.Dispatch<React.SetStateAction<boolean>>;
};
