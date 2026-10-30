'use client'
import './style.scss'
import { Typography, Row, Col } from 'antd'
import { DATE_FORMAT, MESSAGES } from '@/src/utils/constants/app-constants'
import {
  getStartOfMonthISO,
  getEndOfMonthISO,
  dayjs,
  getEndOfWeekISO,
  getStartOfWeekISO,
} from '@/src/utils/functions/getDate'
import DumpsterRequestNotification from './dumpsterRequest'
import {
  Accumulator,
  CREATE_JOB_SITE,
  DUMPSTER_GRAPH_TYPE,
  NOTIFICATION_TYPE,
  WASTE_STATS,
} from '@/src/utils/constants/types'
import { JOB_SITE_STATUS } from '@/src/utils/constants/app-constants'
import { updateDumpsterSms } from '@/src/services/jobsite'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { readNotification } from '@/src/services/user'
import { useLoader } from '@/src/utils/context/loader-context'
import { useSocket } from '@/src/utils/context/socket-context'
import CollapseTitle from '../../common/collapseTitle'
import CollapseTab from '../../common/collapse'
import FilterHeader from './filterHeader'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import {
  calculateMonthWiseCumulativeState,
  reduceDumpsterTypeWise,
  reduceWasteStreamWise,
} from '@/src/utils/functions/mapReducers'
import MonthWiseGraph from './dumpster-bar-chart/monthWiseGraph'
import EmptyData from '../../settings/empty-data'
import TreeGraph from '../../dashboard/dashboardStats/components/tree-graph'
import { useReportContext } from '@/src/utils/context/report-generation-context'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'

const { Text } = Typography

export default function Header({
  jobDetails,
  startDateFilter,
  endDateFilter,
  setStartDateFilter,
  setEndDateFilter,
  notifications,
  onRefresh,
  exportReport,
  treeStats,
  newJobsite = false,
  uploadImage = false,
  pageRefresh,
  setPageRefresh,
  dumpsterStats,
  weekly = false,
  reporting = false,
  isAdmin,
}: {
  jobDetails: CREATE_JOB_SITE | undefined
  startDateFilter?: string | Date | undefined
  endDateFilter?: string | undefined
  setStartDateFilter: (_: string | Date) => void
  setEndDateFilter: (_: string) => void
  notifications?: NOTIFICATION_TYPE[]
  onRefresh?: () => void
  exportReport?: () => void
  treeStats: WASTE_STATS | undefined
  newJobsite?: boolean
  uploadImage?: boolean
  pageRefresh?: boolean
  setPageRefresh: Dispatch<SetStateAction<boolean>>
  dumpsterStats: DUMPSTER_GRAPH_TYPE | null
  weekly?: boolean
  reporting?: boolean
  isAdmin?: boolean
}) {
  const { Title } = Typography
  const triggerNotification = useTriggerNotification()
  const { setLoading, loading } = useLoader()
  const { setNotificationReceived } = useSocket() || {}

  const [data, setData] = useState<Accumulator[]>([])
  const [dumpsterTypes, setDumpsterTypes] = useState<string[]>([])
  const imageRef = useRef<HTMLDivElement>(null)
  const trigger = createTriggerNotification(triggerNotification)
  const [overallVessels, setOverallVessels] = useState<number>(0)
  const [overallWeight, setOverallWeight] = useState<number>(0)
  const [overallCarbonCredits, setOverallCarbonCredits] = useState<number>(0)
  const [overallRecycles, setOverallRecycles] = useState<number>(0)
  const [totalWeightDiverted, setTotalWeightDiverted] = useState<number>(0)
  const { jobsites, setJobsiteState } = useReportContext()
  const handleChange = async (
    notification: NOTIFICATION_TYPE,
    status: string
  ) => {
    try {
      setLoading(true)
      await updateDumpsterSms(notification.data.smsDumpsterId, status)
      await readNotification(notification.id)
      onRefresh && onRefresh()
      setNotificationReceived && setNotificationReceived(true)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.REQUEST_UPDATED_SUCCESS
      )
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
  const date = dayjs(endDateFilter ?? new Date())
  const lastDayOfMonth = weekly ? getEndOfWeekISO(date) : getEndOfMonthISO(date)

  const startDate = new Date(
    startDateFilter ??
      jobDetails?.startDate ??
      jobDetails?.createdAt ??
      new Date()
  )
  const startDay = weekly
    ? getStartOfWeekISO(startDate)
    : getStartOfMonthISO(startDate)
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
    Object.entries(data).forEach(([key, value]) => {
      Object.entries(value).forEach(([key, value]) => {
        Object.entries(value).forEach(([key, value]) => {
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

  return (
    <>
      <Title className="mt-0" level={4}>
        <span className="font-semibold txt-uppercase">
          {MESSAGES.SITE_DETAIL}
        </span>
      </Title>
      <Row align="middle" className="site-haeder-info mb-3 mt-5">
        <Col span={24}>
          <Title className="mt-0 mb-0 head" level={1}>
            {jobDetails?.title}
          </Title>
        </Col>
        <Col span={24}>
          <i className="icon-user font-20"></i>
          <Text>{jobDetails?.clientName}</Text>
        </Col>
      </Row>
      <Row align="middle" className="py-5 sustainability-report-header">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Title className="mt-0 mb-0" level={1}>
            {`${MESSAGES.SUSTAINABILITY_REPORT} `}
          </Title>
        </Col>
        {!newJobsite && (
          <FilterHeader
            toDate={jobDetails?.startDate || jobDetails?.createdAt}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            setEndDateFilter={setEndDateFilter}
            endDateFilter={endDateFilter}
            exportReport={exportReport}
            setPageRefresh={setPageRefresh}
            closedAt={jobDetails?.closedAt}
            isJobSiteActive={
              jobDetails?.status?.name === JOB_SITE_STATUS.ACTIVE
            }
            isGenerating={
              jobDetails?.id
                ? jobsites[jobDetails.id]?.isGenerating || false
                : false
            }
            setIsGenerating={(v) => {
              if (jobDetails?.id) {
                setJobsiteState(jobDetails.id, { isGenerating: v })
              }
            }}
          />
        )}
      </Row>
      <CollapseTab
        className="collapse-primary title-lg for-grey-bg"
        items={[
          {
            key: '1',
            label: (
              <CollapseTitle
                title={
                  weekly ? (
                    `${startDay} - ${lastDayOfMonth}`
                  ) : (
                    <>
                      {dayjs(startDay).format(DATE_FORMAT.MMM_YYYY)}
                      {` - `}
                      {dayjs(lastDayOfMonth).format(DATE_FORMAT.MMM_YYYY)}
                    </>
                  )
                }
              />
            ),
            children: (
              <>
                <TreeGraph
                  data={treeStats}
                  powerPlantName={jobDetails?.powerplantsName}
                  clientId={jobDetails?.clientId}
                  photo={jobDetails?.photo}
                  mute={false}
                  showImage={jobDetails?.photo ? true : false}
                  setRefresh={setPageRefresh}
                  reporting={reporting}
                  isActiveJobsite={jobDetails?.status?.name === JOB_SITE_STATUS.ACTIVE}
                />
                <GenieButtonWrapper hint="vessel_overview_waste" className='vessel-overview-container'>
                  <Title level={1} className="vessel-overview">
                    {MESSAGES.VESSEL_OVERVIEW}
                  </Title>
                </GenieButtonWrapper>
                {!newJobsite && dumpsterTypes.length === 0 ? (
                  <section ref={imageRef}>{!loading && <EmptyData />}</section>
                ) : (
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
                )}
              </>
            ),
          },
        ]}
        activeKey={1}
      />
      <div className="scroll-bar">
        {notifications?.map((notification) => (
          <DumpsterRequestNotification
            handleChange={handleChange}
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </>
  )
}
