import { Input, Typography } from 'antd'
import styles from './styles.module.scss'
import { useEffect, useState, useRef } from 'react'
import {
  DROP_DOWN_OPTIONS,
  DUMPSTER_GRAPH_TYPE,
  DUMPSTER_OPTIONS,
  DUMPSTER_TRANSFORMED_OPTIONS,
  JobSitesWasteStreamsEntity,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import ConfirmationModal from '@/src/components/jobSiteDetails/components/modal/closeJobSiteModal'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { deleteDumpster } from '@/src/services/global'
import { fetchDumpsterStats } from '@/src/components/jobSiteDetails/jobSiteDataFetchers'
import EmptyData from '@/src/components/settings/empty-data'
import MonthWiseGraph from './monthWiseGraph'
import {
  calculateMonthWiseCumulativeState,
  reduceDumpsterTypeWise,
  reduceWasteStreamWise,
} from '@/src/utils/functions/mapReducers'
import { Accumulator } from '@/src/utils/constants/types'

const DumpsterInput: React.FC<{
  dumpster: JobSitesWasteStreamsEntity
  setTotalMoved: (value: number) => void
  handleMovedBlur: (id: number, moved: number) => void
  [key: string]: any
}> = ({ dumpster, setTotalMoved, handleMovedBlur, ...props }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onChange = () => {
    if (!isSubmitting) {
      setIsSubmitting(true)
      handleMovedBlur(dumpster.id, dumpster.moved)
      setTimeout(() => setIsSubmitting(false), 500) // Adjust timeout as needed
    }
  }

  return (
    <Input
      {...props}
      type="number"
      className={styles.block_input}
      onChange={(e) => setTotalMoved(parseInt(e.target.value))}
      onBlur={onChange}
      onKeyDown={(e) => {
        if (e.key === '.') {
          e.preventDefault()
        }
        if (e.key === 'Enter' && !isSubmitting) {
          onChange()
        }
      }}
      disabled={isSubmitting} // Optional: disable input during submission
    />
  )
}

const DumspterChart = ({
  jobsiteId,
  startDate,
  endDate,
  disabled,
  refresh,
  setRefresh,
  setImages = () => {},
  reporting,
  monthName,
  vesselType,
  wasteStreamId,
  dumpsterOptions,
  wasteStreamList,
  setVesselTypeDropDownOptions,
  setWasteStreamDropDownOptions,
  readOnly = false,
  dumpsterData,
  isExport = false,
  isAdmin,
  isActive,
}: {
  jobsiteId: any
  startDate: any
  endDate: any
  disabled?: boolean
  refresh?: boolean
  reporting?: boolean
  monthName?: string
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  setImages?: React.Dispatch<React.SetStateAction<any>>
  vesselType: string | null
  wasteStreamId: string | null
  dumpsterOptions: DUMPSTER_OPTIONS
  wasteStreamList: WASTE_TYPE[]
  setVesselTypeDropDownOptions: React.Dispatch<
    React.SetStateAction<DROP_DOWN_OPTIONS>
  >
  setWasteStreamDropDownOptions: React.Dispatch<
    React.SetStateAction<DUMPSTER_TRANSFORMED_OPTIONS[]>
  >
  readOnly?: boolean
  dumpsterData?: DUMPSTER_GRAPH_TYPE
  isExport?: boolean
  isAdmin?: boolean
  isActive?: boolean
}) => {
  const { Title, Text } = Typography
  const [editId, setEditId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<number | null>()
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const [deleteDumpsterId, setDeleteDumpsterId] = useState<number>()
  const [totalMoved, setTotalMoved] = useState<number>(0)
  const [totalMovedInputBox, setTotalMovedInputBox] = useState<number>(0)
  const [dumpsterStats, setDumpsterStats] = useState<DUMPSTER_GRAPH_TYPE>(
    dumpsterData as DUMPSTER_GRAPH_TYPE
  )
  const [data, setData] = useState<Accumulator[]>([])
  const [dumpsterTypes, setDumpsterTypes] = useState<string[]>([])
  const [report, setReport] = useState<boolean>(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const { loading, setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)
  const [dataFetched, setDataFetched] = useState(false)
  const [overallVessels, setOverallVessels] = useState<number>(0)
  const [overallWeight, setOverallWeight] = useState<number>(0)
  const [overallCarbonCredits, setOverallCarbonCredits] = useState<number>(0)
  const [overallRecycles, setOverallRecycles] = useState<number>(0)
  const [totalWeightDiverted, setTotalWeightDiverted] = useState<number>(0)

  useEffect(() => {
    if (dumpsterData) {
      setDumpsterStats(dumpsterData)
      return
    }
    if (startDate && endDate && !readOnly) {
      fetchDumpsterStats({
        setState: setDumpsterStats,
        setLoading: setLoading,
        triggerNotification: trigger,
        startDate: startDate,
        endDate: endDate,
        id: jobsiteId,
        reporting: reporting,
      })
    }
  }, [startDate, endDate, jobsiteId])

  useEffect(() => {
    if (dumpsterData) {
      setDumpsterStats(dumpsterData)
      return
    }
    if (refresh) {
      if (startDate && endDate && !readOnly) {
        fetchDumpsterStats({
          setState: setDumpsterStats,
          setLoading: setLoading,
          triggerNotification: trigger,
          startDate: startDate,
          endDate: endDate,
          id: jobsiteId,
          reporting: reporting,
        })
      }
    }
  }, [refresh])

  useEffect(() => {
    if (dumpsterStats) {
      const newData = reduceDumpsterTypeWise(dumpsterStats.jobSitesWasteStreams)
      const data = reduceWasteStreamWise(
        Object.fromEntries(
          Object.entries(newData).filter(
            ([key]) => key === vesselType || !vesselType
          ) // Filter by vesselType if provided
        ),
        wasteStreamId
      )
      setData(data)
      setDumpsterTypes(Object.keys(newData))
      setDataFetched(true)
    }
  }, [dumpsterStats, totalMoved, editValue, vesselType, wasteStreamId])

  useEffect(() => {
    setOverallVessels(0)
    setOverallWeight(0)
    setOverallCarbonCredits(0)
    setOverallRecycles(0)
    setTotalWeightDiverted(0)
    Object.entries(data).forEach(([key, value]) => {
      Object.entries(value).forEach(([key, value]) => {
        Object.entries(value).forEach(([key, value]) => {
          const {
            totalVessels,
            totalWeight,
            totalCarbonCredits,
            totalRecycles,
            totalWeightDiverted,
          } = calculateMonthWiseCumulativeState(value)
          setOverallVessels((prev: number) => prev + totalVessels)
          setOverallWeight((prev: number) => prev + totalWeight)
          setOverallCarbonCredits((prev: number) => prev + totalCarbonCredits)
          setOverallRecycles((prev: number) => prev + totalRecycles)
          setTotalWeightDiverted((prev: number) => prev + totalWeightDiverted)
        })
      })
    })
  }, [data, dumpsterTypes])

  const onExport = async () => {
    try {
      if (imageRef.current === null) {
        return
      }

      // const width =
      //   Object.keys(data).reduce((total, key) => {
      //     return total + 150 + data[key].length * 110
      //   }, 0) +
      //   340 +
      //   400 // waste streams + gap between dumpster types + total stats

      // const dataUrl = await createImage({ ref: imageRef, width })
      // setImages((prevImages: any) => [...prevImages, { monthName, dataUrl }])
      setReport(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  useEffect(() => {
    if (
      reporting &&
      dataFetched &&
      imageRef.current &&
      !isExport &&
      // dumpsterTypes.length > 0 &&
      !report
    ) {
      setLoading(true)
      setReport(true)
      onExport()
    }
  }, [dataFetched, dumpsterTypes])

  const handleDeleteDumpster = async () => {
    try {
      setLoading(true)
      await deleteDumpster(deleteDumpsterId)
      triggerNotification('success', MESSAGES.SUCCESS, MESSAGES.DUMPSTER_DELETE)
      fetchDumpsterStats({
        setState: setDumpsterStats,
        setLoading: setLoading,
        triggerNotification: trigger,
        startDate: startDate,
        endDate: endDate,
        id: jobsiteId,
        reporting: reporting,
      })
      setLoading(false)
      setConfirmationModal(false)
      setRefresh?.(true)
    } catch (err) {
      setLoading(false)
      setConfirmationModal(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  return (
    <>
      <ConfirmationModal
        isOpen={confirmationModal}
        setIsModalOpen={setConfirmationModal}
        onConfirmation={handleDeleteDumpster}
        closeButtonText={'CONFIRM'}
        keepButtonText={'CANCEL'}
        title="ARE YOU SURE YOU WANT TO DELETE THIS WASTE STREAM DUMPSTER"
      />

      {dumpsterTypes.length === 0 ? (
        <section className={styles.dumpster_chart_wrapper} ref={imageRef}>
          {<EmptyData message={MESSAGES.NO_WASTE_STREAMS_ADDED} />}
        </section>
      ) : (
        <MonthWiseGraph
          data={data}
          setRefresh={setRefresh}
          dumpsterStats={dumpsterStats as DUMPSTER_GRAPH_TYPE}
          endDate={endDate}
          wasteStreamId={wasteStreamId}
          vesselType={vesselType}
          overallVessels={overallVessels}
          overallWeight={overallWeight}
          overallCarbonCredits={overallCarbonCredits}
          overallRecycles={overallRecycles}
          totalWeightDiverted={totalWeightDiverted}
          disabled={disabled}
          readOnly={readOnly}
          reporting={reporting}
          showReportImages={false}
          isAdmin={isAdmin}
          isActive={isActive}
        />
      )}
    </>
  )
}
export default DumspterChart
