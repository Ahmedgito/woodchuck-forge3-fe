'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { ADD_CAMERA_SCHEMA } from '@/utils/constants/schemas'

import { CAMERA_HEADINGS, MESSAGES } from '@/utils/constants/app-constants'
import { CAMERA_TYPE } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import InputComponent from '@/src/components/shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import { createCameras, getCameras, updateCameras } from '@/src/services/global'
import { CAMERA_INITIAL_STATE } from '@/src/utils/constants/initial-states'

const { Title } = Typography

interface Props {
  id?: any
  setIsModalOpen: (_value: boolean) => void
  onRefresh: () => void
}

const CameraForm: React.FC<Props> = ({ id, setIsModalOpen, onRefresh }) => {
  const [cameraObject, setCameraObject] = useState(CAMERA_INITIAL_STATE)
  const [edit, setEdit] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  useEffect(() => {
    if (id) {
      setEdit(true)
      getCamerasData(id)
    }
  }, [id])
  const getCamerasData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getCameras(id)
      setCameraObject(result.data.data)
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
  const upsertCameras = async (values: CAMERA_TYPE) => {
    try {
      setLoading(true)
      if (edit) {
        await updateCameras(id, values)
      } else {
        await createCameras(values)
      }
      onRefresh()
      setIsModalOpen(false)
      setLoading(false)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.CAMERA_SUCCESSFULLY_UPDATED
          : MESSAGES.CAMERA_SUCCESSFULLY_ADDED
      )
    } catch (err: any) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        err.response?.data?.errors?.camera === 'idAlreadyExists' ||
          err.response?.data?.errors?.includes('id must be unique')
          ? MESSAGES.CAMERA_ID_ALREADY_EXISTS
          : MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }
  return (
    <>
      <div className="form-section">
        <Title level={3} className="mb-10">
          {CAMERA_HEADINGS.CAMERA_ID}
        </Title>
        <Formik
          enableReinitialize
          initialValues={cameraObject}
          validationSchema={ADD_CAMERA_SCHEMA}
          onSubmit={(values: CAMERA_TYPE) => {
            upsertCameras(values)
          }}
        >
          {({ errors, values, touched, handleChange, handleBlur }) => (
            <Form>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Title level={4} className="sub-head">
                    {CAMERA_HEADINGS.CAMERA_INFO}
                  </Title>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{CAMERA_HEADINGS.DESCRIPTION}</label>
                    <InputComponent
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      disabled={values.isAdmin}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{CAMERA_HEADINGS.IP_ADDRESS}</label>
                    <InputComponent
                      name="ipAddress"
                      value={values.ipAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      restrictNegativeValue={true}
                      disabled={values.isAdmin}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{CAMERA_HEADINGS.ID}</label>
                    <InputComponent
                      name="cameraId"
                      value={values.cameraId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      restrictNegativeValue={true}
                      disabled={values.isAdmin}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{CAMERA_HEADINGS.URL}</label>
                    <InputComponent
                      name="url"
                      value={values.url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      disabled={values.isAdmin}
                    />
                  </div>
                </Col>

                {!values.isAdmin && (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    className="flex justify-end"
                  >
                    <Button type="primary" htmlType="submit" className="mt-15">
                      {MESSAGES.SAVE}
                    </Button>
                  </Col>
                )}
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default CameraForm
