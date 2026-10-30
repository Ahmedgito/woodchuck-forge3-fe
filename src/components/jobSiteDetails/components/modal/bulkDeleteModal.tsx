import React from 'react'
import { Button, Row, Typography } from 'antd'
import SettingsModal from '@/src/components/settings/settings-modal'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import SecondaryButton from '@/src/components/common/secondaryButton'

type DeleteVesselModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

const DeleteVesselModal: React.FC<DeleteVesselModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <SettingsModal isOpen={isOpen} setIsModalOpen={onClose} width={870}>
      <div className="bulk-delete-modal">
        <Typography.Text className="font-inter">
          {MESSAGES.DELETE_VESSELS_MODAL_TITLE}
        </Typography.Text>

        <Row justify="end" gutter={20} className="gap-10">
          <Button onClick={onClose}>{MESSAGES.NO}</Button>
          <SecondaryButton type="default" loading={loading} onClick={onConfirm}>
            {MESSAGES.YES}
          </SecondaryButton>
        </Row>
      </div>
    </SettingsModal>
  )
}

export default DeleteVesselModal
