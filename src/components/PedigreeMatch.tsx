import { Box, StyledEngineProvider, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CustomButton } from 'src/components/CustomButton';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { usePostGetChannelIdMutation } from 'src/redux/splitEndpoints/postGetChannelId';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { toPascalCase } from 'src/utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { WrapperDialog } from './WrappedDialog/WrapperDialog';
import UnRegisteredUserContactForm from 'src/forms/UnRegisteredUserContactForm';
import { getQueryParameterByName } from 'src/utils/customFunctions';
import UnRegisteredMessageSent from 'src/forms/UnRegisteredMessageSent';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import Registration from 'src/forms/Registration';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import RegisterInterest from 'src/forms/RegisterInterest';
import RegisterInterestSuccess from 'src/forms/RegisterInterestSuccess';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';

function PedigreeMatch(props: any) {
   const { user, authentication } = useAuth();
   
   // Get all users farm list info from API
  const { data: userFarmListData } = useGetUsersFarmListQuery(null, { skip: !authentication });

  
   const [openRegisteration, setOpenRegistration] = useState(false);
   const [openRegisterInterest, setOpenRegisterInterest] = useState(false);
   const [openRegisterInterestSuccess, setOpenRegisterInterestSuccess] = useState(false);
   const [registrationTitle, setRegistrationTitle] = useState('Create Account');
   const [openLogin, setOpenLogin] = useState(false);
   const [OpenLogin, setopenLogin] = useState(false);
   const [isFirstLogin, setIsFirstLogin] = useState(false);
   const [forgotPassword, setForgotPassword] = useState(false);
   const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
   const [isAgreed, setIsAgreed] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openStallionModal, setOpenStallionModal] = useState(false);
   const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
   const [dialogClassName, setDialogClassName] = useState('dialogPopup');
   const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
   const [openFarmModal, setOpenFarmModal] = useState(false);
   const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
   const [newllyPromoted, setNewlyPromoted] = useState(false);
   const [selectedStallionId, setSelectedStallionId] = useState('');   
   const [testimonialList, setTestimonialList] = useState<any>([]);
   const [pauseOnHover, setpauseOnHover] = useState(true);
   const [pauseOnClick, setpauseOnClick] = useState(false);
   const [email, setEmail] = useState('');

   // Display Add Stallion or Registration popup once user clicks on Add Stallion or Promote Stallion
  const handleOpenAction = (event: any) => {
   if (authentication) {
     let farmList: any = [];
     farmList = userFarmListData?.filter((v: any) => v.isActive && v.accessLevel !== "3rd Party");
     if (farmList?.length) {
       setOpenStallionModal(true);
     } else {
       setOpenFarmModal(true);
     }
   } else {
     setOpenRegistration(true);
     handleClick(event);
   }
 }

 // Open popup for Add Stallion
 const handleClick = (event: any) => {
   setAnchorEl(event.currentTarget);
   setOpenDrawer(!openDrawer);
   if (openDrawer) {
     setAnchorEl(null);
   }
 };

 // Open Register popup
 const openRegistrationPopup = () => setOpenRegistration(true);

 // Close login popup
 const closeLogin = () => setopenLogin(false);

 // Open Forgot password popup
 const openForgotPasswordPopup = () => setForgotPassword(true);
   
// Register popup modal close 
const onRegistrationPopupClose = () => {
   setOpenRegistration(false)
 }

 // Open promote stallion popup
 const handleOpenPromoteStallion = () => {
   setAddStallionPromoteModal(true);
 };

 // Close promote stallion popup
 const handleClosePromoteStallion = () => {
   setAddStallionPromoteModal(false);
 };

 // Open new promote stallion popup
 const handleOpenPromoteNew = () => {
   setNewlyPromoted(true);
 };

 // Close new promote stallion popup
 const handleClosePromoteNew = () => {
   setNewlyPromoted(false);
 };

 // Close Stallion popup
 const handleCloseStallion = () => {
   setOpenStallionModal(false);
 };

 // Close Add Stallion popup
 const handleCloseCreateStallion = () => {
   setOpenCreateStallionModal(false);
   setStallionTitle('Add a Stallion');
 };

 // Open Add Stallion popup
 const handleOpenCreateStallionModal = () => {
   setOpenCreateStallionModal(true);
 };


   return (
      <>
         <StyledEngineProvider injectFirst>
            <Box className='accordion-wrapper-st-search perfect-match-accordion-wrapper' mb={4}>
               <Accordion defaultExpanded={false}>
                  <AccordionSummary
                     expandIcon={<KeyboardArrowDownRoundedIcon />}
                     aria-controls="panel1a-content"
                     id="panel1a-header"
                  >
                     <Typography variant='h5'> A global stallion directory with Pedigree Search!</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <Typography>
                     Easily search a global database of stallions including key data points to help you make your next mating decision. Use the filters on the left to narrow your search, including the location, year to stud, colour and stud fee of a stallion. Also, dive deeper into the pedigree of the stallion with our Key Ancestor search (up to 5 generations).<br/>Farms have unlocked extra features by promoting their stallions with Stallion Match. Find out more if your stallions aren’t here! 
                     </Typography>
                     <CustomButton type="button" className='accordionBtnNormal' onClick={(e: any) => handleOpenAction(e)}>Promote Your Stallion on Stallion Match <i className='icon-Arrow-right' /></CustomButton>

                  </AccordionDetails>
               </Accordion>
            </Box>
            
            <WrapperDialog
          open={openRegisterInterestSuccess}
          title={"Success!"}
          onClose={() => setOpenRegisterInterestSuccess(false)}
          body={RegisterInterestSuccess}
          dialogClassName='dialogPopup succesclass-modal'
          className='{"cookieClass"}'
          titleSx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
          iconSx={{
            position: 'absolute',
            right: 12,
            width: 36,
            height: 36,
            top: 18,
            color: "#2EFFB4 !important"
          }}
        />

        <WrapperDialog
          dialogClassName='dialogPopup registerYourIntrestPopup'
          open={openRegisterInterest}
          title={"Register your interest"}
          onClose={() => setOpenRegisterInterest(false)}
          body={RegisterInterest}
          className={"cookieClass"}
          openSuccess={() => setOpenRegisterInterestSuccess(true)}
          sx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
        />

        <WrapperDialog
          open={openRegisteration}
          title={registrationTitle}
          onClose={onRegistrationPopupClose}
          openOther={() => setOpenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={setIsFirstLogin}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
          emailValue={email}
          setEmailValue={setEmail}
          isAgreed={isAgreed}
          setIsAgreed={setIsAgreed}
        />

        <Box>
          <WrapperDialog
            open={openStallionModal}
            title={'Add a Stallion'}
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

        {/* Promote Stallion popup modal */}
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

        {/* Login popup modal */}    
        <WrapperDialog
          dialogClassName='dialogPopup createAccountPopup'
          open={OpenLogin}
          title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
          onClose={closeLogin}
          openOther={openRegistrationPopup}
          OFP={openForgotPasswordPopup}
          body={Login}
          firstLogin={isFirstLogin}
          farmAdminFirstLogin={isFarmAdminFirstLogin}
        />

        {/* Register popup modal */}
        <WrapperDialog
          open={openRegisteration}
          title={registrationTitle}
          onClose={() => setOpenRegistration(false)}
          openOther={() => setopenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={setIsFirstLogin}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        />

        {/* Forgot password popup modal */}
        <WrapperDialog
          open={forgotPassword}
          title="Forgot Password"
          onClose={() => setForgotPassword(false)}
          body={ForgotPassword}
        />
            
         </StyledEngineProvider>
      </>
   )
};
export default PedigreeMatch;