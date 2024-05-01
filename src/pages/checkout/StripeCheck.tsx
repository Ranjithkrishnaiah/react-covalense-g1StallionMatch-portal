import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Design from './Design';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { CountryListConstant } from './stripeCountry';
import axios from 'axios'
import { api } from 'src/api/apiPaths';
import { Box, Grid, Container, TextField, StyledEngineProvider, Autocomplete, RadioGroup, FormControlLabel, Radio, Typography, Divider } from "@mui/material";
import { scrollToTop, toPascalCase } from '../../utils/customFunctions';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import '../../components/checkout/checkout.css'
import { Images } from "src/assets/images";
import { useGetCartItemsQuery } from "src/redux/splitEndpoints/getCartItemsSplit";
import useAuth from "src/hooks/useAuth";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { addToReportCart, addToUserReportCart } from "src/redux/actionReducers/reportSlice";
import { useDispatch } from "react-redux";
import PaymentOptions from "./PaymentOptions";
import { useGetCurrenciesQuery } from "src/redux/splitEndpoints/getCurrenciesSplit";
import { usePostToCreateStripeNewCardMutation, usePostToCreateStripeSavedCardMutation } from "src/redux/splitEndpoints/postCreatePaypalPaymentIntent";
import { toast } from "react-toastify";

let stripePromise: any = null;
if (process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
}

const OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      width: '100%',
      color: "#161716",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#626E60",
        paddingLeft: "20px"
      }
    },
    invalid: {
      color: "#C75227",
    },
    input: {
      paddingLeft: '20px'
    }
  }
};

// type
type StripeForm = {
  orders: any[],
  cardPaymentDetail: any,
  taxParams: any,
}


const StripeForm = ({ orders, cardPaymentDetail, taxParams }: StripeForm) => {
  const dispatch = useDispatch();
  const { authentication } = useAuth();
  const [error, setError] = useState<string | null | undefined>(null);
  const [errorStripeEvent, setErrorStripeEvent] = useState<any>({});
  const [name, setName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [country, setCountry] = React.useState<any | undefined>();
  const [countryA2Code, setCountryA2Code] = React.useState<any | undefined>();
  const [zip, setZip] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string | null | undefined>(null);
  const [netDiscount, setNetDiscount] = React.useState(0);
  const [cartItemList, setCartItemList] = React.useState<any[]>();
  const [couponId, setCouponId] = React.useState(0);
  const [isFormClicked, setIsFormClicked] = React.useState(false);
  const [cardNumberError, setCardNumberError] = React.useState<any>({});
  const [cardExpiryError, setCardExpiryError] = React.useState<any>({});
  const [cardCVCError, setCardCVCError] = React.useState<any>({});
  const [apiError, setApiError] = React.useState<any>('');
  const { data: countriesList } = useCountriesQuery();
  const stripe = useStripe();
  const elements = useElements();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: cartItems, isSuccess: isCartItemsSuccess } = useGetCartItemsQuery(null, {
    skip: !authentication, refetchOnMountOrArgChange: true
  });
  let items: any[] = [];
  const [loading, setLoading] = React.useState<boolean>(false);
  cartItemList?.map((item) => {
    let obj = { cartId: item.cartSessionId, productId: item.productId, quantity: item.quantity }
    items.push(obj)
  })
  let subTotalArr = cartItemList ? cartItemList.length ? cartItemList.map((val: any) => val.price) : [0] : [0];
  let subTotal: number = cartItemList ? cartItemList.length ? subTotalArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
  const countData: any = localStorage.getItem("discountInfo");
  const discountData = countData && JSON.parse(countData);
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');

  const [createCreateStripeNewCard, responseCreateStripeNewCard] = usePostToCreateStripeNewCardMutation();
  // const PostObject = { paymentMethodType: "acss_debit", currency: "AUS", amount: subTotal, }

  // update the cart list
  useEffect(() => {
    if (localStorage.accessToken && isCartItemsSuccess) {
      const cartslist: any = cartItems
      setCartItemList(cartItems)
      dispatch(addToUserReportCart(cartslist))
    }
    else {
      if (localStorage?.orderReports) {
        setCartItemList(JSON.parse(localStorage.orderReports))
      }
    }
  }, [isCartItemsSuccess])

  // get discount amount
  React.useEffect(() => {
    if (discountData) {
      setNetDiscount(discountData?.discountType === "Percentage" ? discountData?.discountValue / 100 * subTotal : discountData?.discountValue)
      setCouponId(discountData?.id)
    } else {
      setNetDiscount(0)
      setCouponId(0)
    }
  }, [discountData])

  const pr = stripe?.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Demo total',
      amount: 1999,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  // check null value
  const isNull = (val: any) => {
    if (val) return val
    return
  }

  // validate form
  const checkValidation = () => {
    if (!String(name)) {
      setError("Name is required!")
      return true;
    } else if (!String(address)) {
      setError("Address is required!")
      return true;
    } else if (!localStorage.accessToken && !String(email)) {
      setError("Email is required!")
      return true;
    } else if (!String(country)) {
      setError("Country is required!")
      return true;
    } else if (!String(zip)) {
      setError("Zip code is required!")
      return true;
    } else {
      return false;
    }
  }

  // Show error for different stripe element
  const handleChangeStripeError = (value: any) => {
    let stripeError: any = value?.error ? value?.error : "";
    setErrorStripeEvent(value);
    if (value?.elementType === "cardCvc") {
      setCardCVCError(value);
    }
    if (value?.elementType === "cardExpiry") {
      setCardExpiryError(value);
    }
    if (value?.elementType === "cardNumber") {
      setCardNumberError(value);
    }
    if (stripeError) {
      setError(stripeError?.message)
    } else {
      setError("")
    }
  }

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

  // Submit Stripe form
  const handleSubmit = async (event: any) => {
    event?.preventDefault();
    setPaymentMethod(null);

    if (stripe && elements) {
      setLoading(true)
      const result = await stripe.createToken(isNull(elements.getElement(CardNumberElement)));
      if (result) {
        setLoading(false)
      }
      let stripeError: any = result?.error ? result.error : "";
      setIsFormClicked(true);
      if (stripeError) {
        setError(stripeError?.message)
        return;
      }

      if (checkValidation()) {
        return;
      }

      let temp: any = []
      cartItemList?.map(val => {
        let obj = { cartId: val.cartSessionId, productId: val.productId, quantity: val.quantity }
        temp.push(obj)
      });
      let totalTaxArr = taxParams ? taxParams?.tax_breakdown?.length ? taxParams?.tax_breakdown?.map((val: any) => val.amount) : [0] : [0];
      let totalTax: number = taxParams ? taxParams?.tax_breakdown?.length ? totalTaxArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
      const headers = {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.accessToken}`
      }
      // @ts-ignore
      let payload1 = {
        "fullName": name,
        billingAddress: {
          // line1: localStorage.accessToken ? JSON.parse(localStorage.user).memberaddress[0].address : address,
          line1: address,
          postal_code: zip,
          // city: 'San Francisco',
          // state: 'CA',
          country: country,
        },
        "country_code": countryA2Code,
        postal_code: zip,
        "emailId": localStorage.accessToken ? JSON.parse(localStorage.user).email : email,
        "paymentMethodType": 1, // @ts-ignore
        "token": result.token.id,
        "currency": authentication ? currencies?.filter((v: any) => v?.label === user?.memberaddress[0]?.currencyCode)[0]?.id : getCurrencyIdFromCountryList() ? getCurrencyIdFromCountryList() : 1,
        "items": temp,
        "total": Number(Number((subTotal - netDiscount) + totalTax).toFixed(2)),
        "subTotal": Number(Number(subTotal).toFixed(2)),
        "couponId": couponId,
        "discount": netDiscount,
        "taxPercentage": taxParams?.tax_breakdown?.length ? Number(taxParams?.tax_breakdown[0]?.tax_rate_details?.percentage_decimal) : 0,
        "taxValue": totalTax
      }
      setLoading(true)
      try {
        let res: any = await createCreateStripeNewCard(payload1);
        console.log(res, 'RESPONSE RESSS')
        if (res?.data?.status == 'succeeded') {
          dispatch(addToReportCart([]))
          window.location.href = `${window.location.origin.toString()}/thankyou?id=${res.data.id}`;
        } else {
          if (res.error.data.error || res.error.data.message || res.error.data.errors) {
            // setError(res.data.error?.message) Object.values(response?.error?.data?.errors)
            if (res.error.data.errors) {
              let res1: any = Object.values(res?.error?.data?.errors);
              if (res1?.length) {
                toast.error(res1[0]);
                setApiError(res1[0]);
              }
            } else {
              toast.error(res.error.data.message);
              setApiError(res.error.data.message);
            }
          }
        }
        setLoading(false)
        setIsFormClicked(false);

      } catch (error) {
        console.log(error, 'RESPONSE error')
        // if (error?.data?.error) {
        //   // setError(res.data.error?.message)
        //   setApiError(error.data.error?.message);
        // }
        setLoading(false)
        setIsFormClicked(false);
      }
      // axios.post(`${api.baseUrl}/order-transactions/create-stripe-charge`, payload1, {
      //   headers: headers
      // }).then(res => {
      //   console.log(res, 'RESPONSE')
      //   if (res.data.status == 'succeeded') {
      //     dispatch(addToReportCart([]))
      //     window.location.href = `${window.location.origin.toString()}/thankyou?id=${res.data.id}`;
      //   }
      //   if (res?.data?.error) {
      //     // setError(res.data.error?.message)
      //     setApiError(res.data.error?.message);
      //   }
      // }).catch(error => {
      //   console.log(error, 'RESPONSE error')
      //   if (error?.data?.error) {
      //     // setError(res.data.error?.message)
      //     setApiError(error.data.error?.message);
      //   }
      // }).finally(() => {
      //   setLoading(false)
      //   setIsFormClicked(false);
      // })
    } else {
      setLoading(false)
      setIsFormClicked(false);
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className="card-payment">
        <Grid container sx={{ justifyContent: 'center', marginTop: "-10px" }}>
          <Grid item lg={10} xs={12}>
            <Box className="DemoWrapper">
              <Box className="DemoContent">
                {/* Stripe Form */}
                <form id="payment-form" onSubmit={handleSubmit}>
                  <Container>
                    <Box>
                      <label>
                        Card Number
                      </label>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <CardNumberElement
                          className={`cards card-number ${cardNumberError?.empty === false ? 'card-content' : ''}`}
                          options={OPTIONS}
                          onReady={(val) => { }}
                          onChange={(event: any) => {
                            handleChangeStripeError(event)
                          }}
                          onBlur={() => { }}
                          onFocus={() => { }}
                        />
                        <Box className="numberCard">
                          {cardNumberError?.empty === false && <img src={Images.cvccard} alt='credit Card' width='25px' />}
                        </Box>
                        {/* <span className="brand"><i className="pf pf-credit-card" id="brand-icon"></i></span> */}
                        {((Object.values(errorStripeEvent))?.length === 0 || errorStripeEvent?.brand === "unknown") && <Box className="paymentCards">
                          <img src={Images.Visa} alt='credit Card' width='34px' />
                          <img src={Images.Mastercard} alt='credit Card' width='34px' />
                          <img src={Images.AmericanExpress} alt='credit Card' width='34px' />
                          <img src={Images.discover} alt='credit Card' width='34px' />
                        </Box>}
                        {(Object.values(errorStripeEvent))?.length > 0 &&
                          <Box className="paymentCards">
                            {errorStripeEvent?.brand === 'visa' && <img src={Images.Visa} alt='credit Card' width='34px' />}
                            {errorStripeEvent?.brand === 'mastercard' && <img src={Images.Mastercard} alt='credit Card' width='34px' />}
                            {errorStripeEvent?.brand === 'amex' && <img src={Images.AmericanExpress} alt='credit Card' width='34px' />}
                            {errorStripeEvent?.brand === 'discover' && <img src={Images.discover} alt='credit Card' width='34px' />}
                          </Box>}
                      </Box>
                      {(cardNumberError?.error !== undefined) && <p className="error-text">{cardNumberError?.error?.message}</p>}
                    </Box>
                    <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ width: '50%' }}>
                        <label>
                          Expiry
                        </label>
                        <Box>
                          <CardExpiryElement
                            className="card-expiry"
                            options={OPTIONS}
                            onReady={() => { }}
                            onChange={event => {
                              handleChangeStripeError(event)
                            }}
                            onBlur={() => { }}
                            onFocus={() => { }}
                          />
                        </Box>
                        {(cardExpiryError?.error !== undefined) && <p className="error-text">{cardExpiryError?.error?.message}</p>}
                      </Box>
                      <Box sx={{ width: '45%' }}>
                        <label>
                          CVC
                        </label>
                        <Box sx={{ position: 'relative' }}>

                          <CardCvcElement
                            className="card-expiry"
                            options={OPTIONS}
                            onReady={() => { }}
                            onChange={event => {
                              handleChangeStripeError(event)
                            }}
                            onBlur={() => { }}
                            onFocus={() => { }}
                          />
                          <Box className="cvc-card">
                            {(cardCVCError?.error === undefined) && <img src={Images.cvccard} alt='credit Card' width='25px' />}
                            {(cardCVCError?.error !== undefined) && <img src={Images.carderror} alt="crad" />}
                          </Box>
                        </Box>
                        {(cardCVCError?.error !== undefined) && <p className="error-text">{cardCVCError?.error?.message}</p>}
                      </Box>
                    </Box>
                    <Box mt={2} >
                      <label>Name on Card</label>
                      <TextField
                        type='text'
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mt: '8px' }}
                        name="cname"
                        error={(isFormClicked && (name?.trim() === '' || name === null)) ? true : false}
                      />
                      {(isFormClicked && (name?.trim() === '' || name === null)) && <p className="error-text">{'Please enter name'}</p>}
                    </Box>
                    {!localStorage.accessToken ?
                      <Box mt={2} >
                        <label>Enter email</label>
                        <TextField
                          type='text'
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{ mt: '8px' }}
                          name="cemail"
                          error={(isFormClicked && (email?.trim() === '' || email === null)) ? true : false}
                        />
                        {(isFormClicked && (email?.trim() === '' || email === null)) && <p className="error-text">{'Please enter email'}</p>}
                      </Box> : null
                    }
                    <Box mt={2} >
                      <label>Address</label>
                      <TextField
                        type='text'
                        placeholder="Enter Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        sx={{ mt: '8px' }}
                        name="caddress"
                        error={(isFormClicked && (address?.trim() === '' || address === null)) ? true : false}
                      />
                      {(isFormClicked && (address?.trim() === '' || address === null)) && <p className="error-text">{'Please enter address'}</p>}
                    </Box>
                    <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <Box className="strip-country">
                        <label>Country</label>
                        <Box className="countryDropdownCheck dropdown-top-box">
                          <Autocomplete
                            disablePortal
                            popupIcon={<KeyboardArrowDownRoundedIcon />}
                            id="country-select-demo"
                            sx={{ mt: '8px' }}
                            options={countriesList || []}
                            autoHighlight
                            getOptionLabel={(option: any) => `${!(option?.countryName?.split(' ')[0]?.length <= 2) && option?.countryName?.length > 3 ? toPascalCase(option?.countryName)?.toString() : option?.countryName?.toString()}`}
                            onChange={(event, newValue: any) => {
                              setCountry(newValue?.countryName);
                              setCountryA2Code(newValue?.countryA2Code);
                            }}
                            renderOption={(props, option) => (
                              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option.countryName}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                error={(isFormClicked && (country?.trim() === '' || country === null || country === undefined)) ? true : false}
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: 'Select Country',
                                  autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                              />
                            )}
                            filterOptions={(option: any, state: any) => {
                              let optionList: any = [];
                              optionList = option?.filter((v: any) => {
                                let countryFullname = v?.countryName?.toLowerCase();
                                let searchCountryName = state?.inputValue?.toLowerCase();
                                if (countryFullname?.startsWith(searchCountryName)) {
                                  return true;
                                }
                                return false;
                              })
                              return optionList;
                            }}
                          />
                          {(isFormClicked && (country?.trim() === '' || country === null || country === undefined)) && <p className="error-text">{'Please select country'}</p>}
                        </Box>
                      </Box>
                      <Box className="strip-country mobile-strip-country">
                        <label>ZIP</label>
                        <TextField
                          type='text'
                          placeholder="Enter ZIP Code"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          sx={{ mt: '8px' }}
                          name='czip'
                          error={(isFormClicked && (zip?.trim() === '' || zip === null || zip === undefined)) ? true : false}
                        />
                        {(isFormClicked && (zip?.trim() === '' || zip === null || zip === undefined)) && <p className="error-text">{'Please enter zip code'}</p>}
                      </Box>
                    </Box>
                    <Box pt={5} pb={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <img src={Images.stripebadge} alt='stripe' />
                    </Box>
                    <div className={`error${apiError ? " visible" : ""}`} role="alert">
                      <span className="message">{apiError}</span>
                    </div>
                  </Container>
                </form>
                {/* End Stripe Form */}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </StyledEngineProvider>
  );
};

const StripeCheck = ({ orders, cardPaymentDetail, handlePaypalOpen, taxParams }: any) => {

  const [fieldState, setFieldState] = useState<any>({
    address: "",
    zipcode: "",
  });
  const [error, setError] = useState<any>("");
  const [netDiscount, setNetDiscount] = React.useState(0);
  const [couponId, setCouponId] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [memberAddress, setAddress] = React.useState<any>();
  const [currentSelectedCard, setCurrentSelectedCard] = React.useState('');
  const [apiError, setApiError] = React.useState('');
  const { authentication } = useAuth();

  const { data: countriesList } = useCountriesQuery();
  const [createCreateStripeSavedCard, responseCreateStripeSavedCard] = usePostToCreateStripeSavedCardMutation();

  // set total amount and discount amount
  let subTotalArr = orders ? orders.length ? orders.map((val: any) => val.price) : [0] : [0];
  let subTotal: number = orders ? orders.length ? subTotalArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
  const countData: any = localStorage.getItem("discountInfo");
  const discountData = countData && JSON.parse(countData);
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');

  // get member address and set discount amount
  React.useEffect(() => {
    if (discountData) {
      setNetDiscount(discountData?.discountType === "Percentage" ? discountData?.discountValue / 100 * subTotal : discountData?.discountValue)
      setCouponId(discountData?.id)
    } else {
      setNetDiscount(0)
      setCouponId(0)
    }
    // axios.get(`${api.baseUrl}/auth/me`, {
    //   headers: headers
    // }).then(res => {
    //   setAddress(res.data.memberaddress[0])
    // })
  }, [discountData])

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${localStorage.accessToken}`
    }
    axios.get(`${api.baseUrl}/auth/me`, {
      headers: headers
    }).then(res => {
      setAddress(res.data.memberaddress[0])
    })
    // return () => {
    //   // actions to be performed when component unmounts
    //   setAddress(null);
    // }
  }, [])

  // Change the form element
  const handleOnChange = (type: string, value: string) => {
    setFieldState({
      ...fieldState,
      [type]: value
    })
  }

  // On first render scroll to top of the screen
  useEffect(() => {
    scrollToTop()
  }, [])

  // Validate stripe form
  const checkValidation = () => {
    const { address, zipcode } = fieldState;
    if (!address) {
      setError("Address is required!")
      return true;
    } else if (!zipcode) {
      setError("Zip code is required!")
      return true;
    } else if (!memberAddress) {
      setError("Update country in your profile!")
      return true;
    }
    else {
      setError("");
      return false;
    }
  }

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

  // Submit stripe form
  const handleSubmit = async (event: any) => {
    event?.preventDefault();
    const { address, zipcode } = fieldState;

    let temp: any = [];
    orders?.map((val: any) => {
      let obj = { cartId: val.cartSessionId, productId: val.productId, quantity: val.quantity }
      temp.push(obj)
    });

    if (checkValidation()) {
      return;
    }
    let countryString = '';
    let countryCodeString = '';
    if (cardPaymentDetail) {
      let countryList = CountryListConstant.DefaultCountryList;
      let selectedCountry: any = cardPaymentDetail?.billingDetails?.address?.country;
      countryString = countryList?.filter((v: any, i: number) => selectedCountry === v.code)[0].country;
      countryCodeString = countryList?.filter((v: any, i: number) => selectedCountry === v.code)[0].code;
    }
    let totalTaxArr = taxParams ? taxParams?.tax_breakdown?.length ? taxParams?.tax_breakdown?.map((val: any) => val.amount) : [0] : [0];
    let totalTax: number = taxParams ? taxParams?.tax_breakdown?.length ? totalTaxArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
    console.log(totalTax, 'totalTax')
    const payloadData = {
      emailId: localStorage?.accessToken && JSON.parse(localStorage.user)?.email,
      currency: authentication ? currencies?.filter((v: any) => v?.label === user?.memberaddress[0]?.currencyCode)[0]?.id : getCurrencyIdFromCountryList() ? getCurrencyIdFromCountryList() : 1,
      billingAddress: {
        line1: address,
        postal_code: zipcode,
        // @ts-ignore
        country: countryString ? countryString : null
      },
      "country_code": countryCodeString ? countryCodeString : null,
      postal_code: zipcode,
      items: temp,
      "total": Number(Number((subTotal - netDiscount) + totalTax).toFixed(2)),
      "subTotal": Number(Number(subTotal).toFixed(2)),
      "couponId": couponId,
      "discount": netDiscount,
      "taxPercentage": taxParams?.tax_breakdown?.length ? Number(taxParams?.tax_breakdown[0]?.tax_rate_details?.percentage_decimal) : 0,
      "taxValue": totalTax
    }

    const headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${localStorage.accessToken}`
    }
    setLoading(true);
    try {
      let res: any = await createCreateStripeSavedCard(payloadData);
      console.log(res, 'RESPONSE RESSS')
      setLoading(false)
      if (res?.data?.status === 'succeeded') {
        window.location.href = `${window.location.origin.toString()}/thankyou?id=${res.data.id}`;

      } else {
        if (res.error.data.error || res.error.data.message || res.error.data.errors) {
          // setError(res.data.error?.message) Object.values(response?.error?.data?.errors)
          if (res.error.data.errors) {
            let res1: any = Object.values(res?.error?.data?.errors);
            if (res1?.length) {
              toast.error(res1[0]);
              setApiError(res1[0]);
            }
          } else {
            toast.error(res.error.data.message);
            setApiError(res.error.data.message);
          }
        }
      }
      // if (res?.data?.error) {
      //   setApiError(res.data.error?.message)
      //   // setError(res.data.error?.message)
      // }



    } catch (error) {
      console.log(error, 'RESPONSE error')
      // if (error?.data?.error) {
      //   // setError(res.data.error?.message)
      //   setApiError(error.data.error?.message);
      // }
      setLoading(false)
    }



    // await axios.post(`${api.baseUrl}/order-transactions/create-payment-intent`, payloadData, {
    //   headers: headers
    // }).then(res => {
    //   setLoading(false)
    //   if (res.data.status === 'succeeded') {
    //     window.location.href = `${window.location.origin.toString()}/thankyou?id=${res.data.id}`;

    //   }
    //   if (res?.data?.error) {
    //     setApiError(res.data.error?.message)
    //     // setError(res.data.error?.message)
    //   }
    // }).catch(error => {
    //   setLoading(false)
    //   if (error?.data?.error) {
    //     setApiError(error?.data?.error?.message)
    //     // setError(res.data.error?.message)
    //   }
    // })
  }

  // Change the current selected card type
  const handleCardChange = (e: any) => {
    setCurrentSelectedCard(e.target.value);
  }

  return (
    <StyledEngineProvider injectFirst>
      <Grid item xs={12}>

        <Box className='checkout-box'>
          {/* Show Completed steps during checkout */}
          <Design />

          {/* Two checkbox to show Saved and new card forms */}
          <Box mt={4}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={currentSelectedCard}
              value={currentSelectedCard}
              name="radio-buttons-group"
              className="card-group"
              onChange={handleCardChange}
            >
              {cardPaymentDetail?.cardDetails?.last4 &&
                <FormControlLabel value="savedCard" className={`${currentSelectedCard === 'savedCard' ? 'checked-label' : ''}`} control={<Radio className='isPrivateFee' checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                  icon={<img src={Images.Radiounchecked} alt="checkbox" />} />} label={
                    <Box className="card-check">
                      {cardPaymentDetail?.cardDetails?.brand === 'visa' && <img src={Images.Visa} alt='credit Card' width='34px' />}
                      {cardPaymentDetail?.cardDetails?.brand === 'mastercard' && <img src={Images.Mastercard} alt='credit Card' width='34px' />}
                      {cardPaymentDetail?.cardDetails?.brand === 'amex' && <img src={Images.AmericanExpress} alt='credit Card' width='34px' />}
                      {cardPaymentDetail?.cardDetails?.brand === 'discover' && <img src={Images.discover} alt='credit Card' width='34px' />}
                      {cardPaymentDetail?.cardDetails?.brand === null && <img src={Images.card} alt='credit Card' width='34px' />}
                      {/* <img src={Images.AmericanExpress} alt='credit card' width="34" height="9" /> */}
                      <Box ml={1.5}>
                        {cardPaymentDetail?.billingDetails?.name && <Typography variant="h6">
                          {cardPaymentDetail?.billingDetails?.name}
                        </Typography>}
                        <Typography variant="h5">
                          **** **** **** {cardPaymentDetail?.cardDetails?.last4}
                        </Typography>
                      </Box>
                    </Box>

                  } />}
              <FormControlLabel value="newCard" className={`${currentSelectedCard === 'newCard' ? 'checked-label' : ''}`} control={<Radio className='isPrivateFee' checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                icon={<img src={Images.Radiounchecked} alt="checkbox" />} />} label={
                  <Box className="card-check">

                    <img src={Images.card} alt='credit card' width="34" height="9" />
                    <Box className="card-details-check">
                      <Typography variant="h5">
                        <img src={Images.plusIcon} alt='Icon' />
                        <span>Use a new credit card</span>
                      </Typography>
                    </Box>
                  </Box>
                } />
            </RadioGroup>
          </Box>
          <Box className="checkout-break">
            <Grid item lg={9} xs={12}>
              <Divider>Or</Divider>
            </Grid>
          </Box>
          {/* Payment Options list for example paypal,googlepay */}
          <PaymentOptions handlePaypalOpen={handlePaypalOpen} />

          {/* Show Stripe form if currentSelectedCard value is 'newCard' */}
          {currentSelectedCard === 'newCard' &&
            <Elements stripe={stripePromise}>
              <StripeForm orders={orders} taxParams={taxParams} cardPaymentDetail={cardPaymentDetail} />
            </Elements>
          }
          {/* Show saved card form if currentSelectedCard value is 'savedCard' */}
          {(currentSelectedCard === 'savedCard' && cardPaymentDetail?.cardDetails?.last4) &&
            <>
              <Box className='checkout-box' style={{ paddingBottom: "40px" }}>
                <form id="payment-form" onSubmit={handleSubmit}>
                  <Grid container sx={{ justifyContent: 'center' }}>
                    <Grid item lg={10} xs={12}>
                      <Container>
                        <Box>
                          <label>
                            Card Number
                          </label>
                          <Box className="card-number" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TextField
                              type='text'
                              placeholder="Enter Name"
                              value={`** ** ** ${cardPaymentDetail?.cardDetails?.last4}`}
                              sx={{ mt: '8px' }}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ width: '100%' }}>
                            <label>
                              Expiry
                            </label>
                            <TextField
                              type='text'
                              placeholder="Enter Name"
                              value={`${cardPaymentDetail?.cardDetails?.exp_month}/${cardPaymentDetail?.cardDetails?.exp_year}`}
                              sx={{ mt: '8px' }}
                              disabled
                            />
                          </Box>
                        </Box>
                        <Box mt={2}>
                          <label>Address</label>
                          <TextField
                            type='text'
                            placeholder="Enter Address"
                            value={fieldState?.address}
                            onChange={(e) => handleOnChange("address", e.target.value)}
                            sx={{ mt: '8px' }}
                            error={(error && fieldState.address === '') ? true : false}
                          />
                          {error && fieldState?.address?.trim() === '' && <p className="error-text">{'Address is required!'}</p>}
                        </Box>
                        <Box mt={2} >
                          <label>ZIP</label>
                          <TextField
                            type='text'
                            placeholder="Enter ZIP Code"
                            value={fieldState?.zipcode}
                            onChange={(e) => handleOnChange("zipcode", e.target.value)}
                            sx={{ mt: '8px' }}
                            error={(error && fieldState.zipcode === '') ? true : false}
                          />
                          {error && fieldState?.zipcode?.trim() === '' && <p className="error-text">{'Zipcode is required!'}</p>}
                        </Box>
                        <div className={`error${apiError ? " visible" : ""}`} style={{ margin: "15px 0" }} role="alert">
                          <span className="message">{apiError}</span>
                        </div>
                      </Container>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </>
          }
        </Box>
      </Grid>
    </StyledEngineProvider>
  );
};

export default StripeCheck;