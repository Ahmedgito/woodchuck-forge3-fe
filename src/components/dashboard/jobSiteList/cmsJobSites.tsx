'use client'

import { useEffect, useState } from 'react'
import { getCmsUsers } from '@/src/services/global'
import { ROLES } from '@/src/utils/constants/app-constants'
import { useLoader } from '@/src/utils/context/loader-context'
import { useImpersonation } from '@/src/utils/hooks/useImpersonation'
import EmptyData from '../../settings/empty-data'
import UserProfileViewer from '../../common/profile-details-viewer'
import CmsUserProfileModal from '../../profile/cms-user-profile-modal'
import { CmsUserType } from '@/src/utils/constants/types'

interface CmsJobSitesProps {
  userRole: string | null
  userId: number | null | undefined
}

export default function CmsJobSites({
  userRole,
  userId,
}: CmsJobSitesProps) {
  const { setLoading } = useLoader()
  const { startImpersonating } = useImpersonation()

  const [cmsUsers, setCmsUsers] = useState<CmsUserType[]>([])
  const [selectedCmsProfile, setSelectedCmsProfile] =
    useState<CmsUserType | null>(null)

  const handleStartImpersonation = async (targetUserId: number) => {
    // Only admins should trigger impersonation.
    if (userRole !== ROLES.ADMIN) return
    const result = await startImpersonating(targetUserId)
    if (!result.success) {
      console.error('Failed to start impersonation:', result.error)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchCmsUsers = async () => {
      try {
        setLoading(true)
        const result = await getCmsUsers()
        // API returns: { data: { data: CmsUserType[] } }
        const users = result?.data?.data ?? []
        if (isMounted) setCmsUsers(Array.isArray(users) ? users : [])
      } catch (err) {
        if (isMounted) setCmsUsers([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (userRole) fetchCmsUsers()

    return () => {
      isMounted = false
    }
  }, [setLoading, userRole, userId])

  return (
    <>
      {cmsUsers.map((cmsUser) => (
        <UserProfileViewer
          key={cmsUser.id}
          user={cmsUser}
          userRole={userRole ?? ''}
          setViewClientProfile={setSelectedCmsProfile}
          handleStartImpersonation={handleStartImpersonation}
        />
      ))}
      {cmsUsers.length === 0 && <EmptyData />}

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

