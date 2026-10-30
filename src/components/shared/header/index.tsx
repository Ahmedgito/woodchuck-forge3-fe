import './style.scss'
import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Col, Row, Typography, Dropdown, Space, Button, Switch } from 'antd'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { MESSAGES, ROLES } from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getNotifications } from '@/src/services/user'
import Link from 'next/link'
import { NOTIFICATION_TYPE } from '@/src/utils/constants/types'
import NotificationCard from '@/src/app/(app)/notifications/notificationCard'
import { useSocket } from '@/src/utils/context/socket-context'
import { useUser } from '@/src/utils/context/user-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { formatNumber } from '@/src/utils/functions/formatNumber'
import { useImpersonation } from '@/src/utils/hooks/useImpersonation'
import { useGenie } from '@/src/utils/context/genie-mode-context'
import { clearSessionCache } from '@/src/services'

// Wrapper to clear session cache before signing out
const handleSignOut = () => {
  clearSessionCache()
  signOut()
}

const adminItems: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href="/profile">{MESSAGES.VIEW_PROFILE}</Link>,
  },
  {
    key: '2',
    label: (
      <Link href="#" onClick={handleSignOut}>
        {MESSAGES.LOGOUT}
      </Link>
    ),
  },
]

const powerPlantItems: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Link href="#" onClick={handleSignOut}>
        {MESSAGES.LOGOUT}
      </Link>
    ),
  },
]

const commonItems: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href="/profile">{MESSAGES.MY_ACCOUNT}</Link>,
  },
  {
    key: '2',
    label: (
      <Link href="#" onClick={handleSignOut}>
        {MESSAGES.LOGOUT}
      </Link>
    ),
  },
]
const { Text } = Typography

const HeaderComponent = () => {
  const { data: session, status } = useSession()
  const admin = session?.role.name.toLowerCase() === ROLES.ADMIN
  const gc = session?.role.name.toLowerCase() === ROLES.GENERAL_CONTRACTOR
  const endClient =  session?.user.role.enum === ROLES.END_CLIENT
  const { user } = useUser()
  const isCmsUser = session?.role.enum === ROLES.CMS
  const { setNotificationReceived } = useSocket() || {}
  const { setLoading } = useLoader()
  const { stopImpersonating } = useImpersonation()

  const getAuthenticated = () => {
    return status === 'authenticated'
  }

  const [notifications, setNotifications] = useState<NOTIFICATION_TYPE[]>()
  const [isExitingImpersonation, setIsExitingImpersonation] = useState(false)
  const triggerNotification = useTriggerNotification()

  // useEffect(() => {
  //   notificationReceived && fetchNotifications()
  // }, [notificationReceived])

  // useEffect(() => {
  //   getAuthenticated() && admin && fetchNotifications()
  // }, [status, admin])

  const fetchNotifications = async () => {
    console.log('fetching notifications')
    try {
      setLoading(true)
      const result = await getNotifications(1, 5)
      setNotifications(result.data.data.data)
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
  const _getUnreadNotifications = () => {
    return notifications?.filter((notification) => !notification.isRead).length
  }

  const handleExitImpersonation = async () => {
    if (isExitingImpersonation) return // Prevent multiple clicks

    try {
      setIsExitingImpersonation(true)
      const result = await stopImpersonating()

      if (result.success) {
        triggerNotification(
          'success',
          'Success',
          'Successfully exited client view'
        )
      } else {
        triggerNotification(
          'error',
          'Error',
          result.error || 'Failed to exit client view'
        )
      }
    } catch (error) {
      console.error('Unexpected error during impersonation exit:', error)
      triggerNotification(
        'error',
        'Error',
        'An unexpected error occurred while exiting client view'
      )
    } finally {
      setIsExitingImpersonation(false)
    }
  }

  const getItemsByRole = () => {
    const isImpersonated = session?.impersonated

    switch (user?.role.enum) {
      case ROLES.ADMIN:
        return adminItems
      case ROLES.GENERAL_CONTRACTOR:
        return isImpersonated
          ? commonItems.filter((item) => item && item.key !== '2')
          : commonItems
      case ROLES.POWER_PLANT:
        return isImpersonated
          ? powerPlantItems.filter((item) => item && item.key !== '1')
          : powerPlantItems
      case ROLES.END_CLIENT:
        return isImpersonated
          ? commonItems.filter((item) => item && item.key !== '2')
          : commonItems
      case ROLES.MANUFACTURER:
        return isImpersonated
          ? commonItems.filter((item) => item && item.key !== '2')
          : commonItems
      case ROLES.OFFTAKE:
        return isImpersonated
          ? commonItems.filter((item) => item && item.key !== '2')
          : commonItems
      case ROLES.CMS:
        return isImpersonated
          ? commonItems.filter((item) => item && item.key !== '2')
          : commonItems
      default:
        return []
    }
  }

  const notificationItems: MenuProps['items'] = notifications
    ? notifications?.slice(0, 5).map((notification, index) => {
      return {
        key: index,
        label: (
          <NotificationCard
            notification={notification}
            key={index}
            onRefresh={fetchNotifications}
          />
        ),
      }
    })
    : []
  notificationItems.push({
    key: 6,
    label: (
      <Row className="text-center">
        <Col span={24}>
          <Link href="/notifications">{MESSAGES.SEE_ALL}</Link>
        </Col>
      </Row>
    ),
  })
  const { genie, toggle } = useGenie()
  return (
    <>
      <section className="container">
        <Row align={'middle'} style={{ width: '100%' }}>
          <Col xs={10} sm={11} md={6} lg={4} xl={4} className="flex items-center gap-2">
            <Link href="/" className="logo">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={112}
                height={30}
              />
            </Link>
          </Col>
          <Col
            xs={14}
            sm={13}
            md={18}
            lg={20}
            xl={20}
            className="for-mobile-impersonation"
          >
            <div className="header-right-wrapper">
              {getAuthenticated() && (
                <div className="genie-toggle">
                  <Typography.Text className="mr-3">Genie:</Typography.Text>
                  <Switch
                    checked={genie}
                    onChange={toggle}
                    checkedChildren={<span className="switch-text">ON</span>}
                    unCheckedChildren={
                      <span className="switch-text">OFF</span>
                    }
                  />
                </div>
              )}
              {session?.impersonated && (
                <div className="header-impersonation-center">
                  <div className="flex items-center">
                    <Typography.Text
                      title={`${MESSAGES.VIEWING_AS} ${session?.user?.name}.`}
                    >
                      {`${MESSAGES.VIEWING_AS} ${session?.user?.name}.`}
                    </Typography.Text>
                    <Button
                      onClick={handleExitImpersonation}
                      loading={isExitingImpersonation}
                      type="default"
                      disabled={isExitingImpersonation}
                    >
                     {isCmsUser ? MESSAGES.EXIT_CMS_VIEW : MESSAGES.EXIT_CLIENT_VIEW}
                    </Button>
                  </div>
                </div>
              )}
              {getAuthenticated() ? (
                <div className="flex header-right">
                  {admin && (
                    <Text>
                      <Link href="/settings">
                        <i className="icon-setting"></i>{' '}
                        <span className="text-resp">{MESSAGES.SETTINGS}</span>
                      </Link>
                    </Text>
                  )}
                  {gc && (
                    <Text>
                      <i className="icon-phone"></i>
                      <a href={`tel:${user?.phone}`}>
                        {formatNumber(user?.phone)}
                      </a>
                    </Text>
                  )}
                  <Dropdown menu={{ items: getItemsByRole() }}>
                    <Link href="#" onClick={(e) => e.preventDefault()}>
                      <i className="icon-user"></i>
                      <Space>
                        <span className="text-resp">{user?.name}</span>
                        <i className="icon-angle-down"></i>
                      </Space>
                    </Link>
                  </Dropdown>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default HeaderComponent
