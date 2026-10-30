'use client'
import ModalComponent from '@/src/components/shared/modal'
import CmsUserProfile from '@/src/components/profile/cms-user-profile'
import React from 'react'

interface Props {
  isOpen: boolean
  setIsModalOpen: (value: boolean) => void
  onRefresh?: () => void
  user: { id: number; email: string; name?: string }
}

const CmsUserProfileModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  onRefresh,
  user,
}) => {
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
      <CmsUserProfile user={user} onRefresh={onRefresh} />
    </ModalComponent>
  )
}

export default CmsUserProfileModal
