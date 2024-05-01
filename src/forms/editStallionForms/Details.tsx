import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Stack,
  Typography,
  Select,
  Alert,
  AlertTitle,
  Checkbox,
} from '@mui/material';
import * as _ from 'lodash';
import * as Yup from 'yup';
import { Images } from 'src/assets/images';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  usePatchStallionDetailsByIdMutation,
  usePostStallionProfileImageUploadMutation,
} from 'src/redux/splitEndpoints/PatchStallionDetailsByIdSplit';

import { HtmlTooltip } from 'src/components/HtmlTooltip';
import { useGetColoursQuery } from 'src/redux/splitEndpoints/getColoursSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useGetServiceFeeByYearQuery } from 'src/redux/splitEndpoints/GetServiceFeeByYearSplit';
import { v4 as uuid } from 'uuid';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import useAuth from 'src/hooks/useAuth';
import CropImageDialog from 'src/components/CropImageDialog';
import { useStallionProfileImageUploadStatusMutation } from 'src/redux/splitEndpoints/mediaUploadStatus';
import { Spinner } from 'src/components/Spinner';
import { toast } from 'react-toastify';
import { toPascalCase } from 'src/utils/customFunctions';

type DetailsProps = {
  prevProps: any;
  next: () => void;
  Reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
};

const Details = forwardRef<HTMLButtonElement | null, DetailsProps>((detailsProps, submitRef) => {
  // Layout Settings code
  const { prevProps, next } = detailsProps;
  const [activeStep, setActiveStep] = useState<any>(prevProps.activeStep);

  useEffect(() => {
    if (prevProps.activeStep) {
      setActiveStep(0);
    }
  }, [prevProps.activeStep]);

  const props = prevProps.stallionDetails;
  const fileuuid: any = uuid();

  const { data: colours, isSuccess: isColoursSuccess } = useGetColoursQuery();
  const { data: YearToStud, isSuccess: isYearOfStudSuccess } = useGetYearToStudQuery();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { authentication } = useAuth();
  const { data: farmList } = useGetUsersFarmListQuery(null, { skip: !authentication });
  const [profileImage, response] = usePostStallionProfileImageUploadMutation();

  const [colourId, setColourId] = useState(props?.colourId);
  const [farmId, setFarmId] = useState(props?.farmId);
  const [profileUpdate] = usePatchStallionDetailsByIdMutation();

  const [submissionError, setSubmissionError] = useState<any>();
  const [profileImageFile, setProfileImageFile] = useState<any>();
  const [profileImagePreview, setProfileImagePreview] = useState<any>(props?.profilePic);
  const [presignedProfilePath, setPresignedProfilePath] = useState<any>();

  const [currencyId, setCurrencyId] = useState(props?.currencyId);
  const [feeValue, setFeeValue] = useState<any>('');
  const [isChecked, setIsChecked] = useState<boolean>(props?.isPrivateFee || false);
  const [radioSelectedValue, setRadioSelectedValue] = useState<any>(props?.isPrivateFee || false);
  const [yearSelected, setYearSelected] = useState<any>(new Date().getFullYear());

  const [openEditImageDialog, setOpenEditImageDialog] = useState<any>(false);
  const [imageFile, setImageFile] = useState<File>();
  const [cropImageFile, setCropImageFile] = useState<File>();
  const [cropPrevImg, setCropPrevImg] = useState<any>();
  const [uploadInProgress, setUploadInProgress] = useState<any>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    prevProps.setSetChanges(true);
  };
  const {
    data: updateServiceFeeData,
    isSuccess: yearSuccess,
    status: updateServiceFeeStatus,
    isError,
  } = useGetServiceFeeByYearQuery({ stallionId: props?.stallionId, feeYear: yearSelected });
  useEffect(() => {
    if (!props && 'isPrivateFee' in props) {
      setIsChecked(props?.isPrivateFee);
      setRadioSelectedValue(String(props?.isPrivateFee));
    }
  }, [props?.isPrivateFee]);

  useEffect(() => {
    setIsChecked(updateServiceFeeData?.isPrivateFee);
    setRadioSelectedValue(String(updateServiceFeeData?.isPrivateFee));
    setFeeValue(updateServiceFeeData?.fee?.toLocaleString());
    setCurrencyId(updateServiceFeeData?.currencyId);
  }, [updateServiceFeeData]);

  useEffect(() => {
    if (isError) {
      setCurrencyId(1);
      setFeeValue('');
    }
  }, [isError]);
  //const heightFormat = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*([()\/])?\s*$/gm;
  //const heightFormat = /^\d+\.\d+$|^\d+\.\d+\(\d+\/\d+\)$/;
  const heightFormat = /^((\d+(\.\d*)?)|(\.\d+))|\d+\.\d+$|^\d+\.\d+\(\d+\/\d+\)$/
  const yearFormat = /^[12][0-9]{3}$/gm;
  const validationSchema = Yup.object().shape({
    yearToStud: Yup.string()
      .matches(yearFormat, 'Please enter correct year to Stud.')
      .required('Year to stud is required.'),
    farmId: Yup.string().required('Farm details is required.'),
    height: Yup.string()
      .matches(heightFormat, 'Please enter correct height.')
      .required('Height is required.'),
    fee: Yup.string(),
    isPrivateFee: Yup.boolean(),
    profileImageuuid: Yup.string(),
  });

  const methods = useForm<any>({
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  });
  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const watchPrivate = watch('isPrivateFee');
  const watchYear = watch('feeYear');

  useEffect(() => {
    if (watchPrivate !== undefined) {
      setIsChecked(watchPrivate);
    }
  }, [watchPrivate]);

  useEffect(() => {
    if (watchYear !== undefined) {
      setYearSelected(watchYear);
    }
  }, [watchYear]);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name != 'dynamic') prevProps.setSetChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { fields, append, remove } = useFieldArray({ name: 'dynamic', control });
  const [numberOfTestimonials, setNumberOfTestimonials] = useState<any>();

  useEffect(() => {
    const newVal = parseInt(numberOfTestimonials || 1);

    const oldVal = fields.length;
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ title: '', company: '', description: '' });
      }
      setNumberOfTestimonials(newVal);
    } else {
      // remove tickets from field array
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfTestimonials]);
  // Media Upload check until lamda success
  const [mediaUploadSuccess, mediaUploadSuccessResponse] = useStallionProfileImageUploadStatusMutation();
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const SendDetails: SubmitHandler<any> = async (data: any, event?: React.BaseSyntheticEvent) => {
    data = {
      ...data,
      stallionId: props.stallionId,
      height: data.height,
      feeYear: data?.feeYear ? Number(data?.feeYear) : props?.feeYear,
      fee: feeValue ? parseInt(feeValue.replace(/\D/g, '') ) : 0,
      currencyId: currencyId ? Number(data?.currencyId) : props?.currencyId,
      isPrivateFee: isChecked ? isChecked : false,
      ...(profileImageFile && { profileImageuuid: profileImageFile.fileuuid }),
    };
    if (!detailsProps.prevProps.isChanges) {
      next();
      return false;
    }
    try {
      setUploadInProgress(true);
      const res = await profileUpdate(data);
      const response: any = res;
      if (response.error) {
        if (response.error.status == 422) {
          setSubmissionError(response.error);
        } else if (response.error.status > 499) {
          setSubmissionError(
           // 'Internal Server Error'
           'Slow or no internet connection. Please check your internet settings'
          );
        }
        setUploadInProgress(false);
      } else {
        if (profileImageFile) {
          const uploadOptions = { method: 'Put', body: cropImageFile };
          const result = await fetch(presignedProfilePath, uploadOptions);

          // Media Upload check until lamda success
          const mediaFileuuid = profileImageFile.fileuuid;
          let count = 1;
          const interval = setInterval(async () => {
            if (count >= 1) {
              let data: any = await mediaUploadSuccess([
                mediaFileuuid,
              ]);
              if (data.error.data != 'SUCCESS') {
                count++;
                if (count === 10) {
                  clearInterval(interval);
                }
              } else {
                count = 0;
                setUploadInProgress(false);
                next();
              }
            }
          }, 3000);
        } else {
          next();
        }
      }
    } catch (error) {
      setSubmissionError(error);
      setUploadInProgress(false);
    }
  };

  const inputFile = useRef<any>({});
  const profileImageUpload = async () => {
    inputFile.current.click();
  };

  const validateResolution = (file: any) => {
    //Read the contents of Image File.
    var reader = new FileReader();
    var flag = '';
    reader.readAsDataURL(file);
    reader.onload = function (e: any) {
      //Initiate the JavaScript Image object.
      var image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;

      //Validate the File Height and Width.
      image.onload = function (this: any) {
        var height = this.height;
        var width = this.width;
        if (height > 120 && width > 120) {
          setImageFile(file);
          prevProps.setSetChanges(true);
          callProfileAPI(file);
        } else {
          toast.error(`The image dimensions must be at least 120px*120px.`)
        }
      };
    }
  }

  const onChangeFile = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (file.size < 10000000) {
      validateResolution(file);
    } else {
      toast.error('File size exceeded. Maximum upload file size is 10MB');
    }
  };

  const callProfileAPI = (file: any) => {
    try {
      profileImage({
        fileName: file.name,
        fileuuid,
        fileSize: file.size,
        stallionId: props.stallionId,
      }).then(async (res: any) => {
        const details = { file, fileuuid };
        setProfileImageFile(details);
        setProfileImagePreview(URL.createObjectURL(file));
        setPresignedProfilePath(res.data.url);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        borderTop: 0,
        boxShadow: 'none',
        marginRight: '2px',
        borderRadius: '0 0 6px 6px',
        marginTop: '-2px',
        border: 'solid 1px #161716',
        boxSizing: 'border-box',
      },
    },
  };
  const DropProps: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '0px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        marginTop: '-2px',
        borderRadius: '0px 0px 6px 6px',
        boxSizing: 'border-box',
      },
    },
  };

  useEffect(() => {
    if (imageFile != undefined) {
      setOpenEditImageDialog(true);
    }
  }, [imageFile]);

  return (
    <Box mt={4} className="edit-stallion-profile-modal">
      <form onSubmit={handleSubmit(SendDetails)} autoComplete="false">
        <Box>
          <React.Fragment>
            <Box className="stallion-profile-container">
              <Typography>
                <Grid container sx={{ justifyContent: 'center' }} className="dialogPopup">
                  <Grid item lg={12} xs={12} className="profile-picture-wrapper">
                    <Stack className="profile-picture">
                      <InputLabel>Stallion Profile</InputLabel>

                      <Avatar
                        src={
                          cropPrevImg ? cropPrevImg : props.profilePic ? `${props.profilePic}?w=126&h=126&fit:crop&ar=1:1` : profileImagePreview ? profileImagePreview : Images.Userprofile
                        }
                        alt={props?.horseName}
                      />
                     
                      <input
                        type="file"
                        id="file"
                        ref={inputFile}
                        style={{ display: 'none' }}
                        onChange={onChangeFile}
                        onClick={(event: any) => {
                          event.target.value = null;
                        }}
                      />
                      <Box mt={1}>
                        <Button type="button" className="EditBtn" onClick={profileImageUpload}>
                          {props.profilePic || cropPrevImg ? 'Edit' : 'Add'}
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item lg={12} xs={12} className="profile-picture-wrapper">
                    <Box className="edit-stallion-profile-form" mt={5}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                          <Box>
                            <InputLabel>Stallion Name</InputLabel>
                            <TextField
                              fullWidth
                              type="text"
                              autoComplete="new-password"
                              placeholder="Stallion Name"
                              {...register('horseName', { required: true })}
                              disabled
                              value={toPascalCase(props.horseName)}
                            />
                            <p>{errors.horseName?.message}</p>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                          <Grid container spacing={3} className="stallion-profile-col-arr">
                            <Grid item xs={12} sm={4} md={4} lg={3} className="stallion-profile-col-list">
                              <InputLabel>Fee Year</InputLabel>
                              <Select
                                fullWidth
                                IconComponent={KeyboardArrowDownRoundedIcon}
                                sx={{ height: '54px' }}
                                {...register('feeYear', { required: true })}
                                defaultValue={props?.feeYear}
                                value={yearSelected}
                                onChange={(e: any) => { setYearSelected(e.target.value); prevProps.setSetChanges(true); }}
                                MenuProps={{
                                  anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                  },
                                  transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                  },
                                  ...DropProps,
                                }}
                              >
                                {YearToStud?.map((res: any) => (
                                  <MenuItem
                                    className="selectDropDownList"
                                    value={res.id}
                                    key={res.id}
                                  >
                                    {res.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              <p>{errors?.feeYear?.message}</p>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={3} className="stallion-profile-col-list">
                              <InputLabel>Currency</InputLabel>
                              <Select
                                fullWidth
                                IconComponent={KeyboardArrowDownRoundedIcon}
                                sx={{ height: '54px' }}
                                MenuProps={{
                                  anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                  },
                                  transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                  },
                                  ...DropProps,
                                }}
                                value={currencyId}
                                defaultValue={props?.currencyId}
                                {...register('currencyId', { required: true })}
                                onChange={(e: any) => { setCurrencyId(e.target.value); prevProps.setSetChanges(true); }}
                              >
                                {currencies?.map((res: any) => (
                                  <MenuItem
                                    className="selectDropDownList"
                                    value={res.id}
                                    key={res.id}
                                  >
                                    {res.label}{res?.currencySymbol}
                                  </MenuItem>
                                ))}
                              </Select>
                              <p>{errors.currencyId?.message}</p>
                            </Grid>

                            <Grid item xs={12} sm={4} md={4} lg={6} className="stallion-profile-col-list">
                              <InputLabel>Stud Fee</InputLabel>
                              <TextField
                                fullWidth
                                type="text"
                                autoComplete="new-password"
                                placeholder="Stud Fee"
                                value={feeValue}
                                {...register('fee', { required: true })}
                                onChange={(e: any) => {
                                  const oldVal = e.target.value.replace(/\D/g, '');
                                  const result = Number(oldVal).toLocaleString();
                                  setFeeValue(result);
                                  prevProps.setSetChanges(true);
                                }}
                                defaultValue={props?.fee}
                              />
                              <p>{errors.fee?.message}</p>
                            </Grid>

                            <Grid item xs={12} className="MakeStudFeeLines studfee-stallion-pr">
                              <FormControl>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      disableRipple
                                      className="isPrivateFee"
                                      name={'isPrivateFee'}
                                      checked={isChecked}
                                      onChange={handleCheckboxChange}
                                      value={radioSelectedValue}
                                      key={'Make Stud Fee Private'}

                                      icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                                      checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                                    />
                                  }
                                  label={'Make Stud Fee Private'}
                                />
                              </FormControl>
                              <HtmlTooltip
                              enterTouchDelay={0}
                              leaveTouchDelay={6000}
                                className="CommonTooltip studfee-tooltip edit-tooltip"
                                placement="bottom"
                                title={
                                  <React.Fragment>
                                    {'Stud fee is essential within Stallion Match.'}{' '}
                                    {' If you make your service fee private, then his '}{' '}
                                    {
                                      'fee will remain confidential within our platform and will only be used internally for reporting.'
                                    }
                                    {' '}
                                  </React.Fragment>
                                }
                              >
                                <i className="icon-Info-circle" />
                              </HtmlTooltip>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx farm-st-form-bx">
                          <Box>
                            <InputLabel>Farm</InputLabel>
                            <Select
                              fullWidth
                              IconComponent={KeyboardArrowDownRoundedIcon}
                              sx={{ height: '54px' }}
                              MenuProps={MenuProps}
                              {...register('farmId', { required: true })}
                              defaultValue={props.farmId}
                              onChange={(e: any) => { setFarmId(e.target.value); prevProps.setSetChanges(true); }}
                            >
                              <MenuItem className="selectDropDownList" value="none" disabled>
                                <em>Select Farm</em>
                              </MenuItem>
                              {farmList?.map((res: any) => (
                                <MenuItem
                                  className="selectDropDownList"
                                  value={res.farmId}
                                  key={res.farmId}
                                >
                                  <span className='farm-st-form-bx-list'>
                                  {toPascalCase(res.farmName)}{res.stateName ? ` ${res.stateName}` : ''}{res.countryCode ? `, ${res.countryCode}` : ''}
                                  </span>
                                </MenuItem>
                              ))}
                            </Select>
                            <p>{errors.farmId?.message}</p>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx" />

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                          <Box>
                            <InputLabel>Year of Birth</InputLabel>
                            <TextField
                              fullWidth
                              type="text"
                              autoComplete="new-password"
                              placeholder="0000"
                              disabled
                              {...register('yob', { required: true })}
                              value={props.yob}
                            />
                          </Box>
                          <p>{errors.yob?.message}</p>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                          <Box>
                            <InputLabel>Height (Hands)</InputLabel>
                            <TextField
                              fullWidth
                              autoComplete="new-password"
                              placeholder="Height"
                              {...register('height', { required: true })}
                              defaultValue={props.height}
                            />
                          </Box>
                          <p>{errors.height?.message}</p>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                          <Box>
                            <InputLabel>Colour</InputLabel>
                            <Select
                              fullWidth
                              IconComponent={KeyboardArrowDownRoundedIcon}
                              sx={{ height: '54px', mb: '1rem' }}
                              MenuProps={MenuProps}
                              {...register('colourId', { required: true })}
                              defaultValue={props.colourId}
                              disabled
                              onChange={(e: any) => { setColourId(e.target.value); prevProps.setSetChanges(true); }}
                            >
                              <MenuItem className="selectDropDownList" value="none" disabled>
                                <em>Select Colour</em>
                              </MenuItem>
                              {colours?.map((res: any) => (
                                <MenuItem
                                  className="selectDropDownList"
                                  value={res.id}
                                  key={res.id}
                                >
                                  {res.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <p>{errors.colourId?.message}</p>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                          <Box>
                            <InputLabel>Year to Stud</InputLabel>
                            <TextField
                              fullWidth
                              autoComplete="new-password"
                              placeholder="YYYY"
                              inputProps={{ maxLength: 4 }}
                              {...register('yearToStud', { required: true })}
                              defaultValue={props.yearToStud}
                            />
                          </Box>
                          <p>{errors.yearToStud?.message}</p>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Typography>
              <button type="submit" className="hide" ref={submitRef}></button>
              {submissionError ? (
                <Grid item xs={12} sm={6} lg={6}>
                  <Alert severity="error">
                    <AlertTitle>Internal Server Error</AlertTitle>
                    <strong>{submissionError}</strong>
                  </Alert>
                </Grid>
              ) : (
                ''
              )}
            </Box>
          </React.Fragment>
        </Box>
      </form>
      {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}

      <CropImageDialog
        open={openEditImageDialog && response.isSuccess}
        title={`${props.profilePic ? 'Edit' : 'Add'} Stallion Image`}
        onClose={() => setOpenEditImageDialog(false)}
        imgSrc={profileImagePreview ? profileImagePreview : ''}
        imgName={imageFile?.name || ''}
        imgFile={imageFile}
        awsUrl={presignedProfilePath}
        setCropPrevImg={setCropPrevImg}
        setCropImageFile={setCropImageFile}
      />
    </Box>
  );
});

export default Details;
