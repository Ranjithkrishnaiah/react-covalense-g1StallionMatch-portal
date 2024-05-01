import React,{ ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import TempLogin from '../pages/TempLogin';
import { useCookies } from 'react-cookie';
import { ROUTES } from 'src/routes/paths'

type GuestGuardProps = {
    children: ReactNode;
  };
function GuestGuard({ children }: GuestGuardProps) {
    const [cookies] = useCookies(['country']);
    const { guestAuth } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    let isInviteUser = pathname.includes('/invite-user');
    let confirmEmail = pathname.includes('/confirm-email');

    // if (!guestAuth && !isInviteUser && !confirmEmail) {
    //   navigate('/temp-login');
    //   return <TempLogin />;
    // }
    // if(!cookies.hasOwnProperty('secret-key')) {
    //   navigate('/temp-login');
    //   return <TempLogin />;
    // } 
  
    return <>{ children }</>;
}

export default GuestGuard