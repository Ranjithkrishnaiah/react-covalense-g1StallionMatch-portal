import { useState } from 'react';
import { Box, StyledEngineProvider, Typography, Stack } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import ResendEmail from 'src/forms/ResendEmail';
import useAuth from 'src/hooks/useAuth';
import '../stallionSearch/stallionsearch.css';
import './Profile.css';
import Signup from 'src/components/Signup';
import { CustomToasterMessage } from 'src/components/toasterMessage/customToasterMessage';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

function Header() {
  const { authentication } = useAuth();
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showConfirmAccount, setShowConfirmAccount] = useState(true);
  const [isConfirmAccount, setIsConfirmAccount] = useState(true);
  const [openConfirmAccount, setOpenConfirmAccount] = useState(false);
  const { data: responseAuthMe, isFetching } = useAuthMeQuery(null, { skip: !authentication,refetchOnMountOrArgChange: true, });

  const [apiStatus, setApiStatus] = useState(false);
  const [apiStatusMsg, setApiStatusMsg] = useState({});

  return (
    <StyledEngineProvider injectFirst>
      <WrapperDialog
        open={openConfirmAccount}
        title="Confirm Your Account"
        onClose={() => setOpenConfirmAccount(false)}
        body={ResendEmail}
        confirmYourAcccount={''}
        apiStatus={true}
        setApiStatus={setApiStatus}
        apiStatusMsg={apiStatusMsg}
        setApiStatusMsg={setApiStatusMsg}
      />
      {!authentication && (
        <Box className="accordion-wrapper-st-search perfect-match-accordion-wrapper" mb={3}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h5"> Sign Up Now - Free!</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Experience all of the features Stallion Match has to offer by becoming a member
                free. You will then have full access to find your Perfect Match and track key
                breeding data through your unique Dashboard.
              </Typography>
              {/* <CustomButton type="button" className='accordionBtnT20' sx={ {minWidth:'110px !important'} }>Sign Up <i className='icon-Arrow-right' /></CustomButton> */}
              <Signup isArrowIcon={true} btnClass={'accordionBtnT20'} btnName="Sign Up" />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <Box className={`profile-success ${showPasswordSuccess ? 'show' : 'hide'}`} mb={4}>
        <Stack direction="row" className="alert-box">
          <Typography variant="subtitle2" flexGrow={1}>
            Success! Password successfully changed.
          </Typography>
          <i className="icon-Cross" onClick={() => setShowPasswordSuccess(false)} />
        </Stack>
      </Box>

      <Box>
        {(responseAuthMe?.isVerified === true || isFetching === true) ? (
          ''
        ) : (
          <>
            {apiStatus && (
              <CustomToasterMessage
                apiStatus={true}
                setApiStatus={setApiStatus}
                apiStatusMsg={apiStatusMsg}
                setApiStatusMsg={setApiStatusMsg}
              />
            )}
            <Box className={`profile-confirm ${showConfirmAccount ? 'show' : 'hide'}`} mt={4}>
              <Stack direction="row" className="alert-box">
                <Typography variant="h5" flexGrow={1}>
                  <strong>Please confirm your account!</strong>&nbsp; Check your email to confirm
                  your account. Click{' '}
                  <strong onClick={() => setOpenConfirmAccount(true)} className="resend">
                    Resend
                  </strong>{' '}
                  to resend the confirmation email.
                </Typography>
                <i className="icon-Cross" onClick={() => setShowConfirmAccount(false)} />
              </Stack>
            </Box>
          </>
        )}
      </Box>

      <Box className='member-profile-head'>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Home', href: '/' },
            { name: 'My Dashboard', href: '/dashboard' },
            { name: 'Member Profile' },
          ]}
        />
        <Typography variant="h2">{!authentication ? '' : 'Member Profile'}</Typography>
      </Box>
    </StyledEngineProvider>
  );
}

export default Header;
