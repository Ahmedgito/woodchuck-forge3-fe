'use client'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { ChartOptions } from 'chart.js'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { Months } from '@/src/utils/constants/app-constants'

interface GroupedBarChartProps {
  diverted: number[]
  refused: number[]
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  diverted,
  refused,
}) => {
  const data = {
    labels: Months,
    datasets: [
      {
        label: MESSAGES.DIVERTED,
        data: diverted,
        backgroundColor: ['rgba(162, 201, 0, 1)'],
        borderColor: ['rgba(162, 201, 0, 1)'],
        borderWidth: 0,
        borderRadius: 25,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
      {
        label: MESSAGES.REFUSED,
        data: refused,
        backgroundColor: ['rgba(255, 0, 0, 1)'],
        borderColor: ['rgba(255, 0, 0, 1)'],
        borderWidth: 0,
        borderRadius: 25,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'x',
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        display: true,
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return <Bar data={data} options={options} />
}
export default GroupedBarChart
