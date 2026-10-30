'use client'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { Typography } from 'antd'

const { Text } = Typography

interface Props {
  message?: string
}

const EmptyData: React.FC<Props> = ({
  message = MESSAGES.NO_RECORDS_FOUND,
}) => {
  return (
    // <Row>
    //   <Col xl={24} lg={24} md={24} sm={24} xs={24} className="my-3">

    //   </Col>
    // </Row>

    <div className="pa-3 w-full empty-data">
      <Text>{message}</Text>
    </div>
  )
}
export default EmptyData
