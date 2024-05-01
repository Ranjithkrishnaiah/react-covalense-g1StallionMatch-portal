import React, { useState, ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TempLogin from 'src/pages/TempLogin';
// hooks
import useAuth from '../hooks/useAuth';
import HomePageController from '../pages/homePage/HomePageController';
// components
import { useCookies } from 'react-cookie';
// import { createBrowserHistory ,parsePath} from "history";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const [cookies] = useCookies(['country']);
  const { authentication, guestAuth, setLogout } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  const navigate = useNavigate();
  let isInviteUser = pathname.includes('/invite-user');
  let confirmEmail = pathname.includes('/confirm-email');
  const expiryTime: any = Number(window.localStorage.getItem('tokenExpiresTime'));

  // After authentication navigate to home page
  if (!authentication) {
    navigate('/')
    return <HomePageController />;
  }

  // based on requested location navigate to that place.
  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
