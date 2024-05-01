import { Avatar, Divider, Grid, Paper, Popover, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router';
import { Farm } from 'src/@types/breederProps';
import { Images } from 'src/assets/images';
import ProfileAvatar from 'src/components/MemberProfile'
import { useDeleteFromMyFarmsMutation } from 'src/redux/splitEndpoints/deleteFarm';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import useAuth from 'src/hooks/useAuth';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import { toPascalCase } from 'src/utils/customFunctions';

function ProfileImage() {

  const [user, setUser] = useState<any>({});
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  const [currentFarmName, setCurrentFarmName] = useState<string | null>(null);
  const [farmAnchorEl, setFarmAnchorEl] = React.useState<null | EventTarget & Element>(null);
  const [copied, setCopied] = React.useState(false);
  const [deleteFarm, response] = useDeleteFromMyFarmsMutation();
  const navigate = useNavigate();
  const id = farmAnchorEl ? 'farm-popover' : undefined;
  const { authentication } = useAuth();
  const { data : userProfileData, isSuccess: getProfileSuccess } = useGetProfileImageQuery(null,{skip: !authentication});
  const farmOptions = ["Copy Farm URL", "Farm Dashboard", "Farm Page", "Stallion roster", "Remove"];
  

  // get user info
  useEffect(() => {
    let SampleData = {
      id: 12,
      fullName: 'Sample',
    };
    if (getProfileSuccess) {
      setUser(userProfileData || {} || SampleData);
    }else {
      setUser( {} || SampleData);
    }
  }, [userProfileData]);
  
  const { data: userFarmListData } = useGetUsersFarmListQuery(null, { skip: !authentication });

  // path list for navigation
  const paths = {
    farmDashboard: '/dashboard/',
    farmPage: '/stud-farm/',
    stallionroster: '/dashboard/stallion-roster/',
    notifications: '/user/notifications',
    memberProfile: '/user/profile/',
    myHorses: '/dashboard/my-horses/',
    messages: '/messages/',
  }

  // Show message on successfully copying url
  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  }

  // Get URL
  const url = window.location.host + paths.farmDashboard;
  let farmUrl: string = "";
  if (currentFarmId) {
    const [id, name] = currentFarmId.split(',');
    farmUrl = `${url}${currentFarmName}/${id}`;
  }

  // Navigate to provided url's
  const goToPage = (url: string) => {

    if (currentFarmId) {
      const [id] = currentFarmId.split(',')
      navigate(`${url}${currentFarmName}/${id}`)
    }

    if (url.includes("roster") && currentFarmId) {
      const [id] = currentFarmId.split(',')
      navigate(`${url}${id}`);
    }
  }

  // Delete farm
  function removeFarm() {
    deleteFarm({ farmId: currentFarmId })
    setFarmAnchorEl(null)
  }

  // Call function based on there provided options
  const mapFunction = (evt: React.SyntheticEvent, element: string) => {
    let executeFunction: any = null;
    switch (element) {
      case "Copy Farm URL":
        executeFunction = onSuccessfulCopy
        executeFunction()
        break;
      case "Farm Dashboard":
        executeFunction = () => goToPage(paths.farmDashboard)
        executeFunction()
        break
      case "Farm Page":
        executeFunction = () => goToPage(paths.farmPage)
        executeFunction()

        break
      case "Stallion roster":
        executeFunction = () => goToPage(paths.stallionroster)
        executeFunction()
        break
      case "Remove":
        executeFunction = removeFarm
        executeFunction()
        break
      default:
        return executeFunction
    }
  }

  // Toggle farm popover
  const toggleFarmPopover = (event: React.SyntheticEvent,farm:any) => {
    setCurrentFarmId(event.currentTarget.id)
    if(farm) {
      setCurrentFarmName(farm?.farmName)
    }
    setFarmAnchorEl(event.currentTarget)
  }

  return (
    <Grid item lg={4} xs={12}>
      <Stack className='member-profile'>
        {/* Profile avatar */}
        <ProfileAvatar user={user}/>
        {/* Profile Info */}
        <Box mt={1}>
          <Typography variant='h4'>{toPascalCase(user?.fullName)}</Typography>
          <Typography variant='h6' sx={ { color: '#626E60' } }>
          {user.memberaddress ? user?.memberaddress[0]?.stateName : ""} 
            {user.memberaddress && user?.memberaddress[0]?.stateName && user?.memberaddress[0]?.countryName ? "," : ""} 
            {user.memberaddress ? user?.memberaddress[0]?.countryName : ''}
          </Typography>
        </Box>
        {/* Farm list */}
        <Box mt={5} sx={ { width: '100%' } }>
          <Typography variant='h5' sx={ { fontFamily: 'Synthese-Regular' } } pb={1}>
            {"Your Farms"}</Typography>
          {(!userFarmListData || userFarmListData?.length === 0 ) ? (
            <>
            <Box className='noFarmsbox-wrapper'>
            <Grid container lg={12} xs={12} my={1} py={1} className='List-content' mb={0}>
              <Grid item lg={10} xs={10} pl={2} sx={ { display: 'flex', alignItems: 'center' } }>
                <Avatar alt="profile" src={Images.farmplaceholder} style={ { marginRight: '10px' } } />
                <Typography variant='h6'>Add Farm</Typography>
                
                {/* <Typography variant='h6' sx={ { color: '#626E60' } } pl={1}> ({farm.isActive? "Approved" : 'pending'})</Typography> */}
              </Grid>
              <Grid item lg={2} xs={2} sx={ { textAlign: 'center' } }>
                <i className='icon-Dots-horizontal' onClick={(e) => toggleFarmPopover(e,undefined)} />
              </Grid>
            </Grid> 
            <Box className='nofarm-box'>
                  <Typography variant='h6'>
                    Create a farm and add your stallion(s) now to allow breeders to Stallion Match their mare for free.
                  </Typography>
                </Box>
                </Box>
            </>):(
            userFarmListData?.map((farm: Farm) => (
              <Grid container lg={12} xs={12} my={1} py={1} className='List-content' key={farm.farmId}>
                <Grid item lg={10} sm={11} xs={10} pl={2} sx={ { display: 'flex', alignItems: 'center' } } className='memberFarmheadGrid'>
                  <Avatar alt="profile" src={farm.profilePic || Images.farmplaceholder} style={ { marginRight: '4px' } } />
                  <Typography variant='h6' className='memberFarmhead'>{toPascalCase(farm.farmName)}</Typography>                  
                  {!farm.isActive && <Typography variant='h6' sx={ { color: '#626E60' } } pl={1}>({'Pending'})</Typography>}
                </Grid>
                <Grid item lg={2} sm={1} xs={2} sx={ { textAlign: 'right' } }>
                  {farm.isActive ? <i aria-describedby={farm.farmId} id={farm.farmId} className='icon-Dots-horizontal' onClick={(e) => toggleFarmPopover(e,farm)} /> : ""}
                </Grid>
              </Grid>)))}

        </Box>
      </Stack>
      {/* Farm options */}
      <Popover
        sx={ { display: { lg: 'flex', xs: 'flex' } } }
        id={id}
        open={Boolean(farmAnchorEl)}
        anchorEl={farmAnchorEl}
        onClose={() => setFarmAnchorEl(null)}
        anchorOrigin={ {
          vertical: 'bottom',
          horizontal: 'right',
        } }
        transformOrigin={ {
          vertical: 'top',
          horizontal: 'right',
        } }
        className='sm-dropdown'
      >
        <Box className='dropdown-menu'>
          {farmOptions?.map((element: any, index: number) => (<Box key={element + '-' + index} onClick={(evt) => mapFunction(evt, element)}>
            {index === 0 ? <CopyToClipboard text={farmUrl} onCopy={onSuccessfulCopy}>
              <Box sx={ { paddingX: 2, paddingY: '12px' } } className={"pointerOnHover"}><i className='icon-Link' /> {!copied ? "Copy Farm URL" : "Copied!"}</Box>
            </CopyToClipboard> :
              <Box sx={ { paddingX: 2, paddingY: '12px' } } className={"pointerOnHover"}>{element}</Box>
            }
            <Box>
              {index < farmOptions.length - 1 ? <Divider /> : ""}
            </Box>
          </Box>
          ))}
        </Box>
      </Popover>
      {/* End Farm options */}
    </Grid>
  )
}

export default ProfileImage