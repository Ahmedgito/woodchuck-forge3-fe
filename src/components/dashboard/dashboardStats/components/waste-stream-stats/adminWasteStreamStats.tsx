'use client'

import { useEffect, useState } from 'react'
import { getClients, getManufacturers } from '@/src/services/global'
import { useLoader } from '@/src/utils/context/loader-context'
import CollapseTab from '../../../../common/collapse'
import CollapseTitle from '../../../../common/collapseTitle'
import { getFirstJobSite } from '@/src/services/jobsite'
import { getMonths, getWeeks } from '@/src/utils/functions/getDate'
import AdminWasteStreamGraph from './adminWasteStreamGraph'
import { GRAPH_CLIENT, JOB_SITE } from '@/src/utils/constants/types'
import { useDashboardStats } from '@/src/utils/context/dashboard-report-context'
import { useUser } from '@/src/utils/context/user-context'
import { ROLES } from '@/src/utils/constants/app-constants'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

interface Props {
  reporting?: boolean
  exportMode?: boolean // <-- renamed from reporting
  jobSite?: JOB_SITE
  clients?: GRAPH_CLIENT[]
  clientIds?: number[]
  wasteStreamDataByMonth?: { [key: string]: any[] }
  startDateFilter?: string | Date | undefined
  endDateFilter?: string | Date | undefined
  weekly?: boolean
}

const AdminWasteStreamStats: React.FC<Props> = ({
  reporting = false,
  exportMode = false,
  jobSite: propJobSite,
  clients: propClients,
  clientIds: propClientIds,
  wasteStreamDataByMonth,
  startDateFilter,
  endDateFilter,
  weekly = false,
}) => {
  const { setLoading } = useLoader()
  const [clientIds, setClientIds] = useState<number[]>(propClientIds || [])
  const [jobSite, setJobSite] = useState<JOB_SITE | undefined>(propJobSite)
  const [clients, setClients] = useState<GRAPH_CLIENT[]>(
    propClients?.map(({ id, name }: GRAPH_CLIENT, index: number) => {
      const client = {
        id,
        name,
        height: 50 * index,
      }
      console.log('client', client)
      return client
    }) || []
  )
  const { setImagesCount, setFirstJobSite, setFirstJobSiteFetched } = useDashboardStats()
  const { user } = useUser()
  useEffect(() => {
    console.log('here', propClients?.length)
    if (exportMode) return // Skip API calls in export/public mode
    const getFirstJobSiteDetails = async () => {
      try {
        !reporting && setLoading(true)
        let result = await getFirstJobSite()
        const firstJobSite = result.data?.data?.data[0]
        setJobSite(firstJobSite)
        setFirstJobSite(firstJobSite)
        setFirstJobSiteFetched(true)
      } catch (err) {
        // handle error
        setFirstJobSiteFetched(true) // Set to true even on error to unblock
      } finally {
        !reporting && setLoading(false)
      }
    }
    const getClientsList = async () => {
      try {
        !reporting && setLoading(true)
        const result = await getClients()
        const resultGetManufacturers = await getManufacturers()
        let clientsList: GRAPH_CLIENT[] = result.data.data.data.map(
          ({ id, name }: GRAPH_CLIENT, index: number) => {
            const client = {
              id,
              name,
              height: 50 * index,
            }
            return client
          }
        )

        if (user?.role.enum === ROLES.ADMIN || user?.role.enum === ROLES.CMS) {
          resultGetManufacturers.data.data.data.map(
            ({ id, name }: GRAPH_CLIENT, index: number) => {
              const client = {
                id,
                name,
                height: 50 * (index + result.data.data.data.length),
              }

              clientsList.push(client)
            }
          )
        }

        const ids: number[] = clientsList.map((client) => client.id)
        setClients(clientsList)
        setClientIds(ids)
        !reporting && setLoading(false)
      } catch (err) {
        !reporting && setLoading(false)
        // trigger(
        //   'error',
        //   MESSAGES.ERROR,
        //   MESSAGES.SOMETHING_WENT_WRONG_CLIENT
        // )
      }
    }

    getFirstJobSiteDetails()
    getClientsList()
  }, [reporting, setLoading])

  useEffect(() => {
    setImagesCount(getMonths(jobSite, startDateFilter, endDateFilter).length)
  }, [jobSite, startDateFilter, endDateFilter])

  const monthDetails = weekly
    ? getWeeks(startDateFilter, endDateFilter)
    : getMonths(jobSite, startDateFilter, endDateFilter)
  const items = monthDetails.map((month, index) => ({
    key: exportMode || reporting ? 1 : month.name,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
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
      <>
        <AdminWasteStreamGraph
          clients={clients}
          clientIds={clientIds}
          startDate={month.startDate}
          endDate={month.endDate}
          reporting={reporting}
          exportMode={exportMode}
          monthName={`months/${month.name}`}
          wasteStreamData={
            exportMode && wasteStreamDataByMonth
              ? wasteStreamDataByMonth
              : undefined
          }
        />
      </>
    ),
  }))

  const activeKeys = exportMode || reporting ? [1] : []

  return (
    <>
      {clientIds.length > 0 && (
        <CollapseTab
          className="collapse-primary"
          items={items}
          activeKey={activeKeys}
        />
      )}
    </>
  )
}

export default AdminWasteStreamStats
