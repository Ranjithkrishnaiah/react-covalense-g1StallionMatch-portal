import React, { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Grid,
  Typography,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import * as _ from 'lodash';
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  usePostStallionProfileGalleryimageUploadMutation,
  usePatchStallionProfileTestimonialsMutation,
} from 'src/redux/splitEndpoints/PatchStallionDetailsByIdSplit';

import { useGetServiceFeeByYearQuery } from 'src/redux/splitEndpoints/GetServiceFeeByYearSplit';
import { v4 as uuid } from 'uuid';
import Details from './Details';
import Gallary from './Gallary';
import Description from './Description';
import Testimonials from 'src/forms/editStallionForms/Testimonials';
import { useGetStallionGalleryimageQuery, useGetStallionTestimonialsQuery } from 'src/redux/splitEndpoints/getStallionDetailsSplit';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import PageConfirmationForStallion from 'src/components/PageConfirmationForStallion';
const steps = ['Details', 'Gallery', 'Description', 'Testimonials'];

function StallionProfileUpdatePage(close: () => void, dataProps: any,
  Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  // Layout Settings code 
  const [activeStep, setActiveStep] = useState<number>(dataProps?.activeStep);

  useEffect(() => { setActiveStep(0) }, []);

  useEffect(() => { if (!dataProps.activeStep) { setActiveStep(0) } }, [dataProps.activeStep])

  const [skipped, setSkipped] = useState(new Set<number>());
  const [isSaveAndClose, setIsSaveAndClose] = useState<boolean>(true);
  const [fileUpload, setFileUpload] = useState<any>();
  let [galleryImages, setGalleryImages] = useState<any>([]);
  let [testimonialsGalleryImages, setTestimonialsGalleryImages] = useState<any>([]);
  const props = dataProps.stallionDetails;
  const fileuuid: any = uuid();
  const [testimonials] = usePatchStallionProfileTestimonialsMutation();
  const { data: stallionGalleryImages, isSuccess: isstallionGalleryImagestSuccess } = useGetStallionGalleryimageQuery(props?.stallionId);
  const { data: stallionTestimonials, isSuccess: isStallionTetsimoialsSuccess } = useGetStallionTestimonialsQuery(props?.stallionId);
  const [setHeroImages] = usePostStallionProfileGalleryimageUploadMutation();
  const [submissionError, setSubmissionError] = useState<any>();
  const [heroImagesDeletedId, setHeroImagesDeletedId] = useState<any>([]);
  const [deletedTestimonialsImages, setDeletedTestimonialsImages] = useState<any>([]);
  const [currencyId, setCurrencyId] = useState(props?.currencyId);
  const [feeValue, setFeeValue] = useState<number | string>("");
  const [isChecked, setIsChecked] = useState<boolean>(props?.isPrivateFee);
  const [radioSelectedValue, setRadioSelectedValue] = useState<any>('false');
  const [yearSelected, setYearSelected] = useState<any>(new Date().getFullYear());
  const [isPageSkip, setPageSkip] = useState<boolean>(false);
  const [isPageBack, setPageBack] = useState<boolean>(false);
  const [confirmSkip, setConfirmSkip] = React.useState<any>(
    { firstHeading: 'Exit Stallion Edit without Saving', confirmHeading: 'exit without saving.' }
  );

  const { data: updateServiceFeeData, isSuccess: yearSuccess, status: updateServiceFeeStatus, isError } = useGetServiceFeeByYearQuery({ stallionId: props?.stallionId, feeYear: yearSelected });
  const closePopup = () => {
    dataProps.setPageClosed(false);
    setPageSkip(false);
    setConfirmSkip({
      ...confirmSkip,
      firstHeading: 'Exit Stallion Edit without Saving',
      confirmHeading: 'exit without saving.',
    });
    if(activeStep == 0) {
      // dataProps?.setEditPopupClose(true);
      setActiveStep(0);
    }
  };
  const setConformPopup = (val: any) => {
    dataProps.setPageClosed(false);
    dataProps.setSetChanges(false);
    
    if (isPageSkip) {
      setActiveStep((prevActiveStep: any) => prevActiveStep + 1)
      return false;
    }
    if (isPageBack) {
      if (activeStep > 0) setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
      return false;
    }
    if (val) {
      dataProps.setProfileUpdate(false);
      setActiveStep(0);
    }
    if (activeStep == 0) dataProps?.setEditPopupClose(true);
  };


  useEffect(() => {
    if (!!props && 'isPrivateFee' in props) {
      setIsChecked(props?.isPrivateFee);
      setRadioSelectedValue(String(props?.isPrivateFee));
    }
  }, [props?.isPrivateFee])

  useEffect(() => {
    if (!!updateServiceFeeData && yearSuccess && !isError && updateServiceFeeStatus === 'fulfilled') {
      setIsChecked(updateServiceFeeData?.isPrivateFee);
      setRadioSelectedValue(String(updateServiceFeeData?.isPrivateFee));
      setFeeValue(updateServiceFeeData?.fee);
      setCurrencyId(updateServiceFeeData?.currencyId);
    }

  }, [yearSuccess, updateServiceFeeStatus])

  useEffect(() => {
    if (isError) {
      setCurrencyId('none');
      setFeeValue("")
    }
  }, [isError])


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
    setNumberOfTestimonials(stallionTestimonials.length);
    if (activeStep === 3) { dataProps.setProfileUpdate(false); setActiveStep(0); }
  };

  const handleBack = () => {
    if (!dataProps?.isChanges) {
      dataProps.setPageClosed(false);
      if (activeStep > 0) setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    } else {
      dataProps.setPageClosed(true);
      setPageSkip(false);
      setPageBack(true);
    }
    // console.log('activeStep>>>', activeStep, 'dataProps>>>', dataProps);
    // activeStep === 0 ? dataProps.setEditPopupClose(true) : dataProps.setEditPopupClose(false);
    activeStep === 0 && !dataProps?.isChanges ? dataProps.setEditPopupClose(true) : dataProps.setEditPopupClose(false);
    setNumberOfTestimonials(stallionTestimonials.length);
  };

  stallionGalleryImages?.map((res: any) => {
    if (!galleryImages.find((o: any) => o.mediauuid == res.mediauuid)) galleryImages.push(res);
  })

  stallionTestimonials?.map((res: any) => {
    if (!testimonialsGalleryImages.find((o: any) => o?.mediauuid == res.media[0]?.mediauuid)) {
      testimonialsGalleryImages = [...testimonialsGalleryImages, res.media[0]];
    }
  })

  useEffect(() => {
    if (fileUpload && !fileUpload.isDeleted) {
      try {
        if (activeStep == 1) {
          setHeroImages({
            fileName: fileUpload.path,
            fileuuid: fileuuid,
            stallionId: props.stallionId,
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
        if (activeStep == 3) { }

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
      if (activeStep == 3) { }
    }
  }, [fileUpload])

  const validationSchema = Yup.object().shape({
    yearToStud: Yup.string().required('Year to stud is required'),
    colourId: Yup.number().required('Colour is required'),
    farmId: Yup.string().required('farmId is required'),
    height: Yup.string().required('Height is required'),
    testimonials: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .required('Title is required'),
        company: Yup.string()
          .required('Company is required'),
        description: Yup.string()
          .required('Description is required')
      })
    )
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
    setValue,
    formState: { errors, isDirty },
  } = methods;

  if (Reset) {
    // console.log('called reset')
    if(!dataProps?.isPageClosed) {
      setActiveStep(0);
    }
    setReset(false);
  }
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset()
    setReset(false);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    if (dataProps?.isChanges) {
      dataProps?.setPageClosed(true);
      setPageSkip(true);
      setConfirmSkip({
        ...confirmSkip,
        firstHeading: 'Skip this step without saving',
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
      if (dataProps?.setConfirm) dataProps?.setConfirm(false)
    }
  };


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
    const subscription = watch((value, { name, type }) => { if (name != "dynamic") dataProps.setSetChanges(true) });
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

  useEffect(() => {
    const newVal = parseInt(stallionTestimonials?.length ? stallionTestimonials?.length : 1);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ testimonialId: 0, title: '', company: '', description: '' });
      }
      setNumberOfTestimonials(newVal);
    } else {
      // remove tickets from field array
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [stallionTestimonials]);

  const sendDetailsRef = useRef<HTMLButtonElement>(null);
  const sendGallaryRef = useRef<HTMLButtonElement>(null);
  const sendDescriptionRef = useRef<HTMLButtonElement>(null);
  const sendTestimonialsRef = useRef<HTMLButtonElement>(null);


  const submitStallionEditForm: SubmitHandler<any> = async (
    data: any,
    event?: React.BaseSyntheticEvent
  ) => {
    if ([0, 1, 2, 3].includes(activeStep)) {
      try {
        switch (activeStep) {
          case 0:
            sendDetailsRef?.current?.click();
            break;
          case 1:
            sendGallaryRef?.current?.click();
            break;
          case 2:
            sendDescriptionRef?.current?.click();

            break;
          case 3:
            sendTestimonialsRef?.current?.click();
            break;
        }
      } catch (error) {
        setSubmissionError(error);
      }
    } else {
      handleNext();
    }
  };
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
              {(activeStep == 0) ? (
                <Details
                  prevProps={dataProps}
                  next={handleNext}
                  ref={sendDetailsRef}
                  Reset={Reset}
                  setReset={setReset}
                />
              ) : ("")}
              {(activeStep == 1) ? (
                <Gallary stallionId={props?.stallionId}
                  next={handleNext}
                  prevProps={dataProps}
                  setSubmissionError={setSubmissionError}
                  ref={sendGallaryRef}
                />
              ) : ("")}
              {(activeStep == 2) ? (
                <Description
                  prevData={dataProps}
                  next={handleNext}
                  setSubmissionError={setSubmissionError}
                  submissionError={submissionError}
                  ref={sendDescriptionRef}
                />
              ) : ("")}
              {(activeStep == 3) ? (
                <Testimonials
                  prevProps={dataProps}
                  fileuuid={fileuuid}
                  fileUpload={fileUpload}
                  setFileUpload={setFileUpload}
                  galleryImages={galleryImages}
                  next={handleNext}
                  setSubmissionError={setSubmissionError}
                  setTestimonialsGalleryImages={setTestimonialsGalleryImages}
                  testimonialsGalleryImages={testimonialsGalleryImages}
                  ref={sendTestimonialsRef}
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
                  sx={{ mr: 1 }}
                >
                  {activeStep === 0 ? 'Cancel' : 'Back'}
                </CustomButton>
              </Grid>
              <Grid item lg={3} sm={3} xs={6}>

                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} className="save-btn">
                    Skip
                  </Button>
                )}
              </Grid>
              <Grid item lg={3} sm={3} xs={12}>
                <CustomButton className="save-btn" disabled={activeStep !== 3 ? !dataProps.isChanges : !isSaveAndClose} onClick={submitStallionEditForm}>
                  {activeStep === steps.length - 1 ? 'Save & Close' : 'Save & Next'}
                </CustomButton>
              </Grid>
            </Grid>
          </Box>
        </React.Fragment>


      </Box>
      {/* </form > */}
      <WrapperDialog
        dialogClassName={'dialogPopup title-capitalize'}
        open={dataProps?.isPageClosed}
        title="Are you sure?"
        setConfirm={setConformPopup}
        onClose={closePopup}
        body={PageConfirmationForStallion}
        pageTitle={confirmSkip}
      />
    </Box >
  );
}

export default StallionProfileUpdatePage;
