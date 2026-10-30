'use client'

import { useEffect, useState } from 'react'
import { Row, Col, Typography } from 'antd'
import { useSession } from 'next-auth/react'
import { useUser } from '@/src/utils/context/user-context'
import { getCmsUsers } from '@/src/services/global'
import { CmsUserType } from '@/src/utils/constants/types'
import { MESSAGES, ROLES } from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useImpersonation } from '@/src/utils/hooks/useImpersonation'
import UserProfileViewer from '../../common/profile-details-viewer'
import CmsUserProfileModal from '../../profile/cms-user-profile-modal'

const { Title } = Typography

type Props = {
  userRole: string | null
}

export default function PowerPlantTab({ userRole }: Props) {
  const { data: session } = useSession()
  const { user } = useUser()
  const triggerNotification = useTriggerNotification()
  const { startImpersonating } = useImpersonation()

  const [cmsUserData, setCmsUserData] = useState<CmsUserType[]>([])
  const [selectedCmsProfile, setSelectedCmsProfile] =
    useState<CmsUserType | null>(null)

  useEffect(() => {
    const fetchCmsUsers = async () => {
      try {
        const result = await getCmsUsers()
        setCmsUserData(result.data.data)
      } catch (err) {
        triggerNotification('error', MESSAGES.ERROR, MESSAGES.SOMETHING_WENT_WRONG)
      }
    }

    // Only admins can see the CMS user listing
    if (userRole === ROLES.ADMIN) fetchCmsUsers()
    else setCmsUserData([])
  }, [userRole])

  const handleStartImpersonation = async (targetUserId: number) => {
    const result = await startImpersonating(targetUserId)
    if (!result.success) {
      console.error('Failed to start impersonation:', result.error)
    }
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title className="mb-0">Power Plant</Title>
        </Col>
      </Row>

      {/* CMS users block moved here from Dashboard Stats */}
      {user?.role.enum === ROLES.ADMIN &&
        cmsUserData.length > 0 &&
        cmsUserData?.map((cmsUser: CmsUserType) => (
          <UserProfileViewer
            key={cmsUser?.id}
            user={cmsUser}
            userRole={session?.user.role.enum}
            setViewClientProfile={setSelectedCmsProfile}
            handleStartImpersonation={handleStartImpersonation}
          />
        ))}
      {user?.role.enum === ROLES.CMS && (
        <UserProfileViewer
          user={user}
          userRole={session?.user.role.enum}
          setViewClientProfile={setSelectedCmsProfile}
        />
      )}

      {selectedCmsProfile && (
        <CmsUserProfileModal
          isOpen={!!selectedCmsProfile}
          setIsModalOpen={(open) => {
            if (!open) setSelectedCmsProfile(null)
          }}
          user={selectedCmsProfile}
        />
      )}
    </>
  )
}

