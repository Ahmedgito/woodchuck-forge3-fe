'use client'
import { getNotifications } from '@/src/services/user'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { NOTIFICATION_TYPE } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { Button } from 'antd/es/radio'
import { Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useSocket } from '@/src/utils/context/socket-context'
import NotificationCard from './notificationCard'
import styles from './style.module.scss'
import { useLoader } from '@/src/utils/context/loader-context'

const { Title } = Typography

export default function Notifications() {
  const [notifications, setNotifications] = useState<NOTIFICATION_TYPE[]>()
  const triggerNotification = useTriggerNotification()
  const [pageNo, setPageNo] = useState(1)
  const [hasNextPage, setHasNextPage] = useState<boolean>()
  const { notificationReceived, setNotificationReceived } = useSocket() || {}
  const { setLoading } = useLoader()

  useEffect(() => {
    // notificationReceived && fetchNotifications()
  }, [notificationReceived])

  useEffect(() => {
    // fetchNotifications()
  }, [pageNo])

  const fetchNotifications = async () => {
    console.log('fetching notifications in notificaiotns')
    try {
      setLoading(true)
      const result = await getNotifications(pageNo)
      setNotifications(result.data.data.data)

      setHasNextPage(result.data.data.hasNextPage)
      if (hasNextPage) {
        setNotifications((prevNotification: any) => [
          ...prevNotification,
          ...result.data.data.data,
        ])
      } else {
        setNotifications(result.data.data.data)
      }
      setNotificationReceived && setNotificationReceived(false)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  const handlePagination = () => {
    if (hasNextPage) {
      setPageNo((prevPageNo) => prevPageNo + 1)
    } else {
      setPageNo(1)
    }
  }

  return (
    <>
      <section className="container white-area">
        <Title className="mt-0 mb-7">Notifications</Title>
        <div className={styles.scrollbar}>
          {notifications?.map((notification, index) => {
            return (
              <NotificationCard
                notification={notification}
                key={index}
                onRefresh={fetchNotifications}
              />
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Button type="link" onClick={handlePagination}>
            {hasNextPage ? MESSAGES.SHOW_MORE : MESSAGES.SHOW_LESS}
          </Button>
        </div>
      </section>
    </>
  )
}
