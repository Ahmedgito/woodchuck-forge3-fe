'use client'
import React from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Input, Row, Typography } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

// navigation
import { useSearchParams } from 'next/navigation'
import { API_RESPONSE, MESSAGES } from '@/src/utils/constants/app-constants'
import { RESET_PASSWORD_FORM } from '@/src/utils/constants/form-constants'
import { validatePasswordForm } from '@/src/utils/functions/validation'

interface ResetPasswordFormValues {
  password: string
  repeatPassword: string
}

const ResetPasswordFormComponent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hashToken = searchParams.get('hash')
  const triggerNotification = useTriggerNotification()

  if (!hashToken) {
    return <div>{MESSAGES.INVALID_TOKEN}</div>
  }

  const initialVAForm: ResetPasswordFormValues = {
    password: '',
    repeatPassword: '',
  }
  const onResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      const resp = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.password, hash: hashToken }),
      })
      const resetPasswordResponse = await resp.json()
      if (resetPasswordResponse.status === API_RESPONSE.SUCCESS) {
        triggerNotification(
          'success',
          MESSAGES.SUCCESS,
          MESSAGES.RESET_PASSWORD_SUCCESSFULLY
        )
        router.replace('/password-change/success')
        setTimeout(() => {
          signIn('credentials', {
            autoLoginToken: resetPasswordResponse.data.autoLoginToken,
            redirect: true,
            callbackUrl: '/',
          })
        }, 3000)
      }
    } catch (err) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.ERROR_IN_RESETTING_PASSWORD
      )
    }
  }
  const { Title, Text } = Typography
  return (
    <div className="container">
      <Title className="white-area-title-element">
        {MESSAGES.RESET_PASSWORD}
      </Title>
      <section className="white-area">
        <div className="form-section width">
          <Formik
            initialValues={initialVAForm}
            validate={validatePasswordForm}
            onSubmit={onResetPassword}
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
                    {MESSAGES.PLEASE_SET_PASSWORD}
                  </Title>
                  <Col
                    span={24}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <p>{MESSAGES.PLEASE_SET_PASSWORD_TO_USE}</p>
                  </Col>
                  <Col span={24}>
                    <Typography.Text>
                      {RESET_PASSWORD_FORM.PASSWORD}
                    </Typography.Text>
                    <Input.Password
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
                      {RESET_PASSWORD_FORM.CONFIRM_PASSWORD}
                    </Typography.Text>
                    <Input.Password
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
                      {MESSAGES.RESET_PASSWORD}
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

export default ResetPasswordFormComponent
