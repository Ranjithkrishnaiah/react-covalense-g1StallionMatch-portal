import React, { useState, forwardRef, useEffect } from 'react';
import { Box, Grid, InputLabel } from '@mui/material';
import { useGetStallionGalleryimageQuery } from 'src/redux/splitEndpoints/getStallionDetailsSplit';
import {
  usePatchStallionHeroGalleryImageMutation,
  usePostStallionProfileGalleryimageUploadMutation,
} from 'src/redux/splitEndpoints/PatchStallionDetailsByIdSplit';
import CustomDropzone from 'src/components/CustomDropzone';
import { v4 as uuid } from 'uuid';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import { Spinner } from 'src/components/Spinner';
import { useStallionHeroImagesUploadStatusMutation } from 'src/redux/splitEndpoints/mediaUploadStatus';
type GallaryProps = {
  prevProps: any;
  stallionId: string;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  next: () => void;
};
const Gallary = forwardRef<HTMLButtonElement, GallaryProps>((props, submitRef) => {
  const { stallionId, setSubmissionError, next } = props;
  let [galleryImages, setGalleryImages] = useState<any>([]);
  const [fileUpload, setFileUpload] = useState<any>();
  const [heroImagesUpdate] = usePatchStallionHeroGalleryImageMutation();
  const { data: stallionGalleryImages, isSuccess: isStallionGalleryImagesSuccess } =
    useGetStallionGalleryimageQuery(stallionId);
  const [setHeroImages] = usePostStallionProfileGalleryimageUploadMutation();
  const [heroImagesDeletedId, setHeroImagesDeletedId] = useState<any>([]);
  const fileuuid: any = uuid();
  const galleryResolution = { height: 1280, width: 1920 };
  // Media Upload check until lamda success
  const [mediaUploadSuccess, mediaUploadSuccessResponse] =
    useStallionHeroImagesUploadStatusMutation();
  const [uploadInProgress, setUploadInProgress] = useState<any>(false);

  useEffect(() => {
    if (isStallionGalleryImagesSuccess) {
      setGalleryImages(stallionGalleryImages);
    }
  }, [isStallionGalleryImagesSuccess]);
  useEffect(() => {
    if (fileUpload && !fileUpload.isDeleted) {
      props.prevProps.setSetChanges(true);
      const fileAsDataURL = window.URL.createObjectURL(fileUpload)
      const img = new Image();
      img.src = fileAsDataURL;
      img.onload = function(this: any) {
        var height = this.height;
        var width = this.width;
        if (
          height >= galleryResolution.height &&
          width >= galleryResolution.width
        ) {
          try {
            setHeroImages({
              fileName: fileUpload.path,
              fileuuid: fileuuid,
              stallionId: props.stallionId,
              fileSize: fileUpload.size,
            }).then(async (res: any) => {
              galleryImages = galleryImages.filter((res: any) => res.position != fileUpload.position)
              setGalleryImages([
                ...galleryImages,
                {
                  file: fileUpload,
                  mediauuid: fileuuid,
                  url: res.data.url,
                  isNew: true,
                  position: fileUpload.position
    
                },
              ]);
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
    if (fileUpload && 'isDeleted' in fileUpload) {
      props.prevProps.setSetChanges(true);
      let imagesDeletedId = [...heroImagesDeletedId, fileUpload.isDeleted];
      setHeroImagesDeletedId(imagesDeletedId);
      const removeSpecificFile = galleryImages.map((image: any) => {
        return {
          ...image,
          isDeleted: imagesDeletedId.includes(image.mediauuid) ? true : false,
        };
      });
      setGalleryImages([...removeSpecificFile]);
    }
  }, [fileUpload]);
  const sendGallary = async () => {
    setUploadInProgress(true);
    const updatedFields = galleryImages.filter((image: any) => {
      if (image.isDeleted || image.isNew) {
        return {
          isDeleted: image.isDeleted ? image.isDeleted : false,
          mediauuid: image.mediauuid,
        };
      }
    });
    const mediaFileuuid: any = updatedFields
      ?.filter((res: any) => res.isNew)
      .map((res: any) => res.mediauuid); 
    const imageResult: any = await heroImagesUpdate({
      stallionId: props.stallionId,
      galleryImages: updatedFields,
    });
    if (imageResult.error) {
      setSubmissionError(
        'Internal Server Error'
      );
      setUploadInProgress(false);
    } else {
      galleryImages.map(async (image: any) => {
        if (image.url) {
          const uploadOptions = { method: 'Put', body: image.file };
          const result = await fetch(image.url, uploadOptions);
        }
      })
      let count = 1;
      const interval = setInterval(async () => {
        if (count >= 1) {
          let data: any = await mediaUploadSuccess(
            mediaFileuuid
          );
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
    }
  }

  return (
    <Box>
      <Grid container sx={{ justifyContent: 'center' }} className="dialogPopup">
        <Box className="here-image-gallery-box">
          <InputLabel className="hero-img-gallery-text">
            Stallion Image Gallery
            <HtmlTooltip
              enterTouchDelay={0}
              leaveTouchDelay={6000}
             className="CommonTooltip studfee-tooltip edit-tooltip" 
              placement="bottom"
              title={
                <React.Fragment>
                  {'Stallion Images can be updated as'} {' required and should be either in '}{' '}
                  {'JPEG or PNG format not exceeding '} {'10MB in size'}.{' '}
                  {'Also, the image dimensions must be at least 1920 x 1280 ( 72dpi)'}.{' '}
                  {'First image should be a confirmation image'}.{' '}
                  
                </React.Fragment>
              }
            >
              <i className="icon-Info-circle" />
            </HtmlTooltip>
          </InputLabel>
          <Grid container spacing={3} mt={4} className="hero-image-box-wrapper">
            {new Array(8).fill(0).map((item: any, index: any) => {
              const fileDetails = stallionGalleryImages.find((res: any) => res.position == index);
              const heroImages = {
                setFileUpload,
                fileDetails: fileDetails ? fileDetails : null,
                position: index
              };
              return (
                <Grid item lg={3} sm={3} xs={6} mt={3} key={index} className="hero-image-box">
                  <CustomDropzone data={heroImages} galleryResolution={galleryResolution} size={{h:250,w:250}}/>
                </Grid>
              );
            })}
            <button className="hide" onClick={sendGallary} ref={submitRef}></button>
          </Grid>
        </Box>
      </Grid>
      {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
    </Box>
  );
});

export default Gallary;
