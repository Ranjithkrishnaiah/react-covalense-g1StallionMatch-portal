import { Box, Button, Grid, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material'
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { api } from 'src/api/apiPaths';
import { Images } from 'src/assets/images'
import { CustomButton } from 'src/components/CustomButton';
import { Spinner } from 'src/components/Spinner';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { getPaymentDetails } from 'src/redux/actionReducers/userSlice';

function PaymentMethods() {
  const dispatch = useDispatch();
  const userDta: any = localStorage.getItem('user');
  const userDetails: any = userDta ? JSON.parse(userDta) : "";
  const paymentDataList: any = useSelector((state: any) => state.userSlices.paymentDetails)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  // Get list of payment methods
  useEffect(() => {
    getPaymentMethods()
  }, [])

  // Call added payment method api
  const getPaymentMethods = async () => {
    let apiUrl = `${api.baseUrl}/member-paytype-access`
    var config: any = {
      method: 'get',
      url: apiUrl,
      headers: {
        'authorization': `Bearer ${localStorage?.accessToken}`,
        'Content-Type': 'application/json'
      },
    };
    await axios(config).then((res: any) => {
      if (res?.data) {
        dispatch(getPaymentDetails(res?.data))
      }
    }).catch(function (error) {
    })
  }

  // Call default payment method api
  const makeDefaultPaymentMethod = async (paymentType: any) => {
    let payload = {
      email: userDetails?.email,
      paymentMethod: parseInt(paymentType)
    }
    let apiUrl = `${api.baseUrl}/member-paytype-access`
    var config: any = {
      method: 'patch',
      url: apiUrl,
      headers: {
        'authorization': `Bearer ${localStorage?.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: payload
    };
    await axios(config).then((res: any) => {
      getPaymentMethods()
    }).catch(function (error) {
    })
  }

  // Remove payment method
  const RemovePaymentMethod = async (paymentType: any) => {
    let payload = {
      email: userDetails?.email,
      paymentMethod: parseInt(paymentType)
    }
    let apiUrl = `${api.baseUrl}/member-paytype-access`
    var config: any = {
      method: 'delete',
      url: apiUrl,
      headers: {
        'authorization': `Bearer ${localStorage?.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: payload
    };
    await axios(config).then((res: any) => {
      getPaymentMethods()
    }).catch(function (error) {
    })
  }

  // close list of payment method popup
  const closeModal = () => {
    setShowPaymentModal(false)
  }

  // open list of payment method popup
  const openModal = () => {
    setShowPaymentModal(true)
  }

  // Get month by numbers
  const getMonth = (key: any) => {
    switch (key) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return key;
    }
  }

  // Render payment list
  const renderMethod = (data: any) => {
    let cardIcon: string = "";
    let cardType: string = "";
    let cardTypeValue = "";
    if (data?.paymentMethod?.toLowerCase() === "card") {
      cardIcon = Images.creditcard
      cardType = "Credit Card"
      cardTypeValue = "1"
    }
    if (data?.paymentMethod?.toLowerCase() === "paypal") {
      cardIcon = Images.PayPal
      cardType = "PayPal"
      cardTypeValue = "2"
    }


    return (
      <Stack direction='row' style={{ marginBottom: "15px" }}>
        <Box className='paymentImg'>
          <img src={cardIcon} alt='creditcard' />
        </Box>
        <Stack flexGrow={1} pl={2} className='paymentText' sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box mb={1}>
            <Typography variant='h6'>{cardType}</Typography>
          </Box>
          <Box>
            {data?.paymentMethod?.toLowerCase() === "card" ?
              <Typography variant='h6' className='fadePayment' sx={{ color: '#B0B6AF' }}>
                <span>{data?.cardDetails?.brand}</span>
                {data?.cardDetails?.last4 && ` **${data?.cardDetails?.last4} (${data?.cardDetails?.country})`}
                {' - '}
                {data?.cardDetails?.exp_month && `Exp. ${getMonth(data?.cardDetails?.exp_month)}/${data?.cardDetails?.exp_year}`}
              </Typography>
              :
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant='h6' className='fadePayment' sx={{ color: '#B0B6AF' }}>{userDetails?.email}</Typography>
              </Box>
            }
          </Box>
        </Stack>
        <Stack className='payment-right'>
          {data?.paymentMethod.toLowerCase() === "card" && <Box mb={1}>
            {!data?.cardDetails ? <a href={`${api.baseUrl}/member-paytype-access/customer/render-card/${JSON.parse(localStorage.user).id}/${uuid()}`} target="_blank" className='edit'>Add Card Details</a>
              : <a href={`${api.baseUrl}/member-paytype-access/customer/update-card/${JSON.parse(localStorage.user).id}/${uuid()}`} target="_blank" className='edit'>Change</a>}
          </Box>}
          {!data?.isDefault ? <Box mb={1}>
            <Link to={'./'} style={{ cursor: "pointer", marginBottom: "10px" }} onClick={() => makeDefaultPaymentMethod(cardTypeValue)} className='edit'>Make Default</Link>
          </Box> : ""}
          <Box mb={1}>
            <Link to={'./'} style={{ cursor: "pointer", marginBottom: "10px" }} onClick={() => RemovePaymentMethod(cardTypeValue)} className='edit'>Remove</Link>
          </Box>
        </Stack>
      </Stack>
    )
  }

  return (
    <>
      <Box mt={5}>
        <Typography variant='h3'>Payment Methods</Typography>
      </Box>
      {/* Payment list */}
      <Box mt={4} className='PaymentMethods-Tabs'>
        <Grid container lg={12} xs={12}>
          <Grid item lg={9} xs={12}>
            {paymentDataList.map((cardValue: any) => {
              return (renderMethod(cardValue))
            })}

            <Stack direction='row' mt={3}>
              <Box>
                <Button variant="text" className='add-btn' onClick={openModal}><i className='icon-Plus-new'>+</i></Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      {/* End Payment list */}

      {/* Add payment method popup */}
      <WrapperDialog
        open={showPaymentModal}
        resetPaymentModal={showPaymentModal}
        title="Select Payment Method"
        onClose={closeModal}
        body={AddPaymentMethod}
      />
    </>
  )
}

const AddPaymentMethod = (title: string, onClose: any, reset: any) => {
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentKey, setPaymentkey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userDta: any = localStorage.getItem('user');
  const userDetails: any = userDta ? JSON.parse(userDta) : "";
  const paymentDataList: any = useSelector((state: any) => state.userSlices.paymentDetails)
  const dispatch = useDispatch();

  // Close popup
  const handleClose = () => {
    onClose()
    setPaymentkey("")
  }

  // Reset payment key
  useEffect(() => {
    if (!reset) {
      setPaymentkey("")
    }
  }, [reset])

  // Call default payment method api
  const makeDefaultPaymentMethod = async (paymentType: any) => {
    let payload = {
      email: userDetails?.email,
      paymentMethod: parseInt(paymentType)
    }
    let apiUrl = `${api.baseUrl}/member-paytype-access`
    var config: any = {
      method: 'patch',
      url: apiUrl,
      headers: {
        'authorization': `Bearer ${localStorage?.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: payload
    };
    await axios(config).then((res: any) => {
      getPaymentMethods()
    }).catch(function (error) {
    })
  }

  // Call added payment method api
  const getPaymentMethods = async () => {
    let apiUrl = `${api.baseUrl}/member-paytype-access`
    var config: any = {
      method: 'get',
      url: apiUrl,
      headers: {
        'authorization': `Bearer ${localStorage?.accessToken}`,
        'Content-Type': 'application/json'
      },
    };
    await axios(config).then((res: any) => {
      if (res?.data) {
        dispatch(getPaymentDetails(res?.data))
        handleClose()
      }
    }).catch(function (error) {
      handleClose()
    })
  }

  // Select payment Type
  const fetchPaymentType = async () => {
    const payload = {
      email: userDetails.email,
      paymentMethod: parseInt(paymentKey)
    }
    setIsLoading(true)
    var config: any = {
      method: 'post',
      url: `${api.baseUrl}/member-paytype-access/customer`,
      headers: {
        'authorization': `Bearer ${localStorage?.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: payload
    };
    try {
      await axios(config)
        .then((response: any) => {
          if (response?.data) {
            setIsLoading(false)
            setPaymentDetails(response.data)
            makeDefaultPaymentMethod(parseInt(paymentKey))
            if (parseInt(paymentKey) === 1) {
              window.open(`${api.baseUrl}/member-paytype-access/customer/render-card/${JSON.parse(localStorage.user).id}/${uuid()}`, "_blank");
            }
          }
          getPaymentMethods()
        })
    } catch (error) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Set payment key
  const getPaymentkey = (paymentType: any) => {
    setPaymentkey(paymentType)
  }

  const existPaymentMethod = paymentDataList.map((item: any) => item?.paymentMethod?.toLowerCase())

  return (
    <>
      <Box className='payment-model-box'>
        {/* List of payment types including card */}
        <Box className='payment-model'>
          <List disablePadding>
            <ListItem>
              <ListItemButton onClick={existPaymentMethod.includes("card") ? () => { } : () => getPaymentkey("1")} style={{ backgroundColor: paymentKey === "1" ? "#f0f0f0" : "", cursor: existPaymentMethod.includes("card") ? "no-drop" : "pointer", opacity: existPaymentMethod.includes("card") ? ".5" : "1", filter: existPaymentMethod.includes("card") ? "grayscale(100%)" : "initial", padding: '10px', borderRadius: '8px' }}>
                <Box >
                  <img src={Images.creditcard} alt="Credit Card" />
                  <Typography variant='h6'>Credit Card</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </List>
          <List disablePadding>
            <ListItem>
              <ListItemButton onClick={existPaymentMethod.includes("paypal") ? () => { } : () => getPaymentkey("2")} style={{ backgroundColor: paymentKey === "2" ? "#f0f0f0" : "", cursor: existPaymentMethod.includes("paypal") ? "no-drop" : "pointer", opacity: existPaymentMethod.includes("paypal") ? ".5" : "1", filter: existPaymentMethod.includes("paypal") ? "grayscale(100%)" : "initial", padding: '10px', borderRadius: '8px' }}>
                <Box >
                  <img src={Images.PayPal} alt="PayPal" />
                  <Typography variant='h6'>PayPal</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        {/* End List of payment types including card */}
        <Box sx={{ textAlign: 'center' }}>
          <CustomButton
            fullWidth
            className="lr-btn"
            onClick={fetchPaymentType}
            disabled={paymentKey ? false : true}
          >
            {isLoading ?
              <div className='btn-loader'>
                <Spinner />
              </div>
              : "Save"}

          </CustomButton>
        </Box>
      </Box>
    </>
  )
}

export default PaymentMethods;
