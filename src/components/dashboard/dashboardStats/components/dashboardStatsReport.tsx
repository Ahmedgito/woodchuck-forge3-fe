import { DATE_FORMAT, MESSAGES } from '@/src/utils/constants/app-constants'
import { Typography, Row, Col, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { WASTE_STATS } from '@/src/utils/constants/types'
import WasteStreamStats from './waste-stream-stats'
import TreeGraph from './tree-graph'

const { Title } = Typography

export default function DashboardStatsReport({
  targetRef,
  startDateFilter,
  endDateFilter,
  displayStyle,
  treeStats,
  treeGraphProps,
}: {
  targetRef: React.RefObject<HTMLDivElement>
  startDateFilter: string | Date | undefined
  endDateFilter: string | undefined
  displayStyle: string
  treeStats: WASTE_STATS | undefined
  treeGraphProps: any
}) {
  const { RangePicker } = DatePicker
  console.log('TREE GRAPH PROPS DASHBOARD REPORT: ', treeGraphProps)
  return (
    <section className="container" style={{ display: displayStyle }}>
      <div className="pdf-report" ref={targetRef}>
        {startDateFilter && endDateFilter && (
          <Row align="middle">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="align-right"
            >
              <RangePicker
                value={[dayjs(startDateFilter), dayjs(endDateFilter)]}
                format={DATE_FORMAT.MM_DD_YYYY}
              />
            </Col>
          </Row>
        )}
        <Title className="mt-0 mb-0 font-medium" level={4}>
          {MESSAGES.DASHBOARD_REPORT}
        </Title>
        {treeStats && (
          <>
            <TreeGraph data={treeStats} {...treeGraphProps} reporting />
          </>
        )}
      </div>
      <WasteStreamStats
        reporting={true}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
      />
    </section>
  )
}
