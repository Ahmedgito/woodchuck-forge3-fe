'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Col, Row, Typography } from 'antd'
import { ADD_LOCATION_SCHEMA } from '@/utils/constants/schemas'

import {
  LOCATION_HEADINGS,
  LOCATION_TO_TYPES,
  MESSAGES,
} from '@/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import InputComponent from '@/src/components/shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import {
  createLocation,
  getCombinedLocations,
  getLocationTypes,
  getLocations,
  updateLocation,
} from '@/src/services/global'
import SelectComponent from '@/src/components/shared/select'
import { LOCATION_FORM } from '@/src/utils/constants/form-constants'
import { LOCATION_INITAL_STATE } from '@/src/utils/constants/initial-states'
import AddressAutocomplete from '@/src/components/common/address-autocomplete'

const { Title, Text } = Typography

interface Props {
  id?: any
  setIsModalOpen: (value: boolean) => void
  onRefresh: () => void
}

const LocationForm: React.FC<Props> = ({ id, setIsModalOpen, onRefresh }) => {
  const [location, setLocation] = useState(LOCATION_INITAL_STATE)
  const [edit, setEdit] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  const [locationTypes, setLocationTypes] = useState([])
  const [combinedLocations, setCombinedLocations] = useState([])

  useEffect(() => {
    getLocationTypesData()
    getCombinedLocationData()
  }, [])

  useEffect(() => {
    if (id) {
      setEdit(true)
      getLocationData(id)
    }
  }, [id])

  const getLocationTypesData = async () => {
    try {
      setLoading(true)
      const result = await getLocationTypes()
      let types = result.data.data
      types = types?.map((type: any) => ({
        value: type.id,
        label: type.label,
      }))
      setLocationTypes(types)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_LOCATION
      )
    }
  }

  const getCombinedLocationData = async () => {
    try {
      setLoading(true)
      const result = await getCombinedLocations()
      let lists = result.data.data
      lists = lists?.map((list: any) => ({
        value: `${list.id}-${list.entityType}`,
        label: list.name,
      }))
      if (id) {
        lists = lists.filter(
          (list: any) => list.value !== `${id}-${LOCATION_TO_TYPES.LOCATION}`
        )
      }
      setCombinedLocations(lists)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_LOCATION
      )
    }
  }

  const getLocationData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getLocations(id)
      console.log(result.data.data)
      let loc: any = result.data.data
      let to: string | null
      switch (loc.toType) {
        case LOCATION_TO_TYPES.POWER_PLANT:
          to = `${loc.relatedPowerPlant?.id}-${loc.toType}`
          break
        case LOCATION_TO_TYPES.LOCATION:
          to = `${loc.relatedLocation?.id}-${loc.toType}`
          break
        default:
          to = null
          break
      }
      loc = { ...loc, to }
      setLocation(loc)

      // Set address data if available
      // if (loc.addressFull || loc.addressLine1) {
      //   setAddressData({
      //     addressFull: loc.addressFull || '',
      //     addressLine1: loc.addressLine1 || '',
      //     addressLine2: loc.addressLine2 || null,
      //     city: loc.city || '',
      //     state: loc.state || '',
      //     postalCode: loc.postalCode || '',
      //     country: loc.country || '',
      //     latitude: loc.latitude || 0,
      //     longitude: loc.longitude || 0,
      //   })
      // }

      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_LOCATION
      )
    }
  }

  const upsertLocation = async (values: any) => {
    try {
      setLoading(true)
      let payload: any = { name: values.name, type: values.type }
      let [to, toType] = values?.to
        ? values.to.toString().split('-')
        : [null, null]
      payload = {
        ...payload,
        to: parseInt(to),
        toType: parseInt(toType),
        inMiles: values.inMiles,
        address: values.address,
      }

      edit ? await updateLocation(id, payload) : await createLocation(payload)
      onRefresh()
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.LOCATION_SUCCESSFULLY_UPDATED
          : MESSAGES.LOCATION_SUCCESSFULLY_ADDED
      )
      setIsModalOpen(false)
      setLoading(false)
    } catch (err) {
      console.log(err)
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
        {LOCATION_HEADINGS.LOCATION}
      </Title>
      <div className="form-section">
        <Formik
          enableReinitialize
          initialValues={location}
          validationSchema={ADD_LOCATION_SCHEMA}
          onSubmit={(values: any) => {
            upsertLocation(values)
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
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Title level={4} className="sub-head">
                    {LOCATION_HEADINGS.INFO}
                  </Title>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="field w-full">
                    <label htmlFor="name">{LOCATION_FORM.NAME}</label>
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
                    <label htmlFor="name">{LOCATION_FORM.TYPE}</label>
                    <SelectComponent
                      name="type"
                      className="width-100 select-height"
                      value={values.type}
                      onChange={(e) => {
                        setFieldValue('type', e)
                        // handleChange(e)
                      }}
                      options={locationTypes}
                      placeholder={MESSAGES.SELECT_TYPE}
                      allowClear
                      onClear={() => {
                        setFieldValue('type', null)
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <div className="field w-full">
                    <AddressAutocomplete
                      name="address"
                      value={values.address?.addressFull || ''}
                      placeholder="Enter address"
                      label={LOCATION_FORM.ADDRESS}
                      errors={errors}
                      touched={touched}
                      onAddressSelect={(address) => {
                        setFieldValue('address', address)
                      }}
                      onChange={(value) => {
                        // Handle manual input if needed
                        if (!value) {
                          setFieldValue('address', null)
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row justify="end" className="mt-15">
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

export default LocationForm
