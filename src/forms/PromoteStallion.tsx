import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { addYears } from 'date-fns';
import * as Yup from 'yup';
import { VoidFunctionType } from '../@types/typeUtils';
import DatePicker from 'src/components/DatePicker';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { dateConvert, dateConvertDisplay, isStartDateInFuture, isToday } from 'src/utils/customFunctions';
import { useAddStallionPromotionMutation } from 'src/redux/splitEndpoints/addStallionPromotionSplit';
import { useGetStallionInfoQuery } from 'src/redux/splitEndpoints/getStallionInfoSplit';
import { usePatchStallionPromotionsMutation } from 'src/redux/splitEndpoints/patchStallionPromotionsSplit';
import { useAddToCartMutation } from 'src/redux/splitEndpoints/addToCart';
import { useGetProductsDetailsBasedOnLocationQuery, useGetProductsSplitQuery } from 'src/redux/splitEndpoints/getProductsSplit';
import { subDays } from 'date-fns/esm';
import { Images } from 'src/assets/images';
import './LRpopup.css';
import { useGetConvertedCurrencyListMutation } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function PromoteStallion(
  title: string,
  onClose: VoidFunctionType,
  promoteStallionType: VoidFunctionType,
  selectedStallionIds: any,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  open: boolean,
  stallionId?: string,
  onCloseSuccess?: VoidFunctionType,
  isEdit?: boolean
) {
  const close = onClose;
  const closeSuccess = onCloseSuccess;
  const openAlreadyAvailable = promoteStallionType;
  const [error, setError] = useState<any>();
  const [productData, setProductData] = useState<any>();
  const [isTermsAndPolicyChecked, setIsTermsAndPolicyChecked] = React.useState<boolean>(false);
  const stallionUUID: any = stallionId;
  const { data: stallionData, isSuccess } = useGetStallionInfoQuery(stallionUUID, { skip: !open, refetchOnMountOrArgChange: true });
  const { data: promoteStallionProductData } = useGetProductsDetailsBasedOnLocationQuery('PROMOTION_STALLION');
  const [getConvertedCurrencyList, getConvertedCurrencyListResponse] = useGetConvertedCurrencyListMutation();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();

  // Success Notification
  const notifySuccess = () =>
    toast.success('Your stallion is scheduled', {
      autoClose: 2000,
    });

  const forgotPasswordSchema = Yup.object().shape({
    //email: Yup.string().email().required('Incorrect email address'),
  });

  const [addPromotion, response] = useAddStallionPromotionMutation();
  const [addToCart, addToCartResponse] = useAddToCartMutation();

  const params = {
    order: 'ASC',
    page: 1,
    limit: 20,
  };
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const { data: Products, isSuccess: productListSuccess } = useGetProductsSplitQuery(params, { skip: !open && !isLoggedIn, refetchOnMountOrArgChange: true });


  const callConversionAPI = () => {
    const user = JSON.parse(window.localStorage.getItem("user") || '{}');
    let userCountryCode = user?.memberaddress[0]?.currencyCode;

    let userCurrencyId: any = null;
    for (let index = 0; index < currencies.length; index++) {
      const element = currencies[index];
      if (element?.label === userCountryCode) {
        userCurrencyId = element?.id;
        break;
      }
    }
    // console.log(userCurrencyId, 'userCurrencyId 123')
    return userCurrencyId;
  }

  // Get promote stallion product details
  useEffect(() => {
    if (Products) {
      let data = Products.filter((v: any) => v.id === 9);
      setProductData(data)
    }
  }, [Products])

  // Show error message
  useEffect(() => {
    if (!!response.error && 'data' in response.error) {
      if (response?.error) {
        close();
      }
    }
  }, [response?.error, response?.isError]);

  // useEffect(() => {
  //   console.log(addToCartResponse, 'addToCartResponse')
  //   if (addToCartResponse.isSuccess) {
  //     let userCurrencyId = callConversionAPI();
  //     if (userCurrencyId) {
  //       console.log(userCurrencyId, promoteStallionProductData[0].currencyId !== userCurrencyId, 'userCurrencyId')
  //       if (promoteStallionProductData[0].currencyId !== userCurrencyId) {
  //         setTimeout(() => {
  //           getConvertedCurrencyList(
  //             {
  //               "currencyId": userCurrencyId,
  //               "cartList": [{ 'cartId': addToCartResponse?.data?.cartSessionId }]
  //             }
  //           )
  //         }, 500);
  //       }
  //     }
  //     // window.location.reload();
  //   }

  // }, [addToCartResponse.isSuccess])

  // Call add to cart api based successfull promotion for first time
  useEffect(() => {
    if (response.isSuccess) {

      const getUsers = async () => {
        const cartData: any = await addToCart({
          productId: 9, currencyId: promoteStallionProductData.length ? promoteStallionProductData[0].currencyId ? promoteStallionProductData[0].currencyId : 1 : 1, price: promoteStallionProductData.length && promoteStallionProductData[0].price, items: [(response.data.promotionUuid)], mareId: "",
          stallionId: "", quantity: 1
        });
        let userCurrencyId = callConversionAPI();
        if (userCurrencyId) {
          if (promoteStallionProductData[0].currencyId !== userCurrencyId) {
            // setTimeout(() => {
              await getConvertedCurrencyList(
                {
                  "currencyId": userCurrencyId,
                  "cartList": [{ 'cartId': cartData?.data?.cartSessionId }]
                }
              )
              window.location.reload();
            // }, 1000);
          } else {
            window.location.reload();
          }
        };
      }

      if (isEdit) {
        // addToCart({
        //   productId: 9, currencyId: promoteStallionProductData.length ? promoteStallionProductData[0].currencyId ? promoteStallionProductData[0].currencyId : 1 : 1, price: promoteStallionProductData.length && promoteStallionProductData[0].price, items: [(response.data.promotionUuid)], mareId: "",
        //   stallionId: "", quantity: 1
        // })
        getUsers();
      }
      if (stallionData?.promotedCount === 0 || stallionData?.promotedCount === null) {
        // addToCart({
        //   productId: 9, currencyId: promoteStallionProductData.length ? promoteStallionProductData[0].currencyId ? promoteStallionProductData[0].currencyId : 1 : 1, price: promoteStallionProductData.length && promoteStallionProductData[0].price, items: [(response.data.promotionUuid)], mareId: "",
        //   stallionId: "", quantity: 1
        // })
        getUsers(); // run it, run it
      }

      close();
    }



    return () => {
      // this now gets called when the component unmounts
    };
  }, [response.isSuccess])

  let startDateOfPromotionFuture: any = isStartDateInFuture(stallionData?.startDate);
  let isStallionAlreadyPromoted: any = stallionData?.isPromoted === 0 && startDateOfPromotionFuture === true ? true : false;
  const [value, setValue] = React.useState<Date | null>(new Date());

  // Set date value on api call
  useEffect(() => {
    setValue(stallionData?.startDate ? (startDateOfPromotionFuture === false) ? new Date() : new Date(stallionData?.startDate) : new Date())
  }, [stallionData])

  // Show success message
  React.useEffect(() => {
    let isTodayFlag = false;
    if (value) {
      isTodayFlag = isToday(value);
    }
    if (response?.isSuccess) {
      if (isTodayFlag) {
        closeSuccess?.();
      } else {
        close();
      }

    }
  }, [response?.isSuccess]);

  // Add one year based on date selection to show expiry date
  const getOneYearAddedDate: any = (d: any) => {
    let year = addYears(new Date(d), 1);
    let subdate = subDays(year, 1);
    let addedYear = dateConvertDisplay(subdate);
    return addedYear;
  };

  // Validate upto date
  const validUptoDate = getOneYearAddedDate(value);

  // Set Date value
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  };

  // Submit promote stallion form
  const handleSubmitPromote = async (data: any) => {
    //sendPasswordTo(email);
    const startDate = dateConvert(value);
    const apiData = {
      stallionId: stallionUUID,
      startDate: startDate,
    };

    const apiDataPatch = {
      promotionId: stallionData?.stallionPromotionId,
      newDate: startDate,
    };

    try {
      const res: any = await addPromotion(apiData);
      const date = dateConvert(stallionData?.startDate)
      if (res?.data) {  
        if (isStartDateInFuture(value)) {
          toast.success('Your stallion promotion is scheduled for'+' '+ '{'+`${date}`+'}', {
            autoClose: 2000,
          });
        } else {
          toast.success('Your stallion is added to cart', {
            autoClose: 2000,
          });
        }
      }
      if (res?.error) {
        toast.error(res?.error?.data?.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {

    }
    // setValue(null);
  };

  // Set Terms And Policy checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsAndPolicyChecked(event.target.checked);
  };

  return (
    <Box className="promote-stallion-wrp">
      <InputLabel>Promote Stallion Settings</InputLabel>
      <span>
        {isStallionAlreadyPromoted ? `This stallion is set to go live on ${dateConvertDisplay(stallionData?.startDate)}. If you would like update this planned go live date, then please enter a new date below.` : 'Congratulations on choosing to promote your stallion on stallionmatch.com. Please confirm the below settings.'}
      </span>

      <form
        className="daterangepromote"
        onSubmit={handleSubmit(handleSubmitPromote)}
        autoComplete="false"
      >
        <Box mt={2} className="effective-date-wrapper promote-effective-date-inner">
          <InputLabel className="startDatehead">{isStallionAlreadyPromoted ? 'New Start Date' : 'Start Date'}</InputLabel>
          <Box className="effective-date-inner">
            <DatePicker value={value} handleChange={handleChange} />
            <HtmlTooltip
              enterTouchDelay={0}
              leaveTouchDelay={6000}
              className="CommonTooltip studfee-tooltip"
              placement="bottom-start"
              sx={{ width: '200px !important' }}
              title={
                <React.Fragment>
                  {
                    <Typography>If you would like to delay</Typography>
                  }{' '}
                  {<Typography>the start, please enter a</Typography>}{' '}
                  {<Typography>date here. For example,</Typography>}{' '}
                  {<Typography>you may wish to wait for</Typography>}{' '}
                  {<Typography>a company wide</Typography>}{' '}
                  {<Typography>announcment date.</Typography>}{' '}
                </React.Fragment>
              }
            >
              <i className="icon-Info-circle"></i>
            </HtmlTooltip>
          </Box>
          <Box className="valid-until">{value && isStallionAlreadyPromoted ? (<p>Valid for 12 months - expires {new Date(stallionData?.startDate)?.getTime() >= new Date()?.setHours(0, 0, 0, 0) ? validUptoDate : stallionData?.lockedExpiryDate ? dateConvertDisplay(stallionData?.lockedExpiryDate) : validUptoDate}</p>) : (value !== null && <p>Valid until {new Date(stallionData?.startDate)?.getTime() >= new Date()?.setHours(0, 0, 0, 0) ? validUptoDate : stallionData?.lockedExpiryDate ? dateConvertDisplay(stallionData?.lockedExpiryDate) : validUptoDate}</p>)}</Box>
        </Box>
        <FormControl className='reg-checkbox'>
          <FormControlLabel
            control={
              <Checkbox
                disableRipple
                className='isPrivateFee'
                value={false}
                {...register('acceptTerms')}
                checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                sx={{ marginRight: '0px' }}
                onChange={handleCheckboxChange}
              />
            }
            label={
              <Box>
                I accept there are additional fees to Promote my stallion as set out in the <a href={`/about/terms`} target="_blank" className="terms-btn">Terms of Service</a>.
              </Box>}
          /></FormControl>
        <LoadingButton
          disabled={!isTermsAndPolicyChecked}
          type="submit"
          fullWidth
          className="AddtoCartBtn"
          loading={isSubmitting}
          sx={{ height: '48px', mt: '1rem', backgroundColor: '' }}
        >
          {isStallionAlreadyPromoted ? 'Save' : 'Add To Cart'}
        </LoadingButton>
      </form>
    </Box>
  );
}

export default PromoteStallion;
