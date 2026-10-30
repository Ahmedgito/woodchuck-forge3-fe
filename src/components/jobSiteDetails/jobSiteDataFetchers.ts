import { Dispatch, SetStateAction } from 'react'

import { MESSAGES } from '@/src/utils/constants/app-constants'

import { getEffectiveDates } from '@/src/utils/functions/getDate'
import { getDumpsterStats } from '@/src/services/global'

interface FetchParams {
  startDate: string | Date | undefined
  endDate: string | undefined
  setState: Dispatch<SetStateAction<any>>
  setLoading: Dispatch<SetStateAction<boolean>>
  triggerNotification: (type: string, title: string, message: string) => void
  id: number | undefined | null
  reporting: boolean | undefined
}

export const fetchDumpsterStats = async ({
  setState,
  setLoading,
  startDate,
  endDate,
  triggerNotification,
  id,
  reporting,
}: FetchParams) => {
  const { effectiveStartDate, effectiveEndDate } = getEffectiveDates(
    startDate,
    endDate
  )

  // Validation before API call
  if (!id) {
    setLoading(false)
    return
  }

  if (!effectiveStartDate || !effectiveEndDate) {
    setLoading(false)
    return
  }

  try {
    setLoading(true)
    const result = await getDumpsterStats(
      id,
      effectiveStartDate,
      effectiveEndDate
    )

    // Validate and set response
    if (result.data && result.data.data) {
      setState(result.data.data)
    } else {
      setState(null)
    }

    !reporting && setLoading(false)
  } catch (err) {
    setLoading(false)
    setState(null)
    triggerNotification(
      'error',
      MESSAGES.ERROR,
      MESSAGES.SOMETHING_WENT_WRONG_DUMPSTER_STATS
    )
  }
}
