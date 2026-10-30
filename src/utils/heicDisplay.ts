const HEIC_EXTENSION_REGEX = /\.(heic|heif)(?:\?|#|$)/i

const displayUrlCache = new Map<string, string>()
const inFlight = new Map<string, Promise<string>>()

function browserNativeHeicSupport(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent
  return /safari/i.test(ua) && !/chrome|chromium|crios|fxios|edg/i.test(ua)
}

export function isHeicImageUrl(url: string): boolean {
  if (!url) {
    return false
  }

  try {
    const pathname = new URL(url, window.location.origin).pathname
    return HEIC_EXTENSION_REGEX.test(pathname)
  } catch {
    return HEIC_EXTENSION_REGEX.test(url)
  }
}

export function needsHeicConversion(url: string): boolean {
  return isHeicImageUrl(url) && !browserNativeHeicSupport()
}

async function fetchConvertedJpegBlob(url: string): Promise<Blob> {
  const convertUrl = `/api/convert-heic?url=${encodeURIComponent(url)}`
  const response = await fetch(convertUrl)
  if (!response.ok) {
    throw new Error(`Failed to convert image (${response.status})`)
  }

  return response.blob()
}

export function getCachedDisplayImageSrc(url: string | undefined): string | undefined {
  if (!url) {
    return undefined
  }

  if (!needsHeicConversion(url)) {
    return url
  }

  return displayUrlCache.get(url)
}

export async function resolveDisplayImageSrc(url: string): Promise<string> {
  if (!url || !needsHeicConversion(url)) {
    return url
  }

  const cached = displayUrlCache.get(url)
  if (cached) {
    return cached
  }

  const pending = inFlight.get(url)
  if (pending) {
    return pending
  }

  const promise = (async () => {
    const jpegBlob = await fetchConvertedJpegBlob(url)
    const objectUrl = URL.createObjectURL(jpegBlob)
    displayUrlCache.set(url, objectUrl)
    return objectUrl
  })()

  inFlight.set(url, promise)

  try {
    return await promise
  } finally {
    inFlight.delete(url)
  }
}

export async function warmDisplayImageSrc(url: string): Promise<string> {
  return resolveDisplayImageSrc(url)
}

export async function warmAllDisplayImageSrcs(urls: string[]): Promise<void> {
  await Promise.all(
    urls.map((url) => {
      if (!url || !needsHeicConversion(url)) {
        return Promise.resolve()
      }
      return resolveDisplayImageSrc(url)
    })
  )
}

const PREVIEW_PLACEHOLDER_SRC =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export function getPreviewPlaceholderSrc(): string {
  return PREVIEW_PLACEHOLDER_SRC
}
