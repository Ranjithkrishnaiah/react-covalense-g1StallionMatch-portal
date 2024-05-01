import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputLabel, Box, Typography, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { dateConvert, dateConvertDisplay, isStartDateInFuture, isToday } from 'src/utils/customFunctions';
import DatePicker from 'src/components/DatePicker';
import { useStopStallionPromotionMutation } from 'src/redux/splitEndpoints/stopStallionPromotionSplit';
import { useStopStallionNominationMutation } from 'src/redux/splitEndpoints/stopStallionNominationSplit';
import { useGetStallionInfoQuery } from 'src/redux/splitEndpoints/getStallionInfoSplit';
import { usePatchStopPromotionMutation } from 'src/redux/splitEndpoints/patchStopPromotionSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import { addYears } from 'date-fns';
import { subDays } from 'date-fns/esm';
import { LoadingButton } from '@mui/lab';
import { Spinner } from 'src/components/Spinner';

export interface StopNominationSchema {
  stallionName: string;
}

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


function ConfirmStopNomination(
  closeAndReset: VoidFunctionType,
  promoted: boolean,
  nominated: boolean,
  stallionName: string,
  stallionId: string,
  closeConfirmPopupFuture: VoidFunctionType,
  expiryDate: any,
  open: boolean,
  chosenDate: (val: string) => void,
  Reset: boolean
) {
  const close = closeAndReset;
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [proExpiryDate, setExpiryDate] = React.useState<Date | null>(null);
  const [stopPromotionApi, responsePromotion] = useStopStallionPromotionMutation();
  const [stopNominationApi, responseNomination] = useStopStallionNominationMutation();
  const stallionUUID: any = stallionId;

  const { data: stallionData, isSuccess, isFetching } = useGetStallionInfoQuery(stallionUUID, { skip: !open, refetchOnMountOrArgChange: true });
  let stopDateOfPromotionFuture: any = isStartDateInFuture(stallionData?.nominationEndDate);
  const [patchStopPromotion, patchResponse] = usePatchStopPromotionMutation();

  const ActivateNominationSchema = Yup.object().shape({
    // farmName: Yup.string().required(ValidationConstants.farmNameValidation),
    // farmCountryId: Yup.string().required(ValidationConstants.countryValidation),
    // farmStateId: Yup.string().notRequired(),
    // farmWebsiteUrl: Yup.string().required(ValidationConstants.farmWebsiteValidation),
  });

  // Add one year based on date selection to show expiry date
  const getOneYearAddedDate: any = (d: any) => {
    let year = addYears(new Date(d), 1);
    let subdate = subDays(year, 1);
    // console.log(subdate, 'ADDED -> sub')
    setExpiryDate(subdate);
  };

  // set calendar value
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  // Add one year based on date selection to show expiry date
  useEffect(() => {
    if (isSuccess) {
      getOneYearAddedDate(dateConvert(stallionData?.startDate))
    }
  }, [isSuccess])

  // Set Calendar value to today's date
  useEffect(() => {
    if (!open) {
      setValue(new Date());
    }
  }, [open])

  const methods = useForm<StopNominationSchema>({
    resolver: yupResolver(ActivateNominationSchema),
    mode: 'onTouched',
  });

  // Show success message
  const notifySuccess = () =>
    toast.success('Nomination Requests Stopped Successfully.', {
      autoClose: 2000,
    });

  let isStallionAlreadyStopped: any = stallionData?.isNominated === 1 && stopDateOfPromotionFuture === true ? true : false;;

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = methods;

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
  }

  // Validate form
  const validateFarm = () => {
    if (!value) return false;

    return true;
  };

  // Show success message and close the popup
  useEffect(() => {
    let isTodayFlag = false;
    if (value) {
      isTodayFlag = isToday(value);
    }
    if (responseNomination?.isSuccess) {
      notifySuccess();
      if (!isTodayFlag) {
        closeConfirmPopupFuture?.();
      }
      else {
        closeConfirmPopupFuture?.();
      }
    }
  }, [responseNomination?.isSuccess])

  // Submit stop nomination form
  const StopPromotionOrNomination = (data: any, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    const convertedDate = dateConvert(value);
    chosenDate(convertedDate)

    const apiData = {
      stallionId: stallionId,
      dataApi: {
        effectiveDate: convertedDate,
      },
    };

    const apiDataFuture = {
      promotionId: stallionData?.stallionPromotionId,
      dataApi: {
        effectiveDate: convertedDate,
        stallionId: stallionData.stallionId
      },
    }
    if (promoted && !isStallionAlreadyStopped) {
      stopPromotionApi(apiData);
    }
    if (promoted && isStallionAlreadyStopped) {
      patchStopPromotion(apiDataFuture);
    }
    if (nominated) {
      stopNominationApi(apiData);
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      {isFetching && <Spinner />}
      <form
        onSubmit={handleSubmit(StopPromotionOrNomination)}
        autoComplete="false"
        className={`add-stallion-pop-wrapper remove-modal-roaster-wrapper ${isFetching ? 'hide' : ''}`}
      >
        <Box className={'show'}>
          {promoted && (
            <>
              <Box sx={{ pt: { lg: '1rem', xs: '0px' }, pb: '0' }}>
                {promoted && isStallionAlreadyStopped ? (
                  <Typography variant="h6">Stop Promoting Stallion</Typography>
                ) : (
                  <Typography variant="h6">
                    Are you sure you want to stop promoting {toPascalCase(stallionName || '--stallionName--')}?
                  </Typography>
                )}
              </Box>

              <Box>
                {promoted && isStallionAlreadyStopped ? (
                  <Typography component="p">
                    {' '}
                    This stallion is set to be deactivated on {dateConvertDisplay(stallionData?.expiryDate)}. If you would like update this
                    planned date, then please enter a new date below..
                  </Typography>
                ) : (
                  <Typography component="p">
                    {' '}
                    Your stallion will stop being promoted and you will no longer have access to the
                    additional features assciated including breeder information and stallion
                    analytics.
                  </Typography>
                )}
              </Box>
            </>
          )}
          {nominated && (
            <>
              <Box py={2} pb={0}>
                <Typography variant="h6">
                  Are you sure you want to stop nominations for {toPascalCase(stallionName || '--stallionName--')}?
                </Typography>
                <Box>
                  <Typography component="p">
                    Nominations for your stallion will stop and you will no longer be able to offer
                    this service to our global breeder audience. Please select a date below to stop
                    this service.
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          <Box my={3} className="effective-date-wrapper">
            <InputLabel>{'Effective Date'}</InputLabel>
            <Box className="effective-date-inner">
              <DatePicker value={value} maxDate={proExpiryDate} handleChange={handleChange} />
              <HtmlTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                className="CommonTooltip"
                placement="right-start"
                sx={{ width: '195px !important' }}
                title={
                  <React.Fragment>
                    {'Please enter the date you '} {' would like to Stop '}{' '}
                    {`${promoted ? 'Promoting' : 'Nominating'} your stallion`}.{' '}
                  </React.Fragment>
                }
              >
                <i className="icon-Info-circle"></i>
              </HtmlTooltip>
            </Box>
          </Box>
        </Box>
        {promoted && isStallionAlreadyStopped ? (

          <LoadingButton type="submit" fullWidth loading={isSubmitting} className="lr-btn">
            {'Save'}
          </LoadingButton>

        ) : (
          <Box className="remove-modal-bottom">
            <CustomButton fullWidth onClick={close} className="lr-btn">
              Cancel
            </CustomButton>
            <LoadingButton
              type="submit"
              fullWidth
              disabled={!validateFarm()}
              loading={isSubmitting}
              className="lr-btn lr-btn-outline"
            >
              {promoted ? 'Stop Promoting' : 'Stop Nominating'}
            </LoadingButton>
          </Box>
        )}
      </form>
    </StyledEngineProvider>
  );
}

export default ConfirmStopNomination;
