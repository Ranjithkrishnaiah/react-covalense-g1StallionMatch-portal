import { Box, StyledEngineProvider, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CustomButton } from 'src/components/CustomButton';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useNavigate } from 'react-router';
import { usePostGetChannelIdMutation } from 'src/redux/splitEndpoints/postGetChannelId';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import { useEffect, useState } from 'react';
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';
import { getQueryParameterByName, toPascalCase } from 'src/utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { WrapperDialog } from './WrappedDialog/WrapperDialog';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import Registration from 'src/forms/Registration';
import UnRegisteredMessageSent from 'src/forms/UnRegisteredMessageSent';
import UnRegisteredUserContactForm from 'src/forms/UnRegisteredUserContactForm';

function T20Match(props: any) {
   const { user, authentication } = useAuth();
   const navigate = useNavigate();
   const [userRole, setUserRole] = useState<any>({});
   const [disabledT20Button, setDisabledT20Button] = useState(false);
   
   // Get member details by farm id
   const farmMembersList: any = useGetFarmMembersQuery(props?.data?.stallionFarmLogo?.farmId, { skip: !props?.data?.stallionFarmLogo?.farmId });

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
            <Box className='accordion-wrapper-st-search twentytwenty-accordion-wrapper' mb={4}>
               <Accordion defaultExpanded={true}>
                  <AccordionSummary
                     expandIcon={<KeyboardArrowDownRoundedIcon />}
                     aria-controls="panel1a-content"
                     id="panel1a-header"
                  >
                     <Typography variant='h5'> <i className='icon-Lightening-bolt icon-for-alternate' /> 20/20 Match!</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <Typography>
                        A 20/20 Match occurs when a mating has two or more Graded Stakes Winners with more than 20 shared ancestors within 5 generations. This is called a SI (Similarity Index) and indicates that the mating is proven. This occurs in only 45% of all searches.
                     </Typography>
                     <CustomButton type="button" className='accordionBtnT20' disabled={disabledT20Button} onClick={handleMessageNavigation}>Contact {toPascalCase(props?.data?.stallionFarmLogo?.farmName)} about this mating</CustomButton>
                  </AccordionDetails>
               </Accordion>
            </Box>
            <Box>
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
            <WrapperDialog
               open={forgotPassword}
               title="Forgot Password"
               onClose={closeForgotPassword}
               body={ForgotPassword}
            />

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
export default T20Match;