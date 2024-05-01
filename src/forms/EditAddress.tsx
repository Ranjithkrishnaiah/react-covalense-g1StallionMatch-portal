import { Box, Button, Divider, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useEditAddressMutation } from '../redux/splitEndpoints/editAddress';
import '../layouts/main/layout.css'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import useAuth from 'src/hooks/useAuth';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import { toast } from 'react-toastify';

function EditAddress() {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const DropProps: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '0px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        marginTop: '-1px',
        borderRadius: '0px 0px 6px 6px',
        boxSizing: 'border-box',
      },
    },
  };

  const { authentication } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const { data: countriesList } = useCountriesQuery();
  const [sendEditedAddress, response] = useEditAddressMutation();
  const { data: userInfo, error, isFetching, isLoading, isSuccess } = useGetProfileImageQuery(null, { skip: !authentication, refetchOnMountOrArgChange: true });
  const memberInfo = userInfo?.memberaddress[0];
  const [countryId, setCountryId] = React.useState("");
  const [address, setAddress] = React.useState(memberInfo?.address);
  const [postalCode, setPostalCode] = React.useState(memberInfo?.postcode);

  // set the country info in the state
  useEffect(() => {
    setCountryId(memberInfo?.countryId ? memberInfo?.countryId : 'none');
    setAddress(memberInfo?.address ? memberInfo?.address : '');
    setPostalCode(memberInfo?.postcode ? memberInfo?.postcode : '');
    if (userInfo) localStorage.setItem('user', JSON.stringify(userInfo));
  }, [userInfo,isFetching]);

  // set the country info in the state
  useEffect(() => {
    if (response.isSuccess) {
      toast.success('Address updated successfully')
    }
    let res: any = response;
    if (response.isError) {
      if (res?.error.data.error || res?.error.data.message || res?.error.data.errors) {
        if (res?.error.data.errors) {
          let res1: any = Object.values(res?.error?.data?.errors);
          if (res1?.length) {
            toast.error(res1[0]);
          }
        } else {
          toast.error(res?.error.data.message);
        }
      }

    }
  }, [response.isLoading]);

  // Submit the address form
  const handleAddressSubmit = async (evt: any) => {
    let res: any = await sendEditedAddress({ countryId: countryId, address: address, postcode: postalCode });
    setEditMode(false);
  };

  return (
    <>
      <Box mt={3} pb={1}>
        {/* Display user country */}
        <Stack direction="row" className='countryMemberDropdown'>
          <Box flexGrow={1}>
            <Typography variant="h6">Country</Typography>
          </Box>
          <Box>
            <Stack direction="row">
              <Button
                className={`cancel ${editMode ? 'show' : 'hide'}`}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                className={`edit ${editMode ? 'hide' : 'show'}`}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
              <Button
                className={`edit ${editMode ? 'show' : 'hide'}`}
                onClick={handleAddressSubmit}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Stack>
        {/* Edit country form */}
        <Stack>
          <Box className='countryDropdownMember'>
            {editMode && isSuccess ?
              <Select
                className="membercountryDropdownBox"
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{ position: 'relative' }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  ...DropProps,
                }}
                value={countryId}
                onChange={(e: any) => { setCountryId(e.target.value) }}
              >
                <MenuItem value="none" className="selectDropDownList countryDropdownList" disabled><em>Select Country</em></MenuItem>
                {
                  countriesList?.map(({ id, countryName }) => {
                    return <MenuItem className="selectDropDownList countryDropdownList" value={id} key={id} title={countryName}>{countryName}</MenuItem>
                  })}
              </Select>
              :
              <Typography variant="h6">{memberInfo?.countryName}</Typography>
            }
          </Box>
        </Stack>
      </Box>
      <Box pb={2} className='addressmember'>
        <Stack direction="row">
          <Box flexGrow={1}>
            <Typography variant="h6">Zip Code</Typography>
          </Box>
        </Stack>
        {/* Edit address form */}
        <Stack>
          <Box>
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              // placeholder={memberInfo?.address}
              placeholder={"Please Enter Zip Code"}
              onChange={(e: any) => { setPostalCode(e.target.value) }}
              value={postalCode}
              disabled={!editMode}
            />
          </Box>
        </Stack>
        <Stack direction="row">
          <Box flexGrow={1}>
            <Typography variant="h6">Address</Typography>
          </Box>
        </Stack>
        {/* Edit address form */}
        <Stack>
          <Box>
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              // placeholder={memberInfo?.address}
              placeholder={memberInfo?.address ? memberInfo?.address : "Please Enter Address"}
              onChange={(e: any) => { setAddress(e.target.value) }}
              defaultValue={memberInfo?.address}
              disabled={!editMode}
            />
          </Box>
        </Stack>
        <Divider orientation="horizontal" flexItem sx={{ borderColor: '#B0B6AF' }} />
      </Box>
    </>
  );
}

export default EditAddress;
