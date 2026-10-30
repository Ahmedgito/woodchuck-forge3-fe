'use client'
import React from 'react'
import { Typography } from 'antd'
import { MESSAGES } from '@/utils/constants/app-constants'
import { HAULER_TYPE } from '@/utils/constants/types'
import InputComponent from '../shared/input'

const { Title, Text } = Typography

export default function Address(props: {
  errors: { [key: string]: string | string[] }
  touched: { [key: string]: string | boolean | string[] }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: HAULER_TYPE
}) {
  const { errors, handleChange, touched, values, handleBlur } = props
  return (
    <>
      <Title level={4} className="sub-head">
        {' '}
        {MESSAGES.BILLING_ADDRESS}{' '}
      </Title>
      <div className="field">
        <label htmlFor="street">{MESSAGES.STREET}</label>
        <InputComponent
          name="street"
          value={values.street}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="city">{MESSAGES.CITY}</label>
        <InputComponent
          name="city"
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="state">{MESSAGES.STATE}</label>
        <InputComponent
          name="state"
          value={values.state}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="field">
        <label htmlFor="zip">{MESSAGES.ZIP}</label>
        <InputComponent
          name="zip"
          value={values.zip}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="country">{MESSAGES.COUNTRY}</label>
        <InputComponent
          name="country"
          value={values.country}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
    </>
  )
}
