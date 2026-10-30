'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { ADD_EMISSION_FACTOR_SCHEMA } from '@/utils/constants/schemas'
import { MESSAGES, EMISSION_FACTOR_HEADINGS } from '@/utils/constants/app-constants'
import { EMISSION_FACTOR_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import { EMISSION_FACTOR_TYPE } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import InputComponent from '@/src/components/shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import {
  createEmissionFactor,
  getEmissionFactors,
  updateEmissionFactor,
} from '@/src/services/global'

const { Title } = Typography

interface Props {
  id?: any
  setIsModalOpen: (value: boolean) => void
  onRefresh: () => void
}

const EmissionFactorForm: React.FC<Props> = ({ id, setIsModalOpen, onRefresh }) => {
  const [emissionFactorObject, setEmissionFactorObject] = useState(
    EMISSION_FACTOR_INITIAL_STATE
  )
  const [edit, setEdit] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    if (id) {
      setEdit(true)
      getEmissionFactorData(id)
    }
  }, [id])

  const getEmissionFactorData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getEmissionFactors(id)
      setEmissionFactorObject(result.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_EMISSION_FACTORS
      )
    }
  }

  const upsertEmissionFactor = async (values: EMISSION_FACTOR_TYPE) => {
    try {
      setLoading(true)
      edit
        ? await updateEmissionFactor(id, values)
        : await createEmissionFactor(values)
      onRefresh()
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.EMISSION_FACTOR_SUCCESSFULLY_UPDATED
          : MESSAGES.EMISSION_FACTOR_SUCCESSFULLY_ADDED
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
      <div className="form-section">
        <Title level={3} className="mb-10">
          {EMISSION_FACTOR_HEADINGS.EMISSION_FACTORS}
        </Title>
        <Formik
          enableReinitialize
          initialValues={emissionFactorObject}
          validationSchema={ADD_EMISSION_FACTOR_SCHEMA}
          onSubmit={(values: EMISSION_FACTOR_TYPE) => {
            upsertEmissionFactor(values)
          }}
        >
          {({
            errors,
            values,
            touched,
            handleChange,
            handleBlur,
          }) => (
            <Form>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Title level={4} className="sub-head">
                    {EMISSION_FACTOR_HEADINGS.EMISSION_FACTOR_INFO}
                  </Title>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{EMISSION_FACTOR_HEADINGS.NAME}</label>
                    <InputComponent
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{EMISSION_FACTOR_HEADINGS.KEY}</label>
                    <InputComponent
                      name="key"
                      value={values.key}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      disabled={edit}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{EMISSION_FACTOR_HEADINGS.VALUE}</label>
                    <InputComponent
                      name="value"
                      value={values.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </Col>

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
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default EmissionFactorForm

