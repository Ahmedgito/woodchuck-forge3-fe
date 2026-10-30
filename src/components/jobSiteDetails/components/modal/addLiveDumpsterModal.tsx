'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { DUMPSTER_CAMERA_SCHEMA } from '@/utils/constants/schemas'

import { CAMERA_HEADINGS, MESSAGES } from '@/utils/constants/app-constants'
import InputComponent from '@/src/components/shared/input'
import SelectComponent from '@/src/components/shared/select'
import { DUMPSTER_CAMERA_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import {
  fetchAlertsData,
  fetchUnassociatedCameraData,
} from '@/src/app/(app)/settings/dataFetchers'
import {
  createJobSiteCameras,
  deleteJobSiteCamera,
  getJobSiteCamerasById,
  updateJobSiteCameras,
} from '@/src/services/global'
import { JOB_SITE_CAMERA_TYPE } from '@/src/utils/constants/types'

const { Title } = Typography

interface Props {
  jobSiteId?: any
  setIsModalOpen: (_: boolean) => void
  onRefresh: () => void
  liveDumpsterId?: number
}

const AddLiveDumpsterForm: React.FC<Props> = ({
  jobSiteId,
  setIsModalOpen,
  onRefresh,
  liveDumpsterId,
}) => {
  const [cameraList, setCameraList] = useState(DUMPSTER_CAMERA_INITIAL_STATE)
  const [alertData, setAlertData] = useState<any[]>([])
  const [unassociatedCameras, setUnassociatedCameras] = useState<any[]>([])
  const [edit, setEdit] = useState(false)
  const [initialAlert, setInitialAlert] = useState<string | null>(null)
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)

  useEffect(() => {
    if (liveDumpsterId) {
      setEdit(true)
      getCamerasData(liveDumpsterId)
    }
  }, [liveDumpsterId])

  useEffect(() => {
    fetchUnassociatedCameraData({
      setState: setUnassociatedCameras,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchAlertsData({
      id: jobSiteId,
      setState: setAlertData,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
  }, [])

  useEffect(() => {
    if (edit && cameraList.alertTo && cameraList.alertToType) {
      setInitialAlert(`${cameraList.alertTo}-${cameraList.alertToType}`)
    }
  }, [edit, cameraList.alertTo, cameraList.alertToType])

  const getCamerasData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getJobSiteCamerasById(id)
      setCameraList(result?.data?.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_CAMERAS
      )
    }
  }
  const deleteCamera = async (id: number | null | undefined) => {
    try {
      setLoading(true)
      await deleteJobSiteCamera(id)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.CAMERA_SUCCESSFULLY_DELETED
      )
      onRefresh()
      setIsModalOpen(false)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_CAMERAS_DELETE
      )
    }
  }

  const cameraOptions = [
    ...unassociatedCameras.map((camera) => ({
      value: camera.id,
      label: camera.cameraId,
    })),
    ...(edit && cameraList?.camera
      ? [{ value: cameraList.camera?.id, label: cameraList.camera?.cameraId }]
      : []),
  ]
  const alertOptions = alertData?.map((list: any) => ({
    value: `${list.alertTo}-${list.alertToType}`,
    label: list.name,
  }))

  const upsertJobSiteCameras = async (values: JOB_SITE_CAMERA_TYPE) => {
    const [alertTo, alertToType] = values?.alert?.split('-').map(Number) || [
      null,
      null,
    ]
    const payload = {
      name: values.name,
      maxLevel: values.maxLevel,
      alertTo: alertTo,
      cameraId: values.cameraId,
      jobSiteId: jobSiteId,
      alertToType: alertToType,
    }
    try {
      setLoading(true)
      if (edit) {
        await updateJobSiteCameras(liveDumpsterId, payload)
      } else {
        await createJobSiteCameras(payload)
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
    <>
      <Title level={3} className="mb-10">
        {CAMERA_HEADINGS.CAMERA}
      </Title>
      <div className="form-section">
        <Formik
          enableReinitialize
          initialValues={{ ...cameraList, alert: initialAlert }}
          validationSchema={DUMPSTER_CAMERA_SCHEMA}
          onSubmit={(values: any) => {
            upsertJobSiteCameras(values)
          }}
        >
          {({
            errors,
            values,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <Row gutter={[24, 8]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Title level={4} className="sub-head">
                    {CAMERA_HEADINGS.INFO}
                  </Title>

                  <div className="field w-full">
                    <Row gutter={[16, 0]}>
                      <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                        <label htmlFor="name">{CAMERA_HEADINGS.NAME}</label>
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={20} xs={24}>
                        <InputComponent
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div className="field w-full">
                    <Row gutter={[16, 0]}>
                      <Col
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={24}
                        className="flex items-center"
                      >
                        <label htmlFor="cameraId">
                          {CAMERA_HEADINGS.CAM_ID}
                        </label>
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <SelectComponent
                          name="cameraId"
                          className="width-100 select-height"
                          value={values.cameraId}
                          onChange={(e) => {
                            setFieldValue('cameraId', e)
                          }}
                          options={cameraOptions}
                          placeholder={MESSAGES.SELECT_ID}
                          allowClear
                          onClear={() => {
                            setFieldValue('cameraId', null)
                          }}
                          showError
                          errors={errors}
                          touched={touched}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Title level={4} className="sub-head">
                    {CAMERA_HEADINGS.MAX_FILL_LEVEL}
                  </Title>

                  <div className="field w-full">
                    <Row gutter={[16, 0]}>
                      <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                        <label htmlFor="maxLevel">{CAMERA_HEADINGS.IN}</label>
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <InputComponent
                          type="number"
                          name="maxLevel"
                          value={values.maxLevel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                          restrictNegativeValue={true}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div className="field w-full">
                    <Row gutter={[16, 0]}>
                      <Col
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={24}
                        className="flex items-center"
                      >
                        <label htmlFor="alert">{CAMERA_HEADINGS.ALERT}</label>
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <SelectComponent
                          name="alert"
                          className="width-100 select-height"
                          value={values.alert}
                          onChange={(e) => {
                            setFieldValue('alert', e)
                          }}
                          options={alertOptions}
                          placeholder={MESSAGES.SELECT_CHAIN}
                          allowClear
                          onClear={() => {
                            setFieldValue('alert', null)
                          }}
                          showError
                          errors={errors}
                          touched={touched}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row justify="space-between" className="mt-15">
                {edit && (
                  <Button
                    onClick={() => deleteCamera(liveDumpsterId)}
                    type="default"
                    className="mr-5 red"
                  >
                    {MESSAGES.DELETE_CAMERA}
                  </Button>
                )}
                <Button type="primary" htmlType="submit">
                  {MESSAGES.SAVE_CHANGES}
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default AddLiveDumpsterForm
