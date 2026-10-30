import { Typography } from 'antd'
import React from 'react'

type Props = {
  label: string
  value: string
}

const { Text, Title } = Typography

function ReadOnlyField({ label, value }: Props) {
  return (
    <div className="flex flex-col">
      <Text className="font-medium text-uppercase">{label}</Text>
      <Title level={5} className="sub-head">
        {value}
      </Title>
    </div>
  )
}

export default ReadOnlyField
