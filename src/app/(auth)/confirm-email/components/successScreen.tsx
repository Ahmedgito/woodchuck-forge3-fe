'use client'
import React from 'react'
import { Button, Col, Row, Typography } from 'antd'
import { useRouter } from 'next/navigation'

// navigation
import { useSearchParams } from 'next/navigation'
import { MESSAGES } from '@/src/utils/constants/app-constants'

const VerifyAccountConfirmSuccessComponent = () => {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')

  const router = useRouter()

  const { Title } = Typography
  return (
    <div className="container mt-4">
      <Title className="white-area-title-element">Account Setup</Title>
      <section className="white-area">
        <div className="form-section width">
          <Row gutter={[24, 24]}>
            <Col
              span={24}
              style={{
                textAlign: 'center',
              }}
            >
              <Title style={{ textAlign: 'center' }}>Password Set!</Title>
              <p>Welcome {name}, your&apos;e ready to go </p>
            </Col>
            <Col span={24}>
              <Button className="width-100" type="primary" htmlType="submit">
                {MESSAGES.LOGGING_IN}
              </Button>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}

export default VerifyAccountConfirmSuccessComponent
