import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// components
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TempLogin from '../../pages/TempLogin';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
// ----------------------------------------------------------------------

export default function MainLayout() {
  const { guestAuth } = useAuth();
  const navigate = useNavigate();
  const [cookies] = useCookies(['country']);
  const { pathname } = useLocation();
  let isInviteUser = pathname.includes('/invite-user');
  let confirmEmail = pathname.includes('/confirm-email');

  return (
    <Stack sx={ { minHeight: 1 } }>
      <MainHeader />
        <Outlet />
      <MainFooter countryId = { cookies?.country } />
    </Stack>
  );
}
