'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Button, Typography, Row, Col, Checkbox, Steps, Form } from 'antd'
import {
  ARCHIVE_MONTHLY_REPORTS_STEPS,
  MESSAGES,
  Months,
} from '@/src/utils/constants/app-constants'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  sendJobsiteArchiveReport,
  sendDashboardArchiveReport,
} from '@/src/services/global'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import dayjs from 'dayjs'
import FormatSelector from '@/src/components/shared/fileFormatSelection/formatSelector'
import { BUTTONS } from '@/src/utils/constants/form-constants'

interface Props {
  isOpen: boolean
  setIsModalOpen: (_value: boolean) => void
  onSendEmail: (_selectedMonths: string[]) => void
  startDate?: string | Date
  closedAt?: string
}

const { Title, Text } = Typography
const { Step } = Steps
const ArchiveReportsModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  onSendEmail,
  startDate,
  closedAt,
}) => {
  const [form] = Form.useForm()
  const [step, setStep] = useState(0)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const jobSiteId = searchParams.get('id')
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    if (isOpen) {
      setSelectedMonths([])
    }
  }, [isOpen])

  const generateYears = () => {
    const startDateStr = startDate
      ? dayjs(startDate).format('MM-YYYY')
      : process.env.NEXT_PUBLIC_ARCHIVE_START_YEAR || '01-2024'

    const [startMonth, startYear] = startDateStr.split('-').map(Number)

    const endDate = closedAt ? dayjs(closedAt) : dayjs()
    const endYear = endDate.year()
    const endMonth = endDate.month() // 0-based month

    const years = []
    for (let year = startYear; year <= endYear; year++) {
      const yearData = {
        year,
        startMonth: year === startYear ? startMonth - 1 : 0,
        endMonth: year === endYear ? (closedAt ? endMonth : endMonth - 1) : 11,
      }
      years.push(yearData)
    }

    return years
  }

  const getAvailableMonthsForYear = (yearData: {
    year: number
    startMonth: number
    endMonth: number
  }) => {
    const { startMonth, endMonth } = yearData
    const availableMonths = Months.slice(startMonth, endMonth + 1)
    return availableMonths
  }

  const handleMonthSelect = (year: number, monthIndex: number) => {
    const monthKey = `${monthIndex}-${year}`
    setSelectedMonths((prev) => {
      if (prev.includes(monthKey)) {
        return prev.filter((m) => m !== monthKey)
      } else {
        return [...prev, monthKey]
      }
    })
  }

  const handleYearSelect = (
    yearData: { year: number; startMonth: number; endMonth: number },
    checked: boolean
  ) => {
    const { year, startMonth, endMonth } = yearData
    const yearMonths: string[] = []

    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
      yearMonths.push(`${monthIndex}-${year}`)
    }

    setSelectedMonths((prev) => {
      if (checked) {
        const newSelection = [...prev]
        yearMonths.forEach((monthKey) => {
          if (!newSelection.includes(monthKey)) {
            newSelection.push(monthKey)
          }
        })
        return newSelection
      } else {
        return prev.filter((monthKey) => !yearMonths.includes(monthKey))
      }
    })
  }

  const isYearSelected = (yearData: {
    year: number
    startMonth: number
    endMonth: number
  }) => {
    const { year, startMonth, endMonth } = yearData
    const yearMonths: string[] = []

    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
      yearMonths.push(`${monthIndex}-${year}`)
    }

    return yearMonths.every((monthKey) => selectedMonths.includes(monthKey))
  }

  const isYearIndeterminate = (yearData: {
    year: number
    startMonth: number
    endMonth: number
  }) => {
    const { year, startMonth, endMonth } = yearData
    const yearMonths: string[] = []

    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
      yearMonths.push(`${monthIndex}-${year}`)
    }

    const selectedYearMonths = yearMonths.filter((monthKey) =>
      selectedMonths.includes(monthKey)
    )
    return (
      selectedYearMonths.length > 0 &&
      selectedYearMonths.length < yearMonths.length
    )
  }

  const handleSendArchiveReports = async () => {
    const formats = form.getFieldValue('formats')
    try {
      setIsLoading(true)
      setLoading(true)

      let response
      if (jobSiteId) {
        response = await sendJobsiteArchiveReport(
          selectedMonths,
          formats,
          parseInt(jobSiteId)
        )
      } else {
        response = await sendDashboardArchiveReport(selectedMonths, formats)
      }

      if (response.data.status === 'success') {
        triggerNotification(
          'success',
          MESSAGES.SUCCESS,
          response.data.data.message || MESSAGES.ARCHIVE_REPORTS_SENT_SUCCESS
        )
        onSendEmail(selectedMonths)
        setIsModalOpen(false)
      } else {
        throw new Error(
          response.data.message || MESSAGES.ARCHIVE_REPORTS_SEND_FAILED
        )
      }
    } catch (error: any) {
      console.error(MESSAGES.ERROR_SENDING_ARCHIVE_REPORTS, error)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        error.message || MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setIsLoading(false)
      setLoading(false)
      form.resetFields()
      setStep(0)
    }
  }

  const years = generateYears()

  const stepHandler = (value: number) => {
    if (selectedMonths.length === 0 && value === 1) return
    setStep(value)
  }
  const formatWatch = Form.useWatch('formats', form)
  return (
    <ModalComponent
      isOpen={isOpen}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => {
        setStep(0)
        setIsModalOpen(false)
        form.resetFields()
      }}
      footer={null}
      width={900}
      maskClosable={true}
      destroyOnClose={true}
      className="modal-lg"
    >
      <div className="form-section width for-archive-reports-modal">
        <Steps
          current={step}
          onChange={stepHandler}
          className="registration-steps"
        >
          {ARCHIVE_MONTHLY_REPORTS_STEPS.map((step) => (
            <Step key={step.title} />
          ))}
        </Steps>
      </div>
      <Form form={form} initialValues={{ formats: ['pdf'] }}>
        <Row justify="center" align="middle" className="auto-export-modal">
          <Col span={24}>
            <Title level={2}>{MESSAGES.ARCHIVE_OF_MONTHLY_REPORTS}</Title>
            <Text className="modal-subtitle">
              Select which months you want reports from, then click ‘Send Via
              Email’ to receive your selected reports via email.
            </Text>
            {step === 0 ? (
              <Row gutter={[24, 16]} className="wrap-months mt-10">
                {years.map((yearData) => {
                  const { year, startMonth } = yearData
                  const availableMonths = getAvailableMonthsForYear(yearData)
                  const yearSelected = isYearSelected(yearData)
                  const yearIndeterminate = isYearIndeterminate(yearData)

                  return (
                    <Col key={year} xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Title level={4}>{year}</Title>

                      <Checkbox
                        className="select-all"
                        checked={yearSelected}
                        indeterminate={yearIndeterminate}
                        onChange={(e) =>
                          handleYearSelect(yearData, e.target.checked)
                        }
                      >
                        {MESSAGES.SELECT_ALL_MONTHS}
                      </Checkbox>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        {availableMonths.map((month, index) => {
                          const monthIndex = startMonth + index
                          const monthKey = `${monthIndex}-${year}`
                          const isSelected = selectedMonths.includes(monthKey)

                          return (
                            <Checkbox
                              className="month-checkbox"
                              key={monthKey}
                              checked={isSelected}
                              onChange={() =>
                                handleMonthSelect(year, monthIndex)
                              }
                            >
                              {month}
                            </Checkbox>
                          )
                        })}
                      </div>
                    </Col>
                  )
                })}
              </Row>
            ) : (
              <FormatSelector />
            )}

            <Row justify="end" className="mt-15">
              <Col>
                <Button
                  className={step === 1 ? 'back-button' : 'send-email-btn'}
                  loading={isLoading}
                  disabled={selectedMonths.length === 0}
                  onClick={() => stepHandler(step === 0 ? 1 : 0)}
                >
                  {step === 0 ? BUTTONS.NEXT : BUTTONS.BACK}
                </Button>
              </Col>
              {step === 1 && (
                <Col>
                  <Button
                    className="send-email-btn"
                    type="default"
                    loading={isLoading}
                    disabled={
                      selectedMonths.length === 0 || !formatWatch?.length
                    }
                    onClick={handleSendArchiveReports}
                  >
                    {MESSAGES.SEND_VIA_EMAIL}
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Form>
    </ModalComponent>
  )
}

export default ArchiveReportsModal
