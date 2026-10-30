'use client'
import React from 'react'
import { Button, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { MESSAGES } from '@/src/utils/constants/app-constants'

const ForgotPasswordSuccessComponent = () => {
  const router = useRouter()

  const { Title } = Typography
  return (
    <div className="container mt-4">
      <Title className="white-area-title-element">
        {MESSAGES.FORGOT_PASSWORD}
      </Title>
      <section className="white-area">
        <div className="form-section width">
          <Row gutter={[24, 24]}>
            <Col
              span={24}
              style={{
                textAlign: 'center',
              }}
            >
              <Title style={{ textAlign: 'center' }}>
                {MESSAGES.EMAIL_SENT}
              </Title>
              <p>{MESSAGES.EMAIL_SENT_MESSAGE}</p>
            </Col>
            <Col span={24}>
              <Button
                className="width-100"
                type="primary"
                htmlType="submit"
                onClick={() => router.push('/login')}
              >
                {MESSAGES.GO_TO_LOGIN}
              </Button>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}

export default ForgotPasswordSuccessComponent
