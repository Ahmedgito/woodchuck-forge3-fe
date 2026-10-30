'use client'
import ModalComponent from '@/src/components/shared/modal'
import DumpsterLocationForm from '../dumpsterLocationForm'
import { DUMPSTER_LOCATION_TYPE } from '@/src/utils/constants/types'

interface Props {
  isOpen: boolean
  dumpsterLocation: DUMPSTER_LOCATION_TYPE | undefined
  jobSiteId: number | null | undefined
  setIsModalOpen: (value: boolean) => void
  onRefresh: (value: number | null | undefined) => void
  jobsiteTitle: string
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateOrEditDumpsterLocationModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  dumpsterLocation,
  onRefresh,
  jobSiteId,
  jobsiteTitle,
  setRefresh,
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      width={1100}
      maskClosable={true}
      destroyOnClose={true}
      className="modal-xl"
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      <DumpsterLocationForm
        dumpsterLocation={dumpsterLocation}
        jobSiteId={jobSiteId}
        setIsModalOpen={setIsModalOpen}
        onRefresh={onRefresh}
        jobsiteTitle={jobsiteTitle}
        setRefresh={setRefresh}
      />
    </ModalComponent>
  )
}
export default CreateOrEditDumpsterLocationModal
