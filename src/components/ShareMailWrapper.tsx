import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Modal,
  StyledEngineProvider,
  Card,
  Stack,
  Button,
  InputLabel,
  Typography,
} from '@mui/material';
import 'src/components/WrappedDialog/dialogPopup.css'
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePostEmailShareMutation, usePostEmailShareAuthMutation } from 'src/redux/splitEndpoints/searchShareSplit';
import { TextareaAutosize } from '@mui/material';
import { toast } from 'react-toastify';
/////////////////////////////////////////////////////////////////////
export const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#E2E7E1',
}));

export const ShareMailWrapperDialog = (props: any) => {
  const { open, close, stallionID, searchUrl, fromDate, toDate, reportType, filterBy } = props;
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const [state, setStateValue] = useState({
    fromName: "",
    toName: "",
    toEmail: "",
  });
  
  const [postEmailWithToken] = usePostEmailShareAuthMutation();
  const [postEmailWithoutToken] = usePostEmailShareMutation();

  // email validation regular expression
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  // method to validate form
  const validateFarm = () => {
    if(!isLoggedIn) {
      if (emailReg.test(state.toEmail) == false || state.fromName === '' || state.toName === '') {
        return false;
      } else {
        return true;
      }
    } else {
      if (emailReg.test(state.toEmail) == false || state.toName === '') {
        return false;
      } else {
        return true;
      }
    }
    
  };

  // onSubmit form
  const onSubmit = async () => {
    try {
      let loggedinEmailPayload = {
        toName: state.toName,
        toEmail: state.toEmail,
        searchPageUrl: searchUrl,
      };

      let notLoggedinEmailPayload = {
        fromName: state.fromName,
        toName: state.toName,
        toEmail: state.toEmail,
        searchPageUrl: searchUrl,
      };

      const shareEmailResponse = isLoggedIn ? postEmailWithToken(loggedinEmailPayload) : postEmailWithoutToken(notLoggedinEmailPayload);
      
      toast.success('Email sent successfully!', {
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);
    }
    close();
  };

  // set initial state on popup close
  useEffect(() => {
    if (open === false) {
      setStateValue({
        ...state,
        fromName: "",
        toName: "",
        toEmail: "",
      })
    }
  }, [open]);

  // Check the  form element once value is inserted or updated, update the state variable
  

  const handleChangeField = (type: any, targetValue: any) => {
    setStateValue({
      ...state,
      [type]: targetValue,
    })
  }

  return (
    <StyledEngineProvider injectFirst>
      <Dialog
        open={props.open}
        className="dialogPopup"
        maxWidth={props.maxWidth || 'sm'}
        sx={props.sx}
      >
        <CustomDialogTitle>
          {props.title}

          <IconButton
            onClick={close}
            sx={{
              position: 'absolute',
              right: 12,
              width: 36,
              height: 36,
              top: 18,
              color: (theme) => '#1D472E',
            }}
          >
            <i className="icon-Cross" />
          </IconButton>
        </CustomDialogTitle>

        <DialogContent className="popup-cnt" sx={{ p: '2rem' }}>
          <Box className="farmmerge-modal" mt={4}>
          {!isLoggedIn && <Box className="mergefarm-account-modal" mt={4}>
              <InputLabel>From</InputLabel>
              <Box className="edit-field search-autocomplete">
                <TextField
                  fullWidth
                  name="fromName"
                  onChange={(e: any) => handleChangeField("fromName", e.target.value)}
                  placeholder="Enter Name"
                  className="edit-field"
                />
              </Box>
            </Box>
            }
            <Box className="mergefarm-account-modal" mt={4}>
              <InputLabel>To</InputLabel>
              <Box className="edit-field search-autocomplete">
                <TextField
                  fullWidth
                  name="toName"
                  onChange={(e: any) => handleChangeField("toName", e.target.value)}
                  placeholder="Enter Name"
                  className="edit-field"
                />
              </Box>
              
              <Box className="edit-field search-autocomplete" mt={2}>
                <TextField
                  fullWidth
                  name="toEmail"
                  onChange={(e: any) => handleChangeField("toEmail", e.target.value)}
                  placeholder="Enter Email Address"
                  className="edit-field"
                />
              </Box>
            </Box>
            
            <Box pt={2} pb={2}>
              <Button
                disabled={!validateFarm()}
                type="submit"
                fullWidth
                className="lr-btn"
                onClick={onSubmit}
              >
                Submit
                {/* {pdfDataUrl == undefined ? 'Generating Pdf' : 'Submit'} */}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </StyledEngineProvider>
  );
};
