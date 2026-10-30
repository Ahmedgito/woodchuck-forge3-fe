'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Typography, Row, Col, Form } from 'antd'
import { useEffect, useRef } from 'react'
import SecondaryButton from '@/src/components/common/secondaryButton'
import FormatSelector from '@/src/components/shared/fileFormatSelection/formatSelector'
import {
  ALL_CMS_KEY,
  ALL_LOCATIONS_KEY,
  EXPORT_REPORT_MESSAGES,
  MESSAGES,
} from '@/src/utils/constants/app-constants'
import {
  exportArchiveReport,
  exportArchiveReportDownload,
  exportArchiveReportStatus,
} from '@/src/services/global'
import { useSearchParams } from 'next/navigation'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
interface Props {
  isOpen: boolean
  setIsModalOpen: (_value: boolean) => void
  startDate?: string | Date | undefined
  endDate?: string | Date | undefined
  isGenerating: boolean
  setIsGenerating: (_value: boolean) => void
  selectedWasteType?: string
  selectedMaterialDestinationForReporting?: string[]
}

interface FormValues {
  formats: string[]
}

const { Title, Text } = Typography

const FilteredReportViewModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  startDate,
  endDate,
  isGenerating,
  setIsGenerating,
  selectedWasteType,
  selectedMaterialDestinationForReporting = [],
}) => {
  const searchParams = useSearchParams()
  const jobSiteId = searchParams.get('id')
  const [form] = Form.useForm()
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const triggerNotification = useTriggerNotification()
  useEffect(() => {
    if (isGenerating) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = '' // Required for Chrome to show the confirmation dialog
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      // ✅ Cleanup once polling stops or component unmounts
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [isGenerating])

  const pollJobStatus = (jobId: number) => {
    const startTime = Date.now()

    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await exportArchiveReportStatus(jobId)

        if (data?.state === 'completed') {
          clearInterval(pollingRef.current!)
          setIsGenerating(false)
          triggerNotification(
            'success',
            MESSAGES.SUCCESS,
            EXPORT_REPORT_MESSAGES.EXPORT_REPORT_SUCCESS
          )
          form.resetFields()
          setIsModalOpen(false)
          await handleDownload(jobId)
          return
        }

        if (data?.state === 'failed') {
          clearInterval(pollingRef.current!)
          setIsGenerating(false)
          triggerNotification(
            'error',
            MESSAGES.ERROR,
            EXPORT_REPORT_MESSAGES.EXPORT_REPORT_FAILED
          )
          form.resetFields()

          return
        }

        // Timeout after 2 minutes
        if (
          Date.now() - startTime >
          Number(process.env.NEXT_PUBLIC_POLLING_DURATION_REPORTS)
        ) {
          clearInterval(pollingRef.current!)
          setIsGenerating(false)
          triggerNotification('error', MESSAGES.REPORT_GENERATION_CANCELLED, '')
          form.resetFields()
          return
        }
      } catch (err) {
        console.error(err)
        clearInterval(pollingRef.current!)
        setIsGenerating(false)
        form.resetFields()

        triggerNotification(
          'error',
          MESSAGES.ERROR,
          EXPORT_REPORT_MESSAGES.ERROR_CHECKING_STATUS
        )
      }
    }, 3000) // poll every 3 seconds
  }

  const handleDownload = async (jobId: number) => {
    try {
      const response = await exportArchiveReportDownload(jobId)

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/zip',
      })

      const disposition = response.headers['content-disposition']
      let filename = `${jobSiteId ? 'jobsite' : 'dashboard'}_${startDate}_${endDate}`
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match) filename = match[1]
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const submitHandler = async (value: FormValues) => {
    setIsGenerating(true)
    const materialDestinations = (selectedMaterialDestinationForReporting || [])
        .filter((key) => key !== ALL_LOCATIONS_KEY && key !== ALL_CMS_KEY)
        .map((key) => {
          const [type, id] = key.split('_')
          return { type, id: Number(id) }
        })
    try {
      const payload = {
        startDate,
        endDate,
        wasteType: selectedWasteType,
        materialDestinations: materialDestinations,
        ...value,
      }
      const { data } = await exportArchiveReport({
        jobSiteId: jobSiteId ? parseInt(jobSiteId) : null,
        ...payload,
      })
      if (data?.jobId) {
        triggerNotification(
          'info',
          '',
          EXPORT_REPORT_MESSAGES.REPORT_GENERATION_IN_PROGRESS
        )
        pollJobStatus(data.jobId)
      } else {
        setIsGenerating(false)
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          EXPORT_REPORT_MESSAGES.FAILED_TO_START
        )
      }
    } catch (error) {
      console.error(error)
      setIsGenerating(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        EXPORT_REPORT_MESSAGES.ERROR_EXPORTING_REPORT
      )
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
          <Title level={2}>{MESSAGES.EXPORT_FILTERED_REPORT}</Title>
          <Text className="desc">
            {MESSAGES.EXPORT_FILTERED_REPORT_MODAL_DESCRIPTION}
          </Text>

          <Form
            form={form}
            onFinish={submitHandler}
            initialValues={{ formats: ['pdf'] }}
          >
            <div className="export-format-icons">
              <img src="/images/download-icon.svg" alt="download-icon" />
            </div>
            <Col>
              <FormatSelector />
            </Col>

            <div className="text-right">
              <SecondaryButton
                type="default"
                block
                htmlType="submit"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating' : MESSAGES.EXPORT.toUpperCase()}
              </SecondaryButton>
            </div>
          </Form>
        </Col>
      </Row>
    </ModalComponent>
  )
}

export default FilteredReportViewModal
