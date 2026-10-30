import { NextRequest, NextResponse } from 'next/server'

// Mark this route as dynamic since it accesses request.url
export const dynamic = 'force-dynamic'

// Try server-side key first, fall back to client-side key if needed
const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  ''

// Get frontend base URL from request or environment variable
function getFrontendBaseUrl(req: NextRequest): string {
  // Try to get from request origin first (most reliable for CORS requests)
  const origin = req.headers.get('origin')
  if (origin) {
    return origin
  }

  // Try to get from referer header (for same-origin requests)
  const referer = req.headers.get('referer') || req.headers.get('referrer')
  if (referer) {
    try {
      const url = new URL(referer)
      return `${url.protocol}//${url.host}`
    } catch {
      // Invalid URL, continue to fallback
    }
  }

  // Try to get from host header
  const host = req.headers.get('host')
  if (host) {
    // Determine protocol from request
    const protocol =
      req.headers.get('x-forwarded-proto') ||
      (req.nextUrl.protocol === 'https:' ? 'https' : 'http')
    return `${protocol}://${host}`
  }

  // Fall back to environment variable
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
  if (baseUrl) {
    // Ensure it has protocol
    return baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
  }

  // Last resort: construct from request URL
  try {
    return `${req.nextUrl.protocol}//${req.nextUrl.host}`
  } catch {
    return ''
  }
}

export async function GET(req: NextRequest) {
  try {
    const placeId = req.nextUrl.searchParams.get('placeId')

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    if (!GOOGLE_MAPS_API_KEY || !GOOGLE_MAPS_API_KEY.trim()) {
      console.error('Google Maps API key not found in environment variables')
      return NextResponse.json(
        {
          error: 'Google Maps API key not configured',
          details:
            'Please set GOOGLE_MAPS_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable',
        },
        { status: 500 }
      )
    }

    // Get frontend base URL for referer header
    const frontendBaseUrl = getFrontendBaseUrl(req)

    const apiKey = GOOGLE_MAPS_API_KEY.trim()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'formattedAddress,addressComponents,location,displayName',
    }
    // Set Referer header if we have a base URL (required for API keys with referrer restrictions)
    if (frontendBaseUrl) {
      headers['Referer'] = frontendBaseUrl
      // Also try 'Referrer' header (some APIs accept both)
      headers['Referrer'] = frontendBaseUrl
    } else {
      console.warn('Could not determine frontend base URL for Referer header')
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers,
      }
    )

    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch {
        errorData = await response.text()
      }

      console.error('Google Places API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        apiKeyPresent: !!apiKey,
        apiKeyPrefix: apiKey.substring(0, 10) + '...',
      })

      // If it's an authentication error, provide more details
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error: 'Authentication failed',
            details: errorData,
            message:
              'Please verify that your API key is valid and has the Places API enabled',
          },
          { status: response.status }
        )
      }

      return NextResponse.json(
        { error: 'Failed to fetch place details', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Error in place details API route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
