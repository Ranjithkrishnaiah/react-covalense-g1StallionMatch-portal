import { Container, Grid, Stack, Typography } from '@mui/material'
import GridWrapper from 'src/components/GridWrapper'
import { useGetFarmStallionAnalyticsQuery } from 'src/redux/splitEndpoints/getFarmStallionAnalyticsSplit'
import { toPascalCase } from 'src/utils/customFunctions';
import './Analytics.css'


export default function Analytics(props: any) {
  let obj = { ...props.stateFilterForAnalytics, farmId: props.farmId, order: 'ASC' }
  const { data: analyticsData } = useGetFarmStallionAnalyticsQuery(obj);
  const DashboardGridProps = {
    title: "Analytics",
  }
  return (
    <>
      <GridWrapper {...DashboardGridProps}>
        {/* Farm Analytics List */}
        <Container maxWidth='lg' className='analytics'>
          <Grid container lg={12} xs={12} spacing={3}>
            {analyticsData && analyticsData?.map((v: any, i: number) => {
              return (
                <Grid item lg={6} sm={6} xs={12} className='analyticsList' key={i}>
                  <Typography variant='h5' sx={{ fontFamily: 'Synthese-Book' }}>{toPascalCase(v.KPI)}</Typography>
                  <Stack direction='row' sx={{ alignItems: 'baseline' }}>
                    <Typography component='div'>{v.KPI == 'Farm Page Views' || v.KPI == 'Stallion Profile Views' ? v.CurrentValue : toPascalCase(v.CurrentName)}</Typography>
                    <Typography component='span' className={`key-statics-arrow ${v.Diff === 0 ? 'arrowUpBlock' : v.Diff > 0 ? 'arrowUpBlock' : 'arrowDownBlock'}`}>{v.Diff === 0 ? '' : v.Diff > 0 ? <i className='icon-Arrow-up' /> : <i className='icon-Arrow-down' />}  {v.KPI == 'Farm Page Views' || v.KPI == 'Stallion Profile Views' ? Math.abs(v.Diff) > 0 && Math.abs(v.Diff) : Math.abs(v.CurrentValue) > 0 && Math.abs(v.CurrentValue)} </Typography>
                  </Stack>
                </Grid>
              )
            })}
          </Grid>
        </Container>
        {/* End Farm Analytics List */}
      </GridWrapper>

    </>
  )
}
