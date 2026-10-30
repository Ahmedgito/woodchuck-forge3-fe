'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { ADD_POWER_PLANT_SCHEMA } from '@/utils/constants/schemas'

import { MESSAGES, POWER_PLANT_HEADINGS } from '@/utils/constants/app-constants'
import { POWER_PLANT_INITAL_STATE } from '@/src/utils/constants/initial-states'
import { POWER_PLANT_TYPE } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import InputComponent from '@/src/components/shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import {
  createPowerPlant,
  getPowerPlants,
  updatePowerPlant,
} from '@/src/services/global'
import AddressAutocomplete from '@/src/components/common/address-autocomplete'

const { Title, Text } = Typography

interface Props {
  id?: any
  setIsModalOpen: (value: boolean) => void
  onRefresh: () => void
}

const PowerPlantForm: React.FC<Props> = ({ id, setIsModalOpen, onRefresh }) => {
  const [powerPlantObject, setPowerPlantObject] = useState(
    POWER_PLANT_INITAL_STATE
  )
  const [edit, setEdit] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  useEffect(() => {
    if (id) {
      setEdit(true)
      getpowerPlantData(id)
    }
  }, [id])
  const getpowerPlantData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getPowerPlants(id)
      setPowerPlantObject(result.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_POWER
      )
    }
  }
  const upsertPowerPlant = async (values: POWER_PLANT_TYPE) => {
    try {
      setLoading(true)
      edit ? await updatePowerPlant(id, values) : await createPowerPlant(values)
      onRefresh()
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.POWER_SUCCESSFULLY_UPDATED
          : MESSAGES.POWER_SUCCESSFULLY_ADDED
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
          {POWER_PLANT_HEADINGS.POWER_PLANT}
        </Title>
        <Formik
          enableReinitialize
          initialValues={powerPlantObject}
          validationSchema={ADD_POWER_PLANT_SCHEMA}
          onSubmit={(values: POWER_PLANT_TYPE) => {
            // same shape as initial values
            upsertPowerPlant(values)
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
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Title level={4} className="sub-head">
                    {POWER_PLANT_HEADINGS.POWER_PLANT_INFO}
                  </Title>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{POWER_PLANT_HEADINGS.NAME}</label>
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

                {/* Hidden for future use */}
                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{POWER_PLANT_HEADINGS.BTU_PER_TON}</label>
                    <InputComponent
                      name="btuPerTon"
                      value={values.btuPerTon}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      type="number"
                      restrictNegativeValue={true}
                    />
                  </div>
                </Col> */}

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label>{POWER_PLANT_HEADINGS.KWH_PER_TON}</label>
                    <InputComponent
                      name="kwhPerTon"
                      value={values.kwhPerTon}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      type="number"
                      restrictNegativeValue={true}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <AddressAutocomplete
                    name="address"
                    value={values.address?.addressFull || ''}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    onAddressSelect={(address) => {
                      setFieldValue('address', address)
                    }}
                    label={POWER_PLANT_HEADINGS.ADDRESS}
                  />
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

export default PowerPlantForm
