'use client'
import AdminProfile from './admin-profile'
import { useState, useEffect } from 'react'
import { ROLES } from '@/src/utils/constants/app-constants'
import { useSession } from 'next-auth/react'
import ClientUsers from './clientUsers/client-users'
import ClientInfoCard from './clientUsers/client-users-card'
import ClientExportApi from './clientUsers/client-users-api'

export default function EditProfile() {
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<string | null>('')
  const isSubUser = session?.user?.isSubUser

  useEffect(() => {
    if (status === 'authenticated') {
      setUserRole(session?.user.role.enum)
    }
  }, [status])

  return (
    <>
      {(userRole === ROLES.GENERAL_CONTRACTOR ||
        userRole === ROLES.END_CLIENT ||
        userRole === ROLES.MANUFACTURER ||
        userRole === ROLES.OFFTAKE ||
        userRole===ROLES.CMS) && (
        <>
          <section className="container white-area pt-5">
            {/* <ClientProfile clientId={session?.user.id} canEdit={false} /> */}
            <ClientInfoCard clientId={session?.user.id} canEdit={false} />
            {userRole!==ROLES.CMS && !isSubUser && !session?.impersonated &&  <ClientUsers />}
            {!isSubUser &&
              (userRole === ROLES.GENERAL_CONTRACTOR ||
                userRole === ROLES.MANUFACTURER ||
                userRole === ROLES.OFFTAKE) && <ClientExportApi />}
          </section>
        </>
      )}
      {userRole === ROLES.ADMIN && <AdminProfile />}
    </>
  )
}
