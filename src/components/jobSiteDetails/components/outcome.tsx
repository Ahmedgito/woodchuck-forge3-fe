'use client'
import { Typography, Row, Col } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useEffect, useState } from 'react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getOutcome } from '@/src/services/jobsite'
import { useLoader } from '@/src/utils/context/loader-context'
import toDecimal from '@/src/utils/functions/decimalConversion'

interface OutcomeData {
  avoided: number
  produced: number
  waste: number
  hauled: string
}
export default function Outcome({
  id,
  from,
  to,
  refresh,
}: {
  id: number | null | undefined
  to: string | undefined
  from: string | undefined
  refresh?: boolean
}) {
  const triggerNotification = useTriggerNotification()
  const [outcomeData, setOutcomeData] = useState<OutcomeData | null>(null)
  const { Title, Text } = Typography
  const { setLoading } = useLoader()

  const getOutcomeData = async () => {
    try {
      setLoading(true)
      let result = await getOutcome(id, from, to)
      setOutcomeData(result.data.data)
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
    getOutcomeData()
  }, [id, from, to, refresh])

  return (
    <>
      <section className="outcome">
        <Title level={5} className="font-600">
          {MESSAGES.OUTCOME}
        </Title>
        <Row gutter={24}>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className="mt-5"
          >
            <div className="icon-box">
              <i className="icon-leaf font-36"></i>
              <div className="text">
                <Title>
                  {toDecimal(outcomeData?.avoided) || 0} <span>t</span>
                </Title>
                <Text>
                  {MESSAGES.CO}
                  <sub>2</sub>
                  {` ${MESSAGES.AVOIDED}`}
                </Text>
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className="mt-5 red"
          >
            <div className="icon-box">
              <i className="icon-truck"></i>
              <div className="text">
                <Title>
                  {toDecimal(outcomeData?.produced) || 0} <span>t</span>
                </Title>
                <Text>
                  {MESSAGES.CO}
                  <sub>2</sub> {MESSAGES.PRODUCED}
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className="mt-5"
          >
            <div className="icon-box">
              <i className="icon-recycled font-36"></i>
              <div className="text">
                <Title>
                  {toDecimal(outcomeData?.waste) || 0} <span>t</span>
                </Title>
                <Text>{MESSAGES.WASTE_RECYCLED}</Text>
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className="mt-5"
          >
            <div className="icon-box">
              <i className="icon-truck"></i>
              <div className="text">
                <Title>
                  {parseFloat(
                    (outcomeData?.hauled as string) || '0'
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  <span>{MESSAGES.MI}</span>
                </Title>
                <Text>{MESSAGES.TOTAL_HAULED}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  )
}
