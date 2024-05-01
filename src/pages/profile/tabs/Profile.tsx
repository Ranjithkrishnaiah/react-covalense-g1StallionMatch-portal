import React from 'react';
import Details from './Details';
import LoginSecurity from './LoginSecurity';
import SocialAccounts from './SocialAccounts';
import useAuth from 'src/hooks/useAuth';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';

function Profile() {
  const { authentication, setLogout } = useAuth();
  const getUserDetails = useAuthMeQuery(null, { skip: !authentication });

  return (
    <>
      {/* Logged in user details */}
      <Details />
      {/* Change password */}
      {getUserDetails?.data?.provider !== 'google' && <LoginSecurity />}
      {/* Logged in usr social media accounts */}
      {getUserDetails?.data?.provider == 'google' && <SocialAccounts />}
    </>
  );
}

export default Profile;
