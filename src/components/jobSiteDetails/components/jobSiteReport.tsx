import './style.scss'
import { Typography, Row, Col, DatePicker } from 'antd'
import {
  getEndOfMonthISO,
  getStartOfMonthISO,
  dayjs,
} from '@/src/utils/functions/getDate'
import {
  Accumulator,
  CREATE_JOB_SITE,
  DUMPSTER_GRAPH_TYPE,
  DUMPSTER_OPTIONS,
  WASTE_STATS,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import { DATE_FORMAT, MESSAGES } from '@/src/utils/constants/app-constants'
import TreeGraph from '../../dashboard/dashboardStats/components/tree-graph'
import MonthWiseGraph from './dumpster-bar-chart/monthWiseGraph'
import { useEffect, useRef, useState } from 'react'
import {
  calculateMonthWiseCumulativeState,
  reduceDumpsterTypeWise,
  reduceWasteStreamWise,
} from '@/src/utils/functions/mapReducers'
import { useLoader } from '@/src/utils/context/loader-context'
import DumpsterChartContainer from './dumpsterChartContainer'
import CollapseTitle from '../../common/collapseTitle'
import CollapseTab from '../../common/collapse'

const { Title } = Typography

export default function JobsiteReport({
  targetRef,
  jobDetails,
  startDateFilter,
  endDateFilter,
  treeStats,
  treeGraphProps,
  pageRefresh,
  setPageRefresh,
  reporting,
  setImages,
  display,
  setImagesCount,
  wasteStreamList,
  dumpsterStats,
  dumpsterOptions,
  isAdmin,
}: {
  targetRef: React.RefObject<HTMLDivElement>
  jobDetails: CREATE_JOB_SITE | undefined
  startDateFilter: string | Date | undefined
  endDateFilter: string | undefined
  treeStats: WASTE_STATS | undefined
  treeGraphProps: any
  pageRefresh: boolean
  setPageRefresh: React.Dispatch<React.SetStateAction<boolean>>
  reporting: boolean
  setImages: React.Dispatch<React.SetStateAction<any>>
  display: string
  setImagesCount: React.Dispatch<React.SetStateAction<number>>
  wasteStreamList: WASTE_TYPE[]
  dumpsterStats: DUMPSTER_GRAPH_TYPE | null
  dumpsterOptions: DUMPSTER_OPTIONS
  isAdmin?: boolean
}) {
  const { RangePicker } = DatePicker
  const date = dayjs(endDateFilter ?? new Date())
  const lastDayOfMonth = getEndOfMonthISO(date)

  const startDate = new Date(
    startDateFilter ??
      jobDetails?.startDate ??
      jobDetails?.createdAt ??
      new Date()
  )
  console.log('TREE GRAPH PROPS JOB SITE REPORT: ', treeGraphProps)
  const [data, setData] = useState<Accumulator[]>([])
  const [overallVessels, setOverallVessels] = useState<number>(0)
  const [overallWeight, setOverallWeight] = useState<number>(0)
  const [overallCarbonCredits, setOverallCarbonCredits] = useState<number>(0)
  const [overallRecycles, setOverallRecycles] = useState<number>(0)
  const [totalWeightDiverted, setTotalWeightDiverted] = useState<number>(0)
  const [dumpsterTypes, setDumpsterTypes] = useState<string[]>([])
  const imageRef = useRef<HTMLDivElement>(null)
  const { loading } = useLoader()

  useEffect(() => {
    if (dumpsterStats) {
      const newData = reduceDumpsterTypeWise(dumpsterStats.jobSitesWasteStreams)
      const data = reduceWasteStreamWise(newData, null)
      setDumpsterTypes(Object.keys(newData))
      setData(data)
    }
  }, [dumpsterStats])

  useEffect(() => {
    setOverallVessels(0)
    setOverallWeight(0)
    setOverallCarbonCredits(0)
    setOverallRecycles(0)
    setTotalWeightDiverted(0)
    Object.entries(data).forEach(([, value]) => {
      Object.entries(value).forEach(([, value]) => {
        Object.entries(value).forEach(([, value]) => {
          const {
            totalVessels,
            totalWeight,
            totalCarbonCredits,
            totalRecycles,
            totalWeightDiverted,
          } = calculateMonthWiseCumulativeState(value)
          setOverallVessels((prev: number) => prev + totalVessels)
          setOverallWeight((prev: number) => prev + totalWeight)
          setOverallCarbonCredits((prev: number) => prev + totalCarbonCredits)
          setOverallRecycles((prev: number) => prev + totalRecycles)
          setTotalWeightDiverted((prev: number) => prev + totalWeightDiverted)
        })
      })
    })
  }, [data, dumpsterTypes])
  console.log('reporting', reporting)
  const startDay = getStartOfMonthISO(startDate)
  return (
    <div style={{ display: display }}>
      <div ref={targetRef} className="pdf-report">
        <Row align="middle" gutter={[0, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Title className="mt-0 mb-0" level={4}>
              {jobDetails?.title} - {jobDetails?.clientName}
            </Title>
          </Col>
          {/* {startDateFilter && endDateFilter && (
            <Col
              xs={24}
              sm={24}
              md={14}
              lg={12}
              xl={12}
              className="align-right"
            >
              <RangePicker
                value={[dayjs(startDateFilter), dayjs(endDateFilter)]}
                format={DATE_FORMAT.MM_DD_YYYY}
              />
            </Col>
          )} */}
        </Row>

        {treeStats && (
          <CollapseTab
            className="collapse-primary title-lg for-grey-bg mt-2"
            items={[
              {
                key: '1',
                label: (
                  <CollapseTitle
                    title={
                      <h1 className="mt-2">
                        {dayjs(startDay).format(DATE_FORMAT.MMM_YYYY)}
                        {` - `}
                        {dayjs(lastDayOfMonth).format(DATE_FORMAT.MMM_YYYY)}
                      </h1>
                    }
                  />
                ),
                children: (
                  <TreeGraph data={treeStats} {...treeGraphProps} reporting />
                ),
              },
            ]}
            activeKey={1}
          />
        )}

        <Title level={1} className="vessel-overview">
          {MESSAGES.VESSEL_OVERVIEW}
        </Title>
        <MonthWiseGraph
          data={data}
          setRefresh={setPageRefresh}
          dumpsterStats={dumpsterStats as DUMPSTER_GRAPH_TYPE}
          endDate={lastDayOfMonth}
          wasteStreamId={null}
          vesselType={null}
          overallVessels={overallVessels}
          overallWeight={overallWeight}
          overallCarbonCredits={overallCarbonCredits}
          overallRecycles={overallRecycles}
          totalWeightDiverted={totalWeightDiverted}
          readOnly={true}
          reporting={reporting}
          isAdmin={isAdmin}
        />
        <DumpsterChartContainer
          jobSiteDetailsData={jobDetails}
          reporting={reporting}
          isAdmin={isAdmin}
          pageRefresh={pageRefresh}
          setPageRefresh={setPageRefresh}
          setImages={setImages}
          setImagesCount={setImagesCount}
          wasteStreamList={wasteStreamList}
          dumpsterOptions={dumpsterOptions}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
        />
      </div>

      {/* <DumspterChart
        startDate={startDay}
        endDate={lastDayOfMonth}
        jobsiteId={jobDetails?.id}
        refresh={pageRefresh}
        reporting={reporting}
        monthName={'job-site-stats'}
        setImages={setImages}
        setRefresh={setPageRefresh}
      /> */}

      {/* <DumpsterChartContainer
        jobSiteDetailsData={jobDetails}
        reporting={reporting}
        pageRefresh={pageRefresh}
        setPageRefresh={setPageRefresh}
        setImages={setImages}
        setImagesCount={setImagesCount}
        wasteStreamList={wasteStreamList}
      /> */}
    </div>
  )
}
