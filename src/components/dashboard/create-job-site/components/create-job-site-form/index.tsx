'use client'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { ADD_JOB_SITE_SCHEMA } from '@/src/utils/constants/schemas'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { Col, Input, Row, Typography } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import SupervisorForm from '../supervisorForm'
import { CREATE_JOB_SITE, USER_TYPE } from '@/src/utils/constants/types'
import JobSiteInfoForm from '../jobSiteInfo'
import { useLoader } from '@/src/utils/context/loader-context'
import { JOB_SITE_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import AddressSection from '@/src/components/jobSiteDetails/components/addressSection'
import { createJobSite } from '@/src/services/jobsite'
import AddEndClientModal from '@/src/components/jobSiteDetails/components/modal/editClientModal'
import { fetchEndClientData } from '@/src/app/(app)/settings/dataFetchers'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import SecondaryButton from '@/src/components/common/secondaryButton'

interface Props {
  clientName: string | null | undefined
  clientId: number | null | undefined
  setIsModalOpen: (val: boolean) => void
  onRefresh: () => void
  currentTab: string
}

const { Title, Text } = Typography

const CreateJobSiteForm: React.FC<Props> = ({
  clientName,
  clientId,
  setIsModalOpen,
  onRefresh,
  currentTab,
}) => {
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)
  const [endClientModal, setEndClientModal] = useState(false)
  const [endClients, setEndClients] = useState<USER_TYPE[]>([])
  const { setLoading } = useLoader()
  const { TextArea } = Input
  const onSubmit = async (payload: CREATE_JOB_SITE) => {
    try {
      setLoading(true)
      await createJobSite(payload)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.JOB_SITE_CREATED_SUCCESS
      )
      setIsModalOpen(false)
      setLoading(false)
      onRefresh()
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
    fetchEndClientData({
      setState: setEndClients,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
  }, [])

  const handleEndClientModal = () => {
    setEndClientModal(true)
  }

  return (
    <>
      <Title level={5} className="sub-head mb-4 font-medium">
        {MESSAGES.JOB_SITE_OVERVIEW}
      </Title>
      <Formik<CREATE_JOB_SITE>
        initialValues={
          { clientId: clientId, ...JOB_SITE_INITIAL_STATE } as CREATE_JOB_SITE
        }
        validationSchema={ADD_JOB_SITE_SCHEMA}
        onSubmit={(values) => {
          onSubmit(values)
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            <Row className="form-section">
              <Col span={24} className="jobsite-form px-5 py-3">
                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <AddressSection
                      disabled={false}
                      addressDetails={values}
                      onChange={handleChange}
                      edit={true}
                      values={values}
                      touched={touched}
                      errors={errors}
                      onBlur={handleBlur}
                      setFieldValue={setFieldValue}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Row>
                      <Col
                        xl={{ span: 16, push: 8 }}
                        lg={{ span: 16, push: 8 }}
                        xs={{ span: 24, push: 0 }}
                      >
                        <Title level={5} className="sub-head mb-4">
                          {MESSAGES.SUPERVISOR}
                        </Title>
                      </Col>
                    </Row>
                    <SupervisorForm
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Type here"
                    />
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
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

                    <JobSiteInfoForm
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      handleEndClientModal={handleEndClientModal}
                      endClients={endClients}
                      currentTab={currentTab}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            {endClientModal && (
              <AddEndClientModal
                isOpen={endClientModal}
                setIsModalOpen={setEndClientModal}
                onRefresh={() =>
                  fetchEndClientData({
                    setState: setEndClients,
                    setLoading: setLoading,
                    triggerNotification: trigger,
                  })
                }
              />
            )}

            {/* <HaulerDropDown
              haulerId={values.haulerId}
              onChange={(value) => setFieldValue('haulerId', value)}
            /> */}

            {/* <MMRDropDown
              mmrLocation={values.mmrLocation}
              onChange={(value) => setFieldValue('mmrLocation', value)}
            /> */}

            <Row gutter={[16, 16]}>
              <Col span={24} className="mt-5 text-center">
                <SecondaryButton htmlType="submit" type="default">
                  {MESSAGES.CREATE_JOB_SITE}
                </SecondaryButton>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default CreateJobSiteForm
