import { ApiClient } from '.'
import { ROUTES } from '../utils/constants/app-constants'
import {
  CAMERA_TYPE,
  CreateUser,
  DUMPSTER_CREATE,
  DUMPSTER_UPDATE,
  dumpsterBulkCreatePayload,
  dumpsterBulkDeletePayload,
  FilteredReportPayload,
  GLOBAL_DATA_TYPE,
  HAULER_TYPE,
  JOB_SITE_CAMERA_TYPE,
  LOCATION_TYPE,
  MapStatsPayload,
  POWER_PLANT_TYPE,
  SubscribeToReportsPayload,
  VesselFormValues,
  WoodWastePayload,
} from '../utils/constants/types'

type TREE_STATS_API = {
  effectiveStartDate: string | Date
  effectiveEndDate: string
  jobSiteId?: number | null
  clientId?: number | null
}
export const getGlobalData = (id: number | null | undefined) => {
  return ApiClient.get(ROUTES.GLOBAL_DATA + '/' + id)
}

export const updateGlobalData = (
  id: number | null | undefined,
  payload: GLOBAL_DATA_TYPE
) => {
  return ApiClient.patch(ROUTES.GLOBAL_DATA + '/' + id, payload)
}

export const getHauler = (id: string | null) => {
  return ApiClient.get(ROUTES.HAULERS + `/${id}`)
}

export const updateHauler = (id: string | null, payload: HAULER_TYPE) => {
  return ApiClient.patch(ROUTES.HAULERS + `/${id}`, payload)
}

export const createHauler = (payload: any) => {
  return ApiClient.post(ROUTES.HAULERS, payload)
}

export const getClient = (id: number | null) => {
  return ApiClient.get(ROUTES.USERS + `/${id}`)
}

export const updateClient = (id: number | null | undefined, payload: any) => {
  return ApiClient.patchMultipart(ROUTES.USERS + `/${id}`, payload)
}

export const updateClientPictureByClient = (
  id: number | null | undefined,
  payload: { photo: string }
) => {
  return ApiClient.patch(ROUTES.AUTH + `/me`, payload)
}

export const updateClientPictureByAdmin = (
  id: number | null | undefined,
  payload: { photo: string }
) => {
  return ApiClient.patch(ROUTES.USERS + `/${id}`, payload)
}

export const createClient = (payload: any) => {
  return ApiClient.postMultipart(ROUTES.USERS, payload)
}

export const getClients = (pagination?: number, searchTerm?: string | null) => {
  const limit = 50
  const page = pagination ?? 1
  const filters = `{"roles":[{"id":2}]${searchTerm ? `,"search":"${searchTerm}"` : ''}}`
  const sort = `[{"orderBy":"updatedAt","order":"desc"}]`
  const query = `?limit=${limit}&page=${page}&filters=${encodeURIComponent(filters)}&sort=${encodeURIComponent(sort)}`

  return ApiClient.get(ROUTES.USERS + query)
}

export const getEndClientJobsiteOwners = (
  pagination?: number,
  searchTerm?: string | null
) => {
  const limit = 50
  const page = pagination ?? 1
  const filters = `{"roles":[{"id":4}]${searchTerm ? `,"search":"${searchTerm}"` : ''}}`
  const sort = `[{"orderBy":"updatedAt","order":"desc"}]`
  const query = `?limit=${limit}&page=${page}&filters=${encodeURIComponent(filters)}&sort=${encodeURIComponent(sort)}`

  return ApiClient.get(ROUTES.HOME + '/get-endclient-jobsite-owners' + query)
}

export const getEndClients = (
  pagination?: number,
  searchTerm?: string | null
) => {
  if (pagination)
    return ApiClient.get(
      ROUTES.USERS +
        `?page=${pagination}&filters={"roles":[{"id":4}]${searchTerm ? `,"search":"${searchTerm}"` : ''}}&sort=[{"orderBy":"updatedAt","order":"desc"}]`
    )
  else {
    return ApiClient.get(
      ROUTES.USERS +
        '?limit=50&page=1&filters={"roles":[{"id":4}]}&sort=[{"orderBy":"updatedAt","order":"desc"}]'
    )
  }
}

export const getManufacturers = (
  pagination?: number,
  searchTerm?: string | null
) => {
  const limit = 50
  const page = pagination ?? 1
  const filters = `{"roles":[{"id":5}]${searchTerm ? `,"search":"${searchTerm}"` : ''}}`
  const sort = `[{"orderBy":"updatedAt","order":"desc"}]`
  const query = `?limit=${limit}&page=${page}&filters=${encodeURIComponent(filters)}&sort=${encodeURIComponent(sort)}`

  return ApiClient.get(ROUTES.USERS + query)
}

export const getOfftakes = (
  pagination?: number,
  searchTerm?: string | null
) => {
  if (pagination)
    return ApiClient.get(
      ROUTES.USERS +
        `?page=${pagination}&filters={"roles":[{"id":7}]${searchTerm ? `,"search":"${searchTerm}"` : ''}}&sort=[{"orderBy":"updatedAt","order":"desc"}]`
    )
  else {
    return ApiClient.get(
      ROUTES.USERS +
        '?limit=50&page=1&filters={"roles":[{"id":7}]}&sort=[{"orderBy":"updatedAt","order":"desc"}]'
    )
  }
}

export const getHaulers = () => {
  return ApiClient.get(
    ROUTES.HAULERS + '?sort=[{"orderBy":"updatedAt","order":"desc"}]'
  )
}

//wasteStreams
export const getWasteStreams = (id?: number | null) => {
  if (id) {
    return ApiClient.get(ROUTES.WASTE_STREAM + `/${id}`)
  }
  return ApiClient.get(ROUTES.WASTE_STREAM)
}
export const updateWasteStreams = (
  id: number | null | undefined,
  payload: WoodWastePayload
) => {
  return ApiClient.patch(ROUTES.WASTE_STREAM + `/${id}`, payload)
}

//powerPlants
export const getPowerPlants = (id?: number | null) => {
  if (id) {
    return ApiClient.get(ROUTES.POWER_PLANTS + `/${id}`)
  }
  return ApiClient.get(ROUTES.POWER_PLANTS)
}
export const updatePowerPlant = (
  id: string | null,
  payload: POWER_PLANT_TYPE
) => {
  return ApiClient.patch(ROUTES.POWER_PLANTS + `/${id}`, payload)
}

export const createPowerPlant = (payload: any) => {
  return ApiClient.post(ROUTES.POWER_PLANTS, payload)
}

// emission factors
export const getEmissionFactors = (id?: number | null) => {
  if (id) {
    return ApiClient.get(ROUTES.EMISSION_FACTORS + `/${id}`)
  }
  return ApiClient.get(ROUTES.EMISSION_FACTORS)
}

export const getEmissionFactorByKey = (key: string) => {
  return ApiClient.get(ROUTES.EMISSION_FACTORS + `/key/${key}`)
}

export const updateEmissionFactor = (
  id: number,
  payload: any
) => {
  return ApiClient.patch(ROUTES.EMISSION_FACTORS + `/${id}`, payload)
}

export const createEmissionFactor = (payload: any) => {
  return ApiClient.post(ROUTES.EMISSION_FACTORS, payload)
}

// location
export const getLocations = (id?: number | null) => {
  if (id) {
    return ApiClient.get(ROUTES.LOCATIONS + `/${id}`)
  }
  return ApiClient.get(ROUTES.LOCATIONS)
}
export const updateLocation = (id: string | null, payload: LOCATION_TYPE) => {
  return ApiClient.patch(ROUTES.LOCATIONS + `/${id}`, payload)
}

export const createLocation = (payload: any) => {
  return ApiClient.post(ROUTES.LOCATIONS, payload)
}

export const getLocationTypes = () => {
  return ApiClient.get(ROUTES.LOCATIONS + '/location-types')
}

export const getCombinedLocations = () => {
  return ApiClient.get(ROUTES.LOCATIONS + '/get-combined-list')
}

//job-Site WasteStreams
export const getdumpsterOptions = () => {
  return ApiClient.get(ROUTES.JOBSITES_WASTESTREAMS + '/vessel-options-type')
}
export const getdumpsterLocations = (id: number | undefined | null) => {
  return ApiClient.get(ROUTES.JOBSITES + `/${id}` + '/getDumpster')
}
export const getWasteStreamById = (id: number | undefined | null) => {
  return ApiClient.get(
    ROUTES.JOBSITES_WASTESTREAMS + '/findByJobSiteId' + `/${id}`
  )
}
export const createWasteStreamJobistes = (payload: any) => {
  return ApiClient.post(ROUTES.JOBSITES_WASTESTREAMS, payload)
}
export const updateWasteStreamJobistes = (id: number, payload: any) => {
  return ApiClient.put(ROUTES.JOBSITES_WASTESTREAMS + `/${id}`, payload)
}
export const deleteWasteStreamJobistes = (id: number | undefined | null) => {
  return ApiClient.delete(ROUTES.JOBSITES_WASTESTREAMS + `/${id}`)
}

//job-site-live-dumpster-camera
export const getCamerasByJobId = (id: number | null | undefined) => {
  if (id) {
    return ApiClient.get(
      ROUTES.JOB_SITE_CAMERAS + '/findByJobSiteId' + `/${id}`
    )
  }
}
export const createJobSiteCameras = (payload: JOB_SITE_CAMERA_TYPE) => {
  return ApiClient.post(ROUTES.JOB_SITE_CAMERAS, payload)
}
export const updateJobSiteCameras = (
  id: number | null | undefined,
  payload: JOB_SITE_CAMERA_TYPE
) => {
  return ApiClient.patch(ROUTES.JOB_SITE_CAMERAS + `/${id}`, payload)
}
export const getJobSiteCamerasById = (id: number | null | undefined) => {
  return ApiClient.get(ROUTES.JOB_SITE_CAMERAS + `/${id}`)
}
export const deleteJobSiteCamera = (id: number | null | undefined) => {
  return ApiClient.delete(ROUTES.JOB_SITE_CAMERAS + `/${id}`)
}

//cameras
export const getCameras = (id?: number | null) => {
  if (id) {
    return ApiClient.get(ROUTES.CAMERAS + `/${id}`)
  }
  return ApiClient.get(ROUTES.CAMERAS)
}

export const createCameras = (payload: CAMERA_TYPE) => {
  return ApiClient.post(ROUTES.CAMERAS, payload)
}

export const updateCameras = (id: string | null, payload: CAMERA_TYPE) => {
  return ApiClient.patch(ROUTES.CAMERAS + `/${id}`, payload)
}

export const deleteCameras = (id: number | undefined | null) => {
  if (id) {
    return ApiClient.delete(ROUTES.CAMERAS + `/${id}`)
  }
}
export const getAlertOptions = (jobSiteId: number | undefined | null) => {
  return ApiClient.get(
    ROUTES.JOB_SITE_CAMERAS + `/${jobSiteId}` + '/alert-options'
  )
}

export const getUnassociatedCameras = () => {
  return ApiClient.get(ROUTES.CAMERAS + `/unassociated`)
}

//camera-live-view
export const getCameraLiveView = (
  id: number | undefined,
  refresh: boolean | undefined
) => {
  const params = refresh !== undefined ? `?refresh=${refresh}` : ''
  if (id) {
    return ApiClient.get(ROUTES.CAMERA_LIVE_VIEW + `/camera/${id}${params}`)
  }
}

//wood Waste Diversion
export const getTreeGraphStats = ({
  effectiveStartDate,
  effectiveEndDate,
  jobSiteId,
  clientId,
}: TREE_STATS_API) => {
  const homeUrl = `${ROUTES.TREE_STATS}stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`
  const jobSiteUrl = `${ROUTES.JOBSITES_WASTESTREAMS}/tree-graph-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}&jobSiteId=${jobSiteId}&clientId=${clientId}`
  if (jobSiteId) {
    return ApiClient.get(jobSiteUrl)
  }
  return ApiClient.get(homeUrl)
}

export const getDiversionStats = ({
  effectiveStartDate,
  effectiveEndDate,
  jobSiteId,
  clientId,
}: TREE_STATS_API) => {
  const jobSiteUrl = `${ROUTES.JOBSITES_WASTESTREAMS}/tree-graph-diversion-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}&jobSiteId=${jobSiteId}&clientId=${clientId}`
  const baseUrl = `${ROUTES.TREE_STATS}diversion-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`
  if (jobSiteId) {
    return ApiClient.get(jobSiteUrl)
  }
  return ApiClient.get(baseUrl)
}
export const getTypeStats = ({
  effectiveStartDate,
  effectiveEndDate,
  jobSiteId,
  clientId,
}: TREE_STATS_API) => {
  const jobSiteUrl = `${ROUTES.JOBSITES_WASTESTREAMS}/tree-graph-waste-streams-type-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}&jobSiteId=${jobSiteId}&clientId=${clientId}`
  const baseUrl = `${ROUTES.TREE_STATS}waste-streams-type-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`
  if (jobSiteId) {
    return ApiClient.get(jobSiteUrl)
  }
  return ApiClient.get(baseUrl)
}
export const getWoodWasteStats = ({
  effectiveStartDate,
  effectiveEndDate,
  jobSiteId,
  clientId,
}: TREE_STATS_API) => {
  const jobSiteUrl = `${ROUTES.JOBSITES_WASTESTREAMS}/tree-graph-wood-waste-diversion-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}&jobSiteId=${jobSiteId}&clientId=${clientId}`
  const baseUrl = `${ROUTES.TREE_STATS}wood-waste-diversion-stats?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`
  if (jobSiteId) {
    return ApiClient.get(jobSiteUrl)
  }
  return ApiClient.get(baseUrl)
}

//dumpster Chart
export const getDumpsterStats = (
  id: number | undefined | null,
  startDate: string | Date,
  endDate: string
) => {
  return ApiClient.get(
    `${ROUTES.JOBSITES_WASTESTREAMS}/bar-graph?startDate=${startDate}&endDate=${endDate}&jobSiteId=${id}`
  )
}
export const deleteDumpster = (id: number | undefined | null) => {
  return ApiClient.delete(`${ROUTES.WASTE_STREAMS_DUMPSTERS}/${id}`)
}
export const updateWasteStreamDumster = (
  id: number | null,
  payload: DUMPSTER_UPDATE
) => {
  return ApiClient.patch(ROUTES.WASTE_STREAMS_DUMPSTERS + '/' + id, payload)
}
export const createWasteStreamDumpster = (payload: DUMPSTER_CREATE) => {
  return ApiClient.post(ROUTES.WASTE_STREAMS_DUMPSTERS, payload)
}
//client users endpoints
export const getClientSubUsers = () => {
  return ApiClient.get(ROUTES.CLIENT_SUB_USERS_LISTING)
}
export const getClientUserById = (id: number) => {
  return ApiClient.get(ROUTES.USERS + `/${id}`)
}
export const createClientUsers = (payload: CreateUser) => {
  return ApiClient.post(ROUTES.CLIENT_SUB_USER_CREATE, payload)
}
export const updateClientUsers = (id: number, payload: CreateUser) => {
  return ApiClient.patch(ROUTES.CLIENT_SUB_USER_UPDATE + `/${id}`, payload)
}

export const updateSubUser = (
  id: number,
  payload: { username: string; phone: string }
) => {
  return ApiClient.patch(ROUTES.CLIENT_SUB_USER_DELETE + `/${id}`, payload)
}
export const deleteClientUsers = (id: number) => {
  return ApiClient.delete(ROUTES.CLIENT_SUB_USER_DELETE + `/${id}`)
}
//vessel endpoints
export const saveVessel = (payload: VesselFormValues) => {
  return ApiClient.post(ROUTES.SAVE_VESSEL, payload)
}
export const getVessels = () => {
  return ApiClient.get(ROUTES.GET_VESSEL)
}

//report subscriptions
export const getReportSubscriptions = () => {
  return ApiClient.get(ROUTES.REPORT_SUBSCRIPTIONS)
}

export const unsubscribeFromReports = (
  reportType: 'dashboard' | 'job_site',
  jobSiteId?: number
) => {
  const payload =
    reportType === 'job_site' ? { reportType, jobSiteId } : { reportType }

  return ApiClient.post(ROUTES.REPORT_SUBSCRIPTIONS_UNSUBSCRIBE, payload)
}

export const subscribeToReports = (payload: SubscribeToReportsPayload) => {
  return ApiClient.post(ROUTES.REPORT_SUBSCRIPTIONS_SUBSCRIBE, payload)
}

export const sendJobsiteArchiveReport = (
  months: string[],
  formats: string[],
  jobSiteId: number
) => {
  const payload = {
    months,
    jobSiteId,
    formats,
  }
  return ApiClient.post(ROUTES.SEND_JOBSITE_ARCHIVE_REPORT, payload)
}

export const sendDashboardArchiveReport = (
  months: string[],
  formats: string[]
) => {
  const payload = {
    months,
    formats,
  }
  return ApiClient.post(ROUTES.SEND_DASHBOARD_ARCHIVE_REPORT, payload)
}

export const startImpersonation = (targetUserId: number) => {
  return ApiClient.post(ROUTES.IMPERSONATION, { targetUserId })
}

export const stopImpersonation = () => {
  return ApiClient.post(ROUTES.IMPERSONATION_REVERT)
}

export const exportUser = (email: string, password: string) => {
  const payload = {
    email,
    password,
  }
  return ApiClient.post(ROUTES.EXPORT_USER, payload)
}
export const exportArchiveReport = (payload: FilteredReportPayload) => {
  const { jobSiteId } = payload
  const url = jobSiteId
    ? ROUTES.JOBSITES + ROUTES.EXPORT_ARCHIEVE_REPORT
    : ROUTES.HOME + ROUTES.EXPORT_ARCHIEVE_REPORT
  return ApiClient.post(url, payload)
}
export const exportArchiveReportStatus = (jobId: number) => {
  return ApiClient.get(
    `${ROUTES.EXPORT_ARCHIEVE_REPORT_STATUS}/${jobId}/status`
  )
}
export const exportArchiveReportDownload = async (jobId: number) => {
  return ApiClient.get(
    `${ROUTES.EXPORT_ARCHIEVE_REPORT_STATUS}/${jobId}/download`,
    {
      responseType: 'arraybuffer',
      transformResponse: [(data: ArrayBuffer) => data],
      headers: {
        Accept: 'application/zip',
      },
    }
  )
}

export const getApiKey = () => {
  return ApiClient.get(ROUTES.API_KEY)
}

export const regenerateApiKey = () => {
  return ApiClient.post(ROUTES.REFRESH_API_KEY)
}

export const wasteStreamDumpstersBulkCreate = (
  payload: dumpsterBulkCreatePayload
) => {
  return ApiClient.post(ROUTES.WASTE_STREAMS_DUMPSTERS_BULK_CREATE, payload)
}

export const wasteStreamDumpstersBulkDelete = (
  payload: dumpsterBulkDeletePayload
) => {
  return ApiClient.delete(ROUTES.WASTE_STREAMS_DUMPSTERS_BULK_DELETE, payload)
}

export const getGenieContent = () => {
  return ApiClient.get(ROUTES.GENIE)
}

export const getMapData = (params: {
  startDate?: string | Date
  endDate?: string | Date
  wasteType?: string
  materialDestination?: string
  destinationType?: string | null
  includeVerificationImages?: boolean
}) => {
  // Remove undefined/null values from payload
  const payload = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
  );
  return ApiClient.post(ROUTES.MAP_DATA, payload);
}
export const getMapStats = (
  payload: MapStatsPayload
) => {
  return ApiClient.post(ROUTES.MAP_STATS, payload)
}
export const getCmsUsers = () => {
  return ApiClient.get(ROUTES.CMS_USERS)
}

// Carbon Credits
export const getCarbonCreditByJobSite = (jobSiteId: number) => {
  return ApiClient.get(ROUTES.CARBON_CREDITS + `/jobsite/${jobSiteId}`)
}

export const getCarbonCreditByClient = (clientId: number) => {
  return ApiClient.get(ROUTES.CARBON_CREDITS + `/client/${clientId}`)
}

export const getCarbonCreditAdminAggregation = () => {
  return ApiClient.get(ROUTES.CARBON_CREDITS + `/admin/aggregation`)
}

export const getCarbonCreditClientBreakdown = () => {
  return ApiClient.get(ROUTES.CARBON_CREDITS + `/admin/client-breakdown`)
}