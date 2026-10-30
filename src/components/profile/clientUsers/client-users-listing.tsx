import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { USER_TYPE } from '@/src/utils/constants/types'
const { Text, Link } = Typography

interface Props {
  users: any
  setIsModalOpen: (isOpen: boolean) => void
  setUserId?: (id: number) => void
  deleteUser: (id: number) => void
  hideIcons?: boolean
}

export default function ClientList({
  users = [],
  setIsModalOpen,
  setUserId,
  deleteUser,
  hideIcons = false,
}: Props) {
  const handleEdit = (id: number) => {
    if (!id) return
    setUserId?.(id)
    setIsModalOpen(true)
  }
  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {users?.map((client: USER_TYPE, index: number) => (
            <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
              <Card className="grey-bg user-listing-card">
                <Text className="name">{client.username}</Text>
                <Link href={`mailto:${client.email}`}>{client.email}</Link>
                {!hideIcons && (
                  <>
                    <i
                      className="icon-pencil edit-icon"
                      onClick={() => handleEdit(client.id)}
                    ></i>
                    <DeleteOutlined
                      className="delete-icon"
                      onClick={() => deleteUser(client?.id)}
                    />
                  </>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  )
}
