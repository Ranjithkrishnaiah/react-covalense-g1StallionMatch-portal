import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import {
  Typography,
} from '@mui/material';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function RadarChart(props: any) {
  ChartJS.defaults.font.family = 'Synthese-Book';
  ChartJS.defaults.font.size = 10;

  const data = props.data;
  const femaleData = data?.datasets[0]?.data
  const maleData = data?.datasets[1]?.data
  let highestValue = 0
  if (femaleData.length > 0 && maleData.length > 0) {
    const finalArray = femaleData.concat(maleData);
    highestValue = Math.max(...finalArray);
  }
  let stepSize = ((data?.datasets[0]?.data?.length > 0 && highestValue > 5)? Math.round(highestValue/5) : 1)
  const typeLabel = props.chartType === 'age' ? 'Age' : 'Distance';
  const options: any = {
    plugins: {
      legend: {
        position: 'bottom',
        display: false,
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 16,
            shape: 'square',
            color: '#161716',
          },
          color: '#161716',
          padding: 30,
          boxWidth: 55,
        },
      },
    },

    scales: {
      r: {
        ticks: {
          beginAtZero: true,
          stepSize: stepSize,
          textStrokeColor: 'rgb(54, 162, 235)',
          color: '#263238',
          backdropColor: 'white',
          backdropPadding: 5,
          boxshadow: '0px 4px 8px rgba(84, 110, 122, 0.24)',
          font: {
            size: 10,
            shape: 'square',
            color: '#263238',
          },
        },
        border: {
          display: true,
          borderColor: "red",

        },
        grid: {
          tickColor: '#B0B6AF',
          color: "#B0B6AF",
          tickLength: '20',
          tickWidth: '50px',
          // circular: false
        },
        pointLabels: {
          font: {
            size: 16,
          },
          color: '#626E60',
        },
      },
    },
    title: {
      display: true,
    },
    responsive: true,
  };
  return (
    <>
      <Radar options={options} data={data} />
      <Typography variant="h3" sx={{ textAlign: 'center' }} className="radarHeadings">
        {typeLabel}
      </Typography>
      <div className='radar-legend-wrapper'>
      {
        data.datasets.map((val: any, index:any) => {
          return (
            <div key = {index} className='radar-legend-body'>
              <div className='radar-legend'>
                <div className='redar-legend-left' style={{
                  background: val.backgroundColor,
                  border: 'border: 2.77549px solid #ED8AC5',
                }}>

                </div>
                <span className='redar-legend-right'>
                  {val.label}
                </span>
              </div>
            </div>
          )
        })
      }
</div>
    </>
  );
}
