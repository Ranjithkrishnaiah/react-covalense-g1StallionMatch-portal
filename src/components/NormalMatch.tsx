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
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';
import { toPascalCase } from 'src/utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { WrapperDialog } from './WrappedDialog/WrapperDialog';
import UnRegisteredUserContactForm from 'src/forms/UnRegisteredUserContactForm';
import { getQueryParameterByName } from 'src/utils/customFunctions';
import UnRegisteredMessageSent from 'src/forms/UnRegisteredMessageSent';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import Registration from 'src/forms/Registration';

function NormalMatch(props: any) {
   const { user, authentication } = useAuth();
   const navigate = useNavigate();

   // Get member details by farm id
   const farmMembersList: any = useGetFarmMembersQuery(props?.data?.stallionFarmLogo?.farmId, { skip: !props?.data?.stallionFarmLogo?.farmId });

   const [userRole, setUserRole] = useState<any>({});
   const [disabledT20Button, setDisabledT20Button] = useState(false);
   const [titleForm, setTitleForm] = useState('Contact Form');
   const [contactForm, setContactForm] = useState(false);
   const [openSuccess, setOpenSuccess] = useState(false);
   const [openLogin, setopenLogin] = useState(false);
   const [openRegisteration, setOpenRegistration] = useState(false);
   const [registrationTitle, setRegistrationTitle] = useState('Create Account');
   const [isFirstLogin, setIsFirstLogin] = useState(false);
   const [forgotPassword, setForgotPassword] = useState(false);
   const [farmNameSuccess, setFarmNameSuccess] = useState<string>('');
   
   const stallionId = getQueryParameterByName('stallionId') || "";

   // Open signup popup modal
   const openRegistrationPopup = () => setOpenRegistration(true);

   // Close login popup modal
   const closeLogin = () => setopenLogin(false);

   // Open forgot password popup modal
   const openForgotPasswordPopup = () => setForgotPassword(true);

   // Close forgot password popup modal
   const closeForgotPassword = () => setForgotPassword(false);
   const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);

   // set the state variable with user info
   useEffect(() => {
      if (localStorage.getItem('user') !== null) {
         setUserRole(JSON.parse(localStorage.getItem('user') || '{}'));
      }
   }, []);

   // If farm member does not have permission, disbale the contact button
   useEffect(() => {
      if (farmMembersList?.error?.status === 403) {
         setDisabledT20Button(false);
      } else {
         if (farmMembersList?.data) {
            let isFarmMember = farmMembersList?.data.some((farm: any) => farm?.memberId === userRole?.id);
            if (isFarmMember) {
               setDisabledT20Button(true);
            } else {
               setDisabledT20Button(false);
            }
         }
      }
   }, [farmMembersList?.isFetching]);

   //post mutation to get channelId
   const [postGetChannelId, response] = usePostGetChannelIdMutation();

   //post mutation to get new chat
   const [postUserMessageList, responseMessageList] = usePostUserMessageMutation();

   // Manage message navigation
   const handleMessageNavigation = () => {
      if (authentication) {
         sendToMessages();
      } else {
         setContactForm(true);
      }
   }

   // Send message to farm owner
   const sendToMessages = () => {
      let postData = {
         rxId: props?.data?.stallionFarmLogo?.farmId,
      };
      const farmApiData: any = {
         message: ' ',
         farmId: props?.data?.stallionFarmLogo?.farmId,
         stallionId: stallionId,
         subject: 'Stallion Enquiry',
         channelId: '',
         fromMemberUuid: userRole?.id,
      };
      postGetChannelId(postData).then((res: any) => {
         if (res?.data?.channelId) {
            window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
            window.sessionStorage.setItem('SessionFilteredFarm', '');
            navigate(`/messages/thread/${res?.data?.channelId}`);
         } else {
            postUserMessageList(farmApiData).then((res: any) => {
               if (res?.data?.channelId) {
                  window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
                  window.sessionStorage.setItem('SessionFilteredFarm', '');
                  navigate(`/messages/thread/${res?.data?.channelId}`);
               }
            });
         }
      });
   };

   // Open the contact success popup
   const handleSuccess = () => {
      setContactForm(false);
      setOpenSuccess(true);
   };


   return (
      <>
         <StyledEngineProvider injectFirst>
            <Box className='accordion-wrapper-st-search normal-match-accordion-wrapper' mb={4}>
               <Accordion defaultExpanded={true}>
                  <AccordionSummary
                     expandIcon={<KeyboardArrowDownRoundedIcon />}
                     aria-controls="panel1a-content"
                     id="panel1a-header"
                  >
                     <Typography variant='h5'> <i className='icon-Sparkles icon-for-alternate' /> Contact Farm!</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <Typography>
                        While this mating may not be classified as a Perfect Match or a 20/20 Match, you can find below a compilation of global stakes winners that share similarities. If you wish to obtain further information directly from the farm, please click the link provided below
                     </Typography>
                     <CustomButton type="button" className='accordionBtnNormal' disabled={disabledT20Button} onClick={handleMessageNavigation}>Contact {toPascalCase(props?.data?.stallionFarmLogo?.farmName)} about this mating <i className='icon-Arrow-right' /></CustomButton>

                  </AccordionDetails>
               </Accordion>
            </Box>
            <Box>
               {/* Contact form popup */}
               <WrapperDialog
                  open={contactForm}
                  title={titleForm}
                  onClose={() => setContactForm(false)}
                  openSuccessForm={handleSuccess}
                  changeTheTitle={setTitleForm}
                  getFarmName={props?.data?.stallionFarmLogo?.farmName}
                  stallionId={stallionId}
                  horseName={props?.data?.Stallion?.pedigree[0]?.[0]?.horseName}
                  farmId={props?.data?.stallionFarmLogo?.farmId}
                  contactForm={contactForm}
                  selectedMareName={props?.data?.Mare?.pedigree[0]?.[0]}
                  body={UnRegisteredUserContactForm}
               />
            </Box>
            <Box>
               {/* Message sent popup */}
               <WrapperDialog
                  open={openSuccess}
                  title={'Message Sent'}
                  onClose={() => setOpenSuccess(false)}
                  openRegister={() => setOpenRegistration(true)}
                  unregisteredSuccess={farmNameSuccess}
                  farmNameSelected={props?.data?.stallionFarmLogo?.farmName}
                  body={UnRegisteredMessageSent}
               />
            </Box>
            {/* Forgot password popup */}
            <WrapperDialog
                open={forgotPassword}
                title="Forgot Password"
                onClose={closeForgotPassword}
                body={ForgotPassword}
              />
               {/* Login popup */}
              <WrapperDialog
                open={openLogin}
                title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
                onClose={closeLogin}
                openOther={openRegistrationPopup}
                OFP={openForgotPasswordPopup}
                body={Login}
                firstLogin={isFirstLogin}
                farmAdminFirstLogin={isFarmAdminFirstLogin}
              />
              {/* Register popup */}
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
         </StyledEngineProvider>
      </>
   )
};
export default NormalMatch;