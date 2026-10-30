'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { ADD_HAULER_SCHEMA } from '@/utils/constants/schemas'

import { MESSAGES } from '@/utils/constants/app-constants'
import { HAULER_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import { HAULER_TYPE } from '@/src/utils/constants/types'
import Address from '@/src/components/common/address'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import InputComponent from '@/src/components/shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import { createHauler, getHauler, updateHauler } from '@/src/services/global'
import CustomMaskedInput from '@/src/components/shared/input/maskedInput'

const { Title } = Typography

interface Props {
  id?: any
  setIsModalOpen: (value: boolean) => void
  onRefresh: () => void
}

const HaulerForm: React.FC<Props> = ({ id, setIsModalOpen, onRefresh }) => {
  const [haulerObject, setHaulerObject] = useState(HAULER_INITIAL_STATE)
  const [edit, setEdit] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    if (id) {
      setEdit(true)
      getHaulerData(id)
    }
  }, [id])

  const getHaulerData = async (id: string | null) => {
    try {
      setLoading(true)
      const result = await getHauler(id)
      setHaulerObject(result.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_HAULER
      )
    }
  }

  const upsertHauler = async (values: HAULER_TYPE) => {
    try {
      setLoading(true)
      edit ? await updateHauler(id, values) : await createHauler(values)
      onRefresh()
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.HAULER_SUCCESSFULLY_UPDATED
          : MESSAGES.HAULER_SUCCESSFULLY_ADDED
      )
      setIsModalOpen(false)
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
    <>
      <Title level={3} className="mb-10">
        {MESSAGES.HAULERS}
      </Title>
      <div className="form-section">
        <Formik
          enableReinitialize
          initialValues={haulerObject}
          validationSchema={ADD_HAULER_SCHEMA}
          onSubmit={(values) => upsertHauler(values)}
        >
          {({ errors, values, touched, handleChange, handleBlur }) => (
            <Form className="hauler">
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Title level={4} className="sub-head">
                    {MESSAGES.HAULER_INFO}
                  </Title>
                  <div className="field w-full">
                    <label htmlFor="name">{MESSAGES.HAULER_NAME}</label>
                    <InputComponent
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="field w-full">
                    <label htmlFor="phone">{MESSAGES.PHONE}</label>
                    {/* <InputComponent
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      mask={PHONE_MASK}
                    /> */}
                    <CustomMaskedInput
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="field w-full">
                    <label htmlFor="email">{MESSAGES.EMAIL}</label>
                    <InputComponent
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={edit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="field w-full">
                    <Text className="mt-10">{MESSAGES.DUMPSTER_SIZE}</Text>
                    <Checkbox.Group
                      value={values.dumpsterSize}
                      name="dumpsterSize"
                      className="dupmster-checkboxes"
                    >
                      {DUMPSTERS.map((dumpster, index) => (
                        <Checkbox
                          key={index}
                          value={dumpster}
                          onChange={handleChange}
                          name="dumpsterSize"
                        >
                          {dumpster} {MESSAGES.YARD}
                        </Checkbox>
                      ))}
                      {errors.dumpsterSize && touched.dumpsterSize ? (
                        <Text className="error-label">
                          {errors.dumpsterSize}
                        </Text>
                      ) : null}
                    </Checkbox.Group>
                  </div> */}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="fields-full-width">
                    <Address
                      errors={errors}
                      handleChange={handleChange}
                      values={values}
                      handleBlur={handleBlur}
                      touched={touched}
                    />
                  </div>
                </Col>
              </Row>
              <Row justify="end" className="mt-10">
                <Button type="primary" htmlType="submit">
                  {MESSAGES.SAVE}
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default HaulerForm
