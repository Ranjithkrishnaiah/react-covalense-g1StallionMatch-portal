import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircleIcon from '@mui/icons-material/Circle';
import { Box, Stack, StyledEngineProvider } from "@mui/material";
import { Images } from "src/assets/images";
import './ChatContact.css';

export default function ChatContact() {
  return (
    <StyledEngineProvider injectFirst>
    <List
      className='contact-unselected'
    >
      <ListItem alignItems="center">
        <ListItemAvatar>
        {/* <Avatar  src={Images.User} style={ {width: '56px', height: '56px'} }/> */}
        <Avatar alt="member" src={Images.member} style={ { width: '56px', height: '56px' } }/>
        </ListItemAvatar>
        <ListItemText sx={ { marginLeft: '1rem' } }
          primary={
            <Stack direction="row">
              <Box flexGrow={1}>
                <Typography

                  variant="h4"
                >
                  John Smith <CircleIcon className="unread"/>
                </Typography>
                
              </Box>
              <Box>
                <Typography
                sx={ { display: "inline" } }
                  variant="h5"
                >
                  08/11/21
                </Typography>
              </Box>
            </Stack>
          }
          secondary={
              <Stack>
            <Box>
              <Typography
                variant="h5"
                color="text.primary"
              >
                Hi Matthew, thanks for getting in... 
              </Typography>
              </Box>
              <Box sx={ { pt: '5px' } }>
                <Typography
                  variant="h6"
                >
                  Tyranny - Stallion Nomination - Sent 8/11/21
                </Typography>
              </Box>
              </Stack>
          }
        />
      </ListItem>
    </List>
    </StyledEngineProvider>
  );
}
