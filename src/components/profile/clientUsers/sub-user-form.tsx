'use client'
import { Button, Row, Typography, Col, Divider } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { MESSAGES } from '@/utils/constants/app-constants'
import { useState, useEffect } from 'react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { resetUserPassword } from '@/src/services/user'
import { formatNumber } from '@/src/utils/functions/formatNumber'
import { getUser } from '@/src/services/user'
import { useLoader } from '@/src/utils/context/loader-context'

export default function SubUserForm() {
  const { setLoading } = useLoader()
  const { Title, Text } = Typography
  const triggerNotification = useTriggerNotification()
  const [user, setUser] = useState<any>()

  const handleResetPassword = async () => {
    try {
      setLoading(true)
      await resetUserPassword(user.email)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.PASSWORD_RESET_SUCCESS
      )
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

  const getUserData = async () => {
    try {
      setLoading(true)
      const result = await getUser()
      setUser(result.data.data)
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

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <div className="form-section">
      <Row gutter={24} className="profile">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4} className="font-600 font-inter mt-10 mb-10">
            {MESSAGES.USER_INFO}
          </Title>

          {/* Full Name */}
          <Row>
            <Col xs={8} sm={8} md={8} lg={12} xl={12}>
              <Text className="font-inter font-medium">
                {MESSAGES.FULL_NAME}
              </Text>
            </Col>
            <Col xs={16} sm={16} md={16} lg={12} xl={12} className="text-right">
              <Text className="font-inter font-bold">{user?.username}</Text>
            </Col>
            <Divider />
          </Row>

          {/* Email */}
          <Row>
            <Col xs={8} sm={8} md={8} lg={12} xl={12}>
              <Text className="font-inter font-medium">{MESSAGES.EMAIL}</Text>
            </Col>
            <Col xs={16} sm={16} md={16} lg={12} xl={12} className="text-right">
              <Text className="font-inter font-bold">{user?.email}</Text>
            </Col>
            <Divider />
          </Row>

          {/* Password */}
          <Row>
            <Col xs={8} sm={8} md={8} lg={12} xl={12}>
              <Text className="font-inter font-medium">
                {MESSAGES.PASSWORD}
              </Text>
            </Col>
            <Col xs={16} sm={16} md={16} lg={12} xl={12} className="text-right">
              <Button
                type="text"
                onClick={handleResetPassword}
                className="edit-icon font-inter font-medium reset"
                icon={<SyncOutlined />}
              >
                {MESSAGES.RESET_PASSWORD}
              </Button>
            </Col>
            <Divider />
          </Row>

          {/* Phone Number */}
          <Row>
            <Col xs={8} sm={8} md={8} lg={12} xl={12}>
              <Text className="font-inter font-medium">{MESSAGES.PHONE}</Text>
            </Col>
            <Col xs={16} sm={16} md={16} lg={12} xl={12} className="text-right">
              <Text className="font-inter font-bold">
                <a href={`tel:${user?.phone}`}>{formatNumber(user?.phone)}</a>
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
