'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Typography, Input, InputRef } from 'antd'
import { useJsApiLoader } from '@react-google-maps/api'
import { StructuredAddress } from '@/src/utils/constants/types'
import { GOOGLE_MAPS_CONFIG } from '@/src/utils/constants/googleMapsConfig'

// Fallback suggestions used when Places API key is missing/invalid
// or autocomplete requests fail. These do NOT call Google for details;
// they use the pre-baked StructuredAddress below.
const FALLBACK_SUGGESTIONS = [
  {
    id: 'fallback-nyc',
    mainText: 'New York, NY',
    secondaryText: 'United States',
    structuredAddress: {
      addressFull: 'New York, NY, USA',
      addressLine1: 'New York',
      addressLine2: null,
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      lat: 40.7128,
      lng: -74.006,
      placeId: null,
    } as StructuredAddress,
  },
  {
    id: 'fallback-la',
    mainText: 'Los Angeles, CA',
    secondaryText: 'United States',
    structuredAddress: {
      addressFull: 'Los Angeles, CA, USA',
      addressLine1: 'Los Angeles',
      addressLine2: null,
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'US',
      lat: 34.0522,
      lng: -118.2437,
      placeId: null,
    } as StructuredAddress,
  },
  {
    id: 'fallback-chicago',
    mainText: 'Chicago, IL',
    secondaryText: 'United States',
    structuredAddress: {
      addressFull: 'Chicago, IL, USA',
      addressLine1: 'Chicago',
      addressLine2: null,
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'US',
      lat: 41.8781,
      lng: -87.6298,
      placeId: null,
    } as StructuredAddress,
  },
] as const

interface AddressAutocompleteProps {
  name?: string
  value?: string
  placeholder?: string
  errors?: { [key: string]: any }
  className?: string
  disabled?: boolean
  touched?: { [key: string]: any }
  onAddressSelect?: (address: StructuredAddress) => void
  onChange?: (value: string) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  label?: string
  apiKey?: string
  countryRestriction?: string | string[]
}

/**
 * Parses Google Places API address components into structured address format
 * Kept for potential legacy API fallback
 */
const parseAddressComponents = (
  place: google.maps.places.PlaceResult
): StructuredAddress | null => {
  if (!place.address_components || !place.geometry?.location) {
    return null
  }

  const components = place.address_components
  const location = place.geometry.location

  // Helper function to get component by type
  const getComponent = (type: string, shortName = false) => {
    const component = components.find((comp) => comp.types.includes(type))
    return component
      ? shortName
        ? component.short_name
        : component.long_name
      : ''
  }

  // Extract address components
  const streetNumber = getComponent('street_number')
  const route = getComponent('route')
  const subpremise = getComponent('subpremise') // For apartment/unit numbers
  const city =
    getComponent('locality') || getComponent('administrative_area_level_3')
  const state = getComponent('administrative_area_level_1', true) // Use short name for state
  const postalCode = getComponent('postal_code')
  const country = getComponent('country', true) // Use short name for country

  // Build address lines
  const addressLine1 = [streetNumber, route].filter(Boolean).join(' ').trim()
  const addressLine2 = subpremise || null
  const addressFull = place.formatted_address || ''
  const placeId = place.place_id || null

  // Get coordinates - handle both LatLng (methods) and LatLngLiteral (properties)
  const getLat = (): number => {
    const lat = location.lat
    return typeof lat === 'function' ? lat() : typeof lat === 'number' ? lat : 0
  }
  const getLng = (): number => {
    const lng = location.lng
    return typeof lng === 'function' ? lng() : typeof lng === 'number' ? lng : 0
  }
  const latitude = getLat()
  const longitude = getLng()

  return {
    addressFull,
    addressLine1: addressLine1 || addressFull,
    addressLine2,
    city: city || '',
    state: state || '',
    postalCode: postalCode || '',
    country: country || '',
    lat: latitude || 0,
    lng: longitude || 0,
    placeId,
  }
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  name = 'address',
  value,
  placeholder = 'Enter address',
  errors,
  className,
  disabled = false,
  touched,
  onAddressSelect,
  onChange,
  onBlur,
  label,
  apiKey,
  countryRestriction = 'us',
}) => {
  const inputRef = useRef<InputRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteSessionRef = useRef<any>(null)
  const sessionTokenRef = useRef<string | null>(null)
  const [autocompleteValue, setAutocompleteValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Only load Google Maps JS API if apiKey is provided (for AutocompleteSession)
  // Otherwise, we'll use our API routes exclusively
  const mapsApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const { isLoaded } = useJsApiLoader({
    ...GOOGLE_MAPS_CONFIG,
    googleMapsApiKey: mapsApiKey,
  })

  // Initialize AutocompleteSession when Google Maps is loaded (only once)
  useEffect(() => {
    if (
      isLoaded &&
      window.google?.maps?.places &&
      !autocompleteSessionRef.current
    ) {
      // Check if new AutocompleteSession API is available
      if ('AutocompleteSession' in window.google.maps.places) {
        const AutocompleteSession = (window.google.maps.places as any)
          .AutocompleteSession
        autocompleteSessionRef.current = new AutocompleteSession({
          includedRegionCodes: Array.isArray(countryRestriction)
            ? countryRestriction
            : [countryRestriction],
          // Include all address types - no restriction
        })
      }
    }

    // Cleanup session on unmount
    return () => {
      if (autocompleteSessionRef.current) {
        autocompleteSessionRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]) // Only create session once when loaded, countryRestriction is set at initialization

  // Sync external value with internal state
  useEffect(() => {
    if (value !== undefined) {
      setAutocompleteValue(value)
    }
  }, [value])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearSuggestions()
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showSuggestions])

  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (!input.trim()) {
        setSuggestions([])
        setShowSuggestions(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Use maintained session if available (client-side JS API)
        if (isLoaded && autocompleteSessionRef.current) {
          const result = await autocompleteSessionRef.current.getSuggestions({
            input,
          })

          if (result?.suggestions) {
            // Limit to 3 suggestions and add display text for consistency
            const limitedSuggestions = result.suggestions
              .slice(0, 3)
              .map((suggestion: any) => ({
                ...suggestion,
                displayText: suggestion.placePrediction?.text?.text || '',
              }))
            setSuggestions(limitedSuggestions)
            setShowSuggestions(true)
            setSelectedIndex(-1)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        } else {
          // Use our API route to hide API key
          // Generate session token if not exists (for session tracking)
          if (!sessionTokenRef.current) {
            sessionTokenRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }

          const countryParam = Array.isArray(countryRestriction)
            ? countryRestriction
            : [countryRestriction]

          const response = await fetch('/api/places/autocomplete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input: input,
              includedRegionCodes: countryParam,
              sessionToken: sessionTokenRef.current,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.suggestions && data.suggestions.length) {
              // Limit to 3 suggestions and add display text for consistency
              const limitedSuggestions = data.suggestions
                .slice(0, 3)
                .map((suggestion: any) => ({
                  ...suggestion,
                  displayText: suggestion.placePrediction?.text?.text || '',
                }))
              setSuggestions(limitedSuggestions)
              setShowSuggestions(true)
              setSelectedIndex(-1)
            } else {
              // No suggestions from API, show fallback ones
              setSuggestions([...FALLBACK_SUGGESTIONS])
              setShowSuggestions(true)
              setSelectedIndex(-1)
            }
          } else {
            // API error (e.g., invalid/missing key) – show fallback suggestions
            setSuggestions([...FALLBACK_SUGGESTIONS])
            setShowSuggestions(true)
            setSelectedIndex(-1)
          }
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        // Network or other error – show fallback suggestions
        setSuggestions([...FALLBACK_SUGGESTIONS])
        setShowSuggestions(true)
        setSelectedIndex(-1)
      } finally {
        setIsLoading(false)
      }
    },
    [countryRestriction, isLoaded]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setAutocompleteValue(newValue)
    onChange?.(newValue)

    // Debounce API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)
  }

  const clearSuggestions = () => {
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setShowSuggestions(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        clearSuggestions()
        inputRef.current?.blur()
        break
    }
  }

  const handleSelect = async (suggestion: any) => {
    // Handle both new API format and legacy format
    const placeId =
      suggestion.placePrediction?.placeId ||
      suggestion.place_id ||
      suggestion.id ||
      ''

    // Use displayText if available (set during fetchSuggestions for consistency)
    // Otherwise fall back to the same logic used in the dropdown
    const displayText =
      suggestion.displayText ||
      suggestion.placePrediction?.text?.text ||
      suggestion.description ||
      suggestion.mainText ||
      ''

    // If this is one of our hardcoded fallback suggestions, short‑circuit:
    if (suggestion.structuredAddress) {
      const structuredAddress: StructuredAddress = suggestion.structuredAddress
      // Use the display text that was shown in suggestions for consistency
      const textToShow = suggestion.mainText || structuredAddress.addressFull
      // Override addressFull to match what was shown in suggestions
      structuredAddress.addressFull = textToShow
      setAutocompleteValue(textToShow)
      clearSuggestions()
      onAddressSelect?.(structuredAddress)
      onChange?.(textToShow)
      return
    }

    // Set the display text immediately for consistency (what user saw in dropdown)
    setAutocompleteValue(displayText)
    clearSuggestions()

    if (!placeId) return

    // Fetch place details using our API route (prioritized to hide API key and handle referrer)
    try {
      // Always use our API route first to ensure API key is hidden and referrer is set correctly
      const response = await fetch(
        `/api/places/details?placeId=${encodeURIComponent(placeId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const place = await response.json()
        const structuredAddress = convertNewPlaceToStructured(place, placeId)
        if (structuredAddress) {
          // Override addressFull with the displayText that was shown in suggestions
          // This ensures consistency with what the user saw in the dropdown
          structuredAddress.addressFull =
            displayText || structuredAddress.addressFull
          onAddressSelect?.(structuredAddress)
          onChange?.(displayText || structuredAddress.addressFull)
          // Clear session token after place selection (session complete)
          sessionTokenRef.current = null
        }
      } else {
        // If API route fails, fall back to client-side Place API (only if available)
        // This is a fallback for cases where API route might not be accessible
        if (
          isLoaded &&
          window.google?.maps?.places &&
          'Place' in window.google.maps.places
        ) {
          console.warn(
            'API route failed, falling back to client-side Place API'
          )
          const Place = (window.google.maps.places as any).Place
          const place = new Place({ id: placeId })
          await place.fetchFields({
            fields: [
              'formattedAddress',
              'addressComponents',
              'location',
              'displayName',
            ],
          })

          const structuredAddress = convertNewPlaceToStructured(place, placeId)
          if (structuredAddress) {
            // Override addressFull with the displayText that was shown in suggestions
            // This ensures consistency with what the user saw in the dropdown
            structuredAddress.addressFull =
              displayText || structuredAddress.addressFull
            onAddressSelect?.(structuredAddress)
            onChange?.(displayText || structuredAddress.addressFull)
          }
        } else {
          // If both fail, log the error
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch place details:', {
            status: response.status,
            error: errorData,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error)

      // Last resort: try client-side API if available
      if (
        isLoaded &&
        window.google?.maps?.places &&
        'Place' in window.google.maps.places
      ) {
        try {
          console.warn(
            'Exception occurred, trying client-side Place API as fallback'
          )
          const Place = (window.google.maps.places as any).Place
          const place = new Place({ id: placeId })
          await place.fetchFields({
            fields: [
              'formattedAddress',
              'addressComponents',
              'location',
              'displayName',
            ],
          })

          const structuredAddress = convertNewPlaceToStructured(place, placeId)
          if (structuredAddress) {
            // Override addressFull with the displayText that was shown in suggestions
            // This ensures consistency with what the user saw in the dropdown
            structuredAddress.addressFull =
              displayText || structuredAddress.addressFull
            onAddressSelect?.(structuredAddress)
            onChange?.(displayText || structuredAddress.addressFull)
          }
        } catch (fallbackError) {
          console.error('Client-side fallback also failed:', fallbackError)
        }
      }
    }
  }

  // Helper function to convert new Places API format to structured address
  const convertNewPlaceToStructured = (
    place: any,
    placeIdOverride?: string
  ): StructuredAddress | null => {
    try {
      const formattedAddress =
        place.formattedAddress || place.formatted_address || ''
      const addressComponents =
        place.addressComponents || place.address_components || []
      const location = place.location || place.geometry?.location

      if (!addressComponents.length || !location) {
        return null
      }

      // Helper to get component by type
      const getComponent = (type: string, shortName = false) => {
        const component = addressComponents.find(
          (comp: any) =>
            comp.types?.includes(type) || comp.types?.includes(`types.${type}`)
        )
        if (!component) return ''
        return shortName
          ? component.shortText || component.short_name || ''
          : component.longText || component.long_name || ''
      }

      const streetNumber = getComponent('street_number')
      const route = getComponent('route')
      const subpremise = getComponent('subpremise')
      const city =
        getComponent('locality') || getComponent('administrative_area_level_3')
      const state = getComponent('administrative_area_level_1', true)
      const postalCode = getComponent('postal_code')
      const country = getComponent('country', true)

      const addressLine1 = [streetNumber, route]
        .filter(Boolean)
        .join(' ')
        .trim()
      const lat =
        location.latitude ||
        (typeof location.lat === 'function' ? location.lat() : location.lat) ||
        0
      const lng =
        location.longitude ||
        (typeof location.lng === 'function' ? location.lng() : location.lng) ||
        0

      const placeId = place.id || place.place_id || placeIdOverride || null

      return {
        addressFull: formattedAddress,
        addressLine1: addressLine1 || formattedAddress,
        addressLine2: subpremise || null,
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
        country: country || '',
        lat: lat,
        lng: lng,
        placeId,
      }
    } catch (error) {
      console.error('Error converting place:', error)
      return null
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay to allow click on suggestion to register
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        clearSuggestions()
      }
    }, 200)
    onBlur?.(e)
  }

  const getErrorMessage = (): string | null => {
    if (!errors || !name) return null
    const fieldError = errors[name]

    if (!fieldError) return null

    if (typeof fieldError === 'string') {
      return fieldError
    }

    // Handle nested error object (e.g., StructuredAddress)
    if (
      typeof fieldError === 'object' &&
      fieldError !== null &&
      'addressFull' in fieldError &&
      typeof (fieldError as any).addressFull === 'string'
    ) {
      return (fieldError as any).addressFull
    }

    return null
  }

  const errorMessage = getErrorMessage()

  if (!isLoaded) {
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <Input
          ref={inputRef}
          name={name}
          value={value || ''}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />
        {errorMessage && touched?.[name] && (
          <Typography.Text className="error-label">
            {errorMessage}
          </Typography.Text>
        )}
      </div>
    )
  }

  return (
    <div className="address-autocomplete-wrapper" ref={containerRef}>
      {label && <label htmlFor={name}>{label}</label>}
      <div
        className="address-autocomplete-container"
        style={{ position: 'relative' }}
      >
        <Input
          ref={inputRef}
          name={name}
          value={autocompleteValue}
          placeholder={placeholder}
          disabled={disabled}
          className={`ant-input ant-input-outlined ${className || ''} ${
            autocompleteValue ? 'selected-field' : ''
          }`}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="address-autocomplete-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              maxHeight: '300px',
              overflowY: 'auto',
              marginTop: '4px',
            }}
          >
            {isLoading && (
              <div
                style={{ padding: '12px', textAlign: 'center', color: '#999' }}
              >
                Loading...
              </div>
            )}
            {!isLoading &&
              suggestions.map((suggestion: any, index: number) => {
                // Handle both new API format and legacy format
                const placeId =
                  suggestion.placePrediction?.placeId ||
                  suggestion.place_id ||
                  suggestion.id ||
                  `suggestion-${index}`
                // Use displayText if available (for consistency), otherwise compute it
                const mainText =
                  suggestion.displayText ||
                  suggestion.placePrediction?.text?.text ||
                  suggestion.structured_formatting?.main_text ||
                  suggestion.mainText ||
                  ''
                const secondaryText =
                  suggestion.placePrediction?.structuredText?.secondaryText ||
                  suggestion.structured_formatting?.secondary_text ||
                  suggestion.secondaryText ||
                  ''
                const isSelected = index === selectedIndex

                return (
                  <div
                    key={placeId}
                    onClick={() => handleSelect(suggestion)}
                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                    onMouseEnter={() => setSelectedIndex(index)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: isSelected ? '#f5f5f5' : 'white',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{mainText}</div>
                    {secondaryText && (
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {secondaryText}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>
      {errorMessage && touched?.[name] && (
        <Typography.Text className="error-label" type="danger">
          {errorMessage}
        </Typography.Text>
      )}
    </div>
  )
}

export default AddressAutocomplete
