import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyledEngineProvider, Popover, Box, Button, Stack, Typography, Grid } from '@mui/material'
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Images } from 'src/assets/images';
import { useDeleteCartItemMutation } from 'src/redux/splitEndpoints/deleteCartItemSplit';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog';
import PromoteStallion from 'src/forms/PromoteStallion';
// import { ReportItem, PromoteStallion, LocalBoost, ExtendedBoost, Nomination, ProductType } from '../../@types/checkout';
import './checkout.css';
import '../../forms/LRpopup.css'
import { addToReportCart, setIsPaymentSucess } from 'src/redux/actionReducers/reportSlice';
import { useGetCartInfoQuery } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { TitleArray } from 'src/constants/ReportsTitleArray';
import OrderReports from 'src/forms/OrderReports';
import UpdateEmail from 'src/forms/UpdateEmail';
import ActivateNominations from 'src/forms/ActivateNominations';
import { toPascalCase } from 'src/utils/customFunctions';
import { toast } from 'react-toastify';
import useAuth from 'src/hooks/useAuth';
import { usePatchNominationOfferMutation, usePatchNominationOfferRemoveCartMutation } from 'src/redux/splitEndpoints/patchNominationOffer';
import { usePostToTaxDetailsMutation } from 'src/redux/splitEndpoints/postCreatePaypalPaymentIntent';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';


const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -4,
    top: -1,
    color: '#ffffff',
    background: '#C75227',
    border: `1px solid #FFFFFF`,
    padding: '1px 0px 2px',
    borderRadius: '50%',
    minWidth: 'inherit',
    fontFamily: 'Synthese-Bold',
    fontWeight: '700',
    fontSize: '8px',
    lineHeight: '11px',
    letterSpacing: '0.02em',
    width: '16px',
    height: '16px',


  },
}));

type CheckoutProps = {
  orders?: any[];
}

export default function Checkout(props: CheckoutProps) {
  const [deleteCartItem, response] = useDeleteCartItemMutation();
  const localCartReportList: any = useSelector((state: any) => state.reportSlices.cartList)
  const isPaymentSucess: any = useSelector((state: any) => state.reportSlices.isPaymentSucess)

  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [taxParams, setTaxParams] = React.useState<any>();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const { authentication } = useAuth();
  // const [patchNominationOfferMutation, patchNominationResponse] = usePatchNominationOfferMutation();
  const [patchNominationOfferRemoveCartMutation, patchNominationResponse] = usePatchNominationOfferRemoveCartMutation();

  const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  const [getTaxDetails, responseTaxDetails] = usePostToTaxDetailsMutation();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: countriesList } = useCountriesQuery();

  useEffect(() => {
    let reportList = localStorage.getItem('orderReports');
    let reportListData = reportList && JSON.parse(reportList);
    dispatch(addToReportCart(reportListData))
    dispatch(setIsPaymentSucess(false))
  }, [])

  const deleteItem = async (id: any, index: any) => {
    // console.log(id,index,'INDEX');
    if (isLoggedIn) {
      await deleteCartItem({ cartId: id });
      let selectedForNominationProduct: any = {};
      selectedForNominationProduct = updatedOrders[index];
      if (selectedForNominationProduct?.productCode === "NOMINATION_STALLION") {
        patchNominationOfferRemoveCartMutation({ id: selectedForNominationProduct?.nominationId, isAccepted: false });
      }
    } else {
      let updatedlist: any = localCartReportList?.length ? localCartReportList?.filter((item: any, i: any) => i !== index) : [];
      localStorage.setItem("orderReports", JSON.stringify(updatedlist));
      dispatch(addToReportCart(updatedlist));
    }

    handleClose();
  }

  const goToCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpen(true)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  }

  const currencySymbolByType = (currencyType: string) => {
    switch (currencyType) {
      case "AUD":
        return "$";
      default:
        return "$";
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

  let orderLength: any = isLoggedIn ? props?.orders?.length : localCartReportList?.length;
  const updatedOrders: any = (isLoggedIn ? props?.orders : localCartReportList) || [];

  let priceArr: number[] = updatedOrders?.length && updatedOrders?.map((val: any) => val?.price);
  let total = priceArr ? priceArr?.reduce((pv: number, cv: number) => pv + cv, 0) : 0;

  let totalTaxArr = taxParams ? taxParams?.tax_breakdown?.length ? taxParams?.tax_breakdown?.map((val: any) => val.amount) : [0] : [0];
  let totalTax: number = taxParams ? taxParams?.tax_breakdown?.length ? totalTaxArr.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;

  // Get the cart items
  React.useEffect(() => {
    console.log(updatedOrders, 'callled in dis')
    if (localStorage.accessToken) {
      let list: any = [];
      updatedOrders?.forEach((v: any, index: number) => {
        list.push({ amount: v.price, reference: v.productName + index })
      })

      let subTotalArr1 = updatedOrders
        ? updatedOrders?.length
          ? updatedOrders?.map((val: any) => val.price)
          : [0]
        : [0];
      let subTotal: number = updatedOrders ? updatedOrders.length ? subTotalArr1.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;

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
      if (updatedOrders) {
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
            updatedOrders?.forEach((v: any, index: number) => {
              list.push({ amount: v.price, reference: v.productName + index })
            })
            let subTotalArr1 = updatedOrders
              ? updatedOrders?.length
                ? updatedOrders?.map((val: any) => val.price)
                : [0]
              : [0];
            let subTotal: number = updatedOrders ? updatedOrders.length ? subTotalArr1.reduce((pv: number, cv: number) => pv + cv, 0) : 0 : 0;
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
  }, [props.orders]);

  useEffect(() => {
    if (responseTaxDetails.isSuccess) {
      if (responseTaxDetails?.data?.data) {
        setTaxParams(responseTaxDetails?.data?.data);
        // localStorage.setItem('invalidZipcode', 'false');
      }
      // else {
      //   localStorage.setItem('invalidZipcode', 'true');
      // }
    }
    // else {
    //   localStorage.setItem('invalidZipcode', 'true');
    // }
    // console.log(responseTaxDetails, 'responseTaxDetails');
  }, [responseTaxDetails.isLoading])

  return (
    <StyledEngineProvider injectFirst>
      {!isPaymentSucess && orderLength > 0 ? <IconButton aria-label="cart" className='SM-checkout' style={{ marginLeft: "10px" }} onClick={handleClick}>
        <StyledBadge className='badge-counter' badgeContent={orderLength} color="secondary" >
          <img src={Images.Carticon} alt='cart' />
        </StyledBadge>
      </IconButton> : ""}
      <Popover
        sx={{ display: { lg: 'flex', xs: 'flex' }, cursor: 'pointer' }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className="home-dropdown cart-dropdown"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {updatedOrders?.length ?
          <Box>
            {!authentication && (updatedOrders?.map((order: any, index: number) => (
              <Box key={order?.cartSessionId + index} className='cart-checkout-box'>
                {(order.productName?.includes("Report") || order.productName === "Stallion X Breeding Stock Sale") &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      {/* {console.log(order,'ORDER123')} */}
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      {/* <Typography variant='h6' py={1}>{`${order.mareName ? order.mareName : order.productName}`} {order?.mareName && `x ${order.quantity}`} Stallions</Typography>
                      <Typography variant='h6' sx={{ color: '#1D472E' }}>{order.currencyCode} {' '} {order.price}</Typography> */}
                      {order.mareName && <Typography variant='h6' py={1}>{toPascalCase(`${order.mareName ? order.mareName : ""}`)} {order?.mareName && `x ${order.productName === "Stallion Match PRO Report" ? authentication ? order?.quantity : order?.stallions?.length : order.quantity} Stallions`}</Typography>}
                      {order.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{order.currencyCode?.substring(0, 2)}{(order?.currencySymbol)}{order.price}</Typography>}
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}

                {order.productName?.includes("Promoted Stallion") &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      <Typography variant='h6' py={1}>  {toPascalCase(order.stallionName)} (exp. {order?.expiryDate?.split('T')[0]})</Typography>
                      {/* <Typography variant='h6' sx={{ color: '#1D472E' }}>{order.currencyCode} {' '}  {order.price}</Typography> */}
                      {order.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{order.currencyCode?.substring(0, 2)}{(order?.currencySymbol)}{order.price}</Typography>}
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}

                {(order.type === "nomination" || order.productName?.toLowerCase()?.includes("nomination")) &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      <Typography variant='h6' py={1}>{toPascalCase(order?.stallionName && `${order?.stallionName} x `)}{toPascalCase(order.mareName || order?.nominationMareName)}</Typography>
                      {order.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{order.currencyCode?.substring(0, 2)}{currencySymbolByType(order?.currencyCode)}{order.price}</Typography>}
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}

                {(order.type === "localBoost" || order.type === 'extendedBoost') &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      <Typography variant='h6' py={1}>{toPascalCase(order.stallionName)}</Typography>
                      <Typography variant='h6' sx={{ color: '#1D472E' }}>{order.currencyCode?.substring(0, 2)} {' '} {order.price}</Typography>
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}
              </Box>
            )))}
            {authentication && (updatedOrders?.map((order: any, index: number) => (
              <Box key={order?.cartSessionId + index} className='cart-checkout-box'>
                {(order.productCode?.includes("REPORT") || order.productName === "Stallion X Breeding Stock Sale") &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      {/* <Typography variant='h6' py={1}>{`${order.mareName ? order.mareName : order.productName}`} {order?.mareName && `x ${order.quantity}`} Stallions</Typography>
                      <Typography variant='h6' sx={{ color: '#1D472E' }}>{order.currencyCode} {' '} {order.price}</Typography> */}
                      {order.mareName && <Typography variant='h6' py={1}>{toPascalCase(`${order.mareName ? order.mareName : ""}`)} {order?.mareName && `x ${order.productName === "Stallion Match PRO Report" ? isLoggedIn ? order?.quantity : order?.stallions?.length : order.quantity} Stallions`}</Typography>}
                      {order.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{order.currencyCode?.substring(0, 2)}{(order?.currencySymbol)}{order.price}</Typography>}
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}

                {order?.productCode === 'PROMOTION_STALLION' &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      <Typography variant='h6' py={1}>  {toPascalCase(order.stallionName)} (exp. {order?.expiryDate?.split('T')[0]})</Typography>
                      {/* <Typography variant='h6' sx={{ color: '#1D472E' }}>{order.currencyCode} {' '}  {order.price}</Typography> */}
                      {order.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{order.currencyCode?.substring(0, 2)}{(order?.currencySymbol)}{order.price}</Typography>}
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}

                {(order?.productCode === "NOMINATION_STALLION") &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      <Typography variant='h6' py={1}>{toPascalCase(order?.stallionName && `${order?.stallionName} x `)}{toPascalCase(order.mareName || order?.nominationMareName)}</Typography>
                      {order.currencyCode && <Typography variant='h6' sx={{ color: '#005632' }}>{order.currencyCode?.substring(0, 2)}{currencySymbolByType(order?.currencyCode)}{order.price}</Typography>}
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}

                {(order?.productCode === "BOOST_LOCAL" || order?.productCode === 'BOOST_EXTENDED') &&
                  <Grid container className='cart-checkout'>
                    <Grid item lg={10} xs={10}>
                      <Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular', color: '#161716' }}>{toPascalCase(order.productName)}</Typography>
                      <Typography variant='h6' py={1}>{toPascalCase(order.stallionName)}</Typography>
                      <Typography variant='h6' sx={{ color: '#1D472E' }}>{order?.currencyCode?.substring(0, 2)}{(order?.currencySymbol)}{order?.price}</Typography>
                    </Grid>
                    <Options cartId={order.cartSessionId} productId={order.productId} index={index} deleteCartValue={deleteItem} response={response} />
                  </Grid>}
              </Box>
            )))}
            <Grid container className='btn-checkout'>
              <Grid item lg={12} sm={12} xs={12}>
                <Box className='tax-col'>
                {<Typography variant='h6' sx={{ fontFamily: 'Synthese-Regular' }} >Tax:</Typography>} 
                {taxParams ? taxParams?.tax_breakdown?.map((v: any, index: number) => {
                  return (
                    <Typography variant='h6' pl={1} key={index}>+ ({v?.tax_rate_details?.percentage_decimal}{'%'}) ({String(v?.tax_rate_details?.tax_type).toUpperCase()}) {updatedOrders[0]?.currencyCode?.substring(0, 2)}{(updatedOrders[0]?.currencySymbol)}{v.amount}</Typography>
                  )
                })
                : 
                <Typography variant='h6'>+ ({'0%'}) {updatedOrders[0]?.currencyCode?.substring(0, 2)}{(updatedOrders[0]?.currencySymbol)}{'0'}</Typography>
              }
              </Box>
                {updatedOrders?.length > 0 && <Typography variant='h6' py={2}><strong>Total:</strong> {updatedOrders[0]?.currencyCode?.substring(0, 2)}{(updatedOrders[0]?.currencySymbol)}{total + totalTax}</Typography>}              </Grid>
              <Grid item lg={12} sm={12} xs={12} mt={2}>
                <Button fullWidth onClick={goToCheckout} className='checkout-Button'> Checkout</Button>
              </Grid>
            </Grid>
          </Box>
          : ""}
      </Popover>
    </StyledEngineProvider>
  );
}
type OptionParams = {
  cartId: string;
  productId: number;
  index?: any;
  deleteCartValue?: any;
  response?: any;
}

export const Options = ({ cartId, productId, index, deleteCartValue }: OptionParams) => {

  const [openPromotionAlreadyAvailable, setOpenPromotionAlreadyAvailable] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newlyPromoted, setNewlyPromoted] = useState(false);
  const [newlyNominated, setNewlyNominated] = useState(false);
  const [openUpdateEmail, setOpenUpdateEmail] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [stopDate, setStopDate] = useState<string>('');
  const [reportPopupData, setReportPopupData] = React.useState<any>([]);
  const [viewStallionsAnalysed, setViewStallionsAnalysed] = useState<boolean>(false);
  const { data: cartInfo, isSuccess, isError } = useGetCartInfoQuery(cartId, { skip: !openEdit, refetchOnMountOrArgChange: true });
  const reports = [
    { formId: "shortlist_report_1", id: 1 },
    { formId: "stallion_match_pro_2", id: 2 },
    { formId: "broodmare_affinity_report_3", id: 3 },
    { formId: "stallion_match_sales_report_4", id: 4 },
    { formId: "stallion_affinity_report_5", id: 5 },
    { formId: "stallion_dam_sire_report_6", id: 6 },
    { formId: "stallion_breeding_stock_sale_7", id: 14 },
  ]
  useEffect(() => {
    if (isError) {
      toast.error('Cart Product not exist!', {
        autoClose: 2000,
      });
    }
  }, [isError])
  const handleDelete = (id: any) => {
    deleteCartValue(id, index)
  }

  const chooseForm = () => {
    setOpenEdit(true);
    if (productId === 9) {

    }
  }

  useEffect(() => {
    if (isSuccess) {
      if (cartInfo[0].productName === "Promoted Stallion") {
        setNewlyPromoted(true);
      } else if (cartInfo[0].type === "nomination" || cartInfo[0].productName?.toLowerCase()?.includes("nomination")) {
        setNewlyNominated(true);
      } else {
        setOpenReport(true);
      }
      setReportPopupData(cartInfo[0]);
    }
  }, [isSuccess])

  const getFormId = (id: any) => {
    // console.log(id,reports,'IDDD>>>')
    let farmId = '';
    for (let index = 0; index < reports.length; index++) {
      const element = reports[index];
      if (id === element.id) {
        farmId = element.formId;
        break;
      }
    }
    return farmId;
  }

  const closePromotionPopup = () => {
    setNewlyPromoted(false);
  };

  const closePromotionPopupSuccess = () => {
    setNewlyPromoted(false);
  };

  const closeNominationPopup = () => {
    setNewlyNominated(false);
  };

  const closeNominationPopupSuccess = () => {
    setNewlyNominated(false);
  };

  const chosenStopDate: any = (date: string) => {
    setStopDate(date);
  };

  return (
    <Grid item lg={2} xs={2} className='checkout-order-details'>
      {window.location.pathname !== '/thankyou' && <Box><i className='icon-Cross' onClick={() => handleDelete(cartId)} /></Box>}
      {(productId !== 10) && productId !== 7 && productId !== 8 && window.location.pathname !== '/thankyou' && <Typography variant='h5' onClick={chooseForm}>Edit</Typography>}
      {openReport && <WrapperDialog
        reportId={String(reportPopupData.productId == '14' ? 6 : reportPopupData.productId - 1)}
        open={openReport}
        title={TitleArray[reportPopupData.productId == '14' ? 6 : reportPopupData.productId - 1]}
        onClose={() => {
          if (viewStallionsAnalysed) {
            setViewStallionsAnalysed(false)
          } else {
            setOpenReport(false); setOpenEdit(false);
            setViewStallionsAnalysed(false);
          }
        }}
        openOther={() => setOpenUpdateEmail(true)}
        formId={getFormId(reportPopupData.productId)}
        currencyCode={reportPopupData.currencyCode}
        reportPrice={reportPopupData.individualPrice}
        reportCurrencyId={reportPopupData.currencyId}
        reportCurrencySymbol={reportPopupData.currencySymbol}
        cartInfo={cartInfo}
        viewStallionsAnalysed={viewStallionsAnalysed}
        setViewStallionsAnalysed={setViewStallionsAnalysed}
        body={OrderReports}
      />}
      {newlyPromoted &&
        <WrapperDialog
          open={newlyPromoted}
          title={'Promote Stallion'}
          onClose={closePromotionPopup}
          promoteStallionType={() => setOpenPromotionAlreadyAvailable(true)}
          selectedStallionIds={''}
          stallionId={reportPopupData?.stallionId || ''}
          onCloseSuccess={closePromotionPopupSuccess}
          isEdit={true}
          body={PromoteStallion}
        />
      }
      <WrapperDialog
        open={openUpdateEmail}
        title={"Update Email Address"}
        onClose={() => setOpenUpdateEmail(false)}
        body={UpdateEmail}
      />
    </Grid>
  )
}