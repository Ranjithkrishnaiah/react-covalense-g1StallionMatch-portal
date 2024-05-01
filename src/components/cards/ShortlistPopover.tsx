import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { StallionShortlist } from 'src/@types/StallionShortlist';
import { Box, StyledEngineProvider } from '@mui/system';
import './card.css'
import { useAddStallionShortlistMutation } from 'src/redux/splitEndpoints/stallionShortListSplit';

export default function ShortlistPopover(props: any) {
    const [ addShortlist ] = useAddStallionShortlistMutation();
    const navigate = useNavigate();
    let {
        open,
        stallionId,
        handleShortlistPopperClose,
        manageSavedShortlist,
        isLoggedIn
      } = props;    
  
    const handleClose = () => {       
        handleShortlistPopperClose();
    };  
    
    const id = open ? 'simple-popover' : undefined;    

    const handleShortlist = () => {
        navigate(`/my-shortlist`);
    }

    return (  
      <StyledEngineProvider injectFirst>         
        <Popover
          sx={ { display:{ lg: 'flex', xs: 'flex' } } }
          id={id}
          open={open}   
          className='view-shortlist'       
          anchorOrigin={ {
            vertical: 'center',
            horizontal: 'center',
          } }
          transformOrigin={ {
            vertical: 'center',
            horizontal: 'center',
          } }

        >
          <Box p={1}>
          <i className='icon-Cross' onClick={handleClose} />
          <Box className='shortlistBox'>
            <Typography variant='h6' mb={3}>We've added this stallion to your shortlist.</Typography>
            <Button className='viewButton remove-shortlist continue-btn'>Continue</Button>
            <Button className='viewButton' onClick={handleShortlist}>View Shortlist</Button>
          </Box>
          </Box>
        </Popover>
        </StyledEngineProvider> 
    );
  }