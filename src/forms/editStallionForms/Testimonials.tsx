import {
  Box,
  Button,
  Grid,
  InputLabel,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import CustomDropzone from 'src/components/CustomDropzone';
import { useGetStallionTestimonialsQuery } from 'src/redux/splitEndpoints/getStallionDetailsSplit';
import { CustomButton } from 'src/components/CustomButton';
import {
  usePatchStallionProfileTestimonialsMutation,
  usePostStallionProfileTestimonialsMediaUploadMutation,
} from 'src/redux/splitEndpoints/PatchStallionDetailsByIdSplit';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import '../../components/WrappedDialog/dialogPopup.css';
import { useStallionTestimonialsImagesUploadStatusMutation } from 'src/redux/splitEndpoints/mediaUploadStatus';
import { Spinner } from 'src/components/Spinner';
import { toast } from 'react-toastify';
import CropMediaImageDialog from 'src/components/CropMediaImageDialog';
/////////////////////////////////////////////////
type TestimonialProps = {
  prevProps: any;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  setTestimonialsGalleryImages: React.Dispatch<React.SetStateAction<any>>;
  fileuuid: any;
  fileUpload: any;
  setFileUpload: any;
  testimonialsGalleryImages: any[];
  next: () => void;
  galleryImages: any[];
  isSaveAndClose: boolean;
  setIsSaveAndClose: React.Dispatch<React.SetStateAction<boolean>>;
};

const Testimonials = forwardRef<HTMLButtonElement, TestimonialProps>(
  (
    {
      fileUpload,
      fileuuid,
      setFileUpload,
      setSubmissionError,
      prevProps,
      setTestimonialsGalleryImages,
      testimonialsGalleryImages,
      next,
      galleryImages,
      isSaveAndClose,
      setIsSaveAndClose
    },
    submitRef
  ) => {
    const { stallionDetails } = prevProps;
    const { stallionId } = stallionDetails;
    const [testimonialsArr, setTestimonialsArr] = useState<any[]>([]);
    const { data: stallionTestimonials } = useGetStallionTestimonialsQuery(stallionId);
    const [setTestimonialsImages, response] = usePostStallionProfileTestimonialsMediaUploadMutation();
    const [deletedTestimonialsImages, setDeletedTestimonialsImages] = React.useState<any>([]);
    const [deletedTestimonials, setDeletedTestimonials] = React.useState<any>([]);
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
      if(inputFile) {
        inputFile?.current?.click();
      }      
    }

    const onChangeFile = async (event: any,i:number, mediaInfoId: number) => {
      event.stopPropagation();
      event.preventDefault();
      const videoFormats = ['mp4'];
      const imageFormats = ['jpg', 'jpeg', 'png'];
      var file = event.target.files[0];      
      setMediaImagePreviewIndex(i);
      const type = file.type.split('/')[1];
      
      const videoFileSize = 50000000; // 10MB change to 50MB 
      
      if(type === 'mp4') {
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
            stallionId: stallionId,
            fileSize: file.size,
          }).then(async (res: any) => {
            setTestimonialsGalleryImages([
              ...testimonialsGalleryImages,
              {
                file: file,
                mediauuid: fileuuid,
                url: res?.data?.url,
                mediaInfoId: mediaInfoId,
                isNew: true,
              },              
            ]);
            setMediaImagePreviewUuid(fileuuid);
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
      setNoPreview(true);                          
    };

    const removeFileExisting = (mediaUUID: any, index: number, fields: any) => {
      setIsMediaUploaded(false);
      setNoPreview(true);    
      // setTestimonialsGalleryImages([
      //   ...testimonialsGalleryImages,
      //   {
      //     file: fileUpload,
      //     mediauuid: mediaUUID,
      //     isDeleted: true,
      //   },
      // ]);

      let imagesDeletedId = [...deletedTestimonialsImages, mediaUUID];
      setDeletedTestimonialsImages(imagesDeletedId);
      const removeSpecificFile = testimonialsGalleryImages.map((res: any) => {
        return {
          ...res,
          isDeleted: imagesDeletedId.includes(res?.mediauuid) ? true : false,
        };
      });
      setTestimonialsGalleryImages([...removeSpecificFile]);
      
      fields[index].media = null;      
      setValue(`testimonialOne.${index}.media`, '');
      setCropPrevImg("");
      setIsSaveAndClose(false);
    };

    const handleTestimonialName = (e: any, i: number) => {
      let titleVal = e?.target?.value;
      setValue(`testimonialOne.${i}.title`, titleVal);
    };

    const handleTestimonialCompany = (e: any, i: number) => {
      let companyVal = e?.target?.value;
      setValue(`testimonialOne.${i}.company`, companyVal);
    };

    const handleTestimonialDesc = (e: any, i: number) => {
      let tempArr;
      tempArr = [...count];
      tempArr[e.target.id] = e.target.value.length;
      setCount([...tempArr]);
      prevProps.setSetChanges(true);
      let descVal = e?.target?.value;
      setValue(`testimonialOne.${i}.description`, descVal);
    };

    useEffect(() => {
      if (cropPrevImg) {
        setValue(`testimonialOne.${mediaImagePreviewIndex}.media`,cropPrevImg);
      };
    }, [cropPrevImg])

    const { register, control, handleSubmit, reset, watch, formState, setValue, getValues } = useForm({
      defaultValues: {
        testimonialOne:
          stallionTestimonials.length > 0
            ? stallionTestimonials
            : [{ testimonialId: '', company: '', description: '', title: '' }],
      },
    });

    const { errors, isSubmitting } = formState;
    const [uploadInProgress, setUploadInProgress] = useState<any>(false);
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'testimonialOne',
    });
    let renderCount = 0;
    const [testimonials, testimonialsResponse] = usePatchStallionProfileTestimonialsMutation();
    
    const MAX_LENGTH = 276;
    const [count, setCount] = React.useState<number[]>([]);
    const handleChange = (e: any) => {
      let tempArr;
      tempArr = [...count];
      tempArr[e.target.id] = e.target.value.length;
      setCount([...tempArr]);
      prevProps.setSetChanges(true);
    };

    useEffect(() => {
      if (fileUpload && !fileUpload.isDeleted) {
        prevProps.setSetChanges(true);
        try {
          setTestimonialsImages({
            fileName: fileUpload.path,
            fileuuid: fileUpload.tempFileName,
            stallionId: stallionId,
            fileSize: fileUpload.size,
          }).then(async (res: any) => {
            setTestimonialsGalleryImages([
              ...testimonialsGalleryImages,
              {
                file: fileUpload,
                mediauuid: fileUpload.tempFileName,
                url: res.data.url,
                testimonialId: fileUpload.testimonialId,
                isNew: true,
              },
            ]);
          });
        } catch (error) {
          console.error(error);
        }
      }
      if (fileUpload && 'isDeleted' in fileUpload) {
        prevProps.setSetChanges(true);
        setIsMediaUploaded(false);
        setIsSaveAndClose(true);
        let imagesDeletedId = [...deletedTestimonialsImages, fileUpload.isDeleted];
        setDeletedTestimonialsImages(imagesDeletedId);
        const removeSpecificFile = testimonialsGalleryImages.map((res: any) => {
          return {
            ...res,
            isDeleted: imagesDeletedId.includes(res?.mediauuid) ? true : false,
          };
        });
        setTestimonialsGalleryImages([...removeSpecificFile]);
      }
    }, [fileUpload]);
    React.useEffect(() => {
      const subscription = watch((value, { name, type }) => {
        prevProps.setSetChanges(true);
    });
    return () => subscription.unsubscribe();
    }, [watch]);

    const isNameFilled = (i: number) => watch(`testimonialOne.${i}.title`) !== '';
    const isCompanyFilled = (i: number) => watch(`testimonialOne.${i}.company`) !== '';
    const isDescriptionFilled = (i: number) => watch(`testimonialOne.${i}.description`) !== '';
    
    // Initialize a state variable to true
    let stateVariable = true;

    // Iterate through the JSON data
    for (const item of getValues(`testimonialOne`)) {
        
      const title = item.title;
      const company = item.company;
      const description = item.description;
      const media = item.media;
      
      // Check if title, description, and media are either all blank or all have data in this object
      if (!((!title && !company && !description && !media) || (title && company && description && media))) {
          stateVariable = false;
          setIsSaveAndClose(false);
          break; // If any attribute is inconsistent in this object, set to false and exit the loop
      } else {
        stateVariable = true;
        setIsSaveAndClose(true);
      }
    }

    const isAnyOfThemFilledup = (field: string, isTitle: boolean, isDesc: boolean, isCompany: boolean) => {
      // if(field === 'description') {
      //   if((isTitle || isCompany) && isDesc) {
          
      //   }
      // }
      // Check if title, description, and media are either all blank or all have data in this object
      if (!((!isTitle && !isDesc && !isCompany) || (isTitle && isDesc && isCompany))) {
        return true; // If any attribute is inconsistent in this object, set to false and exit the loop
      } else {
        return false;
      }
    }

    const isAddMoreButtonDisabled = (item: any) => {
      const title = item.title;
      const company = item.company;
      const description = item.description;
      const media = item.media;

      if (!(!title || !company || !description || !media)) {
        return false;
      } else {
        return true;
      }
    }

    const [mediaUploadSuccess, mediaUploadSuccessResponse] = useStallionTestimonialsImagesUploadStatusMutation();
    const onSubmit = async (data: any) => {
      try {
        setUploadInProgress(true);
        const testimonialMedia = testimonialsGalleryImages
          .map((res: any) => {
            if (res) {
              return {
                isDeleted: res.isDeleted ? res.isDeleted : false,
                mediauuid: res.isDeleted || res.isNew ? res.mediauuid : null,
                testimonialId: res.testimonialId,
              };
            }
          })
          .filter((res: any) => res);
      

        let testimonialData: any = [];
        testimonialData = data.testimonialOne.map((res: any, index: number) => {
          res.testimonialMedia = res.testimonialId
            ? testimonialMedia.filter((list: any) => list.testimonialId == res.testimonialId)
            : testimonialMedia[index]
            ? [testimonialMedia[index]]
            : [];
          res.isDeleted = false;
          return res;
        });

        let afterRemoved = stallionTestimonials.filter((res: any) =>
          deletedTestimonials.includes(res.testimonialId)
        );
        afterRemoved = afterRemoved.map((res: any) => {
          return { ...res, isDeleted: true, testimonialMedia: res.media };
        });

        const blankRemoved = testimonialData?.filter((item: any) => {
          // Check if all of the conditions are NOT met (negating all conditions with !)
          return !(
            item?.title === "" || // Title is blank
            item?.company === "" || // Title is blank
            item?.description === "" || // Description is blank
            item?.media === "" // mediaInfoFiles length is 0
          );
        });
        testimonialData = blankRemoved;

        testimonialData = [...testimonialData, ...afterRemoved];

        let filteredMediaInfoFiles:any = [];
        // Define the indices of the objects to replace
        let replaceIndices: any = [];
        // Filter out objects with isDeleted:false and mediauuid:null, and add the object with isDeleted:true
        testimonialMedia?.map((item: any, index: number) => {
          if (index >= 2 && testimonialData.length >= 2) {
            filteredMediaInfoFiles[index] = testimonialMedia[index];
            replaceIndices[index] = index;
          } else {
            filteredMediaInfoFiles = [];
          }
        })

        // Loop through the replaceIndices and update the firstArray
        replaceIndices.forEach((index: any) => {
          if (index!== null && testimonialData.length >= 2 && filteredMediaInfoFiles[index] && index >= 2) {
            testimonialData[index-1].mediaInfoFiles[0] = filteredMediaInfoFiles[index];
          }
        });

        testimonialsGalleryImages = testimonialsGalleryImages.filter((res) => res);
        //    mediaFileuuid status check 
        const mediaFileuuid: any = testimonialsGalleryImages
              ?.filter((res: any) => res.isNew)
              .map((res: any) => res.mediauuid)
        const testimonialsResponse: any = await testimonials({
          stallionId,
          testimonials: testimonialData,
        });
        if (testimonialsResponse.error) {
          if (testimonialsResponse.error.status == 422) {
            setSubmissionError(testimonialsResponse.error);
          } else if (testimonialsResponse.error.status > 499) {
            setSubmissionError(
              'Internal Server Error'
            );
          }
          setUploadInProgress(false);
        } else {
          if(testimonialsGalleryImages.length > 0) {
          testimonialsGalleryImages.map(async (res: any) => {
            if (res.url) { 
              const uploadOptions = { method: 'Put', body: res.file };
              const result = await fetch(res.url, uploadOptions);  
            }
          });
          // Media Upload check until lamda success 
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
      } catch (error) {
        setSubmissionError(error);
      }
    };

    renderCount++;
    return (
      <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{ justifyContent: 'center' }} className="dialogPopup">
          <Box className="testtimonial-forms-box">
            {fields.map((testimonial: any, i) => {
              let thumbs: any = '';
              const imageFormats = ['jpg', 'jpeg', 'png'];
              const videoFormats = ['mp4'];
              
              let fileDetails = testimonial.media?.length > 0 ? testimonial.media[0] : null;
              const type = fileDetails?.fileName?.split('.')[1];
              const imageFile = imageFormats.includes(type) ? <img src={`${fileDetails?.mediaUrl}?w=500&h=500`} alt={fileDetails?.fileName} /> : '';
              const videoFile = videoFormats.includes(type) ? <video src={fileDetails?.mediaUrl} width="350" height="350" controls /> : '';
              
              return (
                <Grid container spacing={3} key={testimonial + i} mb={5}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} lg={12}>
                        <input type="hidden" {...register(`testimonialOne.${i}.testimonialId`)} />

                        <Box className="testimonilstextarea">
                          <InputLabel>
                            Testimonial {i + 1}
                            <HtmlTooltip
                              enterTouchDelay={0}
                              className="CommonTooltip studfee-tooltip edit-tooltip" 
                              PopperProps={{
                                placement: 'bottom-start',
                              }}
                              title={
                                <React.Fragment>
                                  {
                                    'Adding testimonials from influencial people connected to the stallion is a great way to increase authority and set your stallion apart. Quotes from stud masters, trainers, jockets, owners work well.'
                                  }{' '}
                                </React.Fragment>
                              }
                            >
                              <i className="icon-Info-circle" />
                            </HtmlTooltip>
                          </InputLabel>
                          <TextareaAutosize
                            id={`${i}`}
                            className={`mediaDesc_${i}`}
                            minRows={8}
                            placeholder="Minimum 3 rows"
                            {...register(`testimonialOne.${i}.description`)}
                            onChange={(e: any) => handleTestimonialDesc(e, i)}
                            maxLength={MAX_LENGTH}
                          />
                          <Grid container>
                            <Grid item lg={4} sm={4} xs={12}>
                              <Typography>
                                {count[i] || testimonial.description.length}/{MAX_LENGTH}
                              </Typography>
                            </Grid>
                            <Grid item lg={8} sm={8} xs={12}>
                            {(isNameFilled(i) || isCompanyFilled(i)) && !getValues(`testimonialOne.${i}.description`) && (
                              <p className="farm-overview">This is a required field.</p>
                            )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} lg={12} sx={{ paddingTop: '5px !important' }}>
                        <Box>
                          <InputLabel>Name</InputLabel>
                          <TextField
                            fullWidth
                            id={`${i}`}
                            className={`mediaTitle_${i}`}
                            minRows={3}
                            type="text"
                            autoComplete="new-password"
                            placeholder="Name"
                            {...register(`testimonialOne.${i}.title`)}
                            onChange={(e: any) => handleTestimonialName(e, i)}
                          />
                          {/* {console.log('testimonial data>>>', getValues(`testimonialOne.${i}`), 'desc>>>', isDescriptionFilled(i), 'comp>>>', isCompanyFilled(i), 'name>>>', isNameFilled(i))} */}
                          <Grid container>
                            <Grid item lg={12} sm={12} xs={12}>
                            {(isDescriptionFilled(i) || isCompanyFilled(i)) && !getValues(`testimonialOne.${i}.title`) && (
                              <p className="farm-overview">This is a required field.</p>
                            )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} lg={12} sx={{ paddingTop: '5px !important' }}>
                        <Box>
                          <InputLabel>Company</InputLabel>
                          <TextField
                            fullWidth
                            id={`${i}`}
                            className={`mediaTitle_${i}`}
                            minRows={3}
                            type="text"
                            autoComplete="new-password"
                            placeholder="Company"
                            {...register(`testimonialOne.${i}.company`)}
                            onChange={(e: any) => handleTestimonialCompany(e, i)}
                          />
                          <Grid container>
                            <Grid item lg={8} sm={8} xs={12}>
                            {(isDescriptionFilled(i) || isNameFilled(i)) && !getValues(`testimonialOne.${i}.company`) && (
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
                        setDeletedTestimonials([
                          ...deletedTestimonials,
                          testimonial?.testimonialId,
                        ]);

                        if (fields.length > 1) {
                          remove(i);
                        } else {
                          setNoPreview(true);
                          reset({
                            testimonialOne: [
                              {
                                testimonialId: '',
                                company: '',
                                description: '',
                                title: '',
                                media: '',
                              },
                            ],
                          });
                        }
                      }}
                    >
                      {fields.length == 1 ? 'Clear Testimonial' : 'Delete Testimonial'}
                    </Button>

                    <Box mt={2} className="testi-pic">
                      <>  
                        <Box className="draganddrop-farms-image" sx={{ height: '136px' }}>
                        {fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.mediaInfoId !== '' && isMediaUploaded === false &&
                        <Box className="hero-pic" key={fileDetails?.fileName}>
                          <i className="icon-Incorrect" onClick={(e) => removeFileExisting(testimonial.media[0].mediauuid, i, fields)} />
                          {imageFile} {videoFile}                          
                        </Box>}
                        {fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.mediaInfoId !== '' && isMediaUploaded &&                        
                        <Box className="hero-pic" key={fileDetails?.fileName}>
                          <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                          {!isVideo && <img src={getValues(`testimonialOne.${i}.media`)} alt={"Cropped Media"} />}
                          {isVideo && <video src={getValues(`testimonialOne.${i}.media`)} width="370" height="350" controls />}
                        </Box>}
                        {!fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.media === '' && isMediaUploaded &&                        
                        <Box className="hero-pic" key={fileDetails?.fileName}>
                          <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                          {!isVideo && <img src={getValues(`testimonialOne.${i}.media`)} alt={"Cropped Media"} />}
                          {isVideo && <video src={getValues(`testimonialOne.${i}.media`)} width="370" height="350" controls />}
                        </Box>}
                        {!fileDetails && getValues(`testimonialOne.${i}.media`) && testimonial.media !== '' && isMediaUploaded &&                        
                        <Box className="hero-pic" key={fileDetails?.fileName}>
                          <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                          {!isVideo && <img src={getValues(`testimonialOne.${i}.media`)} alt={"Cropped Media1"} />}
                          {isVideo && <video src={getValues(`testimonialOne.${i}.media`)} width="370" height="350" controls />}
                        </Box>}
                        {!fileDetails && (!getValues(`testimonialOne.${i}.media`) || (!fileDetails && !isMediaUploaded)) &&
                          <><Box className="draganddrop-farms" sx={{ height: '136px' }} onClick={profileMediaUpload}>
                            <input
                              type='file'
                              id='file'
                              {...register(`testimonialOne.${i}.media`)}
                              ref={inputFile}
                              style={{ display: 'none' }}
                              onChange={(e:any) => onChangeFile(e,i, testimonial?.mediaInfoId)}
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
                  {fields.length && fields.length === i+1 && fields.length < 3 ? (
                <Grid item xs={12} className="add-testimonials-wrp">
                  <CustomButton
                    type="Button"
                    className="add-testimonials"
                    disabled={isAddMoreButtonDisabled(getValues(`testimonialOne.${i}`))}
                    onClick={() => {
                      append({ testimonialId: '', company: '', description: '', title: '' });
                    }}
                  >
                    {' '}
                    Add Testimonial
                  </CustomButton>
                </Grid>
              ) : (
                ''
              )}
                </Grid>
              );
              
            })}
          </Box>
        </Grid>
        
        <button type="submit" className="hide" ref={submitRef}></button>
      </form> 
      {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
      <CropMediaImageDialog
        open={openEditImageDialog && response.isSuccess}
        title={`${stallionDetails?.image ? 'Edit' : 'Add'} Testimonial Media`}
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
export default Testimonials;
