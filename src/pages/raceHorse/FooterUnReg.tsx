import React, { useState } from 'react'

import { Box, Typography, Button, Grid } from '@mui/material'
import Registration from 'src/forms/Registration';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import Signup from '../../components/Signup'
import Login from 'src/forms/Login';
import ForgotPassword from 'src/forms/ForgotPassword';
import useAuth from 'src/hooks/useAuth';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';
import './trends.css';
import './home.css';

function FooterUnReg(props:any) {
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] = useState('Create Account');
  const [openLogin, setOpenLogin] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [newllyPromoted, setNewlyPromoted] = useState(false);
  const [selectedStallionId, setSelectedStallionId] = useState('');
  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const { authentication } = useAuth()

  const handleRegisterSubmit = () => {
    if(authentication) {
      setOpenStallionModal(true);
    }else {
      setOpenRegistration(true);
      setIsAgreed(true);
    }
  };

  const handleCloseStallion = () => {
    setOpenStallionModal(false);
    // setAnchorEl(null)
  };

  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };

  return (
    <Box className='trends-signup' mt={5}>
      <Box className='trends-tiles' />
      {/* <WrapperDialog 
          open={ openRegisteration }
          title={ registrationTitle }
          onClose={ () => setOpenRegistration(false) }
          openOther = { () => setOpenLogin(true) }
          changeTitleTo = { setRegistrationTitle }
          body={ Registration }
          setIsFirstLogin={ setIsFirstLogin }
          setFarmAdminFirstLogin = { setIsFarmAdminFirstLogin }
        /> */}

      <WrapperDialog
        open={openRegisteration}
        title={registrationTitle}
        onClose={() => setOpenRegistration(false)}
        openOther={() => setOpenLogin(true)}
        changeTitleTo={setRegistrationTitle}
        body={Registration}
        setIsFirstLogin={setIsFirstLogin}
        setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        emailValue={""}
        isAgreed={isAgreed}
      />
      <WrapperDialog
        open={forgotPassword}
        title="Forgot Password"
        onClose={() => setForgotPassword(false)}
        body={ForgotPassword}
      />
      <WrapperDialog
        open={openLogin}
        title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
        onClose={() => setOpenLogin(false)}
        openOther={() => setOpenRegistration(true)}
        OFP={() => setForgotPassword(true)}
        body={Login}
        firstLogin={isFirstLogin}
        farmAdminFirstLogin={isFarmAdminFirstLogin}
      />

      {/* add stallion */}

      <Box>
        <WrapperDialog
          open={openStallionModal}
          title={'Add a Stallion'}
          // onClose={() => setOpenStallionModal(false)}
          onClose={() => handleCloseStallion()}
          setDialogClassName={setDialogClassName}
          body={AddStallion}
          className={'cookieClass'}
          changeTitleTest={setStallionTitle}
          openOther={handleOpenCreateStallionModal}
          handleSelectedStallions={(id) => { setSelectedStallionId(id) }}
          openPromoteStallion={handleOpenPromoteStallion}
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />
      </Box>
      <Box>
        <WrapperDialog
          open={openCreateStallionModal}
          title={stallionTitle}
          dialogClassName={dialogClassName}
          onClose={handleCloseCreateStallion}
          createStallion="createStallion"
          isSubmitStallion={true}
          isSubmitMare={false}
          closeAddMare={''}
          body={CreateAStallion}
          className={'cookieClass'}
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />
      </Box>
      <Box>
        <WrapperDialog
          open={openAddStallionPromoteModal}
          title={'Promote Your Stallion'}
          onClose={handleClosePromoteStallion}
          openOther={handleOpenPromoteNew}
          OpenPromote={'OpenPromote'}
          selectedStallionIds={selectedStallionId}
          body={AddStallionPromote}
          className={'cookieClass'}
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />
      </Box>
      <Box>
        <WrapperDialog
          open={newllyPromoted}
          title={'Promote Stallion'}
          onClose={handleClosePromoteNew}
          promoteStallionType={() => { }}
          selectedStallionIds={selectedStallionId}
          stallionId={selectedStallionId}
          body={PromoteStallion}
        />
      </Box>
      {/* close add stallion */}

      <Box>
        <Typography variant="h2">
          Harness the power of Stallion Match
        </Typography>
      </Box>
      <Box mt={1}>
        <Grid lg={11} xs={12}>
        <Typography variant='h6'>
          Experience all of the features Stallion Match has to offer by becoming a member for free. Once signed in, you will be able to search from an immense global database of racehorses.
        </Typography>
        </Grid>
      </Box>
      <Box mt={4} className='trends-btm do-you-stand'>
        <Button onClick={handleRegisterSubmit}
          className='homeSignup'>
          Signup
        </Button>
      </Box>
    </Box>
  )
}

export default FooterUnReg