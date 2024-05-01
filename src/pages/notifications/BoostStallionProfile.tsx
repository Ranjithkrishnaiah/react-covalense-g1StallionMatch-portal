import { Box, Grid, Typography, StyledEngineProvider } from '@mui/material';
import { useState } from 'react';
import { CustomButton } from 'src/components/CustomButton';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import LocalBoostDetails from 'src/forms/LocalBoostDetails';
import './notification.css';

function BoostStallionProfile() {
  const [boostStallionPopup, setBoostStallionPopup] = useState(false);

  // boost popup handler
  const boostPopupHandler = () => {
    setBoostStallionPopup(true);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box>
        <Grid container>
          <Grid item lg={6} sm={6} xs={12}>
            <Box className="local-boost">
              <Typography variant="h3">Local Boost</Typography>
              <Typography variant="h6">
                Blast out a group message to all breeders who have contacted your farm within the
                last 12 months. Perfect for stallion announcements, fee adjustments, etc at a
                competitive price.
              </Typography>
              <Typography variant="h6" className="localBoostPrice">
                $49.00/stallion
              </Typography>
              <CustomButton className="homeSignup" onClick={boostPopupHandler}>
                Boost Now
              </CustomButton>
            </Box>
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <Box className="local-boost">
              <Typography variant="h3">Extended Boost</Typography>
              <Typography variant="h6">
                Leverage our extended reach of registered users for your announcment and target warm
                leads based on location, search history, tracked horses and more.
              </Typography>
              <Typography variant="h6" className="localBoostPrice">
                $249.00/stallion
              </Typography>
              <CustomButton className="homeSignup">Boost Now</CustomButton>
            </Box>
          </Grid>
        </Grid>

        {/* WrapperDialog for Local Boost */}
        <WrapperDialog
          open={boostStallionPopup}
          title="Local Boost details"
          onClose={() => setBoostStallionPopup(false)}
          body={LocalBoostDetails}
          dialogClassName={'dialogPopup notification-popup localBoost-popup'}
        />
      </Box>
    </StyledEngineProvider>
  );
}

export default BoostStallionProfile;
