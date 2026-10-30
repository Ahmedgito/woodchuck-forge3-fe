import { CREATE_JOB_SITE, JOB_SITE } from '../constants/types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek'
import { DATE_FORMAT } from '../constants/app-constants'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)

export const parseDate = (
  date: string | Date | undefined,
  useUTC: boolean = true
): dayjs.Dayjs => {
  if (!date) return dayjs()
  return useUTC ? dayjs(date).utc(true) : dayjs(date)
}

export const getStartOfCurrentYear = (useUTC: boolean = true): dayjs.Dayjs => {
  return useUTC ? dayjs().utc().startOf('year') : dayjs().startOf('year')
}

export const formatToISO = (
  date: dayjs.Dayjs | string,
  useUTC: boolean = true
): string => {
  const dayjsObj = typeof date === 'string' ? parseDate(date, useUTC) : date
  return dayjsObj.format(DATE_FORMAT.DATE_FORMAT_ISO)
}

export const getMonthBoundaries = (
  year: number,
  month: number,
  useUTC: boolean = true
) => {
  const dayjsFactory = useUTC ? dayjs.utc : dayjs
  return {
    startOfMonth: dayjsFactory().year(year).month(month).startOf('month'),
    endOfMonth: dayjsFactory().year(year).month(month).endOf('month'),
  }
}

export const getMonthName = (monthIndex: number): string => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return monthNames[monthIndex] || 'Unknown'
}

export const createDateFromYearMonth = (
  year: number,
  month: number,
  useUTC: boolean = true
): dayjs.Dayjs => {
  return useUTC
    ? dayjs.utc().year(year).month(month)
    : dayjs().year(year).month(month)
}

export const getStartOfMonthISO = (
  date: string | Date | dayjs.Dayjs
): string => {
  return dayjs(date).utc().startOf('month').toISOString().split('T')[0]
}

export const getEndOfMonthISO = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).utc().endOf('month').toISOString().split('T')[0]
}

export const getStartOfWeekISO = (
  date: string | Date | dayjs.Dayjs
): string => {
  return dayjs(date).utc().startOf('isoWeek').toISOString().split('T')[0]
}

export const getEndOfWeekISO = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).utc().endOf('isoWeek').toISOString().split('T')[0]
}

export const getEffectiveDates = (
  startDate: string | Date | undefined,
  endDate: string | undefined
): { effectiveStartDate: string | Date; effectiveEndDate: string } => {
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0] // Format: YYYY-MM-DD
  return {
    effectiveStartDate: startDate || formattedDate,
    effectiveEndDate: endDate || formattedDate,
  }
}

export const getMonthDetailsBetween = (
  startDate: string | Date | undefined,
  endDate?: string | Date | undefined
) => {
  const start = parseDate(startDate)
  const end = endDate ? parseDate(endDate) : dayjs().utc()

  const startYear = start.year()
  const startMonth = start.month()
  const endYear = end.year()
  const endMonth = end.month()

  let months = []

  for (let year = startYear; year <= endYear; year++) {
    for (
      let month = year === startYear ? startMonth : 0;
      month <= (year === endYear ? endMonth : 11);
      month++
    ) {
      const { startOfMonth, endOfMonth } = getMonthBoundaries(year, month)
      months.push({
        name: `${getMonthName(month)} ${year}`,
        startDate: formatToISO(startOfMonth),
        endDate: formatToISO(endOfMonth),
      })
    }
  }

  return months
}

export const getWeeks = (
  startDate: string | Date | undefined,
  endDate?: string | Date | undefined
) => {
  const start = parseDate(startDate).startOf('isoWeek')
  const end = (endDate ? parseDate(endDate) : dayjs().utc()).endOf('isoWeek')

  let weeks: { name: string; startDate: string; endDate: string }[] = []
  let cursor = start

  while (cursor.isBefore(end) || cursor.isSame(end, 'week')) {
    const weekStart = cursor.startOf('isoWeek')
    const weekEnd = cursor.endOf('isoWeek')
    const startISO = formatToISO(weekStart)
    const endISO = formatToISO(weekEnd)
    weeks.push({
      name: `${startISO} - ${endISO}`,
      startDate: startISO,
      endDate: endISO,
    })
    cursor = cursor.add(1, 'week')
  }

  return weeks
}

export const getMonths = (
  jobsite: CREATE_JOB_SITE | JOB_SITE | undefined,
  startDateFilter?: string | Date | undefined,
  endDateFilter?: string | Date | undefined,
  firstJobSite?: JOB_SITE | undefined
) => {
  // If date filters are provided, use them; otherwise use jobsite dates
  const startDate =
    startDateFilter ||
    jobsite?.startDate ||
    jobsite?.createdAt ||
    firstJobSite?.startDate
  const endDate = endDateFilter || undefined
  return getMonthDetailsBetween(startDate, endDate)
}

export const getDashboardStartDate = (
  envStartYear?: string,
  fallback: string = '01-1970'
): string => {
  const startYearStr = envStartYear || fallback
  const [month, year] = startYearStr.split('-').map(Number)
  const date = createDateFromYearMonth(year, month - 1, false)
  return formatToISO(date.startOf('month'), false)
}

export const getMinimumSelectableDate = (
  toDate?: string | Date | undefined,
  isDashboard: boolean = false,
  firstJobSite?: JOB_SITE | undefined
): dayjs.Dayjs => {
  if (isDashboard) {
    if (firstJobSite?.startDate) {
      return parseDate(firstJobSite.startDate).startOf('month')
    }
    const envStartYear = process.env.NEXT_PUBLIC_ARCHIVE_START_YEAR || '01-2024'
    const [month, year] = envStartYear.split('-').map(Number)
    return createDateFromYearMonth(year, month - 1).startOf('month')
  } else {
    if (toDate) {
      return parseDate(toDate).startOf('month')
    }
    return getStartOfCurrentYear()
  }
}
export { dayjs }
