'use client'
import { Typography, Row, Button, Col } from 'antd'
import React from 'react'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import {
  MESSAGES,
  NOTIFICATION_STATUS,
} from '@/src/utils/constants/app-constants'
import { NOTIFICATION_TYPE } from '@/src/utils/constants/types'
interface DumpsterRequestNotificationProps {
  notification: NOTIFICATION_TYPE
  handleChange: (notification: NOTIFICATION_TYPE, status: string) => void
}

const DumpsterRequestNotification: React.FC<
  DumpsterRequestNotificationProps
> = ({ notification, handleChange }) => {
  const { Text } = Typography
  return (
    <Row className="notification-item">
      <Col span={24}>
        <Row>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <Text className="font-inter font-bold">
              {notification.message} {notification.data.sublocationName || ''}
            </Text>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Button
              icon={<CheckCircleFilled />}
              type="text"
              onClick={() =>
                handleChange(notification, NOTIFICATION_STATUS.ACCEPT)
              }
            >
              {MESSAGES.CONFIRM}
            </Button>
            <Button
              icon={<CloseCircleFilled />}
              type="text"
              onClick={() =>
                handleChange(notification, NOTIFICATION_STATUS.REJECT)
              }
            >
              {MESSAGES.DECLINE}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default DumpsterRequestNotification
