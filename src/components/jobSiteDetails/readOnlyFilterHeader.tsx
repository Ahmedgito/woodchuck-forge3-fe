import './style.scss'
import { Col, Button, Space, DatePicker, Dropdown } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import type { MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { DATE_FORMAT } from '@/src/utils/constants/app-constants'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { getMinimumSelectableDate } from '@/src/utils/functions/getDate'

export default function ReadOnlyFilterHeader({
  startDateFilter,
  setStartDateFilter,
  setEndDateFilter,
  exportReport,
  toDate,
}: {
  startDateFilter?: string | Date | undefined
  setStartDateFilter: (_: string | Date) => void
  setEndDateFilter: (_: string) => void
  exportReport?: () => void
  toDate?: string | Date | undefined
}) {
  const date = dayjs().endOf('month')
  const { RangePicker } = DatePicker
  const [activeButton, setActiveButton] = useState('')
  const [rangePickerValues, setRangePickerValues] = useState<[any, any] | null>(
    null
  )

  useEffect(() => {
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
  }, [toDate])

  const disabledDate = (current: dayjs.Dayjs) => {
    if (!current) return false
    const minDate = getMinimumSelectableDate(toDate, false)
    const currentUTC = current.utc().startOf('month')
    const minDateUTC = minDate.utc().startOf('month')
    return currentUTC.isBefore(minDateUTC)
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" onClick={exportReport}>
          {'Filter report'}
        </a>
      ),
      disabled: !startDateFilter || startDateFilter === '',
    },
    {
      key: '2',
      label: (
        <a
          rel="noopener noreferrer"
          onClick={() => {
            setActiveButton('')
            exportReport?.()
          }}
        >
          {MESSAGES.EXPORT_ALL_DATA}
        </a>
      ),
    },
  ]

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
      <div className="alignment font-medium">
        <Button
          className={
            activeButton === MESSAGES.TO_DATE ? 'active secondary' : 'secondary'
          }
          type="text"
        >
          {MESSAGES.TO_DATE}
        </Button>
        <RangePicker
          picker="month"
          value={rangePickerValues}
          format={DATE_FORMAT.MM_DD_YYYY}
          disabledDate={disabledDate}
        />
        <Dropdown
          menu={{ items }}
          disabled={process.env.NEXT_PUBLIC_ISDEMO === 'true'}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <i className="icon-export"></i>
              {MESSAGES.EXPORT_REPORT}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Col>
  )
}
