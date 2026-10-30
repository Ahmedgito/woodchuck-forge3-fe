'use client'
import { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import TreeGraph from '@/src/components/dashboard/dashboardStats/components/tree-graph'
import { DashboardStatsProvider } from '@/src/utils/context/dashboard-report-context'
import AdminWasteStreamStats from '@/src/components/dashboard/dashboardStats/components/waste-stream-stats/adminWasteStreamStats'
import ClientWasteStreamStats from '@/src/components/dashboard/dashboardStats/components/waste-stream-stats/clientWasteStreamStats'
import {
  DISPLAY_MAP_ROLES,
  MESSAGES,
  ROLES,
  ALL_CMS_KEY,
  ALL_LOCATIONS_KEY,
  LOCATION_TYPES_MAP,
} from '@/src/utils/constants/app-constants'
import DashboardMaps from '@/src/components/googleMaps/dashboardMaps'

const { Title } = Typography

export default function ExportDashboard() {
  const [report, setReport] = useState<any>(null)
  const [treeStats, setTreeStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const session = urlParams.get('sessionId')
    setSessionId(session)
  }, [])

  useEffect(() => {
    if (!sessionId) return

    let lastDataHash: string | null = null
    let isMounted = true

    const pollData = async () => {
      while (isMounted) {
        try {
          // 1️⃣ Check for reset signal from backend
          const resetRes = await fetch(
            `/api/dashboard-report-reset?sessionId=${sessionId}`
          )
          const { reset } = await resetRes.json()
          if (reset) {
            console.log(
              `[Dashboard] Reset signal received for session ${sessionId}`
            )
            setReport(null)
            setTreeStats(null)
            setLoading(true)
            lastDataHash = null
          }

          // 2️⃣ Check for new report data
          const res = await fetch(
            `/api/dashboard-report-data?sessionId=${sessionId}`
          )
          const data = await res.json()
          if (data && data.status !== 'no-data') {
            const dataHash = JSON.stringify(data)
            if (dataHash !== lastDataHash) {
              lastDataHash = dataHash
              setLoading(false)
              setReport(data)
              if (data.treeStats) setTreeStats(data.treeStats)
              console.log(`[Dashboard] Rendered new data for ${sessionId}`)
            }
          }

          // Poll every 1 second
          await new Promise((r) => setTimeout(r, 1000))
        } catch (err) {
          console.error('Polling error:', err)
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
    }

    pollData()
    return () => {
      isMounted = false
    }
  }, [sessionId])

  if (loading) return <div id="report-root">Waiting for data...</div>
  if (!report) return <div id="report-root">Waiting for data...</div>

  const useWeeklyData = report.weekly
  const {
    startDate: startDateValue = report.startDate ?? new Date(report.startDate),
    endDate: endDateValue = report.endDate ?? new Date(report.endDate),
  } = useWeeklyData
    ? {
        startDate: report.started,
        endDate: report.ended,
      }
    : {}

  // In export mode (reporting=true), use non-responsive layout to avoid infinite loops
  const isReporting = true

  // Export payload stores expanded `materialDestinations` (it strips `All` / `All CMS` keys),
  // so reconstruct them for display in the report top bar.
  const rawMapData = report?.mapData?.data ? report.mapData.data : report?.mapData
  const allLocationKeys: string[] = Array.isArray(rawMapData?.locations)
    ? rawMapData.locations.map((loc: any) => `${loc.entryType || 'location'}_${loc.id}`)
    : []
  const allPowerplantKeys: string[] = Array.isArray(rawMapData?.locations)
    ? rawMapData.locations
        .filter((loc: any) => loc.entryType === LOCATION_TYPES_MAP.powerplant)
        .map((loc: any) => `${LOCATION_TYPES_MAP.powerplant}_${loc.id}`)
    : []

  const selectedKeysFromReport: string[] = Array.isArray(report?.materialDestinations)
    ? report.materialDestinations.map((dest: any) => `${dest.type}_${dest.id}`)
    : []

  const selectedSet = new Set(selectedKeysFromReport)
  const isAllSelected =
    allLocationKeys.length > 0 && allLocationKeys.every((k) => selectedSet.has(k))
  const isAllCMSSelected =
    allPowerplantKeys.length > 0 &&
    allPowerplantKeys.every((k) => selectedSet.has(k)) &&
    // ensure there are no non-powerplant selections
    selectedKeysFromReport.every((k) => k.startsWith(`${LOCATION_TYPES_MAP.powerplant}_`))

  // CMS reports are locked to the client's portal scope (Waste Type = "Wood Waste",
  // Offtake = "All CMS" = all powerplants). Because the backend filters the data to
  // powerplants only, `mapData.locations` contains just powerplants, which would make
  // `isAllSelected` true and mislabel the offtake as "All". Force the "All CMS" label
  // for CMS reports so it matches the portal view.
  const isCMSReport = report?.role?.enum === ROLES.CMS

  // An empty `materialDestinations` means "all destinations" — the export payload
  // strips the `All` / `All CMS` marker keys (exportFilteredReportViewModal) and the
  // backend treats an empty list as no filter (applyWasteStreamStatsFilters). Without
  // this branch the offtake filter would render empty/red instead of "All" for the
  // default (everything-selected) report.
  const selectedEndpointKeys = isCMSReport
    ? [ALL_CMS_KEY, ...allPowerplantKeys]
    : selectedKeysFromReport.length === 0
      ? [ALL_LOCATIONS_KEY, ...allLocationKeys]
      : isAllSelected
        ? [ALL_LOCATIONS_KEY, ...selectedKeysFromReport]
        : isAllCMSSelected
          ? [ALL_CMS_KEY, ...selectedKeysFromReport]
          : selectedKeysFromReport
  return (
    <DashboardStatsProvider>
      <div className="container" id="report-root">
        {isReporting ? (
          <div className="mt-5" style={{ marginBottom: 24 }}>
            <Title>{MESSAGES.DASHBOARD}</Title>
          </div>
        ) : (
          <Row gutter={24} align="middle" className="mt-5">
            <Col xs={24} lg={12}>
              <Title>{MESSAGES.DASHBOARD}</Title>
            </Col>
          </Row>
        )}

        <section className="container white-area mt-5">
          {DISPLAY_MAP_ROLES.includes(report?.role.enum) && report?.mapData && (
            <DashboardMaps
              data={
                report.mapData.data
                  ? report.mapData
                  : { data: report.mapData, status: 'success' }
              }
              reporting={isReporting}
              selectedWasteType={report?.wasteType || 'All'}
              reportingSelectedEndpointKey={selectedEndpointKeys}
              userRole={report?.role.enum}
            />
          )}
          {treeStats && (
            <TreeGraph
              data={treeStats}
              isPowerPlant={false}
              clientId={1}
              photo={report?.photo}
              mute={false}
              showImage={!!report?.photo}
              reporting={isReporting}
              fromDashboard={true}
              userRole={report?.role.enum}
            />
          )}
        </section>
      </div>

      {report?.role.enum === ROLES.ADMIN || report?.role.enum === ROLES.CMS ? (
        <AdminWasteStreamStats
          exportMode
          jobSite={report.jobSite}
          clients={report.clients}
          clientIds={report.clientIds}
          wasteStreamDataByMonth={report.wasteStreamDataByMonth}
          startDateFilter={startDateValue}
          endDateFilter={endDateValue}
          weekly={report.weekly}
        />
      ) : (
        <ClientWasteStreamStats
          exportMode
          jobSite={report.jobSite}
          jobSites={report.jobSites}
          jobsiteIds={report.jobsiteIds}
          wasteStreamDataByMonth={report.wasteStreamDataByMonth}
          startDateFilter={startDateValue}
          endDateFilter={endDateValue}
          weekly={report.weekly}
        />
      )}
    </DashboardStatsProvider>
  )
}
