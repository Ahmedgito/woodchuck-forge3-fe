'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

interface ExportState {
  isGenerating: boolean
}

interface ReportContextType {
  dashboard: ExportState
  jobsites: Record<number, ExportState>

  setDashboardState: (partial: Partial<ExportState>) => void
  setJobsiteState: (jobsiteId: number, partial: Partial<ExportState>) => void
}
interface ProviderProps {
  children: ReactNode // <-- Add this
}

const ReportGenerationContext = createContext<ReportContextType | null>(null)

export const ReportGenerationProvider = ({ children }: ProviderProps) => {
  const [dashboard, setDashboard] = useState<ExportState>({
    isGenerating: false,
  })

  const [jobsites, setJobsites] = useState<Record<number, ExportState>>({})

  const setDashboardState = (partial: Partial<ExportState>) =>
    setDashboard((prev) => ({ ...prev, ...partial }))

  const setJobsiteState = (jobsiteId: number, partial: Partial<ExportState>) =>
    setJobsites((prev) => ({
      ...prev,
      [jobsiteId]: { ...prev[jobsiteId], ...partial },
    }))

  return (
    <ReportGenerationContext.Provider
      value={{
        dashboard,
        jobsites,
        setDashboardState,
        setJobsiteState,
      }}
    >
      {children}
    </ReportGenerationContext.Provider>
  )
}

export const useReportContext = () => {
  const ctx = useContext(ReportGenerationContext)
  if (!ctx) throw new Error('useReportContext must be used within provider')
  return ctx
}
