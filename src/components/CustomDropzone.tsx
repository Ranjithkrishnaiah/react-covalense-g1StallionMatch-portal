import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, StyledEngineProvider, Typography } from '@mui/material';
import '../components/WrappedDialog/dialogPopup.css';
import { v4 as uuid } from 'uuid';
// styles
const baseStyle = {
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};
let selectedImages: any = [];

function CustomDropzone(dataProps: any) {
  const props: any = dataProps.data;
  const [isDisplayed, setDisplayed] = useState<any>(true);
  const [files, setFiles] = useState([]);
  const [fileSelected, setFileSelected] = useState(props.fileDetails);
  const [fileError, setFileError] = useState<any>({});
  const imageFormats = ['jpg', 'jpeg', 'png'];
  const videoFormats = ['mp4']
  // on drop handler
  const onDrop = useCallback((acceptedFiles) => {
    const tempFileName: any = uuid();
    const fileSize = 10000000; //53983 bites 5MB chnage to 10MB limit
    const videoFileSize = 50000000; // 10MB change to 50MB 
    let formats = ['jpg', 'jpeg', 'png'];
    if(props.isVideo) formats.push('mp4');
    setFiles(
      acceptedFiles.map((file: any) => {
        const type = file.path.split('.').pop();
        if (dataProps.galleryResolution) {
          var reader = new FileReader();
          //Read the contents of Image File.
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
              if (
                height < dataProps.galleryResolution.height ||
                width < dataProps.galleryResolution.width
              ) {
                setFileError({
                  message: `The image dimensions must be at least ${dataProps.galleryResolution.width}px*${dataProps.galleryResolution.height}px.`,
                });
                file.invalidPath = true;
              }
            };
          };
        }
        if(file.invalidPath) {
          setFileError({ message: `The image dimensions must be at least ${dataProps.galleryResolution.width}px*${dataProps.galleryResolution.height}px.` });
          return false;
        } else {
          setFileError({});
        }
        const size =  videoFormats.includes(type) ? videoFileSize : fileSize;
        if (file.size > size) {
          setFileError({ message: videoFormats.includes(type) ? 'File too large. Max limit of 50MB' : 'File too large. Max limit of 10MB' });
          return false;
        } else {
          setFileError({});
        }
        if (!formats.includes(type)) {
          setFileError({ message: `Please upload only ${formats.join(', ')}.` });
          return false;
        } else {
          setFileError({});
        }
        setDisplayed(false);
        file.tempFileName = tempFileName;
        file.position = props.position;
        if (props?.testimonialId) file.testimonialId = props.testimonialId;
        if (props?.mediaInfoId) file.mediaInfoId = props.mediaInfoId;
        props.setFileUpload(file);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      }).filter((res: any) => res)
    );
  }, []);

  // useDropzone handler
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/jpeg, image/png, video/*',
  });
  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  let thumbs: any = '';
  if (!fileSelected) {
    thumbs = files.map((file: any) => {
      let imageFile, videoFile;
      const type = file.name.split('.')[1];
      imageFile = imageFormats.includes(type) ? <img src={file.preview} alt={file.name} /> : '';
      videoFile = videoFormats.includes(type) ? <video src={file.preview} width="350" height="350" controls /> : '';
      if (selectedImages.indexOf(file.name) === -1) selectedImages.push(file.name);
      if (!fileError.message) {
        return (
          <Box className="hero-pic" key={file.name}>
            <i className="icon-Incorrect" onClick={(e) => removeFile(file)} />
            {imageFile} {videoFile}
          </Box>
        );
      }
    });
  }
  if (fileSelected) {
    let imageFile, videoFile;
    const type = props.fileDetails?.fileName.split('.')[1];
    imageFile = imageFormats.includes(type) ? <img src={`${props.fileDetails?.mediaUrl}?ar=3:2&w=${dataProps?.size?.w}&h=${dataProps?.size?.h}`} alt={props.fileDetails?.fileName} /> : '';
    videoFile = videoFormats.includes(type) ? <video src={props.fileDetails?.mediaUrl} width="350" height="350" controls /> : '';
    thumbs = (
      <Box className="hero-pic" key={props.fileDetails?.fileName}>
        <i className="icon-Incorrect" onClick={(e) => removeFileExisting()} />
        {imageFile} {videoFile}
      </Box>
    );
  }
  useEffect(
    () => () => {
      if (!fileError.message) files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  // remove file handler
  const removeFile = (file: any) => {
    setDisplayed(true);
    props.setFileUpload({ isDeleted: file.tempFileName, isNew: true});
    const validFileIndex = files.findIndex((e: any) => e.name === file.name);
    files.splice(validFileIndex, 1);
    setFiles([...files]);
    setFileError(false);
  };

  // remove file Existing handler
  const removeFileExisting = () => {
    setFileSelected(false);
    setDisplayed(true);
    props.setFileUpload({ isDeleted: fileSelected?.mediauuid, isNew: false });
    setFileError(false);
  };
  return (
    <>
      <StyledEngineProvider injectFirst>
        {thumbs}
        {!fileSelected && (isDisplayed || fileError?.message) ? (
          <Box className="draganddrop" {...getRootProps({ style })} sx={{ height: '136px' }}>
            <input {...getInputProps()} />
            <i className="icon-Photograph"></i>
            <Typography variant="h6">
              Drag and drop your images{dataProps?.video && '/video'} here
            </Typography>
            <span>
              or <a href="#">upload file </a> from your computer
            </span>
          </Box>
        ) : (
          ''
        )}

        {fileError ? <Typography>{fileError?.message}</Typography> : ''}
      </StyledEngineProvider>
    </>
  );
}

export default CustomDropzone;
