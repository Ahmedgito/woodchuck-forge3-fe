'use client'

import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import { WasteStreamImage } from '@/src/utils/constants/types'
import { hasImageCoordinates } from '@/src/utils/imageMetadata'
import { useImageLocationLabel } from '@/src/utils/hooks/useImageLocationLabel'
import { useWasteStreamImageMetadata } from '@/src/utils/hooks/useWasteStreamImageMetadata'
import ImageLocationPreviewMap from './ImageLocationPreviewMap'
import type { PreviewImageRect } from './usePreviewImageRect'

type Props = {
  image: WasteStreamImage
  rect: PreviewImageRect
}

const GAP = 16
const MIN_VIEWPORT_PADDING = 12
const PANEL_HEIGHT_ESTIMATE = 200

function getPanelPlacement(rect: PreviewImageRect) {
  const viewportHeight =
    typeof window !== 'undefined' ? window.innerHeight : 800
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : 1200

  const panelLeft = rect.left + rect.width / 2
  const panelWidth = Math.min(
    Math.max(rect.width - 24, 400),
    520,
    viewportWidth - 32
  )

  const spaceAbove = rect.top - MIN_VIEWPORT_PADDING
  const spaceBelow = viewportHeight - rect.bottom - MIN_VIEWPORT_PADDING
  const fitsAbove = spaceAbove >= PANEL_HEIGHT_ESTIMATE + GAP
  const fitsBelow = spaceBelow >= PANEL_HEIGHT_ESTIMATE + GAP

  // Prefer above the image; fall back to below only when above would clip and below fits.
  if (fitsAbove || !fitsBelow) {
    return {
      panelLeft,
      panelWidth,
      top: rect.top - GAP,
      transform: 'translate(-50%, -100%)',
      modifier: 'above' as const,
    }
  }

  return {
    panelLeft,
    panelWidth,
    top: rect.bottom + GAP,
    transform: 'translate(-50%, 0)',
    modifier: 'below' as const,
  }
}

export function PreviewLocationPanel({ image, rect }: Props) {
  const enrichedImage = useWasteStreamImageMetadata(image)
  const { label: locationLabel, loading: locationLoading } =
    useImageLocationLabel(enrichedImage)
  const hasCoordinates = hasImageCoordinates(enrichedImage)

  if (!hasCoordinates && !locationLabel && !locationLoading) {
    return null
  }

  const placement = getPanelPlacement(rect)

  return createPortal(
    <div
      className={`waste-stream-preview-location-panel waste-stream-preview-location-panel--${placement.modifier}`}
      style={
        {
          '--location-panel-top': `${placement.top}px`,
          '--location-panel-left': `${placement.panelLeft}px`,
          '--location-panel-width': `${placement.panelWidth}px`,
          '--location-panel-transform': placement.transform,
        } as CSSProperties
      }
    >
      {locationLoading ? (
        <span
          className="waste-stream-image-metadata__location-skeleton waste-stream-image-metadata__location-skeleton--preview"
          aria-hidden
        />
      ) : locationLabel ? (
        <span
          className="waste-stream-preview-location-panel__label"
          title={locationLabel}
        >
          {locationLabel}
        </span>
      ) : null}
      <ImageLocationPreviewMap
        latitude={Number(enrichedImage.latitude)}
        longitude={Number(enrichedImage.longitude)}
      />
    </div>,
    document.body
  )
}

export default PreviewLocationPanel
