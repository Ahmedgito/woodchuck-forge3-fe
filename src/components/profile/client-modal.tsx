'use client'
import ModalComponent from '@/src/components/shared/modal'
import ClientProfile from './client-profile'
import { ROLES, ROLES_ENUM } from '@/src/utils/constants/app-constants'

interface Props {
  isOpen: boolean
  clientId: number | null | undefined
  setIsModalOpen: (value: boolean) => void
  userRole: string | number | null | undefined
  onRefresh?: () => void
}

const ViewClientProfileModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  clientId,
  userRole,
  onRefresh,
}) => {
  const canEdit =
    userRole === ROLES.ADMIN || userRole === ROLES_ENUM.ADMIN

  return (
    <ModalComponent
      isOpen={isOpen}
      width={1100}
      maskClosable={true}
      destroyOnClose={true}
      className="modal-lg"
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      <ClientProfile
        clientId={clientId}
        canEdit={canEdit}
        onRefresh={onRefresh}
      />
    </ModalComponent>
  )
}
export default ViewClientProfileModal
