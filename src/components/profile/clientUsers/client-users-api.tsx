'use client'
import React, { useState, useEffect } from 'react'
import { Col, CollapseProps } from 'antd'
import CollapseTab from '@/src/components/common/collapse'
import CollapseTitle from '@/src/components/common/collapseTitle'
import { MESSAGES, ROUTES } from '@/src/utils/constants/app-constants'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getApiKey, regenerateApiKey } from '@/src/services/global'
import { LinkOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import ApiResponseSection from './client-users-json-listing'
export default function ClientExportApi() {
  const [apiSecretKey, setApiSecretKey] = useState('')
  const { data: session, status } = useSession()
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [responseData, setResponseData] = useState<{}>()
  useEffect(() => {
    if (status === 'authenticated' && !session?.user?.isSubUser) {
      const timeout = setTimeout(() => {
        getApiSecretKey()
      }, 150)
      return () => clearTimeout(timeout)
    }
  }, [status, session?.impersonated, session?.user?.isSubUser])

  const getApiSecretKey = async () => {
    try {
      setLoading(true)
      const result = await getApiKey()
      setApiSecretKey(result?.data?.data?.apiKey)
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
  const responseHandler = async () => {
    setLoading(true)
    try {
      const response = await fetch(ROUTES.NEXT_API_EXPORT_ROUTE)
      const result = await response.json()
      setResponseData(result)
    } catch (err) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setLoading(false)
    }
  }
  const refreshApiKey = async () => {
    try {
      setLoading(true)
      const result = await regenerateApiKey()
      getApiSecretKey()
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
  const clearResponseData = () => {
    setResponseData(undefined)
  }
  const downloadPostmanCollection = async () => {
    try {
      setLoading(true) // ✅ Show loader

      const res = await fetch(ROUTES.DOWNLOAD_POSTMAN_COLLECTION)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = MESSAGES.POSTMAN_FILE_NAME
      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setLoading(false)
    }
  }

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <CollapseTitle
          title={'API'}
          addIcon={false}
          text={MESSAGES.POSTMAN_COLLECTION}
          buttonText={
            <>
              {MESSAGES.DOWNLOAD} <LinkOutlined />
            </>
          }
          onButtonClick={downloadPostmanCollection}
        />
      ),
      children: (
        <ApiResponseSection
          apiSecretKey={apiSecretKey}
          responseData={responseData}
          onGenerate={responseHandler}
          refreshApiKey={refreshApiKey}
          clearResponseData={clearResponseData}
        />
      ),
    },
  ]

  return (
    <>
      {/* Collapse Section */}
      <section className="users-profile">
        <Col>
          <CollapseTab className="collapse-primary" items={collapseItems} />
        </Col>
      </section>
    </>
  )
}
