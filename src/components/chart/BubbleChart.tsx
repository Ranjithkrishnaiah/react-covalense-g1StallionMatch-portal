import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import "./App.css";
import { toPascalCase } from 'src/utils/customFunctions';
  
export function BubbleChart(aptitudeProfileData: any) {
  ChartJS.register(LinearScale, PointElement,CategoryScale, Tooltip, Legend);
   
  const xAxisLabels: any = aptitudeProfileData.aptitudeXAxisLabels;
  const yAxisLabels: any = aptitudeProfileData.aptitudeYAxisLabels;
  const datasets: any = aptitudeProfileData.aptitudeDatasets;

  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.font.family = 'Synthese-Book';
  // X-axis values that should have bold vertical lines
  const selectedXValues = [0, 4, 8, 12, 16, 20];
  const options: any = {
    type: 'bubble',
    plugins: {
      legend: {
        display: false,
        
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label: string }; raw: { stake: string } }) => {
            return toPascalCase(context.dataset.label) + ' - ' + context.raw.stake;
          },
        labelTextColor: function() {
            return '#161716';
        },
        lineHeight: function() {
          return 4;
        }
      
        
        },
        displayColors:false,
        backgroundColor: '#ffffff',
        padding:'16',
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        titleFont: {
          size: 16, // Set the font size of the tooltip title
        },
        bodyFont: {
          size: 14, // Set the font size of the tooltip content
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio:1|1,
    title: {
      display: true,
      text: 'Aptitude Profile',
    },
    scales: {
      y: {
        type: 'category',
        labels: yAxisLabels,
        grid: {
          borderColor: "#B0B6AF",          
          // borderDashOffset: 2,
        },
        ticks: {
          font: {
            size: 14,
          }
        }
      },
      x: {
        type: 'category',
        labels: xAxisLabels,
        grid: {
          borderColor: "#B0B6AF",
          color: (context: { tick: { value: number; }; }) => (selectedXValues.includes(context.tick.value) ? 'rgba(176, 182, 175, 1)' : 'rgba(0, 0, 0, 0.1)'),
          lineWidth: (context: { tick: { value: number; }; }) => (selectedXValues.includes(context.tick.value) ? 2 : 1),
        },
        ticks: {
          callback: function(val:any, index:any, ticks: any) {
            let label = xAxisLabels[val].split(' ');
            label.join('\n');
            return index % 4 === 0 ? label : '';
          },
          font: {
            size: 14,
          },
        }
      },
    },
  };
  const data = {
    animation: {
      duration: 10,
    },
    datasets: datasets,
  };
  
  return (
    <div className='bubble-Wrapper' style={{position: "relative"}}>
      <Bubble options={options} data={data}/> </div>
  );
}
