import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import { MESSAGES } from '@/src/utils/constants/app-constants'

// Register necessary elements
Chart.register(ArcElement, Tooltip, Legend)

interface DoughnutChartProps {
  diverted: number | undefined
  refused: number | undefined
  customOptions?: object | undefined | null
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  diverted,
  refused,
  customOptions,
}) => {
  const [chartOptions, setChartOptions] = useState<ChartOptions<'doughnut'>>({})

  const updateOptions = () => {
    const width = window.innerWidth
    let newOptions: ChartOptions<'doughnut'> = {
      cutout: '40%', // Adjusting for Chart.js v3+ which uses percentages for cutout
      radius: '50%',
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: function ({ formattedValue }) {
              return `${formattedValue}%`
            },
          },
        },
      },
      ...customOptions,
    }

    if (width < 600) {
      newOptions = {
        ...newOptions,
        cutout: '70%',
        radius: '100%',
      }
    } else if (width >= 600 && width < 900) {
      newOptions = {
        ...newOptions,
        cutout: '70%',
        radius: '100%',
      }
    } else if (width >= 900 && width < 1280) {
      newOptions = {
        ...newOptions,
        cutout: '70%',
        radius: '100%',
      }
    }

    setChartOptions(newOptions)
  }

  useEffect(() => {
    updateOptions()
    window.addEventListener('resize', updateOptions)

    return () => {
      window.removeEventListener('resize', updateOptions)
    }
  }, [customOptions])

  const data = {
    labels: ['Diverted', 'Refused'],
    datasets: [
      {
        data: [diverted, refused],
        backgroundColor: ['#338335', '#CBCBCB'],
        borderColor: ['rgb(255 255 255)', 'rgb(255 255 255)'],
        borderWidth: [6, 3],
        borderRadius: 6,
      },
    ],
  }

  return (
    <>
      {diverted || refused ? (
        <div className="chart-icon">
          <div className="doughnut-mid-content">
            <span className="percent-txt">{diverted}%</span>
            <span className="sub-txt">{MESSAGES.WOOD_WASTE_DIVERTED}</span>
          </div>
          <Doughnut
            className="doughnut-chart"
            data={data}
            options={chartOptions}
          />
        </div>
      ) : (
        <div className="empty-doughnut"></div>
      )}
    </>
  )
}

export default DoughnutChart
