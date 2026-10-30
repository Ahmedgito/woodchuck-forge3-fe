'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form, FormikProps } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { DUMPSTER_LOCATION_TYPE } from '@/utils/constants/types'
import { MESSAGES } from '@/utils/constants/app-constants'
import { DUMPSTER_LOCATION_SCHEMA } from '@/utils/constants/schemas'
import { DUMPSTER_LOCATION } from '@/src/utils/constants/initial-states'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { addDumpster, updateDumpster } from '@/src/services/jobsite'
import InputComponent from '../../shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import ConfirmationModal from './modal/confirmationModal'
import { useRef } from 'react'

const { Title, Text } = Typography

export default function DumpsterLocationForm(props: {
  dumpsterLocation: DUMPSTER_LOCATION_TYPE | undefined
  jobSiteId: number | null | undefined
  setIsModalOpen: (value: boolean) => void
  onRefresh: (value: number | null | undefined) => void
  jobsiteTitle: string
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [edit, setEdit] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<boolean>()
  const [DumpsterLocation, setDumpsterLocation] = useState(DUMPSTER_LOCATION)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  const formikRef = useRef<FormikProps<any>>(null)
  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit()
    }
  }

  useEffect(() => {
    if (props.dumpsterLocation) {
      setDumpsterLocation(props.dumpsterLocation)
      setEdit(true)
    }
  }, [props.dumpsterLocation])

  const upsertDumpsterLocation = async (values: DUMPSTER_LOCATION_TYPE) => {
    try {
      setLoading(true)
      edit
        ? await updateDumpster(props.dumpsterLocation?.id, values)
        : await addDumpster(props.jobSiteId, values)
      props.onRefresh(props.jobSiteId)
      props.setIsModalOpen(false)
      props.setRefresh((prev) => !prev)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.DUMPSTER_LOCATION_UPDATED_SUCCESS
          : MESSAGES.DUMPSTER_LOCATION_ADDED_SUCCESS
      )
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  return (
    <section className="container">
      <Title level={1}>
        {MESSAGES.DUMPSTER_TITLE} {props.jobsiteTitle}
      </Title>
      <div className="form-section">
        <Formik
          initialValues={DumpsterLocation}
          innerRef={formikRef}
          validationSchema={DUMPSTER_LOCATION_SCHEMA}
          onSubmit={(values) => {
            // same shape as initial values
            upsertDumpsterLocation(values)
          }}
          enableReinitialize
        >
          {({ errors, handleChange, values, handleBlur, touched }) => (
            <Form>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Title level={3}>{MESSAGES.INFO}</Title>
                  <div className="field">
                    <label htmlFor="sublocationName">
                      {MESSAGES.SUBLOCATION_NAME} *
                    </label>
                    <InputComponent
                      name="sublocationName"
                      value={values.sublocationName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </Col>

                <Col span={24}>
                  <Text>{MESSAGES.DUMPSTER_NOTE_1}</Text>
                  <Text>{MESSAGES.DUMPSTER_NOTE_2}</Text>
                  <Text>{MESSAGES.DUMPSTER_NOTE_3}</Text>
                  <Text>{MESSAGES.DUMPSTER_NOTE_4}</Text>
                </Col>
              </Row>
              <Row justify="end" className="mt-15">
                <Button
                  type="primary"
                  onClick={() =>
                    edit ? setConfirmationModal(true) : handleSubmit()
                  }
                >
                  {edit
                    ? MESSAGES.UPDATE_SUBLOCATION
                    : MESSAGES.ADD_DUMPSTER_LOCATION}
                </Button>
              </Row>
              {confirmationModal && edit && (
                <ConfirmationModal
                  isOpen={confirmationModal}
                  setIsModalOpen={setConfirmationModal}
                  onConfirmation={() => handleSubmit()}
                  title={MESSAGES.IMPACT_HISTORICAL_DATA}
                  closeButtonText={MESSAGES.CANCEL}
                  keepButtonText={MESSAGES.CONFIRM}
                />
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  )
}
