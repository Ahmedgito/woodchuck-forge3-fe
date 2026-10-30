'use client'
import './style.scss'
import {
  Col,
  Button,
  Space,
  DatePicker,
  Dropdown,
  Image,
  Typography,
  Divider,
} from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import type { MenuProps } from 'antd'
import { DATE_FORMAT } from '@/src/utils/constants/app-constants'
import dayjs from 'dayjs'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { getMinimumSelectableDate } from '@/src/utils/functions/getDate'
import { LoadingOutlined } from '@ant-design/icons'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'
// Dynamically import modals that use useSearchParams to avoid SSR issues
const AutoExportModal = dynamic(() => import('./modal/autoExportModal'), {
  ssr: false,
  loading: () => null,
})
const ExportFilteredReportModal = dynamic(
  () => import('./modal/exportFilteredReportModal'),
  {
    ssr: false,
    loading: () => null,
  }
)
const ArchiveReportsModal = dynamic(
  () => import('./modal/archiveReportsModal'),
  {
    ssr: false,
    loading: () => null,
  }
)
const FilteredReportViewModal = dynamic(
  () => import('./modal/exportFilteredReportViewModal'),
  {
    ssr: false,
    loading: () => null,
  }
)

export default function ExportReport({
  startDateFilter,
  endDateFilter,
  setStartDateFilter,
  setEndDateFilter,
  exportReport,
  toDate,
  setPageRefresh,
  isDashboard = false,
  firstJobSite,
  firstJobSiteFetched = true,
  closedAt,
  isJobSiteActive = true,
  isGenerating,
  setIsGenerating,
  selectedWasteType,
  selectedMaterialDestinationForReporting,
}: {
  startDateFilter?: string | Date | undefined
  endDateFilter: string | Date | undefined
  setStartDateFilter: (_: string | Date) => void
  setEndDateFilter: (_: string) => void
  exportReport?: () => void
  toDate?: string | Date | undefined
  setPageRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  isDashboard?: boolean
  firstJobSite?: any
  firstJobSiteFetched?: boolean
  closedAt?: string
  isJobSiteActive?: boolean
  isGenerating: boolean
  setIsGenerating: (_: boolean) => void
  selectedWasteType?: string
  selectedMaterialDestinationForReporting?: string[]
}) {
  const date = dayjs().endOf('month')
  const { RangePicker } = DatePicker
  const [activeButton, setActiveButton] = useState('')
  const [rangePickerValues, setRangePickerValues] = useState<[any, any] | null>(
    null
  )
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false)
  const [isAutoExportModalOpen, setIsAutoExportModalOpen] = useState(false)
  const [
    exportFilteredReportViewModalOpen,
    setExportFilteredReportViewModalOpen,
  ] = useState(false)
  const [isExportFilteredReportModalOpen, setIsExportFilteredReportModalOpen] =
    useState(false)
  const [isArchiveReportsModalOpen, setIsArchiveReportsModalOpen] =
    useState(false)
  
  // Track if dates have been initialized to prevent double initialization
  const datesInitializedRef = useRef(false)
  
  useEffect(() => {
    // For dashboard, wait for firstJobSite to be fetched before initializing dates
    // This prevents double API calls with different date ranges
    if (isDashboard && !firstJobSiteFetched) {
      return
    }
    
    // Only initialize dates once to prevent re-triggering when toDate updates
    if (datesInitializedRef.current) {
      return
    }
    
    const today = date.format(DATE_FORMAT.DATE_FORMAT_ISO)
    if (toDate) {
      setStartDateFilter(toDate)
      setEndDateFilter(today)
      setActiveButton(MESSAGES.TO_DATE)
      setRangePickerValues(null)
    } else {
      const startOfYear = dayjs()
        .startOf('year')
        .format(DATE_FORMAT.DATE_FORMAT_ISO)
      setStartDateFilter(startOfYear)
      setEndDateFilter(today)
      setActiveButton(MESSAGES.TO_DATE)
      setRangePickerValues(null)
    }
    
    datesInitializedRef.current = true
  }, [toDate, firstJobSiteFetched, isDashboard])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          rel="noopener noreferrer"
          onClick={() => setExportFilteredReportViewModalOpen(true)}
        >
          {MESSAGES.EXPORT_FILTERED_REPORT_VIEW}
          {isGenerating ? (
            <LoadingOutlined className="cursor-pointer download-icon" />
          ) : (
            <Image
              src={'/images/download-icon.svg'}
              preview={false}
              className="cursor-pointer download-icon"
            />
          )}
        </a>
      ),
      disabled: !startDateFilter || startDateFilter === '',
    },
    // Only show auto export option if jobsite is active
    ...(isJobSiteActive
      ? [
          {
            key: '2',
            label: (
              <a
                rel="noopener noreferrer"
                onClick={() => {
                  setIsAutoExportModalOpen(true)
                }}
              >
                {MESSAGES.SETUP_AUTO_EXPORT}
              </a>
            ),
          },
        ]
      : []),
    {
      key: '3',
      label: (
        <a
          rel="noopener noreferrer"
          onClick={() => {
            setIsArchiveReportsModalOpen(true)
          }}
        >
          {MESSAGES.ARCHIVE_OF_ALL_REPORTS}
        </a>
      ),
    },
  ]

  const handleTodayFilter = () => {
    const today = date.format(DATE_FORMAT.DATE_FORMAT_ISO)
    setStartDateFilter(toDate ? toDate : today)
    setEndDateFilter(today)
    setActiveButton(MESSAGES.TO_DATE)
    setRangePickerValues(null)
    setPageRefresh && setPageRefresh(true)
  }

  const handleCustomDateButtonClick = () => {
    setIsRangePickerOpen(!isRangePickerOpen)
  }

  const handleDateChange = (_dates: any, dateStrings: [string, string]) => {
    if (!_dates) {
      const today = date.format(DATE_FORMAT.DATE_FORMAT_ISO)
      setStartDateFilter(toDate ? toDate : today)
      setEndDateFilter(today)
      setActiveButton(MESSAGES.TO_DATE)
      setRangePickerValues(null)
    } else {
      const startOfMonth = dayjs(dateStrings[0]).startOf('month')
      const endOfMonth = dayjs(dateStrings[1]).endOf('month')
      setStartDateFilter(startOfMonth.format(DATE_FORMAT.DATE_FORMAT_ISO))
      setEndDateFilter(endOfMonth.format(DATE_FORMAT.DATE_FORMAT_ISO))
      setActiveButton(MESSAGES.CUSTOM_DATE)
      setRangePickerValues([startOfMonth, endOfMonth])
    }
    setIsRangePickerOpen(false)
    setPageRefresh && setPageRefresh(true)
  }

  const disabledDate = (current: dayjs.Dayjs) => {
    if (!current) return false
    const minDate = getMinimumSelectableDate(toDate, isDashboard, firstJobSite)
    const currentUTC = current.utc().startOf('month')
    const minDateUTC = minDate.utc().startOf('month')
    return currentUTC.isBefore(minDateUTC)
  }

  return (
    <Col xs={24} sm={24} md={16} lg={12} xl={12}>
      <div className="alignment font-medium for-filters">
        <Typography.Text className="filter-text">
          {MESSAGES.FILTER_REPORT_VIEW}
        </Typography.Text>
        <GenieButtonWrapper hint={'filter_report_view_controls'}>
          <Button
            onClick={handleTodayFilter}
            className={
              activeButton === MESSAGES.TO_DATE
                ? 'active secondary'
                : 'secondary'
            }
            type="text"
          >
            {MESSAGES.TO_DATE}
          </Button>
        </GenieButtonWrapper>
        <Button
          onMouseEnter={handleCustomDateButtonClick}
          className={
            activeButton === MESSAGES.CUSTOM_DATE
              ? 'active secondary calendar'
              : 'secondary calendar'
          }
          type="text"
          icon={
            <img
              src="/images/calendar-icon.svg"
              alt="Center"
              className="calendar-icon"
            />
          }
        ></Button>

        {/* <Button
          onClick={() => handleLastWeekFilter()}
          className={
            activeButton === MESSAGES.LAST_WEEK
              ? 'active secondary'
              : 'secondary'
          }
          type="text"
        >
          {MESSAGES.LAST_WEEK}
        </Button> */}
        {/* <Button
          onClick={() => handleLastMonthFilter()}
          className={
            activeButton === MESSAGES.LAST_MONTH
              ? 'active secondary'
              : 'secondary'
          }
          type="text"
        >
          {MESSAGES.LAST_MONTH}
        </Button> */}

        <RangePicker
          picker="month"
          onChange={handleDateChange}
          value={rangePickerValues}
          format={DATE_FORMAT.MM_DD_YYYY}
          disabledDate={disabledDate}
          open={isRangePickerOpen}
          onOpenChange={setIsRangePickerOpen}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            opacity: 0,
            zIndex: -1,
          }}
          dropdownClassName="month-range-picker-dropdown"
        />
        <>
          <Divider
            type="vertical"
            style={{
              height: '24px',
              margin: '0 8px',
              borderColor: '#462C75',
            }}
          />
          <GenieButtonWrapper hint="export_report_dropdown">
            <Dropdown
              menu={{ items }}
              disabled={process.env.NEXT_PUBLIC_ISDEMO === 'true'}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <i className="icon-export"></i>
                  {MESSAGES.EXPORT_REPORT}
                  <img src="/images/down-icon.svg" alt="down-icon" />
                  {isGenerating && (
                    <LoadingOutlined className="cursor-pointer download-icon" />
                  )}
                </Space>
              </a>
            </Dropdown>
          </GenieButtonWrapper>
        </>
      </div>
      <FilteredReportViewModal
        isOpen={exportFilteredReportViewModalOpen}
        setIsModalOpen={setExportFilteredReportViewModalOpen}
        startDate={startDateFilter}
        endDate={endDateFilter}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        selectedWasteType={selectedWasteType}
        selectedMaterialDestinationForReporting={selectedMaterialDestinationForReporting}
      />
      <AutoExportModal
        isOpen={isAutoExportModalOpen}
        setIsModalOpen={setIsAutoExportModalOpen}
      />

      <ExportFilteredReportModal
        isOpen={isExportFilteredReportModalOpen}
        setIsModalOpen={setIsExportFilteredReportModalOpen}
        onExport={() => {
          exportReport?.()
          setIsExportFilteredReportModalOpen(false)
        }}
      />

      <ArchiveReportsModal
        isOpen={isArchiveReportsModalOpen}
        setIsModalOpen={setIsArchiveReportsModalOpen}
        onSendEmail={(selectedMonths) => {
          const payload = { months: selectedMonths }
          console.log('Archive payload:', payload)
        }}
        startDate={toDate}
        closedAt={closedAt}
      />
    </Col>
  )
}
