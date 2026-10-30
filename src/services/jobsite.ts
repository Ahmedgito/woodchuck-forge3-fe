import { ApiClient } from '.'
import { ROUTES } from '../utils/constants/app-constants'
import {
  CREATE_JOB_SITE,
  DUMPSTER_LOCATION_TYPE,
  REORDER_WASTE_STREAM_TYPE,
} from '../utils/constants/types'

interface JOBSITE_PAYLOAD {
  [key: string]: string | number
}

export const getClientJobSites = () => {
  return ApiClient.get(ROUTES.JOBSITES)
}

export const getJobSites = (
  id: number | null,
  endClientId: number | null | undefined
) => {
  const filters = endClientId
    ? `{"clientId":${id},"endClientId":${endClientId}}`
    : `{"clientId":${id}}`

  return ApiClient.get(ROUTES.JOBSITES + `?filters=${filters}`)
}

export const getFirstJobSite = (endClientId?: number | null | undefined) => {
  return ApiClient.get(
    ROUTES.JOBSITES +
      `?limit=1&sort=[{"orderBy":"startDate","order":"asc"}]${endClientId ? `&filters={"endClientId":${endClientId}}` : ''}`
  )
}

export const getJobSiteDetails = (id: number | null | undefined) => {
  return ApiClient.get(ROUTES.JOBSITES + `/${id}`)
}

export const closeJobSiteDetails = (id: number | null | undefined) => {
  return ApiClient.delete(ROUTES.JOBSITES + `/${id}`)
}

export const createJobSite = (payload: CREATE_JOB_SITE) => {
  return ApiClient.post(ROUTES.JOBSITES, payload)
}

export const updateJobSite = (id: number | null | undefined, payload: any) => {
  return ApiClient.patch(ROUTES.JOBSITES + `/${id}`, payload)
}

export const getJobSitesByClientId = (id: number | null | undefined) => {
  return ApiClient.get(ROUTES.JOBSITES + `/${id}`)
}

export const updateDumpster = (
  id: number | undefined,
  payload: DUMPSTER_LOCATION_TYPE
) => {
  return ApiClient.patch(
    ROUTES.JOBSITES + `${ROUTES.UPDATE_DUMPSTER}/${id}`,
    payload
  )
}

export const addDumpster = (
  jobSiteId: number | null | undefined,
  payload: DUMPSTER_LOCATION_TYPE
) => {
  return ApiClient.patch(
    ROUTES.JOBSITES + `/${jobSiteId}${ROUTES.ADD_DUMPSTER}`,
    payload
  )
}
export const getOutcome = (
  id: number | null | undefined,
  from: string | undefined,
  to: string | undefined
) => {
  const filters = []
  if (id) {
    filters.push(`%22jobSiteId%22%3A${id}`)
  }
  if (from && to) {
    filters.push(
      `%22rangeFrom%22%3A%22${from}%22`,
      `%22rangeTo%22%3A%22${to}%22`
    )
  }
  const queryParams =
    filters.length > 0 ? `filters=%7B${filters.join('%2C')}%7D` : ''
  return ApiClient.get(
    `${ROUTES.OUTCOME}/${queryParams ? `?${queryParams}` : ''}`
  )
}

export const getStatistics = (
  id: number | null | undefined,
  from: string | undefined,
  to: string | undefined
) => {
  const filters = []
  if (id) {
    filters.push(`%22jobSiteId%22%3A${id}`)
  }
  if (from && to) {
    filters.push(
      `%22rangeFrom%22%3A%22${from}%22`,
      `%22rangeTo%22%3A%22${to}%22`
    )
  }
  const queryParams =
    filters.length > 0 ? `filters=%7B${filters.join('%2C')}%7D` : ''
  return ApiClient.get(
    `${ROUTES.STATISTICS}${queryParams ? `?${queryParams}` : ''}`
  )
}
export const getDumpsterStatus = (id: number | undefined | null) => {
  return ApiClient.get(`${ROUTES.JOBSITES}/${id}${ROUTES.DUMPSTER_STATUS}`)
}
export const waste = (
  id: number | null | undefined,
  from: string | undefined,
  to: string | undefined
) => {
  const filters = []
  if (id) {
    filters.push(`%22jobSiteId%22%3A${id}`)
  }
  if (from && to) {
    filters.push(
      `%22rangeFrom%22%3A%22${from}%22`,
      `%22rangeTo%22%3A%22${to}%22`
    )
  }
  const queryParams =
    filters.length > 0 ? `filters=%7B${filters.join('%2C')}%7D` : ''
  return ApiClient.get(
    `${ROUTES.WASTE}/${queryParams ? `?${queryParams}` : ''}`
  )
}

export const sendSmsInstructionToSupervisor = (
  jobSiteId: number | undefined
) => {
  return ApiClient.post(ROUTES.SMS, { jobSiteId })
}
export const updateDumpsterRefused = (
  id: number | null | undefined,
  dumpsterLocationId: number | null | undefined,
  value: number | undefined,
  dumpsterSize: number
) => {
  ApiClient.patch(
    `${ROUTES.DUMPSTER_REFUSED_MMR}/${id}/${dumpsterLocationId}/${dumpsterSize}`,
    { dumspterCount: value }
  )
}

export const getNotificationsByJobisiteId = (
  jobSiteId: number,
  pagination: number
) => {
  return ApiClient.get(
    ROUTES.NOTIFICATIONS +
      `?page=${pagination}&filters={"jobSiteId":${jobSiteId},"status":"request"}&sort=[{"orderBy":"updatedAt","order":"desc"}]`
  )
}

export const updateDumpsterSms = (
  id: number | null | undefined,
  status: string
) => {
  return ApiClient.patch(`${ROUTES.SMS_DUMPSTER}/${id}`, { status })
}

export const getDumpsterData = () => {
  return ApiClient.get(`${ROUTES.DUMPSTER_LIVE_VIEW}/1`)
}

export const getDumpsterDataByJobsiteId = (jobsiteId: number) => {
  return ApiClient.get(`${ROUTES.DUMPSTER_LIVE_VIEW}/jobSiteId/${jobsiteId}`)
}

export const getAdminWasteStreamGraph = (
  clientIds: number[] | undefined | null,
  startDate: string,
  endDate: string
) => {
  return ApiClient.get(
    `${ROUTES.JOBSITES_WASTESTREAMS}/bar-graph-by-client?startDate=${startDate}&endDate=${endDate}&clientId=[${clientIds}]`
  )
}

export const getClientWasteStreamGraph = (
  jobSiteIds: number[] | undefined | null,
  startDate: string,
  endDate: string
) => {
  return ApiClient.get(
    `${ROUTES.JOBSITES_WASTESTREAMS}/bar-graph-by-jobsite?startDate=${startDate}&endDate=${endDate}&jobSiteId=[${jobSiteIds}]`
  )
}

export const reorderWasteStream = (
  jobSiteId: number | null | undefined,
  payload: REORDER_WASTE_STREAM_TYPE[]
) => {
  return ApiClient.patch(
    ROUTES.JOBSITES_WASTESTREAMS + `/${jobSiteId}${ROUTES.UPDATE_ORDER}`,
    {
      wasteStreams: payload,
    }
  )
}
