'use client'

import { useLoader } from '@/src/utils/context/loader-context'
import CollapseTab from '../../../../common/collapse'
import { getFirstJobSite, getClientJobSites } from '@/src/services/jobsite'
import { useEffect, useState } from 'react'
import { getMonths, getWeeks } from '@/src/utils/functions/getDate'
import CollapseTitle from '@/src/components/common/collapseTitle'
import ClientWasteStreamGraph from './clientWasteStreamGraph'
import { GRAPH_CLIENT, JOB_SITE } from '@/src/utils/constants/types'
import { useDashboardStats } from '@/src/utils/context/dashboard-report-context'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'
import styles from './styles.module.scss'

interface Props {
  reporting?: boolean
  exportMode?: boolean
  jobSite?: JOB_SITE
  jobSites?: GRAPH_CLIENT[]
  jobsiteIds?: number[]
  startDateFilter?: string | Date | undefined
  endDateFilter?: string | Date | undefined
  wasteStreamDataByMonth?: Record<string, any>
  weekly?: boolean
}

const ClientWasteStreamStats: React.FC<Props> = ({
  reporting = false,
  exportMode,
  jobSite: propJobSite,
  jobSites: propJobSites,
  jobsiteIds: propJobsiteIds,
  startDateFilter,
  endDateFilter,
  wasteStreamDataByMonth,
  weekly = false,
}) => {
  const { setLoading } = useLoader()
  const [jobSite, setJobSite] = useState<JOB_SITE | undefined>(propJobSite)
  const [jobSites, setJobSites] = useState<GRAPH_CLIENT[]>(
    propJobSites?.map(({ id, title }: GRAPH_CLIENT, index: number) => ({
      id,
      name: title,
      height: 50 * index,
    })) || []
  )
  const [jobsiteIds, setJobsiteIds] = useState<number[]>(propJobsiteIds || [])
  const { setImagesCount, setFirstJobSiteFetched, setFirstJobSite } =
    useDashboardStats()
  useEffect(() => {
    if (exportMode) return // Skip API calls in export/public mode
    const runFetches = async () => {
      try {
        !reporting && setLoading(true)
        const [firstResult, jobSitesResult] = await Promise.all([
          getFirstJobSite(),
          getClientJobSites(),
        ])
        const firstJobSite = firstResult.data?.data?.data[0]
        setJobSite(firstJobSite)
        setFirstJobSite(firstJobSite)
        setFirstJobSiteFetched(true)
        let jobSitesList: GRAPH_CLIENT[] = (jobSitesResult.data?.data?.data || []).map(
          ({ id, title }: GRAPH_CLIENT, index: number) => ({
            id,
            name: title,
            height: 50 * index,
          })
        )
        if (jobSitesList.length === 0 && firstJobSite) {
          jobSitesList = [
            { id: firstJobSite.id, name: firstJobSite.title, height: 0 },
          ]
        }
        const ids: number[] = jobSitesList.map((js) => js.id)
        setJobSites(jobSitesList)
        setJobsiteIds(ids)
      } catch (err) {
        const firstResult = await getFirstJobSite()
        const firstJobSite = firstResult.data?.data?.data[0]
        setJobSite(firstJobSite)
        setFirstJobSite(firstJobSite)
        setFirstJobSiteFetched(true)
        if (firstJobSite) {
          setJobSites([
            { id: firstJobSite.id, name: firstJobSite.title, height: 0 },
          ])
          setJobsiteIds([firstJobSite.id])
        }
      } finally {
        !reporting && setLoading(false)
      }
    }
    runFetches()
  }, [reporting, setLoading, setFirstJobSiteFetched, setFirstJobSite])

  useEffect(() => {
    if (jobSite)
      setImagesCount(getMonths(jobSite, startDateFilter, endDateFilter).length)
  }, [jobSite, startDateFilter, endDateFilter, setImagesCount])

  const monthDetails = weekly
    ? getWeeks(startDateFilter, endDateFilter)
    : getMonths(jobSite, startDateFilter, endDateFilter)

  const items = monthDetails.map((month, index) => ({
    key: exportMode || reporting ? 1 : month.name,
    label: (
      <div className={styles.labelContainer}>
        <span className={styles.labelTitle}>
          <CollapseTitle title={month.name} />
        </span>
        {index === 0 && (
          <GenieButtonWrapper hint="monthly_bars_dropdown">
            <span />
          </GenieButtonWrapper>
        )}
      </div>
    ),
    children: (
      <ClientWasteStreamGraph
        jobSites={jobSites}
        jobsiteIds={jobsiteIds}
        startDate={month.startDate}
        endDate={month.endDate}
        reporting={reporting}
        exportMode={exportMode}
        monthName={month.name}
        wasteStreamData={
          exportMode && wasteStreamDataByMonth
            ? wasteStreamDataByMonth
            : undefined
        }
      />
    ),
  }))

  const activeKeys = exportMode || reporting ? [1] : []

  return (
    <>
      {jobsiteIds.length > 0 && (
        <CollapseTab
          className="collapse-primary"
          items={items}
          activeKey={activeKeys}
        />
      )}
    </>
  )
}

export default ClientWasteStreamStats
