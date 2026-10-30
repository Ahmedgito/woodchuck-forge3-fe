'use client'
import React, { createContext, useContext } from 'react'
import { WasteStreamImage } from '@/src/utils/constants/types'

/**
 * Provides pre-fetched waste stream images (keyed by jobsiteWasteStreamId) to
 * descendant components during PDF / reporting export so that they can skip
 * their own authenticated API calls.  Outside the export page the context
 * simply returns an empty map and components fall back to their normal behaviour.
 */
type ReportImagesMap = Record<number, WasteStreamImage[]>

/**
 * null  = not inside a ReportImagesProvider (normal app context)
 * {}    = inside a provider but the job site has no images
 * {...} = inside a provider with pre-fetched images
 */
const ReportImagesContext = createContext<ReportImagesMap | null>(null)

export function ReportImagesProvider({
  children,
  images,
}: {
  children: React.ReactNode
  images: ReportImagesMap
}) {
  return (
    <ReportImagesContext.Provider value={images}>
      {children}
    </ReportImagesContext.Provider>
  )
}

/** Returns pre-loaded images map, or null when not inside a provider. */
export function useReportImages(): ReportImagesMap | null {
  return useContext(ReportImagesContext)
}
