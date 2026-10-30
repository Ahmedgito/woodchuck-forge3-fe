'use client'

import { useEffect, useState } from 'react'
import { WasteStreamImage } from '@/src/utils/constants/types'
import {
  extractImageMetadataFromInput,
  hasExtractedImageMetadata,
} from '@/src/utils/extractImageMetadataCore'
import {
  hasImageCoordinates,
  type ImageUploadMetadata,
} from '@/src/utils/imageMetadata'

const metadataUrlCache = new Map<string, ImageUploadMetadata>()
const metadataInFlight = new Map<string, Promise<ImageUploadMetadata>>()

function metadataCacheKey(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return url.split('?')[0] ?? url
  }
}

function needsMetadataBackfill(image: WasteStreamImage): boolean {
  return !image.capturedAt || !hasImageCoordinates(image)
}

async function fetchMetadataFromUrl(url: string): Promise<ImageUploadMetadata> {
  const cacheKey = metadataCacheKey(url)
  const cached = metadataUrlCache.get(cacheKey)
  if (cached && hasExtractedImageMetadata(cached)) {
    return cached
  }

  const pending = metadataInFlight.get(cacheKey)
  if (pending) {
    return pending
  }

  const promise = (async () => {
    const proxyResponse = await fetch(
      `/api/proxy-image?url=${encodeURIComponent(url)}`
    )
    if (proxyResponse.ok) {
      const blob = await proxyResponse.blob()
      const clientMetadata = await extractImageMetadataFromInput(blob)
      if (hasExtractedImageMetadata(clientMetadata)) {
        return clientMetadata
      }
    }

    const response = await fetch(
      `/api/extract-image-metadata?url=${encodeURIComponent(url)}`
    )
    if (!response.ok) {
      return {}
    }

    const metadata = (await response.json()) as ImageUploadMetadata
    return metadata
  })()

  metadataInFlight.set(cacheKey, promise)

  try {
    const metadata = await promise
    if (hasExtractedImageMetadata(metadata)) {
      metadataUrlCache.set(cacheKey, metadata)
    }
    return metadata
  } finally {
    metadataInFlight.delete(cacheKey)
  }
}

function mergeMetadata(
  image: WasteStreamImage,
  extracted: ImageUploadMetadata
): WasteStreamImage {
  if (!hasExtractedImageMetadata(extracted)) {
    return image
  }

  return {
    ...image,
    capturedAt: image.capturedAt ?? extracted.capturedAt ?? null,
    latitude: image.latitude ?? extracted.latitude ?? null,
    longitude: image.longitude ?? extracted.longitude ?? null,
    metadataSource: image.metadataSource ?? extracted.metadataSource ?? null,
  }
}

export function useWasteStreamImageMetadata(image: WasteStreamImage): WasteStreamImage {
  const src = image.file?.path as string | undefined
  const [enriched, setEnriched] = useState(image)

  useEffect(() => {
    setEnriched(image)

    if (!needsMetadataBackfill(image) || !src) {
      return
    }

    let cancelled = false

    fetchMetadataFromUrl(src)
      .then((metadata) => {
        if (!cancelled && hasExtractedImageMetadata(metadata)) {
          setEnriched((current) => mergeMetadata(current, metadata))
        }
      })
      .catch(() => {
        /* keep original image */
      })

    return () => {
      cancelled = true
    }
  }, [
    image.id,
    image.capturedAt,
    image.latitude,
    image.longitude,
    image.metadataSource,
    src,
  ])

  return enriched
}
