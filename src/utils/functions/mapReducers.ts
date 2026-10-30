import {
  LOCATION_TYPE,
  WASTE_STREAM_LOCATION_TYPE,
  WASTE_STREAMS,
} from '../constants/app-constants'
import { Accumulator, JobSitesWasteStreamsEntity } from '../constants/types'

export const reduceDumpsterTypeWise = (data: any): Accumulator => {
  let res = data.reduce((acc: any, current: any) => {
    if (!acc[current.dumpster_key]) {
      acc[current.dumpster_key] = []
    }
    current.jobSitesWasteStreamsDumpsters.sort((a: any, b: any) => b.id - a.id)
    acc[current.dumpster_key].push(
      current as unknown as JobSitesWasteStreamsEntity
    )
    return acc
  }, {})

  return res
}

export const reduceWasteStreamWise = (
  data: any,
  wasteStreamId: string | null
): Accumulator[] => {
  return Object.entries(data).map(([key, value]: [string, any]) => {
    return {
      [key]: value.reduce((acc: any, current: any) => {
        if (!acc[`${current.wasteStream.name}_${current.wasteStream.id}`]) {
          acc[`${current.wasteStream.name}_${current.wasteStream.id}`] = []
        }
        if (wasteStreamId) {
          if (
            Number(current.wasteStreamType.id) ===
            Number(wasteStreamId?.split('_')[1])
          ) {
            acc[`${current.wasteStream.name}_${current.wasteStream.id}`].push(
              current
            )
          }
        } else {
          acc[`${current.wasteStream.name}_${current.wasteStream.id}`].push(
            current
          )
        }
        return acc
      }, {}),
    }
  })
}

export const calculateMonthWiseCumulativeState = (
  data: JobSitesWasteStreamsEntity[]
) => {
  const totalVessels = data.reduce(
    (acc, curr) => acc + curr.jobSitesWasteStreamsDumpsters.length,
    0
  )
  const totalWeight = data.reduce(
    (acc, curr) =>
      acc +
      curr.jobSitesWasteStreamsDumpsters.reduce(
        (acc, curr) => acc + (curr.real_weight ?? curr.estimated_weight ?? 0),
        0
      ),
    0
  )
  const totalCarbonCredits = data.reduce(
    (acc: number, curr: any) => acc + curr.co2,
    0
  )
  const totalRecycles = data.reduce(
    (acc: number, curr: any) => acc + curr.recycling_rebate,
    0
  )
  const totalWeightDiverted = data.reduce((acc: number, curr: any) => {
    const processingLocation = curr.wasteStreamLocations.find(
      (location: any) => location.type === WASTE_STREAM_LOCATION_TYPE.LOCATION
    )
    if (
      curr.wasteStream.name === WASTE_STREAMS.WOOD_WASTE &&
      processingLocation?.location?.typeLabel === LOCATION_TYPE.LANDFILL
    ) {
      return (
        acc +
        curr.jobSitesWasteStreamsDumpsters.reduce(
          (acc: number, curr: any) =>
            acc + (curr.real_weight ?? curr.estimated_weight ?? 0),
          0
        )
      )
    }
    return acc
  }, 0)

  return {
    totalVessels,
    totalWeight,
    totalCarbonCredits,
    totalRecycles,
    totalWeightDiverted,
  }
}
