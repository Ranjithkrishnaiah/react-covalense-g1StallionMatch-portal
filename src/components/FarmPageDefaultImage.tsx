import { Box, StyledEngineProvider, Typography } from '@mui/material';
import { useLocation } from 'react-router';
import useAuth from 'src/hooks/useAuth';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';

export default function FarmPageDefaultImage() {
  let isFarmOwner = false;
  let accessLevel = null;
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { pathname } = useLocation();
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  // authentication check
  const { authentication } = useAuth();
  // API call to get farmList
  const { data: farmList } = useGetUsersFarmListQuery(null, { skip: !authentication });
  const isFarmUser = farmList?.find((res: any) => res.farmId == farmID);
  if (isFarmUser) {
    isFarmOwner = isFarmUser.isFamOwner;
    accessLevel = isFarmUser.accessLevel;
  }
  return (
    <StyledEngineProvider injectFirst>
      <Box className="farm-default-ph">
        <Box>
          <i className="icon-Photograph" />
          {(isLoggedIn && isFarmOwner) || accessLevel === 'Full Access' ? (
            <Typography variant="h6">
              No farm images uploaded. Please add at least
              <br />
              one photo by clicking ‘Edit Profile’ above.
            </Typography>
          ) : (
            <Typography variant="h6">Currently no farm images</Typography>
          )}
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}
