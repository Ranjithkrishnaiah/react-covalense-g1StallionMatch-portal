import React, { useEffect } from 'react'
import { useDropzone, FileError } from 'react-dropzone';
import { InputLabel, StyledEngineProvider, Box, TextField, Typography } from '@mui/material';
import { CustomButton } from '../components/CustomButton';
import { usePostMareListsMutation } from 'src/redux/splitEndpoints/postMareListsCSV';
import { CustomRangeSlider } from '../components/CustomRangeslider';
import '../pages/stallionDirectory/StallionDirectory.css';
import { VoidFunctionType } from 'src/@types/typeUtils';
import { Link } from 'react-router-dom';

function UploadMareLists(
  onClose: VoidFunctionType,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  farmID?: string,
  open?: boolean,
) {
  const [file, setFile] = React.useState<any>(null);
  const [name, setName] = React.useState<string>("");
  const [progressValue, setProgressValue] = React.useState<number>(0);
  const [nameError, setNameError] = React.useState("");
  const [uiResponse, setUiResponse] = React.useState({ isLoading: false, isSuccess: false, isError: false });
  const [fileError, setFileError] = React.useState("");

  const formData = new FormData();
  // method onClose popup
  const closePopup = () => {
    setName("");
    setNameError("");
    setFileError("");
    setFile("");
    onClose();
    setUiResponse({ isLoading: false, isSuccess: false, isError: false });
    setReset(true);
  }
  
  // useDropzone state
  const { getRootProps, getInputProps } = useDropzone({
    accept: ['.csv'],
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: (receivedFiles) => {
      setFile(receivedFiles.map((file: File) => Object.assign(file)))
    }
  });
  // mutation for post mare lists
  const [uploadMareLists, response] = usePostMareListsMutation();
  // on Response set data
  useEffect(() => {
    if (response.isLoading && progressValue < 90) {
      setProgressValue(progressValue + 10)
    }
    if (response.isSuccess) {
      setProgressValue(100)
      setName("");
      setNameError("");
      setFile("");
    }
    setUiResponse(response)

  }, [response])

  // validate form
  const validateForm = () => {
    if (!file) setFileError("Please upload the CSV file.")
    else setFileError("");
  }
  // on change file
  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  // on name enter
  const handleOnNameEnter = (e: any) => {
    if (name.length === 0) setNameError("This is a required field.")
    else setNameError("");
  }
  // on file upload
  const uploadFile = async (e: any) => {
    e.preventDefault();
    validateForm();
    if (file && farmID) {
      formData.append('file', file[0] || file);
      formData.append('name', name);
      uploadMareLists([farmID, formData]);
    }
  };
  if (Reset) {
    setNameError("");
    setFileError("");
    setReset(false);
    if (!open) {
      setName("");
      setFile("");
      onClose();
      setUiResponse({ isLoading: false, isSuccess: false, isError: false });
    }
  }

  return (
    <StyledEngineProvider injectFirst>
      {/* form for upload mare lists */}
      <Box className='upload-mare-list'>
        {!uiResponse.isLoading && !uiResponse.isError && !uiResponse.isSuccess && <Box>
          <InputLabel>List Name</InputLabel>
          <TextField
            error={name.length == 0 && nameError ? true : false}
            fullWidth
            type='text'
            autoComplete='new-password'
            placeholder='Enter List Name'
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            onBlur={handleOnNameEnter}
          />
          {name.length == 0 && <p className='error-text'>{nameError}</p>}
          <Box className='draganddrop' {...getRootProps()} sx={{ padding: '10px', height: '290px' }}>
            <input {...getInputProps()} onChange={handleOnChange} />
            <i className='icon-Document-add' />
            <Typography variant='h6'>Drag and drop your CSV file here</Typography>
            <span>or <Link to='#'>upload a file </Link> from your computer</span>
          </Box>

          <Box className='download-mare-list-wrp'>
            <a href="/downloads/Maretemplate.csv" download >
              <CustomButton className="download-mare-list" sx={{ marginTop: { lg: '0', xs: '10px' } }}>
                <i className='icon-Download' />
                Download Mare List Template</CustomButton>
            </a>
          </Box>
          {!file && <p>{fileError}</p>}
          <CustomButton fullWidth className="lr-btn"
            disabled={name.length == 0 || !file}
            onClick={uploadFile}> Upload</CustomButton>
        </Box>}

        {/* on success, loading and Error */}
        {uiResponse.isLoading &&
          <Box className='upload-mare'>
            {file.name}
            <CustomRangeSlider
              className="rangeSliderFilter"
              value={progressValue}
              min={0}
              max={100}
            />
            <p>{progressValue}% Mares Uploaded</p>
          </Box>
        }

        {uiResponse.isSuccess &&
          <Box className='upload-mare'>
            <Box className="success-mare">
              <Typography variant='h4'>{file.name}</Typography>
              <i className='icon-Confirmed-24px' />
            </Box>
            <CustomRangeSlider
              className="rangeSliderFilter"
              value={progressValue}
              min={0}
              max={100}
            />
            <p>{progressValue}% Mares Successfully Uploaded</p>
          </Box>
        }
        
        {uiResponse.isError &&
          <Box className='upload-mare'>
            <Box className="success-mare">
              <Typography variant='h4'> {file.name}</Typography>
              <i className='icon-Incorrect' />
            </Box>
            <CustomRangeSlider
              className="rangeSliderFilter"
              value={progressValue}
              min={0}
              max={100}
            />
            <p className='mare-error'>Error - please review data and try again.</p>
          </Box>
        }
        {uiResponse.isLoading && <CustomButton fullWidth className="lr-btn" onClick={onClose} >Cancel</CustomButton>}
        {uiResponse.isSuccess && <CustomButton fullWidth className="lr-btn" onClick={closePopup}>Done</CustomButton>}
        {uiResponse.isError && <CustomButton fullWidth className="lr-btn" onClick={uploadFile}>Try Again</CustomButton>}

      </Box>
    </StyledEngineProvider>
  )
}

export default UploadMareLists