import React from 'react'
import { Progress } from 'antd'

const CustomProgress = ({
  percent,
  threshold = 100,
}: {
  percent: number
  threshold?: number
}) => {
  return (
    <Progress
      percent={percent > 100 ? 100 : percent} // Limit the progress to 100 for the bar
      status={percent > threshold ? 'exception' : 'normal'} // Change the color to red when percent > 100
      format={() => `${percent}%`} // Show the actual percentage value
    />
  )
}

export default CustomProgress
