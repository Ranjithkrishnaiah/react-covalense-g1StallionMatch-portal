import React, { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { useFieldArray, useForm } from 'react-hook-form';
import { usePostFarmGalleryimageUploadMutation, usePostFarmMediaFilesUploadMutation, usePostFarmProfileImageUploadMutation } from 'src/redux/splitEndpoints/PatchFarmDetailsByIdSplit';
import { useStatesQuery } from 'src/redux/splitEndpoints/statesSplit';
import { v4 as uuid } from 'uuid';
import { useGetFarmGalleryimageQuery, useGetFarmMediasQuery } from 'src/redux/splitEndpoints/getFarmDetailsSplit';
import FarmDetails from './FarmDetails';
import FarmDescription from './FarmDescription';
import FarmGallery from './FarmGallery';
import FarmNews from './FarmNews';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import PageConfirmationForFarm from 'src/components/PageConfirmationForFarm';

const steps = ['Farm Details', 'Farm Gallery', 'Farm Description', 'Farm News'];

export default function FarmProfileUpdate(close: () => void, dataProps: any, 
Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => { if (dataProps.activeStep) { setActiveStep(0) } }, [dataProps.activeStep])
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isSaveAndClose, setIsSaveAndClose] = useState<boolean>(true);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({ accept: ['.jpeg', '.png'], maxFiles: 2 });
  const props = dataProps.farmDetails;
  const [isPageSkip, setPageSkip] = useState<boolean>(false);
  const [isPageBack, setPageBack] = useState<boolean>(false);
  const [ uploadInProgress,setUploadInProgress]=useState<boolean>(false);
  const [confirmSkip, setConfirmSkip] = React.useState<any>(
    {firstHeading: 'Exit Farm Edit without Saving', confirmHeading: 'exit without saving.'}
  );
  const closePopup = () => {
    dataProps.setPageClosed(false);
    setPageSkip(false);
    setConfirmSkip({
      ...confirmSkip,
      firstHeading: 'Exit Farm Edit without Saving',
      confirmHeading: 'exit without saving.',
    });
    if(activeStep == 0) {
      // dataProps?.setEditPopupClose(true);
      setActiveStep(0);
    }
  };
  const setConformPopup = () => {
    dataProps.setPageClosed(false);
    dataProps.setSetChanges(false);
    if(isPageSkip)  {
      setActiveStep((prevActiveStep: any) => prevActiveStep + 1)
      return false;
    }
    if(isPageBack)  {
      // setActiveStep((prevActiveStep: any) => prevActiveStep - 1)
      if (activeStep > 0) setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
      return false;
    }
    if(activeStep == 0) dataProps?.setEditPopupClose(true);
  };

  //Steps code start

  const isStepOptional = (step: number) => {
    return step != 3;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    dataProps.setSetChanges(false); 
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    
    setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setNumberOfTestimonials(stallionTetsimoials.length);
    if (activeStep === 3) { dataProps.setProfileUpdate(false); setActiveStep(0); }
  };

  const handleBack = () => {
    if(!dataProps?.isChanges) {
      dataProps.setPageClosed(false);
      if (activeStep > 0) setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    } else {
      dataProps.setPageClosed(true);
      setPageSkip(false);
      setPageBack(true);
    }
    activeStep === 0 && !dataProps?.isChanges ? dataProps.setEditPopupClose(true) : dataProps.setEditPopupClose(false);
    setNumberOfTestimonials(stallionTetsimoials.length);
  };

  const handleSkip = () => {
     if (!isStepOptional(activeStep)) {
       // You probably want to guard against something like this,
       // it should never occur unless someone's actively trying to break something.
       throw new Error("You can't skip a step that isn't optional.");
     }
     if(dataProps?.isChanges) {
       dataProps.setPageClosed(true);
       setPageSkip(true);
       setConfirmSkip({
        ...confirmSkip,
        firstHeading: 'Skip this step without Saving',
        confirmHeading: 'skip this step without saving.',
      });
     } else {
       setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
       setSkipped((prevSkipped) => {
       const newSkipped = new Set(prevSkipped.values());
       newSkipped.add(activeStep);
       setPageSkip(false);
       return newSkipped;
     });
     dataProps.setConfirm(false)
     }
     
     
   };

  //Steps code End 

  const validationSchema = Yup.object().shape({
    farmName: Yup.string(),
    farmCountryId: Yup.number().required('Country is required'),
    email: Yup.string().required('Email is required'),
    website: Yup.string().required('Website is required'),
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
    formState: { errors, isDirty },
  } = methods;

  if(Reset){
    setActiveStep(0);
    setReset(false);
  }
  if((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)){
    reset()
    setReset(false);
   };
  const [submissionError, setSubmissionError] = useState<any>();
  const { fields, append, remove } = useFieldArray({ name: 'dynamic', control });
  const [numberOfTestimonials, setNumberOfTestimonials] = useState<any>();

  // API Calls 
  const { data: stallionGalleryImages, isSuccess: isStallionGalleryImagestSuccess } = useGetFarmGalleryimageQuery(props?.farmId);
  const { data: stallionTetsimoials, isSuccess: isStallionTetsimoialsSuccess } = useGetFarmMediasQuery(props?.farmId);
  const [profileImage, response] = usePostFarmProfileImageUploadMutation();
  const [setHeroImages] = usePostFarmGalleryimageUploadMutation();
  const [setTestimonialsImages] = usePostFarmMediaFilesUploadMutation();

  const [states, setStates] = useState<any>();
  const [farmCountryId, setFarmCountryId] = useState<any>();
  const [defaultIdState, setDefaultIdState] = useState<any>();
  const { data: statesListbyId, isSuccess: isStatesByIdSuccess } = useStatesQuery(farmCountryId, {
    skip: !Boolean(farmCountryId),
  });
  const [fileUpload, setFileUpload] = useState<any>();
  const [profileImageFile, setProfileImageFile] = useState<any>();
  const [presignedProfilePath, setPresignedProfilePath] = useState<any>();
  let [galleryImages, setGalleryImages] = useState<any>([]);
  let [farmMediaFileImages, setFarmMediaFileImages] = useState<any>([]);
  const [heroImagesDeletedId, setHeroImagesDeletedId] = useState<any>([]);
  const [deletedTestimonialsImages, seDeletedTestimonialsImages] = useState<any>([]);

  stallionGalleryImages?.map((res: any) => {
    if (!galleryImages.find((o: any) => o.mediauuid == res.mediauuid)) galleryImages.push(res);
  })

  stallionTetsimoials?.map((res: any) => {
    if (!farmMediaFileImages.find((o: any) => o?.mediauuid == res.mediaInfoFiles[0]?.mediauuid)) {
      farmMediaFileImages = [...farmMediaFileImages, res.mediaInfoFiles[0]];
    }
    
  })

  

  const fileuuid: any = uuid();
  useEffect(() => {
    if (props?.countryId) {
      setFarmCountryId(props?.countryId);
      setDefaultIdState(props?.stateId);
    }
  }, [props?.countryId]);
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

  const DetailsRef = useRef<HTMLButtonElement>(null);
  const GallaryRef = useRef<HTMLButtonElement>(null);
  const DescriptionRef = useRef<HTMLButtonElement>(null);
  const TestimonialsRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const newVal = parseInt(stallionTetsimoials?.length ? stallionTetsimoials?.length : 1);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ mediaInfoId: 0, title: '', company: '', description: '' });
      }
      setNumberOfTestimonials(newVal);
    } else {
      // remove tickets from field array
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [stallionTetsimoials]);
  useEffect(() => {
    setStates(statesListbyId);
  }, [statesListbyId, isStatesByIdSuccess]);

  const watchFarmCountry = watch('farmCountryId');

  useEffect(() => {
    if (watchFarmCountry !== undefined) {
      if (!isNaN(watchFarmCountry)) {
        setFarmCountryId(watchFarmCountry);
      }
    }
  }, [watchFarmCountry]);
  const SubmitEditedFarmDetails = async (
    data: any,
    event?: React.BaseSyntheticEvent
  ) => {
    data = {
      ...data,
      farmId: props.farmId,
      farmName: data.farmName,
      countryId: data.farmCountryId,
      stateId: data.stateId,
      email: data.email,
      website: data.website,
      url: data.url,
    };
    if (dataProps?.isChanges || [0, 1, 2, 3].includes(activeStep)) {
      try {
        switch (activeStep) {
          case 0:
            DetailsRef?.current?.click();
            break;
          case 1:
            GallaryRef?.current?.click();
            break;
          case 2:
            DescriptionRef?.current?.click();
            break;
          case 3:
            TestimonialsRef?.current?.click();
            break;
        }
      } catch (error) {
        setSubmissionError(error);
      }
    } else {
      handleNext();
    }
  };

  useEffect(() => {
    if (fileUpload && !fileUpload.isDeleted) {
      try {
        if (activeStep == 1) {
          setHeroImages({
            fileName: fileUpload.path,
            fileuuid: fileuuid,
            farmId: props?.farmId,
            fileSize: fileUpload.size
          }).then(async (res: any) => {
            setGalleryImages([...galleryImages, {
              file: fileUpload,
              "mediauuid": fileuuid,
              "url": res.data.url,
              isNew: true
            }]);
          });
        }
        

      } catch (error) {
        console.error(error);
      }
    }
    if (fileUpload && 'isDeleted' in fileUpload) {
      if (activeStep == 1) {
        let imagesDeletedId = [...heroImagesDeletedId, fileUpload.isDeleted];
        setHeroImagesDeletedId(imagesDeletedId);
        const removeSpecificFile = galleryImages.map((res: any) => {
          return {
            ...res,
            isDeleted: imagesDeletedId.includes(res.mediauuid) ? true : false
          }
        });
        setGalleryImages([...removeSpecificFile]);
      }
      if (activeStep == 3) {
      }
    }
  }, [fileUpload])

  const [count, setCount] = React.useState(0);
  const inputFile = useRef<any>({})
  const profileImageUpload = async () => {
    inputFile.current.click();
  }
  const onChangeFile = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    try {
      profileImage({
        fileName: file.name,
        fileuuid,
        fileSize: file.size,
        farmId: props?.farmId
      }).then(async (res: any) => {
        const details = { file, fileuuid }
        setProfileImageFile(details);
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
        borderRadius: '0 0 6px 6px',
        marginTop: '-4px',
        boxSizing: 'border-box',
      },
    },
  };

  return (
    <Box mt={4} className="edit-stallion-profile-modal">
        <Box>
          <Box className='stallion-profile-stepper'>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption"></Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
          <React.Fragment>
            <Box className='stallion-profile-container'>
              <Typography>
                  {(activeStep == 0) ? (<FarmDetails
                    dataProps={ dataProps }
                    next = { handleNext }
                    ref = { DetailsRef }
                  />):""}
                {(activeStep == 1) ? (
                  <FarmGallery
                  prevProps={ dataProps }
                  next = { handleNext }
                  galleryImages = { galleryImages }
                  setGalleryImages = { setGalleryImages }
                  setSubmissionError = { setSubmissionError }
                  farmId = { props?.farmId }
                  ref = { GallaryRef }
                  fileuuid = { fileuuid }
                  heroImagesDeletedId = { heroImagesDeletedId }
                  setHeroImagesDeletedId = { setHeroImagesDeletedId}
                  setUploadProgress={setUploadInProgress}
                  />):""}
                {(activeStep == 2) ? (
                    <FarmDescription
                        prevData = { dataProps }
                        next = { handleNext }
                        setSubmissionError = { setSubmissionError}
                        submissionError={submissionError}
                        ref = { DescriptionRef }
                    />
                ) : ("")}
                {(activeStep == 3) ? (
                  <FarmNews
                    prevProps={ dataProps }
                    next = { handleNext }
                    setSubmissionError = { setSubmissionError }
                    fileUpload = { fileUpload }
                    fileuuid = { fileuuid }
                    farmId = { props?.farmId }
                    setFileUpload = { setFileUpload }
                    setFarmMediaFileImages = { setFarmMediaFileImages }
                    farmMediaFileImages = { farmMediaFileImages}
                    galleryImages = { galleryImages }
                    ref = { TestimonialsRef }   
                    isSaveAndClose={isSaveAndClose}
                    setIsSaveAndClose={setIsSaveAndClose}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                  />
                ) : ("")}
              </Typography>
            </Box>
            <Box className='stallion-profile-footer'>
            <Grid container spacing={2}>
                <Grid item lg={6} sm={6} xs={6}>
              <CustomButton
                color="inherit"
                onClick={handleBack}
                className="back-btn"
                sx={ { mr: 1 } }
                disabled={uploadInProgress}
              >
                 {activeStep === 0 ? 'Cancel' : 'Back'}
              </CustomButton>
              </Grid>
              <Grid item lg={3} sm={3} xs={6}>
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} disabled={uploadInProgress} className="save-btn">
                  Skip
                </Button>
              )}
              </Grid>
              <Grid item lg={3} sm={3} xs={12}>
              <CustomButton onClick = {SubmitEditedFarmDetails} disabled={activeStep !== 3 ? !dataProps.isChanges : !isSaveAndClose} className="save-btn">
                {activeStep === steps.length - 1 ? 'Save & Close' : 'Save & Next'}
              </CustomButton>
              </Grid>
              </Grid>
            </Box>
          </React.Fragment>
        </Box>
      {/* </form> */}
      <WrapperDialog
        dialogClassName='dialogPopup title-capitalize'
        open={dataProps?.isPageClosed}
        title="Are you sure?"
        setConfirm={setConformPopup}
        onClose={closePopup}
        body={PageConfirmationForFarm}
        pageTitle={confirmSkip}
      />
    </Box>
  );
}
