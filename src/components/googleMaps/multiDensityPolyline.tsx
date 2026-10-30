'use client'

import { FLOW_ARROW_SYMBOL } from '@/src/utils/functions/mapFunctions'
import { Polyline } from '@react-google-maps/api'

type MultiDensityPolylineProps = {
  path: google.maps.LatLngLiteral[]
  repeatPx?: number
  color: string
}

export const MultiDensityPolyline = ({
  path,
  repeatPx = 8,
  color
}: MultiDensityPolylineProps) => {
  if (!path || path.length < 2) return null


  return (
    <Polyline
      path={path}
      options={{
        strokeOpacity: 0,
        icons: [
          {
            icon: {
              ...FLOW_ARROW_SYMBOL,
              fillColor: color, 
              rotation: -90,
            },
            offset: '0%',
            repeat: `3.46px`,
          },
        ],
      }}
    />
  )
}
