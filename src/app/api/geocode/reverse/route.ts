import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  ''

const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT || 'Woodchuck/1.0 (image-metadata)'

type GeocodeComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type GoogleGeocodeResult = {
  formatted_address?: string
  address_components?: GeocodeComponent[]
}

type NominatimAddress = Record<string, string>

function componentName(
  components: GeocodeComponent[],
  ...types: string[]
): string | undefined {
  const match = components.find((component) =>
    types.some((type) => component.types.includes(type))
  )
  return match?.long_name
}

function formatAddressParts(parts: {
  street?: string
  city?: string
  region?: string
  formatted?: string
}): string | null {
  if (parts.street && parts.city) {
    return `${parts.street}, ${parts.city}`
  }
  if (parts.city && parts.region) {
    return `${parts.city}, ${parts.region}`
  }
  if (parts.formatted?.trim()) {
    return parts.formatted.split(',').slice(0, 2).join(',').trim()
  }
  return null
}

function formatGoogleGeocodeLabel(result: GoogleGeocodeResult): string | null {
  const components = result.address_components ?? []
  const streetNumber = componentName(components, 'street_number')
  const route = componentName(components, 'route')
  const locality = componentName(
    components,
    'locality',
    'postal_town',
    'sublocality',
    'neighborhood'
  )
  const region = componentName(components, 'administrative_area_level_1')

  return formatAddressParts({
    street: [streetNumber, route].filter(Boolean).join(' '),
    city: locality,
    region,
    formatted: result.formatted_address,
  })
}

function formatNominatimLabel(data: {
  display_name?: string
  address?: NominatimAddress
}): string | null {
  const address = data.address
  if (!address) {
    return formatAddressParts({ formatted: data.display_name })
  }

  const house = address.house_number
  const road =
    address.road ??
    address.pedestrian ??
    address.footway ??
    address.street ??
    address.path
  const city =
    address.city ??
    address.town ??
    address.village ??
    address.hamlet ??
    address.suburb ??
    address.neighbourhood
  const region = address.state

  return formatAddressParts({
    street: [house, road].filter(Boolean).join(' '),
    city,
    region,
    formatted: data.display_name,
  })
}

async function reverseGeocodeWithGoogle(
  lat: number,
  lng: number
): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY?.trim()) {
    return null
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY.trim()}`
  )

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as {
    status?: string
    results?: GoogleGeocodeResult[]
  }

  if (data.status !== 'OK' || !data.results?.length) {
    return null
  }

  return formatGoogleGeocodeLabel(data.results[0])
}

async function reverseGeocodeWithNominatim(
  lat: number,
  lng: number
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
    zoom: '18',
    'accept-language': 'en',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        'User-Agent': NOMINATIM_USER_AGENT,
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
      next: { revalidate: 60 * 60 * 24 },
    }
  )

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as {
    display_name?: string
    address?: NominatimAddress
    error?: string
  }

  if (data.error) {
    return null
  }

  return formatNominatimLabel(data)
}

export async function GET(req: NextRequest) {
  try {
    const lat = Number(req.nextUrl.searchParams.get('lat'))
    const lng = Number(req.nextUrl.searchParams.get('lng'))

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { error: 'Valid lat and lng query parameters are required' },
        { status: 400 }
      )
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Coordinates are out of range' },
        { status: 400 }
      )
    }

    const googleLabel = await reverseGeocodeWithGoogle(lat, lng)
    if (googleLabel) {
      return NextResponse.json({ label: googleLabel }, { status: 200 })
    }

    const nominatimLabel = await reverseGeocodeWithNominatim(lat, lng)
    return NextResponse.json({ label: nominatimLabel }, { status: 200 })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    console.error('Reverse geocode API error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
