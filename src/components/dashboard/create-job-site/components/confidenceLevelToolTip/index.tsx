import { Col, Row, Typography } from 'antd'
import React from 'react'
import styles from './style.module.scss'
import { ConfidenceIcon } from '@/src/components/appicons/icons'
import { CONFIDENCE_LEVEL_TOOLTIP } from '@/src/utils/constants/app-constants'
type Props = {}

const { Title, Text } = Typography
function ConfidenceLevelTooltip({}: Props) {
  return (
    <div className={styles.tooltip_body}>
      <Text className="font-inter">{CONFIDENCE_LEVEL_TOOLTIP.PARAGRAPH_1}</Text>
      <Text className="font-inter">{CONFIDENCE_LEVEL_TOOLTIP.PARAGRAPH_2}</Text>
      <Row>
        <Col span={8}>
          <ConfidenceIcon />
        </Col>
        <Col span={16}>
          <Row>
            <Col span={24}>
              <Text className="font-inter">
                {CONFIDENCE_LEVEL_TOOLTIP.NOTE_1}
              </Text>
            </Col>
            <Col span={24}>
              <Text className="font-inter">
                {CONFIDENCE_LEVEL_TOOLTIP.NOTE_2}
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default ConfidenceLevelTooltip
