import '../../dashboard/jobSiteList/style.scss'
import { Col, Row, Typography } from 'antd'
import DoughnutChart from '../../shared/charts/doughnutChart'
import GroupedBarChart from '../../shared/charts/groupedBarChart'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useState, useEffect } from 'react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { waste } from '@/src/services/jobsite'
import { useLoader } from '@/src/utils/context/loader-context'
import toDecimal from '@/src/utils/functions/decimalConversion'

interface MonthData {
  id: number
  accepted_weight: number
  refused_weight: number
}

interface WasteData {
  status: string
  data: {
    percent_delivered: number
    percent_refused: number
    accepted: number
    refused: number
    months: MonthData[]
  }
}

export default function WasteDiversionRate({
  id,
  to,
  from,
  refresh,
}: {
  id: number | null | undefined
  to: string | undefined
  from: string | undefined
  refresh?: boolean
}) {
  const { Title, Text } = Typography
  const triggerNotification = useTriggerNotification()
  const [wasteData, setWasteData] = useState<WasteData['data'] | null>(null)
  const [diverted, setDiverted] = useState<number[]>(new Array(12).fill(0))
  const [refused, setRefused] = useState<number[]>(new Array(12).fill(0))
  const { setLoading } = useLoader()

  const getWasteData = async () => {
    try {
      setLoading(true)
      let result = await waste(id, from, to)
      setWasteData(result.data.data)
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

  useEffect(() => {
    getWasteData()
  }, [id, from, to, refresh])

  useEffect(() => {
    if (wasteData) {
      const newDiverted = [...diverted]
      const newRefused = [...refused]
      wasteData.months.forEach((month) => {
        newDiverted[month.id - 1] = month.accepted_weight
        newRefused[month.id - 1] = month.refused_weight
      })
      setDiverted(newDiverted)
      setRefused(newRefused)
    }
  }, [wasteData])

  return (
    <>
      <Title level={5} className="font-600">
        {MESSAGES.WASTE_DIVERSION_RATE}
      </Title>
      <Row gutter={24} className="waste">
        <Col xs={12} sm={12} md={6} lg={5} xl={6} xxl={6} className="order1">
          <div className="chart-cards">
            <DoughnutChart
              diverted={wasteData?.percent_delivered}
              refused={wasteData?.percent_refused}
              customOptions={{ cutout: 34, radius: 55 }}
            />
          </div>
          <Row className="green">
            <Text>
              <strong>{toDecimal(wasteData?.percent_delivered) || 0}%</strong>{' '}
              {MESSAGES.DIVERTED}
            </Text>
          </Row>
          <Row className="red">
            <Text>
              <strong>{toDecimal(wasteData?.percent_refused) || 0}%</strong>{' '}
              {MESSAGES.REFUSED}
            </Text>
          </Row>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={15}
          xl={14}
          xxl={14}
          className="order3 margin-30-resp"
        >
          <div style={{ width: '100%' }}>
            <GroupedBarChart diverted={diverted} refused={refused} />
          </div>
        </Col>
        <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4} className="order2">
          <div className="green mb-5">
            <Title level={2} className="mt-0 mb-0">
              {toDecimal(wasteData?.accepted) || 0}t
            </Title>
            <Text>{MESSAGES.WASTER_DIVERSION_LABEL_ACCEPTED}</Text>
          </div>
          <div className="red">
            <Title level={2} className="mt-0 mb-0">
              {toDecimal(wasteData?.refused) || 0}t
            </Title>
            <Text>{MESSAGES.WASTER_DIVERSION_LABEL_REFUSED}</Text>
          </div>
        </Col>
      </Row>
    </>
  )
}
