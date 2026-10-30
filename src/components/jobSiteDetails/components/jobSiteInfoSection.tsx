'use client'
import React from 'react'
import { Row, Col, Typography } from 'antd'
import { MESSAGES } from '@/utils/constants/app-constants'
import { CREATE_JOB_SITE, USER_TYPE } from '@/src/utils/constants/types'
import JobSiteInfoForm from '../../dashboard/create-job-site/components/jobSiteInfo'
import JobFormValues from './JobFormValues'
import { getJobSiteIDetailsConfig } from '@/src/utils/functions/jobSiteValuesConfig'

const { Title, Text } = Typography

interface Props {
  jobSiteDetails: CREATE_JOB_SITE | undefined
  endClients: USER_TYPE[]
  handleEndClientModal: () => void
  jobsiteClient: USER_TYPE | undefined
  editInfo: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: { [key: string]: any }
  errors: { [key: string]: any }
  touched: { [key: string]: any }
  setFieldValue: (name: string, value: string) => void
}

const JobSiteInfoSection: React.FC<Props> = ({
  jobSiteDetails,
  endClients,
  handleEndClientModal,
  jobsiteClient,
  onChange,
  editInfo,
  errors,
  touched,
  onBlur,
  values,
  setFieldValue,
}) => {
  const details = getJobSiteIDetailsConfig(jobSiteDetails)
  return (
    <>
      <Row>
        <Col
          xl={{ span: 16, push: 8 }}
          lg={{ span: 16, push: 8 }}
          xs={{ span: 24, push: 0 }}
        >
          <Title level={5} className="sub-head mb-4">
            {MESSAGES.PROJECT}
          </Title>
        </Col>
      </Row>
      {!editInfo && <JobFormValues details={details} />}
      {editInfo && (
        <JobSiteInfoForm
          values={values}
          errors={errors}
          touched={touched}
          onChange={onChange}
          onBlur={onBlur}
          setFieldValue={setFieldValue}
          handleEndClientModal={handleEndClientModal}
          endClients={endClients}
          jobsiteClient={jobsiteClient}
        />
      )}
    </>
  )
}

export default JobSiteInfoSection
