'use client'
import React from 'react'
import { Formik, Form } from 'formik'

import { Button, Col, Input, Row, Typography } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { validatePasswordForm } from '@/src/utils/functions/validation'
import { API_RESPONSE, MESSAGES } from '@/src/utils/constants/app-constants'
import { signIn } from 'next-auth/react'

interface VerifyAccountFormValues {
  password: string
  repeatPassword: string
}

const VerifyAccountFormComponent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hashToken = searchParams.get('hash')
  const triggerNotification = useTriggerNotification()

  if (!hashToken) {
    return <div>Invalid token</div>
  }

  const initialVAForm: VerifyAccountFormValues = {
    password: '',
    repeatPassword: '',
  }

  const submitLoginForm = async (values: VerifyAccountFormValues) => {
    try {
      const resp = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: values.password,
          hash: hashToken,
          action: 'verify',
        }),
      })
      const verifyAccountResponse = await resp.json()
      if (verifyAccountResponse?.status === API_RESPONSE.SUCCESS) {
        triggerNotification(
          'success',
          MESSAGES.SUCCESS,
          MESSAGES.ACCOUNT_VERIFIED
        )
        const name = verifyAccountResponse?.data?.name
        router.replace('/confirm-email/success?name=' + name)
        setTimeout(() => {
          signIn('credentials', {
            autoLoginToken: verifyAccountResponse?.data?.autoLoginToken,
            redirect: true,
            callbackUrl: '/',
          })
        }, 3000)
      } else {
        throw new Error('Error verifying account')
      }
    } catch (err) {
      console.error('error verify account form' + JSON.stringify(err))
      triggerNotification('error', 'Error', 'Error verifying account')
    }
  }
  const { Title, Text } = Typography
  return (
    <div className="container">
      <Title className="white-area-title-element">
        {MESSAGES.ACCOUNT_SETUP}
      </Title>
      <section className="white-area">
        <div className="form-section width">
          <Formik
            initialValues={initialVAForm}
            validate={validatePasswordForm}
            onSubmit={submitLoginForm}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row gutter={[24, 24]}>
                  <Title style={{ textAlign: 'center' }}>
                    {MESSAGES.SET_A_PASSWORD}
                  </Title>
                  <Col
                    span={24}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <p>{MESSAGES.ADMIN_CREATED_ACCOUNT}</p>
                    <p>{MESSAGES.PLEASE_SET_PASSWORD_TO_USE}</p>
                  </Col>
                  <Col span={24}>
                    <Typography.Text>{MESSAGES.PASSWORD}</Typography.Text>
                    <Input.Password
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="max-w-450"
                    />
                    {touched.password && errors.password && (
                      <Text className="error-label">{errors.password}</Text>
                    )}
                  </Col>
                  <Col span={24}>
                    <Typography.Text>
                      {MESSAGES.REPEAT_PASSWORD}
                    </Typography.Text>
                    <Input.Password
                      placeholder="Repeat Password"
                      id="repeatPassword"
                      name="repeatPassword"
                      value={values.repeatPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="max-w-450"
                    />
                    {touched.repeatPassword && errors.repeatPassword && (
                      <Text className="error-label">
                        {errors.repeatPassword}
                      </Text>
                    )}
                  </Col>
                  <Col span={24}>
                    <Button
                      className="width-100"
                      type="primary"
                      htmlType="submit"
                      disabled={!isValid}
                    >
                      {MESSAGES.SET_PASSWORD}
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </div>
  )
}

export default VerifyAccountFormComponent
