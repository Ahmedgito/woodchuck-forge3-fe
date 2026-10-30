import { Col, Row, Typography, Image } from 'antd'
import React from 'react'
import styles from './style.module.scss'
import { WASTE_STREAM_CARD_TOOLTIP } from '@/src/utils/constants/app-constants'
import confidenceLevel1 from '../../../../../../public/images/thickness-1.png'
import confidenceLevel2 from '../../../../../../public/images/thickness-2.png'
import confidenceLevel3 from '../../../../../../public/images/thickness-3.png'
type Props = {}

const { Title, Text } = Typography
function WasteStreamCardTooltip({}: Props) {
  return (
    <div className={styles.tooltip_body}>
      <Title level={4}>{WASTE_STREAM_CARD_TOOLTIP.LEGEND}</Title>
      <Row>
        <Col span={8} className={styles.icon_container}>
          <Image
            alt="confidenceLevel1"
            src={confidenceLevel1.src}
            preview={false}
          />
        </Col>
        <Col span={16}>
          <Text className="font-inter">
            {WASTE_STREAM_CARD_TOOLTIP.VARIATION_1}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col span={8} className={styles.icon_container}>
          <Image
            alt="confidenceLevel2"
            src={confidenceLevel2.src}
            preview={false}
          />
        </Col>
        <Col span={16}>
          <Text className="font-inter">
            {WASTE_STREAM_CARD_TOOLTIP.VARIATION_2}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col span={8} className={styles.icon_container}>
          <Image
            alt="confidenceLevel3"
            src={confidenceLevel3.src}
            preview={false}
          />
        </Col>
        <Col span={16}>
          <Text className="font-inter">
            {WASTE_STREAM_CARD_TOOLTIP.VARIATION_3}
          </Text>
        </Col>
      </Row>
    </div>
  )
}

export default WasteStreamCardTooltip
