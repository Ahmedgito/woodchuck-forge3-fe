'use client'

import { useEffect, useState } from 'react'
import { WasteStreamImage } from '@/src/utils/constants/types'
import {
  formatImageCoordinates,
  formatImageLocationFallback,
  hasImageCoordinates,
} from '@/src/utils/imageMetadata'
import { reverseGeocodeLabel } from '@/src/utils/reverseGeocode'

type UseImageLocationLabelResult = {
  label: string | null
  loading: boolean
}

export function useImageLocationLabel(
  image: WasteStreamImage
): UseImageLocationLabelResult {
  const hasCoordinates = hasImageCoordinates(image)
  const fallbackLocationLabel = formatImageLocationFallback(image)
  const coordinateFallback = formatImageCoordinates(image)
  const latitude = image.latitude == null ? null : Number(image.latitude)
  const longitude = image.longitude == null ? null : Number(image.longitude)

  const [state, setState] = useState<UseImageLocationLabelResult>(() => {
    if (hasCoordinates) {
      return { label: null, loading: true }
    }

    return {
      label: fallbackLocationLabel,
      loading: false,
    }
  })

  useEffect(() => {
    if (!hasCoordinates) {
      setState({
        label: fallbackLocationLabel,
        loading: false,
      })
      return
    }

    if (latitude == null || longitude == null) {
      setState({
        label: coordinateFallback,
        loading: false,
      })
      return
    }

    let cancelled = false

    setState({ label: null, loading: true })

    reverseGeocodeLabel(latitude, longitude)
      .then((resolved) => {
        if (cancelled) return
        setState({
          label: resolved ?? coordinateFallback,
          loading: false,
        })
      })
      .catch(() => {
        if (cancelled) return
        setState({
          label: coordinateFallback,
          loading: false,
        })
      })

    return () => {
      cancelled = true
    }
  }, [
    image.id,
    hasCoordinates,
    fallbackLocationLabel,
    coordinateFallback,
    latitude,
    longitude,
  ])

  return state
}
