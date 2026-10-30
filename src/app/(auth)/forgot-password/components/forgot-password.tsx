'use client'
import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Input, Row, Typography } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { validateForgotPasswordForm } from '../components/validation'
import { resetUserPassword } from '@/src/services/user'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useRouter } from 'next/navigation'

interface ForgetPasswordFormValues {
  email: string
}

const ForgotPasswordFormComponent = () => {
  const triggerNotification = useTriggerNotification()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialFPForm: ForgetPasswordFormValues = {
    email: '',
  }

  const submitLoginForm = async (values: ForgetPasswordFormValues) => {
    try {
      setIsSubmitting(true)
      await resetUserPassword(values.email)
      router.replace('forgot-password/success')
    } catch (err: any) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        err.response.status === 422
          ? MESSAGES.EMAIL_DOESNT_EXIST
          : MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  const { Title, Text } = Typography
  return (
    <div className="container">
      <Title className="white-area-title-element mb-5">
        {MESSAGES.FORGOT_PASSWORD}
      </Title>
      <section className="white-area pb-15">
        <div className="form-section width pb-5">
          <Formik
            initialValues={initialFPForm}
            validate={validateForgotPasswordForm}
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
                  <Col
                    span={24}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <Title>{MESSAGES.ENTER_EMAIL}</Title>
                    <p>{MESSAGES.RESET_EMAIL_TEXT}</p>
                  </Col>
                  <Col span={24}>
                    <Typography.Text>{MESSAGES.EMAIL}</Typography.Text>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Enter email address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="max-w-450"
                    />
                    {touched.email && errors.email && (
                      <Text className="error-label">{errors.email}</Text>
                    )}
                  </Col>
                  <Col span={24}>
                    <Button
                      className="width-100"
                      type="primary"
                      htmlType="submit"
                      disabled={!isValid || isSubmitting}
                    >
                      {MESSAGES.SEND_EMAIL}
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

export default ForgotPasswordFormComponent
