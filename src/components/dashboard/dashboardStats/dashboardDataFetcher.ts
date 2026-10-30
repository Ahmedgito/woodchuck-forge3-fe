import {
  getCarbonCreditAdminAggregation,
  getCarbonCreditByClient,
  getCarbonCreditByJobSite,
  getDiversionStats,
  getTreeGraphStats,
  getTypeStats,
  getWoodWasteStats,
} from '@/src/services/global'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { getEffectiveDates } from '@/src/utils/functions/getDate'
import { Dispatch, SetStateAction } from 'react'

interface FetchParams {
  startDate: string | Date | undefined
  endDate: string | undefined
  setState: Dispatch<SetStateAction<any>>
  setLoading: Dispatch<SetStateAction<boolean>>
  triggerNotification: (type: string, title: string, message: string) => void
  clientId?: number | null | undefined
  jobSiteId?: number | null | undefined
}

export const fetchDiversionStats = async ({
  setState,
  setLoading,
  startDate,
  endDate,
  triggerNotification,
  clientId,
  jobSiteId,
}: FetchParams) => {
  const { effectiveStartDate, effectiveEndDate } = getEffectiveDates(
    startDate,
    endDate
  )
  try {
    setLoading(true)

    const carbonCreditPromise = jobSiteId
      ? getCarbonCreditByJobSite(jobSiteId)
      : clientId
        ? getCarbonCreditByClient(clientId)
        : getCarbonCreditAdminAggregation()

    const [treeStats, diversionStats, typeStats, WoodWasteStats] =
      await Promise.all([
        getTreeGraphStats({
          effectiveStartDate,
          effectiveEndDate,
          jobSiteId,
          clientId,
        }),
        getDiversionStats({
          effectiveStartDate,
          effectiveEndDate,
          jobSiteId,
          clientId,
        }),
        getTypeStats({
          effectiveStartDate,
          effectiveEndDate,
          jobSiteId,
          clientId,
        }),
        getWoodWasteStats({
          effectiveStartDate,
          effectiveEndDate,
          jobSiteId,
          clientId,
        }),
      ])

    const carbonCreditResponse = await carbonCreditPromise
    const carbonCreditPayload = carbonCreditResponse?.data?.data ?? null
    const carbonCreditCo2 = jobSiteId
      ? Number(carbonCreditPayload?.co2Value ?? 0)
      : Number(carbonCreditPayload?.totalCo2Value ?? 0)
    const carbonCreditDollars = jobSiteId
      ? Number(carbonCreditPayload?.carbonCreditDollars ?? 0)
      : Number(carbonCreditPayload?.totalCarbonCreditDollars ?? 0)

    setState({
      ...diversionStats.data.data,
      ...typeStats.data.data,
      ...WoodWasteStats.data.data,
      ...treeStats.data.data,
      carbon_credits: carbonCreditCo2,
      carbon_credit_co2: carbonCreditCo2,
      carbon_credit_dollars: carbonCreditDollars,
    })

    setLoading(false)
  } catch (err) {
    setLoading(false)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_GRAPH
    )
  }
}
