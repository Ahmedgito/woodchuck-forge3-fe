'use client'

import {
  LOCATION_TYPES_MAP,
  US_CENTER_FOR_MAP,
  ROLES,
  DISPLAY_MAP_ROLES,
  MESSAGES,
  ALL_CMS_KEY,
  ALL_LOCATIONS_KEY,
} from '@/src/utils/constants/app-constants'
import { MapApiResponse } from '@/src/utils/constants/maptypes'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import {  Typography, Row, } from 'antd'
import { GOOGLE_MAPS_CONFIG } from '@/src/utils/constants/googleMapsConfig'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { MultiDensityPolyline } from './multiDensityPolyline'
import { mapStyle } from '@/src/utils/constants/mapStyle'
import { addMapControl } from '@/src/utils/functions/mapFunctions'
import TopBarContent from './topBar'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getMapStats } from '@/src/services/global'
import { isHeicImageUrl } from '@/src/utils/heicDisplay'

const padding = { top: 40, right: 80, bottom: 40, left: 80 }

function uniqPreserveOrder(keys: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const k of keys) {
    if (!seen.has(k)) {
      seen.add(k)
      out.push(k)
    }
  }
  return out
}

function setEquals(a: string[], b: string[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  const aSet = new Set(a)
  if (aSet.size !== b.length) {
    // duplicates exist in a; compare via uniq
    return setEquals(uniqPreserveOrder(a), uniqPreserveOrder(b))
  }
  for (const v of b) if (!aSet.has(v)) return false
  return true
}

function withoutKeys(keys: string[], toRemove: Set<string>): string[] {
  return keys.filter((k) => !toRemove.has(k))
}

function intersects(keys: string[], allowed: Set<string>): string[] {
  return keys.filter((k) => allowed.has(k))
}

interface MapComponentProps {
  data: MapApiResponse
  reporting?: boolean
  selectedWasteType?: string
  selectedEndpointKey?: string
  setSelectedWasteType?: (value: string) => void
  setSelectedEndpointKey?: (value: string) => void
  setSelectedMaterialDestinationForReporting?: (value: string[]) => void
  reportingSelectedEndpointKey?: string[]
  mapStats?: {
    totalTonnage?: number
    totalDistance?: number
    totalCo2Avoided?: number
  }
  userRole: string
  startDate?: string | Date
  endDate?: string | Date
}
interface Location {
  lat: number
  lng: number
  name?: string
}

const getMarkerImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return '/images/c-logo-maps.svg'
  if (imageUrl.startsWith('/') || imageUrl.startsWith('data:')) return imageUrl
  // Markers embed images in SVG data URLs — HEIC can't render there even on
  // Safari, so always convert to JPEG first (same as verification image viewer).
  if (isHeicImageUrl(imageUrl)) {
    return `/api/convert-heic?url=${encodeURIComponent(imageUrl)}`
  }
  return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
}

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

// Module-level cache shared across marker instances so re-mounting/toggling
// verification images never re-fetches an image that was already hydrated.
const markerImageCache = new Map<string, string>()
const markerImageInFlight = new Map<string, Promise<string | null>>()

const loadMarkerImageDataUrl = (rawUrl: string): Promise<string | null> => {
  const cached = markerImageCache.get(rawUrl)
  if (cached) return Promise.resolve(cached)

  const inFlight = markerImageInFlight.get(rawUrl)
  if (inFlight) return inFlight

  const promise = (async () => {
    try {
      const response = await fetch(getMarkerImageUrl(rawUrl))
      if (!response.ok) return null
      const blob = await response.blob()
      return await blobToDataUrl(blob)
    } catch {
      return null
    }
  })()

  markerImageInFlight.set(rawUrl, promise)
  promise
    .then((result) => {
      if (result) markerImageCache.set(rawUrl, result)
    })
    .finally(() => {
      markerImageInFlight.delete(rawUrl)
    })

  return promise
}

// Fetches (and hydrates) a single marker's image lazily, only while the
// marker itself is mounted. This means verification images are only ever
// requested when they're actually shown, and each marker resolves
// independently instead of the whole map waiting on one giant batch fetch.
const useMarkerImageDataUrl = (rawUrl?: string | null): string | undefined => {
  const [dataUrl, setDataUrl] = useState<string | undefined>(() =>
    rawUrl ? markerImageCache.get(rawUrl) : undefined
  )

  useEffect(() => {
    if (!rawUrl) {
      setDataUrl(undefined)
      return
    }

    const cached = markerImageCache.get(rawUrl)
    if (cached) {
      setDataUrl(cached)
      return
    }

    let isCancelled = false
    loadMarkerImageDataUrl(rawUrl).then((result) => {
      if (!isCancelled && result) setDataUrl(result)
    })

    return () => {
      isCancelled = true
    }
  }, [rawUrl])

  return dataUrl
}

// Preloads a batch of images and reports back once every single one of them
// has resolved (or failed) - used to drive a single, app-wide loading state
// instead of a separate loader per marker.
const useAreImagesPreloaded = (urls: string[]): boolean => {
  const urlsKey = urls.join('|')
  const [, forceRerenderTick] = useState(0)

  useEffect(() => {
    const uncachedUrls = urls.filter((url) => !markerImageCache.has(url))
    if (!uncachedUrls.length) return

    let isCancelled = false
    Promise.all(uncachedUrls.map((url) => loadMarkerImageDataUrl(url))).then(
      () => {
        if (!isCancelled) forceRerenderTick((tick) => tick + 1)
      }
    )

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlsKey])

  return urls.every((url) => markerImageCache.has(url))
}

const getCircularContainedMarkerIcon = (resolvedImageUrl: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <clipPath id="logoClip">
        <circle cx="24" cy="24" r="22"/>
      </clipPath>
      <image
        href="${resolvedImageUrl}"
        x="2"
        y="2"
        width="44"
        height="44"
        preserveAspectRatio="xMidYMid meet"
        clip-path="url(#logoClip)"
      />
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

// Verification images are anchored at the jobsite's coordinates and shifted
// by a fixed number of screen pixels via the icon anchor. Pixel anchors are
// zoom-independent, so the cluster keeps the exact same spacing (and never
// overlaps) at every zoom level.
const getVerificationImagePixelOffset = (index: number) => {
  const isRightSide = index % 2 === 0
  const sideOrder = Math.floor(index / 2)
  const column = Math.floor(sideOrder / 2)
  const isTopRow = sideOrder % 2 === 0

  // Markers are 40px; 42px spacing keeps a small constant gap.
  const markerSpacingPx = 42
  const baseOffsetPx = 42

  const xPx = (isRightSide ? 1 : -1) * (baseOffsetPx + column * markerSpacingPx)
  const yPx = (isTopRow ? -1 : 1) * (markerSpacingPx / 2)
  return { xPx, yPx }
}

// Fetches its own logo image lazily via useMarkerImageDataUrl - shows the
// default marker until the image resolves, instead of pointing the Google
// Maps icon straight at the proxy URL (which would trigger a second,
// redundant fetch on top of the one below).
const SiteLogoMarker: React.FC<{
  clientImageUrl?: string | null
  position: Location
  title?: string
  onClick: () => void
}> = ({ clientImageUrl, position, title, onClick }) => {
  const dataUrl = useMarkerImageDataUrl(clientImageUrl)

  return (
    <Marker
      position={position}
      title={title}
      onClick={onClick}
      icon={{
        url:
          clientImageUrl && dataUrl
            ? getCircularContainedMarkerIcon(dataUrl)
            : '/images/c-logo-maps.svg',
        scaledSize: new window.google.maps.Size(48, 48),
        anchor: new window.google.maps.Point(24, 24),
      }}
    />
  )
}

const VERIFICATION_MARKER_SIZE = 40

// Rendering of these is gated by useAreImagesPreloaded at the call site, so
// by the time this mounts its image is normally already cached; the pin
// fallback only covers the rare case where hydration failed.
const VerificationImageMarker: React.FC<{
  imageUrl?: string | null
  position: Location
  onClick: () => void
  anchorX: number
  anchorY: number
}> = ({ imageUrl, position, onClick, anchorX, anchorY }) => {
  const dataUrl = useMarkerImageDataUrl(imageUrl)

  return (
    <Marker
      position={position}
      title="Verification image"
      onClick={onClick}
      icon={{
        url: dataUrl
          ? getCircularContainedMarkerIcon(dataUrl)
          : '/images/icon_map-pin.svg',
        scaledSize: new window.google.maps.Size(
          VERIFICATION_MARKER_SIZE,
          VERIFICATION_MARKER_SIZE
        ),
        // Shift by a constant pixel offset from the jobsite marker;
        // stays identical at every zoom level.
        anchor: new window.google.maps.Point(anchorX, anchorY),
      }}
      zIndex={999}
    />
  )
}

const { Title } = Typography

const MapComponent: React.FC<MapComponentProps> = ({
  data,
  reporting = false,
  selectedWasteType,
  selectedEndpointKey,
  setSelectedWasteType,
  setSelectedEndpointKey,
  userRole,
  startDate,
  endDate,
  setSelectedMaterialDestinationForReporting,
  reportingSelectedEndpointKey
}) => {
  // You'll need to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const triggerNotification = useTriggerNotification()

  const mapRef = useRef<google.maps.Map | null>(null)
  const { isLoaded } = useJsApiLoader({
    ...GOOGLE_MAPS_CONFIG,
    googleMapsApiKey: apiKey,
  })
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showVerificationImages, setShowVerificationImages] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const outsideTopBarContainerRef = useRef<HTMLDivElement | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)
  const [mapStats, setMapStats] = useState<any>({})
  const [isStatsLoading, setIsStatsLoading] = useState(false)

  const prevSelectedEndpointKeysRef = useRef<string[]>([])

  const isCMSUser = userRole === ROLES.CMS

  // Internal state for multiselect - convert parent's string to array
  const [selectedEndpointKeys, setSelectedEndpointKeys] = useState<string[]>(
    () => {
      let initialKeys: string[] = []
      if (!selectedEndpointKey || selectedEndpointKey === ALL_LOCATIONS_KEY) {
        // Default to "All CMS" for CMS users, "All" for everyone else
        if (isCMSUser) {
          initialKeys = [ALL_CMS_KEY]
        } else {
          initialKeys = [ALL_LOCATIONS_KEY]
        }
      } else if (selectedEndpointKey === ALL_CMS_KEY) {
         initialKeys = [ALL_CMS_KEY]
      } else if (Array.isArray(selectedEndpointKey)) {
        initialKeys = selectedEndpointKey
      } else {
        initialKeys = [selectedEndpointKey]
      }
      prevSelectedEndpointKeysRef.current = initialKeys
      return initialKeys
    }
  )
  useEffect(() => {
    setSelectedMaterialDestinationForReporting?.(selectedEndpointKeys)
  }, [selectedEndpointKeys])
  useEffect(() => {
    if (!DISPLAY_MAP_ROLES.includes(userRole)) return
    // In reporting/export mode, stats come from injected data (data?.data) - skip API call to avoid 401
    if (reporting) return
    setIsStatsLoading(true)

    const fetchMapStats = async () => {
      console.log('selected', selectedEndpointKey)
      const materialDestinations = (selectedEndpointKeys || [])
        .filter((key) => key !== ALL_LOCATIONS_KEY && key !== ALL_CMS_KEY)
        .map((key) => {
          const [type, id] = key.split('_')
          return { type, id: Number(id) }
        })
      const payload = {
        startDate,
        endDate,
        wasteType: selectedWasteType,
        materialDestinations,
      }

      try {
        const result = await getMapStats(payload)

        setMapStats({
          totalTonnage: result.data.data.totalTonnage,
          totalDistance: result.data.data.totalDistance,
          totalCo2Avoided: result.data.data.totalCo2Avoided,
        })
      } catch (err) {
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          MESSAGES.SOMETHING_WENT_WRONG
        )
      } finally {
        setIsStatsLoading(false)
      }
    }

    // Debounce the API call by 2 seconds
    const timeoutId = setTimeout(() => {
      fetchMapStats()
    }, 2000)

    // Cleanup function to clear the timeout if dependencies change before 2 seconds
    return () => {
      clearTimeout(timeoutId)
    }
  }, [userRole, startDate, endDate, selectedWasteType, selectedEndpointKeys, reporting])
  const parseEndpointKey = (key: string) => {
    if (key === ALL_LOCATIONS_KEY || key === ALL_CMS_KEY) return null
    const [type, id] = key.split('_')
    return { type, id: Number(id) }
  }
  const getDestination = (ws: any) => {
    // Always try to resolve powerplant
    if (ws.processingLocation?.powerplantId) {
      return data?.data?.locations.find(
        (l) =>
          l?.entryType === LOCATION_TYPES_MAP.powerplant &&
          l?.id === ws?.processingLocation?.powerplantId
      )
    }

    if (ws?.processingLocation?.address) return ws?.processingLocation
    if (ws?.endLocations?.length) return ws.endLocations[0]

    return ws?.processingLocation // fallback
  }
  const defaultCenter = useMemo(() => {
    // Use first job site if available
    const firstJobSite = data?.data?.jobSites?.[0]?.address
    if (firstJobSite)
      return { ...firstJobSite, name: data.data.jobSites[0].title }
    // Otherwise, show US
    return US_CENTER_FOR_MAP
  }, [data])
  const filteredJobSites = useMemo(() => {
    // When reporting, show all job sites without filtering
    if (reporting) return data?.data?.jobSites || []
    if (selectedWasteType === 'All') return data?.data?.jobSites || []
    return (data?.data?.jobSites || []).filter((site) =>
      site.wasteStreams?.some((ws) => ws.name === selectedWasteType)
    )
  }, [selectedWasteType, data, reporting])

  // Get all powerplant locations
  const allPowerplantLocations = useMemo(() => {
    if (!data?.data?.locations) return []
    return data.data.locations
      .filter((loc) => loc.entryType === LOCATION_TYPES_MAP.powerplant)
      .map((loc) => `${LOCATION_TYPES_MAP.powerplant}_${loc.id}`)
  }, [data])

  // Get all location values (for "All" option)
  const allLocationValues = useMemo(() => {
    if (!data?.data?.locations) return []
    return data.data.locations.map(
      (loc) => `${loc.entryType || 'location'}_${loc.id}`
    )
  }, [data])

  // Convert "All CMS" and "All" to actual location IDs
  useEffect(() => {
    if (!allPowerplantLocations.length && !allLocationValues.length) return

    const allowAllCMS = isCMSUser
    const allPowerplantSet = new Set(allPowerplantLocations)
    const allLocationSet = new Set(allLocationValues)

    const sanitizeForRole = (keys: string[]) =>
      allowAllCMS ? keys : keys.filter((k) => k !== ALL_CMS_KEY)

    const prevKeysRaw = prevSelectedEndpointKeysRef.current || []
    const prevKeys = sanitizeForRole(prevKeysRaw)
    const currentKeysRaw = selectedEndpointKeys || []
    const currentKeys = sanitizeForRole(currentKeysRaw)

    // Keep prev ref + state consistent with role rules (prevents non-CMS powerplant wipes)
    if (!setEquals(prevKeysRaw, prevKeys)) {
      prevSelectedEndpointKeysRef.current = prevKeys
    }
    if (!setEquals(currentKeysRaw, currentKeys)) {
      prevSelectedEndpointKeysRef.current = currentKeys
      setSelectedEndpointKeys(currentKeys)
      return
    }

    const hasAllCMS = allowAllCMS && currentKeys.includes(ALL_CMS_KEY)
    const prevHasAllCMS = allowAllCMS && prevKeys.includes(ALL_CMS_KEY)
    const hasAll = currentKeys.includes(ALL_LOCATIONS_KEY)
    const prevHasAll = prevKeys.includes(ALL_LOCATIONS_KEY)

    // Check if a powerplant was just unchecked (was in prev but not in current)
    const prevPowerplants = intersects(prevKeys, allPowerplantSet)
    const currentPowerplants = intersects(currentKeys, allPowerplantSet)
    const powerplantUnchecked =
      prevPowerplants.length > currentPowerplants.length && hasAllCMS

    // If a powerplant was unchecked while "All CMS" is selected, remove "All CMS"
    // Also remove "All" if it's selected, since not all are selected anymore
    if (powerplantUnchecked) {
      const remove = new Set([ALL_CMS_KEY, ALL_LOCATIONS_KEY])
      const newKeys = withoutKeys(currentKeys, remove)
      if (!setEquals(newKeys, currentKeys)) {
        prevSelectedEndpointKeysRef.current = newKeys
        setSelectedEndpointKeys(newKeys)
        return
      }
    }

    // Track if "All CMS" was just deselected (even when "All" is selected)
    const allCMSJustDeselected = prevHasAllCMS && !hasAllCMS
    
    // If "All CMS" was just deselected, remove all powerplant IDs
    // If "All" is also selected, remove "All" as well
    if (allCMSJustDeselected) {
      const remove = new Set<string>([...allPowerplantLocations])
      if (hasAll) remove.add(ALL_LOCATIONS_KEY)
      const newKeys = withoutKeys(currentKeys, remove)
      if (!setEquals(newKeys, currentKeys)) {
        prevSelectedEndpointKeysRef.current = newKeys
        setSelectedEndpointKeys(newKeys)
        return
      }
    }

    // Check if a location was just unchecked (was in prev but not in current)
    const prevLocations = intersects(prevKeys, allLocationSet)
    const currentLocations = intersects(currentKeys, allLocationSet)
    const locationUnchecked =
      prevLocations.length > currentLocations.length && hasAll

    // If a location was unchecked while "All" is selected, remove "All"
    if (locationUnchecked) {
      const newKeys = withoutKeys(currentKeys, new Set([ALL_LOCATIONS_KEY]))
      if (!setEquals(newKeys, currentKeys)) {
        prevSelectedEndpointKeysRef.current = newKeys
        setSelectedEndpointKeys(newKeys)
        return
      }
    }

    // If "All" was just deselected, remove all location IDs
    // Also remove "All CMS" if it's selected, since "All" includes everything
    if (prevHasAll && !hasAll) {
      const remove = new Set<string>([...allLocationValues])
      if (hasAllCMS) {
        remove.add(ALL_CMS_KEY)
        for (const pp of allPowerplantLocations) remove.add(pp)
      }
      const newKeys = withoutKeys(currentKeys, remove)
      if (!setEquals(newKeys, currentKeys)) {
        prevSelectedEndpointKeysRef.current = newKeys
        setSelectedEndpointKeys(newKeys)
        return
      }
    }

    // If neither marker is selected, we may need to auto-add markers for UX consistency.
    // (e.g. when user selects all items individually)
    if (!hasAllCMS && !hasAll) {
      const allLocationsSelected =
        allLocationValues.length > 0 &&
        allLocationValues.every((loc) => currentKeys.includes(loc))
      const allPowerplantsSelected =
        allowAllCMS &&
        allPowerplantLocations.length > 0 &&
        allPowerplantLocations.every((pp) => currentKeys.includes(pp))

      let newKeys = currentKeys
      if (allPowerplantsSelected) newKeys = uniqPreserveOrder([...newKeys, ALL_CMS_KEY])
      if (allLocationsSelected) newKeys = uniqPreserveOrder([...newKeys, ALL_LOCATIONS_KEY])

      if (!setEquals(newKeys, currentKeys)) {
        prevSelectedEndpointKeysRef.current = newKeys
        setSelectedEndpointKeys(newKeys)
      } else {
        prevSelectedEndpointKeysRef.current = currentKeys
      }
      return
    }

    // Marker sync: if user selected all items individually, ensure the marker keys
    // are present even if the other marker is already present.
    {
      const allLocationsSelected =
        allLocationValues.length > 0 &&
        allLocationValues.every((loc) => currentKeys.includes(loc))
      const allPowerplantsSelected =
        allowAllCMS &&
        allPowerplantLocations.length > 0 &&
        allPowerplantLocations.every((pp) => currentKeys.includes(pp))

      const markersToAdd: string[] = []
      if (allLocationsSelected && !hasAll) markersToAdd.push(ALL_LOCATIONS_KEY)
      if (allPowerplantsSelected && !hasAllCMS) markersToAdd.push(ALL_CMS_KEY)

      if (markersToAdd.length > 0) {
        const newKeys = uniqPreserveOrder([...currentKeys, ...markersToAdd])
        if (!setEquals(newKeys, currentKeys)) {
          prevSelectedEndpointKeysRef.current = newKeys
          setSelectedEndpointKeys(newKeys)
          return
        }
      }
    }

    let newKeys = [...currentKeys]

    // Handle "All CMS" - add actual powerplant IDs but keep "All CMS" for UI
    // Only add if we're not in the middle of a deselection (checked by early return above)
    if (hasAllCMS && !powerplantUnchecked) {
      const hasOtherSelections = currentKeys.some(
        (key) => key !== ALL_CMS_KEY && key !== ALL_LOCATIONS_KEY
      )
      if (!hasOtherSelections) {
        // Only "All CMS" is selected, add all powerplant values but keep "All CMS"
        newKeys = uniqPreserveOrder([ALL_CMS_KEY, ...allPowerplantLocations])
      } else {
        // "All CMS" is selected with other items, add powerplant values but keep "All CMS"
        newKeys = uniqPreserveOrder([...currentKeys, ...allPowerplantLocations])
      }
    }

    // Handle "All" - add actual location IDs but keep "All" for UI
    // Since "All" includes all powerplants, also add "All CMS" for UI consistency
    // Only add if we're not in the middle of a deselection (checked by early return above)
    // Don't add "All CMS" if it was just deselected by the user
    if (hasAll && !locationUnchecked) {
      const hasOtherSelections = newKeys.some(
        (key) => key !== ALL_LOCATIONS_KEY && key !== ALL_CMS_KEY
      )
      
      // If "All CMS" was just deselected, exclude powerplants and don't add "All CMS"
      if (allCMSJustDeselected) {
        const nonPowerplantLocations = allLocationValues.filter(
          (loc) => !allPowerplantLocations.includes(loc)
        )
        if (!hasOtherSelections) {
          // Only "All" is selected, add all non-powerplant location values but don't add "All CMS"
          newKeys = uniqPreserveOrder([ALL_LOCATIONS_KEY, ...nonPowerplantLocations])
        } else {
          // "All" is selected with other items, add non-powerplant location values but don't add "All CMS"
          newKeys = uniqPreserveOrder([...newKeys, ...nonPowerplantLocations])
        }
      } else {
        // Include all locations; only CMS users also get the "All CMS" UI marker.
        if (!hasOtherSelections) {
          newKeys = allowAllCMS
            ? uniqPreserveOrder([ALL_LOCATIONS_KEY, ALL_CMS_KEY, ...allLocationValues])
            : uniqPreserveOrder([ALL_LOCATIONS_KEY, ...allLocationValues])
        } else {
          if (allowAllCMS) {
            // "All" is selected with other items, add location values and "All CMS" but keep "All"
            // Only add "All CMS" if it's not already there
            if (!newKeys.includes(ALL_CMS_KEY)) {
              newKeys = uniqPreserveOrder([...newKeys, ALL_CMS_KEY, ...allLocationValues])
            } else {
              newKeys = uniqPreserveOrder([...newKeys, ...allLocationValues])
            }
          } else {
            // Non-CMS: just add location values
            newKeys = uniqPreserveOrder([...newKeys, ...allLocationValues])
          }
        }
      }
    }

    // Only update if the keys actually changed
    if (!setEquals(newKeys, currentKeys)) {
      prevSelectedEndpointKeysRef.current = newKeys
      setSelectedEndpointKeys(newKeys)
    } else {
      prevSelectedEndpointKeysRef.current = currentKeys
    }
  }, [selectedEndpointKeys, allPowerplantLocations, allLocationValues, isCMSUser])

  const endpointOptions = useMemo(() => {
    if (!data?.data?.locations)
      return [{ label: ALL_LOCATIONS_KEY, value: ALL_LOCATIONS_KEY }]

    const baseOptions: Array<{
      label: string
      value: string
      disabled?: boolean
    }> = []

    // Add "All" option
    baseOptions.push({
      label: ALL_LOCATIONS_KEY,
      value: ALL_LOCATIONS_KEY,
      disabled: false,
    })

    // For CMS users, add "All CMS" option
    if (isCMSUser) {
      baseOptions.push({ label: ALL_CMS_KEY, value: ALL_CMS_KEY, disabled: false })
    }

    // If "All" is selected or in reporting mode, show all locations enabled
    if (selectedWasteType === 'All' || reporting) {
      return [
        ...baseOptions,
        ...data?.data?.locations.map((loc) => ({
          label: loc.name,
          value: `${loc.entryType || 'location'}_${loc.id}`,
          disabled: false,
        })),
      ]
    }

    // Find all locations associated with the selected waste type
    const associatedLocationIds = new Set<string>()
    const associatedPowerplantIds = new Set<number>()

    data?.data?.jobSites?.forEach((site) => {
      site.wasteStreams?.forEach((ws) => {
        if (ws.name === selectedWasteType) {
          // Check if this waste stream goes to a location
          if (ws.processingLocation?.locationId) {
            associatedLocationIds.add(
              `${LOCATION_TYPES_MAP.location}_${ws.processingLocation.locationId}`
            )
          }
          // Check if this waste stream goes to a powerplant
          if (ws.processingLocation?.powerplantId) {
            associatedPowerplantIds.add(ws.processingLocation.powerplantId)
          }
        }
      })
    })

    // Create options with disabled state based on association
    return [
      ...baseOptions,
      ...data?.data?.locations.map((loc) => {
        const optionValue = `${loc.entryType || 'location'}_${loc.id}`
        const isAssociated =
          associatedLocationIds.has(optionValue) ||
          (loc.entryType === LOCATION_TYPES_MAP.powerplant &&
            associatedPowerplantIds.has(loc.id))

        return {
          label: loc.name,
          value: optionValue,
          // disabled: !isAssociated,
        }
      }),
    ]
  }, [data, selectedWasteType, reporting, isCMSUser])

  const displayedJobSites = useMemo(() => {
    if (!data?.data?.jobSites) {
      return []
    }

    // When reporting, show all job sites and waste streams without filtering
    if (reporting) {
      const allSites = (filteredJobSites || []).filter(
        (site) => site.wasteStreams && site.wasteStreams.length > 0
      )
      return allSites
    }

    // Check if "All" is selected (shows all locations)
    const allSelected = selectedEndpointKeys.includes(ALL_LOCATIONS_KEY)

    // Check if all powerplants are selected (via "All CMS" or individually)
    const allPowerplantsSelected =
      allPowerplantLocations.length > 0 &&
      (selectedEndpointKeys.includes(ALL_CMS_KEY) ||
        allPowerplantLocations.every((pp) => selectedEndpointKeys.includes(pp)))

    // Always filter wasteStreams by selected waste type,
    // and additionally by endpoint if specific ones are selected.
    return (filteredJobSites || [])
      .map((site) => ({
        ...site,
        wasteStreams: site?.wasteStreams?.filter((ws) => {
          const matchesWasteType =
            selectedWasteType === ALL_LOCATIONS_KEY || ws?.name === selectedWasteType

          // If no endpoints selected, show all matching waste type
          if (selectedEndpointKeys.length === 0) {
            return false
          }

          // If "All" is selected, show all destinations (both locations and powerplants)
          if (allSelected) {
            return matchesWasteType
          }

          // Check if waste stream matches any of the selected endpoints
          const matchesEndpoint = selectedEndpointKeys.some((key) => {
            const endpoint = parseEndpointKey(key)
            if (!endpoint) {
              // Handle "All CMS" - check if it's a powerplant destination
              if (key === ALL_CMS_KEY) {
                return !!ws?.processingLocation?.powerplantId
              }
              return false
            }
            return (
              (endpoint?.type === LOCATION_TYPES_MAP.location &&
                ws?.processingLocation?.locationId === endpoint.id) ||
              (endpoint?.type === LOCATION_TYPES_MAP.powerplant &&
                ws?.processingLocation?.powerplantId === endpoint.id)
            )
          })

          // Only include if it matches waste type AND at least one endpoint
          return matchesWasteType && matchesEndpoint
        }),
      }))
      .filter((site) => site.wasteStreams && site.wasteStreams.length > 0)
  }, [
    filteredJobSites,
    selectedEndpointKeys,
    selectedWasteType,
    reporting,
    allPowerplantLocations,
  ])

  // Only collected while the toggle is on, so nothing is fetched otherwise.
  const verificationImageUrls = useMemo(() => {
    if (!showVerificationImages) return []
    return Array.from(
      new Set(
        (displayedJobSites || []).flatMap((site) =>
          (site?.verificationImages || [])
            .map((image) => image?.imageUrl)
            .filter((url): url is string => !!url)
        )
      )
    )
  }, [displayedJobSites, showVerificationImages])

  const areVerificationImagesLoaded = useAreImagesPreloaded(verificationImageUrls)
  const isLoadingVerificationImages =
    showVerificationImages && !areVerificationImagesLoaded

  useEffect(() => {
    const onFullScreenChange = () => {
      const map = mapRef.current
      if (!map || !window.google) return

      const isFullScreen = !!document.fullscreenElement
      setIsFullScreen(isFullScreen)

      // Fit bounds code remains the same
      const bounds = new window.google.maps.LatLngBounds()
      displayedJobSites?.forEach((site) => {
        if (site?.address?.lat && site?.address?.lng) {
          bounds.extend(
            new window.google.maps.LatLng(site.address.lat, site.address.lng)
          )
        }
        site?.wasteStreams?.forEach((ws) => {
          const dest = getDestination(ws)
          if (dest?.address?.lat && dest?.address?.lng) {
            bounds.extend(
              new window.google.maps.LatLng(dest.address.lat, dest.address.lng)
            )
          }
        })
      })
      google.maps.event.trigger(map, 'resize')
      if (!bounds.isEmpty()) map.fitBounds(bounds, padding)
    }

    document.addEventListener('fullscreenchange', onFullScreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', onFullScreenChange)
  }, [displayedJobSites])

  const destinationRouteIndex = useMemo(() => {
    const map: Record<number, { siteId: number; wsId: number }[]> = {}

    displayedJobSites.forEach((site) => {
      site.wasteStreams.forEach((ws) => {
        const dest = getDestination(ws)
        const destId = dest?.locationId

        if (!map[destId]) map[destId] = []
        map[destId].push({ siteId: site.id, wsId: ws.id })
      })
    })

    return map
  }, [displayedJobSites])
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return
    const bounds = new window.google.maps.LatLngBounds()
    const map = mapRef.current
    const isFullScreen = !!document.fullscreenElement

    if (!displayedJobSites || displayedJobSites.length === 0) {
      map.setCenter(US_CENTER_FOR_MAP)
      map.setZoom(4)
      return
    }
    displayedJobSites?.forEach((site) => {
      if (site?.address?.lat && site?.address?.lng) {
        bounds.extend(
          new window.google.maps.LatLng(site.address.lat, site.address.lng)
        )
      }
      site?.wasteStreams?.forEach((ws) => {
        const dest = getDestination(ws)
        if (dest?.address?.lat && dest?.address?.lng) {
          bounds.extend(
            new window.google.maps.LatLng(dest.address.lat, dest.address.lng)
          )
        }
      })
    })

    if (isFullScreen) {
      // In fullscreen: fit bounds to show all locations
      map.fitBounds(bounds, padding)

      // Only adjust zoom if it's below minimum threshold
      const listener = google.maps.event.addListenerOnce(
        map,
        'bounds_changed',
        () => {
          const currentZoom = map.getZoom()
          if (currentZoom && currentZoom < 4.5) {
            // Use setZoom with a very small delay to minimize flicker
            requestAnimationFrame(() => {
              map.setZoom(4.5)
            })
          }
        }
      )
    } else {
      // Small screen: direct fitBounds for responsive zoom
      map.fitBounds(bounds, padding)
    }
  }, [displayedJobSites, defaultCenter, isLoaded])
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map

    // Create a stable DOM container owned by Google Maps and render into it via
    // a React portal. This prevents React's removeChild from crashing when the
    // component unmounts while in fullscreen (the old approach moved a
    // React-owned node out of the React tree, causing a DOM/vDOM mismatch).
    const container = document.createElement('div')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(container)
    setPortalContainer(container)

    if (!displayedJobSites || displayedJobSites.length === 0) {
      map.setCenter(US_CENTER_FOR_MAP)
      map.setZoom(4)
      return
    }

    const bounds = new window.google.maps.LatLngBounds()
    displayedJobSites.forEach((site) => {
      if (site.address?.lat && site.address?.lng) {
        bounds.extend(site.address)
      }
      site.wasteStreams?.forEach((ws) => {
        const dest = getDestination(ws)
        if (dest?.address?.lat && dest?.address?.lng) {
          bounds.extend(dest.address)
        }
      })
    })

    map.fitBounds(bounds, padding)

    // For single point, set appropriate zoom
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      const currentZoom = map.getZoom()
      if (currentZoom && currentZoom > 14) {
        map.setZoom(14)
      }
    })
  }

  if (!isLoaded) return <div>Loading map...</div>

  // Create curved path between two points (bezier curve)

  // Handle marker click - zoom to location
  const handleMarkerClick = (location: Location) => {
    if (!mapRef.current || !window.google) return

    const map = mapRef.current
    const { lat, lng } = location

    // Determine zoom based on latitude
    const zoom = Math.abs(lat) > 55 ? 6 : 12
    map.setZoom(zoom)

    // Pan to location with clamping to edges
    const clampedLat = Math.min(Math.max(lat, -85), 85)
    const clampedLng = Math.min(Math.max(lng, -180), 180)
    map.panTo({ lat: clampedLat, lng: clampedLng })
  }

  const getCurvedPath = (
    from: Location,
    to: Location,
    curvature = 0.2
  ): google.maps.LatLngLiteral[] => {
    // Control point for curvature
    const latMid = (from?.lat + to?.lat) / 2
    const lngMid = (from?.lng + to?.lng) / 2

    // perpendicular offset for curve
    const offsetLat = latMid + curvature * (to?.lng - from?.lng)
    const offsetLng = lngMid - curvature * (to?.lat - from?.lat)

    const controlPoint = { lat: offsetLat, lng: offsetLng }

    const steps = 50
    const path: google.maps.LatLngLiteral[] = []

    for (let t = 0; t <= 1; t += 1 / steps) {
      const lat =
        (1 - t) * (1 - t) * from?.lat +
        2 * (1 - t) * t * controlPoint?.lat +
        t * t * to?.lat
      const lng =
        (1 - t) * (1 - t) * from?.lng +
        2 * (1 - t) * t * controlPoint?.lng +
        t * t * to?.lng
      path.push({ lat, lng })
    }

    // Ensure first and last points match exactly
    path[0] = { ...from }
    path[path.length - 1] = { ...to }

    return path
  }

  const { totalTonnage, totalDistance, totalCo2Avoided } = data?.data || {}
  return (
    <>
      <div ref={outsideTopBarContainerRef}>
        {!isFullScreen && (
          <TopBarContent
            isLoading={isStatsLoading}
            reporting={reporting}
            selectedWasteType={selectedWasteType}
            setSelectedWasteType={setSelectedWasteType}
            selectedEndpointKey={reporting ? reportingSelectedEndpointKey : selectedEndpointKeys}
            setSelectedEndpointKey={setSelectedEndpointKeys}
            dropdownRef={dropdownRef}
            totalTonnage={reporting ? totalTonnage : mapStats?.totalTonnage}
            totalDistance={reporting ? totalDistance : mapStats?.totalDistance}
            totalCo2Avoided={
              reporting ? totalCo2Avoided : mapStats?.totalCo2Avoided
            }
            wasteStreams={data?.data?.wasteStreams}
            endpointOptions={endpointOptions}
            isFullScreen={false}
            showVerificationImages={showVerificationImages}
            setShowVerificationImages={setShowVerificationImages}
          />
        )}
      </div>

      {/* Portal renders the fullscreen top bar into the Google Maps controls
          container, keeping the node inside the React tree so unmounting is safe */}
      {portalContainer && isFullScreen && ReactDOM.createPortal(
        <TopBarContent
          isLoading={isStatsLoading}
          reporting={reporting}
          selectedWasteType={selectedWasteType}
          setSelectedWasteType={setSelectedWasteType}
          selectedEndpointKey={reporting ? reportingSelectedEndpointKey : selectedEndpointKeys}
          setSelectedEndpointKey={setSelectedEndpointKeys}
          dropdownRef={dropdownRef}
          totalTonnage={reporting ? totalTonnage : mapStats?.totalTonnage}
          totalDistance={reporting ? totalDistance : mapStats?.totalDistance}
          totalCo2Avoided={
            reporting ? totalCo2Avoided : mapStats?.totalCo2Avoided
          }
          wasteStreams={data?.data?.wasteStreams}
          endpointOptions={endpointOptions}
          isFullScreen={true}
          showVerificationImages={showVerificationImages}
          setShowVerificationImages={setShowVerificationImages}
        />,
        portalContainer
      )}
      <div
        className={isFullScreen ? 'map-container-fullscreen' : 'map-container for-mobile-map'}
        style={{
          width: '100%',
          height: '500px',
          position: 'relative',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Outside container for React DOM */}

        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={defaultCenter}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            gestureHandling: 'cooperative',
            disableDefaultUI: false,
            fullscreenControl: true,
            backgroundColor: '#ffffff',
            styles: mapStyle,
            minZoom: 3,
            restriction: {
              latLngBounds: {
                east: 179.9999,
                north: 85,
                south: -85,
                west: -179.9999,
              },
              strictBounds: false,
            },
          }}
        >
          {/* Job site markers + waste streams */}
          {displayedJobSites?.map((site) => {
            // Group wastestreams by destination to handle overlapping paths
            const streamsByDestination = site?.wasteStreams?.reduce(
              (acc, ws) => {
                const key = `${ws.processingLocation?.address?.lat},${ws.processingLocation?.address?.lng}`
                if (!acc[key]) acc[key] = []
                acc[key].push(ws)
                return acc
              },
              {} as Record<string, typeof site.wasteStreams>
            )

            // Create purple pill for jobsite name
            const jobSiteName = site.title
            const jobSiteTextLength = jobSiteName.length * 7 + 20
            const jobSitePillSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${jobSiteTextLength}" height="24">
              <rect x="0" y="0" width="${jobSiteTextLength}" height="24" rx="12" ry="12" 
                    fill="#9080AC" stroke="none"/>
              <text x="${jobSiteTextLength / 2}" y="16" font-family="Arial, sans-serif" font-size="12" 
                    font-weight="SemiBold" fill="#FFFFFF" text-anchor="middle">${jobSiteName}</text>
            </svg>
          `
            const verificationImages = [...(site?.verificationImages || [])].sort(
              (a, b) =>
                new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
            )

            return (
              <React.Fragment key={site.id}>
                <SiteLogoMarker
                  clientImageUrl={site?.clientImageUrl}
                  position={site?.address}
                  title={site?.title}
                  onClick={() => handleMarkerClick(site?.address)}
                />

                {/* Purple pill label for jobsite name below marker */}
                <Marker
                  position={{
                    lat: site?.address?.lat - 0.0008,
                    lng: site?.address?.lng,
                  }}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(jobSitePillSvg)}`,
                    scaledSize: new window.google.maps.Size(
                      jobSiteTextLength,
                      24
                    ),

                    // 👇 push pill DOWN relative to its own size + icon size
                    anchor: new window.google.maps.Point(
                      jobSiteTextLength / 2,
                      -24 // negative = below the main marker
                    ),
                  }}
                />

                {showVerificationImages && areVerificationImagesLoaded && verificationImages.map((image, imageIndex) => {
                  const { xPx, yPx } = getVerificationImagePixelOffset(imageIndex)

                  return (
                    <VerificationImageMarker
                      key={`verification-image-${image.id}`}
                      imageUrl={image.imageUrl}
                      position={site.address}
                      onClick={() => handleMarkerClick(site.address)}
                      anchorX={20 - xPx}
                      anchorY={20 - yPx}
                    />
                  )
                })}

                {site.wasteStreams?.map((ws) => {
                  const isLandFill = ws?.processingLocation?.type === 1
                  const colorCode = isLandFill ? '#FF5733' : ws?.colorCode
                  const dest = getDestination(ws)
                  // Find how many streams go to the same destination
                  const destKey = `${dest?.address?.lat},${dest?.address?.lng}`
                  const streamsToSameDest = streamsByDestination[destKey]

                  const destId = dest?.locationId
                  const routesToThisDestination = destinationRouteIndex[destId]
                  const total = routesToThisDestination.length
                  const indexInGroup = routesToThisDestination.findIndex(
                    (r) => r.siteId === site.id && r.wsId === ws.id
                  )

                  // Vary curvature based on position in group
                  // For multiple paths to same destination, spread them out
                  let curvature = 0.2
                  if (total > 1) {
                    const spread = 0.25
                    const center = (total - 1) / 2
                    curvature = (indexInGroup - center) * spread
                  }

                  const path = getCurvedPath(
                    site.address,
                    dest?.address,
                    curvature
                  )
                  // Get midpoint of the curved path for label placement
                  const midpointIndex = Math.floor(path.length / 2)
                  const midpoint = path[midpointIndex]

                  // Create pill-style label SVG for tons
                  const tonsText = `${Math.round(Number(ws.tons))} tn`
                  const tonsPillSvg = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="24">
                    <rect x="0" y="0" width="60" height="24" rx="12" ry="12" 
                          fill="#FFFFFF" stroke="#462C75" stroke-width="1"/>
                    <text x="30" y="16" font-family="Arial, sans-serif" font-size="12" 
                          font-weight="bold" fill="#462C75" text-anchor="middle">${tonsText}</text>
                  </svg>
                `

                  // Create gray pill for wastestream name
                  const nameText = dest?.name

                  const textLength = nameText?.length * 7 + 20 // Approximate width
                  const namePillSvg = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="${textLength}" height="24">
                    <rect x="0" y="0" width="${textLength}" height="24" rx="12" ry="12" 
                          fill="#808080" stroke="none"/>
                    <text x="${textLength / 2}" y="16" font-family="Arial, sans-serif" font-size="12" 
                          font-weight="bold" fill="#FFFFFF" text-anchor="middle">${nameText}</text>
                  </svg>
                `

                  return (
                    <React.Fragment key={ws.id}>
                      <Marker
                        position={dest?.address}
                        onClick={() => handleMarkerClick(dest?.address)}
                        icon={{
                          url: '/images/icon_map-pin.svg',
                          // scaledSize: new window.google.maps.Size(28, 28),
                          // anchor: new window.google.maps.Point(14, 14),
                          scaledSize: new window.google.maps.Size(24, 39),
                          anchor: new window.google.maps.Point(14, 14),
                        }}
                        title={ws.name}
                      />

                      {/* Gray pill label for wastestream name below marker */}
                      <Marker
                        position={{
                          lat: dest?.address?.lat - 0.0008,
                          lng: dest?.address?.lng,
                        }}
                        icon={{
                          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(namePillSvg)}`,
                          scaledSize: new window.google.maps.Size(
                            textLength,
                            24
                          ),

                          // ⬇ push pill BELOW the pin using pixels
                          anchor: new window.google.maps.Point(
                            textLength / 2,
                            -18 // adjust as needed
                          ),
                        }}
                      />

                      {/* Pill-style label at midpoint showing tons */}
                      <Marker
                        position={midpoint}
                        icon={{
                          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(tonsPillSvg)}`,
                          scaledSize: new window.google.maps.Size(60, 24),
                          anchor: new window.google.maps.Point(30, 12),
                        }}
                      />
                      <MultiDensityPolyline path={path} color={colorCode} />
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          })}
        </GoogleMap>

        {/* Blocks interaction with the map and shows a single, central loader
            until every verification image has finished loading, instead of
            a separate loader per marker. */}
        {isLoadingVerificationImages && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              zIndex: 20,
            }}
          >
            <img
              src="/images/loader.png"
              alt="Loading..."
              style={{
                width: 80,
                height: 80,
                animation: 'spin 1s linear infinite',
                transformOrigin: 'center center',
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default MapComponent
