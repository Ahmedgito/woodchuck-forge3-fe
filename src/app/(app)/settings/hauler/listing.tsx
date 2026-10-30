import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { HAULER_TYPE } from '@/src/utils/constants/types'
import SettingsModal from '@/src/components/settings/settings-modal'
import HaulerForm from './hauler-form'
import EmptyData from '@/src/components/settings/empty-data'
interface Props {
  haulerList: HAULER_TYPE[]
  getHaulerData?: () => void
}
export default function HaulerList({
  haulerList = [],
  getHaulerData = () => {},
}: Props) {
  const { Text } = Typography
  const [haulerModal, setHaulerModal] = useState(false)
  const [haulerId, setHaulerId] = useState<number | undefined>()

  const handleEdit = (id: number | undefined) => {
    if (!id) return
    setHaulerId(id)
    setHaulerModal(true)
  }
  const { Link } = Typography

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {haulerList.length === 0 && <EmptyData />}
          {haulerList.map((hauler: HAULER_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Text className="name">{hauler.name}</Text>
                  <Text>{hauler.phone}</Text>
                  <Link href={`mailto:${hauler.email}`}>{hauler.email}</Link>
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(hauler.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>

      {haulerModal && (
        <SettingsModal isOpen={haulerModal} setIsModalOpen={setHaulerModal}>
          <HaulerForm
            setIsModalOpen={setHaulerModal}
            onRefresh={getHaulerData}
            id={haulerId}
          />
        </SettingsModal>
      )}
    </>
  )
}
