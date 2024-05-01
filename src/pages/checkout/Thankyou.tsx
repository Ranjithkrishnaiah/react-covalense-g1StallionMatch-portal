import { useLocation, useParams } from 'react-router-dom';
import { Container, Grid, StyledEngineProvider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import '../../components/checkout/checkout.css'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGetLatestOrderQuery } from 'src/redux/splitEndpoints/getCurrentOrder'
// import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit'
import { usePostToPaypalSuccessMutation } from 'src/redux/splitEndpoints/postPaypalSuccess';
import { usePostToPaypalCancelMutation } from 'src/redux/splitEndpoints/postPaypalCancel';
import { Spinner } from '../../components/Spinner';
import OrderList from './OrderList';
import { useGetOrderListByIdQuery } from 'src/redux/splitEndpoints/getOrdersById';
import { useDispatch, useSelector } from 'react-redux';
import { addToReportCart, addToUserReportCart, setIsPaymentSucess } from 'src/redux/actionReducers/reportSlice';
import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import useAuth from 'src/hooks/useAuth';
import { usePostToTaxDetailsMutation } from 'src/redux/splitEndpoints/postCreatePaypalPaymentIntent';

function Thankyou() {
  const location = useLocation()
  const dispatch = useDispatch();

  // const userDetails: any = JSON.parse(localStorage.getItem('user') || "");
  let name: string = "";
  const { authentication } = useAuth();
  const { data: latestOrder, isSuccess: isOrderSuccess } = useGetLatestOrderQuery();
  //This query below is essential to fetch the updated cart items after the order is placed.
  const [paypalSuccess, response] = usePostToPaypalSuccessMutation();
  const [paypalCancel, cancelResponse] = usePostToPaypalCancelMutation();
  const [paypalStatus, setPaypalStatus] = React.useState('success');
  const [isPaypalUpdated, setIsPaypalUpdated] = React.useState(false);
  const [orderId, setOrderId] = React.useState('');
  const [isPaypal, setIsPaypal] = React.useState(false);
  const [payeerId, setPayeerId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [skipCallLatestOrder, setSkipCallLatestOrder] = React.useState(true);
  const [taxParams, setTaxParams] = React.useState<any>();
  // let orders: any = window.localStorage.getItem('cartItems') || '';
  const countData: any = localStorage.getItem("discountInfo");
  const discountData = countData && JSON.parse(countData);
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: countriesList } = useCountriesQuery();
  const [getTaxDetails, responseTaxDetails] = usePostToTaxDetailsMutation();

  const localCartReportList: any = useSelector((state: any) => state.reportSlices.cartList)
  let orders: any = localCartReportList || [];
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');

  const { data: latestOrderlist, isSuccess: latestOrderlistResponse } = useGetOrderListByIdQuery(orderId, { skip: skipCallLatestOrder || false });
  const updateData = latestOrderlist?.[0]?.orderedItems ? latestOrderlist[0].orderedItems : []

  const getCurrencyIdFromCountryList = () => {
    const countryName = window.localStorage.getItem("geoCountryName");

    let userCurrencyId: any = null;

    if (countriesList) {
      for (let index = 0; index < countriesList?.length; index++) {
        const element: any = countriesList[index];
        if (element?.countryName === countryName) {
          userCurrencyId = element?.preferredCurrencyId;
          break;
        }

      }
    }
    return userCurrencyId;
  }

  const getCountryCodeFromGeoCountry = () => {
    let userCountryCode: any = null;
    const user = window.localStorage.getItem("geoCountryName");
    if (countriesList) {
      for (let index = 0; index < countriesList?.length; index++) {
        const element: any = countriesList[index];
        if (element?.countryName === user) {
          userCountryCode = element?.countryA2Code;
          break;
        }
      }
    }
    return userCountryCode;
  }

  // Get the cart items
  React.useEffect(() => {
    // console.log('callled in dis')
    if (latestOrderlistResponse) {
      if (localStorage.accessToken) {
        let list: any = [];
        updateData?.forEach((v: any, index: number) => {
          list.push({ amount: v.price, reference: v.productName + index })
        })
        let subTotalArr1 = updateData
          ? updateData?.length
            ? updateData?.map((val: any) => val.price)
            : [0]
          : [0];
        let subTotal: number = updateData ? updateData.length ? subTotalArr1.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
        let currencyCode: any = currencies?.filter((v: any) => v?.label === user?.memberaddress[0]?.currencyCode)[0]?.id;
        if (currencyCode == 1) {
          getTaxDetails({
            postal_code: user?.memberaddress[0]?.postcode,
            items: list,
            total: subTotal,
            country_code: user?.memberaddress[0]?.countryCode?.substring(0, 2),
            currency: authentication ? currencyCode : getCurrencyIdFromCountryList() ? getCurrencyIdFromCountryList() : 1
          })
        }
      }
      else {
        if (orders) {
          console.log(orders, updateData, 'ORD')
          const user = window.localStorage.getItem("geoCountryName");
          const userGeoPostalCode = window.localStorage.getItem("geoPostalCode");
          let userCountryCode: any = null;
          if (countriesList) {
            for (let index = 0; index < countriesList?.length; index++) {
              const element: any = countriesList[index];
              if (element?.countryName === user) {
                userCountryCode = element?.countryA2Code;
                break;
              }
            }
            let list: any = [];
            updateData?.forEach((v: any, index: number) => {
              list.push({ amount: v.price, reference: v.productName + index })
            })
            let subTotalArr1 = updateData
              ? updateData?.length
                ? updateData?.map((val: any) => val.price)
                : [0]
              : [0];
            let subTotal: number = updateData ? updateData.length ? subTotalArr1.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
            let currencyCode: any = getCurrencyIdFromCountryList();
            if (currencyCode == 1) {
              getTaxDetails({
                postal_code: userGeoPostalCode,
                items: list,
                total: subTotal,
                country_code: userCountryCode,
                currency: currencyCode ? currencyCode : 1
              })
            }
          }
        }
      }
    }
  }, [latestOrderlistResponse, latestOrderlist]);

  useEffect(() => {
    updatePaypalStatus();
  }, []);

  useEffect(() => {
    if (responseTaxDetails.isSuccess) {
      setTaxParams(responseTaxDetails?.data?.data);
      // localStorage.setItem('invalidZipcode', 'false');
      // console.log(responseTaxDetails, 'responseTaxDetails');
    }
  }, [responseTaxDetails.isLoading])

  const paymentIdValue = () => {
    let paymentIdString = location?.search?.split('paymentId')
    let p_id = paymentIdString[1] ? paymentIdString[1] : paymentIdString[0]
    let p_id_string = p_id.includes("=") ? p_id?.split("=")[1] : p_id
    let paymentValue = p_id_string.includes("&") ? p_id_string.split('&')?.[0] : p_id_string
    return paymentValue
  }

  const payeerIdValue = () => {
    let paymentIdString = location?.search?.split('PayerID')
    let p_id = paymentIdString[1] ? paymentIdString[1] : paymentIdString[0]
    let payeerValue = p_id.includes("=") ? p_id?.split("=")[1] : p_id
    return payeerValue;
  }

  const payeerEmail = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("email");
    return c;
  }

  const payeerCoupanId = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("couponId");
    return c;
  }

  React.useEffect(() => {
    let reportList = localStorage.getItem('orderReports');
    let reportListData = reportList ? JSON.parse(reportList) : [];
    window.localStorage.setItem("orderReports", "")
    dispatch(addToReportCart(reportListData))
  }, [])

  React.useEffect(() => {
    if (location.search.includes('paymentId')) {
      setOrderId(paymentIdValue())
      setPayeerId(payeerIdValue())
    } else {
      setOrderId(paymentIdValue())
    }
    if (isOrderSuccess) {
    }
    // updatePaypalStatus()
  }, [isOrderSuccess])

  let updatePaypalStatus = async () => {
    const userGeoPostalCode = window.localStorage.getItem("geoPostalCode");
    let PostObject = {
      "paymentId": paymentIdValue(),
      "PayerID": payeerIdValue(),
      "orderId": paymentIdValue(),
      "email": payeerEmail(),
      "postal_code": authentication ? user?.memberaddress[0]?.postcode : userGeoPostalCode,
      "country_code": authentication ? user?.memberaddress[0]?.countryCode?.substring(0, 2) : getCountryCodeFromGeoCountry(),
      ...(payeerCoupanId() === undefined && { "couponId": payeerCoupanId() }),
    }
    if (paypalStatus == 'success') {
      let res: any = await paypalSuccess(PostObject)

      if (res) {
        setIsPaypalUpdated(true)
        dispatch(addToUserReportCart([]))
        dispatch(setIsPaymentSucess(true))
        dispatch(addToReportCart([]));
        localStorage.setItem('orderReports', '');
        localStorage.setItem('payPalPayment', 'Success');
        setSkipCallLatestOrder(false);
      }
    } else {
      let res: any = await paypalCancel(PostObject)
      if (res) {
        dispatch(addToUserReportCart([]))
        setIsPaypalUpdated(true)
      }
    }
  }

  return (
    <StyledEngineProvider injectFirst>
      <Box pb={10} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {
          isPaypalUpdated ?
            <>
              <Container maxWidth="lg">
                <Grid container mt={5} mb={2}>
                  <Grid item lg={12} xs={12}>
                    <Typography variant='h2'>
                      {
                        localStorage.user ? `Thank you, ${JSON.parse(localStorage.user).fullName}` : `Thank you`
                      }

                    </Typography>
                  </Grid>
                </Grid>
              </Container>
              <Container maxWidth='lg'>
                <Grid container spacing={3}>
                  <Grid item lg={7} sm={6} xs={12}>
                    <Box className='checkout-box thankyou'>
                      <Box sx={{ px: { lg: '3.7rem', sm: '3rem', xs: '2rem' } }}>
                        <Box className='success-icon'>
                          <i className='icon-Confirmed-24px' />
                        </Box>
                        <Box mt={4}>
                          <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular' }}>
                            Thank you. You order has been successfully completed.
                          </Typography>
                        </Box>
                        <Box mt={4}>
                          <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular' }}>
                            Order ID : {latestOrderlist?.[0]?.orderId}
                            {/* {latestOrder && '0000'.substring(latestOrder[0]?.orderId.length - 2) + latestOrder[0]?.orderId} */}
                          </Typography>
                        </Box>
                        {
                          localStorage.user ?
                            <Box mt={4}>
                              <Typography variant='h6'>
                                You can view your order details by going to the
                                <strong>Order History</strong> section within
                                <Link to='/user/profile?section=OrderHistory'>Your Profile.</Link>
                              </Typography>
                              {/* <Typography variant='h6'>
                       View your order details by going to <Link to='#'>Order History.</Link> You can also regester for a free account which will unlock all the features of Stallion Match.
                       </Typography> */}
                            </Box> :
                            <Box mt={4}>
                              <Typography variant='h6'>
                                You can view your order details in your email.
                                You can also register for a free account which will
                                unlock all the features of
                                Stallion Match.
                              </Typography>
                              {/* <Typography variant='h6'>
                       View your order details by going to <Link to='#'>Order History.</Link> You can also regester for a free account which will unlock all the features of Stallion Match.
                       </Typography> */}
                            </Box>
                        }

                        <Box mt={4}>
                          <Typography variant='h6'>
                            You will receive an email regarding details on your purchase shortly.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={5} sm={6} xs={12}>
                    <OrderList orders={updateData} taxParams={taxParams} setLoading={setLoading} viewOnly={true} discountData={discountData} />
                  </Grid>
                </Grid>
              </Container>
            </>
            :
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
              <Spinner />
            </Box>
        }
      </Box>
    </StyledEngineProvider>
  )
}

export default Thankyou