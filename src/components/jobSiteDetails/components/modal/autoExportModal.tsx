'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Typography, Row, Col, Checkbox, Space, Form, Switch } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useReportSubscriptions } from '@/src/utils/context/report-subscriptions-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { subscribeToReports } from '@/src/services/global'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SecondaryButton from '@/src/components/common/secondaryButton'
import FormatSelector from '@/src/components/shared/fileFormatSelection/formatSelector'
interface Props {
  isOpen: boolean
  setIsModalOpen: (_value: boolean) => void
}
interface FormValues {
  frequencies: string[]
  isActive: boolean
  formats: string[]
}
const { Title, Text } = Typography

const AutoExportModal: React.FC<Props> = ({ isOpen, setIsModalOpen }) => {
  const { reportSubscriptions, refreshReportSubscriptions } =
    useReportSubscriptions()

  const [form] = Form.useForm()
  const triggerNotification = useTriggerNotification()
  const searchParams = useSearchParams()
  const jobSiteId = searchParams.get('id')
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const formatWatch = Form.useWatch('formats', form)
  const isActiveWatch = Form.useWatch('isActive', form)
  const frequenciesWatch = Form.useWatch('frequencies', form)
  useEffect(() => {
    if (!reportSubscriptions) return

    const target = jobSiteId
      ? reportSubscriptions.jobSites?.find(
          (js) => js.jobSiteId === parseInt(jobSiteId)
        )
      : reportSubscriptions.dashboard

    const frequencies: string[] = []
    if (target?.monthly) frequencies.push('monthly')
    if (target?.weekly) frequencies.push('weekly')
    const formats =
      target?.formats && target.formats.length > 0 ? target.formats : ['pdf']
    form.setFieldsValue({
      frequencies,
      isActive: Boolean(target?.monthly || target?.weekly),
      formats,
    })
  }, [reportSubscriptions, jobSiteId, form, isOpen])

  const handleSubmit = async (value: FormValues) => {
    const reportType = jobSiteId ? 'job_site' : 'dashboard'
    const selectedFrequencies = value.frequencies ?? []
    const isActive = Boolean(value.isActive)
    const basePayload = {
      jobSiteId: jobSiteId ? parseInt(jobSiteId) : 0,
      reportType,
      formats: value.formats,
    }

    try {
      setIsConfirmLoading(true)
      const responses = await Promise.all([
        subscribeToReports({
          ...basePayload,
          frequency: 'monthly',
          isActive: isActive && selectedFrequencies.includes('monthly'),
        }),
        subscribeToReports({
          ...basePayload,
          frequency: 'weekly',
          isActive: isActive && selectedFrequencies.includes('weekly'),
        }),
      ])

      const failed = responses.find((response) => !response.data.status)
      if (failed) {
        throw new Error(failed.data.message || MESSAGES.SOMETHING_WENT_WRONG)
      }

      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.AUTO_EXPORT_SETTINGS_UPDATED
      )
      setIsModalOpen(false)
      await refreshReportSubscriptions()
    } catch (error: any) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        error.message || MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setIsConfirmLoading(false)
    }
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
      footer={null}
      width={750}
      maskClosable={false}
      destroyOnClose={true}
      className="modal-lg"
    >
      <Row justify="center" align="middle" className="auto-export-modal">
        <Col span={24}>
          <Title level={2}>{MESSAGES.AUTO_EXPORT_REPORTS_TITLE}</Title>

          <Text className="desc">{MESSAGES.AUTO_EXPORT_DESCRIPTION}</Text>

          <div>
            <Form form={form} onFinish={handleSubmit}>
              <div className="auto-export-form">
                <Form.Item name="frequencies">
                  <Checkbox.Group>
                    <Space direction="vertical">
                      <Checkbox value="monthly">
                        {MESSAGES.RADIO_GROUP_MONTHLY}
                      </Checkbox>
                      <Checkbox value="weekly">
                        {MESSAGES.RADIO_GROUP_WEEKLY}
                      </Checkbox>
                    </Space>
                  </Checkbox.Group>
                </Form.Item>

                <div className="activate-switch">
                  <Text>{MESSAGES.ACTIVATE}</Text>
                  <br />
                  <Form.Item name="isActive" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>
              </div>
              <Row
                gutter={[32, 16]}
                justify="center"
                align="middle"
                className="mt-5 mb-5"
              >
                <Col>
                  <img
                    src="/images/reports-solo-icon.svg"
                    alt="export-report-icons"
                  />
                </Col>
                <Col>
                  <FormatSelector />
                </Col>
              </Row>

              <div className="text-right">
                <SecondaryButton
                  type="default"
                  block
                  htmlType="submit"
                  loading={isConfirmLoading}
                  disabled={
                    formatWatch?.length === 0 ||
                    (isActiveWatch && !frequenciesWatch?.length)
                  }
                >
                  {MESSAGES.CONFIRM.toUpperCase()}
                </SecondaryButton>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </ModalComponent>
  )
}

export default AutoExportModal
