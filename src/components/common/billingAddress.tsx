'use client'
import React from 'react'
import { Typography } from 'antd'
import { MESSAGES } from '@/utils/constants/app-constants'
import { USER_TYPE } from '@/utils/constants/types'
import InputComponent from '../shared/input'

const { Title, Text } = Typography

export default function BillingAddress(props: {
  errors: { [key: string]: any }
  touched: { [key: string]: any }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: USER_TYPE
}) {
  const { errors, handleChange, values, touched, handleBlur } = props
  return (
    <>
      <Title level={4} className="sub-head">
        {' '}
        {MESSAGES.BILLING_ADDRESS}{' '}
      </Title>
      <div className="field">
        <label htmlFor="billing_details_name">{MESSAGES.COMPANY_NAME}</label>
        <InputComponent
          name="billing_details_name"
          value={values.billing_details_name}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="billing_details_street">{MESSAGES.STREET}</label>
        <InputComponent
          name="billing_details_street"
          value={values.billing_details_street}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="billing_details_city">{MESSAGES.CITY}</label>
        <InputComponent
          name="billing_details_city"
          value={values.billing_details_city}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="billing_details_state">{MESSAGES.STATE}</label>
        <InputComponent
          name="billing_details_state"
          value={values.billing_details_state}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="field">
        <label htmlFor="billing_details_zipcode">{MESSAGES.ZIP}</label>
        <InputComponent
          name="billing_details_zipcode"
          value={values.billing_details_zipcode}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="field">
        <label htmlFor="billing_details_country">{MESSAGES.COUNTRY}</label>
        <InputComponent
          name="billing_details_country"
          value={values.billing_details_country}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
    </>
  )
}
