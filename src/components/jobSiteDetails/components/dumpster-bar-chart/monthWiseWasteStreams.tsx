import { JobSitesWasteStreamsEntity, WasteStreamImage } from '@/src/utils/constants/types'
import React, { useCallback, useEffect, useState } from 'react'
import MonthWiseWasteStreamTypes from './monthWiseWasteStreamTypes'
import { Col, Row, Typography } from 'antd'
import { calculateMonthWiseCumulativeState } from '@/src/utils/functions/mapReducers'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'
import { WasteStreamImageIndicator } from '@/src/components/waste-stream-images/WasteStreamImageViewer'
import { getWasteStreamImages } from '@/src/services/wasteStreamImages'
import { useReportImages } from '@/src/utils/context/report-images-context'

type Props = {
  value: {
    [key: string]: JobSitesWasteStreamsEntity[]
  }
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  endDate: string
  wasteStreamId: string | null
  vesselType: string | null
  readOnly: boolean
  disabled: boolean
  reporting?: boolean
  showReportImages?: boolean
  shouldApplyFiltering?: boolean
  overallVessels?: number
  overallWeight?: number
  overallCarbonCredits?: number
  overallRecycles?: number
  totalWeightDiverted?: number
  showOverallTotals?: boolean
  selectModeSubId: number | null
  setSelectModeSubId: React.Dispatch<React.SetStateAction<number | null>>
  selectedVessels: number[]
  setSelectedVessels: React.Dispatch<React.SetStateAction<number[]>>
  isActive?: boolean
  index: number
}

function MonthWiseWasteStreams({
  value,
  setRefresh,
  endDate,
  wasteStreamId,
  vesselType,
  readOnly,
  disabled,
  reporting = false,
  showReportImages = true,
  shouldApplyFiltering = false,
  selectModeSubId,
  setSelectModeSubId,
  selectedVessels,
  setSelectedVessels,
  isActive,
  index,
}: Props) {
  const [totalMoved, setTotalMoved] = useState<number>(0)
  const [totalWeight, setTotalWeight] = useState<number>(0)
  const [totalCarbonCredits, setTotalCarbonCredits] = useState<number>(0)
  const [totalRecyclingRebates, setTotalRecyclingRebates] = useState<number>(0)
  const reportImages = useReportImages()
  // null means we are outside a ReportImagesProvider (normal app context).
  // An empty object {} means inside a provider but the job site has no images.
  const hasPreloaded = reportImages !== null

  // Map from jobsiteWasteStreamId -> images (for client-side image indicator)
  const [imagesByWasteStream, setImagesByWasteStream] = useState<
    Record<number, WasteStreamImage[]>
  >(hasPreloaded ? reportImages : {})

  const handleMonthWiseCalculation = useCallback(() => {
    let totalVessels = 0
    let totalWeights = 0
    let totalCarbons = 0
    let totalRecycles = 0
    Object.entries(value)
      .filter(
        ([subKey]) =>
          subKey.split('_')[1] === wasteStreamId?.split('_')[0] ||
          !wasteStreamId
      )
      .map(([_subKey, subValue]) => {
        let data = subValue.filter(
          (subItem: JobSitesWasteStreamsEntity) =>
            subItem.wasteStreamType.id ===
              Number(wasteStreamId?.split('_')[1]) || !wasteStreamId
        )
        const {
          totalVessels: vessels,
          totalWeight: weights,
          totalCarbonCredits: carbons,
          totalRecycles: recycles,
        } = calculateMonthWiseCumulativeState(data)
        totalVessels += vessels
        totalWeights += weights
        totalCarbons += carbons
        totalRecycles += recycles
        return data
      })
    setTotalMoved(totalVessels)
    setTotalWeight(totalWeights)
    setTotalCarbonCredits(totalCarbons)
    setTotalRecyclingRebates(totalRecycles)
  }, [value, wasteStreamId])

  useEffect(() => {
    handleMonthWiseCalculation()
  }, [value, wasteStreamId, vesselType, handleMonthWiseCalculation])

  // Fetch images for the client-side indicator on all waste stream entries.
  // In the Puppeteer export context, images are already in the context — skip
  // the API call to avoid unauthenticated requests that would redirect the page.
  useEffect(() => {
    if (!reporting) return
    if (hasPreloaded) {
      // Images already loaded from the injected report data
      setImagesByWasteStream(reportImages)
      return
    }
    const allWasteStreams: JobSitesWasteStreamsEntity[] = Object.values(value).flat()
    const idSet = new Set(allWasteStreams.map((ws) => ws.id))
    const ids = Array.from(idSet)
    ids.forEach(async (id) => {
      try {
        const res = await getWasteStreamImages(id)
        const images: WasteStreamImage[] = Array.isArray((res as any).data?.data)
          ? (res as any).data.data
          : Array.isArray(res.data)
            ? res.data
            : []
        if (images.length > 0) {
          setImagesByWasteStream((prev) => ({ ...prev, [id]: images }))
        }
      } catch {
        // non-fatal
      }
    })
  }, [value, reporting, hasPreloaded, reportImages])

  // Helper function to calculate totals for a waste stream
  const calculateWasteStreamTotals = (
    wasteStream: JobSitesWasteStreamsEntity
  ) => {
    return calculateMonthWiseCumulativeState([wasteStream])
  }

  return (
    <div className="vessel-main">
      {Object.entries(value)
        .filter(
          ([subKey]) =>
            subKey.split('_')[1] === wasteStreamId?.split('_')[0] ||
            !wasteStreamId
        )
        .map(([subKey, subValue]) => {
          // Collect all images for the waste streams in this group (for reporting/client view)
          const groupImages = subValue.flatMap(
            (ws) => imagesByWasteStream[ws.id] ?? []
          )

          return (
            <div key={subKey}>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {subKey.split('_')[0]}
               
              </h1>
              {shouldApplyFiltering ? (
                // Filtering mode: Show each waste stream with vessels separately
                // Note: Data is already filtered in monthWiseGraph, so subValue only contains waste streams with vessels
                subValue.map((wasteStream) => {
                  const wasteStreamTotals =
                    calculateWasteStreamTotals(wasteStream)

                  return (
                    <div key={wasteStream.id}>
                      <MonthWiseWasteStreamTypes
                        subValue={[wasteStream]}
                        setRefresh={setRefresh}
                        endDate={endDate}
                        readOnly={readOnly}
                        disabled={disabled}
                        reporting={reporting}
                        showReportImages={showReportImages}
                        selectModeSubId={selectModeSubId}
                        setSelectModeSubId={setSelectModeSubId}
                        selectedVessels={selectedVessels}
                        setSelectedVessels={setSelectedVessels}
                        isActive={isActive}
                      />
                      <Row className="total-moved-container under">
                        <Col sm={3} xs={12}>
                          <Typography.Text>{'VESSELS:'}</Typography.Text>
                          <Typography.Title level={2}>
                            {wasteStreamTotals.totalVessels}
                          </Typography.Title>
                        </Col>
                        <Col sm={4} xs={12}>
                          <Typography.Text>{'WEIGHT:'}</Typography.Text>
                          <Typography.Title level={2}>
                            {Math.round(Number(wasteStreamTotals.totalWeight.toFixed(2))) + ' tn'}
                          </Typography.Title>
                        </Col>
                        <Col sm={4} xs={12}>
                          <Typography.Text>{'CARBON CREDITS:'}</Typography.Text>
                          <Typography.Title level={2}>
                            {Math.round(Number(wasteStreamTotals.totalCarbonCredits)) + ' tn'}
                          </Typography.Title>
                        </Col>
                        <Col sm={4} xs={12}>
                          <Typography.Text>
                            {'RECYCLING REBATES:'}
                          </Typography.Text>
                          <Typography.Title level={2}>
                            {'$ ' + wasteStreamTotals.totalRecycles}
                          </Typography.Title>
                        </Col>
                      </Row>
                    </div>
                  )
                })
              ) : (
                // Non-filtering mode: show all waste streams as before
                <MonthWiseWasteStreamTypes
                  subValue={subValue}
                  setRefresh={setRefresh}
                  endDate={endDate}
                  readOnly={readOnly}
                  disabled={disabled}
                  reporting={reporting}
                  showReportImages={showReportImages}
                  selectModeSubId={selectModeSubId}
                  setSelectModeSubId={setSelectModeSubId}
                  selectedVessels={selectedVessels}
                  setSelectedVessels={setSelectedVessels}
                  isActive={isActive}
                />
              )}
            </div>
          )
        })}
      {!shouldApplyFiltering && (
        <Row className="total-moved-container under">
          <Col sm={3} xs={12}>
            <Typography.Text>{'VESSELS:'}</Typography.Text>
            <Typography.Title level={2}>{totalMoved}</Typography.Title>
          </Col>
          {index == 0 && (
            <GenieButtonWrapper
              className="mb-4"
              hint="vessel_overview"
            >
              <></>
            </GenieButtonWrapper>
          )}
          <Col sm={4} xs={12}>
            <Typography.Text>{'WEIGHT:'}</Typography.Text>

            <Typography.Title level={2}>
              {Math.round(Number(totalWeight.toFixed(2))) + ' tn'}
            </Typography.Title>
          </Col>
          <Col sm={4} xs={12}>
            <Typography.Text>{'CARBON CREDITS:'}</Typography.Text>
            <Typography.Title level={2}>
              {Math.round(Number(totalCarbonCredits)) + ' tn'}
            </Typography.Title>
          </Col>
          <Col sm={4} xs={12}>
            <Typography.Text>{'RECYCLING REBATES:'}</Typography.Text>
            <Typography.Title level={2}>
              {'$ ' + totalRecyclingRebates}
            </Typography.Title>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default MonthWiseWasteStreams
