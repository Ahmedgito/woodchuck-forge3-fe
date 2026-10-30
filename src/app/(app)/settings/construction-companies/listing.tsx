import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { USER_TYPE } from '@/src/utils/constants/types'
import SettingsModal from '@/src/components/settings/settings-modal'
import ConstructionCompaniesForm from './construction-companies-form'
import EmptyData from '@/src/components/settings/empty-data'

const { Link, Text } = Typography
interface Props {
  clients: USER_TYPE[]
  getClientData?: () => void
}
export default function ClientList({
  clients = [],
  getClientData = () => {},
}: Props) {
  const [clientModal, setClientModal] = useState(false)
  const [clientId, setClientId] = useState<number>()
  const handleEdit = (id: number) => {
    if (!id) return
    setClientId(id)
    setClientModal(true)
  }

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {clients.length === 0 && <EmptyData />}
          {clients.map((client: USER_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Text className="name">{client.name}</Text>
                  <Text>{client.company}</Text>
                  <Text>{client.phone}</Text>
                  <Link href={`mailto:${client.email}`}>{client.email}</Link>
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(client.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {clientModal && (
        <SettingsModal isOpen={clientModal} setIsModalOpen={setClientModal}>
          <ConstructionCompaniesForm
            setIsModalOpen={setClientModal}
            onRefresh={getClientData}
            id={clientId}
          />
        </SettingsModal>
      )}
    </>
  )
}
