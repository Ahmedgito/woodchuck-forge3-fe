import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { USER_TYPE } from '@/src/utils/constants/types'
import SettingsModal from '@/src/components/settings/settings-modal'
import EndClientForm from './end-client-form'
import EmptyData from '@/src/components/settings/empty-data'

const { Link, Text } = Typography
interface Props {
  endClients: USER_TYPE[]
  getEndClientData?: () => void
}
export default function EndClientList({
  endClients = [],
  getEndClientData = () => {},
}: Props) {
  const [endClientModal, setEndClientModal] = useState(false)
  const [endClientId, setEndClientId] = useState<number>()
  const handleEdit = (id: number) => {
    if (!id) return
    setEndClientId(id)
    setEndClientModal(true)
  }

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {endClients.length === 0 && <EmptyData />}
          {endClients.map((endClient: USER_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Text className="name">{endClient.name}</Text>
                  <Text>{endClient.company}</Text>
                  <Text>{endClient.phone}</Text>
                  <Link href={`mailto:${endClient.email}`}>
                    {endClient.email}
                  </Link>
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(endClient.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {endClientModal && (
        <SettingsModal
          isOpen={endClientModal}
          setIsModalOpen={setEndClientModal}
        >
          <EndClientForm
            setIsModalOpen={setEndClientModal}
            onRefresh={getEndClientData}
            id={endClientId}
          />
        </SettingsModal>
      )}
    </>
  )
}
