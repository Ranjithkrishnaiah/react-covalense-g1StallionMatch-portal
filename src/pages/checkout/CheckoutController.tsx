import React, { useEffect } from 'react';
import { Box, Container, Grid, StyledEngineProvider, TextField, Typography } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import Header from './Header';
import '../../components/checkout/checkout.css';
import '../../forms/LRpopup.css';
import '../../components/WrappedDialog/dialogPopup.css';
import { Spinner } from '../../components/Spinner';
import OrderList from './OrderList';
import UserAuth from './UserAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../utils/customFunctions';
import StripeCheck from './StripeCheck';
import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { usePostToTaxDetailsMutation, usePostToCreatePaypalPaymentIntentMutation } from 'src/redux/splitEndpoints/postCreatePaypalPaymentIntent';
import useAuth from 'src/hooks/useAuth';
import useMetaTags from 'react-metatags-hook';
import { useDispatch, useSelector } from 'react-redux';
import { addToReportCart } from 'src/redux/actionReducers/reportSlice';
import axios from 'axios';
import { api } from 'src/api/apiPaths';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { toast } from 'react-toastify';

declare const window: any;

function CheckoutController() {
  const { pathname } = useLocation();
  const { authentication } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localCartReportList: any = useSelector((state: any) => state.reportSlices.cartList)
  const [loading, setLoading] = React.useState<boolean>(false);
  const [taxParams, setTaxParams] = React.useState<any>();
  const [cartItemList, setCartItemList] = React.useState<any[]>();
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  // Api call
  const { data: cartItems, isSuccess: isCartItemsSuccess, isFetching: isCartItemsFetching } = useGetCartItemsQuery(null, {
    skip: !authentication, refetchOnMountOrArgChange: true
  });
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  const [getTaxDetails, responseTaxDetails] = usePostToTaxDetailsMutation();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: countriesList } = useCountriesQuery();

  const countData: any = localStorage.getItem("discountInfo");
  const discountData = countData && JSON.parse(countData);

  // Get the subtotal value
  // let subTotalArr = cartItemList
  //   ? cartItemList.length
  //     ? cartItemList.map((val: any) => val.price)
  //     : [0]
  //   : [0];

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

  // Get the cart items
  React.useEffect(() => {
    // console.log('callled in dis')
    if (localStorage.accessToken && cartItems) {
      setCartItemList(cartItems);
      let list: any = [];
      cartItems?.forEach((v: any, index: number) => {
        list.push({ amount: v.price, reference: v.productName + index })
      })
      let subTotalArr1 = cartItems
        ? cartItems?.length
          ? cartItems?.map((val: any) => val.price)
          : [0]
        : [0];
      let subTotal: number = cartItems ? cartItems.length ? subTotalArr1.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;

      // if (!user?.memberaddress[0]?.postcode) {
      //   toast.error('Please update zip code in your profile');
      //   setTimeout(() => {
      //     // window.open('/user/profile');
      //     window.location.href = '/user/profile';
      //   }, 3000);
      // }
      let currencyCode: any = currencies?.filter((v: any) => v?.label === user?.memberaddress[0]?.currencyCode)[0]?.id;

      if (currencyCode == 1) {
        getTaxDetails({
          // postal_code: user?.memberaddress[0]?.postcode,
          items: list,
          total: subTotal,
          country_code: user?.memberaddress[0]?.countryCode?.substring(0, 2),
          currency: authentication ? currencyCode : getCurrencyIdFromCountryList() ? getCurrencyIdFromCountryList() : 1
        })
      }

    }
    else {
      if (orders) {
        // console.log(orders, 'ORD')
        navigator?.geolocation?.getCurrentPosition(
          function (position) {
            if (!authentication) {
              var Geonames = require('geonames.js');
              const geonames = new Geonames({
                username: 'cvlsm',
                lan: 'en',
                encoding: 'JSON'
              });
              let gmtOffset: any;
              let lng: any;
              let lat: any;
              geonames.timezone({ lng, lat }).then((res: any) => {
                gmtOffset = res.gmtOffset;
                lat = position.coords.latitude
                lng = position.coords.longitude
                return geonames.findNearbyPostalCodes({ lng, lat });
              }).then((loc: any) => {
                localStorage.setItem('geoPostalCode', loc.postalCodes[0].postalCode);
              }).catch(function (err: any) {
                return err.message;
              });
            }
          },
          function (error) {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
        setCartItemList(orders);
        const user = window.localStorage.getItem("geoCountryName");
        const userGeoPostalCode = window.localStorage.getItem("geoPostalCode");
        setTimeout(() => {
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
            orders?.forEach((v: any, index: number) => {
              list.push({ amount: v.price, reference: v.productName + index })
            })
            let subTotalArr1 = orders
              ? orders?.length
                ? orders?.map((val: any) => val.price)
                : [0]
              : [0];
            let subTotal: number = orders ? orders.length ? subTotalArr1.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;

            let currencyCode: any = getCurrencyIdFromCountryList();
            if (currencyCode == 1) {
              getTaxDetails({
                // postal_code: userGeoPostalCode,
                items: list,
                total: subTotal,
                country_code: userCountryCode,
                currency: currencyCode ? currencyCode : 1
              })
            }
          }

        }, 2000);

      }
    }
  }, [isCartItemsSuccess, cartItems]);


  useEffect(() => {
    if (responseTaxDetails.isSuccess) {
      if (responseTaxDetails?.data?.data) {
        setTaxParams(responseTaxDetails?.data?.data);
        // localStorage.setItem('invalidZipcode', 'false');
      }
      // else {
      //   // localStorage.setItem('invalidZipcode', 'true');
      // }
    }
    // else {
    //   // localStorage.setItem('invalidZipcode', 'true');
    // }
    // console.log(responseTaxDetails, 'responseTaxDetails');
  }, [responseTaxDetails.isLoading])


  // Set the meta titles dynamically
  const metaTitles = () => {
    switch (pathname) {
      case "/checkout":
        return "Checkout page";
      case "/payment":
        return "Payment details";
      default:
        return "";
    }
  }

  // Set the meta Descriptions dynamically
  const metaDescriptions = () => {
    switch (pathname) {
      case "/checkout":
        return "Provide login details, add promocode and proceed to checkout";
      case "/payment":
        return "Provide card details";
      default:
        return "";
    }
  }

  // Meta tags
  useMetaTags({
    title: metaTitles(),
    description: metaDescriptions(),
  }, [])

  // Get the order report list from local stoarge
  useEffect(() => {
    let reportList = localStorage.getItem('orderReports');
    let reportListData = reportList && JSON.parse(reportList);
    dispatch(addToReportCart(reportListData))
  }, [])

  // After successfull payment reload page
  React.useEffect(() => {
    scrollToTop();
    localStorage.removeItem('payPalPayment');
    window.addEventListener('storage', function ({ key, newValue, oldValue }: { key: string, newValue: any, oldValue: any }) {
      if (oldValue === 'Initiated' && newValue === 'Success') {
        window.location.reload();
      }
    })
  }, []);

  if (process.env.REACT_APP_STRIPE_PUBLIC_KEY) loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  let orders: any = localCartReportList || [];

  // Get cart list
  const getCartList = async () => {
    var config: any = {
      method: 'get',
      url: `${api.baseUrl}/cart`,
      headers: {
        'Authorization': `Bearer ${localStorage.accessToken}`
      }
    };
    await axios(config)
      .then(function (response) {
        const dataList = response?.data || response?.data?.data || [];
        if (!dataList.length) {
          navigate('/user/profile');
        }
      })
      .catch(function (error) {
      })
  }

  // If loggedin load cart list otherwise navigate to home page 
  useEffect(() => {
    if (pathname === '/payment') {
      if (isLoggedIn) {
        getCartList()
      }
      if (!isLoggedIn && !localCartReportList?.length) {
        navigate('/');
      }
    }
  }, [])


  // Showing loader while data loading
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <Spinner />
      </Box>
    );


  return (
    <StyledEngineProvider injectFirst>
      <Box pb={10} style={{ flexGrow: 1 }}>
        <Header />
        <Box mt={3}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={7} sm={6} xs={12} className='chekout-mobile'>
                {/* Show the different component based on checkout step */}
                {pathname === '/payment' ? (
                  <Payment orders={orders} taxParams={taxParams} setLoading={setLoading} discountData={discountData} />
                ) : (
                  <UserAuth />
                )}
              </Grid>
              <Grid item lg={5} sm={6} xs={12} className='chekout-mobile'>
                {/* Show the different component based on checkout step */}
                {pathname === '/payment' ? (
                  <OrderList orders={orders} taxParams={taxParams} setLoading={setLoading} discountData={discountData} viewOnly={true} />
                ) :
                  <OrderList orders={orders} taxParams={taxParams} setLoading={setLoading} />
                }
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

function Payment({ orders, setLoading, discountData, taxParams }: { orders: any, taxParams: any, setLoading: (a: boolean) => void, discountData: any }) {
  const [createPaypalPaymentIntent, response] = usePostToCreatePaypalPaymentIntentMutation();
  const { authentication } = useAuth();
  const [cartItemList, setCartItemList] = React.useState<any[]>();
  const [name, setName] = React.useState<any>('');
  const [email, setEmail] = React.useState<any>('');
  const [isPayPalClicked, setIsPayPalClicked] = React.useState<any>(false);
  const [errors, setErrors] = React.useState<any>({});
  const [netDiscount, setNetDiscount] = React.useState(0)
  const [couponId, setCouponId] = React.useState(0)
  const [defaultPayment, setDefaultPayment] = React.useState<any>("");
  const [cardPaymentDetails, setCardPaymentDetails] = React.useState<any>({});
  const [formClicked, setFormClicked] = React.useState<any>(false);

  // Api call
  const { data: cartItems, isSuccess: isCartItemsSuccess, isFetching: isCartItemsFetching } = useGetCartItemsQuery(null, {
    skip: !authentication, refetchOnMountOrArgChange: true
  });
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  // const [getConvertedCurrencyList, getConvertedCurrencyListResponse] = useGetConvertedCurrencyListMutation();
  const { data: countriesList } = useCountriesQuery();
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  // Get the cart items
  React.useEffect(() => {
    if (localStorage.accessToken && cartItems) {
      setCartItemList(cartItems)
    }
    else {
      if (orders) {
        setCartItemList(orders)
      }
    }
  }, [isCartItemsSuccess, cartItems]);

  // useEffect(() => {
  //   if (responseTaxDetails.isSuccess) {
  //     setTaxParams(responseTaxDetails?.data?.data);
  //     // console.log(responseTaxDetails, 'responseTaxDetails');
  //   }
  // }, [responseTaxDetails.isLoading])

  // Get the subtotal value
  let subTotalArr = cartItemList
    ? cartItemList.length
      ? cartItemList.map((val: any) => val.price)
      : [0]
    : [0];

  let subTotal: number = cartItemList ? cartItemList.length ? subTotalArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;

  // Get discount value and set the coupon id
  React.useEffect(() => {
    GetPatmentInfo()
    getDiscountValue()
  }, [discountData])

  const getDiscountValue = () => {
    // console.log(discountData, 'discountData')
    if (discountData) {
      setNetDiscount(discountData?.discountType === "Percentage" ? discountData?.discountValue / 100 * subTotal : discountData?.discountValue)
      setCouponId(discountData?.id)
    } else {
      setNetDiscount(0)
      setCouponId(0)
    }
  }

  // useEffect(() => {
  //   if (getConvertedCurrencyListResponse.isSuccess) {

  //     const newArr = cartItemList?.map((category) => {
  //       const numberOfItems = getConvertedCurrencyListResponse?.data?.filter((product: any) => category.cartSessionId === product.cartId);

  //       return {
  //         ...category,
  //         ...(numberOfItems?.length && { currencyCode: numberOfItems[0]?.toCurrency }),
  //         ...(numberOfItems?.length && { currencyId: numberOfItems[0]?.currencyId }),
  //         ...(numberOfItems?.length && { currencySymbol: numberOfItems[0]?.currencySymbol }),
  //         ...(numberOfItems?.length && { price: Number(numberOfItems[0]?.price) }),
  //       };
  //     });
  //     console.log(newArr, 'cartList123')
  //     setCartItemList(newArr);
  //   }
  // }, [getConvertedCurrencyListResponse])

  // useEffect(() => {
  //   if (authentication) {
  //     if (cartItems) {
  //       let userCountryCode = user?.memberaddress[0]?.currencyCode;
  //       let userCurrencyId: any = null;
  //       let list: any = [];
  //       currencies?.forEach((v: any) => {
  //         if (userCountryCode === v?.label) {
  //           userCurrencyId = v?.id;
  //         }
  //       })
  //       cartItems?.forEach((v: any) => {
  //         if (v?.currencyId !== userCurrencyId) {
  //           list.push({ 'cartId': v?.cartSessionId });
  //         }
  //       });
  //       if (list?.length) {
  //         getConvertedCurrencyList(
  //           {
  //             "currencyId": userCurrencyId,
  //             "cartList": list
  //           }
  //         )
  //       }
  //       console.log(list, userCurrencyId, userCountryCode, 'updatedList');
  //       // setConversionList();
  //     }
  //   }
  // }, [cartItems, isCartItemsFetching])

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

  // pay using paypal button
  let onPaypalCheckout = async () => {
    setFormClicked(true);
    getDiscountValue();
    const countData: any = localStorage.getItem("discountInfo");
    const discountData = countData && JSON.parse(countData);
    let dist = discountData ? discountData?.discountType === "Percentage" ? discountData?.discountValue / 100 * subTotal : discountData?.discountValue : 0;
    let coupID = discountData?.id;
    // console.log(discountData, 'discountData inside')
    if (!validateForm() && !localStorage.accessToken) return
    setLoading(true);
    let temp: any = []
    cartItemList?.map(val => {
      let obj = { cartId: val.cartSessionId, productId: val.productId, quantity: val.quantity }
      temp.push(obj)
    });
    let totalTaxArr = taxParams ? taxParams?.tax_breakdown?.length ? taxParams?.tax_breakdown?.map((val: any) => val.amount) : [0] : [0];
    let totalTax: number = taxParams ? taxParams?.tax_breakdown?.length ? totalTaxArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
    // Number(Number(subTotal - netDiscount).toFixed(2)),
    const user = JSON.parse(window.localStorage.getItem("user") || '{}');
    const geoPostalCode = window.localStorage.getItem("geoPostalCode");
    // console.log(netDiscount, 'netDiscount')
    let PostObject = {
      "paymentMethodType": 2,
      "fullName": localStorage.accessToken ? JSON.parse(localStorage.user).fullName : name,
      "emailId": localStorage.accessToken ? JSON.parse(localStorage.user).email : email,
      "postal_code": localStorage.accessToken ? user?.memberaddress[0]?.postcode : geoPostalCode,
      "items": temp,
      "total": Number(Number((subTotal - dist) + totalTax).toFixed(2)),
      "subTotal": Number(Number(subTotal).toFixed(2)),
      // "couponId": couponId !== 0 ? couponId : '',
      ...(couponId !== 0 && { couponId: coupID }),
      "country_code": authentication ? user?.memberaddress[0]?.countryCode?.substring(0, 2) : getCountryCodeFromGeoCountry(),
      "discount": dist,
      "currency": authentication ? currencies?.filter((v: any) => v?.label === user?.memberaddress[0]?.currencyCode)[0]?.id : getCurrencyIdFromCountryList() ? getCurrencyIdFromCountryList() : 1,
      "taxPercentage": taxParams?.tax_breakdown?.length ? Number(taxParams?.tax_breakdown[0]?.tax_rate_details?.percentage_decimal) : 0,
      "taxValue": totalTax
    }
    try {
      let res: any = await createPaypalPaymentIntent(PostObject)
      if (res.error.data.error || res.error.data.message) {
        toast.error(res.error.data.message)
      } else {
        localStorage.setItem('payPalPayment', 'Initiated');
        window.open(res.error.data, '_blank', 'noopener,noreferrer')
      }
      console.log(res, 'res')
    } catch (error: any) {
      // console.log(error, 'EEEEE')
    }
    setLoading(false);
    setFormClicked(false);
  }

  // Get payment info like saved card details
  let GetPatmentInfo = async () => {
    var config: any = {
      method: 'get',
      url: `${api.baseUrl}/member-paytype-access`,
      headers: {
        'Authorization': `Bearer ${localStorage.accessToken}`
      }
    };
    await axios(config)
      .then(function (response) {
        if (response.data.length) {
          // @ts-ignore
          let temp = response.data.find((val: any) => val.isDefault == true)
          let cardData = response.data.find((val: any) => val.paymentMethod === "card")
          setDefaultPayment(temp.paymentMethod)
          setCardPaymentDetails(cardData)
        }
      })
      .catch(function (error) {
        // toast.error(response?.error?.data?.message, {
        //   autoClose: 2000,
        // })
      })
  }

  // Validate form
  let validateForm = () => {
    /*eslint-disable */
    let errors = {};
    let formIsValid = true;
    //@ts-ignore
    if (!name) {
      formIsValid = false;  //@ts-ignore
      errors["name"] = `Please enter name`;
    }
    if (!email) {
      formIsValid = false;  //@ts-ignore
      errors["email"] = `Email required`;
    }
    if (!ValidateEmail(email)) {
      formIsValid = false;  //@ts-ignore
      errors["email"] = `Please enter valid email address`;
    }
    setErrors(errors)
    return formIsValid
    /*eslint-enable */
  }

  // handle paypal payment flow
  let handlePaypalOpen = (value: any) => {
    scrollToTop();
    if (localStorage.accessToken) {
      onPaypalCheckout();
    } else {
      setIsPayPalClicked(value);
      setTimeout(() => {
        let paypalDiv: any = document?.getElementById('paypal-unregister');
        // paypalDiv.scrollIntoView();
        window.scrollTo({ top: paypalDiv?.offsetTop - 110, behavior: "smooth" })
      }, 500);
    }
  }

  // validate email address
  const ValidateEmail = (email: any) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      {/* paypal form */}
      {
        defaultPayment == 'card' || defaultPayment == '' ?
          <>
            {/* Stripe form */}
            <StripeCheck orders={cartItemList} taxParams={taxParams} cardPaymentDetail={cardPaymentDetails} handlePaypalOpen={handlePaypalOpen} />
            {/* Paypal form will be visible if user is not loggedin to enter name and email address */}

            {
              isPayPalClicked ?

                <>
                  <div id="paypal-unregister">
                    <div className="wrapper">
                      <div className="formwrapper formfill-body-paypal">
                        <Grid container sx={{ justifyContent: 'center' }}>
                          <Grid item lg={9} md={10} sm={10} xs={10}>
                            <div className="container-form-paypal">
                              <div className="formfill-body-paypal">
                                <Typography variant='h2'>PayPal Payment</Typography>
                                <form className="form-action-web-paypal">
                                  <div className="form-group-web-paypal">
                                    <label className="label--txtfilll-paypal">Enter Name</label>
                                    {/* <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter name" name="" className="form-control control-web-paypal" /> */}
                                    <TextField
                                      // error={name?.trim() === '' ? true : false}
                                      onChange={(e) => setName(e.target.value)}
                                      value={name}
                                      type="text"
                                      placeholder="Enter name"
                                      name=""
                                      className="form-control control-web-paypal"
                                      error={(formClicked === true && name?.trim() === '') ? true : false}
                                    />
                                    {name?.trim() === '' && <p className="error-text">{errors.name}</p>}
                                    {/* {name?.trim() === '' && <div className="errorMsg">{errors.name}</div>} */}
                                  </div>
                                  <div className="form-group-web-paypal">
                                    <label className="label--txtfilll-paypal">Enter Emails</label>
                                    <TextField
                                      onChange={(e) => setEmail(e.target.value)}
                                      value={email}
                                      type="email"
                                      placeholder="Enter emails"
                                      name=""
                                      className="form-control control-web-paypal"
                                      error={(formClicked === true && email?.trim() === '') ? true : (formClicked === true && ValidateEmail(email) === false) ? true : false}
                                    />
                                    {/* <p className="error-text">{errors.email}</p> */}
                                    {email?.trim() === '' && <p className="error-text">{errors.email}</p>}
                                    {email?.trim() !== '' && (ValidateEmail(email) === false) && <p className="error-text">{'Please Enter valid email address'}</p>}
                                  </div>
                                  <div className="button-paypal">
                                    <button onClick={() => onPaypalCheckout()} type="button" className="btn btn-pay--btnpal">Pay</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </div>
                </>
                :
                null
            }

          </>
          :
          <>

            {
              isPayPalClicked ?

                <>
                  <div id="paypal-unregister">
                    <div className="wrapper">
                      <div className="formwrapper formfill-body-paypal">
                        <Grid container sx={{ justifyContent: 'center' }}>
                          <Grid item lg={10} sm={12} xs={12}>
                            <div className="container-form-paypal">
                              <div className="formfill-body-paypal">
                                <form className="form-action-web-paypal">
                                  <div className="form-group-web-paypal">
                                    <label className="label--txtfilll-paypal">Enter Name</label>
                                    <TextField
                                      onChange={(e) => setName(e.target.value)}
                                      value={name}
                                      type="text"
                                      placeholder="Enter name"
                                      name=""
                                      className="form-control control-web-paypal"
                                      error={(formClicked === true && name?.trim() === '') ? true : false}
                                    />
                                    {name?.trim() === '' && <p className="error-text">{errors.name}</p>}
                                  </div>
                                  <div className="form-group-web-paypal">
                                    <label className="label--txtfilll-paypal">Enter Emails</label>
                                    {/* <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter emails" name="" className="form-control control-web-paypal" /> */}
                                    <TextField
                                      onChange={(e) => setEmail(e.target.value)}
                                      value={email}
                                      type="email"
                                      placeholder="Enter emails"
                                      name=""
                                      className="form-control control-web-paypal"
                                      error={(formClicked === true && email?.trim() === '') ? true : (formClicked === true && ValidateEmail(email) === false) ? true : false}
                                    />
                                    {email?.trim() === '' && <p className="error-text">{errors.email}</p>}
                                    {email?.trim() !== '' && (ValidateEmail(email) === false) && <p className="error-text">{'Please Enter valid email address'}</p>}
                                  </div>
                                  <div className="button-paypal">
                                    <button onClick={() => onPaypalCheckout()} type="button" className="btn btn-pay--btnpal">Pay</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </div>
                </>
                :
                null
            }
            <StripeCheck orders={cartItemList} taxParams={taxParams} cardPaymentDetail={cardPaymentDetails} handlePaypalOpen={handlePaypalOpen} />
          </>
      }
      {/* End paypal form */}
    </>
  );
}

export default CheckoutController;