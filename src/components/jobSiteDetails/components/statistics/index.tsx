import CollectionStats from './collectionStats'
import MilageStats from './milageStats'
import { Divider, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { getStatistics } from '@/src/services/jobsite'
import { useLoader } from '@/src/utils/context/loader-context'
interface StatsData {
  total_collected: number
  total_recycled: number
  total_refused: number
  energy_generated: number
  mileage_stats1: number
  mileage_stats2: number
  mileage_stats3: number
  mileage_stats4: number
}

export default function Statistics({
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
  const triggerNotification = useTriggerNotification()
  const [statsData, setStatsData] = useState<StatsData | undefined>()
  const { setLoading } = useLoader()

  const getStatisticsData = async () => {
    try {
      setLoading(true)
      let result = await getStatistics(id, from, to)
      setStatsData(result.data.data)
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
    getStatisticsData()
  }, [id, from, to, refresh])
  return (
    <>
      <Row gutter={24} className="bk-images-pdf">
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <CollectionStats props={statsData} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <MilageStats
            mileage_stats1={statsData?.mileage_stats1}
            mileage_stats2={statsData?.mileage_stats2}
            mileage_stats3={statsData?.mileage_stats3}
            mileage_stats4={statsData?.mileage_stats4}
          />
        </Col>
      </Row>
      <Divider />
    </>
  )
}
