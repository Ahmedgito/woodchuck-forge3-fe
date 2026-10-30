'use client'
import { Button, Col, Row, Typography } from 'antd'
import FilterHeader from '../../jobSiteDetails/components/filterHeader'
import { useEffect, useRef, useState } from 'react'
import {
  DISPLAY_MAP_ROLES,
  MESSAGES,
  ROLES,
} from '@/src/utils/constants/app-constants'
import generatePDF, { Options, Resolution, Margin } from 'react-to-pdf'
import { useLoader } from '@/src/utils/context/loader-context'
import { CmsUserType, WASTE_STATS } from '@/src/utils/constants/types'
import WasteStreamStats from './components/waste-stream-stats'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useDashboardStats } from '@/src/utils/context/dashboard-report-context'
import TreeGraph from './components/tree-graph'
import { useReportContext } from '@/src/utils/context/report-generation-context'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'
import DashboardMaps from '../../googleMaps/dashboardMaps'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getMapData, getMapStats } from '@/src/services/global'
import { useSession } from 'next-auth/react'
import { getFirstJobSite } from '@/src/services/jobsite'
import { useUser } from '@/src/utils/context/user-context'

const { Title, Text } = Typography

export default function DashboardStats({
  setStartDate,
  setEndDate,
  setDisplayStyle,
  targetRef,
  treeStats,
  treeGraphProps,
  reporting,
  setReporting,
  startDate,
  endDate,
  selectedEndpointKey,
  setSelectedEndpointKey,
  selectedWasteType,
  setSelectedWasteType,
  selectedMaterialDestinationForReporting,
  setSelectedMaterialDestinationForReporting,
}: {
  targetRef: React.RefObject<HTMLDivElement>
  treeStats: WASTE_STATS | undefined
  treeGraphProps: any
  reporting: boolean
  setStartDate: (_: string | Date) => void
  setEndDate: (_: string) => void
  setDisplayStyle: React.Dispatch<React.SetStateAction<string>>
  setReporting: React.Dispatch<React.SetStateAction<boolean>>
  startDate?: string | Date
  endDate?: string
  selectedEndpointKey: 'All' | string
  setSelectedEndpointKey: React.Dispatch<React.SetStateAction<'All' | string>>
  selectedWasteType: string
  setSelectedWasteType: React.Dispatch<React.SetStateAction<string>>
  selectedMaterialDestinationForReporting: string[]
  setSelectedMaterialDestinationForReporting: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [startDateFilter, setStartDateFilter] = useState<string | Date>()
  const [endDateFilter, setEndDateFilter] = useState<string>()
  const { dashboard, setDashboardState } = useReportContext()
  const [mapData, setMapData] = useState<any>({})
  const triggerNotification = useTriggerNotification()

  const { data: session } = useSession()
  const userRole = session?.user.role.enum
  const { setLoading } = useLoader()
  const prevMapParamsRef = useRef<{
    userRole?: string
    startDate?: string | Date
    endDate?: string
  }>({})
  const hasSetDefaultWasteTypeRef = useRef(false)
  const hasSetCMSDefaultWasteTypeRef = useRef(false)
  const {
    images,
    setImages,
    imagesCount,
    setImagesCount,
    firstJobSiteFetched,
    firstJobSite,
    setFirstJobSite,
    setFirstJobSiteFetched,
  } = useDashboardStats()
  const { user } = useUser()

  // Set "Wood Waste" as default for CMS users when map data is loaded
  useEffect(() => {
    if (
      !hasSetCMSDefaultWasteTypeRef.current &&
      userRole === ROLES.CMS &&
      mapData?.data?.wasteStreams &&
      Array.isArray(mapData.data.wasteStreams) &&
      mapData.data.wasteStreams.length > 0 &&
      selectedWasteType === 'All'
    ) {
      const wasteStreams = mapData.data.wasteStreams
      // Find Wood Waste (case-insensitive check)
      const woodWasteStream = wasteStreams.find(
        (ws: { name: string }) =>
          ws.name?.toUpperCase() === 'WOOD WASTE' ||
          ws.name === 'WOOD WASTE' ||
          ws.name === 'Wood waste' ||
          ws.name === 'Wood Waste'
      )
      if (woodWasteStream) {
        // Use the exact name from the waste stream to maintain consistency
        setSelectedWasteType(woodWasteStream.name)
        hasSetCMSDefaultWasteTypeRef.current = true
      }
    }
  }, [userRole, mapData, selectedWasteType, setSelectedWasteType])
  // Clear images when filters change to avoid stale data
  useEffect(() => {
    if (reporting) {
      setImages([])
    }
  }, [startDateFilter, endDateFilter, reporting])

  const onExportReport = async () => {
    setLoading(true)
    const options: Options = {
      resolution: Resolution.HIGH,
      filename: 'dashboard-stats.pdf',
      method: 'build',
      page: {
        margin: Margin.MEDIUM,
        orientation: 'portrait',
        format: 'a3',
      },
    }
    if (targetRef?.current) {
      const zip = new JSZip()

      const pdf = await generatePDF(targetRef, options)
      const pdfBlob = new Blob([pdf.output('arraybuffer')], {
        type: 'application/pdf',
      })
      zip.file(options.filename || 'dashboard-stats.pdf', pdfBlob, {
        binary: true,
      })

      images.forEach((image) => {
        var idx = image.dataUrl.indexOf('base64,') + 'base64,'.length
        var content = image.dataUrl.substring(idx)
        zip.file(`${image.monthName}.png`, content, { base64: true })
      })

      const zipFile = await zip.generateAsync({ type: 'blob' })
      saveAs(zipFile, 'dashboard-stats.zip')

      setDisplayStyle('none')
      setReporting(false)
      setImages([])
      setImagesCount(0)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (images.length === imagesCount && reporting) {
      onExportReport()
    }
  }, [images, firstJobSiteFetched])
  useEffect(() => {
    if (!DISPLAY_MAP_ROLES.includes(userRole)) return
    const fetchDashboardData = async () => {
      try {
        const result = await getMapData({
          startDate,
          endDate,
          includeVerificationImages: true,
        })
        // ✅ update map ONLY when needed
        setMapData(result.data)
      } catch (err) {
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          MESSAGES.SOMETHING_WENT_WRONG
        )
      }
    }

    fetchDashboardData()
  }, [userRole, startDate, endDate])
  //function to get first jobsite date becuase cms user does not have client and jobsite listing
  const getFirstJobSiteDetails = async () => {
    try {
      !reporting && setLoading(true)
      let result = await getFirstJobSite()
      const firstJobSite = result.data?.data?.data[0]
      setFirstJobSite(firstJobSite)
      setFirstJobSiteFetched(true)
    } catch (err) {
      // handle error
      setFirstJobSiteFetched(true) // Set to true even on error to unblock
    } finally {
      !reporting && setLoading(false)
    }
  }
  useEffect(() => {
    if (userRole === ROLES.CMS) {
      getFirstJobSiteDetails()
    }
    // Note: setFirstJobSiteFetched is handled by child components for non-CMS users
    // (adminWasteStreamStats for ADMIN, clientWasteStreamStats for CLIENT, etc.)
  }, [userRole])
  return (
    <>
      <div className="container">
        <Row gutter={24} align={'middle'} className="mt-10">
          <Col xs={24} sm={24} md={8} lg={12} xl={12}>
            <GenieButtonWrapper hint="dashboard_page_title" className='dashboard-page-title'>
              <Title className="mb-0">{MESSAGES.DASHBOARD}</Title>
            </GenieButtonWrapper>
          </Col>

          <FilterHeader
            toDate={firstJobSite?.startDate}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            setStartDateFilter={(val) => {
              setStartDateFilter(val)
              setStartDate(val)
            }}
            setEndDateFilter={(val) => {
              setEndDateFilter(val)
              setEndDate(val)
            }}
            exportReport={() => {
              setLoading(true)
              setDisplayStyle('block')
              setReporting(true)
            }}
            isDashboard={true}
            firstJobSite={firstJobSite}
            firstJobSiteFetched={firstJobSiteFetched}
            isGenerating={dashboard.isGenerating}
            setIsGenerating={(v) => setDashboardState({ isGenerating: v })}
            selectedWasteType={selectedWasteType}
            selectedMaterialDestinationForReporting={selectedMaterialDestinationForReporting}
          />
        </Row>
      </div>
      <section
        className={`container white-area mt-5 ${
          DISPLAY_MAP_ROLES.includes(userRole) && mapData ? 'map-container' : ''
        }`}
      >
        {DISPLAY_MAP_ROLES.includes(userRole) && mapData && (
          <DashboardMaps
            key={`${session?.impersonated ? 'imp' : 'noimp'}-${
              session?.user?.id ?? 'nouser'
            }-${userRole ?? 'norole'}`}
            data={mapData}
            selectedWasteType={selectedWasteType}
            selectedEndpointKey={selectedEndpointKey}
            setSelectedWasteType={setSelectedWasteType}
            setSelectedEndpointKey={setSelectedEndpointKey}
            userRole={userRole}
            startDate={startDate}
            endDate={endDate}
            setSelectedMaterialDestinationForReporting={setSelectedMaterialDestinationForReporting}
          />
        )}
        <div className="dashboard-screen">
          {treeStats && (
            <>
              <TreeGraph
                data={treeStats}
                {...treeGraphProps}
                fromDashboard={true}
                userRole={userRole}
              />
            </>
          )}
        </div>
        <WasteStreamStats
          key={session?.user?.id}
          reporting={false}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
        />
      </section>
    </>
  )
}
