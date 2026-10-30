import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  DUMPSTER_OPTIONS,
  DUMPSTER_TRANSFORMED_OPTIONS,
} from '../constants/types'

export const transformDumpsterData = (
  data: DUMPSTER_OPTIONS
): DUMPSTER_TRANSFORMED_OPTIONS[] => {
  const grouped = data.reduce<{
    [key: string]: DUMPSTER_TRANSFORMED_OPTIONS
  }>((acc, item) => {
    if (!acc[item.dumpsterKey]) {
      acc[item.dumpsterKey] = {
        label: <span className="dropdown-sub-head">{item.dumpsterType}</span>,
        title: item.dumpsterType,
        options: [],
      }
    }
    acc[item.dumpsterKey].options.push({
      label: <span>{item.dumpsterWeight}</span>,
      value: `${item.vesselId}_${item.vesselOptionId}`,
      displayValue: `${item.dumpsterType} ${item.dumpsterWeight}`,
    })
    return acc
  }, {})

  return Object.values(grouped)
}

export const transformVesselTypeData = (
  data: DUMPSTER_OPTIONS
): DROP_DOWN_OPTIONS => {
  const normalizedData = data.map((item) => {
    return {
      label: item.dumpsterType + ' ' + item.label,
      value: item.key,
      disabled: item.disabled,
    }
  })

  // Remove duplicates based on value to prevent duplicate options
  const uniqueData = normalizedData.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.value === item.value)
  )

  return uniqueData
}

export const transformLocationList = (
  data: COMBINED_LOCATION_TYPE[]
): DUMPSTER_TRANSFORMED_OPTIONS[] => {
  const grouped = data.reduce<{
    [key: string]: DUMPSTER_TRANSFORMED_OPTIONS
  }>((acc, item) => {
    if (!acc[item.typeLabel]) {
      acc[item.typeLabel] = {
        label: <span className="dropdown-sub-head">{item.typeLabel}</span>,
        title: item.typeLabel,
        options: [],
      }
    }
    acc[item.typeLabel].options.push({
      label: <span>{item.name}</span>,
      value: item.id + '_' + item.entityType,
      entityType: item.entityType,
    })
    return acc
  }, {})

  return Object.values(grouped)
}

export const transformWasteStreamData = (
  data: any[]
): DUMPSTER_TRANSFORMED_OPTIONS[] => {
  const grouped = data.reduce<{
    [key: string]: DUMPSTER_TRANSFORMED_OPTIONS
  }>((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = {
        label: <span className="dropdown-sub-head">{item.name}</span>,
        title: item.name,
        options: [],
      }
    }
    acc[item.name].options = item.wasteStreamTypes.map((option: any) => {
      return {
        label: <span>{option.name}</span>,
        value: item.id + '_' + option.id,
        disabled: option.disabled,
      }
    })
    return acc
  }, {})

  return Object.values(grouped)
}

export const transformCameraData = (list: CAMERA_DROPDOWN_TYPE[] = []) => {
  return list.map((item) => ({
    value: item.id,
    label: item.cameraId,
  }))
}

export const transformAlertData = (list: DUMPSTER_ALERT_TYPE[] = []) => {
  return list.map((item) => ({
    value: `${item.alertTo}-${item.alertToType}`,
    label: item.name,
  }))
}
