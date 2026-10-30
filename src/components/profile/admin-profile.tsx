'use client'
import './style.scss'
import { Button, Row, Typography, Col, Divider } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { Formik } from 'formik'
import InputComponent from '@/src/components/shared/input'
import { MESSAGES } from '@/utils/constants/app-constants'
import { useState, useEffect } from 'react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { ADMIN_PROFILE_FORM_SCHEMA } from '@/src/utils/constants/schemas'
import { editUserProfile } from '@/src/services/user'
import { getUser } from '@/src/services/user'
import { resetUserPassword } from '@/src/services/user'
import { formatNumber } from '@/src/utils/functions/formatNumber'
import { PHONE_MASK } from '@/src/utils/constants/form-constants'
import { useUser } from '@/src/utils/context/user-context'
import { useLoader } from '@/src/utils/context/loader-context'

export default function AdminProfile() {
  const { setLoading } = useLoader()
  const { Title, Text } = Typography
  const { setUpdateUser } = useUser()
  const triggerNotification = useTriggerNotification()
  const [editProfile, setEditProfile] = useState(false)
  const [user, setUser] = useState<any>()
  const [profileChanged, setProfileChanged] = useState(false)
  const onChange = async (payload: { [key: string]: string | number }) => {
    try {
      setLoading(true)
      await editUserProfile(user?.id, payload)
      setProfileChanged(!profileChanged)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.PROFILE_UPDATE_SUCCESS
      )
      setUpdateUser((prevState) => !prevState)
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
  }, [profileChanged])
  return (
    <section className="container white-area pt-5">
      <div className="form-section">
        <Title className="mt-0">{user?.name}</Title>
        <Formik
          initialValues={{
            name: user?.name,
            username: user?.username,
            phone: user?.phone,
            company: user?.company,
          }}
          validationSchema={ADMIN_PROFILE_FORM_SCHEMA}
          onSubmit={(values) => onChange(values)}
          enableReinitialize
        >
          {({
            errors,
            values,
            touched,
            handleBlur,
            handleChange,
            validateForm,
          }) => (
            <>
              <Row gutter={24} className="profile">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Title level={4} className="font-600 font-inter mt-0">
                    {MESSAGES.USER_INFO}
                  </Title>{' '}
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="text-right"
                >
                  {!editProfile && (
                    <Button
                      type="text"
                      onClick={() => setEditProfile(true)}
                      className="edit-icon font-inter font-medium"
                      icon={<i className="icon-pencil"></i>}
                    >
                      {MESSAGES.CHANGE}
                    </Button>
                  )}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Row>
                    <Col xs={8} sm={8} md={8} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.USER_NAME}
                      </Text>
                    </Col>
                    {!editProfile && (
                      <Col
                        xs={16}
                        sm={16}
                        md={16}
                        lg={12}
                        xl={12}
                        className="text-right"
                      >
                        <Text className="font-inter font-bold">
                          {user?.username}
                        </Text>
                      </Col>
                    )}
                    {editProfile && (
                      <Col
                        xs={16}
                        sm={16}
                        md={16}
                        lg={12}
                        xl={12}
                        className="text-right"
                      >
                        <InputComponent
                          name="username"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.username}
                          errors={errors}
                          touched={touched}
                        />
                      </Col>
                    )}
                    <Divider />
                  </Row>

                  <Row>
                    <Col xs={8} sm={8} md={8} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.EMAIL}
                      </Text>
                    </Col>
                    <Col
                      xs={16}
                      sm={16}
                      md={16}
                      lg={12}
                      xl={12}
                      className="text-right"
                    >
                      <Text className="font-inter font-bold">
                        {user?.email}
                      </Text>
                    </Col>
                    <Divider />
                  </Row>

                  <Row>
                    <Col xs={8} sm={8} md={8} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.PASSWORD}
                      </Text>
                    </Col>
                    <Col
                      xs={16}
                      sm={16}
                      md={16}
                      lg={12}
                      xl={12}
                      className="text-right"
                    >
                      <Button
                        type="text"
                        onClick={handleResetPassword}
                        className="edit-icon font-inter font-medium reset"
                        icon={<SyncOutlined />}
                      >
                        {MESSAGES.RESET_PASSWORD}
                      </Button>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Row className="admin-profile-responsive">
                    <Col xs={10} sm={10} md={10} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.DISPLAY_PROFILE_NAME}
                      </Text>
                    </Col>
                    <Col
                      xs={14}
                      sm={14}
                      md={14}
                      lg={12}
                      xl={12}
                      className="text-right"
                    >
                      {!editProfile && (
                        <Text className="font-inter font-bold">
                          {user?.name}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          errors={errors}
                          touched={touched}
                        />
                      )}
                    </Col>
                    <Divider />
                  </Row>

                  <Row>
                    <Col xs={8} sm={8} md={8} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.COMPANY}
                      </Text>
                    </Col>
                    <Col
                      xs={16}
                      sm={16}
                      md={16}
                      lg={12}
                      xl={12}
                      className="text-right"
                    >
                      <Text className="font-inter font-bold">
                        {user?.company}
                      </Text>
                    </Col>
                    <Divider />
                  </Row>

                  <Row>
                    <Col xs={8} sm={8} md={8} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.PHONE}
                      </Text>
                    </Col>
                    <Col
                      xs={16}
                      sm={16}
                      md={16}
                      lg={12}
                      xl={12}
                      className="text-right"
                    >
                      {!editProfile && (
                        <Text className="font-inter font-bold">
                          <a href={`tel:${user?.phone}`}>
                            {formatNumber(user?.phone)}
                          </a>
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="phone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phone}
                          errors={errors}
                          touched={touched}
                          mask={PHONE_MASK}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={24} className="mt-10">
                <Col span={24} className="text-right">
                  {editProfile && (
                    <Button
                      type="primary"
                      onClick={() => {
                        validateForm().then((errors) => {
                          if (Object.keys(errors).length === 0) {
                            onChange(values)
                            setEditProfile(false)
                          }
                        })
                      }}
                    >
                      {MESSAGES.SAVE_CHANGES}
                    </Button>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Formik>
      </div>
    </section>
  )
}
