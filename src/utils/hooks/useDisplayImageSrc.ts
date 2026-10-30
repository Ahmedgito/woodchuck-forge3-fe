'use client'

import { useEffect, useRef, useState } from 'react'
import {
  getCachedDisplayImageSrc,
  needsHeicConversion,
  resolveDisplayImageSrc,
} from '@/src/utils/heicDisplay'

export function useDisplayImageSrc(
  originalSrc: string | undefined,
  enabled = true
): {
  displaySrc: string | undefined
  loading: boolean
  error: boolean
} {
  const requestIdRef = useRef(0)
  const [displaySrc, setDisplaySrc] = useState<string | undefined>(() => {
    if (!originalSrc || !enabled) {
      return undefined
    }

    return getCachedDisplayImageSrc(originalSrc)
  })
  const [loading, setLoading] = useState(() => {
    if (!originalSrc || !enabled) {
      return false
    }

    return needsHeicConversion(originalSrc) && !getCachedDisplayImageSrc(originalSrc)
  })
  const [error, setError] = useState(false)

  useEffect(() => {
    const requestId = ++requestIdRef.current

    if (!enabled || !originalSrc) {
      setDisplaySrc(undefined)
      setLoading(false)
      setError(false)
      return
    }

    if (!needsHeicConversion(originalSrc)) {
      setDisplaySrc(originalSrc)
      setLoading(false)
      setError(false)
      return
    }

    setLoading(true)
    setError(false)
    setDisplaySrc(undefined)

    resolveDisplayImageSrc(originalSrc)
      .then((resolved) => {
        if (requestId !== requestIdRef.current) {
          return
        }
        setDisplaySrc(resolved)
        setLoading(false)
        setError(false)
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) {
          return
        }
        setDisplaySrc(undefined)
        setLoading(false)
        setError(true)
      })
  }, [originalSrc, enabled])

  return { displaySrc, loading, error }
}
