import { Box, Button, StyledEngineProvider, Typography } from '@mui/material'
import { useState } from 'react';
import AddStallion from 'src/forms/AddStallion';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import CreateAStallion from 'src/forms/CreateAStallion';
import PromoteStallion from 'src/forms/PromoteStallion';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog';
import { DateRange } from 'src/@types/dateRangePicker';
import './noData.css'; 

export default function NoDataRoaster(props:any) {

  const { handleSelectedStallionID, selectedStallionIds } = props;
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const [newllyPromoted, setNewlyPromoted] = useState(false);

  const [dueDateValue, setDueDateValue] = useState<DateRange>([null, null]);

  const handleDueDate = (value: DateRange) => {
    setDueDateValue(value);
  };

  const handleSelectedStallions = (value: any) => {
    handleSelectedStallionID(value);
  };

  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };


  return (
    
    <StyledEngineProvider injectFirst>
    <Box className='noResult'
      sx={ {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        
      } }
    >
      <Typography variant="h3">No Stallions </Typography>
      <Typography> Please add stallions to your roster.</Typography>
      <Button onClick={() => setOpenStallionModal(true)}
          className='clearStyleBtn'>
          Add Stallion
        </Button>
    </Box>
    <Box>
          <WrapperDialog
            open={openStallionModal}
            title={'Add a Stallion'}
            setDialogClassName = { setDialogClassName }
            onClose={() => setOpenStallionModal(false)}
            openOther={handleOpenCreateStallionModal}
            changeTitleTest={setStallionTitle}
            handleSelectedStallions={handleSelectedStallions}
            openPromoteStallion={handleOpenPromoteStallion}
            body={AddStallion}
            className={'cookieClass'}
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>

        <Box>
          <WrapperDialog
            open={openCreateStallionModal}
            title={stallionTitle}
            dialogClassName = { dialogClassName }
            onClose={handleCloseCreateStallion}
            createStallion="createStallion"
            isSubmitStallion={true}
            isSubmitMare={false}
            closeAddMare={''}
            body={CreateAStallion}
            className={'cookieClass'}
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>
        <Box>
          <WrapperDialog
            open={openAddStallionPromoteModal}
            title={'Promote Your Stallion'}
            onClose={handleClosePromoteStallion}
            openOther={handleOpenPromoteNew}
            OpenPromote={'OpenPromote'}
            selectedStallionIds={selectedStallionIds}
            body={AddStallionPromote}
            className={'cookieClass'}
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>
        <Box>
          <WrapperDialog
            open={newllyPromoted}
            title={'Promote Stallion'}
            onClose={handleClosePromoteNew}
            promoteStallionType={() => {} }
            selectedStallionIds={selectedStallionIds}
            body={PromoteStallion}
          />
        </Box>
    </StyledEngineProvider>
  );
}
