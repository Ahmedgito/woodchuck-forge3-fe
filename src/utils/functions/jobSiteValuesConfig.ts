// jobSiteValuesConfig.ts
import dayjs from 'dayjs'
import { CREATE_JOB_SITE_FORM } from '@/src/utils/constants/form-constants'
import { DATE_FORMAT, MESSAGES } from '@/src/utils/constants/app-constants'
import { CREATE_JOB_SITE } from '@/src/utils/constants/types'

export const getJobSiteIDetailsConfig = (
  jobSiteDetails: CREATE_JOB_SITE | undefined
) => [
  {
    label: CREATE_JOB_SITE_FORM.JS_TITLE,
    value: jobSiteDetails?.title || '',
  },
  {
    label: CREATE_JOB_SITE_FORM.SIZE,
    value: jobSiteDetails?.size?.toString() || '',
  },
  {
    label: `${MESSAGES.TIME_OF_COMPLETION}:`,
    value: jobSiteDetails
      ? dayjs(jobSiteDetails.completionBy).format(DATE_FORMAT.MM_DD_YYYY)
      : '',
  },
  {
    label: CREATE_JOB_SITE_FORM.END_CLIENT,
    value: jobSiteDetails?.endClientName || 'N/A',
  },
]
export const jobSiteAddressConfig = (
  jobSiteDetails: CREATE_JOB_SITE | undefined
) => [
  {
    //label: CREATE_JOB_SITE_FORM.JS_TITLE,
    value: jobSiteDetails?.address?.addressFull || '',
  },
  {
    label: CREATE_JOB_SITE_FORM.SUSTAINABILITY_GOAL,
    value: jobSiteDetails?.sustainabilityGoal?.toString() || '',
  },
  {
    label: `${CREATE_JOB_SITE_FORM.START_DATE}:`,
    value: jobSiteDetails
      ? dayjs(jobSiteDetails.startDate || jobSiteDetails.createdAt).format(
          DATE_FORMAT.MM_DD_YYYY
        )
      : dayjs().format(DATE_FORMAT.MM_DD_YYYY),
  },
]
