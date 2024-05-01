import { Box, Grid, InputLabel, TextareaAutosize, Stack } from '@mui/material';
import React, { forwardRef, useState } from 'react';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import { Spinner } from 'src/components/Spinner';
import { usePatchFarmProfileOverviewMutation } from 'src/redux/splitEndpoints/PatchFarmDetailsByIdSplit';

type DescriptionProps = {
  prevData: any;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  next: () => void;
  submissionError: string
}
const FarmDescription = forwardRef<HTMLButtonElement | null, DescriptionProps>
  (({ prevData, setSubmissionError, next, submissionError }, submitRef) => {
    const { farmDetails } = prevData;
    const [count, setCount] = React.useState(farmDetails?.overview?.length);
    const [overview, setOverview] = useState(farmDetails?.overview);
    const [postOverview, postResponse] = usePatchFarmProfileOverviewMutation();
    const [uploadInProgress, setUploadInProgress] = useState<any>(false);
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
      // if (e.target.value.length) { setSubmissionError(''); } else { setSubmissionError('Overview is required'); }
    }
    const SendFarmDescription = async () => {
      // if (overview?.trim().length === 0 || overview === null) {
      //   setSubmissionError('Overview is required');
      //   setTimeout(() => {
      //     setSubmissionError('');
      //   }, 1000);
      // } else {
        setUploadInProgress(true);
        try {
          const overviewDataResponse: any = await postOverview({ farmId: farmDetails.farmId, overview });
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
      <Grid container sx={{ justifyContent: 'center' }} className='dialogPopup'>
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
                    {'A brief description of your farm and the services you provide. Some ideas may include information on founders, managers, stud success stories and the services you provide.'}{' '}
                  </React.Fragment>
                }
              >
                <i className="icon-Info-circle" />
              </HtmlTooltip>
            </InputLabel>
            <TextareaAutosize
              minRows={7}
              placeholder="Minimum 3 rows"
              defaultValue={overview}
              onChange={handleChange}
              maxLength={MAX_LENGTH}
            />
            <Grid container>
              <Grid item lg={6} sm={6} xs={12}>
                <p>{count}/{MAX_LENGTH}</p>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                {submissionError && <p className='ov-error'>{submissionError}</p>}
              </Grid>
            </Grid>
          </Box>
          <button className='hide' onClick={SendFarmDescription} ref={submitRef}></button>
        </Grid>
        {uploadInProgress ? (<Box className="spin-load"><Spinner /></Box>) : ''}
      </Grid>
    )
  })

export default FarmDescription