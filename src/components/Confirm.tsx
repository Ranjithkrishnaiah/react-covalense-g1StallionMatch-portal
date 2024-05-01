import { InputLabel, Box, Typography } from '@mui/material'
import { VoidFunctionType } from 'src/@types/typeUtils';
import { CustomButton } from './CustomButton';
import { useDeleteFromFavDamsiresMutation } from '../redux/splitEndpoints/deleteFromFavDamsiresSplit';
import { useDeleteFromFavFarmsMutation } from '../redux/splitEndpoints/deleteFromFavFarmsSplit';
import { useDeleteFromFavStallionsMutation } from '../redux/splitEndpoints/deleteFromFavStallionsSplit';
import { useDeleteFromMyMaresMutation } from '../redux/splitEndpoints/deleteFromMyMaresSplit';
import { useDeleteUserMutation } from 'src/redux/splitEndpoints/deleteFarmUser';
import { toPascalCase } from 'src/utils/customFunctions';
import { useDeleteMareListMutation } from 'src/redux/splitEndpoints/deleteMarelist';
import { capitalizeCountry } from 'src/utils/FunctionHeap';
import { toast } from 'react-toastify';
function Confirm(onClose: VoidFunctionType, tablename: string, itemName: string,
  itemId: string, reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>,
  farmId?: string, customMessage?: string,) {
  const close = onClose;
  const headerText = `Remove ${capitalizeCountry(toPascalCase(itemName))} from list`;
  const [deleteFromMyMares, deleteMareResponse] = useDeleteFromMyMaresMutation();
  const [deleteFromFavStallions, deleteFavStallionResponse] = useDeleteFromFavStallionsMutation();
  const [deleteFromFavDamsire, deleteFavDamsireResponse] = useDeleteFromFavDamsiresMutation();
  const [deleteFromFavFarms, deleteFavFarmResponse] = useDeleteFromFavFarmsMutation();
  const [deleteFarmUser, deleteFarmUserResponse] = useDeleteUserMutation()
  const [deleteMareListCSV, deleteMareListCSVResponse] = useDeleteMareListMutation()

  const showText = () => {
    if (customMessage)
      return <Typography variant='h5'>{customMessage}</Typography>
    return (
      <Box>
        <InputLabel>Please confirm if you would like to remove </InputLabel>
        <InputLabel>{capitalizeCountry(toPascalCase(itemName))} from your {toPascalCase(tablename)} list.</InputLabel>
      </Box>)
  }
  const notifyRemove = () =>
    toast.success('Admin User Removed Successfully.', {
      autoClose: 2000,
    });
  // handler for table name click
  const handleClick = () => {
    switch (tablename) {
      case 'Favourite Mares':
        if (itemId) deleteFromMyMares({ horseId: itemId });
        close();
        break;
      case 'Favourite Stallions':
        if (itemId) deleteFromFavStallions({ stallionId: itemId });
        close();
        break;
      case 'Favourite Damsires':
        if (itemId) deleteFromFavDamsire({ horseId: itemId });
        close();
        break;
      case 'Favourite Farms':
        if (itemId) deleteFromFavFarms({ farmId: itemId });
        close();
        break;
      case 'User List':
        if (farmId)
        deleteFarmUser({ invitationId: parseInt(itemId), farmId }).then((res) => {
          let response: any = res;
          if (response?.error) {
            toast.error(response?.error?.data?.message, {
              autoClose: 2000,
            })
          } else {
            notifyRemove()
          }
        }

          // )           
        );
        close();
        break;
      case 'Users':
        if (farmId)
          deleteFarmUser({ invitationId: parseInt(itemId), farmId }).then((res) => {
            let response: any = res;
            if (response?.error) {
              toast.error(response?.error?.data?.message, {
                autoClose: 2000,
              })
            } else {
              notifyRemove()
            }
          }

            // )           
          );
        close();
        break;
      case 'My MareLists':
        if (farmId)
          deleteMareListCSV([itemId, farmId]);
        close();
        break;
      case 'My MaresLists':
        if (farmId)
          deleteMareListCSV([itemId, farmId]);
        close();
        break;
    }
  }
  if (deleteMareResponse.isSuccess || deleteFavStallionResponse.isSuccess || deleteFavDamsireResponse.isSuccess
    || deleteFavFarmResponse.isSuccess || deleteFarmUserResponse.isSuccess || deleteMareListCSVResponse.isSuccess) {
    close()
  }
  else if (deleteMareResponse.isError || deleteFavStallionResponse.isError || deleteFavDamsireResponse.isError
    || deleteFavFarmResponse.isError || deleteMareListCSVResponse.isError) {
  }
  return (
    <Box className='remove-from-list'>
      <Typography variant='h4'>{headerText}</Typography>
      <Typography variant='h5'>{showText()}</Typography>
      <CustomButton className='lr-btn' onClick={handleClick}>Confirm</CustomButton>
    </Box>
  )
}

export default Confirm