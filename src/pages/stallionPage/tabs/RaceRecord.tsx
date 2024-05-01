import { Container, Box, Grid, StyledEngineProvider, Typography, Stack } from '@mui/material';
import DataTable from '../../../components/Datatable/DataTable';
import { Constants } from '../../../constants';
import { useGetRaceRecordsQuery } from 'src/redux/splitEndpoints/getRaceRecords';
import { useEffect, useState } from 'react';
import { convertNumberToOrdinal } from 'src/utils/customFunctions';
import { transformResponse } from 'src/utils/FunctionHeap';
import { Spinner } from 'src/components/Spinner';
const { StallionPageConstants } = Constants;
type RaceRecordProps = {
  stallionId: string;
};
function RaceRecord({ stallionId }: RaceRecordProps) {
  const {
    data: raceRecords,
    isSuccess: isRaceRecordsSuccess,
    isLoading,
  } = useGetRaceRecordsQuery(stallionId);
  const [transformedSRaceRecordsData, setTransformedRaceRecordsData] = useState<any[]>([]);

  useEffect(() => {
    if (raceRecords) {
      if (isRaceRecordsSuccess && raceRecords?.raceRecords?.length > 0) {
        const transformedResponse = transformResponse(raceRecords?.raceRecords, 'STALLION_PAGE');
        setTransformedRaceRecordsData(transformedResponse);
      }
    }
  }, [raceRecords, isRaceRecordsSuccess]);
  if (isLoading) {
    return <Spinner />;
  }
   
  return (
    <>
      {raceRecords?.raceRecords?.length > 0 ? (
        <StyledEngineProvider injectFirst>
          <Box py={0} className="RaceRecordWrapper">
            <Container>
              <Typography variant="h3" sx={{ color: '#1D472E' }}>
                Race Record
              </Typography>
            </Container>
            <Stack className="RaceRecordTable" mt={2}>
              {raceRecords?.raceRecords && (
                <DataTable
                  {...StallionPageConstants.raceRecordTableProps}
                  data={transformedSRaceRecordsData}
                />
              )}
            </Stack>
            {raceRecords?.ages?.length > 0 &&
              raceRecords?.ages?.map((row: any, index: number) => (
                <Container maxWidth="lg" key={index}>
                  <Box className="SPracerecordCnt" mt={3}>
                    <Grid container>
                      <Grid item lg={12} xs={12}>
                        <Typography component="body">At {row}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  {raceRecords?.raceRecordsDescription?.map((drow: any, dindex: number) =>
                    drow?.map(
                      (dDataRow: any, dDataIndex: number) =>
                        dDataRow.age == row && (
                          <Box className="SPracerecordCnt" key={dDataIndex}>
                            <Grid container>
                              <Grid item lg={1} md={1} xs={2} pt={1}>
                                <Typography component="span">
                                  {convertNumberToOrdinal(dDataRow?.position)}
                                </Typography>
                              </Grid>
                              <Grid item lg={11} md={11} xs={10} pt={1}>
                                <Typography component="div">
                                  {dDataRow?.raceName} <b>({dDataRow?.stakeName})</b>,{' '}
                                  {dDataRow?.raceDistance}
                                  {dDataRow?.distanceCode}, {dDataRow?.venueName},{' '}
                                  {dDataRow?.description}.
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )
                    )
                  )}
                </Container>
              ))}
          </Box>
        </StyledEngineProvider>
      ) : (
        <StyledEngineProvider injectFirst>
          <Box py={0} className="RaceRecordWrapper">
            <Container>
              <Typography variant="h3" sx={{ color: '#1D472E' }}>
                Race Record
              </Typography>
            </Container>
            <Stack className="RaceRecordTable" mt={2}>
              <Box className='smp-no-data'>
                <Typography variant='h6'>No Races Found!</Typography>
              </Box>
            </Stack>
            </Box>
          </StyledEngineProvider>
      )}
    </>
  );
}

export default RaceRecord;
