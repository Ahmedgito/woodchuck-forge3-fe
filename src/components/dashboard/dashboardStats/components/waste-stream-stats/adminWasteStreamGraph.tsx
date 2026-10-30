'use client'

import { useLoader } from '@/src/utils/context/loader-context'
import { useEffect, useState } from 'react'
import { getAdminWasteStreamGraph } from '@/src/services/jobsite'
import { GRAPH_CLIENT, GRAPH_WASTE_STREAM } from '@/src/utils/constants/types'
import WasteStreamGraph from './wasteStreamGraph'

interface Props {
  clients: GRAPH_CLIENT[]
  clientIds: number[]
  startDate: string
  endDate: string
  reporting?: boolean
  exportMode?: boolean // <-- renamed from reporting
  monthName: string
  wasteStreamData?: any // <-- for export mode
}
interface DataItem {
  key: string
  dumpster_weight: string
  name: string
  tons: number | null
  moved: number
}
const AdminWasteStreamGraph: React.FC<Props> = ({
  clients,
  clientIds,
  startDate,
  endDate,
  reporting,
  exportMode,
  monthName,
  wasteStreamData: propWasteStreamData,
}) => {
  const { setLoading } = useLoader()
  const [wasteStreamData, setWasteStreamData] = useState<any>([])
  const [clientsArr, setClientsArr] = useState<any>(clients)
  const [totalMoved, setTotalMoved] = useState(0)
  const [dataFetched, setDataFetched] = useState(false)
  console.log('propWasteStreamData', propWasteStreamData)
  const getWasteStreamData = async () => {
    console.log('getting data')
    let result
    if (exportMode && propWasteStreamData) {
      // Use data from props in export mode
      result = { data: { data: { jobSitesWasteStreams: propWasteStreamData } } }
    } else {
      !reporting && setLoading(true)
      result = await getAdminWasteStreamGraph(clientIds, startDate, endDate)
    }

    console.log('setting data')
    let normalizedClients = [...clientsArr]
    const jobSitesWasteStreams = result?.data?.data?.jobSitesWasteStreams ?? []
    console.log('jobSitesWasteStreams', jobSitesWasteStreams)
    const wasteStreams = jobSitesWasteStreams.reduce(
      (acc: any, { data, clientId }: any) => {
        data?.forEach(({ name, dumpster_weight, tons, moved }: any) => {
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
                  moved: wasteStream.moved + (moved ?? 0),
                }
              }
              return wasteStream
            })
          }
          normalizedClients = normalizedClients.map((client: GRAPH_CLIENT) => {
            if (client.id === Number(clientId)) {
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
    console.log('wasteStreams 2', wasteStreams)
    setWasteStreamData(wasteStreams)
    setClientsArr(normalizedClients)
    const total = wasteStreams?.reduce(
      (sum: number, item: DataItem) => sum + (item.moved ?? 0),
      0
    )
    setTotalMoved(total)
    setDataFetched(true)
    if (!reporting) setLoading(false)
  }

  useEffect(() => {
    console.log('in effect')
    getWasteStreamData()
  }, [])

  return (
    <WasteStreamGraph
      clients={clientsArr}
      clientIds={clientIds}
      totalMoved={totalMoved}
      wasteStreamData={wasteStreamData}
      reporting={reporting}
      exportMode={exportMode}
      monthName={monthName}
      dataFetched={dataFetched}
      showTotalMoved
    />
  )
}

export default AdminWasteStreamGraph
