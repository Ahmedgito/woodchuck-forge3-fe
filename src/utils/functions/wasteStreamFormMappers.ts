import {
  VesselList,
  WasteStreamFormType,
  WoodWasteVessel,
} from '../constants/types'

export const mergeWasteStreamTypesWithVessels = (
  backendTypes: VesselList[] = [],
  masterVessels: WoodWasteVessel[] = []
) => {
  return (backendTypes || []).map((type: any) => {
    const backendVessels = type.vessels || []
    const merged = (masterVessels || []).map((mv: any) => {
      const found = backendVessels.find((bv: any) => bv.vesselId === mv.id)
      return {
        vesselId: mv.id,
        id: found?.id,
        name: mv.name,
        // backend may include `disabled` boolean — treat disabled===true as NOT enabled
        enabled: !!found,
        disabled: found?.disabled === true,
        // fill tons if backend provided it; keep string to match your inputs
        tons: found ? found.tons ?? '' : '',
      }
    })
    return {
      ...type,
      vessels: merged,
    }
  })
}

export const mapWasteStreamPayload = (values: WasteStreamFormType) => {
  return {
    name: values.name,
    colorCodeEst: values.colorCodeEst,
    colorCodeReal: values.colorCodeReal,
    wasteStreamTypes: values.wasteStreamTypes.map((type) => ({
      id: type.id, // keep id if editing, may be undefined for new
      name: type.name,
      colorCodeEst: type.colorCodeEst,
      colorCodeReal: type.colorCodeReal,
      vessels: type.vessels
        .filter((v) => v.enabled) // ✅ only checked vessels
        .map((v) => ({
          vesselId: v.vesselId,
          tons: Number(v.tons),
          ...(v.id ? { id: v.id } : {}), // include id only if exists
        })),
    })),
  }
}
