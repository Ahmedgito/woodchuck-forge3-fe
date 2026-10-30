export interface MapApiResponse {
  data: MapData
  status: 'success' | 'error'
}
export interface MapData {
  wasteStreams: WasteStreamSummary[]
  locations: Location[]
  jobSites: JobSite[]
  totalTonnage: number
  totalDistance: number
  totalCo2Avoided: number
}
export interface WasteStreamSummary {
  name: string
}
export interface Address {
  addressFull: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  lat: number
  lng: number
  placeId?: string
}
export interface Location {
  id: number
  name: string
  entryType?: string
  address: Address
}
export interface JobSite {
  id: number
  title: string
  clientImageUrl?: string | null
  address: Address
  verificationImages?: JobSiteVerificationImage[]
  wasteStreams: JobSiteWasteStream[]
}
export interface JobSiteVerificationImage {
  id: string
  fileId: string
  imageUrl: string | null
  uploadedAt: string
  wasteStreamId: number
  jobsiteWasteStreamId: number
}
export interface JobSiteWasteStream {
  id: number
  name: string
  tons: number
  moved: number
  dumpster_type: string
  dumpster_key: string
  dumpster_weight: string
  processingLocation: ProcessingLocation
  colorCode: string
  endLocations: unknown[] // empty in current API
}
export interface ProcessingLocation {
  id: number
  name: string
  type: number
  distance: number | null
  locationId: number
  powerplantId: number | null
  tons: number
  address: Address
}
