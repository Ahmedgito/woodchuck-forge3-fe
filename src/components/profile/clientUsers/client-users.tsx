'use client'
import React, { useState, useEffect } from 'react'
import { Col, CollapseProps } from 'antd'
import CollapseTab from '@/src/components/common/collapse'
import CollapseTitle from '@/src/components/common/collapseTitle'
import SettingsModal from '@/src/components/settings/settings-modal'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { USER_TYPE } from '@/src/utils/constants/types'
import ClientList from './client-users-listing'
import ClientUserForm from './client-users-form'
import { deleteClientUsers, getClientSubUsers } from '@/src/services/global'
import { useSession } from 'next-auth/react'
export default function ClientUsers() {
  const [users, setUsers] = useState<USER_TYPE[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userId, setUserId] = useState<number>()
  const { data: session, status } = useSession()
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [responseData, setResponseData] = useState<{}>()
  useEffect(() => {
    if (
      status === 'authenticated' &&
      !session?.impersonated &&
      !session?.user?.isSubUser
    ) {
      const timeout = setTimeout(() => {
        getUserData()
      }, 150)
      return () => clearTimeout(timeout)
    }
  }, [status, session?.impersonated, session?.user?.isSubUser])
  const getUserData = async () => {
    try {
      setLoading(true)
      const result = await getClientSubUsers()
      setUsers(result.data.data.data)
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

  const deleteUser = async (id: number) => {
    try {
      setLoading(true)
      await deleteClientUsers(id)
      getUserData()
      setIsModalOpen(false)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.CLIENT_USER_SUCCESSFULLY_DELETED
      )
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <CollapseTitle
          title={'Users'}
          state={isModalOpen}
          setState={(open) => {
            if (open) setUserId(undefined) // Reset userId when opening create mode
            setIsModalOpen(open)
          }}
          buttonText={'Add a User'}
        />
      ),
      children: (
        <ClientList
          users={users}
          setIsModalOpen={setIsModalOpen}
          setUserId={setUserId}
          deleteUser={deleteUser}
        />
      ),
    },
  ]

  return (
    <>
      {/* Collapse Section */}
      <section className="users-profile mt-10">
        <Col>
          <CollapseTab className="collapse-primary" items={collapseItems} />
        </Col>
        {isModalOpen && (
          <SettingsModal
            isOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            width={800}
          >
            <ClientUserForm
              userId={userId}
              setIsModalOpen={setIsModalOpen}
              refetchUsers={getUserData}
              deleteUser={deleteUser}
            />
          </SettingsModal>
        )}
      </section>
    </>
  )
}
