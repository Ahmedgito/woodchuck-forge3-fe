'use client'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from '@react-google-maps/api'
import { Select } from 'antd'
import { GOOGLE_MAPS_CONFIG } from '@/src/utils/constants/googleMapsConfig'

interface Location {
  lat: number
  lng: number
  name?: string
}

interface RouteData {
  from: Location
  to: Location
  offsetTo?: Location // Offset destination for visual separation when multiple routes go to same endpoint
  weight?: string // e.g., "5tn", "6tn"
  routeType?: 'start' | 'jobSite'
  color?: string
  jobSiteName?: string
}

interface MapComponentProps {
  routes?: RouteData[]
}

type EndpointDefinition = {
  key: string
  name: string
  location: Location
  wasteTypes: string[]
  totalWeight: string
  jobSites: Array<{
    name: string
    location: Location
    weight: string
  }>
  // New field for waste type specific weights (for new data structure)
  wasteTypeWeights?: Record<string, string>
}

// Start point - same for all routes
const startPoint: Location = {
  lat: 42.9634,
  lng: -85.6681,
  name: '3190 Walnut Lake Ct',
}

// Route colors for different routes - purple and green as shown in image
const routeColors = ['#9C27B0', '#4CAF50', '#9C27B0', '#4CAF50', '#9C27B0']

// OLD DATA - Kept for reference, can be used by switching data source
// To use old data, replace endpointDefinitions with _oldEndpointDefinitions below
const _oldEndpointDefinitions: EndpointDefinition[] = [
  {
    key: 'arbor-hills',
    name: 'Arbor Hills Landfill',
    location: { lat: 42.7336, lng: -84.5555, name: 'Arbor Hills Landfill' },
    wasteTypes: ['Wood waste'],
    totalWeight: '108tn',
    jobSites: [
      {
        name: 'Hudsonville Job Site',
        location: { lat: 42.8709, lng: -85.865, name: 'Hudsonville Site' },
        weight: '45tn',
      },
      {
        name: 'Wyoming Plant',
        location: { lat: 42.9134, lng: -85.7053, name: 'Wyoming Plant' },
        weight: '38tn',
      },
    ],
  },
  {
    key: 'virtual-unit',
    name: 'Virtual Unit MRF',
    location: { lat: 42.8802, lng: -85.5202, name: 'Virtual Unit' },
    wasteTypes: ['Wood waste'],
    totalWeight: '92tn',
    jobSites: [
      {
        name: 'Holland Fabrication',
        location: { lat: 42.7875, lng: -86.1089, name: 'Holland Fabrication' },
        weight: '40tn',
      },
      {
        name: 'Grandville Yard',
        location: { lat: 42.909, lng: -85.7634, name: 'Grandville Yard' },
        weight: '30tn',
      },
    ],
  },
  {
    key: 'metal-processing',
    name: 'Metal Processing Center',
    location: { lat: 42.3314, lng: -83.0458, name: 'Metal Processing Center' },
    wasteTypes: ['Metal'],
    totalWeight: '95tn',
    jobSites: [
      {
        name: 'Detroit Metal Works',
        location: { lat: 42.3414, lng: -83.0558, name: 'Detroit Metal Works' },
        weight: '52tn',
      },
      {
        name: 'Dearborn Foundry',
        location: { lat: 42.3223, lng: -83.1763, name: 'Dearborn Foundry' },
        weight: '43tn',
      },
    ],
  },
  {
    key: 'woodchuck-depot',
    name: 'Woodchuck Depot',
    location: { lat: 42.2808, lng: -83.743, name: 'Woodchuck Depot' },
    wasteTypes: ['Metal'],
    totalWeight: '85tn',
    jobSites: [
      {
        name: 'Ann Arbor Job Site',
        location: { lat: 42.262, lng: -83.748, name: 'Ann Arbor Job Site' },
        weight: '32tn',
      },
      {
        name: 'Saline Rebuild',
        location: { lat: 42.166, lng: -83.781, name: 'Saline Rebuild' },
        weight: '28tn',
      },
    ],
  },
  {
    key: 'plastic-recycling',
    name: 'Plastic Recycling Plant',
    location: { lat: 42.2917, lng: -85.5872, name: 'Plastic Recycling Plant' },
    wasteTypes: ['Plastic'],
    totalWeight: '78tn',
    jobSites: [
      {
        name: 'Kalamazoo Processing',
        location: { lat: 42.2156, lng: -85.4878, name: 'Kalamazoo Processing' },
        weight: '42tn',
      },
      {
        name: 'Battle Creek Facility',
        location: {
          lat: 42.3212,
          lng: -85.1797,
          name: 'Battle Creek Facility',
        },
        weight: '36tn',
      },
    ],
  },
  {
    key: 'transfer-station',
    name: 'Westshore Transfer Station',
    location: {
      lat: 42.9613,
      lng: -85.6557,
      name: 'Westshore Transfer Station',
    },
    wasteTypes: ['Plastic'],
    totalWeight: '68tn',
    jobSites: [
      {
        name: 'South Haven Yard',
        location: { lat: 42.403, lng: -86.2739, name: 'South Haven Yard' },
        weight: '25tn',
      },
      {
        name: 'Benton Harbor Facility',
        location: { lat: 42.112, lng: -86.454, name: 'Benton Harbor Facility' },
        weight: '22tn',
      },
    ],
  },
  {
    key: 'concrete-hub',
    name: 'Concrete Processing Hub',
    location: { lat: 42.6526, lng: -84.5467, name: 'Concrete Processing Hub' },
    wasteTypes: ['Concrete'],
    totalWeight: '76tn',
    jobSites: [
      {
        name: 'Okemos Development',
        location: { lat: 42.725, lng: -84.443, name: 'Okemos Development' },
        weight: '29tn',
      },
      {
        name: 'Portland Plant',
        location: { lat: 42.869, lng: -84.902, name: 'Portland Plant' },
        weight: '24tn',
      },
    ],
  },
  {
    key: 'concrete-crushing',
    name: 'Concrete Crushing Facility',
    location: {
      lat: 42.7336,
      lng: -84.4807,
      name: 'Concrete Crushing Facility',
    },
    wasteTypes: ['Concrete'],
    totalWeight: '64tn',
    jobSites: [
      {
        name: 'Lansing Construction',
        location: { lat: 42.7325, lng: -84.5555, name: 'Lansing Construction' },
        weight: '35tn',
      },
      {
        name: 'East Lansing Site',
        location: { lat: 42.737, lng: -84.4839, name: 'East Lansing Site' },
        weight: '29tn',
      },
    ],
  },
  {
    key: 'hauling-center',
    name: 'Waste Hauling Center',
    location: { lat: 42.2917, lng: -85.5872, name: 'Waste Hauling Center' },
    wasteTypes: ['Waste Hauling'],
    totalWeight: '88tn',
    jobSites: [
      {
        name: 'Kalamazoo Transfer',
        location: { lat: 42.2817, lng: -85.5772, name: 'Kalamazoo Transfer' },
        weight: '48tn',
      },
      {
        name: 'Portage Collection',
        location: { lat: 42.2012, lng: -85.58, name: 'Portage Collection' },
        weight: '40tn',
      },
    ],
  },
  {
    key: 'hauling-depot',
    name: 'Hauling Depot',
    location: { lat: 42.6526, lng: -84.5467, name: 'Hauling Depot' },
    wasteTypes: ['Waste Hauling'],
    totalWeight: '72tn',
    jobSites: [
      {
        name: 'Charlotte Facility',
        location: { lat: 42.5636, lng: -84.8358, name: 'Charlotte Facility' },
        weight: '38tn',
      },
      {
        name: 'Eaton Rapids Yard',
        location: { lat: 42.5092, lng: -84.6558, name: 'Eaton Rapids Yard' },
        weight: '34tn',
      },
    ],
  },
]

// NEW DATA - Currently active
const endpointDefinitions: EndpointDefinition[] = [
  {
    key: 'woodchuck',
    name: 'Woodchuck',
    location: { lat: 42.8802, lng: -85.5202, name: 'Woodchuck' }, // Different location from start point
    wasteTypes: ['Wood waste', 'Waste hauling'],
    totalWeight: '30tn', // 20tn + 10tn
    jobSites: [], // No job sites for this data structure
    wasteTypeWeights: {
      'Wood waste': '20tn',
      'Waste hauling': '10tn',
    },
  },
  {
    key: 'recycling',
    name: 'Recycling',
    location: { lat: 42.7336, lng: -84.5555, name: 'Recycling' }, // Different location from Woodchuck
    wasteTypes: ['Cardboard'],
    totalWeight: '50tn',
    jobSites: [], // No job sites for this data structure
    wasteTypeWeights: {
      Cardboard: '50tn',
    },
  },
]

// Map style - grayscale minimalist style, removing all colors
const _getMapStyles = (): any[] => [
  // Set default background to white for all features
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [{ saturation: -100 }, { lightness: 100 }],
  },
  // Remove all colors - make everything grayscale
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  {
    featureType: 'all',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }, { saturation: -100 }, { lightness: 90 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ saturation: -100 }, { lightness: 40 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  // Water - grey
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#9e9e9e' }, { saturation: -100 }, { lightness: 50 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#9e9e9e' }, { saturation: -100 }],
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  // Landscape - white
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  // Parks - white
  {
    featureType: 'park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  // Urban areas - white
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d0d0d0' }, { saturation: -100 }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  // Show city labels - dark gray text
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#212121' }, { saturation: -100 }, { visibility: 'on' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { visibility: 'on' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  // Show state/province labels
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }, { saturation: -100 }, { visibility: 'on' }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }],
  },
  // Hide country labels or make them subtle
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }, { saturation: -100 }, { visibility: 'on' }],
  },
  // Hide all road labels
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  // Roads - light grey
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#e0e0e0' }, { saturation: -100 }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#bdbdbd' }, { saturation: -100 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#e0e0e0' }, { saturation: -100 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#bdbdbd' }, { saturation: -100 }],
  },
  // Hide transit completely
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  // Administrative areas - white
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }, { saturation: -100 }],
  },
  // Ensure all other features default to white
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }, { saturation: -100 }, { lightness: 100 }],
  },
]

// Create diamond/star icon for start points (compass rose style)
const createDiamondIcon = (color: string) => {
  // Diamond/star shape - compass rose style with 8 points
  // Creates a diamond with additional points for star effect
  const diamondPath =
    'M 0,-18 L 6,-6 L 18,0 L 6,6 L 0,18 L -6,6 L -18,0 L -6,-6 Z'
  return {
    path: diamondPath,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1,
    anchor:
      typeof window !== 'undefined' && window.google
        ? new window.google.maps.Point(0, 0)
        : undefined,
  }
}

// Create hexagonal marker icon (for endpoints) - kept for potential future use
const _createHexagonIcon = (color: string) => {
  // Hexagon SVG path: M (move to), L (line to) - creates a hexagon
  const hexagonPath = 'M 0,-15 L 13,-7.5 L 13,7.5 L 0,15 L -13,7.5 L -13,-7.5 Z'
  return {
    path: hexagonPath,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1,
  }
}

// Create triangular weight label icon pointing towards destination
const createTriangleIcon = (
  color: string,
  rotation: number = 0,
  labelOrigin?: google.maps.Point
) => {
  if (typeof window === 'undefined' || !window.google) {
    return undefined
  }
  // Triangle pointing up (will be rotated to point towards destination) - slightly bigger
  const trianglePath = 'M 0,-8 L -7,8 L 7,8 Z'
  return {
    path: trianglePath,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 1.5,
    scale: 1.0,
    rotation: rotation, // Rotate to point towards destination
    anchor: new window.google.maps.Point(0, 0), // Center anchor
    ...(labelOrigin && { labelOrigin }), // Include labelOrigin if provided
  }
}

// Create circular job site icon with 'C' symbol
const createJobSiteIcon = () => {
  if (typeof window === 'undefined' || !window.google) {
    return undefined
  }
  // Create a black circle with white 'C' - using SVG data URL
  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#000000" stroke="#FFFFFF" stroke-width="2"/>
      <text x="20" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">C</text>
    </svg>
  `
  const encodedSvg = encodeURIComponent(svg)
  return {
    url: `data:image/svg+xml,${encodedSvg}`,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20), // Center the icon
  }
}

const wasteTypeOptions = [
  { label: 'All', value: 'All' },
  { label: 'Wood waste', value: 'Wood waste' },
  { label: 'Waste hauling', value: 'Waste hauling' },
  { label: 'Cardboard', value: 'Cardboard' },
  // Old data options (kept for reference)
  { label: 'Metal', value: 'Metal' },
  { label: 'Plastic', value: 'Plastic' },
  { label: 'Concrete', value: 'Concrete' },
  { label: 'Waste Hauling', value: 'Waste Hauling' },
]

const MapComponent: React.FC<MapComponentProps> = ({ routes: propRoutes }) => {
  // You'll need to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const [selectedWasteType, setSelectedWasteType] = useState<string>('All')
  const [selectedEndpointKey, setSelectedEndpointKey] = useState<string>('All')
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded } = useJsApiLoader({
    ...GOOGLE_MAPS_CONFIG,
    googleMapsApiKey: apiKey,
  })

  // Calculate offset position for routes going to the same endpoint
  // This creates visual separation by offsetting the route destination at different angles
  const calculateOffsetPosition = (
    originalLocation: Location,
    totalRoutes: number,
    routeIndex: number,
    offsetDistance: number = 0.003 // ~300 meters offset - small enough to reach marker, large enough for separation
  ): Location => {
    // Distribute routes evenly around the endpoint (360 degrees / totalRoutes)
    const angleStep = 360 / totalRoutes
    const angle = (routeIndex * angleStep * Math.PI) / 180 // Convert to radians

    // Calculate offset in lat/lng (approximate, works well for small distances)
    const latOffset = offsetDistance * Math.cos(angle)
    const lngOffset = offsetDistance * Math.sin(angle)

    return {
      lat: originalLocation.lat + latOffset,
      lng: originalLocation.lng + lngOffset,
      name: originalLocation.name,
    }
  }

  const filteredEndpoints = useMemo(() => {
    if (selectedWasteType === 'All') return endpointDefinitions
    return endpointDefinitions.filter((endpoint) =>
      endpoint.wasteTypes.includes(selectedWasteType)
    )
  }, [selectedWasteType])

  const endpointOptions = useMemo(
    () => [
      { label: 'All', value: 'All' },
      ...filteredEndpoints.map((endpoint) => ({
        label: endpoint.name,
        value: endpoint.key,
      })),
    ],
    [filteredEndpoints]
  )

  useEffect(() => {
    if (filteredEndpoints.length === 0) {
      setSelectedEndpointKey('All')
      return
    }

    setSelectedEndpointKey((prev) => {
      // Keep "All" if it was selected
      if (prev === 'All') {
        return 'All'
      }
      // Keep current selection if it's still valid
      if (prev && filteredEndpoints.some((endpoint) => endpoint.key === prev)) {
        return prev
      }
      // Default to "All" instead of first endpoint
      return 'All'
    })
  }, [filteredEndpoints])

  const selectedEndpointData = useMemo(() => {
    if (selectedEndpointKey === 'All') return null
    return filteredEndpoints.find(
      (endpoint) => endpoint.key === selectedEndpointKey
    )
  }, [filteredEndpoints, selectedEndpointKey])

  const generatedRoutes = useMemo<RouteData[]>(() => {
    // If "All" is selected for endpoints, show routes for all filtered endpoints
    if (selectedEndpointKey === 'All') {
      const allRoutes: RouteData[] = []
      let routeIndex = 0

      filteredEndpoints.forEach((endpointData) => {
        const endpoint = endpointData.location

        // If job sites exist (old data structure), use them
        if (endpointData.jobSites.length > 0) {
          const jobSiteRoutes: RouteData[] = endpointData.jobSites.map(
            (jobSite) => ({
              from: jobSite.location,
              to: endpoint,
              weight: jobSite.weight,
              routeType: 'jobSite',
              color: routeColors[routeIndex % routeColors.length],
              jobSiteName: jobSite.name,
            })
          )
          routeIndex++

          const startRoute: RouteData = {
            from: startPoint,
            to: endpoint,
            weight: endpointData.totalWeight,
            routeType: 'start',
            color: routeColors[routeIndex % routeColors.length],
            jobSiteName: endpointData.name,
          }
          routeIndex++

          allRoutes.push(startRoute, ...jobSiteRoutes)
        } else {
          // New data structure: create routes from start point
          if (endpointData.wasteTypeWeights) {
            if (selectedWasteType === 'All') {
              // Show all waste types for this endpoint
              Object.entries(endpointData.wasteTypeWeights).forEach(
                ([wasteType, weight]) => {
                  allRoutes.push({
                    from: startPoint,
                    to: endpoint,
                    weight: weight,
                    routeType: 'start',
                    color: routeColors[routeIndex % routeColors.length],
                    jobSiteName: `${endpointData.name} - ${wasteType}`,
                  })
                  routeIndex++
                }
              )
            } else {
              // Show only selected waste type
              const weight = endpointData.wasteTypeWeights[selectedWasteType]
              if (weight) {
                allRoutes.push({
                  from: startPoint,
                  to: endpoint,
                  weight: weight,
                  routeType: 'start',
                  color: routeColors[routeIndex % routeColors.length],
                  jobSiteName: endpointData.name,
                })
                routeIndex++
              }
            }
          } else {
            // Fallback
            allRoutes.push({
              from: startPoint,
              to: endpoint,
              weight: endpointData.totalWeight,
              routeType: 'start',
              color: routeColors[routeIndex % routeColors.length],
              jobSiteName: endpointData.name,
            })
            routeIndex++
          }
        }
      })

      return allRoutes
    }

    // Single endpoint selected
    if (!selectedEndpointData) return []

    const endpoint = selectedEndpointData.location

    // If job sites exist (old data structure), use them
    if (selectedEndpointData.jobSites.length > 0) {
      const jobSiteRoutes: RouteData[] = selectedEndpointData.jobSites.map(
        (jobSite, index) => ({
          from: jobSite.location,
          to: endpoint,
          weight: jobSite.weight,
          routeType: 'jobSite',
          color: routeColors[index % routeColors.length],
          jobSiteName: jobSite.name,
        })
      )

      const startRoute: RouteData = {
        from: startPoint,
        to: endpoint,
        weight: selectedEndpointData.totalWeight,
        routeType: 'start',
        color: '#4CAF50',
        jobSiteName: selectedEndpointData.name,
      }

      return [startRoute, ...jobSiteRoutes]
    }

    // New data structure: create routes from start point based on selected waste type
    if (selectedEndpointData.wasteTypeWeights && selectedWasteType !== 'All') {
      const weight = selectedEndpointData.wasteTypeWeights[selectedWasteType]
      if (weight) {
        return [
          {
            from: startPoint,
            to: endpoint,
            weight: weight,
            routeType: 'start',
            color: '#4CAF50',
            jobSiteName: selectedEndpointData.name,
          },
        ]
      }
    }

    // Fallback: if "All" is selected or no wasteTypeWeights, show all routes
    if (selectedEndpointData.wasteTypeWeights) {
      return Object.entries(selectedEndpointData.wasteTypeWeights).map(
        ([wasteType, weight], index) => ({
          from: startPoint,
          to: endpoint,
          weight: weight,
          routeType: 'start',
          color: routeColors[index % routeColors.length],
          jobSiteName: `${selectedEndpointData.name} - ${wasteType}`,
        })
      )
    }

    // Default fallback
    return [
      {
        from: startPoint,
        to: endpoint,
        weight: selectedEndpointData.totalWeight,
        routeType: 'start',
        color: '#4CAF50',
        jobSiteName: selectedEndpointData.name,
      },
    ]
  }, [
    selectedEndpointData,
    selectedWasteType,
    selectedEndpointKey,
    filteredEndpoints,
  ])

  // Process routes to add offsets for routes going to the same endpoint
  const processedRoutes = useMemo<RouteData[]>(() => {
    const routesToProcess = propRoutes ?? generatedRoutes

    // Group routes by destination endpoint (using lat/lng as key)
    const routesByEndpoint = new Map<
      string,
      { routes: RouteData[]; indices: number[] }
    >()

    routesToProcess.forEach((route, index) => {
      const key = `${route.to.lat.toFixed(6)},${route.to.lng.toFixed(6)}`
      if (!routesByEndpoint.has(key)) {
        routesByEndpoint.set(key, { routes: [], indices: [] })
      }
      routesByEndpoint.get(key)!.routes.push(route)
      routesByEndpoint.get(key)!.indices.push(index)
    })

    // Process each group and add offsets
    const processed: RouteData[] = [...routesToProcess]

    routesByEndpoint.forEach((group) => {
      // Only add offsets if there are multiple routes to the same endpoint
      if (group.routes.length > 1) {
        group.routes.forEach((route, routeIndex) => {
          const originalIndex = group.indices[routeIndex]
          const offsetTo = calculateOffsetPosition(
            route.to,
            group.routes.length,
            routeIndex
          )
          processed[originalIndex] = {
            ...route,
            offsetTo,
          }
        })
      }
    })

    return processed
  }, [propRoutes, generatedRoutes])

  const routes = processedRoutes

  // Fit bounds when routes change - create tight rectangle boundary around all markers
  useEffect(() => {
    if (
      isLoaded &&
      mapRef.current &&
      typeof window !== 'undefined' &&
      window.google
    ) {
      // Find the outermost points from all markers
      let minLat = Infinity
      let maxLat = -Infinity
      let minLng = Infinity
      let maxLng = -Infinity

      // Include start point
      minLat = Math.min(minLat, startPoint.lat)
      maxLat = Math.max(maxLat, startPoint.lat)
      minLng = Math.min(minLng, startPoint.lng)
      maxLng = Math.max(maxLng, startPoint.lng)

      // If "All" is selected, include all filtered endpoints
      if (selectedEndpointKey === 'All') {
        filteredEndpoints.forEach((endpointData) => {
          // Include endpoint
          minLat = Math.min(minLat, endpointData.location.lat)
          maxLat = Math.max(maxLat, endpointData.location.lat)
          minLng = Math.min(minLng, endpointData.location.lng)
          maxLng = Math.max(maxLng, endpointData.location.lng)

          // Include all job sites
          endpointData.jobSites.forEach((jobSite) => {
            minLat = Math.min(minLat, jobSite.location.lat)
            maxLat = Math.max(maxLat, jobSite.location.lat)
            minLng = Math.min(minLng, jobSite.location.lng)
            maxLng = Math.max(maxLng, jobSite.location.lng)
          })
        })
      } else if (selectedEndpointData) {
        // Single endpoint selected
        // Include endpoint
        minLat = Math.min(minLat, selectedEndpointData.location.lat)
        maxLat = Math.max(maxLat, selectedEndpointData.location.lat)
        minLng = Math.min(minLng, selectedEndpointData.location.lng)
        maxLng = Math.max(maxLng, selectedEndpointData.location.lng)

        // Include all job sites
        selectedEndpointData.jobSites.forEach((jobSite) => {
          minLat = Math.min(minLat, jobSite.location.lat)
          maxLat = Math.max(maxLat, jobSite.location.lat)
          minLng = Math.min(minLng, jobSite.location.lng)
          maxLng = Math.max(maxLng, jobSite.location.lng)
        })
      }

      // Create tight rectangle bounds from the outermost points
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(new window.google.maps.LatLng(minLat, minLng)) // Southwest corner
      bounds.extend(new window.google.maps.LatLng(maxLat, maxLng)) // Northeast corner

      // No padding - tight rectangle boundary
      const padding = { top: 0, right: 0, bottom: 0, left: 0 }

      // Fit bounds with tight rectangle - no extra map area
      if (mapRef.current) {
        mapRef.current.fitBounds(bounds, padding)
      }
    }
  }, [
    isLoaded,
    selectedEndpointData,
    selectedWasteType,
    selectedEndpointKey,
    filteredEndpoints,
  ])

  // Calculate center of map based on all locations (fallback)
  const mapCenter = useMemo(() => {
    if (routes.length === 0) return { lat: 0, lng: 0 }

    let totalLat = 0
    let totalLng = 0
    let count = 0

    routes.forEach((route) => {
      totalLat += route.from.lat + route.to.lat
      totalLng += route.from.lng + route.to.lng
      count += 2
    })

    return {
      lat: totalLat / count,
      lng: totalLng / count,
    }
  }, [routes])

  // Calculate bearing (direction) between two points
  const calculateBearing = (from: Location, to: Location): number => {
    const lat1 = (from.lat * Math.PI) / 180
    const lat2 = (to.lat * Math.PI) / 180
    const deltaLng = ((to.lng - from.lng) * Math.PI) / 180

    const x = Math.sin(deltaLng) * Math.cos(lat2)
    const y =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng)

    const bearing = (Math.atan2(x, y) * 180) / Math.PI
    return (bearing + 360) % 360
  }

  // Create curved path between two points (bezier curve)
  const createCurvedPath = (from: Location, to: Location): Location[] => {
    const points: Location[] = []
    const steps = 50 // Number of points in the curve

    // Calculate midpoint
    const midLat = (from.lat + to.lat) / 2
    const midLng = (from.lng + to.lng) / 2

    // Calculate distance (approximate)
    const latDiff = to.lat - from.lat
    const lngDiff = to.lng - from.lng
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)

    // Calculate bearing and perpendicular direction
    const bearing = calculateBearing(from, to)
    // Use -90 to curve upwards instead of +90 which curves downwards
    const perpendicularBearing = (bearing - 90 + 360) % 360

    // Control point offset (creates the curve bulge) - adjust intensity
    const curveIntensity = distance * 0.15 // Smaller value for subtle curve
    const radians = (perpendicularBearing * Math.PI) / 180

    // Control point (perpendicular to the line, creating an upward arc)
    const controlLat = midLat + curveIntensity * Math.cos(radians)
    const controlLng = midLng + curveIntensity * Math.sin(radians)

    // Generate quadratic bezier curve points
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      // Quadratic bezier formula: (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
      const lat =
        Math.pow(1 - t, 2) * from.lat +
        2 * (1 - t) * t * controlLat +
        Math.pow(t, 2) * to.lat
      const lng =
        Math.pow(1 - t, 2) * from.lng +
        2 * (1 - t) * t * controlLng +
        Math.pow(t, 2) * to.lng

      points.push({ lat, lng })
    }

    return points
  }

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map
    if (typeof window !== 'undefined' && window.google) {
      // Find the outermost points from all markers
      let minLat = Infinity
      let maxLat = -Infinity
      let minLng = Infinity
      let maxLng = -Infinity

      // Include start point
      minLat = Math.min(minLat, startPoint.lat)
      maxLat = Math.max(maxLat, startPoint.lat)
      minLng = Math.min(minLng, startPoint.lng)
      maxLng = Math.max(maxLng, startPoint.lng)

      // If "All" is selected, include all filtered endpoints
      if (selectedEndpointKey === 'All') {
        filteredEndpoints.forEach((endpointData) => {
          // Include endpoint
          minLat = Math.min(minLat, endpointData.location.lat)
          maxLat = Math.max(maxLat, endpointData.location.lat)
          minLng = Math.min(minLng, endpointData.location.lng)
          maxLng = Math.max(maxLng, endpointData.location.lng)

          // Include all job sites
          endpointData.jobSites.forEach((jobSite) => {
            minLat = Math.min(minLat, jobSite.location.lat)
            maxLat = Math.max(maxLat, jobSite.location.lat)
            minLng = Math.min(minLng, jobSite.location.lng)
            maxLng = Math.max(maxLng, jobSite.location.lng)
          })
        })
      } else if (selectedEndpointData) {
        // Single endpoint selected
        // Include endpoint
        minLat = Math.min(minLat, selectedEndpointData.location.lat)
        maxLat = Math.max(maxLat, selectedEndpointData.location.lat)
        minLng = Math.min(minLng, selectedEndpointData.location.lng)
        maxLng = Math.max(maxLng, selectedEndpointData.location.lng)

        // Include all job sites
        selectedEndpointData.jobSites.forEach((jobSite) => {
          minLat = Math.min(minLat, jobSite.location.lat)
          maxLat = Math.max(maxLat, jobSite.location.lat)
          minLng = Math.min(minLng, jobSite.location.lng)
          maxLng = Math.max(maxLng, jobSite.location.lng)
        })
      }

      // Create tight rectangle bounds
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(new window.google.maps.LatLng(minLat, minLng))
      bounds.extend(new window.google.maps.LatLng(maxLat, maxLng))

      // No padding - tight rectangle boundary
      const padding = { top: 0, right: 0, bottom: 0, left: 0 }
      map.fitBounds(bounds, padding)
    }
  }

  // Handle marker click - zoom to location
  const handleMarkerClick = (location: Location) => {
    if (mapRef.current && typeof window !== 'undefined' && window.google) {
      const latLng = new window.google.maps.LatLng(location.lat, location.lng)
      // Pan to location first
      mapRef.current.panTo(latLng)
      // Then zoom in with smooth animation - higher zoom level for closer view
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setZoom(16)
        }
      }, 300)
    }
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          width: '100%',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>Loading map...</div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        backgroundColor: '#ffffff',
      }}
    >
      {/* TOTAL CO2E label - top right corner */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: 'transparent',
          padding: '8px 12px',
          borderRadius: '4px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#000000',
        }}
      >
        TOTAL CO2E: 43 tn
      </div>

      {/* Dropdown selector */}
      {!propRoutes && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            minWidth: '240px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Select
            value={selectedWasteType}
            onChange={setSelectedWasteType}
            options={wasteTypeOptions}
            style={{ width: '100%' }}
            placeholder="Select waste type"
          />
          <Select
            value={selectedEndpointKey}
            onChange={setSelectedEndpointKey}
            options={endpointOptions}
            style={{ width: '100%' }}
            placeholder="Select endpoint"
            disabled={endpointOptions.length === 0}
          />
        </div>
      )}
      {/* <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={3}
        onLoad={onMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
          disableDefaultUI: false,
          styles: getMapStyles(),
          backgroundColor: '#ffffff',
        }}
      > */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={7}
        onLoad={onMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
          disableDefaultUI: false,
          backgroundColor: '#ffffff',
          styles: [
            {
              elementType: 'geometry',
              stylers: [{ color: '#fafafa' }], // off-white for land
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }], // grey text for labels
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#616161', visibility: 'on' }], // darker grey for city names
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.province',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575', visibility: 'on' }], // show province/state names
            },
            {
              featureType: 'administrative.province',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e', visibility: 'on' }], // show country names
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{ visibility: 'off' }], // hide borders but keep labels
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.fill',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }], // show points of interest
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }], // show POI labels
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }], // grey text for POI labels
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }, { color: '#e0e0e0' }], // show roads in light grey
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ visibility: 'on' }, { color: '#d0d0d0' }], // light grey road borders
            },
            {
              featureType: 'road',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }], // show road labels
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }], // grey text for road labels
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }, { color: '#d5d5d5' }], // slightly darker for highways
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ visibility: 'on' }, { color: '#c0c0c0' }],
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }, { color: '#e5e5e5' }], // lighter for arterial roads
            },
            {
              featureType: 'road.local',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }, { color: '#eeeeee' }], // lightest for local roads
            },
            {
              featureType: 'transit',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#bdbdbd' }], // grey water
            },
            {
              featureType: 'water',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#9e9e9e' }], // darker grey for water borders
            },
            {
              featureType: 'water',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }], // hide water labels
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#fafafa' }], // off-white for landscape
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry.fill',
              stylers: [{ color: '#fafafa' }], // off-white for natural landscape
            },
            {
              featureType: 'poi.business',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }], // show business locations
            },
            {
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }], // show business labels
            },
            {
              featureType: 'poi.business',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }], // grey text for business labels
            },
          ],
        }}
      >
        {/* Start point marker - diamond shape with black label box */}
        {isLoaded && typeof window !== 'undefined' && window.google && (
          <>
            <Marker
              position={startPoint}
              icon={createDiamondIcon('#4CAF50')} // Green diamond
              onClick={() => handleMarkerClick(startPoint)}
            />
            {/* Black rectangular label box */}
            <Marker
              position={{
                lat: startPoint.lat - 0.008, // Position below the marker
                lng: startPoint.lng,
              }}
              icon={{
                url:
                  'data:image/svg+xml;charset=UTF-8,' +
                  encodeURIComponent(`
                  <svg width="200" height="30" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="30" fill="#000000" rx="4"/>
                    <text x="100" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${startPoint.name || 'Start Point'}</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(200, 30),
                anchor: new window.google.maps.Point(100, 15),
              }}
            />
          </>
        )}

        {/* Endpoint markers - diamond shape with black label box */}
        {isLoaded &&
          typeof window !== 'undefined' &&
          window.google &&
          (selectedEndpointKey === 'All'
            ? filteredEndpoints.map((endpointData) => (
                <React.Fragment key={endpointData.key}>
                  <Marker
                    position={endpointData.location}
                    icon={createDiamondIcon('#2196F3')} // Blue diamond
                    onClick={() => handleMarkerClick(endpointData.location)}
                  />
                  {/* Black rectangular label box */}
                  <Marker
                    position={{
                      lat: endpointData.location.lat - 0.008,
                      lng: endpointData.location.lng,
                    }}
                    icon={{
                      url:
                        'data:image/svg+xml;charset=UTF-8,' +
                        encodeURIComponent(`
                        <svg width="200" height="30" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="30" fill="#000000" rx="4"/>
                          <text x="100" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${endpointData.name}</text>
                        </svg>
                      `),
                      scaledSize: new window.google.maps.Size(200, 30),
                      anchor: new window.google.maps.Point(100, 15),
                    }}
                  />
                </React.Fragment>
              ))
            : selectedEndpointData && (
                <>
                  <Marker
                    position={selectedEndpointData.location}
                    icon={createDiamondIcon('#2196F3')} // Blue diamond
                    onClick={() =>
                      handleMarkerClick(selectedEndpointData.location)
                    }
                  />
                  {/* Black rectangular label box */}
                  <Marker
                    position={{
                      lat: selectedEndpointData.location.lat - 0.008,
                      lng: selectedEndpointData.location.lng,
                    }}
                    icon={{
                      url:
                        'data:image/svg+xml;charset=UTF-8,' +
                        encodeURIComponent(`
                        <svg width="200" height="30" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="30" fill="#000000" rx="4"/>
                          <text x="100" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${selectedEndpointData.name}</text>
                        </svg>
                      `),
                      scaledSize: new window.google.maps.Size(200, 30),
                      anchor: new window.google.maps.Point(100, 15),
                    }}
                  />
                </>
              ))}

        {/* Job site markers - circular with 'C' and black label box */}
        {isLoaded &&
          typeof window !== 'undefined' &&
          window.google &&
          (selectedEndpointKey === 'All'
            ? filteredEndpoints.flatMap((endpointData) =>
                endpointData.jobSites.map((jobSite) => (
                  <React.Fragment key={`${endpointData.key}-${jobSite.name}`}>
                    <Marker
                      position={jobSite.location}
                      icon={createJobSiteIcon()}
                      onClick={() => handleMarkerClick(jobSite.location)}
                    />
                    {/* Black rectangular label box */}
                    <Marker
                      position={{
                        lat: jobSite.location.lat - 0.008,
                        lng: jobSite.location.lng,
                      }}
                      icon={{
                        url:
                          'data:image/svg+xml;charset=UTF-8,' +
                          encodeURIComponent(`
                          <svg width="120" height="25" xmlns="http://www.w3.org/2000/svg">
                            <rect width="120" height="25" fill="#000000" rx="4"/>
                            <text x="60" y="17" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">JS NAME</text>
                          </svg>
                        `),
                        scaledSize: new window.google.maps.Size(120, 25),
                        anchor: new window.google.maps.Point(60, 12),
                      }}
                    />
                  </React.Fragment>
                ))
              )
            : selectedEndpointData &&
              selectedEndpointData.jobSites.map((jobSite) => (
                <React.Fragment key={jobSite.name}>
                  <Marker
                    position={jobSite.location}
                    icon={createJobSiteIcon()}
                    onClick={() => handleMarkerClick(jobSite.location)}
                  />
                  {/* Black rectangular label box */}
                  <Marker
                    position={{
                      lat: jobSite.location.lat - 0.008,
                      lng: jobSite.location.lng,
                    }}
                    icon={{
                      url:
                        'data:image/svg+xml;charset=UTF-8,' +
                        encodeURIComponent(`
                        <svg width="120" height="25" xmlns="http://www.w3.org/2000/svg">
                          <rect width="120" height="25" fill="#000000" rx="4"/>
                          <text x="60" y="17" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">JS NAME</text>
                        </svg>
                      `),
                      scaledSize: new window.google.maps.Size(120, 25),
                      anchor: new window.google.maps.Point(60, 12),
                    }}
                  />
                </React.Fragment>
              )))}

        {routes.map((route, index) => {
          // Use offsetTo if available (for visual separation), otherwise use original to
          const routeDestination = route.offsetTo || route.to
          // Create curved path instead of straight line
          const curvedPath = createCurvedPath(route.from, routeDestination)
          // Get the actual midpoint on the curved path (middle point of the curve)
          const midpointOnCurve = curvedPath[Math.floor(curvedPath.length / 2)]
          // Calculate bearing from midpoint to destination to rotate triangle towards destination
          const triangleBearing = calculateBearing(
            midpointOnCurve,
            routeDestination
          )

          // Calculate distance in km
          const calculateDistance = (from: Location, to: Location): number => {
            const R = 6371 // Earth's radius in km
            const dLat = ((to.lat - from.lat) * Math.PI) / 180
            const dLng = ((to.lng - from.lng) * Math.PI) / 180
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((from.lat * Math.PI) / 180) *
                Math.cos((to.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return R * c
          }

          const distance = calculateDistance(route.from, routeDestination)
          // Format label: show "m" for minutes (short distances) or "h" for hours (long distances)
          // For variety, some routes show "M" prefix (like "M 230 h" in image)
          let routeLabel = ''
          if (distance < 50) {
            routeLabel = `${Math.round(distance)} m` // minutes for short distances
          } else if (distance < 200) {
            routeLabel =
              index % 3 === 0
                ? `M ${Math.round(distance)} h`
                : `${Math.round(distance)} h` // hours with occasional "M" prefix
          } else {
            routeLabel = `${Math.round(distance)} h` // hours for long distances
          }

          // Use modulo to cycle through colors for all routes
          const routeColor =
            route.color || routeColors[index % routeColors.length]

          return (
            <React.Fragment key={index}>
              {isLoaded && typeof window !== 'undefined' && window.google && (
                <Marker
                  position={midpointOnCurve}
                  label={{
                    text: routeLabel,
                    color: '#000000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  icon={createTriangleIcon(
                    routeColor,
                    triangleBearing,
                    new window.google.maps.Point(0, -25)
                  )} // Position label above the triangle
                  onClick={() => handleMarkerClick(midpointOnCurve)}
                />
              )}

              {/* Polyline - Thick and curved, no arrow head */}
              <Polyline
                path={curvedPath}
                options={{
                  strokeColor: routeColor,
                  strokeWeight: 6,
                  strokeOpacity: 0.9,
                  geodesic: false, // Don't use geodesic since we're creating our own curve
                }}
              />
            </React.Fragment>
          )
        })}
      </GoogleMap>
    </div>
  )
}

export default MapComponent
