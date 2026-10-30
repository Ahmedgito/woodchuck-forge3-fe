'use client'

import { JOB_SITE_TYPE } from '@/src/utils/constants/types'
import { useEffect, useState } from 'react'
import { getCarbonCreditByJobSite } from '@/src/services/global'
import { getClientJobSites } from '@/src/services/jobsite'
import JobSiteCard from './jobSiteCard'
import { Badge, Row, Typography } from 'antd'
import { JOB_SITE_STATUS, MESSAGES } from '@/src/utils/constants/app-constants'
import { useLoader } from '@/src/utils/context/loader-context'

const { Title } = Typography

interface Props {
  client: any
}

const ClientJobSites: React.FC<Props> = ({ client }) => {
  const [jobSites, setJobSites] = useState<{ data: JOB_SITE_TYPE[] } | null>(
    null
  )
  const { setLoading } = useLoader()
  const [activeJobSites, setActiveJobSites] = useState<JOB_SITE_TYPE[]>([])
  const [inactiveJobSites, setInactiveJobSites] = useState<JOB_SITE_TYPE[]>([])
  const [showInActive, setShowInActive] = useState(false)

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

  const getClientJobSitesListing = async () => {
    try {
      setLoading(true)
      const result = await getClientJobSites()
      const sites: JOB_SITE_TYPE[] = result?.data?.data?.data || []
      const sitesWithCarbonCredits = await attachCarbonCredits(sites)
      setJobSites({ data: sitesWithCarbonCredits })
    } catch (err) {
      //   alert('Error fetching Job Site Data' + err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getClientJobSitesListing()
  }, [client])

  useEffect(() => {
    if (jobSites) {
      const categorizedJobSites = jobSites?.data.reduce(
        (
          acc: {
            activeJobSites: JOB_SITE_TYPE[]
            inactiveJobSites: JOB_SITE_TYPE[]
          },
          jobSite: JOB_SITE_TYPE
        ) => {
          if (jobSite.status.name === JOB_SITE_STATUS.ACTIVE) {
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

  const handleInActiveSite = () => {
    setShowInActive(!showInActive)
  }

  return (
    <>
      <Row align={'middle'} className="my-4">
        <Title className="mb-0">{MESSAGES.ACTIVE_JOB_SITES}</Title>
        <Badge
          count={activeJobSites.length || 0}
          showZero
          className="ml-3"
        ></Badge>
      </Row>

      <Row gutter={[16, 16]}>
        {activeJobSites.map((jobSite: JOB_SITE_TYPE, index: number) => (
          <JobSiteCard key={index} jobSite={jobSite} />
        ))}
      </Row>

      <Row align={'middle'} className="my-4">
        <Title className="mb-0">{MESSAGES.INACTIVE_JOB_SITES}</Title>
        <Badge
          count={inactiveJobSites.length || 0}
          showZero
          className="ml-3"
        ></Badge>
        {inactiveJobSites.length > 0 && (
          <Title className="show-hide" onClick={handleInActiveSite} level={5}>
            {showInActive ? 'HIDE' : 'SHOW'}
          </Title>
        )}
      </Row>
      {showInActive && (
        <Row gutter={[16, 16]}>
          {inactiveJobSites.map((jobSite: JOB_SITE_TYPE, index: number) => (
            <JobSiteCard key={index} jobSite={jobSite} />
          ))}
        </Row>
      )}
    </>
  )
}

export default ClientJobSites
