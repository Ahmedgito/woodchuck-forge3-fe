'use client'
import ModalComponent from '@/src/components/shared/modal'
import { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  children: ReactNode
  className?: string
  width?: number
  setIsModalOpen: (value: boolean) => void
}

const SettingsModal: React.FC<Props> = ({
  children,
  isOpen,
  className,
  width,
  setIsModalOpen,
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      width={width || 1100}
      maskClosable={true}
      destroyOnClose={true}
      className={className || 'modal-lg'}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      {children}
    </ModalComponent>
  )
}
export default SettingsModal
