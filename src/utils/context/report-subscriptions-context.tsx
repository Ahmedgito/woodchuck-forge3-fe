'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { getReportSubscriptions } from '@/src/services/global'
import { useTriggerNotification } from './notification-context'
import { useLoader } from './loader-context'
import { useUser } from './user-context'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { JobSiteSubscription } from '../constants/types'

export interface ReportSubscriptionsData {
  dashboard: JobSiteSubscription
  jobSites: JobSiteSubscription[]
}

interface ReportSubscriptionsContextType {
  reportSubscriptions: ReportSubscriptionsData | null
  loading: boolean
  error: string | null
  refreshReportSubscriptions: () => Promise<void>
}

const ReportSubscriptionsContext = createContext<
  ReportSubscriptionsContextType | undefined
>(undefined)

interface ReportSubscriptionsProviderProps {
  children: ReactNode
}

export const ReportSubscriptionsProvider: React.FC<
  ReportSubscriptionsProviderProps
> = ({ children }) => {
  const [reportSubscriptions, setReportSubscriptions] =
    useState<ReportSubscriptionsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const triggerNotification = useTriggerNotification()
  const { setLoading: setGlobalLoading } = useLoader()
  const { user } = useUser()

  const fetchReportSubscriptions = async () => {
    try {
      setLoading(true)
      setGlobalLoading(true)
      setError(null)

      const response = await getReportSubscriptions()

      if (response.data.status === 'success') {
        setReportSubscriptions(response.data.data || null)
      } else {
        throw new Error(
          response.data.message || 'Failed to fetch report subscriptions'
        )
      }
    } catch (err: any) {
      const errorMessage = err.message || MESSAGES.SOMETHING_WENT_WRONG
      setError(errorMessage)
      triggerNotification('error', MESSAGES.ERROR, errorMessage)
      console.error('Error fetching report subscriptions:', err)
    } finally {
      setLoading(false)
      setGlobalLoading(false)
    }
  }

  const refreshReportSubscriptions = useCallback(async () => {
    await fetchReportSubscriptions()
  }, [])

  // Fetch data when user is available (includes CMS users for Auto Export Report)
  useEffect(() => {
    if (user) {
      fetchReportSubscriptions()
    }
  }, [user])

  const value: ReportSubscriptionsContextType = {
    reportSubscriptions,
    loading,
    error,
    refreshReportSubscriptions,
  }

  return (
    <ReportSubscriptionsContext.Provider value={value}>
      {children}
    </ReportSubscriptionsContext.Provider>
  )
}

export const useReportSubscriptions = (): ReportSubscriptionsContextType => {
  const context = useContext(ReportSubscriptionsContext)
  if (context === undefined) {
    throw new Error(
      'useReportSubscriptions must be used within a ReportSubscriptionsProvider'
    )
  }
  return context
}
