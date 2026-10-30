import {
  Accumulator,
  DUMPSTER_GRAPH_TYPE,
  JobSitesWasteStreamsEntity,
} from '@/src/utils/constants/types'
import React, { useState } from 'react'
import MonthWiseWasteStreams from './monthWiseWasteStreams'
import styles from './styles.module.scss'
import { Col, Divider, Image, Row, Typography } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import EmptyData from '@/src/components/settings/empty-data'

type Props = {
  data: Accumulator[]
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  dumpsterStats: DUMPSTER_GRAPH_TYPE
  endDate: string
  wasteStreamId: string | null
  vesselType: string | null
  overallVessels: number
  overallWeight: number
  overallCarbonCredits: number
  overallRecycles: number
  totalWeightDiverted: number
  readOnly?: boolean
  disabled?: boolean
  reporting?: boolean
  showReportImages?: boolean
  isAdmin?: boolean
  isActive?: boolean
}

function MonthWiseGraph({
  data,
  setRefresh,
  dumpsterStats,
  endDate,
  wasteStreamId,
  vesselType,
  overallVessels,
  overallWeight,
  overallCarbonCredits,
  overallRecycles,
  totalWeightDiverted,
  readOnly = false,
  disabled = false,
  reporting = false,
  showReportImages = true,
  isAdmin,
  isActive,
}: Props) {
  const [selectModeSubId, setSelectModeSubId] = useState<number | null>(null)
  const [selectedVessels, setSelectedVessels] = useState<number[]>([])

  // Check if filtering should be applied: only for export page AND non-admin role
  const shouldApplyFiltering = reporting && isAdmin !== undefined && !isAdmin

  // Helper function to check if a waste stream has vessels
  const hasVessels = (wasteStream: JobSitesWasteStreamsEntity): boolean => {
    return wasteStream.jobSitesWasteStreamsDumpsters.length > 0
  }

  // Helper function to filter value object for reporting mode
  const filterValueForReporting = (value: {
    [key: string]: JobSitesWasteStreamsEntity[]
  }): { [key: string]: JobSitesWasteStreamsEntity[] } => {
    if (!shouldApplyFiltering) {
      return value
    }

    const filtered: { [key: string]: JobSitesWasteStreamsEntity[] } = {}

    Object.entries(value).forEach(([subKey, subValue]) => {
      // Filter waste streams to only include those with vessels
      const wasteStreamsWithVessels = subValue.filter(hasVessels)

      // Only include container type if there are waste streams with vessels
      if (wasteStreamsWithVessels.length > 0) {
        filtered[subKey] = wasteStreamsWithVessels
      }
    })

    return filtered
  }

  // Helper function to check if a month entry should be included
  const shouldIncludeMonthEntry = ([_key, value]: [
    string,
    { [key: string]: JobSitesWasteStreamsEntity[] },
  ]): boolean => {
    // Filter value for reporting mode
    const filteredValue = filterValueForReporting(value)
    // Skip if no container types remain after filtering
    if (shouldApplyFiltering && Object.keys(filteredValue).length === 0) {
      return false
    }
    // Original filter: check if there's any data for that month
    return Object.entries(value).some(([_key, value]) => value.length > 0)
  }

  // Check if there's any data to render
  const hasRenderedData = data.some((item) => {
    const filteredEntries = Object.entries(item).filter(shouldIncludeMonthEntry)
    return filteredEntries.length > 0
  })

  return (
    <div>
      {data
        .map((item, index) => {
          // Filter entries first
          const filteredEntries = Object.entries(item).filter(
            shouldIncludeMonthEntry
          )

          // Skip rendering if no entries remain after filtering
          if (filteredEntries.length === 0) {
            return null
          }

          return (
            <div className={styles.dumpster_chart_wrapper} key={index}>
              {filteredEntries.map(([key, value]) => {
                // Filter value for reporting mode
                const filteredValueForMonth = filterValueForReporting(value)

                return (
                  <div key={key} className={styles.chart_container}>
                    <h2 className={styles.month_name}>
                      {key.replace(/_/g, ' ')}
                    </h2>
                    <MonthWiseWasteStreams
                      value={filteredValueForMonth}
                      setRefresh={setRefresh}
                      endDate={endDate}
                      wasteStreamId={wasteStreamId}
                      vesselType={vesselType}
                      readOnly={readOnly}
                      disabled={disabled}
                      reporting={reporting}
                      showReportImages={showReportImages}
                      shouldApplyFiltering={shouldApplyFiltering}
                      selectModeSubId={selectModeSubId}
                      setSelectModeSubId={setSelectModeSubId}
                      selectedVessels={selectedVessels}
                      setSelectedVessels={setSelectedVessels}
                      isActive={isActive}
                      index={index}
                    />
                  </div>
                )
              })}
            </div>
          )
        })
        .filter((item) => item !== null)}
      {hasRenderedData && <Divider className="mt-0 mb-0" />}
      {data.length > 0 ? (
        <div className={styles.totalSection}>
          <h1 className="total-moved-heading mb-4">Totals</h1>
          <Row className="total-moved-container mb-16">
            <Col sm={3} xs={12}>
              <Typography.Text>{'TOTAL VESSELS:'}</Typography.Text>
              <Typography.Title level={2}>{overallVessels}</Typography.Title>
            </Col>
            <Col sm={4} xs={12}>
              <Typography.Text>{'TOTAL WEIGHT:'}</Typography.Text>
              <Typography.Title level={2}>
                {Math.round(Number(overallWeight.toFixed(1))) + ' tn'}
              </Typography.Title>
            </Col>
            <Col sm={4} xs={12}>
              <Typography.Text>{'CARBON CREDITS:'}</Typography.Text>
              <Typography.Title level={2}>
                {Math.round(Number(overallCarbonCredits)) + ' tn'}
              </Typography.Title>
            </Col>
            <Col sm={4} xs={12}>
              <Typography.Text>{'RECYCLING REBATES:'}</Typography.Text>
              <Typography.Title level={2}>
                {'$ ' + overallRecycles}
              </Typography.Title>
            </Col>
            <Col sm={4} xs={12} className="total-weight-diverted">
              <Typography.Text>
                {'TOTAL WEIGHT DIVERTED/RECYCLED:'}
              </Typography.Text>
              <Typography.Title level={2}>
                {Math.round(Number((totalWeightDiverted || 0).toFixed(1))) + ' tn'}
              </Typography.Title>
            </Col>
            <Col sm={4} xs={12}>
              <Typography.Text>{'WASTE DIVERSION:'}</Typography.Text>
              <div className="flex flex-row items-center gap-5">
                <Typography.Title level={2}>
                  {dumpsterStats?.waste_diversion || 0}%
                </Typography.Title>
                <Image
                  src={'/images/chart/leaf-icon.svg'}
                  alt={'icon'}
                  preview={false}
                />
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <EmptyData message={MESSAGES.NO_WASTE_STREAMS_ADDED} />
      )}
    </div>
  )
}

export default MonthWiseGraph
