'use client'
import React, { useState } from 'react'
import { Row, Typography, Col } from 'antd'
import { MESSAGES } from '@/utils/constants/app-constants'
import SupervisorForm from '../../dashboard/create-job-site/components/supervisorForm'
import { CREATE_JOB_SITE } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { formatNumber } from '@/src/utils/functions/formatNumber'
import { useLoader } from '@/src/utils/context/loader-context'

const { Title, Text } = Typography

interface Props {
  jobSiteDetails: CREATE_JOB_SITE | undefined
  disabled: boolean
  editSupervisor: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: { [key: string]: any }
  errors: { [key: string]: any }
  touched: { [key: string]: any }
}

const SupervisorSection: React.FC<Props> = ({
  jobSiteDetails,
  values,
  onBlur,
  disabled,
  editSupervisor,
  errors,
  touched,
  onChange,
}) => {
  const [showDumpsterValidation, setShowDumpsterValidation] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  // useEffect(() => {
  //   if ((jobSiteDetails?.dumpsters || []).length > 0) {
  //     setShowDumpsterValidation(false)
  //   }
  // }, [jobSiteDetails?.dumpsters?.length])

  // const sendInstructionsToSupervisor = async () => {
  //   try {
  //     if ((jobSiteDetails?.dumpsters || []).length === 0) {
  //       setShowDumpsterValidation(true)
  //       return
  //     }
  //     setLoading(true)
  //     setShowDumpsterValidation(false)
  //     await sendSmsInstructionToSupervisor(jobSiteDetails?.id)
  //     triggerNotification(
  //       'success',
  //       MESSAGES.SUCCESS,
  //       MESSAGES.SMS_SUCCESS_TO_SUPERVISOR
  //     )
  //     setLoading(false)
  //   } catch (err) {
  //     setLoading(false)
  //     triggerNotification(
  //       'error',
  //       MESSAGES.ERROR,
  //       MESSAGES.SOMETHING_WENT_WRONG
  //     )
  //   }
  // }

  return (
    <>
      {/* <Formik
        initialValues={{
          name: jobSiteDetails?.name,
          phone: jobSiteDetails?.phone,
          email: jobSiteDetails?.email,
        }}
        validationSchema={SUPERVISOR_FORM_SCHEMA}
        onSubmit={(values) => onChange(values)}
        enableReinitialize
      >
        {({
          errors,
          values,
          touched,
          handleBlur,
          handleChange,
          validateForm,
        }) => (
          <> */}
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

      <Row>
        {/* {!editSupervisor && !disabled && (
                  <Button
                    type="text"
                    onClick={() => setEditSupervisor(true)}
                    className="edit-icon font-inter font-medium"
                    icon={<i className="icon-pencil"></i>}
                  >
                    {MESSAGES.CHANGE}
                  </Button>
                )}
                {editSupervisor && (
                  <Button
                    onClick={() => {
                      validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          onChange(values)
                          setEditSupervisor(false)
                        }
                      })
                    }}
                  >
                    {MESSAGES.SAVE}
                  </Button>
                )} */}
      </Row>

      {!editSupervisor && (
        <>
          <Row gutter={[8, 8]} className="field">
            <Col
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={24}
              className="flex items-start justify-end lg-justify-start"
            >
              <label className="font-medium">Name:</label>
            </Col>
            <Col xl={16} lg={16} md={16} sm={16} xs={24}>
              <span className="data-field flex items-center font-medium">
                {jobSiteDetails?.name ?? ''}
              </span>
            </Col>
          </Row>

          <Row gutter={[8, 8]} className="field">
            <Col
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={24}
              className="flex items-start justify-end lg-justify-start"
            >
              <label className="font-medium">SMS Phone:</label>
            </Col>
            <Col xl={16} lg={16} md={16} sm={16} xs={24}>
              <span className="data-field flex items-center font-medium">
                <a href={`tel:${jobSiteDetails?.phone}`}>
                  {formatNumber(jobSiteDetails?.phone)}
                </a>
              </span>
            </Col>
          </Row>

          <Row gutter={[8, 8]} className="field">
            <Col
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={24}
              className="flex items-start justify-end lg-justify-start"
            >
              <label className="font-medium">Email:</label>
            </Col>
            <Col xl={16} lg={16} md={16} sm={16} xs={24}>
              <span className="data-field flex items-center font-medium">
                <a href={`tel:${jobSiteDetails?.email}`}>
                  <span className="value" title={jobSiteDetails?.email ?? ''}>
                    {jobSiteDetails?.email}
                  </span>
                </a>
              </span>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* {!disabled && (
            <Col span={24} className="mt-5">
              <Button onClick={sendInstructionsToSupervisor} type="primary">
                {MESSAGES.SEND_INSTRUCTIONS_TO_SUPERVISOR}
              </Button>
              {showDumpsterValidation && (
                <Text className="error-label">
                  {MESSAGES.SEND_SMS_VALIDATON}
                </Text>
              )}
            </Col>
          )} */}
          </Row>
        </>
      )}
      {editSupervisor && (
        <SupervisorForm
          values={values}
          errors={errors}
          touched={touched}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    </>
    // )}
    //   </Formik>
    // </>
  )
}

export default SupervisorSection
