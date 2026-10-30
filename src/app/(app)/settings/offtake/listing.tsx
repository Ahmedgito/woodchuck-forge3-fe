import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { USER_TYPE } from '@/src/utils/constants/types'
import SettingsModal from '@/src/components/settings/settings-modal'
import OfftakeForm from './offtake-form'
import EmptyData from '@/src/components/settings/empty-data'

const { Link, Text } = Typography
interface Props {
  offtake: USER_TYPE[]
  getOfftakeData?: () => void
}
export default function OfftakeList({
  offtake = [],
  getOfftakeData = () => {},
}: Props) {
  const [offtakeModal, setOfftakeModal] = useState(false)
  const [offtakeId, setOfftakeId] = useState<number>()
  const handleEdit = (id: number) => {
    if (!id) return
    setOfftakeId(id)
    setOfftakeModal(true)
  }

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {offtake.length === 0 && <EmptyData />}
          {offtake.map((item: USER_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Text className="name">{item.name}</Text>
                  <Text>{item.company}</Text>
                  <Text>{item.phone}</Text>
                  <Link href={`mailto:${item.email}`}>
                    {item.email}
                  </Link>
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(item.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {offtakeModal && (
        <SettingsModal
          isOpen={offtakeModal}
          setIsModalOpen={setOfftakeModal}
        >
          <OfftakeForm
            setIsModalOpen={setOfftakeModal}
            onRefresh={getOfftakeData}
            id={offtakeId}
          />
        </SettingsModal>
      )}
    </>
  )
}
