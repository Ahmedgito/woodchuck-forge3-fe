'use client'
import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { WasteStreamImage } from '@/src/utils/constants/types'
import { getWasteStreamImages } from '@/src/services/wasteStreamImages'
import { useReportImages } from '@/src/utils/context/report-images-context'
import WasteStreamDisplayImage from './WasteStreamDisplayImage'
import Image from 'next/image'

interface WasteStreamReportImagesProps {
  jobsiteWasteStreamId: number
  wasteStreamName?: string
}

/**
 * Static image display used in reporting/PDF mode.
 * Shows thumbnails inline with AI verified/flagged badge and confidence score.
 * No upload or management controls.
 *
 * When rendered inside a ReportImagesProvider (i.e. the Puppeteer export page),
 * images are read from the pre-fetched context map — no authenticated API call
 * is needed, so Puppeteer can render this without a session.
 */
export function WasteStreamReportImages({
  jobsiteWasteStreamId,
  wasteStreamName,
}: WasteStreamReportImagesProps) {
  const reportImages = useReportImages()
  // hasPreloaded is true whenever we are inside a ReportImagesProvider, even if
  // the provider supplied an empty map (i.e. the job site has no images at all).
  // Checking for null (the context default) correctly distinguishes the two cases
  // and prevents unauthenticated API calls inside the Puppeteer export page.
  const hasPreloaded = reportImages !== null

  const [images, setImages] = useState<WasteStreamImage[]>(
    hasPreloaded ? (reportImages[jobsiteWasteStreamId] ?? []) : []
  )
  const [loaded, setLoaded] = useState(hasPreloaded)

  useEffect(() => {
    // If images were injected from the server (Puppeteer / export context), skip
    // the API call entirely — there is no auth session available in that context.
    if (hasPreloaded) {
      setImages(reportImages[jobsiteWasteStreamId] ?? [])
      return
    }

    getWasteStreamImages(jobsiteWasteStreamId)
      .then((res) => {
        const imgs: WasteStreamImage[] = Array.isArray((res as any).data?.data)
          ? (res as any).data.data
          : Array.isArray(res.data)
            ? res.data
            : []
        setImages(imgs.filter((img) => img.isLatest))
      })
      .catch(() => {
        /* non-fatal */
      })
      .finally(() => setLoaded(true))
  }, [jobsiteWasteStreamId, hasPreloaded, reportImages])

  if (!loaded) {
    return <Spin size="small" style={{ marginTop: 8 }} />
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
      }}
    >
      {images.map((img) => {
        const isComplete = img.aiStatus === 'complete'
        const displayConfidence = img.adminConfidenceOverride ?? img.aiConfidenceLevel

        return (
          <div
            key={img.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 90,
            }}
          >
            {/* Image with badge overlaid at top-left */}
            <div
              style={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: 4,
                overflow: 'visible',
                border: '1px solid #d9d9d9',
                background: '#f5f5f5',
                flexShrink: 0,
              }}
            >
              <WasteStreamDisplayImage
                src={img.file?.path as string}
                alt={wasteStreamName ?? 'waste stream image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
              />
              {isComplete && img.aiVerified && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: -14,
                    zIndex: 1,
                  }}
                >
                  <Image
                    src="/images/ai-verified.svg"
                    alt="AI Verified"
                    width={24}
                    height={24}
                  />
                </div>
              )}
            </div>

            {/* Confidence % below the image */}
            {isComplete && displayConfidence !== null && (
              <span
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#462C75',
                }}
              >
                {Math.round(Number(displayConfidence))}%
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default WasteStreamReportImages
