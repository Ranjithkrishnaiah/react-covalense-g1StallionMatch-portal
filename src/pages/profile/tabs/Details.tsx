import { Grid, Typography, StyledEngineProvider } from '@mui/material'
import { Box } from '@mui/system'
import EditName from '../../../forms/EditName';
import EditEmail from '../../../forms/EditEmail';
import EditAddress from 'src/forms/EditAddress';
import '../Profile.css'

function Details() {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box>
          <Typography variant='h3'>Profile Details</Typography>
        </Box>
        <Grid container lg={12} xs={12}>
          <Grid item lg={9} xs={12}>
            {/* Edit name  */}
            <EditName />
            {/* Edit email  */}
            <EditEmail />
            {/* Edit address  */}
            <EditAddress />
          </Grid>
        </Grid>
      </StyledEngineProvider>
    </>
  )
}

export default Details