import { Box, Button, FilledInput, FormControl, Grid, InputAdornment, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js';
import '../../components/checkout/checkout.css';
import '../../forms/LRpopup.css';
import { useNavigate } from 'react-router-dom';
import { usePostOrdersMutation } from 'src/redux/splitEndpoints/postOrders'
import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useDiscountMutation } from 'src/redux/splitEndpoints/getDiscount';
import useAuth from 'src/hooks/useAuth';
import { Options } from 'src/components/checkout/Checkout';
import { addToReportCart } from 'src/redux/actionReducers/reportSlice';
import { useDeleteCartItemMutation } from 'src/redux/splitEndpoints/deleteCartItemSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import { toast } from 'react-toastify';
import { usePatchNominationOfferMutation, usePatchNominationOfferRemoveCartMutation } from 'src/redux/splitEndpoints/patchNominationOffer';

type OrderListProps = {
  viewOnly?: any;
  orders?: any[];
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  discountData?: any;
  taxParams?: any;
}
function OrderList(props: OrderListProps) {
  const localCartReportList: any = useSelector((state: any) => state.reportSlices.cartList)
  const dispatch = useDispatch();
  // const [ stripeError, setStripeError ] = React.useState<object | undefined>();
  const [cartItemList, setCartItemList] = React.useState<any[]>();
  const [inputCoupon, setInputCoupon] = React.useState<string>(props?.discountData ? props?.discountData?.promoCode : '');
  const [couponCode, setCouponCode] = React.useState<string>("");
  const [netDiscount, setNetDiscount] = React.useState<number>(0);
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;

  const { authentication } = useAuth();
  const navigate = useNavigate();
  let stripePromise: any = null;
  // const clientEmail = "hello@tesla.com";
  const isCheckoutRoute = window.location.pathname === '/checkout'
  const [deleteCartItem, deleteResponse] = useDeleteCartItemMutation();
  const [sendOrders, response] = usePostOrdersMutation();
  const [fetchDiscount, discountResponse] = useDiscountMutation();
  const [isCouponApply, setIsCouponApply] = useState(false);
  const [isCouponValid, setIsCouponValid] = useState(true);
  const [conversionList, setConversionList] = useState([]);
  const [patchNominationOfferRemoveCartMutation, patchNominationResponse] = usePatchNominationOfferRemoveCartMutation();
  const { data: cartItems, isSuccess: isCartItemsSuccess, isFetching: isCartItemsFetching } = useGetCartItemsQuery(null, { skip: !authentication, refetchOnMountOrArgChange: true });
  // const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  // const [getConvertedCurrencyList, getConvertedCurrencyListResponse] = useGetConvertedCurrencyListMutation();


  const discountInfoData = discountResponse?.data ? discountResponse.data : props?.discountData;
  const cartList = window.location.pathname?.includes("thankyou") ? props?.orders : cartItemList
  let subTotalArr = cartList ? cartList.length ? cartList.map((val: any) => val.price) : [0] : [0];
  let subTotal: number = cartList ? cartList.length ? subTotalArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
  const discountAmount: any = discountInfoData?.discountType === "Percentage" ? discountInfoData?.discountValue / 100 * subTotal : discountInfoData?.discountValue;
  // const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  let totalTaxArr = props?.taxParams ? props?.taxParams?.tax_breakdown?.length ? props?.taxParams?.tax_breakdown?.map((val: any) => val.amount) : [0] : [0];
  let totalTax: number = props?.taxParams ? props?.taxParams?.tax_breakdown?.length ? totalTaxArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;

  useEffect(() => {
    // console.log(discountAmount,'discountAmount')
    if (discountAmount) {
      setNetDiscount(discountAmount)
      setIsCouponApply(true)
    } else {
      setNetDiscount(0)
      setIsCouponApply(true)
    }
    if (isCheckoutRoute || window.location.pathname === '/payment') {
      setIsCouponValid(true);
      if (discountInfoData) {
        localStorage.setItem('discountInfo', JSON.stringify(discountInfoData))
      } else {
        localStorage.setItem('discountInfo', JSON.stringify(""))
      }
    }
  }, [discountInfoData, discountAmount])

  useEffect(() => {
    if (discountResponse.isError) {
      // setNetDiscount(discountAmount)
      setIsCouponValid(false);
      localStorage.setItem('discountInfo', JSON.stringify(""));
      setNetDiscount(0);
    }

  }, [discountResponse])

  useEffect(() => {
    if (localStorage.accessToken && cartItems) {
      setCartItemList(cartItems)
    }
    else {
      setCartItemList(localCartReportList)
    }
  }, [cartItems, localCartReportList])

  useEffect(() => {
    let reportList = localStorage.getItem('orderReports');
    let reportListData = reportList && JSON.parse(reportList) || [];
    dispatch(addToReportCart(reportListData))
  }, [])

  // console.log(discountResponse, "discountResponse=====>")


  if (process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  let items: any[] = [];
  cartItemList?.length && cartItemList?.map((item) => {
    let obj = { cartId: item.cartSessionId, productId: item.productId, quantity: item.quantity }
    items.push(obj)
  })

  const PostObject = { items, total: subTotal, subTotal, couponId: 0, discount: 160 }

  useEffect(() => {
    if (response.isSuccess) {
      if (response.data.url)
        window.location.replace(response.data.url)
    }
  }, [response])

  const sendToPayment = () => {
    if (cartItems) {
      sendOrders(PostObject)
    }
  }

  const deleteItem = async (id: any, index: any) => {
    // console.log(id, index, 'INDEX');s
    // console.log(updatedList[index], 'selected');
    if (isLoggedIn) {
      await deleteCartItem({ cartId: id });
      let selectedForNominationProduct: any = {};
      selectedForNominationProduct = updatedList[index];
      if (selectedForNominationProduct?.productCode === "NOMINATION_STALLION") {
        patchNominationOfferRemoveCartMutation({ id: selectedForNominationProduct?.nominationId, isAccepted: false });
      }
    } else {
      let updatedlist: any = localCartReportList?.length ? localCartReportList?.filter((item: any, i: any) => i !== index) : [];
      localStorage.setItem("orderReports", JSON.stringify(updatedlist));
      dispatch(addToReportCart(updatedlist));
    }
  }

  const goToPayment = () => {
    // alert('testr')
    if (isCheckoutRoute && cartItems) {
      navigate('/payment');
      // sendOrders(PostObject);
    }
  }

  const handleCouponChange = (e: any) => {
    setInputCoupon(e.target.value)
    if (!e.target.value) {
      setIsCouponApply(false)
      setIsCouponValid(true);
    }
  }

  const currencySymbolByType = (currencyType: string) => {
    switch (currencyType) {
      case "AUD":
        return "$";
      default:
        return "$";
    }
  }

  let updatedList: any = (!isLoggedIn && props?.orders?.length) ? props.orders : (window.location.pathname?.includes("thankyou") ? props.orders : cartItemList);

  const handleCoupon = async () => {
    let storageUser: any = localStorage.getItem('user');
    let userData: any = storageUser && JSON.parse(storageUser);
    setCouponCode(inputCoupon)
    const couponData: any = {
      totalAmount: subTotal,
      promoCode: inputCoupon,
      productIds: updatedList?.length ? updatedList?.map((item: any) => item?.productId) : [],
      memberuuid: userData?.id
    }
    await fetchDiscount(couponData).then((res: any) => {
      if (res) {
        if (res?.error) {
          toast.error(res?.error?.data?.message || res?.error?.data?.error || "Invalid coupon");
        }
      }
    })
  }


  // const invalidZip = localStorage.getItem('invalidZipcode') ? JSON.parse(localStorage.getItem('invalidZipcode') || '') : false;
  // console.log(localStorage.getItem('invalidZipcode'), 'invalidZip')

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
  // console.log(isCouponApply, 'isCouponApply')


  return (
    <Box pb={4} className='checkout-box payment-checkout'>
      {updatedList?.length ? <>
        {updatedList?.map((cartItem: any, index: number) => (
          <Box key={cartItem?.cartSessionId}>
            {/* {console.log(cartItem, 'cartItem')} */}
            {(cartItem?.productName?.includes("Report") || cartItem?.productName === "Stallion X Breeding Stock Sale") &&
              <Grid container className='cart-checkout'>
                <Grid item lg={10} xs={10}>
                  <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(cartItem?.productName)}</Typography>
                  {/* <Typography variant='h6' py={1}>{`${ cartItem?.mareName }`} x {`${ cartItem?.quantity }`} Stallions</Typography>
                <Typography variant='h6' sx={ { color: '#1D472E' } }>{ cartItem?.currencyCode } { ' ' } { cartItem?.price }</Typography> */}
                  {cartItem.mareName && <Typography variant='h6' py={1}>{toPascalCase(`${cartItem.mareName ? cartItem.mareName : ""}`)} {cartItem?.mareName && `x ${cartItem.quantity} Stallions`}</Typography>}
                  {cartItem.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{cartItem.currencyCode?.substring(0, 2)}{(cartItem?.currencySymbol)}{cartItem.price}</Typography>}
                </Grid>
                {<Options index={index} deleteCartValue={deleteItem} cartId={cartItem?.cartSessionId} productId={cartItem?.productId} />}
              </Grid>}

            {cartItem?.productName?.includes("Promoted Stallion") &&
              <Grid container className='cart-checkout'>
                <Grid item lg={10} xs={10}>
                  <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(cartItem?.productName)} </Typography>
                  <Typography variant='h6' py={1}>{cartItem?.quantity} x Stallion (exp. {cartItem?.expiryDate?.split('T')[0]})</Typography>
                  <Typography variant='h6' sx={{ color: '#1D472E' }}>{cartItem?.currencyCode?.substring(0, 2)}{cartItem?.currencySymbol}{cartItem?.price}</Typography>
                </Grid>
                {<Options index={index} deleteCartValue={deleteItem} cartId={cartItem?.cartSessionId} productId={cartItem?.productId} />}
              </Grid>}

            {/* {cartItem?.productName?.includes("Promoted Stallion") &&
                <Grid container className='cart-checkout'>
                  <Grid item lg={10} xs={10}>
                    <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(cartItem?.title)}</Typography>
                    <Typography variant='h6' py={1}>{cartItem?.stallionCount} Stallions (exp. {cartItem?.expiryDate?.split('T')[0]})</Typography>
                    <Typography variant='h6' sx={{ color: '#1D472E' }}>{cartItem?.currencyCode} {' '}  {cartItem?.price}</Typography>
                  </Grid>
                  {isCheckoutRoute && <Options index={index} deleteCartValue={deleteItem} cartId={cartItem?.cartSessionId} productId={cartItem?.productId} />}
                </Grid>} */}

            {(cartItem.type === "nomination" || cartItem.productName?.toLowerCase()?.includes("nomination")) &&
              <Grid container className='cart-checkout'>
                <Grid item lg={10} xs={10}>
                  <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(cartItem?.productName)}</Typography>
                  <Typography variant='h6' py={1}>{toPascalCase(cartItem?.stallionName && `${cartItem?.stallionName} x `)}{toPascalCase(cartItem.mareName || cartItem?.nominationMareName)}</Typography>                    {/* <Typography variant='h6' py={1}>{cartItem?.stallionName} x {cartItem?.mareName} - {cartItem?.personName}</Typography> */}
                  {/* <Typography variant='h6' sx={{ color: '#1D472E' }}>{cartItem?.currency} {' '} {cartItem?.price}</Typography> */}
                  {cartItem.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{cartItem.currencyCode?.substring(0, 2)}{currencySymbolByType(cartItem?.currencyCode)}{cartItem.price}</Typography>}
                </Grid>
                {isCheckoutRoute && <Options index={index} deleteCartValue={deleteItem} cartId={cartItem?.cartSessionId} productId={cartItem?.productId} />}
              </Grid>}

            {(cartItem?.productName === "Local Boost" || cartItem?.productName === 'Extended Boost') &&
              // <Grid container className='cart-checkout'>
              //   <Grid item lg={10} xs={10}>
              //     <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(cartItem?.title)}</Typography>
              //     <Typography variant='h6' py={1}>{toPascalCase(cartItem?.stallionName)}</Typography>
              //     <Typography variant='h6' sx={{ color: '#1D472E' }}>{cartItem?.currency} {' '} {cartItem?.price}</Typography>
              //   </Grid>
              //   {isCheckoutRoute && <Options index={index} deleteCartValue={deleteItem} cartId={cartItem?.cartSessionId} productId={cartItem?.productId} />}
              // </Grid>
              <Grid container className='cart-checkout'>
                <Grid item lg={10} xs={10}>
                  <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(cartItem?.productName)} </Typography>
                  {/* <Typography variant='h6' py={1}>{ cartItem?.quantity } x Stallion (exp. {cartItem?.expiryDate?.split('T')[0]})</Typography> */}
                  <Typography variant='h6' sx={{ color: '#1D472E' }}>{cartItem?.currencyCode?.substring(0, 2)}{cartItem?.currencySymbol}{cartItem?.price}</Typography>
                </Grid>
                {isCheckoutRoute && <Options index={index} deleteCartValue={deleteItem} cartId={cartItem?.cartSessionId} productId={cartItem?.productId} />}
              </Grid>
            }
          </Box>
        ))}
        {
          !(window.location.pathname === '/thankyou') ?
            <Grid container spacing={2} className='gift-code'>
              <Grid item lg={8} sm={8} xs={12} className='gift-mobile'>
                <FormControl variant="filled">
                  <FilledInput
                    fullWidth
                    placeholder='Gift Card or Discount Code'
                    value={inputCoupon}
                    onChange={(e) => handleCouponChange(e)}
                    endAdornment={<Box>
                      {(inputCoupon && isCouponApply) && <InputAdornment position="end">
                        <i className='icon-Confirmed-24px' />
                      </InputAdornment>}
                      {(inputCoupon && isCouponValid === false) && <InputAdornment position='end' onClick={() => setInputCoupon('')}>
                        <i className='icon-Incorrect' />
                      </InputAdornment>
                      }</Box>
                    }
                    error={isCouponValid === false ? true : false}
                  />
                </FormControl>
              </Grid>

              <Grid item lg={4} sm={4} xs={12} className='gift-mobile'>
                <Button fullWidth className='ListBtn'
                  sx={{ height: '46px', fontSize: '16px !important' }}
                  onClick={handleCoupon}
                > Apply</Button>
              </Grid>

            </Grid>
            :
            null
        }

        <Grid container className='btn-checkout'>
          <Grid item lg={3} sm={3} xs={3}>
            <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular' }}>Subtotal:</Typography>
            <Typography variant='h6' py={1} sx={{ fontFamily: 'Synthese-Regular' }} >Discount:</Typography>
            {props?.taxParams ?
              props?.taxParams?.tax_breakdown?.length && <Typography variant='h6' pb={1} sx={{ fontFamily: 'Synthese-Regular' }} >Tax:</Typography>
              :
              <Typography variant='h6' pb={1} sx={{ fontFamily: 'Synthese-Regular' }} >Tax:</Typography>
            }
            <Typography variant='h6'><strong>Total:</strong> </Typography>
          </Grid>

          <Grid item lg={6} sm={6} xs={6} sx={{ textAlign: 'right' }}>
            {updatedList &&
              <Box>
                <Typography variant='h6'>{updatedList[0]?.currencyCode?.substring(0, 2)}{(updatedList[0]?.currencySymbol)}{subTotal}</Typography>
                <Typography variant='h6' py={1}>- {updatedList[0]?.currencyCode?.substring(0, 2)}{(updatedList[0]?.currencySymbol)}{netDiscount ? Number(netDiscount).toFixed(2) : netDiscount}</Typography>
                {props?.taxParams ? props?.taxParams?.tax_breakdown?.map((v: any, index: number) => {
                  return (
                    <Typography variant='h6' pb={1} key={index}>+ ({v?.tax_rate_details?.percentage_decimal}{'%'}) ({String(v?.tax_rate_details?.tax_type).toUpperCase()}) {updatedList[0]?.currencyCode?.substring(0, 2)}{(updatedList[0]?.currencySymbol)}{v.amount}</Typography>
                  )
                })
                  :
                  <Typography variant='h6' pb={1}>+ ({'0%'}) {updatedList[0]?.currencyCode?.substring(0, 2)}{(updatedList[0]?.currencySymbol)}{'0'}</Typography>
                }
                <Typography variant='h6'><strong>{updatedList[0]?.currencyCode?.substring(0, 2)}{(updatedList[0]?.currencySymbol)}{Number((subTotal - netDiscount) + totalTax).toFixed(2)}</strong> </Typography>
              </Box>}
          </Grid>

          {
            isCheckoutRoute ?
              localStorage.accessToken ?
                <Grid item lg={9} xs={12} mt={5} pb={3}>
                  <Button fullWidth className='checkout-Button' onClick={goToPayment} disabled={response.isLoading}>
                    checkout</Button>
                  {/* <Button fullWidth className='checkout-Button' onClick={goToPayment} disabled={response.isLoading || invalidZip}>
                    checkout</Button> */}
                </Grid>
                :
                null
              : null
          }
          {(!isCheckoutRoute && !(window.location.pathname === '/thankyou')) && <Grid lg={9} xs={12} mt={5} pb={3}>
            <Button fullWidth form="payment-form" type='submit' className='checkout-Button' id="paywith"
            //  disabled={invalidZip}
            >Pay {`${(updatedList[0]?.currencySymbol)}${Number((subTotal - netDiscount) + totalTax).toFixed(2)} `}</Button>
          </Grid>}
          {/* {invalidZip && <p className='invalidZip'>{authentication ? 'Please enter a valid zip code' : 'Please allow location in browser'} </p>} */}
        </Grid>

      </>
        :
        <div className='empty-cart-box'>
          <Box className='checkout-box'>
            <Box className='chekout-user'>
              <Typography variant='h3'>No item added in cart</Typography>
            </Box>
          </Box>
        </div>
      }
    </Box>
  )
}

export default OrderList