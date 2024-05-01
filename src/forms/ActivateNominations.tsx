import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputLabel,
  Box,
  Typography,
  TextField,
  StyledEngineProvider,
  Radio,
  FormControl,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import CustomDateRangePicker from 'src/components/customDateRangePicker/DateRangePicker';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { dateConvert, isStartDateInFuture } from 'src/utils/customFunctions';
import { useAddActivateNominationMutation } from 'src/redux/splitEndpoints/addActivateNominationSplit';
import { useGetStallionInfoQuery } from 'src/redux/splitEndpoints/getStallionInfoSplit';

import { Images } from 'src/assets/images';
import { addYears } from 'date-fns';
import { subDays } from 'date-fns/esm';
import { LoadingButton } from '@mui/lab';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useGetNominationRequestForStallionRoasterQuery } from 'src/redux/splitEndpoints/postNominationRequestSplit';

export interface ActivateNominationSchemaType {
  nominations?: number;
  acceptTerms?: boolean;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#ffffff',
    color: 'rgba(0, 0, 0, 0.87)',
    // boxShadow: theme.shadows[1],
    fontSize: 16,
    fontFamily: 'Synthese-Book',
    padding: '24px',
    border: '1px solid #E2E7E1',
    borderRadius: '8px',
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
  },
}));

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

function ActivateNominations(title: string,
  onClose: VoidFunctionType,
  stallionName: string,
  stallionId: string,
  activateNomination: string,
  open: boolean,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  chosenDate: (val: string) => void,
  maxExpiryDate?: any,
  onCloseNominated?: VoidFunctionType,

) {
  const close = onClose;
  const { data: stallionData, isSuccess: stallionInfoSuccess } = useGetStallionInfoQuery(stallionId, { skip: !open, refetchOnMountOrArgChange: true });
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();

  const [proExpiryDate, setExpiryDate] = React.useState<Date | null>(null);
  const [radioSelectedValue, setRadioSelectedValue] = useState(false);
  
  
  const callConversionCurrencyId = () => {
    const user =  JSON.parse(window.localStorage.getItem("user") || '{}') ;
    let userCountryCode = user?.memberaddress[0]?.currencyCode ;

    let userCurrencyId: any = null;
      for (let index = 0; index < currencies?.length; index++) {
        const element = currencies[index];
        if (element?.label === userCountryCode) {
          userCurrencyId = element?.id;
          break;
        }
      }
    
    return userCurrencyId ? userCurrencyId : 1;
  }

  let obj = {fee:stallionData?.fee,currency:callConversionCurrencyId(),feeCurrency:stallionData?.currencyId}
  const { data: nominationTierData, isSuccess: isnominationTierDataSuccess, isFetching } =
  useGetNominationRequestForStallionRoasterQuery(obj, { skip: (!stallionData?.currencyId) });

  // Accept terms radio button
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioSelectedValue(true);
  };

  // Add one year based on date selection to show expiry date
  const getOneYearAddedDate: any = (d: any) => {
    let year = addYears(new Date(d), 1);
    let subdate = subDays(year, 1);
    setExpiryDate(subdate);
    // let addedYear = dateConvertDisplay(subdate);
    // return addedYear;
  };

  // Add one year based on date selection to show expiry date
  useEffect(() => {
    if (stallionInfoSuccess) {
      getOneYearAddedDate(dateConvert(stallionData?.startDate))
    }
  }, [stallionInfoSuccess])

  //this api will call for future stop date in for activate nomination
  let startDateOfNominationFuture: any = isStartDateInFuture(stallionData?.nominationStartDate);
  let isStallionAlreadyNominated: any = stallionData?.isNominated === 0 && startDateOfNominationFuture === true ? true : false;
  const [dueDateValue, setDueDateValue] = React.useState<any[]>([null, null]);

  // Set Calendar value on change
  const handleDueDate = (value: any) => {
    if (dueDateValue[0] !== value[0] || dueDateValue[1] !== value[1]) {
      setDueDateValue(value);
    }
  }

  const startDate: any = dateConvert(dueDateValue[0]);
  const endDate: any = dateConvert(dueDateValue[1]);

  // set the default calendar and nomination number
  useEffect(() => {
    setNoOfNominations(stallionData?.nominationPendingCount === null ? null : stallionData?.nominationPendingCount === 0 ? null : stallionData?.nominationPendingCount)
    setDueDateValue(isStallionAlreadyNominated ? [new Date(stallionData?.nominationStartDate), new Date(stallionData?.nominationEndDate)] : [stallionData?.nominationStartDate === null || isStallionAlreadyNominated === false ? null : stallionData?.nominationStartDate, stallionData?.nominationEndDate === null || isStallionAlreadyNominated === false ? null : stallionData?.nominationEndDate])
  }, [stallionData, stallionInfoSuccess])


  const ActivateNominationSchema = Yup.object().shape({
    // nominations: Yup.number()
    // farmCountryId: Yup.string().required(ValidationConstants.countryValidation),
    // farmStateId: Yup.string().notRequired(),
    // farmWebsiteUrl: Yup.string().required(ValidationConstants.farmWebsiteValidation),
  });

  const methods = useForm<ActivateNominationSchemaType>({
    resolver: yupResolver(ActivateNominationSchema),
    mode: 'onTouched'
  });

  // Success message
  const notifySuccess = () =>
    toast.success('Nomination Activated Successfully', {
      autoClose: 2000,
    });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = methods;

  // validate form
  const validateFarm = () => {
    if (
      radioSelectedValue === false
    )
      return false;

    return true;
  };

  const [addNomination, response] = useAddActivateNominationMutation();

  // On success show the message and close the popup
  useEffect(() => {
    if (response?.isSuccess) {
      notifySuccess();
      if (close !== undefined) {
        close?.();
      }
    }
  }, [response?.isSuccess]);

  // Submit nomination form
  const SubmitRegisteration = async (data: any, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    chosenDate(startDate);
    const { nominations } = data;
    const apiData = {
      noOfNominations: Number(noOfNominations),
      stallionId: stallionId,
      startDate: dueDateValue[0] === null ? dateConvert(stallionData?.startDate) : startDate,
      endDate: dueDateValue[1] === null ? dateConvert(stallionData?.expiryDate) : endDate,
    }
    try {
      const res: any = await addNomination(apiData);
      if (res?.error) {
        toast.error(res?.error?.data?.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      // console.log(error)
    }
  };

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    setTimeout(() => {
      reset();
      setReset(false);
    }, 1000);
  };

  const [noOfNominations, setNoOfNominations] = useState('');

  // reset the form value on closing popup
  useEffect(() => {
    if (Reset === false) {
      setNoOfNominations('');
      setRadioSelectedValue(false);
    }
  }, [Reset]);
  
  return (
    <StyledEngineProvider injectFirst>
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="off"
        className="add-stallion-pop-wrapper"
      >
        <Box className={'show'}>
          <Box pb={0} className='nominationSetting'>
            <InputLabel className="search-for-stallion-text"> Nomination Settings </InputLabel>
            <Typography variant="h6">
              When breeders request a nomination with your stallion(s), you will receive notifications. Additional fees apply for nomination sales.
              <LightTooltip 
              enterTouchDelay={0}
              leaveTouchDelay={6000}
              title={'Please enjoy this feature free for now. We will update you when our pricing is made public for Nomination Requests at a later stage.'}>
                <span className='viewfee'>View fees here.</span>
              </LightTooltip>
              {/* <HtmlTooltip
              enterTouchDelay={0}
              leaveTouchDelay={6000}
                className="CommonTooltip viewfee-tooltip"
                placement="right-start"
                sx={{ width: '225px !important' }}
                title={
                  <React.Fragment>
                    <Typography>Please enjoy this feature free for now. We will update you when our pricing is made public for Nomination Requests at a later stage.</Typography> 
                  </React.Fragment>
                }
              >
                <Box className='viewfee'>View fees here.</Box>
              </HtmlTooltip> */}

            </Typography>
          </Box>
          <Box mt={4}>
            <InputLabel sx={{ whiteSpace: 'break-spaces' }}>Number of Nominations Available (Optional)</InputLabel>
            <Stack direction='row' className="fee-value-add">
              <TextField
                type="number"
                sx={{ width: '204px' }}
                {...register('nominations', { required: true })}
                placeholder="Enter Number"
                autoComplete="off"
                value={noOfNominations}
                onChange={(e: any) => setNoOfNominations(e.target.value)}
              />
              {/* <p>{errors.nominations?.message}</p> */}
              <HtmlTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                className="CommonTooltip"
                placement="right-start"
                sx={{ width: '195px !important' }}
                title={
                  <React.Fragment>
                    {/* <Typography color="inherit">Tooltip with HTML</Typography> */}
                    <Typography>Select the number of nominations you would like to make available on stallionmatch.com.</Typography>
                    {' '}
                    {'Leave blank for unlimited nomination requests.'}
                    {' '}
                  </React.Fragment>
                }
              >
                <Box className='info'><i className="icon-Info-circle"></i></Box>
              </HtmlTooltip>
            </Stack>
          </Box>
          <Box mt={2} mb={5}>
            <InputLabel>Start / End Dates (Optional)</InputLabel>
            <Stack direction='row'>

              <CustomDateRangePicker placeholder="Enter Date Range" maxDate={proExpiryDate} roster={true} disabledPast={true} dueDate={dueDateValue} handleDueDate={handleDueDate} />
              <HtmlTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                className="CommonTooltip"
                placement="right-start"
                sx={{ width: '195px !important' }}
                title={
                  <React.Fragment>
                    {/* <Typography color="inherit">Tooltip with HTML</Typography> */}
                    {'Leave blank if you would like to start offering nominations from today. Otherwise you may set and start and expiry date.'}{' '}
                    {' '}
                  </React.Fragment>
                }
              >
                <Box className='info'><i className="icon-Info-circle"></i></Box>
              </HtmlTooltip>
            </Stack>
          </Box>

        </Box>
        <Box pb={2} className='check-nomination'>
          {' '}
          <FormControl>
            <FormControlLabel
              // value="false"
              control={<Radio disableRipple onChange={handleRadioChange} value={radioSelectedValue} checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                icon={<img src={Images.Radiounchecked} alt="checkbox" />} />}
              {...register('acceptTerms')}
              // label={`I accept there are additional fees for accepting Nomination offers as set out in the Terms of Service.`}
              label={
                <Box className="check-nominationterms">
                  I accept there are additional fees for accepting Nomination offers as set out in the 
                  <HtmlTooltip
                enterTouchDelay={0}
                leaveTouchDelay={500000}
                className="CommonTooltip termsTooltip"
                placement="right-start"
                sx={{ width: '325px !important' }}
                title={
                  <React.Fragment>
                    <Typography>You will incur a nominal charge of {nominationTierData?.currencyCode?.substring(0, 2)}{nominationTierData?.currencySymbol}{nominationTierData?.feeToPay} each time you accept a Nomination Request. When a breeder sends a Nomination Request, they are regarded as a promising lead that you should actively follow up on.</Typography>
                  </React.Fragment>
                }
              > 
              <span className='viewfee'>Terms of Service.</span>
              </HtmlTooltip>
                </Box>
              }
              className="SDradio"
            />
          </FormControl>
          {/* <p>{nominationTierData?.currencySymbol}{nominationTierData?.feeToPay}</p> */}


        </Box>
        <Box> <LoadingButton type="submit" disabled={!validateFarm()} loading={isSubmitting} fullWidth className="lr-btn">
          {' '}
          Activate Nominations{' '}
        </LoadingButton></Box>
      </form>
    </StyledEngineProvider>
  );
}

export default ActivateNominations;
