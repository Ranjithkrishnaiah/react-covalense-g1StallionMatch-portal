import { Avatar, Box, Button, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { v4 as uuid } from 'uuid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { Images } from 'src/assets/images';

//APIs
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { usePatchFarmDetailsMutation, usePostFarmProfileImageUploadMutation } from 'src/redux/splitEndpoints/PatchFarmDetailsByIdSplit';
import { useStatesQuery } from 'src/redux/splitEndpoints/statesSplit';
import CropImageDialog from 'src/components/CropImageDialog';
import Imgix from 'react-imgix';
import { toast } from 'react-toastify';
import { useFarmProfileImageUploadStatusMutation } from 'src/redux/splitEndpoints/farmMediaUploadStatus';
import { Spinner } from 'src/components/Spinner';
import { toPascalCase } from 'src/utils/customFunctions';

type DetailsProps = {
  dataProps: any;
  next: () => void;
}
const FarmDetails = forwardRef<HTMLButtonElement | null, DetailsProps>((detailsProps, submitRef) => {
  const { dataProps, next } = detailsProps;
  const { farmDetails } = dataProps;
  const [profileImageFile, setProfileImageFile] = useState<any>();
  const [presignedProfilePath, setPresignedProfilePath] = useState<any>();
  const [profileImagePreview, setProfileImagePreview] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();
  const [profileImage, response] = usePostFarmProfileImageUploadMutation();
  const [countryId, setCountryId] = useState<any>(farmDetails?.countryId);
  const [states, setStates] = useState<any>();
  const [profileUpdate, profileSubmitResponse] = usePatchFarmDetailsMutation();
  const inputFile = useRef<any>({});
  const [defaultIdState, setDefaultIdState] = useState<any>();
  const [openEditImageDialog, setOpenEditImageDialog] = useState<any>(false);
  const [imageFile, setImageFile] = useState<File>();
  const [cropImageFile, setCropImageFile] = useState<File>();
  const [cropPrevImg, setCropPrevImg] = useState<any>();
  const { data: statesListbyId, isSuccess: isStatesByIdSuccess } = useStatesQuery(countryId, {
    skip: !Boolean(countryId),
  });

  const { data: countriesList } = useCountriesQuery();
  const fileuuid: any = uuid();
  const [uploadInProgress, setUploadInProgress] = useState<any>(false);
  useEffect(() => {
    if (statesListbyId?.some((res: any) => res.countryId == countryId)) setStates(statesListbyId);
  }, [statesListbyId, countryId]);

  const [mediaUploadSuccess, mediaUploadSuccessResponse] = useFarmProfileImageUploadStatusMutation();

  const profileImageUpload = async () => {
    inputFile.current.click();
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        borderTop: 0,
        border: 'solid 1px #161716',
        borderRadius: '0 0 6px 6px',
        marginTop: '-2px',
        boxSizing: 'border-box',
        boxShadow: 'none',
      },
    },
  };
  const urlFormat = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
  const validationSchema = Yup.object().shape({
    farmName: Yup.string(),
    countryId: Yup.number().required('Country is required.'),
    stateId: Yup.number(),
    email: Yup.string().email('Please enter correct email address.').required('Email address is required.'),
    website: Yup.string()
      .matches(urlFormat, 'Please enter correct website address.')
      .required('Website address is required.'),
    profileImageuuid: Yup.string()
  });
  const methods = useForm<any>({
    resolver: yupResolver(validationSchema),
    mode: 'onTouched'
  });
  

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name != 'dynamic') dataProps.setSetChanges(true);
   });
    return () => subscription.unsubscribe();
  }, [watch]);
  const onChangeFile = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (file.size < 10000000) {
      validateResolution(file);
    } else {
      toast.error('File size exceeded. Maximum upload file size is 10MB');
    }

  }

  const callProfileAPI = (file: any) => {
    try {
      profileImage({
        fileName: file.name,
        fileuuid,
        fileSize: file.size,
        farmId: farmDetails?.farmId
      }).then(async (res: any) => {
        const details = { file, fileuuid }
        setProfileImageFile(details);
        setProfileImagePreview(URL.createObjectURL(file));
        setPresignedProfilePath(res.data.url);
      });
    } catch (error) {
      console.error(error);
    }
  }

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
        if (height > 126 && width > 189) {
          setImageFile(file);
          callProfileAPI(file);
        } else {
          toast.error(`The image dimensions must be at least 189px*126px.`)
        }
      };
    }
  }

  const SendFarmDetails: SubmitHandler<any> = async (
    data: any,
    event?: React.BaseSyntheticEvent
  ) => {
    const { farmId } = farmDetails;
    const newData = {
      ...data, farmId,
      ...(profileImageFile) && { profileImageuuid: profileImageFile.fileuuid }
    };
    setUploadInProgress(true);
    const res = await profileUpdate(newData);
    const response: any = res;
    if (response.error) {
      if (response.error.status == 422) {
        setSubmissionError(response.error);
      } else if (response.error.status > 499) {
        setSubmissionError(
          'Internal Server Error'
        );
      }
      setUploadInProgress(false);
    } else {
      if (profileImageFile) {
        const uploadOptions = { method: 'Put', body: cropImageFile }
        const result = await fetch(presignedProfilePath, uploadOptions);
          // Media Upload check until lamda success
          const mediaFileuuid = profileImageFile.fileuuid;
          let count = 1;
          const interval = setInterval(async () => {
            if (count >= 1) {
              let data: any = await mediaUploadSuccess([
                mediaFileuuid,
                //"d2d703e7-ebb5-4111-9995-feaabb91bf2e"
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
  };
  useEffect(() => {
    if (imageFile != undefined) {
      setOpenEditImageDialog(true)
    };
  }, [imageFile])

  return (
    <Box mt={4} className="edit-stallion-profile-modal edit-farm-profile-modal">
      <form onSubmit={handleSubmit(SendFarmDetails)} autoComplete="false">
        <Grid container sx={{ justifyContent: 'center' }} className='dialogPopup'>
          <Box className="edit-stallion-profile-form" mt={5}>
            <Grid container spacing={3} sx={{ display: 'flex-start' }}>
              <Grid item lg={6} sm={6} xs={12} order={{ lg: 1, sm: 1, xs: 2 }} className="edit-st-form-bx">
                <Box className='farmName-column'>
                  <InputLabel>Farm Name</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    autoComplete="new-password"
                    placeholder="Farm Name"
                    {...register('farmName', { required: true })}
                    defaultValue={toPascalCase(farmDetails.farmName)}
                  />
                  <p>{errors.farmName?.message}</p>
                </Box>
              </Grid>

              <Grid item lg={6} sm={6} xs={12} order={{ lg: 2, sm: 1, xs: 1 }} className="edit-st-form-bx">
                <Stack className="profile-picture">
                  <InputLabel>Farm Logo</InputLabel>
                  <Avatar
                    src={cropPrevImg ? cropPrevImg :farmDetails?.image ? `${farmDetails?.image}?w=189&h=126&fit=crop&ar=3:2` : profileImagePreview ? profileImagePreview: Images.farmplaceholder}
                    alt={farmDetails.farmName}
                  />
                 
                  <input
                    type='file'
                    id='file'
                    ref={inputFile}
                    style={{ display: 'none' }}
                    onChange={onChangeFile}
                    onClick={(event: any) => {
                      event.target.value = null;
                      dataProps.setSetChanges(true); 
                    }}
                  />
                 
                  <Box mt={1}>
                    <Button type="button" className="EditBtn" onClick={profileImageUpload}>
                      {farmDetails?.image || cropPrevImg  ? 'Edit' : 'Add'}
                    </Button>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} order={{ xs: 3 }} className="edit-st-form-bx">
                <Box>
                  <InputLabel>Country</InputLabel>
                  <Select
                    fullWidth
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{ height: '54px' }}
                    MenuProps={MenuProps}
                    {...register('countryId', { required: true })}
                    defaultValue={farmDetails.countryId}
                    onChange={(e: any) => { setStates([]); setCountryId(e.target.value); dataProps.setSetChanges(true); }}
                  >
                    {countriesList?.map((res: any) => (
                      <MenuItem className='selectDropDownList mobile-dropdown-list' value={res.id} key={res.id}>
                        <Box className='mobile-dropdown-title'>{res.countryName}</Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <p>{errors.countryId?.message}</p>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} order={{ xs: 4 }} className="edit-st-form-bx">
                {states?.length > 0 && (
                  <Box>
                    <InputLabel>State</InputLabel>
                    <Select
                      fullWidth
                      IconComponent={KeyboardArrowDownRoundedIcon}
                      sx={{ height: '54px' }}
                      MenuProps={MenuProps}
                      {...register('stateId', { required: true })}
                      defaultValue={defaultIdState || farmDetails?.stateId}
                      onChange={(e: any) => { setDefaultIdState(e.target.value); dataProps.setSetChanges(true);  }}
                    >
                      <MenuItem className='selectDropDownList' value="none" disabled><em>Select State</em></MenuItem>
                      {states?.map((res: any) => (
                        <MenuItem className='selectDropDownList' value={res.id} key={res.id}>
                          {res.stateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6} lg={6} order={{ xs: 5 }} className="edit-st-form-bx">
                <Box sx={{ marginTop: { lg: '0', sm: '0', xs: '10px' } }}>
                  <InputLabel>Email Address</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    autoComplete="new-password"
                    placeholder="Email Address"
                    {...register('email', { required: true })}
                    defaultValue={farmDetails.email}
                  />
                </Box>
                <p>{errors.email?.message}</p>
              </Grid>

              <Grid item xs={12} sm={6} lg={6} order={{ xs: 6 }} className="edit-st-form-bx">
                <Box>
                  <InputLabel>Website</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    autoComplete="new-password"
                    placeholder="website"
                    {...register('website', { required: true })}
                    defaultValue={farmDetails.website}
                  />
                </Box>
                <p>{errors.website?.message}</p>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} order={{ xs: 8 }} className="edit-st-form-bx"></Grid>
            </Grid>
          </Box>
        </Grid>
        <button type='submit' className='hide' ref={submitRef}></button>
      </form >
      {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
      <CropImageDialog
        open={openEditImageDialog && response.isSuccess}
        title={`${farmDetails?.image ? 'Edit' : 'Add'} Farm Logo`}
        onClose={() => setOpenEditImageDialog(false)}
        imgSrc={profileImagePreview ? profileImagePreview : ""}
        imgName={imageFile?.name || ""}
        imgFile={imageFile}
        awsUrl={presignedProfilePath}
        setCropPrevImg={setCropPrevImg}
        setCropImageFile={setCropImageFile}
        circularCrop={false}
      />
    </Box >
  )
})

export default FarmDetails