'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Button, Input, Row, Col } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useState } from 'react'
import { updateDumpsterRefused } from '@/src/services/jobsite'
import { useLoader } from '@/src/utils/context/loader-context'

interface Props {
  dumpsterSize: number
  dumpsterLocationId: number | null | undefined
  jobsiteId: number | null | undefined
  isOpen: boolean
  defaultValue: number
  setIsModalOpen: (_value: boolean) => void
  onChange: () => void
}

const DumpsterRefusedEditModal: React.FC<Props> = ({
  dumpsterSize,
  dumpsterLocationId,
  jobsiteId,
  defaultValue,
  isOpen,
  setIsModalOpen,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  const handleSave = async () => {
    try {
      setLoading(true)
      await updateDumpsterRefused(
        jobsiteId,
        dumpsterLocationId,
        value,
        dumpsterSize
      )
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.DUMPSTERS_UPDATED_SUCCESS
      )
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    setValue(newValue)
  }
  return (
    <ModalComponent
      isOpen={isOpen}
      maskClosable={true}
      destroyOnClose={true}
      width={350}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
    >
      <Row gutter={24} className="mt-8" align={'middle'}>
        <Col span={8}>
          <Input
            min={0}
            type="number"
            value={value}
            onChange={handleInputChange}
          />
        </Col>
        <Col span={16}>
          <label>
            x {dumpsterSize} {MESSAGES.YARDS}
          </label>
        </Col>
      </Row>

      <Button
        className="mt-4"
        onClick={() => {
          handleSave(), onChange()
        }}
      >
        {MESSAGES.SAVE}
      </Button>
    </ModalComponent>
  )
}
export default DumpsterRefusedEditModal
