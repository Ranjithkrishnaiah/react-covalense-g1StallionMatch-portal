import { Stack } from '@mui/material';
import { LineChart } from 'src/components/chart/LineChart'
import GridWrapper from 'src/components/GridWrapper';
import * as Props from '../../../constants/farmDashboardConstant'
export default function StallionMatchActivity(props: any) {
  if (props.stallionMatchedActivityData) {
    return (
      <GridWrapper {...Props.stallionMatchActivityProps} showLinkBtn={true}>
        <div><LineChart filter={props.stateFilterForAnalytics} chartData={props.stallionMatchedActivityData} report={true} /></div>
      </GridWrapper>
    )
  } else {
    return (
      <GridWrapper {...Props.stallionMatchActivityProps} showLinkBtn={true}>
        <div className='no-graph-data'>No Graph Data</div>
      </GridWrapper>
    )
  }
}
