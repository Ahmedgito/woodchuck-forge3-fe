import { Col, Row, Typography } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import toDecimal from '@/src/utils/functions/decimalConversion'

interface CollectionStatsProps {
  total_collected: number
  total_recycled: number
  total_refused: number
  energy_generated: number
}

export default function CollectionStats({
  props,
}: {
  props: CollectionStatsProps | undefined
}) {
  const { Title, Text } = Typography
  return (
    <>
      <Title level={5} className="font-600">
        {MESSAGES.COLLECTION_STATS}
      </Title>

      <Row className="mt-5">
        <Col xs={12} sm={12} md={7} lg={7} xl={7}>
          <div className="image1"></div>
          <Title className="mb-0 mt-0">
            {toDecimal(props?.total_collected) || 0} <span>t</span>
          </Title>
          <Text className="font-medium font-inter">
            {MESSAGES.TOTAL_COLLECTED}
          </Text>
        </Col>

        <Col xs={12} sm={12} md={7} lg={7} xl={7}>
          <div className="image2 mt-3"></div>
          <Title className="mb-0 mt-0">
            {toDecimal(props?.total_recycled) || 0} <span>t</span>
          </Title>
          <Text className="font-medium font-inter">
            {MESSAGES.TOTAL_RECYCLED}
          </Text>
          <div className="red">
            <Title className="mb-0">
              {toDecimal(props?.total_refused) || 0} <span>t</span>
            </Title>
            <Text>{MESSAGES.TOTAL_REFUSED}</Text>
          </div>
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} xl={10}>
          <div className="image3 mt-3"></div>
          <Text className="font-medium font-inter">
            {MESSAGES.ENERGY_GENERATED}
          </Text>
          <Title level={2} className="mt-0">
            {props?.energy_generated.toLocaleString() || 0} {MESSAGES.HOMES}
          </Title>
        </Col>
      </Row>
    </>
  )
}
