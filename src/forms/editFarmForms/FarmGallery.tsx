import { Box, Grid, InputLabel } from '@mui/material';
import React, { useState, forwardRef, useEffect } from 'react'
import CustomDropzone from 'src/components/CustomDropzone';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import { Spinner } from 'src/components/Spinner';
import { useFarmGalleryImagesUploadStatusMutation } from 'src/redux/splitEndpoints/farmMediaUploadStatus';
import { useGetFarmGalleryimageQuery } from 'src/redux/splitEndpoints/getFarmDetailsSplit';
import { usePatchFarmProfileGalleryimageMutation, usePostFarmGalleryimageUploadMutation } from 'src/redux/splitEndpoints/PatchFarmDetailsByIdSplit';

type GallaryProps = {
  prevProps : any;
  farmId: string;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  next: () => void;
  galleryImages: any[];
  setGalleryImages: React.Dispatch<React.SetStateAction<any[]>>;
  fileuuid: string;
  heroImagesDeletedId: any;
  setHeroImagesDeletedId: React.Dispatch<React.SetStateAction<any>>;
  setUploadProgress:React.Dispatch<React.SetStateAction<any>>;
}

const FarmGallery = forwardRef<HTMLButtonElement, GallaryProps>((props, submitRef) => {
  const { next, setSubmissionError, farmId,  setGalleryImages,
    fileuuid, heroImagesDeletedId, setHeroImagesDeletedId } = props;
  let { galleryImages } = props;
  const [fileUpload, setFileUpload] = useState<any>();
  const [setHeroImages] = usePostFarmGalleryimageUploadMutation();
  const [heroImagesUpdate] = usePatchFarmProfileGalleryimageMutation();
  const { data: stallionGalleryImages, isSuccess: isStallionGalleryImagesSuccess } = useGetFarmGalleryimageQuery(farmId);
  const galleryResolution = { height: 946, width: 1920 }
  const [uploadInProgress, setUploadInProgress] = useState<any>(false);
  // Media Upload check until lamda success
  const [mediaUploadSuccess, mediaUploadSuccessResponse] = useFarmGalleryImagesUploadStatusMutation();
  
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
              farmId: props.farmId,
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
      farmId: props.farmId,
      galleryImages: updatedFields,
    });
    if (imageResult.error) {
      setUploadInProgress(false);
      setSubmissionError(
        'Internal Server Error'
      );
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
  props.setUploadProgress(uploadInProgress);
  
  return (
    <Grid container spacing={3} mt={1} className="hero-image-box-wrapper">
      <Grid item xs={12}>
        <Box className="here-image-gallery-box">
          <InputLabel className="hero-img-gallery-text">
            Farm Image Gallery
            <HtmlTooltip
              enterTouchDelay={0}
              leaveTouchDelay={6000}
              className="CommonTooltip studfee-tooltip edit-tooltip" 
              placement='bottom-start'
              title={
                <React.Fragment>
                  {'Stallion Images can be updated as'}{' '}
                  {' required and should be either in '}{' '}
                  {'JPEG or PNG format not exceeding '}{' '}
                  {'10MB in size'}.{' '}
                  {'Also, the image dimensions must be at least 1920 x 946 ( 72dpi)'}.{' '}
                </React.Fragment>
              }
            >
              <i className="icon-Info-circle"></i>
            </HtmlTooltip>
          </InputLabel>
          <Grid container spacing={3} mt={3} className="hero-image-box-wrapper">
            {new Array(8).fill(0).map((item: any, index: any) => {
              const fileDetails = stallionGalleryImages ? stallionGalleryImages[index] : null;
              const heroImages = {
                setFileUpload,
                fileDetails,
                position: index
              };
              return (<Grid item lg={3} sm={3} xs={6} mt={3} key={index} className="hero-image-box">
                <CustomDropzone data={heroImages} galleryResolution={galleryResolution} size={{h:250,w:250}}/>
              </Grid>)
            }
            )}
          </Grid>
          <button className='hide' onClick={sendGallary} ref={submitRef}></button>
        </Box>
      </Grid>
      {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
    </Grid>
  )
})

export default FarmGallery