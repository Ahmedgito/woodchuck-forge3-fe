import { FormikValues } from 'formik'
import { WASTE_STREAM_LOCATION_TYPE } from '../constants/types'

export const extractPayload = (
  values: FormikValues,
  jobSiteId: number | null | undefined,
  isEdit: boolean = false
) => {
  const [alertTo, alertToType] = values.alertId?.split('-') || []
  let fields = {}
  if (isEdit) {
    fields = {
      wastestreamsId: values.wastestreamsId,
      wasteStreamTypeId: values.wasteStreamTypeId,
      vesselId: values.vesselId,
      vesselOptionId: values.vesselOptionId,
    }
  } else {
    const [wasteStreamId, wasteStreamTypeId] =
      values.wastestreamsId?.split('_') || []
    fields = {
      wastestreamsId: parseInt(wasteStreamId),
      wasteStreamTypeId: parseInt(wasteStreamTypeId),
      vesselId: values.vesselId.split('_')[0],
      vesselOptionId: values.vesselId.split('_')[1],
    }
  }
  const payload = {
    jobSiteId: jobSiteId,
    dumpsterId: values.vesselLocationId,
    co2: values.co2,
    recycling_rebate: values.recycling_rebate,
    reports_enabled: values.reports_enabled,
    wasteStreamCameras: {},
    wasteStreamLocations: [] as WASTE_STREAM_LOCATION_TYPE[],
    ...fields,
  }

  const locationPayload = {
    type: 1,
    locationId: values.locationId ? parseInt(values.locationId) : null,
    powerplantId: values.powerplantId ? parseInt(values.powerplantId) : null,
    haulerId: values.haulerId,
    distance: values.distance ? parseInt(values.distance) : 0,
  }

  const endPointPayload = {
    type: 2,
    locationId: values.locationId_2 ? parseInt(values.locationId_2) : null,
    powerplantId: values.powerplantId_2
      ? parseInt(values.powerplantId_2)
      : null,
    haulerId: values.haulerId_2,
    distance: values.distance_2 ? parseInt(values.distance_2) : 0,
  }

  if (values.locationId || values.powerplantId) {
    payload.wasteStreamLocations.push(locationPayload)
  }

  if (values.locationId_2 || values.powerplantId_2) {
    payload.wasteStreamLocations.push(endPointPayload)
  }

  if (values.cameraId || values.additionalCameraId) {
    payload.wasteStreamCameras = {
      cameraId: values.cameraId,
      additionalCameraId: values.additionalCameraId,
      maxLevel: values.fillLevel,
      confidenceLevel: values.confidenceLevel,
      alertToType: parseInt(alertToType),
      alertTo: parseInt(alertTo),
    }
  }

  return payload
}
