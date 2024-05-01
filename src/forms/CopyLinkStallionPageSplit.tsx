import { InputLabel, Box, Typography, StyledEngineProvider, Stack, TextField, IconButton } from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useLocation } from 'react-router-dom';
import './LRpopup.css';
import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { Images } from 'src/assets/images';
import { useGetFarmByIdQuery } from 'src/redux/splitEndpoints/getFarmsByIdSplit';

function CopyLinkStallionPageSplit(onClose: VoidFunctionType, farmId: string, openNominationWrapper:boolean) {
  const close = onClose;
  const url = window.location.host;
  const { pathname } = useLocation();
  const pathSplitForStallion = pathname.split('/');
  const stallionID: any = pathSplitForStallion[pathSplitForStallion?.length - 2];
  const stallionName: any = pathSplitForStallion[pathSplitForStallion?.length - 3];
  const [copied, setCopied] = useState(false);
  const { data: farmDetailsById } = useGetFarmByIdQuery(farmId);
  const paths = {
    stallionPage: '/stallion-page/', 
  };
 
 // const copyUrl = url + paths.stallionPage + stallionID + '/View';
 const copyUrl = url + '/stallions/' + stallionName + '/' + stallionID + '/View';
  const handleClose = () => {
    close();
  };


  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className={'show regis-success copylink'}>
        <Box pt={3} className='YourUniqueStallionlable'>
          <Typography variant="h4">Your Unique Stallion URL</Typography>
        </Box>
        <Box mt={2}>
        <CopyToClipboard text={copyUrl} onCopy={onSuccessfulCopy}>
          <CustomButton className="copylink-btn">
            <i className="icon-Link" />
                {!copied ? 'Copy link' : 'Copied!'}
          </CustomButton>
          </CopyToClipboard>
        </Box>
        <Box pt={2}>
          <Typography variant="h6">
            Copy this link to easily share your promoted Stallions for Stallion Match Searches.
          </Typography>
        </Box>
        <Box pt={3}>
          <Typography variant="h4" pb={2}>Stallion Match Button</Typography>
          <Stack direction='row'>
            <Box className='company-logo'>
              <img src={Images.stallionlogo} alt='Stallion Logo'/>
            </Box>
            <Box>
              <a href = {Images.stallionlogo} download='Stallion Match' ><CustomButton className='download-btn'>
              <img src={Images.downloadIcon} alt='download'/>
              </CustomButton></a>
            </Box>
          </Stack>
        
        {/* <TextField name="download" 
           InputProps={ {
            endAdornment: <InputAdornment position="end"> <i className="icon-Download" /></InputAdornment>,
          } }
             fullWidth /> */}
      </Box>
      <Box mt={2}>
        <Typography variant="h6">
          Download the Stallion Match button to use on your website. In combination with the Unique
          Stallion URL, this button can be used to clearly direct users to your promoted Stallions
          on Stallion Match.
        </Typography>
      </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default CopyLinkStallionPageSplit;
