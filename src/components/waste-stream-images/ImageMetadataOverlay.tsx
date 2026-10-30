'use client'

import { WasteStreamImage } from '@/src/utils/constants/types'
import { formatImageCaptureDate } from '@/src/utils/imageMetadata'
import { useImageLocationLabel } from '@/src/utils/hooks/useImageLocationLabel'
import { useWasteStreamImageMetadata } from '@/src/utils/hooks/useWasteStreamImageMetadata'

type Props = {
  image: WasteStreamImage
  variant?: 'thumbnail' | 'preview'
  /** When true, overlay is positioned by a parent portal (not on the image). */
  detached?: boolean
}

export function ImageMetadataOverlay({
  image,
  variant = 'thumbnail',
  detached = false,
}: Props) {
  const enrichedImage = useWasteStreamImageMetadata(image)
  const dateLabel = formatImageCaptureDate(enrichedImage)
  const { label: locationLabel, loading: locationLoading } =
    useImageLocationLabel(enrichedImage)

  if (!dateLabel && !locationLabel && !locationLoading) {
    return null
  }

  const containerClass =
    variant === 'preview'
      ? detached
        ? 'waste-stream-image-metadata--preview-detached'
        : 'waste-stream-image-metadata--preview'
      : 'waste-stream-image-metadata'

  return (
    <div className={containerClass}>
      {dateLabel ? (
        <span
          className={
            variant === 'preview'
              ? 'waste-stream-image-metadata__date'
              : undefined
          }
          title={dateLabel}
        >
          {dateLabel}
        </span>
      ) : null}
      {locationLoading ? (
        <span
          className={
            variant === 'preview'
              ? 'waste-stream-image-metadata__location-skeleton waste-stream-image-metadata__location-skeleton--preview'
              : 'waste-stream-image-metadata__location-skeleton'
          }
          aria-hidden
        />
      ) : locationLabel ? (
        <span
          className={
            variant === 'preview'
              ? 'waste-stream-image-metadata__location'
              : undefined
          }
          title={locationLabel}
        >
          {locationLabel}
        </span>
      ) : null}
    </div>
  )
}

export default ImageMetadataOverlay
