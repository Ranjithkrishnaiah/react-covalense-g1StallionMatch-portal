import React, { useEffect, useState } from 'react';
import { Button, Grid, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { Images } from 'src/assets/images';
import { useSelector, useDispatch } from 'react-redux';
import { CustomButton } from 'src/components/CustomButton';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { addSocialAccounts, getPaymentDetails } from 'src/redux/actionReducers/userSlice';
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDp0YagVgeNQXpmQCV7qyzEZ8DwquGj3h4',
  authDomain: 'auth-example-24715.firebaseapp.com',
  projectId: 'auth-example-24715',
  storageBucket: 'auth-example-24715.appspot.com',
  messagingSenderId: '766819906578',
  appId: '1:766819906578:web:f5a08923573a3e6dd594cb',
};

function SocialAccounts() {
  const dispatch = useDispatch();
  const connectedsocialAccounts: any = useSelector((state: any) => state.userSlices.socialAccounts);
  const [showSocialModal, setShowSocialModal] = useState<boolean>(false);
  const [userObj, setUserObj] = React.useState<any>({});

  const handleModal = (value: boolean) => {
    setShowSocialModal(value);
  };

  const handleDisconnect = (value: any) => {
    const filterData: any = connectedsocialAccounts.filter(
      (item: any) => item.socialType !== value
    );
    dispatch(addSocialAccounts(filterData));
  };

  const renderMethod = (data: any) => {
    let socialIcon: string = '';
    let socialType: string = '';
    let socialTypeValue = '';

    if (data?.socialType?.toLowerCase() === 'google') {
      socialIcon = Images.GoogleLarge;
      socialType = 'Google';
      socialTypeValue = '1';
    }
    if (data?.socialType?.toLowerCase() === 'apple') {
      socialIcon = Images.AppleLarge;
      socialType = 'Apple';
      socialTypeValue = '2';
    }
    if (data?.socialType?.toLowerCase() === 'twitter') {
      socialIcon = Images.TwitterLarge;
      socialType = 'Twitter';
      socialTypeValue = '3';
    }

    return (
      <>
        <Stack direction="row">
          <Box>
            <img src={socialIcon} alt="Google" />
          </Box>
          <Box flexGrow={1} pl={2}>
            <Stack>
              <Box>
                <Typography variant="h6">{socialType}</Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#B0B6AF' }}>
                  Matthew Ennis
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Box>
              <Link to="./" className="edit" onClick={() => handleDisconnect(data?.socialType)}>
                Disconnect
              </Link>
            </Box>
          </Box>
        </Stack>
      </>
    );
  };

  // get users data from local storage
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserObj(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, [userObj]);

  return (
    <>
      <Box mt={5}>
        <Typography variant="h3">Connected Social Accounts</Typography>
      </Box>
      <Box mt={4}>
        <Grid container lg={12} xs={12}>
          <Grid item lg={9} xs={12}>
            {connectedsocialAccounts.map((item: any) => {
              return renderMethod(item);
            })}
            <Box className="social-account">
              <Box>
                <img src={Images.GoogleLarge} alt="SMP-Google" />
              </Box>
              <Box ml={2}>
                <Typography variant="h6">Google</Typography>
                <Typography variant="h5">{userObj?.fullName}</Typography>
              </Box>
            </Box>
            {/* <Box>
                <Button variant="text" className="add-btn" onClick={() => handleModal(true)}>
                  <i className="icon-Plus-new">+</i>
                </Button>
              </Box> */}
          </Grid>
        </Grid>
      </Box>
      {/* Add social accounts popup */}
      <WrapperDialog
        open={showSocialModal}
        resetPaymentModal={showSocialModal}
        title="Select Social Accounts"
        onClose={() => handleModal(false)}
        body={AddSocialAccounts}
      />
    </>
  );
}

const AddSocialAccounts = (title: string, onClose: any, reset: any) => {
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentKey, setPaymentkey] = useState('');
  const userDta: any = localStorage.getItem('user');
  const userDetails: any = userDta ? JSON.parse(userDta) : '';
  const connectedSocialAccounts: any = useSelector((state: any) => state.userSlices.socialAccounts);
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  useEffect(() => {}, []);

  const handleClose = () => {
    onClose();
    setPaymentkey('');
  };

  const addMethod = (value: any) => {
    let data: any = connectedSocialAccounts;
    let payload: any = {
      socialType: value,
    };
    data = data.concat([payload]);
    dispatch(addSocialAccounts(data));
    handleClose();
  };

  // const fetchPaymentType = async () => {
  //   const payload = {
  //     email: userDetails.email,
  //     paymentMethod: parseInt(paymentKey)
  //   }

  //   var config: any = {
  //     method: 'post',
  //     url: `${api.baseUrl}/member-paytype-access/customer`,
  //     headers: {
  //       'authorization': `Bearer ${localStorage?.accessToken}`,
  //       'Content-Type': 'application/json'
  //     },
  //     data: payload
  //   };

  //   await axios(config)
  //     .then((response: any) => {
  //       if (response?.data) {
  //         setPaymentDetails(response.data)
  //       }
  //       getPaymentMethods()
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }

  let handleGoogleSignIn = async () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    // console.log("user ->", user)
  };

  let handleTwitterSignIn = async () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const res = await signInWithPopup(auth, twitterProvider);
    const user = res.user;
    // console.log("user ->", user)
  };

  let handleAppleSignIn = async () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log("result --->", result)
        // The signed-in user info.
        const user = result.user;
        // Apple credential
        // const credential = OAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        // const idToken = credential.idToken;

        // ...
      })
      .catch((error) => {
        console.log('err -->', error);
      });
  };

  const getPaymentkey = (paymentType: any) => {
    // console.log("paymentType ->", paymentType)
    // setPaymentkey(paymentType)
  };
  const existType = connectedSocialAccounts.map((item: any) => item?.socialType?.toLowerCase());

  return (
    <>
      <Box className="payment-model-box">
        {/* <Typography variant='h4'>Add Payment Method</Typography> */}
        <Box className="payment-model">
          <List disablePadding>
            <ListItem>
              <ListItemButton
                onClick={existType.includes('card') ? () => {} : () => handleGoogleSignIn()}
                style={{
                  backgroundColor: paymentKey === '1' ? '#f0f0f0' : '',
                  cursor: existType.includes('card') ? 'no-drop' : 'pointer',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <Box>
                  <img src={Images.GoogleLarge} alt="Credit Card" />
                  <Typography variant="h6">Google</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </List>
          <List disablePadding>
            <ListItem>
              <ListItemButton
                onClick={existType.includes('paypal') ? () => {} : () => handleAppleSignIn()}
                style={{
                  backgroundColor: paymentKey === '2' ? '#f0f0f0' : '',
                  cursor: existType.includes('paypal') ? 'no-drop' : 'pointer',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <Box>
                  <img src={Images.AppleLarge} alt="PayPal" />
                  <Typography variant="h6">Apple</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </List>
          <List disablePadding>
            <ListItem>
              <ListItemButton
                onClick={existType.includes('twitter') ? () => {} : () => handleTwitterSignIn()}
                style={{
                  backgroundColor: paymentKey === '2' ? '#f0f0f0' : '',
                  cursor: existType.includes('paypal') ? 'no-drop' : 'pointer',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <Box>
                  <img src={Images.TwitterLarge} alt="twitter" />
                  <Typography variant="h6">Twitter</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <CustomButton
            fullWidth
            className="lr-btn"
            onClick={() => addMethod(paymentKey)}
            disabled={paymentKey ? false : true}
          >
            Save
          </CustomButton>
        </Box>
      </Box>
    </>
  );
};

export default SocialAccounts;
