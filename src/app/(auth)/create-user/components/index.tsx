'use client'
import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography, Steps, Divider } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { createUser } from '@/src/services/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import InputComponent from '@/src/components/shared/input'
import { REGISTRATION_INITIAL_VALUES } from '@/src/utils/constants/initial-states'
import { REGISTRATION_SCHEMA } from '@/src/utils/constants/schemas'
import {
  FORM_LABELS,
  BUTTONS,
  PHONE_MASK,
} from '@/src/utils/constants/form-constants'
import {
  MESSAGES,
  ROLES,
  ROLES_ENUM,
  ROLES_MAPPER,
} from '@/src/utils/constants/app-constants'
import styles from './style.module.scss'
import { getValueWithArticle } from '@/src/utils/functions/getValueWithArticle'

const { Step } = Steps

interface RegistrationFormValues {
  username: string
  email: string
  name: string
  company: string
  phone: string
  role: { id: number | null }
  billingCompanyName?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

const RegistrationFormComponent = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isBillingAddress, setIsBillingAddress] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  const router = useRouter()

  const steps = [
    { title: 'Account Type', content: 'Select your account type' },
    { title: 'Registration', content: 'Provide your details' },
  ]

  const handleSubmit = async (values: RegistrationFormValues) => {
    try {
      setLoading(true)
      const response = await createUser({
        ...values,
        role: { id: values.role.id },
      })
      if (response.status === 200 || response.data.status === 'success') {
        triggerNotification(
          'success',
          MESSAGES.SUCCESS,
          MESSAGES.REGISTRATION_SUCCESS,
          6
        )
        setTimeout(() => router.push('/login'), 1000)
      }
    } catch (error: any) {
      if (
        error.response?.status === 422 &&
        error.response?.data?.errors?.email
      ) {
        triggerNotification(
          'error',
          MESSAGES.REGISTRATION_FAILED,
          MESSAGES.EMAIL_EXISTS
        )
      } else {
        triggerNotification(
          'error',
          MESSAGES.REGISTRATION_FAILED,
          error.response?.data?.message || MESSAGES.REGISTRATION_FAILED
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const { Title, Text } = Typography

  return (
    <section className="container white-area">
      <div className="form-section width centered-form-container">
        <Steps current={currentStep} className="registration-steps">
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>

        <Formik
          initialValues={REGISTRATION_INITIAL_VALUES}
          validationSchema={REGISTRATION_SCHEMA}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            handleChange,
            handleBlur,
            resetForm,
          }) => {
            return (
              <Form>
                {currentStep === 0 && (
                  <div className={styles.step_content}>
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <Title style={{ textAlign: 'center' }}>
                          Select Account Type
                        </Title>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[24, 24]}>
                          {Object.entries(ROLES_ENUM)
                            .filter(
                              ([key]) =>
                                ![ROLES.ADMIN, ROLES.POWER_PLANT].includes(
                                  ROLES[key as keyof typeof ROLES_ENUM]
                                )
                            )
                            .map(([roleName, roleId]) => (
                              <Col span={24} key={roleId}>
                                <Button
                                  block
                                  size="large"
                                  type={
                                    values.role.id === roleId
                                      ? 'primary'
                                      : 'default'
                                  }
                                  onClick={() => {
                                    setFieldValue('role', { id: roleId })
                                    setCurrentStep(1)
                                  }}
                                  className="role-button"
                                >
                                  {ROLES_MAPPER[roleId]}
                                </Button>
                              </Col>
                            ))}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className={styles.step_content}>
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <Title style={{ textAlign: 'center' }}>
                          {`${MESSAGES.SIGN_UP_AS} ${values.role.id ? getValueWithArticle(ROLES_MAPPER[values.role.id]) : ''}`}
                        </Title>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[24, 24]}>
                          {/* User Information */}
                          <Col span={24}>
                            <Typography.Text>
                              {FORM_LABELS.USERNAME}
                            </Typography.Text>
                            <InputComponent
                              name="username"
                              value={values.username}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={`Enter ${FORM_LABELS.USERNAME.toLowerCase()}`}
                              errors={errors}
                              touched={touched}
                            />
                          </Col>

                          <Col span={24}>
                            <Typography.Text>
                              {FORM_LABELS.EMAIL}
                            </Typography.Text>
                            <InputComponent
                              name="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={`Enter ${FORM_LABELS.EMAIL.toLowerCase()}`}
                              errors={errors}
                              touched={touched}
                            />
                          </Col>

                          <Col span={24}>
                            <Typography.Text>
                              {FORM_LABELS.DISPLAY_NAME}
                            </Typography.Text>
                            <InputComponent
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter your full name"
                              errors={errors}
                              touched={touched}
                            />
                          </Col>

                          <Col span={24}>
                            <Typography.Text>
                              {FORM_LABELS.COMPANY}
                            </Typography.Text>
                            <InputComponent
                              name="company"
                              value={values.company}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={`Enter ${FORM_LABELS.COMPANY.toLowerCase()} name`}
                              errors={errors}
                              touched={touched}
                            />
                          </Col>

                          <Col span={24}>
                            <Typography.Text>
                              {FORM_LABELS.PHONE}
                            </Typography.Text>
                            <InputComponent
                              name="phone"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="+1 (000) 000-0000"
                              errors={errors}
                              touched={touched}
                              mask={PHONE_MASK}
                            />
                          </Col>
                          {/* <Col span={24}>
                            <Typography.Text>
                              <label>
                                <Checkbox
                                  checked={isBillingAddress}
                                  onChange={(e) =>
                                    setIsBillingAddress(e.target.checked)
                                  }
                                />
                                &nbsp; Do you have a Billing Address?
                              </label>
                            </Typography.Text>
                          </Col> */}
                          {/*{isBillingAddress && (
                            <Col span={24}>
                              <Row gutter={[24, 24]}>
                                <Col span={24}>
                                  <Title
                                    level={4}
                                    className="form-section-title mgr-0"
                                  >
                                    Billing Address (Optional)
                                  </Title>
                                </Col>

                                <Col span={24}>
                                  <Typography.Text>
                                    Company Name
                                  </Typography.Text>
                                  <InputComponent
                                    name="billingCompanyName"
                                    value={values.billingCompanyName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter billing company name"
                                    errors={errors}
                                    touched={touched}
                                    disabled
                                  />
                                </Col>

                                <Col span={24}>
                                  <Typography.Text>Street</Typography.Text>
                                  <InputComponent
                                    name="street"
                                    value={values.street}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter street address"
                                    errors={errors}
                                    touched={touched}
                                    disabled
                                  />
                                </Col>
                                <Col span={24}>
                                  <Row gutter={16}>
                                    <Col xs={24} sm={24} md={12}>
                                      <Typography.Text>City</Typography.Text>
                                      <InputComponent
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter city"
                                        errors={errors}
                                        touched={touched}
                                        disabled
                                      />
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                      <Typography.Text>State</Typography.Text>
                                      <InputComponent
                                        name="state"
                                        value={values.state}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter state"
                                        errors={errors}
                                        touched={touched}
                                        disabled
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={24}>
                                  <Row gutter={16}>
                                    <Col xs={24} sm={24} md={12}>
                                      <Typography.Text>ZIP</Typography.Text>
                                      <InputComponent
                                        name="zip"
                                        value={values.zip}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter ZIP code"
                                        errors={errors}
                                        touched={touched}
                                        disabled
                                      />
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                      <Typography.Text>Country</Typography.Text>
                                      <InputComponent
                                        name="country"
                                        value={values.country}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter country"
                                        errors={errors}
                                        touched={touched}
                                        disabled
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          )}*/}
                          {/* Form Actions */}
                          <Col span={24}>
                            <Button
                              type="primary"
                              htmlType="submit"
                              disabled={!isValid}
                              className="submit-button"
                              block
                              size="large"
                            >
                              {BUTTONS.REGISTER}
                            </Button>
                          </Col>

                          <Col span={24} className="signin-prompt">
                            <Text className="account-prompt">
                              {MESSAGES.ACCOUNT_PROMPT}&nbsp;
                              <Link
                                href="/login"
                                //className="signin-link a-label"
                              >
                                {MESSAGES.SIGN_IN}
                              </Link>
                            </Text>
                          </Col>
                          <Col span={24}>
                            <Divider />
                          </Col>
                          <Col span={24}>
                            <Button
                              type="link"
                              onClick={() => {
                                resetForm()
                                setCurrentStep(0)
                              }}
                              className="back-button"
                              block
                            >
                              ← Back to Account Type Selection
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form>
            )
          }}
        </Formik>
      </div>
    </section>
  )
}

export default RegistrationFormComponent
