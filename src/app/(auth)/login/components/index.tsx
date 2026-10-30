'use client'
import React, { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { Formik, Form } from 'formik'
import { validateLoginForm } from './validation'
import { Button, Col, Divider, Input, Row, Typography } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useSearchParams } from 'next/navigation'
import { useLoader } from '@/src/utils/context/loader-context'

interface LoginFormValues {
  email: string
  password: string
}

const LoginFormComponent = () => {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState(searchParams.get('error'))
  const successMessage = searchParams.get('success')
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  // Get the demo flag from environment variables
  const isDemoEnabled = (process.env.NEXT_PUBLIC_ISDEMO || 'false') === 'true'
  useEffect(() => {
    if (errorMessage) {
      triggerNotification(
        'error',
        'Login Error',
        'Please check your email and password and try again. If you are still having trouble, please contact support.'
      )
      setErrorMessage('')
    }
    if (successMessage) {
      triggerNotification('success', 'Login Success', successMessage)
    }
    setLoading(false)
  }, [errorMessage, successMessage, triggerNotification])

  const initialLoginForm: LoginFormValues = {
    email: '',
    password: '',
  }

  const submitLoginForm = async (values: LoginFormValues) => {
    try {
      setLoading(true)
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: true,
        callbackUrl: '/',
      })
      setLoading(false)
    } catch (err) {
      console.error('error login form' + JSON.stringify(err))
    }
  }

  const { Title, Text, Link } = Typography

  return (
    <section className="container white-area">
      <div className="form-section width">
        <Formik
          initialValues={initialLoginForm}
          validate={validateLoginForm}
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
                <Col span={24}>
                  <Title style={{ textAlign: 'center' }}>Login to chuck</Title>
                </Col>
                <Col span={24}>
                  <Typography.Text>Email</Typography.Text>
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
                  <Typography.Text>Password</Typography.Text>
                  <Input.Password
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    className="max-w-450"
                  />
                  {touched.password && errors.password && (
                    <Text className="error-label">{errors.password}</Text>
                  )}
                </Col>
                <Col span={24}>
                  <Button
                    className="width-100"
                    type="primary"
                    htmlType="submit"
                    disabled={!values.email || !values.password}
                  >
                    Login
                  </Button>
                </Col>
                <Col span={24}>
                  <Text className="a-label">
                    <Link href="/forgot-password">Forgot password?</Link>
                  </Text>
                </Col>
                <Col span={24}>
                  <Divider />
                </Col>
                <Col span={24}>
                  {isDemoEnabled ? (
                    // Demo mode content
                    <Text>
                      Don&apos;t have an account yet? &nbsp;
                      <Link href="/create-user">Sign Up</Link>
                    </Text>
                  ) : (
                    // Regular mode content
                    <Text>
                      You don&apos;t have an account? Please call{' '}
                      <Link href="tel:(555) 123-4567">(555) 123-4567</Link> to
                      get access to CHUCK
                    </Text>
                  )}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  )
}

export default LoginFormComponent
