'use client'
import SecondaryButton from '@/src/components/common/secondaryButton'
import ModalComponent from '@/src/components/shared/modal'
import { Button, Typography } from 'antd'

interface Props {
  isOpen: boolean
  setIsModalOpen: (value: boolean) => void
  onConfirmation: () => void
  title: string
  closeButtonText: string
  keepButtonText: string
  cssClass?: string
}

const { Title } = Typography

const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  onConfirmation,
  title,
  closeButtonText,
  keepButtonText,
  cssClass,
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      maskClosable={true}
      destroyOnClose={true}
      className={cssClass}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
      width={800}
    >
      <section className="text-center">
        <Title level={3} className="px-5">
          {title.split('\n').map((line, index) => (
            <span key={`${line}-${index}`}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </Title>
        <div className="form-section mt-10 flex justify-center gap-8">
          <Button type="default" onClick={() => setIsModalOpen(false)}>
            {keepButtonText}
          </Button>
          <SecondaryButton type="default" onClick={onConfirmation}>
            {closeButtonText}
          </SecondaryButton>
        </div>
      </section>
    </ModalComponent>
  )
}
export default ConfirmationModal
