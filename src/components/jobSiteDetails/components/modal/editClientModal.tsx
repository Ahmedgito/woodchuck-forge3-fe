'use client'
import ModalComponent from '@/src/components/shared/modal'
import EndClientForm from '@/src/app/(app)/settings/end-client/end-client-form'

interface Props {
  isOpen: boolean
  setIsModalOpen: (value: boolean) => void
  onRefresh: () => void
}

const AddEndClientModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  onRefresh,
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
      <EndClientForm
        setIsModalOpen={setIsModalOpen}
        onRefresh={onRefresh}
        id={null}
      />
    </ModalComponent>
  )
}
export default AddEndClientModal
