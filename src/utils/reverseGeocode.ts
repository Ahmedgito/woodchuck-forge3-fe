const cache = new Map<string, string | null>()

function cacheKey(lat: number, lng: number): string {
  return `en:${lat.toFixed(5)},${lng.toFixed(5)}`
}

export async function reverseGeocodeLabel(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const key = cacheKey(latitude, longitude)
  if (cache.has(key)) {
    return cache.get(key) ?? null
  }

  try {
    const params = new URLSearchParams({
      lat: String(latitude),
      lng: String(longitude),
    })
    const response = await fetch(`/api/geocode/reverse?${params.toString()}`)
    if (!response.ok) {
      cache.set(key, null)
      return null
    }

    const data = (await response.json()) as { label?: string | null }
    const label = data.label?.trim() || null
    cache.set(key, label)
    return label
  } catch {
    cache.set(key, null)
    return null
  }
}
