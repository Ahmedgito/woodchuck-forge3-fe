import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Typography } from 'antd'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { getClientProfile, getUser } from '@/src/services/user'
import { MESSAGES, ROLES } from '@/src/utils/constants/app-constants'
import ClientProfile from '../client-profile'
import SubUserForm from './sub-user-form'
import SettingsModal from '../../settings/settings-modal'
import { useSession } from 'next-auth/react'

export default function ClientInfoCard({
  clientId,
  canEdit,
}: {
  clientId: number | undefined | null
  canEdit: boolean
}) {
  const [user, setUser] = useState<any>()
  console.log("🚀 ~ ClientInfoCard ~ clientId:", user)
  const { data: session, status } = useSession()
  const isSubUser = session?.user?.isSubUser
  const isCmsUser=session?.user?.role.enum ===ROLES.CMS
  const { setLoading } = useLoader()
  const { Title } = Typography
  const triggerNotification = useTriggerNotification()
  const [clientModal, setClientModal] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const handleEdit = (id: number) => {
    setClientModal(true)
  }

  const refetchUserData = () => {
    setRefetchTrigger((prev) => prev + 1)
    getUserData()
  }
  const getUserData = async () => {
    try {
      setLoading(true)
      const result = await (canEdit ? getClientProfile(clientId) : getUser())
      setUser(result.data.data)
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
  useEffect(() => {
    getUserData()
  }, [])
  return (
    <>
      <Row>
        <Title className="mt-0">{MESSAGES.MY_ACCOUNT}</Title>
        <Col span={24}>
          <Title level={5} className="mb-0 mt-5">
            <span className="font-semibold txt-uppercase">{user?.name}</span>
          </Title>
          <Title level={5} className="mb-5 mt-1">
            <span className="font-bold txt-uppercase">{user?.company}</span>
          </Title>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mb-4">
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={24}
          className="field width-100"
        >
          <Card className="grey-bg">
            <div className="scroll-bar height-250" />
            <i
              className="icon-pencil edit-icon"
              onClick={() =>
                clientId != null ? handleEdit(clientId) : undefined
              }
            ></i>
            <div>
              <span className="font-bold txt-uppercase">
                {user?.billing_details_street}
              </span>
            </div>
            {(user?.billing_details_state ||
              user?.billing_details_zipcode ||
              user?.billing_details_country) && (
              <span className="font-medium">
                {[
                  user?.billing_details_state,
                  user?.billing_details_zipcode,
                  user?.billing_details_country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
            <div className="mb-4">
              <span className="font-medium">{user?.company}</span>
            </div>
            <div>
              <span className="font-medium">{user?.phone}</span>
            </div>
            <div>
              <span>
                <a className="font-bold" href={`mailto:${user?.email}`}>
                  {user?.email}
                </a>
              </span>
            </div>
          </Card>
        </Col>
      </Row>
      {clientModal && (
        <SettingsModal
          isOpen={clientModal}
          setIsModalOpen={setClientModal}
          className={isSubUser ? 'subuser-modal' : ''}
        >
          {isSubUser || isCmsUser ? (
            <SubUserForm />
          ) : (
            <ClientProfile clientId={clientId} canEdit={canEdit} />
          )}
        </SettingsModal>
      )}
    </>
  )
}
