'use client'
import React from 'react'
import { Button, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/navigation'

// navigation
import { MESSAGES } from '@/src/utils/constants/app-constants'

const ErrorComponent = ({ title, body }: { title: string; body: string }) => {
  const router = useRouter()

  const { Title } = Typography
  return (
    <div className="container mt-4">
      <Title className="white-area-title-element">{title}</Title>
      <section className="white-area">
        <div className="form-section width">
          <Row gutter={[24, 24]}>
            <Col
              span={24}
              style={{
                textAlign: 'center',
              }}
            >
              <Title style={{ textAlign: 'center' }}>{`${body}!`}</Title>
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

export default ErrorComponent
