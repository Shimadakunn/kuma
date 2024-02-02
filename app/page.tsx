"use client";
import { Label } from '@radix-ui/react-label';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 2',
      data: [0,10,-20,30,-40,50,-60],
      borderColor: '#d0f500',
      backgroundColor: '#d0f500',
    },
  ],
};

export default function Home() {
  return(
    <div className="w-full h-full flex items-center justify-center border border-red-500">
      <div className='flex items-center justify-center w-[50%] h-full border border-blue-500'>
        <div className='flex items-center justify-center space-x-12'>
          <div className='dashboard w-[10vw] aspect-[1/1.25] bg-primary flex items-center justify-center'>
            <Label className='tracking-tight'>Balance</Label>
          </div>
          <div className='dashboard w-[10vw] aspect-[1/1.25] bg-secondary flex items-center justify-center'>
            <Label className='tracking-tight text-black'>Balance</Label>
          </div>
          <div className='dashboard w-[10vw] aspect-[1/1.25]  bg-foreground flex items-center justify-center'>
            <Label className='tracking-tight text-black'>Balance</Label>
          </div>
        </div>
      </div>
      <div className='w-[50%] h-full border border-green-500 flex items-center justify-between flex-col'>
        <div>
          hello
        </div>
        <Line options={options} data={data}/>
      </div>
    </div>
  )
}
