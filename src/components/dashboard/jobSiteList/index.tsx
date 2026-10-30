'use client'
import './style.scss'
import { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { ROLES } from '@/src/utils/constants/app-constants'
import { useSession } from 'next-auth/react'
import ClientJobSites from './clientJobSites'
import AdminJobSites from './adminJobSites'
import ManufacturerJobSites from './manufacturerJobSites'
import OfftakeJobSites from './offtakeJobSites'
import PowerPlantTab from './powerPlantTab'
import { useGenie } from '@/src/utils/context/genie-mode-context'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'

const { TabPane } = Tabs

const adminRoles = [ROLES.ADMIN, ROLES.END_CLIENT]
const clientRoles = [ROLES.GENERAL_CONTRACTOR, ROLES.MANUFACTURER, ROLES.OFFTAKE]

export default function JobSiteList() {
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<string | null>('')
  const [client, setClient] = useState<any>([])
  const { genie } = useGenie()

  useEffect(() => {
    if (status === 'authenticated') {
      setUserRole(session?.user.role.enum)
      setClient(session?.user)
    }
  }, [status, session?.user.id])

  return (
    <>
      <section className="container chart-cards">
        {userRole === ROLES.END_CLIENT ? (
          <AdminJobSites 
            key={session?.user?.id}
            userRole={userRole} 
            userId={session?.user.id} 
          />
        ) : adminRoles.includes(userRole ?? '') ? (
          <Tabs defaultActiveKey={userRole === ROLES.CMS ? '3' : '1'}>
            <TabPane
              key="1"
              tab={
                <GenieButtonWrapper hint="company_tabs">
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    Construction Companies
                  </span>
                </GenieButtonWrapper>
              }
            >
              <AdminJobSites 
                key={session?.user?.id}
                userRole={userRole} 
                userId={session?.user.id}
              />
            </TabPane>
            <TabPane key="2" tab={'Manufacturers'}>
              <ManufacturerJobSites
                key={session?.user?.id}
                userRole={userRole}
                userId={session?.user.id}
              />
            </TabPane>
            <TabPane key="3" tab={'Wood Processing'}>
              <OfftakeJobSites userRole={userRole} userId={session?.user.id} />
            </TabPane>
            <TabPane key="4" tab={'Power Plant'}>
              <PowerPlantTab userRole={userRole} />
            </TabPane>
          </Tabs>
        ) : (
          clientRoles.includes(userRole ?? '') && (
            <ClientJobSites 
              key={session?.user?.id}
              client={client} 
            />
          )
        )}
      </section>
    </>
  )
}
