import React, { createContext, useContext, useState } from 'react'
import { REPORT_IMAGE, JOB_SITE } from '../constants/types'

interface DashboardStatsContextProps {
  images: Array<REPORT_IMAGE>
  imagesCount: number
  setImages: React.Dispatch<React.SetStateAction<Array<REPORT_IMAGE>>>
  setImagesCount: React.Dispatch<React.SetStateAction<number>>
  firstJobSiteFetched: boolean
  setFirstJobSiteFetched: React.Dispatch<React.SetStateAction<boolean>>
  firstJobSite: JOB_SITE | undefined
  setFirstJobSite: React.Dispatch<React.SetStateAction<JOB_SITE | undefined>>
}

const DashboardStatsContext = createContext<
  DashboardStatsContextProps | undefined
>(undefined)

export const DashboardStatsProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [images, setImages] = useState<Array<REPORT_IMAGE>>([])
  const [imagesCount, setImagesCount] = useState(0)
  const [firstJobSiteFetched, setFirstJobSiteFetched] = useState(false)
  const [firstJobSite, setFirstJobSite] = useState<JOB_SITE | undefined>(
    undefined
  )

  return (
    <DashboardStatsContext.Provider
      value={{
        images,
        setImages,
        imagesCount,
        setImagesCount,
        firstJobSiteFetched,
        setFirstJobSiteFetched,
        firstJobSite,
        setFirstJobSite,
      }}
    >
      {children}
    </DashboardStatsContext.Provider>
  )
}

export const useDashboardStats = () => {
  const context = useContext(DashboardStatsContext)
  if (context === undefined) {
    throw new Error(
      'useDashboardStats must be used within a DashboardStatsProvider'
    )
  }
  return context
}
