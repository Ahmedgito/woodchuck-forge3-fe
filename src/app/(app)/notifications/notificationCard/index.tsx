import React from 'react'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { NOTIFICATION_TYPE } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { openJobSiteInNewTab } from '@/src/utils/functions/jobsiteInNewTab'
import { Button, Col, Row, Typography } from 'antd'
import styles from './style.module.scss'

const { Text } = Typography

export default function NotificationCard({
  notification,
  onRefresh,
}: {
  notification: NOTIFICATION_TYPE
  onRefresh: () => void
}) {
  const triggerNotification = useTriggerNotification()

  const markReadNotification = async (notification: NOTIFICATION_TYPE) => {
    try {
      openJobSiteInNewTab(notification.data.jobSiteId)
      // if (!notification.isRead) {
      //   await readNotification(notification.id)
      // }
      onRefresh()
    } catch (err) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  return (
    <>
      <Row gutter={24} align={'middle'} className={styles.notifications}>
        <Col span={24} style={{ display: 'flex' }}>
          <div className={styles.dot}>
            {!notification.isRead && <span className={styles.unread}></span>}
          </div>
          <div className={styles.desc}>
            <Text className="font-inter font-medium prim-color">
              {notification.title}
            </Text>
            <Text className="font-inter font-medium">
              <i className="icon-map-marker"></i>{' '}
              {notification.data.jobSiteName}
            </Text>
          </div>
        </Col>
        <Col span={24} className="text-right">
          <Button
            className="font-inter font-bold"
            type="link"
            onClick={() => markReadNotification(notification)}
          >
            {MESSAGES.VIEW_JOB_SITE} <i className="icon-angle-right"></i>
          </Button>
        </Col>
      </Row>
    </>
  )
}
