import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { USER_TYPE } from '@/src/utils/constants/types'
import SettingsModal from '@/src/components/settings/settings-modal'
import ManufacturerForm from './manufacturer-form'
import EmptyData from '@/src/components/settings/empty-data'

const { Link, Text } = Typography
interface Props {
  manufacturer: USER_TYPE[]
  getManufacturerData?: () => void
}
export default function ManufacturerList({
  manufacturer = [],
  getManufacturerData = () => {},
}: Props) {
  const [manufacturerModal, setManufacturerModal] = useState(false)
  const [endClientId, setManufacturerId] = useState<number>()
  const handleEdit = (id: number) => {
    if (!id) return
    setManufacturerId(id)
    setManufacturerModal(true)
  }

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {manufacturer.length === 0 && <EmptyData />}
          {manufacturer.map((manufacturer: USER_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Text className="name">{manufacturer.name}</Text>
                  <Text>{manufacturer.company}</Text>
                  <Text>{manufacturer.phone}</Text>
                  <Link href={`mailto:${manufacturer.email}`}>
                    {manufacturer.email}
                  </Link>
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(manufacturer.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {manufacturerModal && (
        <SettingsModal
          isOpen={manufacturerModal}
          setIsModalOpen={setManufacturerModal}
        >
          <ManufacturerForm
            setIsModalOpen={setManufacturerModal}
            onRefresh={getManufacturerData}
            id={endClientId}
          />
        </SettingsModal>
      )}
    </>
  )
}
