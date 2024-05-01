import { Box, Grid, InputLabel, TextareaAutosize } from '@mui/material'
import React, { useState, forwardRef } from 'react';
import {
  usePatchStallionProfileOverviewMutation,
} from 'src/redux/splitEndpoints/PatchStallionDetailsByIdSplit';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import { Spinner } from 'src/components/Spinner';

type DescriptionProps = {
  prevData: any;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  next : () => void;
  submissionError: string
}
const Description = forwardRef<HTMLButtonElement | null, DescriptionProps>
(({ prevData, setSubmissionError, next, submissionError}, submitRef) =>{ 
  const { stallionDetails } : any = prevData; 
  const [count, setCount] = React.useState(stallionDetails?.overview?.length || 0);
  const [overview, setOverview] = useState(stallionDetails?.overview);
  const [uploadInProgress, setUploadInProgress] = useState<any>(false);
  const [postOverview, postResponse] = usePatchStallionProfileOverviewMutation();
  const MAX_LENGTH = 1180;
  
  React.useEffect(() => {
    if (postResponse.isSuccess) {
      next();
    }
  }, [postResponse])
  const handleChange = (e: any) => {
    prevData.setSetChanges(true);
    setOverview(e.target.value);
    setCount(e.target.value.length);
    // if(e.target.value.length) { setSubmissionError(''); } else { setSubmissionError('Overview is required'); }
  }
  const SendDescription = async() => {
    // if (overview?.trim().length === 0 || overview === null) {
    //   setSubmissionError('Overview is required');
    // }else {
      setUploadInProgress(true);
      try {
        const overviewDataResponse: any = await postOverview({ stallionId: stallionDetails.stallionId, overview: overview  });
        if (overviewDataResponse.error) {
          if (overviewDataResponse.error.status >= 400) {
            var obj = overviewDataResponse?.error?.data?.errors;
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const element = obj[key];
                setSubmissionError(element);
              }
            }
            setUploadInProgress(false);
            setTimeout(() => {
              setSubmissionError('');
            }, 1000);
          } else if (overviewDataResponse.error.status > 499) {
            setSubmissionError(
              'Internal Server Error'
            );
            setUploadInProgress(false);
          }
        } else if (overviewDataResponse.isSuccess) {
          setUploadInProgress(false);
          next();
        }
      } catch (error) {
        setSubmissionError(error);
      }
    // }
  }
      
  
  return (
      <Grid container sx={ { justifyContent: 'center' } } className='dialogPopup'>
        <Grid item xs={12} className="edit-st-form-bx" mt={2}>
          <Box className="overview-textarea">
            <InputLabel>Overview
              <HtmlTooltip
                 enterTouchDelay={0}
                 leaveTouchDelay={6000}
                className="CommonTooltip studfee-tooltip edit-tooltip" 
                  placement='bottom-start'
 
                title={
                  <React.Fragment>
                    {'A brief description of your stallion is proven to attract breeders. Include information such as prominent wins, pedigree highlights, type of progeny, etc.'}{' '}
                  </React.Fragment>
                }
              >
                <i className="icon-Info-circle" />
              </HtmlTooltip>
            </InputLabel>
            <TextareaAutosize
              minRows={12}
              placeholder="Please leave blank if you would like to use our free dynamic description generator."
              defaultValue={stallionDetails?.overview}
              onChange={handleChange}
              maxLength={ MAX_LENGTH }
            />
              <Grid container>
            <Grid item lg={3} sm={3} xs={12}>
            <p>{count}/{ MAX_LENGTH }</p>
            </Grid>
            <Grid item lg={9} sm={9} xs={12}>
            {submissionError && <p className='ov-error'>{submissionError}</p>}
            </Grid>
            </Grid>
            <button className='hide'  onClick = { SendDescription } ref = {submitRef}></button>
          </Box>
        </Grid>
        {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
      </Grid>
  )
})

export default Description