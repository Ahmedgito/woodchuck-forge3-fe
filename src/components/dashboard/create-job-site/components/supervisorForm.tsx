'use client'
import InputComponent from '@/src/components/shared/input'
import {
  CREATE_JOB_SITE_FORM,
  PHONE_MASK,
} from '@/src/utils/constants/form-constants'
import { Typography, Row, Col } from 'antd'
import React from 'react'

interface Props {
  values: { [key: string]: any }
  errors: { [key: string]: any }
  touched: { [key: string]: any }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const { Text } = Typography

const SupervisorForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  placeholder,
}: Props) => {
  return (
    <>
      <Row gutter={[8, 8]} className="field">
        <Col
          xl={8}
          lg={8}
          md={8}
          sm={8}
          xs={24}
          className="flex justify-end items-start lg-justify-start"
        >
          <label className="font-medium">{CREATE_JOB_SITE_FORM.NAME}:</label>
        </Col>
        <Col xl={16} lg={16} md={16} sm={16} xs={24}>
          <InputComponent
            name="name"
            onChange={onChange}
            onBlur={onBlur}
            value={values.name}
            errors={errors}
            touched={touched}
          />
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
          <label className="font-medium">
            {CREATE_JOB_SITE_FORM.SMS_PHONE}
          </label>
        </Col>
        <Col xl={16} lg={16} md={16} sm={16} xs={24}>
          <InputComponent
            name="phone"
            onChange={onChange}
            onBlur={onBlur}
            value={values.phone}
            errors={errors}
            touched={touched}
            mask={PHONE_MASK}
          />
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
          <label className="font-medium">{CREATE_JOB_SITE_FORM.EMAIL}:</label>
        </Col>
        <Col xl={16} lg={16} md={16} sm={16} xs={24}>
          <InputComponent
            name="email"
            onChange={onChange}
            onBlur={onBlur}
            value={values.email}
            errors={errors}
            touched={touched}
          />
        </Col>
      </Row>
    </>
  )
}

export default SupervisorForm
