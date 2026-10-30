'use client'
import './style.scss'
import { Button, Row, Typography, Col, Divider } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { Formik } from 'formik'
import InputComponent from '@/src/components/shared/input'
import { MESSAGES } from '@/utils/constants/app-constants'
import { useState, useEffect } from 'react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { CLIENT_PROFILE_FORM_SCHEMA } from '@/src/utils/constants/schemas'
import { resetUserPassword } from '@/src/services/user'
import { formatNumber } from '@/src/utils/functions/formatNumber'
import { getClientProfile } from '@/src/services/user'
import { getUser } from '@/src/services/user'
import { PHONE_MASK } from '@/src/utils/constants/form-constants'
import { useLoader } from '@/src/utils/context/loader-context'
import { updateClient } from '@/src/services/global'
import SecondaryButton from '@/src/components/common/secondaryButton'

export default function ClientProfile({
  clientId,
  canEdit,
  onRefresh,
}: {
  clientId: number | undefined | null
  canEdit: boolean
  onRefresh?: () => void
}) {
  const { setLoading } = useLoader()
  const { Title, Text } = Typography
  const triggerNotification = useTriggerNotification()
  const [editProfile, setEditProfile] = useState(false)
  const [user, setUser] = useState<any>()
  const [profileChanged, setProfileChanged] = useState(false)
  const [initialEmail, setInitialEmail] = useState('')

  const onChange = async (payload: { [key: string]: string | number }) => {
    try {
      setLoading(true)
      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      const email = formData.get('email') as string
      if (email === initialEmail) {
        formData.delete('email')
      }
      await updateClient(user?.id, formData)
      setProfileChanged(!profileChanged)
      onRefresh?.()
      console.log('refreshed')
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.PROFILE_UPDATE_SUCCESS
      )
      setLoading(false)
    } catch (err: any) {
      console.log('🚀 ~ onChange ~ err:', err)
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        err?.response?.data?.errors[0] || MESSAGES.SOMETHING_WENT_WRONG
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
      const result = await (canEdit ? getClientProfile(clientId) : getUser())
      setUser(result.data.data)
      setInitialEmail(result.data.data.email ?? '')
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
    <div className="form-section">
      <Formik
        initialValues={{
          name: user?.name || '',
          username: user?.username || '',
          email: user?.email || '',
          phone: user?.phone || '',
          company: user?.company || '',
          billing_details_name: user?.billing_details_name || '',
          billing_details_street: user?.billing_details_street || '',
          billing_details_city: user?.billing_details_city || '',
          billing_details_state: user?.billing_details_state || '',
          billing_details_zipcode: user?.billing_details_zipcode || '',
          billing_details_country: user?.billing_details_country || '',
          photo: user?.photo || '',
        }}
        validationSchema={CLIENT_PROFILE_FORM_SCHEMA}
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
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Title level={4} className="font-600 font-inter mt-10 mb-10">
                  {MESSAGES.USER_INFO}
                </Title>{' '}
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
                        {user?.email}
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
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
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
                  <Divider />
                </Row>
                <Row>
                  <Col xs={8} sm={8} md={8} lg={12} xl={12}>
                    <Text className="font-inter font-medium">
                      {MESSAGES.DISPLAY_PROFILE_NAME}
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
                        {user?.company}
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
                        name="company"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.company}
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
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                        mask={PHONE_MASK}
                      />
                    )}
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Title
                    level={4}
                    className="font-600 font-inter mt-10 mb-10 for-spacebtw"
                  >
                    {MESSAGES.BILLING_ADDRESS}
                    {!editProfile && canEdit && (
                      <Button
                        type="text"
                        onClick={() => setEditProfile(true)}
                        className="edit-icon font-inter font-medium"
                        icon={<i className="icon-pencil"></i>}
                      >
                        {MESSAGES.CHANGE}
                      </Button>
                    )}
                  </Title>{' '}
                  <Row className="admin-profile-responsive">
                    <Col xs={10} sm={10} md={10} lg={12} xl={12}>
                      <Text className="font-inter font-medium">
                        {MESSAGES.NAME_OR_COMPANY_NAME}
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
                          {user?.billing_details_name}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="billing_details_name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.billing_details_name}
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
                        {MESSAGES.STREET}
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
                          {user?.billing_details_street}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="billing_details_street"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.billing_details_street}
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
                        {MESSAGES.CITY}
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
                          {user?.billing_details_city}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="billing_details_city"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.billing_details_city}
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
                        {MESSAGES.STATE}
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
                          {user?.billing_details_state}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="billing_details_state"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.billing_details_state}
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
                        {MESSAGES.ZIP}
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
                          {user?.billing_details_zipcode}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="billing_details_zipcode"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.billing_details_zipcode}
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
                        {MESSAGES.COUNTRY}
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
                          {user?.billing_details_country}
                        </Text>
                      )}
                      {editProfile && (
                        <InputComponent
                          name="billing_details_country"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.billing_details_country}
                          errors={errors}
                          touched={touched}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
            </Row>

            <Row gutter={24} className="mt-10">
              <Col span={24} className="text-right">
                {editProfile && (
                  <SecondaryButton
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
                  </SecondaryButton>
                )}
              </Col>
            </Row>
          </>
        )}
      </Formik>
    </div>
  )
}
