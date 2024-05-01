import { Avatar, Box, Container, Typography,Popover,Divider } from '@mui/material'
import { useState, useEffect } from 'react';
import { Images } from 'src/assets/images'
import { useNav } from 'src/hooks/useNav';
import { toPascalCase } from 'src/utils/customFunctions';
import Registration from 'src/forms/Registration';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import Login from 'src/forms/Login';
import ForgotPassword from 'src/forms/ForgotPassword';
import useAuth from 'src/hooks/useAuth';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useVerifyUserInviteMutation } from 'src/redux/splitEndpoints/VerifyUserInviteSplit';
import { useAddToStallionsMutation } from 'src/redux/splitEndpoints/addToFavStallionSplit';
import { useAddToDamsiresMutation } from 'src/redux/splitEndpoints/addToDamSiresSplit';
import { toast } from 'react-toastify';

interface HorseWrapperProps {
    id: string;
    src: string;
    name: string;
    fee?: string;
    isMostPopularDamsire?: boolean;
    sireName?: string;
    damName?: string;
    options?: string[];
    optionFunctionIndex?: number[];
    isPromoted?:number;
}

function HorseWrapper(props: HorseWrapperProps) {
  // console.log("PROPS: ", props)
    const { authentication } = useAuth()
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | EventTarget & Element>(null);
    const [ openPopover, setOpenPopover ] = useState(false);
    const [ itemId, setItemId ] = useState("");
    const [ itemName, setItemName ] = useState("");
    const [filteredOptions ,setFilteredOptions] = useState(props.options? props.options : [])
    const [filteredOptionFunctionIndex, setFilteredOptionFunctionIndex] = useState(props.optionFunctionIndex? props.optionFunctionIndex : []);
    const id = openPopover ? 'popover' : undefined;
    const [addToFavoriteStallions, stallionResponse] = useAddToStallionsMutation<any>();
    const [addToFavoriteDamsires, damsireResponse] = useAddToDamsiresMutation<any>();

    //Signup Requirements
    const { pathname } = useLocation();
    const { hash } = useParams();
    const [verifyUserInvite, verifyUserInviteResponse] = useVerifyUserInviteMutation();
    const isNewMember: boolean = pathname.includes('/invite-user') && !!hash && !!verifyUserInviteResponse.data?.isMember === true;
    const [openRegisteration, setOpenRegistration] = useState(false);
    const [registrationTitle, setRegistrationTitle] =
      useState(pathname.includes('/invite-user') && !isNewMember ? 'Invitation Accepted' : 'Create Account');
    const [openLogin, setOpenLogin] = useState(false);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);

    const toggleOptions = (evt: any) => {
      setItemId(evt.currentTarget.id);
      setItemName(evt.currentTarget.accessKey)
      setAnchorEl(evt.currentTarget)
      filteredOptions.length > 0 && setOpenPopover(true)
    }
    const authGuard = () => {
      setFilteredOptions(filteredOptions.filter(option => option !== 'Add To My List'));
        setFilteredOptionFunctionIndex(filteredOptionFunctionIndex.filter(option => 
          option !== 3))
    }

    useEffect(()=>{
      if(!authentication) authGuard()
    },[authentication])

    const notifyStallionSuccess = () =>
    toast.success('Successfully added to your My Horses list.', {
      autoClose: 2000,
    });
  const notifyDamsireSuccess = () =>
    toast.success('Successfully added to your My Horses list.', {
      autoClose: 2000,
    });
  const notifyStallionError = () =>
    toast.error(stallionResponse?.error?.data?.response, {
      autoClose: 2000,
    });
  const notifyDamsireError = () =>
    toast.error(damsireResponse?.error?.data?.response, {
      autoClose: 2000,
    });

    useEffect(()=>{
        if(stallionResponse.isSuccess){
            notifyStallionSuccess()
        }
        else if(stallionResponse.isError){
            notifyStallionError()
        }
    },[stallionResponse])

    useEffect(()=>{
        if(damsireResponse.isSuccess){
            notifyDamsireSuccess()
        }
        else if(damsireResponse.isError){
            notifyDamsireError()
        }
    },[damsireResponse])
    
    const { goToSearch, goToStallionPage, goToFarmPage, editMareList, 
        downloadMareList, sendMessageToBreeder, goToStallionReport,
        sendInvitation, edit, goToSearchFromTrends } = useNav();
      // ===================================!!!IMPORTANT!!!=====================================
      // ===============Always add function items to the END of the optionFunctions Array=======
      const optionFunctions = [ goToSearch, goToStallionPage, 
        goToFarmPage, editMareList, downloadMareList,
        sendMessageToBreeder, goToStallionReport, sendInvitation, edit, 
        goToSearchFromTrends,addToFavoriteStallions, addToFavoriteDamsires ];


    const interceptor: any = (e: any, option: string, fn:()=> void) => {
      // console.log(e,authentication,'EEE')
      switch(option){
        case "Search":
          if(!authentication) {
            setOpenRegistration(true);
            setAnchorEl(null);
            setOpenPopover(false);
          }
          else goToSearchFromTrends(e)
        break;
        case "View Profile":
          if(!authentication) {
            setOpenRegistration(true);
            setAnchorEl(null);
            setOpenPopover(false);
          }
          else navigate(`/stallions/${itemName}/${itemId}/View`);
        break;
        case "Add To My List":
            setAnchorEl(null);
            setOpenPopover(false);
            if(props.isMostPopularDamsire){
              addToFavoriteDamsires({horseId: itemId})
            }else{
              addToFavoriteStallions({stallionId: itemId})
            }
        break;
        default: fn()
      }
    }

    const handleResendButtonHideShow = () => {
      let arr:any = [];
      // arr = props?.id;
      let flag = false;
      // for (let index = 0; index < arr.length; index++) {
      //   const element = arr[index];
      //   if(parseInt(itemId) === element?.id){
      //     if(element?.status === 'Pending') {
      //       // console.log(element,'ELEEE>>>')
      //       flag = true;
      //       break;
      //     }
      //   }
      // }
      if(props?.isPromoted) {
        flag = props?.isPromoted ? true : false;
      }
      // console.log(props,'ARR>>>>')
      return flag;
    }

  return (
      <Container>
        <WrapperDialog
        open={openRegisteration}
        title={registrationTitle}
        onClose={() => setOpenRegistration(false)}
        openOther={() => setOpenLogin(true)}
        changeTitleTo={setRegistrationTitle}
        body={Registration}
        setIsFirstLogin={setIsFirstLogin}
        setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        hash={hash}
        fullName={verifyUserInviteResponse.data?.fullName}
        InvitedEmail={verifyUserInviteResponse.data?.email}
        isLoginOpen={openLogin}
        closeLogin={() => setOpenLogin(false)}
      />
      <WrapperDialog
        open={forgotPassword}
        title="Forgot Password"
        onClose={() => setForgotPassword(false)}
        body={ForgotPassword}
      />
      <WrapperDialog
        open={openLogin}
        dialogClassName='dialogPopup createAccountPopup'
        title={isFirstLogin ? "Welcome to Stallion Match" : 'Log in'}
        onClose={() => setOpenLogin(false)}
        openOther={() => setOpenRegistration(true)}
        OFP={() => setForgotPassword(true)}
        firstLogin={isFirstLogin}
        body={Login}
        farmAdminFirstLogin={isFarmAdminFirstLogin}
        setRegistrationTitle = {() => setRegistrationTitle('Create Account')}
      />
        <Box className='Horse-wrapper'>
            <Box sx={ { display: 'flex' } }>
                <Avatar alt={`${toPascalCase(props?.name)}`} src={ props.src ? `${props.src}?h=64&w=64&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100` : Images.HorseProfile } sx={ { marginRight: '10px', width: '64px', height: '64px' } }/>
                <Box sx={ { display:'flex', flexDirection:'column' } }>
                    <Box><Typography variant='h4'>{toPascalCase(props.name)}</Typography></Box>
                    {!props.isMostPopularDamsire && <Box><Typography variant='h6'>Service Fee: {props.fee}</Typography></Box>}
                    {props.isMostPopularDamsire && 
                    <Box><Typography variant='h6'>
                      {toPascalCase(props.sireName)} x {toPascalCase(props.damName)}
                    </Typography></Box>}
                </Box>
            </Box>
            {authentication && <Box sx={ { display:'flex', alignItems: 'center' } }>
            <i className="icon-Dots-horizontal" 
            onClick={toggleOptions}
            accessKey={props.name}
            id={props.id}/>
            </Box>}
            {openPopover && <Popover
            sx={ { display:{ lg: 'flex', xs: 'flex' } } }
            id={id}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={() => setOpenPopover(false)}
            anchorOrigin={ {
              vertical: 'bottom',
              horizontal: 'right',
            } }
            transformOrigin={ {
              vertical: 'top',
              horizontal: 'right',
            } }
            className='sm-dropdown'
          >
            {props.optionFunctionIndex && props.options? filteredOptions.map((option: string, index: number) => (
              <Box key={option+index}  className={`dropdown-menu ${option !== 'View Profile' || handleResendButtonHideShow() === true ? '' : 'hide'}`}>
                {props.optionFunctionIndex? 
                <Box>
                  <Box sx={ { paddingX: 2, paddingY: '12px' } } 
                  id={itemId} 
                  accessKey = { itemName }
                  className={"pointerOnHover"}
                  onClick={(e: any) => interceptor(e, option,optionFunctions[filteredOptionFunctionIndex[index]])}>{option}</Box>
                  <Box>
                    {props.options? index < props?.options?.length-1? <Divider/>:"":""}
                  </Box>
                </Box>
                :""}
              </Box>
            )):""}
          </Popover>}
        </Box>
    </Container>
  )
}

export default HorseWrapper