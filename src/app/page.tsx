'use client'
import { use, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import DashboardStats from '../components/dashboard/dashboardStats'
import DashboardStatsReport from '../components/dashboard/dashboardStats/components/dashboardStatsReport'
import { fetchDiversionStats } from '../components/dashboard/dashboardStats/dashboardDataFetcher'
import { WASTE_STATS } from '../utils/constants/types'
import { useTriggerNotification } from '../utils/context/notification-context'
import { createTriggerNotification } from '../utils/functions/notificationUtils'
import { useLoader } from '../utils/context/loader-context'
import { useUser } from '@/src/utils/context/user-context'
import { ROLES } from '../utils/constants/app-constants'
import JobSiteList from '../components/dashboard/jobSiteList'
import { DashboardStatsProvider } from '../utils/context/dashboard-report-context'

export default function Home() {
  const [startDate, setStartDate] = useState<string | Date>()
  const [endDate, setEndDate] = useState<string>()
  const [displayStyle, setDisplayStyle] = useState('none')
  const targetRef = useRef<HTMLDivElement>(null)
  const [treeStats, setTreeStats] = useState<WASTE_STATS | undefined>(undefined)
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)
  const [treeGraphProps, setTreeGraphProps] = useState({})
  const [reporting, setReporting] = useState(false)
  const [selectedEndpointKey, setSelectedEndpointKey] = useState<
    'All' | string
  >('All')
  const [selectedMaterialDestinationForReporting, setSelectedMaterialDestinationForReporting] = useState<string[]>([])
  const [selectedWasteType, setSelectedWasteType] = useState<string>('All')
  const { setLoading } = useLoader()
  const { user } = useUser()
  const { data: session } = useSession()

  // Reset map filters whenever the user/impersonation context changes
  // so stale selections from Client View don't bleed back to admin view
  useEffect(() => {
    setSelectedWasteType('All')
    setSelectedEndpointKey('All')
    setSelectedMaterialDestinationForReporting([])
  }, [session?.impersonated, session?.user?.id])

  useEffect(() => {
    if (startDate && endDate && user?.id) {
      const clientId =
        user.role.enum === ROLES.ADMIN ? undefined : Number(user.id)

      fetchDiversionStats({
        setState: setTreeStats,
        setLoading: setLoading,
        triggerNotification: trigger,
        startDate: startDate,
        endDate: endDate,
        clientId,
      })
    }
  }, [startDate, endDate, user?.id])
  useEffect(() => {
    if (
      user?.role.enum === ROLES.GENERAL_CONTRACTOR ||
      user?.role.enum === ROLES.ADMIN ||
      user?.role.enum === ROLES.POWER_PLANT ||
      user?.role.enum === ROLES.END_CLIENT ||
      user?.role.enum === ROLES.MANUFACTURER ||
      user?.role.enum === ROLES.OFFTAKE
    ) {
      setTreeGraphProps({
        clientId: user.id,
        photo: user.photo,
        mute: true,
        showImage:
          user?.role.enum === ROLES.ADMIN ||
          user?.role.enum === ROLES.END_CLIENT
            ? false
            : true,
        isPowerPlant: user?.role.enum === ROLES.POWER_PLANT,
      })
    }
  }, [user])
  
  return (
    <DashboardStatsProvider>
      <DashboardStats
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setDisplayStyle={setDisplayStyle}
        targetRef={targetRef}
        treeStats={treeStats}
        treeGraphProps={treeGraphProps}
        reporting={reporting}
        setReporting={setReporting}
        startDate={startDate}
        endDate={endDate}
        selectedEndpointKey={selectedEndpointKey}
        setSelectedEndpointKey={setSelectedEndpointKey}
        selectedWasteType={selectedWasteType}
        setSelectedWasteType={setSelectedWasteType}
        selectedMaterialDestinationForReporting={selectedMaterialDestinationForReporting}
        setSelectedMaterialDestinationForReporting={setSelectedMaterialDestinationForReporting}
      />
      <JobSiteList />
      {reporting && (
        <DashboardStatsReport
          targetRef={targetRef}
          startDateFilter={startDate}
          endDateFilter={endDate}
          displayStyle={displayStyle}
          treeStats={treeStats}
          treeGraphProps={treeGraphProps}
        />
      )}
    </DashboardStatsProvider>
  )
}
