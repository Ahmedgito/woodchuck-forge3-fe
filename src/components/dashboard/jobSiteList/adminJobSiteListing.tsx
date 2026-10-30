'use client'

import { JOB_SITE_TYPE } from '@/src/utils/constants/types'
import { useEffect, useState, useCallback } from 'react'
import { Badge, Button, Col, Row, Typography, Divider } from 'antd'
import { getJobSites } from '@/src/services/jobsite'
import { getCarbonCreditByJobSite } from '@/src/services/global'
import { useImpersonation } from '@/src/utils/hooks/useImpersonation'
import {
  JOB_SITE_STATUS,
  MESSAGES,
  ROLES,
} from '@/src/utils/constants/app-constants'
import JobSiteCard from './jobSiteCard'
import ViewClientProfileModal from '../../profile/client-modal'
import { useLoader } from '@/src/utils/context/loader-context'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'
import UserProfileViewer from '../../common/profile-details-viewer'

interface Props {
  index: number
  client: any
  setClientId: (_: number) => void
  setClientName: (_: string) => void
  setCreateJobSite: (_: boolean) => void
  clientUpdated: number | null | undefined
  userRole?: string | null
  userId?: number | null
  onRefresh: () => void
}

const AdminJobSiteListing: React.FC<Props> = ({
  index,
  client,
  setClientId,
  setClientName,
  setCreateJobSite,
  clientUpdated,
  userRole,
  userId,
  onRefresh,
}) => {
  const { Title, Text } = Typography
  const [jobSites, setJobSites] = useState<JOB_SITE_TYPE[]>([])
  const [activeJobSites, setActiveJobSites] = useState<JOB_SITE_TYPE[]>([])
  const [inactiveJobSites, setInactiveJobSites] = useState<JOB_SITE_TYPE[]>([])
  const [showActive, setActive] = useState(true)
  const [viewClientProfile, setViewClientProfile] = useState(false)
  const { setLoading } = useLoader()
  const { startImpersonating } = useImpersonation()

  const attachCarbonCredits = async (sites: JOB_SITE_TYPE[]) => {
    const creditResults = await Promise.allSettled(
      sites.map((site) => getCarbonCreditByJobSite(site.id))
    )

    return sites.map((site, index) => {
      const creditResult = creditResults[index]
      if (creditResult.status !== 'fulfilled') {
        return { ...site, carbonCredit: null }
      }

      return {
        ...site,
        carbonCredit: creditResult.value?.data?.data ?? null,
      }
    })
  }

  const handleStartImpersonation = async (targetUserId: number) => {
    const result = await startImpersonating(targetUserId)
    if (!result.success) {
      console.error('Failed to start impersonation:', result.error)
    }
  }

  const getClientJobSites = useCallback(
    async (clientId: number) => {
      try {
        setLoading(true)
        let result = await getJobSites(
          clientId,
          userRole === ROLES.END_CLIENT ? userId : null
        )
        const sites: JOB_SITE_TYPE[] = result.data.data.data || []
        const sitesWithCarbonCredit = await attachCarbonCredits(sites)
        setJobSites(sitesWithCarbonCredit)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        // alert('Error fetching Job Site Data' + err)
      }
    },
    [setLoading, userRole, userId]
  )
  useEffect(() => {
    setJobSites([])
    setActiveJobSites([])
    setInactiveJobSites([])
    getClientJobSites(client.id)
  }, [client, getClientJobSites])
  useEffect(() => {
    if (client.id === clientUpdated) {
      getClientJobSites(client.id)
    }
  }, [clientUpdated, client.id, getClientJobSites])

  useEffect(() => {
    if (jobSites?.length > 0) {
      const categorizedJobSites = jobSites?.reduce(
        (
          acc: {
            activeJobSites: JOB_SITE_TYPE[]
            inactiveJobSites: JOB_SITE_TYPE[]
          },
          jobSite: JOB_SITE_TYPE
        ) => {
          if (jobSite.status?.name === JOB_SITE_STATUS.ACTIVE) {
            acc.activeJobSites.push(jobSite)
          } else {
            acc.inactiveJobSites.push(jobSite)
          }
          return acc
        },
        { activeJobSites: [], inactiveJobSites: [] }
      )
      setActiveJobSites(categorizedJobSites?.activeJobSites)
      setInactiveJobSites(categorizedJobSites?.inactiveJobSites)
    }
  }, [jobSites])

  return (
    <>
      {userRole === ROLES.CMS ? (
        <UserProfileViewer
          user={client}
          userRole={userRole ?? ''}
          setViewClientProfile={() => setViewClientProfile(true)}
          handleStartImpersonation={handleStartImpersonation}
        />
      ) : (
        <Row gutter={[24, 16]} align={'middle'} className="mt-8 filters">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title
              onClick={() => setViewClientProfile(true)}
              level={3}
              key={index}
            >
              <GenieButtonWrapper hint="display_name" className='display-name-title'>
                <a>{client.name}</a>
              </GenieButtonWrapper>
              <i className="icon-user"></i>
              <Text>{client?.company}</Text>
            </Title>
          </Col>
        </Row>
      )}
      <Row
        gutter={[16, 0]}
        align="middle"
        style={{ marginBottom: '12px' }}
        className="filters mt-4"
      >
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className="flex items-center gap-4 company-username-title">
            <GenieButtonWrapper hint="company_username">
              <Text>{client.username && `@${client.username}`}</Text>
            </GenieButtonWrapper>
            {userRole === ROLES.ADMIN && (
              <Button
                className="mt-0 client-impersonate-button"
                type="text"
                onClick={() => handleStartImpersonation(client.id)}
              >
                Enter Client View
              </Button>
            )}
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className="flex justify-end gap-5"
        >
          <Button
            onClick={() => setActive(true)}
            className={showActive ? ' active secondary' : 'secondary'}
            type="text"
          >
            {MESSAGES.ACTIVE_JOB_SITES}
            <Badge count={activeJobSites.length || 0} showZero />
          </Button>
          <GenieButtonWrapper hint="jobsites_selector_button">
            <> </>
          </GenieButtonWrapper>
          <Button
            onClick={() => setActive(false)}
            className={!showActive ? ' active secondary' : 'secondary'}
            type="text"
            disabled={!inactiveJobSites.length}
          >
            {MESSAGES.INACTIVE_JOB_SITES}
            <Badge count={inactiveJobSites.length || 0} showZero />
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-5">
        {(showActive ? activeJobSites : inactiveJobSites).map(
          (jobSite: JOB_SITE_TYPE, index: number) => (
            <JobSiteCard key={index} jobSite={jobSite} />
          )
        )}
        {showActive && userRole === ROLES.ADMIN && (
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={6}
            className="card-size-button"
          >
            <GenieButtonWrapper hint="jobsite_widget">
              <></>
            </GenieButtonWrapper>
            
            <Button
              className={`icon-button card-size ${activeJobSites.length === 0 ? 'no-data-jobsite-card' : ''}`}
              onClick={() => {
                setClientId(client.id)
                setClientName(client.name)
                setCreateJobSite(true)
              }}
            >
              <i className="icon-plus mb-4"></i>
              <Title level={3}>{MESSAGES.ADD_SITE}</Title>
            </Button>

          </Col>
        )}      
        <Divider className="mt-10" />
      </Row>
      {viewClientProfile && (
        <ViewClientProfileModal
          isOpen={viewClientProfile}
          clientId={client.id}
          setIsModalOpen={setViewClientProfile}
          userRole={userRole}
          onRefresh={onRefresh}
        />
      )}
    </>
  )
}

export default AdminJobSiteListing
