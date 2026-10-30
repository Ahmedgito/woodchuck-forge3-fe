import {
  HAULER_TYPE,
  LOCATION_TYPE,
  POWER_PLANT_TYPE,
  USER_TYPE,
  WASTE_TYPE,
} from '../constants/types'

export const dropDownMapper = (
  list:
    | POWER_PLANT_TYPE[]
    | HAULER_TYPE[]
    | WASTE_TYPE[]
    | LOCATION_TYPE[]
    | USER_TYPE[]
) => {
  return list?.map((plant) => ({
    value: plant.id,
    label: plant.name,
  }))
}

export const CameraMapper = (camera: any, data: any) => {
  let mappedCamera = {
    cameraName: camera['cameraId'],
    captureDatetime: camera['captureDatetime'],
    captureCount: camera['captureCount'],
    s3ImageUrl: camera['s3ImageUrl'],
    folio3FillPercentage: camera['folio3FillPercentage'],
    folio3ConfidenceLevel: camera['folio3ConfidenceLevel'],
    fillLevel: data?.maxLevel ?? 0,
    confidenceLevel: data?.confidenceLevel ?? 0,
    isPolluted: camera['isPolluted'],
    isOnline: camera['isOnline'],
    enableRefresh: camera['enableRefresh'],
  }

  return mappedCamera
}
