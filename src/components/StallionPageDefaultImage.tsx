import { Box, StyledEngineProvider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useGetStallionInfoQuery } from 'src/redux/splitEndpoints/getStallionInfoSplit';

export default function StallionPageDefaultImage() {
  const [myFarmId, setMyFarmId] = useState('');
  const { pathname } = useLocation();
  const pathSplitForStallion = pathname.split('/');
  const stallionID: any = pathSplitForStallion[pathSplitForStallion?.length - 2];
  const action: string = pathSplitForStallion[pathSplitForStallion?.length - 1];
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const {
    data: stallionInfoData,
    isSuccess: isStallionInfoSuccess,
    isLoading,
  } = useGetStallionInfoQuery(stallionID);

  useEffect(() => {
    if (isStallionInfoSuccess) {
      setMyFarmId(stallionInfoData?.farmId);
    }
  }, [isStallionInfoSuccess]);
  let isFarmOwner = false;
  let accessLevel = null;
  const isFarmUserReal = farmUser?.myFarms?.find((res: any) => res.farmId === myFarmId);

  if (isFarmUserReal) {
    isFarmOwner = isFarmUserReal?.isFamOwner;
    accessLevel = isFarmUserReal?.accessLevel;
  }
  return (
    <StyledEngineProvider injectFirst>
      <Box className="stallion-default-ph">
        <Box>
          <i className="icon-Photograph" />
          {(isLoggedIn && isFarmOwner) || (isLoggedIn && accessLevel === 'Full Access') ? (
            <Typography variant="h6">
              No stallion images uploaded. Please add at least
              <br />
              one photo by clicking ‘Edit Profile’ above.
            </Typography>
          ) : (
            <Typography variant="h6">Currently no stallion images</Typography>
          )}
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}
