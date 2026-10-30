import exifr from 'exifr'
import type { ImageMetadataSource, ImageUploadMetadata } from '@/src/utils/imageMetadata'
import {
  extractHeicExifSegment,
  isHeicOrHeifBuffer,
} from '@/src/utils/heicExifExtract'

function parseExifDate(raw: unknown): string | undefined {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString()
  }

  if (typeof raw === 'string' && raw.trim()) {
    const normalized = raw.trim().replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
    const parsed = new Date(normalized)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }

  if (typeof raw === 'number') {
    const parsed = new Date(raw)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }

  return undefined
}

function applyGpsRef(
  value: number,
  ref: unknown,
  positive: string,
  negative: string
): number {
  const refStr = typeof ref === 'string' ? ref.toUpperCase() : ''
  if (refStr === negative) {
    return -Math.abs(value)
  }
  if (refStr === positive) {
    return Math.abs(value)
  }
  return value
}

function parseGpsCoordinate(
  value: unknown,
  ref: unknown,
  positive: string,
  negative: string
): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return applyGpsRef(value, ref, positive, negative)
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [degrees, minutes, seconds] = value.map(Number)
    if ([degrees, minutes, seconds].some((part) => Number.isNaN(part))) {
      return undefined
    }

    const decimal = degrees + minutes / 60 + seconds / 3600
    return applyGpsRef(decimal, ref, positive, negative)
  }

  return undefined
}

function buildMetadataFromExifData(data: Record<string, unknown> | null | undefined): ImageUploadMetadata {
  if (!data) {
    return {}
  }

  const capturedAt =
    parseExifDate(data.DateTimeOriginal) ??
    parseExifDate(data.CreateDate) ??
    parseExifDate(data.DateTimeDigitized) ??
    parseExifDate(data.ModifyDate)

  let latitude =
    typeof data.latitude === 'number' ? data.latitude : undefined
  let longitude =
    typeof data.longitude === 'number' ? data.longitude : undefined

  if (latitude === undefined || longitude === undefined) {
    const gps = data.gps as Record<string, unknown> | undefined
    latitude =
      latitude ??
      (typeof gps?.latitude === 'number' ? gps.latitude : undefined) ??
      parseGpsCoordinate(data.GPSLatitude, data.GPSLatitudeRef, 'N', 'S')
    longitude =
      longitude ??
      (typeof gps?.longitude === 'number' ? gps.longitude : undefined) ??
      parseGpsCoordinate(data.GPSLongitude, data.GPSLongitudeRef, 'E', 'W')
  }

  if (!capturedAt && latitude === undefined && longitude === undefined) {
    return {}
  }

  return {
    ...(capturedAt ? { capturedAt } : {}),
    ...(latitude !== undefined && longitude !== undefined
      ? { latitude, longitude }
      : {}),
    metadataSource: 'exif' as ImageMetadataSource,
  }
}

const EXIF_PARSE_OPTIONS = {
  gps: true,
  exif: true,
  tiff: true,
  ifd0: true,
  reviveValues: true,
  mergeOutput: true,
} as const

export function hasExtractedImageMetadata(
  metadata: ImageUploadMetadata
): boolean {
  return Boolean(
    metadata.capturedAt ||
      (metadata.latitude !== undefined && metadata.longitude !== undefined)
  )
}

async function parseExifSegment(
  segment: ArrayBuffer | Buffer | Uint8Array
): Promise<ImageUploadMetadata> {
  const data = await exifr.parse(segment, EXIF_PARSE_OPTIONS)
  const metadata = buildMetadataFromExifData(data as Record<string, unknown>)

  if (hasExtractedImageMetadata(metadata)) {
    return metadata
  }

  const gps = await exifr.gps(segment).catch(() => null)
  if (!gps) {
    return metadata
  }

  return {
    ...metadata,
    latitude: metadata.latitude ?? gps.latitude,
    longitude: metadata.longitude ?? gps.longitude,
    metadataSource: 'exif',
  }
}

export async function extractImageMetadataFromBuffer(
  buffer: ArrayBuffer | Buffer
): Promise<ImageUploadMetadata> {
  let metadata: ImageUploadMetadata = {}

  try {
    metadata = await parseExifSegment(buffer)
  } catch {
    metadata = {}
  }

  if (hasExtractedImageMetadata(metadata) || !isHeicOrHeifBuffer(buffer)) {
    return metadata
  }

  const exifSegment = extractHeicExifSegment(buffer)
  if (!exifSegment) {
    return metadata
  }

  try {
    const heicMetadata = await parseExifSegment(exifSegment)
    if (hasExtractedImageMetadata(heicMetadata)) {
      return heicMetadata
    }
  } catch {
    /* keep prior metadata */
  }

  return metadata
}

export async function extractImageMetadataFromInput(
  input: Blob | ArrayBuffer | Buffer
): Promise<ImageUploadMetadata> {
  if (input instanceof ArrayBuffer) {
    return extractImageMetadataFromBuffer(input)
  }

  if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
    return extractImageMetadataFromBuffer(input)
  }

  return extractImageMetadataFromBuffer(await input.arrayBuffer())
}
