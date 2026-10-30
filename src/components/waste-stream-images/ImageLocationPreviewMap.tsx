'use client'

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Spin } from 'antd'
import { GOOGLE_MAPS_CONFIG } from '@/src/utils/constants/googleMapsConfig'

type Props = {
  latitude: number
  longitude: number
}

const MAP_SIZE = { width: '100%', height: '100%' }

export function ImageLocationPreviewMap({ latitude, longitude }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    ...GOOGLE_MAPS_CONFIG,
  })

  const center = { lat: latitude, lng: longitude }

  if (!apiKey || loadError) {
    return null
  }

  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <button
      type="button"
      className="waste-stream-image-metadata__map"
      onClick={openInMaps}
      title="Open in Google Maps"
      aria-label="Open capture location in Google Maps"
    >
      {!isLoaded ? (
        <Spin size="small" />
      ) : (
        <GoogleMap
          mapContainerStyle={MAP_SIZE}
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: true,
            gestureHandling: 'none',
            draggable: false,
            keyboardShortcuts: false,
            clickableIcons: false,
            scrollwheel: false,
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      )}
    </button>
  )
}

export default ImageLocationPreviewMap
