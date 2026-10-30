'use client'
import JobSiteDetails from '@/src/components/jobSiteDetails/jobSiteDetails'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getJobSiteDetails } from '@/src/services/jobsite'
import { useLoader } from '@/src/utils/context/loader-context'
import { useRouter } from 'next/navigation'
import { CREATE_JOB_SITE, USER_TYPE } from '@/src/utils/constants/types'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getCarbonCreditByJobSite, getClient } from '@/src/services/global'
import { useUser } from '@/src/utils/context/user-context'
import { useSession } from 'next-auth/react'

export default function JobSites() {
  const searchParams = useSearchParams()
  const { setLoading } = useLoader()
  const router = useRouter()
  const { data: session } = useSession()
  const triggerNotification = useTriggerNotification()
  const { user } = useUser()
  const [jobsiteClient, setJobsiteClient] = useState<USER_TYPE>()
  const isSubUser = session?.user?.isSubUser

  const [jobSiteDetailsData, setJobSiteDetailsData] =
    useState<CREATE_JOB_SITE>()
  const id = Number(searchParams.get('id'))
  const getJobSiteData = async (id: number | null | undefined) => {
    try {
      setLoading(true)
      const result = await getJobSiteDetails(id)
      if (result.data.data === null) {
        router.replace('/')
      } else {
        const jobSiteData = result.data.data
        const powerplants = jobSiteData.powerplants?.id
        const powerplantsName = jobSiteData.powerplants?.name
        const [client, carbonCredit] = await Promise.all([
          getClient(jobSiteData.clientId),
          getCarbonCreditByJobSite(jobSiteData.id),
        ])
        setJobsiteClient(client.data.data)

        // since photo can't be send from BE with job site details so handling it on FE with extra code
        // if (
        //   user?.role.enum === ROLES.ADMIN ||
        //   user?.role.enum === ROLES.END_CLIENT ||
        //   (user?.role.enum === ROLES.MANUFACTURER && isSubUser) ||
        //   (user?.role.enum === ROLES.GENERAL_CONTRACTOR && isSubUser)
        // ) {
        //   jobSiteData.photo = client.data.data.photo
        // } else if (
        //   user?.role.enum === ROLES.GENERAL_CONTRACTOR ||
        //   user?.role.enum === ROLES.MANUFACTURER
        // ) {
        //   jobSiteData.photo = user?.photo
        // }

        setJobSiteDetailsData({
          ...jobSiteData,
          powerplants,
          powerplantsName,
          carbonCredit: carbonCredit?.data?.data ?? null,
        })
      }
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
    if (id && user?.id) {
      getJobSiteData(id)
    }
  }, [id, user?.id])
  return (
    <>
      {jobSiteDetailsData?.title ? (
        <title>{`Job Site - ${jobSiteDetailsData?.title}`}</title>
      ) : (
        <title>Job Site</title>
      )}
      {jobSiteDetailsData && (
        <JobSiteDetails
          id={id}
          jobSiteDetailsData={jobSiteDetailsData}
          getJobSiteData={getJobSiteData}
          jobsiteClient={jobsiteClient}
        />
      )}
    </>
  )
}
