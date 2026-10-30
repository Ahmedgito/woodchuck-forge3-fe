// Centralized Google Maps configuration
// All components using useJsApiLoader must use this same config to avoid conflicts

export const GOOGLE_MAPS_LIBRARIES: (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'visualization'
)[] = ['places']

export const GOOGLE_MAPS_CONFIG = {
  id: 'google-map-script',
  libraries: GOOGLE_MAPS_LIBRARIES,
}
