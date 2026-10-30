import React from 'react'
import { Row, Col, Typography, DatePicker } from 'antd'
import { CREATE_JOB_SITE, StructuredAddress } from '@/src/utils/constants/types'
import InputComponent from '../../shared/input'
import { DATE_FORMAT, MESSAGES } from '@/src/utils/constants/app-constants'
import { CREATE_JOB_SITE_FORM } from '@/src/utils/constants/form-constants'
import JobFormValues from './JobFormValues'
import { jobSiteAddressConfig } from '@/src/utils/functions/jobSiteValuesConfig'
import dayjs from 'dayjs'
import AddressAutocomplete from '../../common/address-autocomplete'

const { Title, Text } = Typography

interface Props {
  values: { [key: string]: any }
  addressDetails: CREATE_JOB_SITE | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  edit: boolean
  touched: { [key: string]: any }
  errors: { [key: string]: any }
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  setFieldValue: (
    name: string,
    value: string | StructuredAddress | null
  ) => void
}

const AddressSection: React.FC<Props> = ({
  addressDetails,
  onChange,
  disabled,
  edit,
  errors,
  onBlur,
  values,
  touched,
  setFieldValue,
}) => {
  const details = jobSiteAddressConfig(addressDetails)

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5} className="sub-head mb-4">
            {MESSAGES.ADDRESS}
          </Title>
        </Col>
      </Row>

      <Row gutter={[0, 0]}>
        {!edit && <JobFormValues details={details} />}

        {edit && (
          <>
            <Col xl={24} lg={24} md={12} sm={12} xs={24} className="mb-3">
              {/* <MultiLineInput
                name="address"
                onChange={onChange}
                onBlur={onBlur}
                value={values.address}
                minRows={3}
                maxRows={5}
                errors={errors}
                touched={touched}
              /> */}
              <AddressAutocomplete
                name="address"
                value={values.address?.addressFull || ''}
                onBlur={onBlur}
                errors={errors}
                touched={touched}
                onAddressSelect={(address) => {
                  setFieldValue('address', address)
                }}
              />
            </Col>

            <Col xl={24} lg={24} md={12} sm={12} xs={24} className="field mb-4">
              <Row gutter={[8, 0]}>
                <Col
                  xl={14}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={24}
                  className="flex items-center"
                >
                  <label className="font-medium">
                    {CREATE_JOB_SITE_FORM.SUSTAINABILITY_GOAL}
                  </label>
                </Col>
                <Col xl={10} lg={12} md={12} sm={12} xs={24}>
                  <InputComponent
                    type="number"
                    restrictNegativeValue={true}
                    name="sustainabilityGoal"
                    onChange={onChange}
                    value={values.sustainabilityGoal}
                    touched={touched}
                    errors={errors}
                  />
                </Col>
              </Row>
            </Col>

            <Col xl={24} lg={24} md={12} sm={12} xs={24} className="field mb-4">
              <Row gutter={[8, 0]}>
                <Col
                  xl={14}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={24}
                  className="flex items-center"
                >
                  <label className="font-medium">
                    {CREATE_JOB_SITE_FORM.START_DATE}
                  </label>
                </Col>
                <Col xl={10} lg={12} md={12} sm={12} xs={24}>
                  <DatePicker
                    className="w-full"
                    allowClear={false}
                    format={DATE_FORMAT.MM_DD_YYYY}
                    onChange={(val) => {
                      setFieldValue(
                        'startDate',
                        dayjs(val).format(DATE_FORMAT.MM_DD_YYYY)
                      )
                    }}
                    value={
                      values.startDate
                        ? dayjs(values.startDate)
                        : addressDetails
                          ? dayjs(addressDetails.createdAt)
                          : dayjs()
                    }
                  />
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </>
  )
}

export default AddressSection
