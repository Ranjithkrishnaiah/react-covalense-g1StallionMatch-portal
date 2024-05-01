import { useState } from 'react';
import { Box } from '@mui/material';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import '../pages/homePage/home.css';
import CountryCookie from 'src/forms/CountryCookie';

function CountryCookieModal() {
  const [openCookieModal, setOpenCookieModal] = useState(true);
  return (
    <Box >
      {/* Modal component to show cookie location based on IP */}
      <WrapperDialog 
          open={openCookieModal}
          title={'Welcome to Stallion Match'}
          onClose={() => setOpenCookieModal(false)}
          body={CountryCookie}
          className = {"cookieClass"}
          dialogClassName="dialogPopup cookieClassModal"
          titleSx = { { backgroundColor:'#1D472E', color:"#2EFFB4 !important" } }
          iconSx = { { position: 'absolute',
          right: 12,
          width: 36,
          height: 36,
          top: 18,
          color: "#2EFFB4 !important" } }
        />
        </Box>
  )
}

export default CountryCookieModal;