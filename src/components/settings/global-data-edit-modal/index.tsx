'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Button, Input } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useEffect, useState } from 'react'

interface Props {
  name: string
  label: string
  isOpen: boolean
  defaultValue: string
  setIsModalOpen: (value: boolean) => void
  onChange: (name: string, value: string) => void
}

const GlobalDataEditModal: React.FC<Props> = ({
  name,
  label,
  defaultValue,
  isOpen,
  setIsModalOpen,
  onChange,
}) => {
  const [value, setValue] = useState<string>()
  const { TextArea } = Input

  useEffect(() => {
    setTimeout(() => {
      setValue(defaultValue)
    }, 0)
  }, [])

  return (
    <ModalComponent
      isOpen={isOpen}
      maskClosable={true}
      destroyOnClose={true}
      width={1000}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      <label>{label}</label>
      <TextArea
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        rows={15}
        cols={50}
        style={{ resize: 'none' }}
      />
      <Button className="mt-4" onClick={() => onChange(name, value as string)}>
        {MESSAGES.SAVE}
      </Button>
    </ModalComponent>
  )
}
export default GlobalDataEditModal
