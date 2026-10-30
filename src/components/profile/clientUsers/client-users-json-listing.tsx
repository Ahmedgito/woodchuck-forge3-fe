'use client'

import React from 'react'
import { Row, Col, Typography, Button, message } from 'antd'
import { CopyOutlined, LinkOutlined, ReloadOutlined } from '@ant-design/icons'
import { MESSAGES, ROUTES } from '@/src/utils/constants/app-constants'

const { Title } = Typography

interface ApiResponseSectionProps {
  apiSecretKey: string
  responseData?: object
  onGenerate: () => void
  refreshApiKey: () => void
  clearResponseData: () => void
}

const ApiResponseSection: React.FC<ApiResponseSectionProps> = ({
  apiSecretKey,
  responseData,
  onGenerate,
  refreshApiKey,
  clearResponseData,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const copyHandler = () => {
    navigator.clipboard
      .writeText(apiSecretKey)
      .then(() => message.success(MESSAGES.COPIED))
      .catch(() => message.error(MESSAGES.FAILED_TO_COPY))
  }
  return (
    <>
      {/* API Secret Key */}
      <Row className="api-section mt-5">
        <Title level={5} className="font-inter mt-1 font-bold txt-uppercase">
          <span className="font-bold txt-uppercase">
            {MESSAGES.API_SECRET_KEY}
          </span>
          &nbsp;
        </Title>
        <Title level={5} className="font-inter mt-1">
          <span className="font-medium reset">{apiSecretKey}</span>
        </Title>
        <ReloadOutlined className="ml-5" onClick={refreshApiKey} />
        <CopyOutlined onClick={copyHandler} />
      </Row>

      {/* API URL + Generate Button */}
      <Row className="api-section mt-8">
        <Title
          level={5}
          className="font-inter mb-0 mt-1 font-bold txt-uppercase"
        >
          <span className="font-bold txt-uppercase">
            {MESSAGES.API_END_POINT}
          </span>
          &nbsp;
        </Title>
        <Title level={5} className="font-inter mb-0 mt-1">
          <span className="font-medium reset">
            {baseUrl + ROUTES.EXPORT_USER}
          </span>
        </Title>
        <Button
          onClick={onGenerate}
          className="icon-button mb-0 secondary ml-3"
        >
          {MESSAGES.GENERATE_API_RESPONSE} <LinkOutlined />
        </Button>
        {responseData && (
          <Button onClick={clearResponseData} className="icon-button mb-0 ml-3">
            {MESSAGES.CLEAR}
          </Button>
        )}
      </Row>

      {/* API Response */}
      {responseData && (
        <Row className="mt-5 w-full">
          <Col span={24}>
            <pre
              style={{
                backgroundColor: '#ffffffff',
                color: '#000000ff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: '1.5',
                fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
                overflowX: 'auto',
                maxHeight: '600px',
              }}
            >
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ApiResponseSection
