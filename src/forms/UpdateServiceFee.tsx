import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  StyledEngineProvider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import * as Yup from 'yup';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { VoidFunctionType } from '../@types/typeUtils';
import { toast } from 'react-toastify';

import 'src/pages/stallionDirectory/StallionDirectory.css';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useAddUpdateServiceFeeMutation } from 'src/redux/splitEndpoints/addUpdateServiceFeeSplit';
import { useGetStallionDetailsQuery } from 'src/redux/splitEndpoints/getStallionDetailsSplit';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useGetServiceFeeByYearQuery } from 'src/redux/splitEndpoints/GetServiceFeeByYearSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import { Images } from 'src/assets/images';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export interface UpdateServiceFeeSchemaType {
  feeYear?: number;
  isPrivateFee?: boolean;
  fee?: number;
  currencyId?: number;
}

function UpdateServiceFee(
  open: boolean,
  title: string,
  onClose: VoidFunctionType,
  stallionName: string,
  stallionId: string,
  updateServiceFee: string,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.4 + ITEM_PADDING_TOP,
        boxShadow: 'none',
        marginRight: '2px',
        marginTop: '-2px',
        border: 'solid 1px #161716',
        borderRadius: '0px 0px 6px 6px',
        boxSizing: 'border-box',
      },
    },

  }
  const stallionUUID: any = stallionId;
  const [currency, setCurrency] = useState<any>();
  const [yearSelected, setYearSelected] = useState<any>(new Date().getFullYear());
  const [feeValue, setFeeValue] = useState<number | string>("");
  const { data: stallionData, isSuccess } = useGetStallionDetailsQuery({stallionId:stallionUUID,country:''}, { skip: !open, refetchOnMountOrArgChange: true });
  const [isChecked, setIsChecked] = useState<boolean>(stallionData?.isPrivateFee);
  const { data: YearToStud, isSuccess: isYearOfStudSuccess } = useGetYearToStudQuery()
  const { data: updateServiceFeeData, isSuccess: yearSuccess, status: updateServiceFeeStatus, isError } = useGetServiceFeeByYearQuery({ stallionId: stallionId, feeYear: yearSelected }, { refetchOnMountOrArgChange: true });

  // show success message
  const notifySuccess = () =>
    toast.success('Stud Fee Updated Successfully.', {
      autoClose: 2000,
    });

    // prefilled values
  useEffect(() => {
    if (!!stallionData && 'isPrivateFee' in stallionData) {
      setIsChecked(stallionData?.isPrivateFee);
      setRadioSelectedValue(stallionData?.isPrivateFee);
      setYearSelected(stallionData.feeYear);
      setFeeValue(stallionData?.fee);
      setCurrency(stallionData?.currencyId);
    }
  }, [isSuccess,stallionData])

  // prefilled values
  useEffect(() => {
    if (!!updateServiceFeeData && yearSuccess && !isError && updateServiceFeeStatus === 'fulfilled') {
      setIsChecked(updateServiceFeeData?.isPrivateFee);
      setRadioSelectedValue(updateServiceFeeData?.isPrivateFee);
      setFeeValue(updateServiceFeeData?.fee);
      setCurrency(updateServiceFeeData?.currencyId);
    }
  }, [yearSuccess, updateServiceFeeData])

  // on error reset the values
  useEffect(() => {
    if (isError) {
      setCurrency('none');
      setFeeValue("")
    }
  }, [isError])

  const [radioSelectedValue, setRadioSelectedValue] = useState<any>('false');

  // set stud fee private value
  const handleRadioChange = (event: any) => {
    // console.log(event?.target.checked,'event?.target.checked')
    setRadioSelectedValue(event?.target.checked);
    setIsChecked(event?.target.checked);
  };

  const { data: currencies } = useGetCurrenciesQuery();

  const [addUpdateServiceFee, response] = useAddUpdateServiceFeeMutation();

  // show success message
  useEffect(() => {
    if (response?.isSuccess) {
      notifySuccess()
    }
  }, [response?.isSuccess])

  const UpdateServiceFeeSchema = Yup.object().shape({
    // name:  Yup.string().min(3).required(ValidationConstants.fullNameValidation),
    // countryId:Yup.string().required(ValidationConstants.countryValidation),
    // email:Yup.string().required(ValidationConstants.emailValidation),
  });

  const methods = useForm<UpdateServiceFeeSchemaType>({
    resolver: yupResolver(UpdateServiceFeeSchema),
    mode: 'onTouched',
  });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const watchPrivate = watch('isPrivateFee');
  const watchYear = watch('feeYear');

  // prefilled values
  useEffect(() => {
    if (watchPrivate !== undefined) {
      setIsChecked(watchPrivate);
    }
  }, [watchPrivate]);

  // prefilled values
  useEffect(() => {
    if (watchYear !== undefined) {
      setYearSelected(watchYear);
    }
  }, [watchYear]);

  //Reset the form on closing of the popup
  if (Object.keys(errors).length > 0 && Reset) {
    reset();
    setReset(false);
  }

  // validate form
  const validateFarm: any = () => {
    if (feeValue === '' || currency === 'none') return false;

    return true;
  };

  // submit update fee form
  const SubmitRegisteration = async (data: any) => {
    const { fee, isPrivateFee, feeYear, currencyId } = data;

    const apiData = {
      stallionId: stallionId,
      dataApi: {
        currencyId: currencyId ? Number(currencyId) : currency,
        feeYear: feeYear ? Number(feeYear) : yearSelected,
        isPrivateFee: radioSelectedValue,
        fee: fee ? Number(fee) : feeValue,
      },
    };

    const res = addUpdateServiceFee(apiData);
    reset();
    setReset(false);
    onClose();
  };

  
  return (
    <StyledEngineProvider injectFirst>
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="false"
        className="update-service-fee-wrapper"
      >
        <Box className={'show'} py={2}>
          <Box className='update-fee'>
            <Typography variant="h5">{toPascalCase(stallionName)}</Typography>
            <Typography variant="h6">
              {stallionData?.yob}, {stallionData?.countryName}{' '}
              {stallionData?.sireName &&
                stallionData?.damName &&
                `${toPascalCase(stallionData?.sireName)} x ${toPascalCase(stallionData?.damName)}`}{' '}
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 0, sm: 2, md: 2 }} className="add-stallion-col" pt={4}>
            <Grid item xs={12} sm={3} md={3} className="year-add-stallion">
              {/* <YearSelector
                {...register('feeYear', { required: true })}
                onChange={handleYearSelection}
              /> */}
              <CustomSelect
                fullWidth
                className='selectDropDownBox select-dropdown'
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{ height: '54px', mb: '1rem' }}
                {...register('feeYear', { required: true })}
                value={yearSelected}
                defaultValue={stallionData?.feeYear}
                onChange={(e: any) => setYearSelected(e.target.value)}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  ...MenuPropss
                }}
              >
                <MenuItem className='selectDropDownList' value="none">Year</MenuItem>
                {YearToStud?.map((res: any) => (
                  <MenuItem className='selectDropDownList' value={res.id} key={res.id}>
                    {res.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              <p>{errors.feeYear?.message}</p>
            </Grid>
            <Grid item xs={12} sm={4} md={4} className="currency-add-stallion">
              <CustomSelect
                fullWidth
                className='selectDropDownBox select-dropdown'
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{ height: '54px', mb: '1rem' }}
                // defaultValue={stallionData?.currencyId}
                //  disabled={ yearSelected !== new Date().getFullYear() ? true : false}
                defaultValue={stallionData?.currencyId}
                value={currency}
                {...register('currencyId', { required: true })}
                onChange={(e: any) => setCurrency(e.target.value)}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "right"
                  },
                  ...MenuPropss
                }}
              >
                <MenuItem className='selectDropDownList' value="none" disabled>
                  Currency
                </MenuItem>
                {currencies?.map((res: any) => (
                  <MenuItem className='selectDropDownList' value={res.id} key={res.id}>
                    {res.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              <p>{errors.currencyId?.message}</p>
            </Grid>
            <Grid item xs={12} sm={5} md={5} className="fee-value-add">
              <TextField
                defaultValue={stallionData?.fee}
                {...register('fee')}
                sx={{width: '100%'}}
                placeholder="Enter Fee"
                value={feeValue}
                onChange={(e: any) => { setFeeValue(e.target.value); console.log("BBB: ", e.target.value) }}
              />
              <p>{errors.fee?.message}</p>
            </Grid>
          </Grid>

          <Box className="MakeStudFeeLines">
            
            <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  className='isPrivateFee'
                  // name={'isPrivateFee'}
                  value={radioSelectedValue}
                  checked={isChecked}
                  // value={isChecked}
                  {...register('isPrivateFee')}
                  onClick={handleRadioChange}
                  key={'studFee'}
                  checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                  icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                />
              }
              label={`Make Service Fee Private`}
            />
            <HtmlTooltip
               enterTouchDelay={0}
               leaveTouchDelay={6000}
              className="CommonTooltip studfee-tooltip"
              placement="right-start"
              title={
                <React.Fragment>
                  {'Stud fee is essential within Stallion Match.'}{' '}
                  {' If you make your service fee private, then his '}{' '}
                  {
                    'fee will remain confidential within our platform and will only be used internally for reporting'
                  }
                  .{' '}
                </React.Fragment>
              }
            >
              <i className="icon-Info-circle"></i>
            </HtmlTooltip>
            <p>{errors.isPrivateFee?.message}</p>
          </Box>
          <CustomButton
            type="submit"
            disabled={!validateFarm()}
            fullWidth
            className="lr-btn"
          >
            {' '}
            Save{' '}
          </CustomButton>
        </Box>
      </form>
    </StyledEngineProvider>
  );
}

export default UpdateServiceFee;
