export interface StructuredAddress {
  addressFull: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  lat: number
  lng: number
  placeId?: string | null
}

export type USER_TYPE = {
  id: number
  username: string
  email: string
  name: string
  company: string
  phone: string
  billing_details_name: string
  billing_details_street: string
  billing_details_city: string
  billing_details_state: string
  billing_details_zipcode: string
  billing_details_country: string
  photo?: string
  role?: {
    enum: string
  }
}

export type HAULER_TYPE = {
  id?: number
  name: string
  phone: string
  email: string
  // dumpsterSize: string[]
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export type GLOBAL_DATA_TYPE = {
  distanceMmrMacomb?: number
  distanceMmrLivonia?: number
  tonage10yrd?: number
  tonage20yrd?: number
  tonage30yrd?: number
  tonage40yrd?: number
  supervisorOnboarding?: string
  autoResponse?: string
}

export type CARBON_CREDIT_TYPE = {
  id: number
  co2Value: number
  carbonCreditDollars: number
  status: 'estimated' | 'confirmed'
  updatedAt: string
}

export type CARBON_CREDIT_AGGREGATION = {
  totalCo2Value: number
  totalCarbonCreditDollars: number
}

export type JOB_SITE_TYPE = {
  id: number
  city: string
  state: string
  street: string
  zipcode: string
  woodWasteDiverted: string
  status: {
    id: number
    name: string
  }
  name: string
  phone: string
  email: string
  diverted: string
  refused: string
  co2Avoided: string
  totalHailed: string
  // totalTonnage: string
  dumpsters: [DUMPSTER_LOCATION_TYPE]
  // haulerId: number
  // mmrLocation: number
  biomassForCleanEnergy: number
  sizeSqft: number
  completedAt: Date
  closedAt?: string
  title: string
  clientName: string
  cardBoard: number
  plastic: number
  concrete: number
  wasteHauling: number
  metal: number
  address: any
  carbonCredit?: CARBON_CREDIT_TYPE | null
}

export type DUMPSTER_LOCATION_TYPE = {
  id: number
  sublocationName: string
  distanceToMmr: number
}

export type CREATE_JOB_SITE = {
  id?: number | undefined | null
  clientId?: number | null
  clientName?: string | null | undefined
  photo?: string
  address: StructuredAddress | null
  sustainabilityGoal: number | null
  name: string | null | undefined
  phone: string
  email: string
  title: string
  size: number | null
  completionBy: Date
  powerplants: string
  updatedAt?: string
  createdAt?: string
  startDate: Date
  powerplantsName?: string
  status?: {
    name: string
  }
  endClientId?: number
  endClientName?: string
  closedAt?: string
  carbonCredit?: CARBON_CREDIT_TYPE | null
}

export type SMS_DUMPSTER = {
  id: number
  status: string
  dstype: string
  dsSize: string
  smsDumpsterId: number
  jobSiteName: string
}

export type NOTIFICATION_TYPE = {
  id: number
  title: string
  message: string
  smsDumpster: SMS_DUMPSTER
  data: {
    jobSiteId: number
    status: string
    dstype: string
    dsSize: string
    smsDumpsterId: number
    jobSiteName: string
    sublocationName: string
  }
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: null
}

export type JOB_SITE = {
  id: number | null | undefined
  title: string | null | undefined
  city: string | null | undefined
  state: string | null | undefined
  clientName: string | null | undefined
  createdAt: string | undefined
  startDate: string | undefined
}
export type WASTE_TYPE = {
  id: number
  name: string
  tonPerOffRoleYard: number
  tonPerFrontLoadYard: number
  tonPerCompactorYard: number
  colorCodeEst: string
  colorCodeReal: string
  wasteStreamTypes: WasteStreamListType[]
}
export interface Vessel {
  id: number
  name: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

export interface WasteStreamTypeVessel {
  id: number
  wasteStreamTypeId: number
  vesselId: number
  tons: number
  createdAt: string // ISO string
  updatedAt: string // ISO string
  vessel: Vessel
}

export interface WasteStreamListType {
  id: number
  name: string
  colorCodeEst: string
  colorCodeReal: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
  deletedAt: string | null
  wasteStreamId: number
  vessels: WasteStreamTypeVessel[]
  wasteStreamTypes: WASTE_TYPE[]
  vesselIds?: number[]
}
export type POWER_PLANT_TYPE = {
  id: number
  name: string
  typeLabel?: string | undefined | null
  btuPerTon: number | undefined
  kwhPerTon: number | undefined
  address?: StructuredAddress | null
}
export type EMISSION_FACTOR_TYPE = {
  id?: number
  name: string
  key: string
  value: string
}
export type CAMERA_TYPE = {
  id?: number
  cameraId: string
  ipAddress: string
  name: string
  url: string
  isAdmin?: boolean
}

export type CAMERA_DROPDOWN_TYPE = {
  id: number | undefined
  cameraId: string
}
export type DUMPSTER_ALERT_TYPE = {
  alertTo: number
  name: string
  alertToType: number
}
export type LIVE_DUMPSTER_TYPE = {
  id: number
  name: string
  maxLevel: number
  alertTo: number
  alertToType: number
  jobSite: Record<string, any>
  camera: Record<string, any>
  jobSiteId: number
  cameraId: number
}
export type JOB_SITE_CAMERA_TYPE = {
  name: string
  maxLevel: number
  alertTo: number | null
  alertToType: number | null
  jobSiteId: number
  cameraId: number
  alert?: string
}

export type DROP_DOWN_OPTIONS = {
  label: string | number | undefined
  value: string | number | undefined
}[]
export type DUMPSTER_OPTIONS = {
  dumpsterKey: string | number
  dumpsterType: string | number | undefined
  dumpsterWeight: string | number | undefined
  key: string | number | undefined
  label: string | number | undefined
  disabled: boolean
  vesselId: number
  vesselOptionId: number
}[]
export type DUMPSTER_TRANSFORMED_OPTIONS = {
  label: JSX.Element
  title: string | number | undefined
  options: {
    label: JSX.Element
    value: string | number | undefined | any
    entityType?: number | undefined
    displayValue?: string
  }[]
}

export type LOCATION_TYPE = {
  id: number
  name: string
  type: number
  inMiles: number
  to: number
  toType: number
  relatedPowerPlant?: POWER_PLANT_TYPE
  relatedLocation?: LOCATION_TYPE
  typeLabel: string
  entityType: number
}

export type COMBINED_LOCATION_TYPE = {
  id: number
  name: string
  type: number
  toType: number
  typeLabel: string
  entityType: number
}

export type LOCATION_TYPE_DROPDOWN = {
  id: number
  label: string
  value?: string
}

export type DUMPSTER_LOCATION_OPTIONS = {
  label: string | number | undefined
  value: string | number | undefined
  isDefault: boolean
}[]
export type WASTE_STREAM_JOB_SITE_FORM_TYPE = {
  wasteStreamName?: string | number
  id: number
  jobSiteId?: number | undefined | null
  wastestreamsId: number | undefined
  dumpster_type: string | undefined
  locationId: number | undefined | null
  dumpsterId: number | undefined
  powerplantId: number | undefined | null
  distance: number | undefined
  haulerId: number | undefined
  firstEntry?: boolean
  dumpsterName?: string | undefined
  locationName?: string | undefined
  haulerName?: string | undefined
  entityType?: number
  co2?: number | undefined
  wasteStreamCameras?: {
    maxLevel: number
    confidenceLevel: number
    camera: {
      cameraId: string
      name: string
    }
    additionalCamera: {
      cameraId: string
      name: string
    }
  }
}

export type GET_WASTE_STREAM_JOB_SITE_FORM_TYPE = {
  id: number
  jobSiteId?: number | undefined | null
  wastestreamsId: number | undefined
  wasteStreamName: string
  wasteStreamTypeId: number | undefined
  wasteStreamType: string | undefined
  vessel: string | undefined
  vesselId: number | undefined
  vesselOptionId: number | undefined
  dumpsterId: number | undefined
  dumpsterName: string | undefined
  haulerId: number | undefined
  haulerName: string | undefined
  locationId: number | undefined
  locationName: string | undefined
  distance: number | undefined
  powerplantId: number | undefined
  wasteStreamCameras: {
    cameraId: number
    additionalCameraId: number
    maxLevel: number
    confidenceLevel: number
    alertTo: number
    alertToType: number
    alertToName: string
    camera: {
      id: number
      cameraId: string
      name: string
    }
    additionalCamera: {
      id: number
      cameraId: string
      name: string
    }
  }
  order: number
  isEndPoint: boolean
  endPointDistance: number | undefined
  endPointHauler: string | undefined
  endPointLocation: string | undefined
  endPointLocationId: number | undefined
  endPointPowerplantId: number | undefined
  endPointHaulerId: number | undefined
  co2: number | undefined
  recycling_rebate: number | undefined
  reports_enabled: boolean
}

export type DUMPSTERDROPDOWNOPTIONS = {
  id: number
  sublocationName: string
  distanceToMmr: string
  unit: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  __entity: string
  isDefault: boolean
}
export type UPDATE_CREATE_WASTESTREAM_TYPE = {
  id: number
  dumpsterId: number
  dumpsterName: string
  haulerId: number
  haulerName: string
  wastestreamsId: number
  wasteStreamName: string
  locationId: number
  locationName: string
  dumpster_type: string
  distance: number
  jobSiteId: number
  firstEntry?: boolean
}
export type WASTE_STATS = {
  wood_waste: number
  landfill: number
  clean_energy: number
  remanufacturing: number
  industrial_product: number
  biomass_clean_energy: number
  total_diverted: number
  total_co2_diverted: number
  client_diversion_goal: number
  chuck_result: number
  diverted: number
  rejected: number
  diverted_percentage: number
  transport_co2: number
  net_co2_avoided: number
  carbon_credit_co2?: number
  carbon_credit_dollars?: number
  card_board: WasteDetail
  waste_hauling: WasteDetail
  metal: WasteDetail
  plastic: WasteDetail
  total_waste_diversion: number
  wood_waste_collected: number
  wood_waste_diverted: number
  total_wood_waste_diversion: number
  carbon_credits: number
  concrete: WasteDetail
}

interface WasteDetail {
  delivered: number
  delivered_to: string
  transport_co2: number
  recycling_rebate?: number
}
interface WasteStream {
  id: number
  name: string
  type: string
  tonPerOffRoleYard: number
  tonPerFrontLoadYard: number
  tonPerCompactorYard: number
  colorCodeEst: string
  colorCodeReal: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  __entity: string
}

interface WasteStreamType {
  id: number
  name: string
  colorCodeEst: string
  colorCodeReal: string
  createdAt: string
  deletedAt: string | null
  tonPerCompactorYard: number
  tonPerFrontLoadYard: number
  tonPerOffRoleYard: number
  updatedAt: string
  __entity: string
}

export interface JobSitesWasteStreamsDumpster {
  id: number
  estimated_weight: number | null
  real_weight: number | null
  creationDate: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  __entity: string
}
export type AiStatus = 'pending' | 'processing' | 'complete' | 'failed'
export type ImageMetadataSource = 'exif' | 'device' | 'none'

export interface WasteStreamImage {
  id: string
  jobsiteWasteStreamId: number
  jobSiteId: number
  wasteStreamId: number
  fileId: string
  uploadedById: number
  uploadedAt: string
  capturedAt: string | null
  latitude: number | null
  longitude: number | null
  metadataSource: ImageMetadataSource | null
  distanceFromJobSiteMeters: number | null
  locationVerified: boolean | null
  aiStatus: AiStatus
  aiConfidenceLevel: number | null
  adminConfidenceOverride: number | null
  aiVerified: boolean | null
  isLatest: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  file: {
    id: string
    path: string | Promise<string>
  }
  uploadedBy: {
    id: number
    firstName: string
    lastName: string
  }
}

export interface JobSitesWasteStreamsEntity {
  id: number
  dumpster_type: string
  distance: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  wasteStream: WasteStream
  wasteStreamType: WasteStreamType
  jobSitesWasteStreamsDumpsters: JobSitesWasteStreamsDumpster[]
  wasteStreamLocations: WASTE_STREAM_LOCATION_TYPE[]
  location: LOCATION_TYPE
  powerplant: POWER_PLANT_TYPE
  jobSite: JOB_SITE_TYPE
  hauler: HAULER_TYPE
  __entity: string
  haulerId: number
  wasteStreamId: number
  dumpsterId: number
  jobSiteId: number
  locationId: number
  powerplantId: number
  tons: number | null
  moved: number
  dumpster_key: string
  dumpster_weight: string
}
export type DUMPSTER_GRAPH_TYPE = {
  jobSitesWasteStreams: JobSitesWasteStreamsEntity[]
  total_moved: number
  total_tons: number | null
  tons_diverted: number | null
  waste_diversion: number | null
}

export type DUMPSTER_UPDATE = {
  real_weight: number | undefined | null
}
export type DUMPSTER_CREATE = {
  no_of_dumpster?: number | undefined | null
  jobSiteWastestreamsId: number | undefined | null
  real_weight: number | undefined | null
  creationDate: string
}

export type GRAPH_CLIENT = {
  id: number
  name: string
  height: number
  [key: string]: any
}

export type GRAPH_WASTE_STREAM = {
  name: string
  dumpster_weight: number
  moved: number
  total_tons: number
  [key: string]: any
}

export type REPORT_IMAGE = {
  monthName: string
  dataUrl: string
}

export type WASTE_STREAM_LOCATION_TYPE = {
  type: number
  locationId: number | null
  powerplantId: number | null
  haulerId: number
  distance: number
  locationName?: string
  location?: LOCATION_TYPE
}

export type REORDER_WASTE_STREAM_TYPE = {
  id: number
  order: number
}

export type CameraInfo = {
  cameraName: string
  captureDatetime: string
  captureCount: number
  s3ImageUrl: string
  folio3FillPercentage: number
  folio3ConfidenceLevel: number
  fillLevel: number
  confidenceLevel: number
  isPolluted: boolean
  isOnline: boolean
  enableRefresh: boolean
}

export interface Accumulator {
  [key: string]: {
    [key: string]: JobSitesWasteStreamsEntity[]
  }
}

export type CreateUser = {
  username: string
  email?: string
  phone: string
}

export interface OptionPayload {
  id?: number
  value: number | null
  disabled?: boolean
}

export interface VesselPayload {
  id?: number
  name: string
  options: OptionPayload[]
}

export interface VesselFormValues {
  vessels: VesselPayload[]
}

export interface WoodWasteVessel {
  vesselId: number
  tons: number
  id?: number
  disabled?: boolean
}

export interface WoodWasteType {
  id?: number
  name: string
  colorCodeEst: string
  colorCodeReal: string
  vessels: WoodWasteVessel[]
}

export interface WoodWastePayload {
  id?: number
  name: string
  colorCodeEst: string
  colorCodeReal: string
  wasteStreamTypes: WoodWasteType[]
}
export type SubType = {
  name: string
  colorCodeEst: string
  colorCodeReal: string
  vessels: any[]
  id?: number
}

export type WasteStreamFormType = {
  name: string
  colorCodeEst: string
  colorCodeReal: string
  wasteStreamTypes: SubType[]
}
export interface VesselOption {
  id: number
  value: number
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  vesselId: number
  __entity: 'VesselOptionsEntity'
  disabled: boolean
}

export interface VesselList {
  id: number
  name: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  options: VesselOption[]
  __entity: 'VesselEntity'
}

export interface JobSiteSubscription {
  jobSiteId?: number
  subscribed: boolean
  monthly: boolean
  weekly: boolean
  formats: string[]
}
export interface SubscribeToReportsPayload {
  frequency: string // e.g., 'monthly' or 'weekly'
  isActive: boolean
  jobSiteId: number
  reportType: string // e.g., 'job_site' or 'dashboard'
  formats?: string[]
}

export interface FilteredReportPayload {
  jobSiteId?: number | null
  startDate: string | Date | undefined
  endDate: string | Date | undefined
  formats: string[]
}
export interface dumpsterBulkCreatePayload {
  dumpsters: DUMPSTER_CREATE[]
}
export interface dumpsterBulkDeletePayload {
  jobSiteWastestreamsId: number | null
  ids: number[]
}
interface MaterialDestination {
  type: string
  id: number
}

export interface MapStatsPayload {
  startDate?: string | Date
  endDate?: string | Date
  wasteType?: string
  materialDestinations: MaterialDestination[]
}

export interface CmsUserType{
  id: number
  name: string
  email: string
}