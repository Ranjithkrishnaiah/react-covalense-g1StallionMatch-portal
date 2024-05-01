import React from 'react'
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import CreatePassword from 'src/forms/CreatePassword';
import LinkExpired from 'src/forms/LinkExpired';
import { useValidateLinkMutation } from 'src/redux/splitEndpoints/validateLinkStatusSplit';
import HomePage from 'src/pages/homePage/HomePageController'
import PasswordUpdated from 'src/forms/PasswordUpdated';
function ResetPassword() {
    const { hash } = useParams();
    
    // console.log("ID: ", hash, pathname)
    const [ validate, response ] = useValidateLinkMutation();
    // const hash = response?.data?.errors?.hash;
    const [ openLinkExpired, setOpenLinkExpired ] = React.useState(false);
    const [ openCreatePassword, setOpenCreatePassword ] = React.useState(false);
    const [ openPasswordUpdateSuccess, setOpenPasswordUpdateSuccess ] = React.useState(false);
    React.useEffect(() => {
      if(hash){
        validate({ hash });
      }
      
    },[])

    React.useEffect(() => {
      // console.log("RESPNSE : ", response)
      if(response.isError){
        setOpenLinkExpired(true);
      }else if(response.isSuccess){
        setOpenCreatePassword(true);
      }
      // if(response.isSuccess){
      //   setOpenPasswordUpdateSuccess(true)
      // }
    },[response])
    
    
  return (
    <Box>
      {hash && response.isSuccess && 
        <WrapperDialog 
          open = { openCreatePassword }
          title = "Create Password" 
          onClose = { () => setOpenCreatePassword(false) }
          body = { CreatePassword }
          name = { response.data.fullName }
          email = { response.data.email }
          securityKey = { hash }
          openSuccessUpdate = { openPasswordUpdateSuccess }
          setOpenSuccessUpdate = { setOpenPasswordUpdateSuccess}
        />
      }
      {
        hash && 
          <WrapperDialog
            open = { openLinkExpired }
            title = "Link Expired"
            onClose = { () => setOpenLinkExpired(false)}
            body = { LinkExpired }
            link = { hash }
            />
      }
      {
        hash &&
          <WrapperDialog
            open = { openPasswordUpdateSuccess }
            title = { 'Password Updated' }
            onClose = { () => setOpenPasswordUpdateSuccess(false)}
            body = { PasswordUpdated }
          />
      }
      <HomePage/>
    </Box>
  )
}

export default ResetPassword