'use client'
import CollapseTab from '../../common/collapse'
import DumspterChart from './dumpster-bar-chart/dumpsterChart'
import CollapseTitle from '../../common/collapseTitle'
import { getMonths } from '@/src/utils/functions/getDate'
import {
  Accumulator,
  CREATE_JOB_SITE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_GRAPH_TYPE,
  DUMPSTER_OPTIONS,
  DUMPSTER_TRANSFORMED_OPTIONS,
  JobSitesWasteStreamsEntity,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import { useEffect, useState } from 'react'
import DumpsterChartFilters from '../dumpsterChartFilters'
import {
  transformVesselTypeData,
  transformWasteStreamData,
} from '@/src/utils/functions/htmlMappers'
import { Row, Typography } from 'antd'
import { JOB_SITE_STATUS, MESSAGES } from '@/src/utils/constants/app-constants'
import { fetchDumpsterStats } from '../jobSiteDataFetchers'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import {
  reduceDumpsterTypeWise,
  reduceWasteStreamWise,
} from '@/src/utils/functions/mapReducers'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'
import WeightTicketUploadFlow from './weightTicketUploadFlow'

const { Title } = Typography
export default function DumpsterChartContainer({
  jobSiteDetailsData,
  reporting,
  isAdmin,
  disabled,
  pageRefresh,
  setPageRefresh,
  setImages,
  setImagesCount,
  wasteStreamList,
  dumpsterOptions,
  readOnly = false,
  startDateFilter,
  endDateFilter,
  dumpsterDataByMonth,
}: {
  jobSiteDetailsData: CREATE_JOB_SITE | undefined
  reporting?: boolean
  isAdmin?: boolean
  disabled?: boolean
  pageRefresh: boolean
  setPageRefresh: React.Dispatch<React.SetStateAction<boolean>>
  setImages?: React.Dispatch<React.SetStateAction<any>>
  setImagesCount: React.Dispatch<React.SetStateAction<number>>
  wasteStreamList: WASTE_TYPE[]
  dumpsterOptions: DUMPSTER_OPTIONS
  readOnly?: boolean
  startDateFilter?: string | Date | undefined
  endDateFilter?: string | Date | undefined
  dumpsterDataByMonth?: Record<string, DUMPSTER_GRAPH_TYPE>
}) {
  const [vesselType, setVesselType] = useState<string | null>(null)
  const [wasteStreamId, setWasteStreamId] = useState<string | null>(null)
  const [wasteStreamDropDownOptions, setWasteStreamDropDownOptions] = useState<
    DUMPSTER_TRANSFORMED_OPTIONS[]
  >([])
  const [vesselTypeDropDownOptions, setVesselTypeDropDownOptions] =
    useState<DROP_DOWN_OPTIONS>([])
  const [dumpsterStats, setDumpsterStats] =
    useState<DUMPSTER_GRAPH_TYPE | null>(null)
  const [data, setData] = useState<Accumulator[]>([])
  const { loading, setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)

  useEffect(() => {
    setImagesCount(
      getMonths(jobSiteDetailsData, startDateFilter, endDateFilter).length + 1 // 1 for cummulative tree graph
    )
  }, [jobSiteDetailsData, startDateFilter, endDateFilter])

  const monthDetails = getMonths(
    jobSiteDetailsData,
    startDateFilter,
    endDateFilter
  )

  const fullRange = monthDetails.reduce(
    (acc, month) => {
      if (!acc.startDate || new Date(month.startDate) < new Date(acc.startDate)) {
        acc.startDate = month.startDate
      }
      if (!acc.endDate || new Date(month.endDate) > new Date(acc.endDate)) {
        acc.endDate = month.endDate
      }
      return acc
    },
    { startDate: '', endDate: '' }
  )

  useEffect(() => {
    // If precomputed data is provided, skip fetching initial stats
    if (dumpsterDataByMonth) return
    if (fullRange.startDate && fullRange.endDate && jobSiteDetailsData?.id) {
      fetchDumpsterStats({
        setState: setDumpsterStats,
        setLoading: setLoading,
        triggerNotification: trigger,
        startDate: fullRange.startDate,
        endDate: fullRange.endDate,
        id: jobSiteDetailsData.id,
        reporting: reporting,
      })
    }
  }, [
    jobSiteDetailsData?.id,
    dumpsterOptions,
    wasteStreamList,
    fullRange.startDate,
    fullRange.endDate,
  ])

  useEffect(() => {
    if (dumpsterStats) {
      const newData = reduceDumpsterTypeWise(dumpsterStats.jobSitesWasteStreams)
      const data = reduceWasteStreamWise(
        Object.fromEntries(
          Object.entries(newData).filter(
            ([key]) => key === vesselType || !vesselType
          ) // Filter by vesselType if provided
        ),
        wasteStreamId
      )
      setData(data)
    }
  }, [dumpsterStats, vesselType, wasteStreamId])

  useEffect(() => {
    // Process dropdown options based on available data
    let tempWasteStreamList = wasteStreamList.map((item) => ({
      ...item,
      disabled: true,
      wasteStreamTypes: item.wasteStreamTypes.map((wasteStreamType) => ({
        ...wasteStreamType,
        disabled: true,
      })),
    }))

    let tempVesselTypeList = dumpsterOptions.map((item) => ({
      ...item,
      disabled: true,
    }))

    // Only enable options if we have valid data
    if (data && data.length > 0) {
      const enabledVesselTypes = new Set<string | number>()

      data.forEach((item) =>
        Object.entries(item).forEach(([vesselKey, wasteStreamGroups]) => {
          // Check if this vessel type has any data
          if (
            Object.entries(wasteStreamGroups).some(
              ([key, streams]) => streams.length > 0
            )
          ) {
            enabledVesselTypes.add(vesselKey)
          }

          // Enable waste stream types that have data
          Object.entries(wasteStreamGroups).forEach(
            ([wasteStreamKey, streams]) => {
              const wasteStreamId = wasteStreamKey.split('_')[1]
              const enabledWasteStreamTypes = streams.map(
                (stream: JobSitesWasteStreamsEntity) =>
                  stream.wasteStreamType.id
              )

              tempWasteStreamList = tempWasteStreamList.map((wasteStream) => {
                if (wasteStream.id === Number(wasteStreamId)) {
                  return {
                    ...wasteStream,
                    disabled: false,
                    wasteStreamTypes: wasteStream.wasteStreamTypes.map(
                      (wasteStreamType) => ({
                        ...wasteStreamType,
                        disabled: !enabledWasteStreamTypes.includes(
                          wasteStreamType.id
                        ),
                      })
                    ),
                  }
                }
                return wasteStream
              })
            }
          )
        })
      )

      // Enable vessel types that have data
      tempVesselTypeList = tempVesselTypeList.map((vessel) => ({
        ...vessel,
        disabled: !enabledVesselTypes.has(vessel.key || ''),
      }))
    }

    setVesselTypeDropDownOptions(transformVesselTypeData(tempVesselTypeList))
    setWasteStreamDropDownOptions(transformWasteStreamData(tempWasteStreamList))
  }, [data])

  const defaultItems = monthDetails.map((month, index) => ({
    key: reporting ? 1 : index + 1,
    label: <CollapseTitle title={month.name} />,
    children: (
      <DumspterChart
        startDate={month.startDate}
        endDate={month.endDate}
        jobsiteId={jobSiteDetailsData?.id}
        disabled={disabled}
        refresh={pageRefresh}
        reporting={reporting}
        monthName={`months/${month.name}`}
        setRefresh={setPageRefresh}
        setImages={setImages}
        vesselType={vesselType}
        wasteStreamId={wasteStreamId}
        dumpsterOptions={dumpsterOptions}
        wasteStreamList={wasteStreamList}
        setVesselTypeDropDownOptions={setVesselTypeDropDownOptions}
        setWasteStreamDropDownOptions={setWasteStreamDropDownOptions}
        readOnly={readOnly}
        dumpsterData={dumpsterDataByMonth?.[month.name]}
        isAdmin={isAdmin}
        isActive={jobSiteDetailsData?.status?.name === JOB_SITE_STATUS.ACTIVE}
      />
    ),
  }))

  const activeKey = reporting ? 1 : []

  return (
    <>
      <Row className="monthly-reports-container">
         <GenieButtonWrapper hint="monthly_reports_filters">
        <Title level={2} className="monthly-reports">
          {MESSAGES.MONTHLY_REPORTS}
        </Title>
        </GenieButtonWrapper>
        {!reporting && (
          <WeightTicketUploadFlow
            jobSiteDetailsData={jobSiteDetailsData}
            wasteStreams={dumpsterStats?.jobSitesWasteStreams ?? []}
            disabled={disabled}
            onApplied={() => {
              if (
                fullRange.startDate &&
                fullRange.endDate &&
                jobSiteDetailsData?.id
              ) {
                fetchDumpsterStats({
                  setState: setDumpsterStats,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                  startDate: fullRange.startDate,
                  endDate: fullRange.endDate,
                  id: jobSiteDetailsData.id,
                  reporting: reporting,
                })
              }
              setPageRefresh(true)
            }}
          />
        )}
       
      </Row>
      {!reporting && (
        <DumpsterChartFilters
          vesselTypeDropDownOptions={vesselTypeDropDownOptions}
          wasteStreamDropDownOptions={wasteStreamDropDownOptions}
          vesselType={vesselType}
          setVesselType={setVesselType}
          wasteStreamId={wasteStreamId}
          setWasteStreamId={setWasteStreamId}
          loading={loading}
        />
      )}
      <CollapseTab
        className="collapse-primary vessel-header"
        items={defaultItems}
        activeKey={activeKey}
      />
    </>
  )
}
