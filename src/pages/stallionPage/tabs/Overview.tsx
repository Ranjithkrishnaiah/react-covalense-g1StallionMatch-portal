import { Container, Grid, StyledEngineProvider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Spinner } from 'src/components/Spinner';
import { useStallionOverviewQuery } from 'src/redux/splitEndpoints/getStallionOverview';
import { convertNumberToOrdinal, toPascalCase, toTitleCase } from 'src/utils/customFunctions';

function Overview(props: any) {
  const {
    formId,
    horseName,
    yearToStud,
    yob,
    dob,
    height,
    overview,
    dynamicOverview,
    colourId,
    colourName,
    wins,
  } = props;

  const [dynamicText, setDynamicText] = useState('');
  const [dynamicText1, setDynamicText1] = useState('');
  const [dynamicText2, setDynamicText2] = useState('');
  const [dynamicText3, setDynamicText3] = useState('');
  const [dynamicText4, setDynamicText4] = useState('');
  const [dynamicTextNoData, setDynamicTextNoData] = useState('');

  let winData: any = '';
  wins.map((value: any, index: number) => {
    winData += convertNumberToOrdinal(value.position);
    winData += ` ${value.raceName}`;
    winData += `(${value.stake}) ${wins.length - 1 != index ? ' - ' : ''}`;
  });
  const {
    data: dynamicOverviewData,
    isLoading,
    isSuccess: isOverviewDataSuccess,
    isFetching,
  } = useStallionOverviewQuery(props?.stallionId, { skip: overview });
  

  useEffect(() => {
    if (
      dynamicOverviewData?.stallionName &&
      dynamicOverviewData?.stallionAGE &&
      colourName &&
      dynamicOverviewData?.farmName &&
      dynamicOverviewData?.stallionCountryName &&
      dynamicOverviewData?.stallionSireName &&
      dynamicOverviewData?.stallionDamCOB &&
      dynamicOverviewData?.stallionDamName
    ) {
      setDynamicText1('sentence1Exists');
    } else {
      setDynamicText1('sentence1NotExists');
    }

    if (
      dynamicOverviewData?.stallionName &&
      dynamicOverviewData?.smallestDistance &&
      dynamicOverviewData?.longestDistance &&
      dynamicOverviewData?.progenyAgeAtWin
    ) {
     
      setDynamicText2('sentence2Exists');
    } else {
      setDynamicText2('sentence2NotExists');
    }

    if (
      dynamicOverviewData?.bestProgeny1Name &&
      dynamicOverviewData?.bestProgeny2Name &&
      dynamicOverviewData?.bestProgeny3Name &&
      dynamicOverviewData?.bestStakeRaceName &&
      dynamicOverviewData?.bestStakeRaceYearWon
    ) {
      setDynamicText3('sentence3Exists');
    } else {
      setDynamicText3('sentence3NotExists');
    }

    if (
      dynamicOverviewData?.stallionName &&
      dynamicOverviewData?.broodmareSire1 &&
      dynamicOverviewData?.broodmareSire2 &&
      dynamicOverviewData?.broodmareSire3 &&
      dynamicOverviewData?.broodmareSire4
    ) {
      setDynamicText4('sentence4Exists');
    } else {
      setDynamicText4('sentence4NotExists');
    }
  }, [dynamicOverviewData, isFetching]);

  useEffect(() => {
    if (
      dynamicText1 === 'sentence1NotExists' &&
      dynamicText2 === 'sentence2NotExists' &&
      dynamicText3 === 'sentence3NotExists' &&
      dynamicText4 === 'sentence4NotExists'
    ) {
      setDynamicTextNoData('No data found.');
    } else {
      setDynamicTextNoData('');
    }
  }, [
    dynamicText1,
    dynamicText2,
    dynamicText3,
    dynamicText4,
    dynamicTextNoData,
    dynamicOverviewData,
    isFetching,
  ]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Container maxWidth="lg">
        <Grid container>
          <Grid lg={4} sm={4} xs={12}>
            <Box
              p={3}
              sx={{ background: '#F4F1EF', borderRadius: '8px' }}
              className="stallionPage-Left"
            >
              <Box pb={2} className="stallionOverview-Item">
                <Typography variant="subtitle1" pb={1}>
                  Year of Birth
                </Typography>
                <Typography variant="body2">
                  {yob ? yob : 'NA'}
                </Typography>
              </Box>
              <Box pb={2} className="stallionOverview-Item">
                <Typography variant="subtitle1" pb={1}>
                  Height
                </Typography>
                <Typography variant="body2">{height ? `${height} hh` : 'NA'}</Typography>
              </Box>
              <Box pb={2} className="stallionOverview-Item">
                <Typography variant="subtitle1" pb={1}>
                  Colour
                </Typography>
                <Typography variant="body2">{colourName ? colourName : 'NA'}</Typography>
              </Box>
              <Box pb={2} className="stallionOverview-Item">
                <Typography variant="subtitle1" pb={1}>
                  Year to Stud
                </Typography>
                <Typography variant="body2">{yearToStud ? yearToStud : 'NA'}</Typography>
              </Box>
              <Box className="stallionOverview-Item">
                <Typography variant="subtitle1" pb={1}>
                  Wins
                </Typography>
                <Typography variant="body2">
                  {winData ? winData : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid lg={8} sm={8} xs={12}>
            <Box pl={4} className="overviewLeftText">
              <Typography variant="body2" pb={3} sx={{ color: '#161716' }}>
                {overview ? (
                  overview
                ) : dynamicTextNoData !== 'No data found.' ? (
                  <>
                    {dynamicText1 == 'sentence1Exists' && (
                      <>
                        <Typography variant="body2">
                          {toTitleCase(dynamicOverviewData?.stallionName)} is a{' '}
                          {dynamicOverviewData?.stallionAGE} year old {colourName.toLowerCase()}{' '}
                          stallion currently standing at{' '}
                          {toTitleCase(dynamicOverviewData?.farmName)} in{' '}
                          {dynamicOverviewData?.stallionCountryName}. He is by{' '}
                          {dynamicOverviewData?.sireStatus}{' '}
                          {toTitleCase(dynamicOverviewData?.stallionSireName)} and out of{' '}
                          {toTitleCase(dynamicOverviewData?.stallionDamCOB)} broodmare{' '}
                          {toTitleCase(dynamicOverviewData?.stallionDamName)}.
                        </Typography>
                        <br />
                      </>
                    )}

                    {dynamicText2 == 'sentence2Exists' && (
                      <>
                        <Typography variant="body2">
                          {toTitleCase(dynamicOverviewData?.stallionName)}’s pedigree has an
                          distance profile of being between{' '}
                          {toTitleCase(dynamicOverviewData?.smallestDistance)} to{' '}
                          {toTitleCase(dynamicOverviewData?.longestDistance)} with the largest
                          proporation of his winners being{' '}
                          {toTitleCase(dynamicOverviewData?.progenyAgeAtWin)} years old.
                        </Typography>
                        <br />
                      </>
                    )}

                    {dynamicText3 == 'sentence3Exists' && (
                      <>
                        <Typography variant="body2">
                          His best-performing progeny include{' '}
                          {dynamicOverviewData?.bestProgeny1Name},{' '}
                          {dynamicOverviewData?.bestProgeny2Name} and{' '}
                          {dynamicOverviewData?.bestProgeny3Name} with{' '}
                          {dynamicOverviewData?.bestProgeny1Name} winning the{' '}
                          {toTitleCase(dynamicOverviewData?.bestStakeRaceName)} in{' '}
                          {dynamicOverviewData?.bestStakeRaceYearWon}.
                        </Typography>
                        <br />
                      </>
                    )}

                    {dynamicText4 == 'sentence4Exists' && (
                      <>
                        <Typography variant="body2">
                          {toTitleCase(dynamicOverviewData?.stallionName)} currently nicks well with{' '}
                          {dynamicOverviewData?.broodmareSire1},{' '}
                          {dynamicOverviewData?.broodmareSire2},{' '}
                          {dynamicOverviewData?.broodmareSire3} and{' '}
                          {dynamicOverviewData?.broodmareSire4}.
                        </Typography>
                      </>
                    )}
                  </>
                ) : (
                  dynamicTextNoData
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Overview;
