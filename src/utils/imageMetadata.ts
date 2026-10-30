import exifr from 'exifr'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/src/utils/constants/app-constants'
import { WasteStreamImage } from '@/src/utils/constants/types'
import {
  extractImageMetadataFromInput,
  hasExtractedImageMetadata,
} from '@/src/utils/extractImageMetadataCore'

export type ImageMetadataSource = 'exif' | 'device' | 'none'

export type ImageUploadMetadata = {
  capturedAt?: string
  latitude?: number
  longitude?: number
  metadataSource?: ImageMetadataSource
}

export const WASTE_STREAM_IMAGE_ACCEPT =
  'image/*,.heic,.heif,image/heic,image/heif'

export function isAllowedWasteStreamImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) {
    return true
  }

  return /\.(jpe?g|png|gif|heic|heif|webp)$/i.test(file.name)
}

export function isHeicOrHeifFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    /\.(heic|heif)$/.test(name) ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  )
}

async function extractHeicMetadataOnServer(file: File): Promise<ImageUploadMetadata> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/extract-image-metadata', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    return {}
  }

  return (await response.json()) as ImageUploadMetadata
}

export async function extractImageMetadataFromFile(
  file: File
): Promise<ImageUploadMetadata> {
  if (!isAllowedWasteStreamImageFile(file)) {
    return {}
  }

  // Browser exifr reads iPhone HEIC reliably from the File object; use that first.
  let metadata: ImageUploadMetadata = {}
  try {
    metadata = await extractImageMetadataFromInput(file)
  } catch {
    metadata = {}
  }

  if (hasExtractedImageMetadata(metadata)) {
    return metadata
  }

  if (isHeicOrHeifFile(file)) {
    const serverMetadata = await extractHeicMetadataOnServer(file)
    if (hasExtractedImageMetadata(serverMetadata)) {
      return serverMetadata
    }
  }

  return metadata
}

export function formatImageCaptureDate(image: WasteStreamImage): string | null {
  const raw = image.capturedAt ?? image.uploadedAt
  if (!raw) return null
  const parsed = dayjs(raw)
  if (!parsed.isValid()) return null
  return parsed.format(`${DATE_FORMAT.MM_DD_YYYY} h:mm A`)
}

export function formatImageCoordinates(image: WasteStreamImage): string | null {
  if (image.latitude == null || image.longitude == null) {
    return null
  }

  const lat = Number(image.latitude).toFixed(4)
  const lng = Number(image.longitude).toFixed(4)
  return `${lat}, ${lng}`
}

export function formatImageLocationFallback(
  image: WasteStreamImage
): string | null {
  if (image.locationVerified === true) {
    return 'On site'
  }

  if (image.distanceFromJobSiteMeters != null) {
    return `${Math.round(Number(image.distanceFromJobSiteMeters))}m away`
  }

  return formatImageCoordinates(image)
}

export function hasImageCoordinates(image: WasteStreamImage): boolean {
  return image.latitude != null && image.longitude != null
}
