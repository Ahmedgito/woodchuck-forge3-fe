'use client'
import ModalComponent from '@/src/components/shared/modal'
import CreateJobSiteForm from '@/src/components/dashboard/create-job-site/components/create-job-site-form'
import Header from '../../jobSiteDetails/components/header'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { DATE_FORMAT } from '@/src/utils/constants/app-constants'

import './style.scss'
import { TREE_GRAPH_VALUES } from '@/src/utils/constants/initial-states'
import WasteStream from './components/wasteStream'
import DumpsterChartContainer from '../../jobSiteDetails/components/dumpsterChartContainer'
interface Props {
  isOpen: boolean
  clientId: number | undefined | null
  clientName: string | null | undefined
  setIsModalOpen: (_: boolean) => void
  onRefresh: () => void
  currentTab: string
}

const CreateJobSiteModal: React.FC<Props> = ({
  isOpen,
  clientId,
  clientName,
  setIsModalOpen,
  onRefresh,
  currentTab,
}) => {
  const defaultdate = dayjs().format(DATE_FORMAT.DATE_FORMAT_ISO)
  const [startDateFilter, setStartDateFilter] = useState<string | Date>(
    defaultdate
  )
  const [endDateFilter, setEndDateFilter] = useState<string>(defaultdate)
  const isDemo = process.env.NEXT_PUBLIC_ISDEMO === 'true'
  const emptyArray = useMemo(() => [], [])
  return (
    <ModalComponent
      isOpen={isOpen}
      width={1250}
      maskClosable={true}
      destroyOnClose={true}
      className="modal-lg my-5"
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      <Header
        jobDetails={{
          id: clientId,
          clientName: clientName,
          title: '',
          address: null,
          sustainabilityGoal: 0,
          name: '',
          phone: '',
          email: '',
          completionBy: new Date(),
          powerplants: '',
          size: 0,
          startDate: new Date(),
          //state: '',
        }}
        newJobsite={true}
        setStartDateFilter={setStartDateFilter}
        setEndDateFilter={setEndDateFilter}
        setPageRefresh={onRefresh}
        treeStats={TREE_GRAPH_VALUES}
        dumpsterStats={null}
      />

      {/* Detailed Stats */}

      {/* <WoodWasteDiversionChart data={treeStats} /> */}

      {/* {!isDemo && <ActiveDumpster newJobsite={true} />} */}
      {/* <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Outcome id={clientId} from={startDateFilter} to={endDateFilter} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <WasteDiversionRate
            id={clientId}
            from={startDateFilter}
            to={endDateFilter}
          />
        </Col>
      </Row> */}
      {/* <Divider /> */}
      {/* <Statistics id={clientId} from={startDateFilter} to={endDateFilter} /> */}

      <DumpsterChartContainer
        jobSiteDetailsData={{
          id: clientId,
          clientName: clientName,
          title: '',
          address: null,
          sustainabilityGoal: 0,
          name: '',
          phone: '',
          email: '',
          completionBy: new Date(),
          powerplants: '',
          size: 0,
          startDate: new Date(),
          //state: '',
        }}
        disabled={false}
        pageRefresh={false}
        setPageRefresh={() => {}}
        setImagesCount={() => {}}
        wasteStreamList={emptyArray}
        dumpsterOptions={emptyArray}
        readOnly={true}
      />

      <WasteStream
        dumpsterOptions={[]}
        wasteStreamList={[]}
        locationList={[]}
        jobSiteId={clientId}
        haulerList={[]}
        wasteStreamData={[]}
        setRefresh={onRefresh}
        isRefreshing={false}
        dumpsterList={[]}
        cameraData={[]}
        alertData={[]}
        readOnly={true}
      />

      <CreateJobSiteForm
        clientId={clientId}
        clientName={clientName}
        currentTab={currentTab}
        setIsModalOpen={setIsModalOpen}
        onRefresh={onRefresh}
      />
    </ModalComponent>
  )
}
export default CreateJobSiteModal
