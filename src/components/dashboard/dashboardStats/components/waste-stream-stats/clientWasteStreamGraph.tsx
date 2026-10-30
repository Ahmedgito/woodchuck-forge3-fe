'use client'

import { useLoader } from '@/src/utils/context/loader-context'
import { useEffect, useState } from 'react'
import { getClientWasteStreamGraph } from '@/src/services/jobsite'
import { GRAPH_CLIENT, GRAPH_WASTE_STREAM } from '@/src/utils/constants/types'
import WasteStreamGraph from './wasteStreamGraph'

interface Props {
  jobSites: GRAPH_CLIENT[]
  jobsiteIds: number[]
  startDate: string
  endDate: string
  reporting?: boolean
  exportMode?: boolean
  monthName: string
  wasteStreamData?: any
}
const ClientWasteStreamGraph: React.FC<Props> = ({
  jobSites,
  jobsiteIds,
  startDate,
  endDate,
  reporting,
  exportMode,
  monthName,
  wasteStreamData: propWasteStreamData,
}) => {
  const { setLoading } = useLoader()
  const [wasteStreamData, setWasteStreamData] = useState<any>([])
  const [clientsArr, setClientsArr] = useState<any>(jobSites)
  const [dataFetched, setDataFetched] = useState(false)

  const getWasteStreamData = async () => {
    try {
      let result
      if (exportMode && propWasteStreamData) {
        // Use data from props in export mode
        result = {
          data: { data: { jobSitesWasteStreams: propWasteStreamData } },
        }
      } else {
        !reporting && setLoading(true)
        result = await getClientWasteStreamGraph(jobsiteIds, startDate, endDate)
      }
      let tempClients = clientsArr
      const wasteStreams = result.data.data.jobSitesWasteStreams.reduce(
        (acc: any, { data, jobSiteId }: any) => {
          data.forEach(({ name, dumpster_weight, tons, moved }: any) => {
            const key = `${name}_${dumpster_weight}`
            if (!acc.some((obj: GRAPH_WASTE_STREAM) => obj.key === key)) {
              acc.push({
                key: `${name}_${dumpster_weight}`,
                dumpster_weight,
                name,
                tons,
                moved,
              })
            } else {
              acc = acc.map((wasteStream: GRAPH_WASTE_STREAM) => {
                if (wasteStream.key === key) {
                  return {
                    ...wasteStream,
                    moved: wasteStream.moved + moved,
                  }
                }
                return wasteStream
              })
            }
            tempClients = tempClients.map((client: GRAPH_CLIENT) => {
              if (client.id === Number(jobSiteId)) {
                return {
                  ...client,
                  [key]: (client[key] || 0) + (tons ?? 0),
                }
              }
              return client
            })
          })
          return acc
        },
        []
      )
      setWasteStreamData(wasteStreams)
      setClientsArr(tempClients)
      setDataFetched(true)
      !reporting && setLoading(false)
    } catch (err) {
      !reporting && setLoading(false)
    }
  }

  useEffect(() => {
    getWasteStreamData()
  }, [])

  return (
    <WasteStreamGraph
      clients={clientsArr}
      clientIds={jobsiteIds}
      wasteStreamData={wasteStreamData}
      reporting={reporting}
      exportMode={exportMode}
      dataFetched={dataFetched}
      monthName={monthName}
    />
  )
}
export default ClientWasteStreamGraph
