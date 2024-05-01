import { Box } from '@mui/material'
import React from 'react'
import { LineChart } from '../../components/chart/LineChart'
function StallionActivityChart(props: any) {
  if (props.stallionMatchedActivityData) {
    return (
      <Box className='line-chart-report'>   <LineChart filter={props.stateFilterForAnalytics} chartData={props.stallionMatchedActivityData} report={true} /></Box>
    )
  } else {
    return (
      <div className='no-graph-data'>No Graph Data</div>
    )
  }
}

export default StallionActivityChart