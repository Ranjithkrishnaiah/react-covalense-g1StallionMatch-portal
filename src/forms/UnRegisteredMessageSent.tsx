import {
  Box,
  Typography,
  StyledEngineProvider,
  List,
  ListItem,
  ListSubheader,
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import './LRpopup.css';
import { toPascalCase } from 'src/utils/customFunctions';

function UnRegisteredMessageSent(
  onClose: VoidFunctionType,
  openRegister: VoidFunctionType,
  unregisteredSuccess: string,
  farmNameSelected: string,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  const close = onClose;
  const farmName = unregisteredSuccess;
  //on success
  const handleMessageSuccess = () => {
    close();
    openRegister();
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className={'show regis-success'}>
        <Box mt={3}>
          <Typography variant="h2">Success!</Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="h6">
            Your message has been sent to all users registered with {toPascalCase(farmNameSelected)}
            . You should receive a response shortly.
          </Typography>
        </Box>
        <Box my={2}>
          <List className="success">
            <ListSubheader>Register free with Stallion Match to:</ListSubheader>
            <ListItem>Store conversations with farms within My Messages.</ListItem>
            <ListItem>Track stallions, broodmare sires and mares.</ListItem>
            <ListItem>Access analytics to make informed decisions.</ListItem>
            <ListItem>Early access to discounts &#38; events.</ListItem>
          </List>
        </Box>
        <Box>
          <CustomButton fullWidth className="lr-btn" onClick={handleMessageSuccess}>
            Register Now
          </CustomButton>
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default UnRegisteredMessageSent;
