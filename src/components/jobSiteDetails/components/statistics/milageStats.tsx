import { Col, Typography, Row } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'

interface MilageStatsProps {
  mileage_stats1: number | undefined
  mileage_stats2: number | undefined
  mileage_stats3: number | undefined
  mileage_stats4: number | undefined
}
const MilageStats: React.FC<MilageStatsProps> = ({
  mileage_stats1,
  mileage_stats2,
  mileage_stats3,
  mileage_stats4,
}) => {
  const { Title, Text } = Typography
  return (
    <>
      <Title level={5} className="font-600">
        {MESSAGES.MILAGE_STATS}
      </Title>
      <Row className="mt-5 milage">
        <Col xs={24} sm={24} md={5} lg={5} xl={5}>
          <div className="image1"></div>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <div className="arrow mt-9"></div>
          <Title className="mt-0 mb-0">
            {mileage_stats1?.toLocaleString() || 0} <span>{MESSAGES.MI}</span>
          </Title>
          <Text className="font-inter font-medium">
            {mileage_stats3?.toLocaleString() || 0} <span>{MESSAGES.MI_T}</span>
          </Text>
        </Col>
        <Col
          xs={0}
          sm={0}
          md={2}
          lg={2}
          xl={2}
          style={{ textAlign: 'center' }}
          className="mt-11"
        >
          <i className="icon-leaf-2"></i>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="order2">
          <div className="arrow mt-9"></div>
          <Title className="mt-0 mb-0">
            {mileage_stats2?.toLocaleString() || 0} <span>{MESSAGES.MI}</span>
          </Title>
          <Text className="font-inter font-medium">
            {mileage_stats4?.toLocaleString() || 0} <span>{MESSAGES.MI_T}</span>
          </Text>
        </Col>
        <Col xs={24} sm={24} md={5} lg={5} xl={5} className="order1">
          <div className="image3 mt-3"></div>
        </Col>
      </Row>
    </>
  )
}
export default MilageStats
