import { Box, Button, Grid, InputLabel, TextareaAutosize, TextField, Typography } from '@mui/material';
import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { CustomButton } from 'src/components/CustomButton';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import {
  usePatchFarmMediaFilesMutation,
  usePostFarmMediaFilesUploadMutation,
} from 'src/redux/splitEndpoints/PatchFarmDetailsByIdSplit';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { useGetFarmMediasQuery } from 'src/redux/splitEndpoints/getFarmDetailsSplit';
import CustomDropzoneMedia from 'src/components/CustomDropzoneMedia';
import { useFarmMediaUploadStatusMutation } from 'src/redux/splitEndpoints/farmMediaUploadStatus';
import { Spinner } from 'src/components/Spinner';
import { toast } from 'react-toastify';
import CropMediaImageDialog from 'src/components/CropMediaImageDialog';

type TestimonialProps = {
  prevProps: any;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  setFarmMediaFileImages: React.Dispatch<React.SetStateAction<any>>;
  fileuuid: any;
  fileUpload: any;
  setFileUpload: any;
  farmMediaFileImages: any[];
  next: () => void;
  galleryImages: any[];
  farmId: string;
  isSaveAndClose: boolean;
  setIsSaveAndClose: React.Dispatch<React.SetStateAction<boolean>>;
};
type TestimonialType = {
  mediaInfoId: number;
  title: string;
  description: string;
};

const FarmNews = forwardRef<HTMLButtonElement, TestimonialProps>(
  (
    {
      fileUpload,
      fileuuid,
      setFileUpload,
      setSubmissionError,
      prevProps,
      setFarmMediaFileImages,
      farmMediaFileImages,
      next,
      galleryImages,
      isSaveAndClose,
      setIsSaveAndClose
    },
    submitRef
  ) => {
    const { farmDetails } = prevProps;
    const { farmId } = farmDetails;
    const [testimonialsArr, setTestimonialsArr] = useState<TestimonialType[]>([]);
    const [deletedTestimonialsImages, setDeletedTestimonialsImages] = React.useState<any>([]);
    const [deletedTestimonials, setDeletedTestimonials] = React.useState<any[]>([]);
    const [isTitleError, setIsTitleError] = React.useState(true);
    const [isDescError, setIsDescError] = React.useState(true);
    const [setTestimonialsImages, response] = usePostFarmMediaFilesUploadMutation();
    const { data: farmMediaNews, isSuccess: isFarmMediaNewsSuccess, isFetching } =
      useGetFarmMediasQuery(farmId);

    const [noPreview, setNoPreview] = React.useState<any>(false);

    const [imageFile, setImageFile] = useState<File>();
    const [cropImageFile, setCropImageFile] = useState<File>();
    const [cropPrevImg, setCropPrevImg] = useState<any>();
    const [openEditImageDialog, setOpenEditImageDialog] = useState<any>(false);
    const inputFile = useRef<any>({});
    const [mediaFile, setMediaFile] = useState<File>();
    const [mediaImageFile, setMediaImageFile] = useState<any>();
    const [presignedMediaPath, setPresignedMediaPath] = useState<any>();
    const [mediaImagePreview, setMediaImagePreview] = useState<any>();
    const [mediaImagePreviewIndex, setMediaImagePreviewIndex] = useState<any>();
    const [mediaImagePreviewUuid, setMediaImagePreviewUuid] = useState<any>("");
    const [isVideo, setIsVideo] = useState<any>(false);
    const [isMediaUploaded, setIsMediaUploaded] = useState(false);
    useEffect(() => {
      if (mediaFile != undefined) {
        setOpenEditImageDialog(true)
      };
    }, [mediaFile])


    const profileMediaUpload = async () => {
      if (inputFile) {
        inputFile?.current?.click();
      }
    }

    const onChangeFile = async (event: any, i: number, mediaInfoId: number) => {
      event.stopPropagation();
      event.preventDefault();
      const videoFormats = ['mp4'];
      const imageFormats = ['jpg', 'jpeg', 'png'];
      var file = event.target.files[0];
      setMediaImagePreviewIndex(i);
      const type = file.type.split('/')[1];

      const videoFileSize = 50000000; // 10MB change to 50MB 

      if (type === 'mp4') {
        if (file.size < 50000000) {
          const videoPreview: any = URL.createObjectURL(file);
          setIsVideo(true);
          callProfileAPI(file, mediaInfoId);
          setCropPrevImg(videoPreview);
          setOpenEditImageDialog(false);
        } else {
          toast.error('Video size exceeded. Maximum upload file size is 50MB');
        }
      } else {
        if (file.size < 10000000) {
          setIsVideo(false);
          validateResolution(file, mediaInfoId);
        } else {
          toast.error('File size exceeded. Maximum upload file size is 10MB');
        }
      }
    }

    const validateResolution = (file: any, mediaInfoId: number) => {
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
            setMediaFile(file);
            callProfileAPI(file, mediaInfoId);
          } else {
            toast.error(`The image dimensions must be at least 189px*126px.`)
          }
        };
      }
    }

    const callProfileAPI = (file: any, mediaInfoId: number) => {
      prevProps.setSetChanges(true);
      try {
        setTestimonialsImages({
          fileName: file.name,
          fileuuid,
          farmId: farmId,
          fileSize: file.size,
        }).then(async (res: any) => {
          setFarmMediaFileImages([
            ...farmMediaFileImages,
            {
              file: file,
              mediauuid: fileuuid,
              url: res?.data?.url,
              mediaInfoId: mediaInfoId,
              isNew: true,
            },
          ]);
          setMediaImagePreviewUuid(fileuuid);
          setIsAddMoreClicked(2);
          const details = { file, fileuuid }
          setMediaImageFile(details);
          setIsMediaUploaded(true);
          setMediaImagePreview(URL.createObjectURL(file));
          setPresignedMediaPath(res.data.url);
        });
      } catch (error) {
        console.error(error);
      }
    }

    // remove file handler
    const removeFile = () => {
      setIsMediaUploaded(false);
      setValue(`testimonialOne.${mediaImagePreviewIndex}.media`, '');
      setCropPrevImg("");
      setIsSaveAndClose(false);
      setIsAddMoreClicked(1);
      console.log(mediaImagePreviewIndex,'fields');
    };

    const removeFileExisting = (mediaUUID: any, index: number, fields: any) => {
      console.log(mediaUUID, index, fields,'fields');
      setIsMediaUploaded(false);
      let imagesDeletedId = [...deletedTestimonialsImages, mediaUUID];
      setDeletedTestimonialsImages(imagesDeletedId);
      const removeSpecificFile = farmMediaFileImages.map((res: any) => {
        return {
          ...res,
          isDeleted: imagesDeletedId.includes(res?.mediauuid) ? true : false,
        };
      });
      setFarmMediaFileImages([...removeSpecificFile]);
      fields[index].mediaInfoFiles = null;
      setValue(`testimonialOne.${index}.media`, '');
      setCropPrevImg("");
      setIsSaveAndClose(false);
      setIsAddMoreClicked(1);
    };

    const { register, control, handleSubmit, reset, watch, formState, setValue, getValues } = useForm<any>({
      defaultValues: {
        testimonialOne:
          farmMediaNews?.length > 0
            ? farmMediaNews
            : [{ mediaInfoId: '', title: '', description: '', media: '' }],
      },
    });

    useEffect(() => {
      if (farmMediaNews && isFarmMediaNewsSuccess) {
        if (farmMediaNews?.length > 0) {
          setIsTitleError(false);
          setIsDescError(false);
          setValue('testimonialOne', farmMediaNews);
          // Assuming farmMediaNews is an array
          for (let index = 0; index < farmMediaNews.length; index++) {
            setValue(`testimonialOne.${index}.media`, farmMediaNews[index].mediaInfoFiles[0]?.mediaUrl);
          }
        }
      }
    }, [isFetching])

    const { errors, isSubmitting } = formState;
    const [uploadInProgress, setUploadInProgress] = useState<any>(false);
    const [isClearMedia, setIsClearMedia] = useState<any>(false);
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'testimonialOne',
    });

    let renderCount = 0;
    const [farmMediaFiles, farmMediaFilesResponse] = usePatchFarmMediaFilesMutation();

    const MAX_LENGTH = 276;
    const [count, setCount] = React.useState<number[]>([]);
    const [isAddMoreClicked, setIsAddMoreClicked] = React.useState<number>(0);

    const handleAddMore = () => {
      setIsAddMoreClicked(1);
      setIsTitleError(true);
      setIsDescError(true);
    }
    const handleMediaTitle = (e: any, i: number) => {
      let titleVal = e?.target?.value;
      setValue(`testimonialOne.${i}.title`, titleVal);
      if (titleVal?.length > 0) {
        setIsTitleError(false);
      } else {
        setIsTitleError(true);
      }
    };

    const handleChange = (e: any, i: number) => {
      let tempArr;
      tempArr = [...count];
      tempArr[e.target.id] = e.target.value.length;
      setCount([...tempArr]);
      prevProps.setSetChanges(true);
      let descVal = e?.target?.value;
      setValue(`testimonialOne.${i}.description`, descVal);
      if (descVal?.length > 0) {
        setIsDescError(false);
      } else {
        setIsDescError(true);
      }
    };

    useEffect(() => {
      if (cropPrevImg) {
        setValue(`testimonialOne.${mediaImagePreviewIndex}.media`, cropPrevImg);
      };
    }, [cropPrevImg])

    useEffect(() => {
      const subscription = watch((value, { name, type }) => {
        prevProps.setSetChanges(true);
      });
    });

    const isTitleFilled = (i: number) => watch(`testimonialOne.${i}.title`) !== '';
    const isDescriptionFilled = (i: number) => watch(`testimonialOne.${i}.description`) !== '';

    // Initialize a state variable to true
    let stateVariable = true;

    // Iterate through the JSON data
    for (const item of getValues(`testimonialOne`)) {

      const title = item.title;
      const description = item.description;
      const media = item.media;

      // Check if title, description, and media are either all blank or all have data in this object
      if (!((!title && !description && !media) || (title && description && media))) {
        stateVariable = false;
        setIsSaveAndClose(false);
        break; // If any attribute is inconsistent in this object, set to false and exit the loop
      } else {
        stateVariable = true;
        setIsSaveAndClose(true);
      }
    }

    const isAddMoreButtonDisabled = (item: any) => {
      const title = item.title;
      const description = item.description;
      const media = item.media;

      if (!(!title || !description || !media)) {
        return false;
      } else {
        return true;
      }
    }

    const [mediaUploadSuccess, mediaUploadSuccessResponse] = useFarmMediaUploadStatusMutation();
    const onSubmit = async (data: any) => {
      try {
        setUploadInProgress(true);

        const mediaInfoMedia = farmMediaFileImages
          .map((res: any) => {
            if (res) {
              return {
                isDeleted: res.isDeleted ? res.isDeleted : false,
                mediauuid: res.isDeleted || res.isNew ? res.mediauuid : null,
                // mediauuid: res.mediauuid ? res.mediauuid : null,
                mediaInfoId: res.mediaInfoId,
              };
            }
          })
          .filter((res: any) => res);

        let testimonialData: any = [];
        // testimonialData = data.testimonialOne.map((res: any, index: number) => {
        //   res.mediaInfoFiles = res.mediaInfoId
        //     ? mediaInfoMedia.filter((list: any) => list.mediaInfoId == res.mediaInfoId)
        //     : mediaInfoMedia[index]
        //       ? [mediaInfoMedia[index]]
        //       : [];
        //   res.isDeleted = false;
        //   return res;
        // });

        let testTestimonial = JSON.parse(JSON.stringify(data.testimonialOne));
        for (const media1Item of testTestimonial) {
          const matchingMedia2Item = mediaInfoMedia.filter((item:any) => item.mediaInfoId === media1Item.mediaInfoId);
         
          if (matchingMedia2Item) {
            // Replace mediaInfoFiles array in media1 with the matching item from media2
            media1Item.mediaInfoFiles = [...matchingMedia2Item];
          }
        }
        // testimonialData = JSON.parse(JSON.stringify(testTestimonial));
        // Now, media1 has been updated with the matched items from media2
        // console.log(testTestimonial,mediaInfoMedia,testimonialData,farmMediaNews,'testTestimonial');

        let afterRemoved = farmMediaNews.filter((res: any) =>
          deletedTestimonials.includes(res.mediaInfoId)
        );
        afterRemoved = afterRemoved.map((res: any) => {
          return { ...res, isDeleted: true, mediaInfoMedia: res.media };
        });

        // const blankRemoved = testimonialData?.filter((item: any) => {
        //   // Check if all of the conditions are NOT met (negating all conditions with !)
        //   return !(
        //     item?.title === "" || // Title is blank
        //     item?.description === "" || // Description is blank
        //     item?.media === "" // mediaInfoFiles length is 0
        //   );
        // });

        // testimonialData = blankRemoved;
        testTestimonial = [...testTestimonial,...afterRemoved];
        // console.log(afterRemoved,testTestimonial,'afterRemoved testTestimonial');

        let filteredMediaInfoFiles: any = [];
        // Define the indices of the objects to replace
        let replaceIndices: any = [];
        // Filter out objects with isDeleted:false and mediauuid:null, and add the object with isDeleted:true
        mediaInfoMedia?.map((item: any, index: number) => {
          if (index >= 2 && testimonialData.length >= 2) {
            filteredMediaInfoFiles[index] = mediaInfoMedia[index];
            replaceIndices[index] = index;
          } else {
            filteredMediaInfoFiles = [];
          }
        })

        // Loop through the replaceIndices and update the firstArray
        replaceIndices.forEach((index: any) => {
          if (index !== null && testimonialData.length >= 2 && filteredMediaInfoFiles[index] && index >= 2) {
            testimonialData[index - 1].mediaInfoFiles[0] = filteredMediaInfoFiles[index];
          }
        });

        farmMediaFileImages = farmMediaFileImages.filter((res) => res);
        const mediaFileuuid: any = farmMediaFileImages
          ?.filter((res: any) => res.isNew)
          .map((res: any) => res.mediauuid)

        const farmMediaFilesResponse: any = await farmMediaFiles({
          farmId,
          mediaInfos: testTestimonial,
        });
        if (farmMediaFilesResponse.error) {
          if (farmMediaFilesResponse.error.status == 422) {
            setSubmissionError(farmMediaFilesResponse.error);
          } else if (farmMediaFilesResponse.error.status > 499) {
            setSubmissionError(
              'Internal Server Error'
            );
          }
          setUploadInProgress(false);
        } else {
          if (farmMediaFileImages.length > 0) {
            farmMediaFileImages.map(async (res: any) => {
              if (res.url) {
                const uploadOptions = { method: 'Put', body: res.file };
                const result = await fetch(res.url, uploadOptions);
              }
            });
            let count = 1;
            const interval = setInterval(async () => {
              if (count >= 1) {
                let data: any = await mediaUploadSuccess(
                  mediaFileuuid,
                );
                if (data.error.data != 'SUCCESS') {
                  count++;
                  if (count === 10) {
                    clearInterval(interval);
                    setSubmissionError(
                      'Image couldnt upload due to S3 & lamda server issue'
                    );
                    setUploadInProgress(false);
                    return false;
                  }
                } else {
                  count = 0;
                  setUploadInProgress(false);
                  next();
                }
              }
            }, 5000);
          } else {
            next();
          }
        }
      }
      catch (error) {
        setSubmissionError(error);
        setUploadInProgress(false);
      }
    };
    renderCount++;

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ justifyContent: 'center' }} className="dialogPopup">
            <Box className="testtimonial-forms-box farm-media-modal-edit" mt={4}>
              {fields.map((testimonial: any, i) => {
                let thumbs: any = '';
                const imageFormats = ['jpg', 'jpeg', 'png'];
                const videoFormats = ['mp4'];

                let fileDetails = testimonial.mediaInfoFiles?.length > 0 ? testimonial.mediaInfoFiles[0] : null;
                const type = fileDetails?.fileName?.split('.')[1];
                const imageFile = imageFormats.includes(type) ? <img src={`${fileDetails?.mediaUrl}?w=500&h=500`} alt={fileDetails?.fileName} /> : '';
                const videoFile = videoFormats.includes(type) ? <video src={fileDetails?.mediaUrl} width="350" height="350" controls /> : '';

                return (
                  <Grid
                    container
                    spacing={3}
                    key={testimonial + i}
                    mb={5}
                    className="farm-media-modal-edit-item"
                  >
                    <Grid item xs={12} sm={6} lg={6}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} lg={12}>
                          <input type="hidden" {...register(`testimonialOne.${i}.mediaInfoId`)} />
                          <Box className="testimonilstextarea">
                            <InputLabel>
                              Media {i + 1} Title
                              <HtmlTooltip
                                enterTouchDelay={0}
                                leaveTouchDelay={6000}
                                className="CommonTooltip studfee-tooltip edit-tooltip farmnews-tooltip"
                                placement='bottom-start'
                                title={
                                  <React.Fragment>
                                    {
                                      'Adding recent success stories or stallion announcements is an effective way to increase farm awareness.'
                                    }{' '}
                                  </React.Fragment>
                                }
                              >
                                <i className="icon-Info-circle" />
                              </HtmlTooltip>
                            </InputLabel>
                            <TextField
                              fullWidth
                              id={`${i}`}
                              className={`mediaTitle_${i}`}
                              minRows={3}
                              type="text"
                              autoComplete="new-password"
                              placeholder="Media Title"
                              {...register(`testimonialOne.${i}.title`)}
                              onChange={(e: any) => handleMediaTitle(e, i)}
                            />
                            {/* {console.log('get values>>>',  isAddMoreClicked, getValues(`testimonialOne.${i}`))} */}
                            <Grid container>
                              <Grid item lg={12} sm={12} xs={12}>
                                {isDescriptionFilled(i) && !getValues(`testimonialOne.${i}.title`) && (
                                  <p className="farm-overview">This is a required field.</p>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} sx={{ paddingTop: '5px !important' }}>
                          <Box>
                            <InputLabel>Overview</InputLabel>
                            <TextareaAutosize
                              id={`${i}`}
                              className={`mediaDesc_${i}`}
                              minRows={8}
                              placeholder="Minimum 3 rows"
                              {...register(`testimonialOne.${i}.description`)}
                              onChange={(e: any) => handleChange(e, i)}
                              maxLength={MAX_LENGTH}
                            />
                            <Grid container>
                              <Grid item lg={4} sm={4} xs={12}>
                                <p> {count[i] || testimonial?.description?.length}/{MAX_LENGTH}</p>
                              </Grid>

                              <Grid item lg={8} sm={8} xs={12}>
                                {isTitleFilled(i) && !getValues(`testimonialOne.${i}.description`) && (
                                  <p className="farm-overview">This is a required field.</p>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12} className="upload-testimonials-box">
                      <Button
                        id={`${i}`}
                        type="button"
                        className="clear-testimonials"
                        onClick={() => {
                          setDeletedTestimonials([...deletedTestimonials, testimonial?.mediaInfoId]);
                          // setIsAddMoreClicked(0);
                          if (fields.length > 1) {
                            remove(i);
                            let field: any = fields[i - 1];
                            if ((field?.title)) {
                              setIsTitleError(false);
                            } else {
                              setIsTitleError(true);
                            }
                            if ((field?.description)) {
                              setIsDescError(false);
                            } else {
                              setIsDescError(true);
                            }

                          } else {
                            setIsDescError(true);
                            setIsTitleError(true);
                            setNoPreview(false);
                            setIsClearMedia(true);
                            reset({
                              testimonialOne: [
                                {
                                  mediaInfoId: '',
                                  title: '',
                                  description: '',
                                  media: '',
                                },
                              ],
                            });
                          }
                        }}
                      >
                        {fields.length == 1 ? 'Clear Media' : 'Delete Media'}
                      </Button>

                      <Box mt={2} className="testi-pic edit-farm-pic">
                        <>
                          {/* {console.log('fileDetails>>>',  fileDetails, 'isMediaUploaded>>>', isMediaUploaded, getValues(`testimonialOne.${i}`))} */}
                          <Box className="draganddrop-farms-image" sx={{ height: '136px' }}>
                            {fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.mediaInfoId !== '' && isMediaUploaded === false &&
                              <Box className="hero-pic" key={fileDetails?.fileName}>
                                <i className="icon-Incorrect" onClick={(e) => removeFileExisting(testimonial.mediaInfoFiles[0].mediauuid, i, fields)} />
                                {imageFile} {videoFile}
                              </Box>}
                            {fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.mediaInfoId !== '' && isMediaUploaded &&
                              <Box className="hero-pic" key={fileDetails?.fileName}>
                                <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                                {!isVideo && <img src={getValues(`testimonialOne.${i}.media`)} alt={"Cropped Media"} />}
                                {isVideo && <video src={getValues(`testimonialOne.${i}.media`)} width="370" height="350" controls />}
                              </Box>}
                            {!fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.mediaInfoId === '' && isMediaUploaded &&
                              <Box className="hero-pic" key={fileDetails?.fileName}>
                                <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                                {!isVideo && <img src={getValues(`testimonialOne.${i}.media`)} alt={"Cropped Media"} />}
                                {isVideo && <video src={getValues(`testimonialOne.${i}.media`)} width="370" height="350" controls />}
                              </Box>}
                            {!fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.mediaInfoId !== '' && isMediaUploaded &&
                              <Box className="hero-pic" key={fileDetails?.fileName}>
                                <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                                {!isVideo && <img src={getValues(`testimonialOne.${i}.media`)} alt={"Cropped Media"} />}
                                {isVideo && <video src={getValues(`testimonialOne.${i}.media`)} width="370" height="350" controls />}
                              </Box>}
                            {!fileDetails && (!getValues(`testimonialOne.${i}.media`) || (testimonial.mediaInfoId === '' && !isMediaUploaded)) &&
                              <><Box className="draganddrop-farms" sx={{ height: '136px' }} onClick={profileMediaUpload}>
                                <input
                                  type='file'
                                  id='file'
                                  {...register(`testimonialOne.${i}.media`)}
                                  ref={inputFile}
                                  style={{ display: 'none' }}
                                  onChange={(e: any) => onChangeFile(e, i, testimonial?.mediaInfoId)}
                                  onClick={(event: any) => {
                                    event.target.value = null;
                                    prevProps.setSetChanges(true);
                                  }}
                                />
                                <i className="icon-Photograph"></i>
                                <Typography variant="h6">
                                  Drag and drop your image/video here
                                </Typography>
                                <span>
                                  or <a href="#">upload file </a> from your computer
                                </span></Box></>}
                          </Box></>
                      </Box>
                    </Grid>
                    {fields.length && fields.length == i + 1 ? (
                      <Grid
                        item
                        xs={12}
                        pt="22px"
                        mb="0px !important"
                        className="add-testimonials-wrp"
                      >
                        <CustomButton
                          type="Button"
                          className="add-testimonials"
                          disabled={isAddMoreButtonDisabled(getValues(`testimonialOne.${i}`))}
                          onClick={() => {
                            append({ mediaInfoId: '', title: '', description: '' });
                            handleAddMore();
                          }}
                        >
                          {' '}
                          + Add More Media
                        </CustomButton>
                      </Grid>
                    ) : (
                      ''
                    )}
                  </Grid>
                );
              })}
            </Box>
          </Box>
          <button type="submit" className="hide" ref={submitRef}></button>
        </form>
        {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
        <CropMediaImageDialog
          open={openEditImageDialog && response.isSuccess}
          title={`${farmDetails?.image ? 'Edit' : 'Add'} Farm Media`}
          onClose={() => setOpenEditImageDialog(false)}
          imgSrc={mediaImagePreview ? mediaImagePreview : ""}
          imgName={mediaFile?.name || ""}
          imgFile={mediaFile}
          awsUrl={presignedMediaPath}
          setCropPrevImg={setCropPrevImg}
          setCropImageFile={setCropImageFile}
          circularCrop={false}
        />
      </>
    );
  }
);

export default FarmNews;
