import { Dispatch, SetStateAction } from 'react'
import {
  getAlertOptions,
  getCameras,
  getCamerasByJobId,
  getClients,
  getCombinedLocations,
  getEndClients,
  getHaulers,
  getLocations,
  getManufacturers,
  getOfftakes,
  getPowerPlants,
  getEmissionFactors,
  getUnassociatedCameras,
  getWasteStreamById,
  getWasteStreams,
  getdumpsterLocations,
  getdumpsterOptions,
} from '@/src/services/global'
import {
  MESSAGES,
  WASTE_STREAM_LOCATION_TYPE,
} from '@/src/utils/constants/app-constants'
import {
  CAMERA_DROPDOWN_TYPE,
  CAMERA_TYPE,
  COMBINED_LOCATION_TYPE,
  DUMPSTERDROPDOWNOPTIONS,
  DUMPSTER_ALERT_TYPE,
  DUMPSTER_LOCATION_OPTIONS,
  DUMPSTER_OPTIONS,
  GET_WASTE_STREAM_JOB_SITE_FORM_TYPE,
  HAULER_TYPE,
  LOCATION_TYPE,
  POWER_PLANT_TYPE,
  EMISSION_FACTOR_TYPE,
  USER_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
interface FetchParams<T> {
  setState: Dispatch<SetStateAction<T>>
  setLoading: Dispatch<SetStateAction<boolean>>
  triggerNotification: (type: string, title: string, message: string) => void
  id?: number | null
}
interface ExtendedParams<T> extends FetchParams<T> {
  setClassLength: Dispatch<SetStateAction<number>>
}
export const fetchClientData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<USER_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getClients()
    setState(result.data.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_CLIENT
    )
  }
}

export const fetchEndClientData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<USER_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getEndClients()
    setState(result.data.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_CLIENT
    )
  }
}

export const fetchManufacturerData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<USER_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getManufacturers()
    setState(result.data.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_CLIENT
    )
  }
}

export const fetchOfftakeData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<USER_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getOfftakes()
    setState(result.data.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_OFFTAKE
    )
  }
}

export const fetchHaulerData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<HAULER_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getHaulers()
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_HAULER
    )
  }
}

export const fetchCameraData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<CAMERA_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getCameras()
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_CAMERAS
    )
  }
}

export const fetchUnassociatedCameraData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<CAMERA_DROPDOWN_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getUnassociatedCameras()
    const transformData = (data: any[]) => {
      return data.map((item) => ({
        id: item.id,
        cameraId: item.cameraId,
      }))
    }
    setState(transformData(result.data.data))
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_CAMERAS
    )
  }
}

export const fetchAlertsData = async ({
  id,
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<DUMPSTER_ALERT_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getAlertOptions(id)
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification('error', MESSAGES.ERROR, MESSAGES.SOMETHING_WENT_WRONG)
  }
}

export const fetchLiveDumpsteraData = async ({
  id,
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<CAMERA_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getCamerasByJobId(id)
    setState(result?.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_CAMERAS
    )
  }
}

export const fetchWasteStreamData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<WASTE_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getWasteStreams()

    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_WASTE_STREAM
    )
  }
}

export const fetchPowerPlantData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<POWER_PLANT_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getPowerPlants()
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_POWER
    )
  }
}

export const fetchEmissionFactorData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<EMISSION_FACTOR_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getEmissionFactors()
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_EMISSION_FACTORS
    )
  }
}

export const fetchLocationData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<LOCATION_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getLocations()
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_LOCATION
    )
  }
}

export const fetchCombinedLocationData = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<COMBINED_LOCATION_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getCombinedLocations()
    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_LOCATION
    )
  }
}

export const fetchdumpsterOption = async ({
  setState,
  setLoading,
  triggerNotification,
}: FetchParams<DUMPSTER_OPTIONS>) => {
  try {
    setLoading(true)
    const result = await getdumpsterOptions()

    setState(result.data.data)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_DUMPSTER
    )
  }
}
export const fetchdumpsterLocation = async ({
  setState,
  setLoading,
  triggerNotification,
  id,
}: FetchParams<DUMPSTER_LOCATION_OPTIONS>) => {
  try {
    setLoading(true)
    const result = await getdumpsterLocations(id)
    const apiData = result.data.data.map((option: DUMPSTERDROPDOWNOPTIONS) => ({
      label: option.sublocationName,
      value: option.id,
      isDefault: option.isDefault,
    }))
    setState(apiData)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_DUMPSTER_LOCATIONS
    )
  }
}

export const fetchJobSitesWasteStreams = async ({
  setState,
  setLoading,
  triggerNotification,
  id,
  setClassLength,
}: ExtendedParams<GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]>) => {
  try {
    setLoading(true)
    const result = await getWasteStreamById(id)
    const transformData = (
      data: any[]
    ): GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[] => {
      const wasteStreams = data.map((item) => {
        const location = item.wasteStreamLocations.find(
          (location: any) =>
            location.type === WASTE_STREAM_LOCATION_TYPE.LOCATION
        )
        const endPoint = item.wasteStreamLocations.find(
          (location: any) =>
            location.type === WASTE_STREAM_LOCATION_TYPE.END_POINT
        )
        return {
          id: item.id,
          jobSiteId: id,
          wastestreamsId: item.wasteStream.id,
          wasteStreamName: item.wasteStream.name,
          vesselId: item.vesselId,
          vesselOptionId: item.vesselOptionId,
          wasteStreamTypeId: item.wasteStreamTypeId,
          wasteStreamType: item.wasteStreamType?.name,
          vessel: item.dumpster_key + ' ' + item.dumpster_weight,
          dumpsterId: item.dumpster.id,
          dumpsterName: item.dumpster.sublocationName,
          co2: item.co2,
          recycling_rebate: item.recycling_rebate,
          reports_enabled: item.reports_enabled,
          distance: location?.distance,
          haulerId: location?.haulerId,
          haulerName: location?.haulerName,
          locationId: location?.locationId || null,
          powerplantId: location?.powerplantId || null,
          locationName: location?.locationName,
          wasteStreamCameras: item.wasteStreamCameras,
          order: item.order,
          isEndPoint: Boolean(endPoint),
          endPointDistance: endPoint?.distance,
          endPointHauler: endPoint?.haulerName,
          endPointLocation: endPoint?.locationName,
          endPointLocationId: endPoint?.locationId,
          endPointPowerplantId: endPoint?.powerplantId,
          endPointHaulerId: endPoint?.haulerId,
          firstEntry: item.firstEntry,
        }
      })

      // Sort the transformed data by id
      return wasteStreams.sort((a, b) => a.order - b.order)
    }
    const transformedData = transformData(result.data.data.jobSiteWastestreams)
    setState(transformedData)

    setClassLength(transformedData.length)

    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_WASTE_STREAM
    )
  }
}
