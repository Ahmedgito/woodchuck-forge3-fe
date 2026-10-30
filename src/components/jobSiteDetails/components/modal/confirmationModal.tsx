'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Button, Typography } from 'antd'

interface Props {
  isOpen: boolean
  setIsModalOpen: (value: boolean) => void
  onConfirmation: () => void
  title: string
  closeButtonText: string
  keepButtonText: string
}

const { Title } = Typography

const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  onConfirmation,
  title,
  closeButtonText,
  keepButtonText,
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      maskClosable={true}
      destroyOnClose={true}
      className="modal-sm"
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      <section className="text-center">
        <Title level={1}> {title} </Title>
        <div className="form-section mt-10 flex justify-center gap-8">
          <Button
            className="mr-5 red"
            type="default"
            onClick={() => setIsModalOpen(false)}
          >
            {closeButtonText}
          </Button>
          <Button type="primary" onClick={onConfirmation}>
            {keepButtonText}
          </Button>
        </div>
      </section>
    </ModalComponent>
  )
}
export default ConfirmationModal
