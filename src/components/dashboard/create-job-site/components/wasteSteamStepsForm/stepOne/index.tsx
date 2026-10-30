import SelectComponent from '@/src/components/shared/select'
import { FORM_LABELS } from '@/src/utils/constants/form-constants'
import {
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_LOCATION_TYPE,
  DUMPSTER_OPTIONS,
  DUMPSTER_TRANSFORMED_OPTIONS,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import {
  CheckOutlined,
  MinusCircleOutlined,
  PlusCircleFilled,
} from '@ant-design/icons'
import {
  transformDumpsterData,
  transformWasteStreamData,
} from '@/src/utils/functions/htmlMappers'
import { Col, Row, Spin, Switch, Typography } from 'antd'
import { Form, Formik, FormikErrors, FormikTouched, FormikValues } from 'formik'
import React, { useState, useEffect } from 'react'
import styles from '../style.module.scss'
import InputComponent from '@/src/components/shared/input'
import {
  MESSAGES,
  WHITELISTED_WASTE_STREAMS,
} from '@/src/utils/constants/app-constants'
import { DUMPSTER_LOCATION_SCHEMA } from '@/src/utils/constants/schemas'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

type Props = {
  values: FormikValues
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FormikErrors<FormikValues>
  touched: FormikTouched<FormikValues>
  setFieldValue: (field: string, value: any) => void
  firstEntry?: boolean
  dumpsterOptions: DUMPSTER_OPTIONS
  wasteStreamList: WASTE_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  jobSiteId: number | null | undefined
  subLocationLoading: boolean
  disabled?: boolean
  dumpsterList: DROP_DOWN_OPTIONS
  upsertDumpsterLocation: (subLocation: DUMPSTER_LOCATION_TYPE) => void
  handleSubLocation: () => void
  subLocationOpen: boolean
  title: string | null
  isSublocationCreated: boolean
}
const { Text, Title } = Typography

function StepOne({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
  setFieldValue,
  firstEntry,
  dumpsterOptions,
  wasteStreamList,
  locationList,
  jobSiteId,
  subLocationLoading,
  disabled = false,
  dumpsterList,
  upsertDumpsterLocation,
  handleSubLocation,
  subLocationOpen,
  title,
  isSublocationCreated,
}: Props) {
  const [wasteStreamDropDownOptions, setWasteStreamDropDownOptions] = useState<
    DUMPSTER_TRANSFORMED_OPTIONS[]
  >([])

  const [groupedOptions, setGroupedOptions] = useState<
    DUMPSTER_TRANSFORMED_OPTIONS[]
  >([])

  const [wasteStreamId, setWasteStreamId] = useState<number | null>(null)

  useEffect(() => {
    setWasteStreamDropDownOptions(transformWasteStreamData(wasteStreamList))
    // ! As per the discussion, the dropdown will be empty by default and options will be populated on selection of waste stream
    // setGroupedOptions(transformDumpsterData(dumpsterOptions))
  }, [locationList, wasteStreamList, dumpsterOptions])

  const getFieldValues = (wasteStreamId: number) => {
    switch (wasteStreamId) {
      case WHITELISTED_WASTE_STREAMS.WOOD_WASTE:
        return {
          fieldName: 'co2',
          fieldLabel: FORM_LABELS.CARBON_CREDIT,
          value: values.co2,
        }
      case WHITELISTED_WASTE_STREAMS.CARD_BOARD:
        return {
          fieldName: 'recycling_rebate',
          fieldLabel: FORM_LABELS.RECYCLING_REBATE,
          value: values.recycling_rebate,
        }
      default:
        return {}
    }
  }

  const getFieldComponent = (wasteStreamId: number) => {
    const { fieldName, fieldLabel, value } = getFieldValues(wasteStreamId)
    return (
      <Col xs={13} sm={13} md={14} lg={14} xl={14}>
        <Typography.Text>{fieldLabel}</Typography.Text>
        <InputComponent
          type="number"
          restrictNegativeValue={true}
          name={fieldName as string}
          onChange={handleChange}
          value={value}
          touched={touched}
          placeholder="0"
          errors={errors}
          disabled={disabled}
          className="flex"
          {...{
            suffix: '$/ton',
          }}
        />
      </Col>
    )
  }

  const CustomLoader = (
    <img
      src="/images/loader.png"
      alt="Loading..."
      style={{
        width: 25,
        height: 25,
        marginTop: 55,
        animation: 'spin 1s linear infinite',
        transformOrigin: 'center center',
      }}
    />
  )

  const manipulateVesselList = (wasteStreamInfo: string) => {
    const [wasteStreamId, wasteStreamTypeId] = wasteStreamInfo.split('_')
    const wasteStream = wasteStreamList.find(
      (wasteStream) => wasteStream.id === Number(wasteStreamId)
    )
    const wasteStreamType = wasteStream?.wasteStreamTypes.find(
      (wasteStreamType) => wasteStreamType.id === Number(wasteStreamTypeId)
    )
    const transformedVesselList = dumpsterOptions.filter((option) =>
      wasteStreamType?.vesselIds?.includes(option.vesselId)
    )
    setGroupedOptions(transformDumpsterData(transformedVesselList))
  }

  return (
    <Row gutter={[24, 24]} className="pt-8">
      <Col span={24}>
        <Row gutter={[24, 24]}>
          {title && (
            <Col span={24} className="mt-5">
              <Title level={1}>{title}</Title>
              <div className="validation-note">
                <span className={styles.asterisk}>*</span>
                <Text>{MESSAGES.REQUIRED_NOTE}</Text>
              </div>
            </Col>
          )}
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <Typography.Text>
              {!disabled && <span className={styles.asterisk}>*</span>}
              {FORM_LABELS.WASTE_STREAM}
            </Typography.Text>
            <SelectComponent
              name={'wastestreamsId'}
              errors={errors}
              touched={touched}
              showError={true}
              value={values.wastestreamsId}
              className="form_select"
              onChange={(e) => {
                setFieldValue('wastestreamsId', e)
                const wasteStreamId = e.split('_')[0]
                manipulateVesselList(e)
                setFieldValue('vesselId', null)
                setWasteStreamId(Number(wasteStreamId))
                setFieldValue('co2', null)
                setFieldValue('recycling_rebate', null)
                setFieldValue('reports_enabled', false)
              }}
              options={wasteStreamDropDownOptions}
              placeholder="Select Waste Stream"
              title="Select Waste Stream"
              disabled={disabled}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <Typography.Text>
              {!disabled && <span className={styles.asterisk}>*</span>}
              {FORM_LABELS.VESSEL}
            </Typography.Text>
            <SelectComponent
              placeholder="Select Vessel"
              title="Select Vessel"
              name="vesselId"
              errors={errors}
              touched={touched}
              showError={true}
              value={values.vesselDisplayValue || values.vesselId}
              className="form_select"
              disabled={disabled}
              onChange={(e) => {
                let displayValue = e
                for (const group of groupedOptions) {
                  const option = group.options.find((opt) => opt.value === e)
                  if (option?.displayValue) {
                    displayValue = option.displayValue
                    break
                  }
                }
                setFieldValue('vesselId', e)
                setFieldValue('vesselDisplayValue', displayValue)
              }}
              options={groupedOptions}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <Typography.Text>
              {!disabled && <span className={styles.asterisk}>*</span>}
              {FORM_LABELS.VESSEL_LOCATION}
            </Typography.Text>
            <Row className="flex flex-col gap-5">
              <Col>
                <GenieButtonWrapper hint="vessel_location_dropdown">
                  <SelectComponent
                    placeholder="Vessel Location"
                    title="Select Vessel Location"
                    name="vesselLocationId"
                    errors={errors}
                    touched={touched}
                    showError={true}
                    value={values.vesselLocationId}
                    className="form_select"
                    disabled={disabled}
                    // disabled={!firstEntry}
                    onChange={(e) => {
                      setFieldValue('vesselLocationId', e)
                    }}
                    options={dumpsterList}
                  />
                </GenieButtonWrapper>
              </Col>
              {!subLocationOpen && !disabled && (
                <Col
                  className="flex items-center gap-2 px-1 py-1 cursor-pointer"
                  onClick={handleSubLocation}
                >
                  <PlusCircleFilled className={styles.add_icon} />
                  <Text className="text-capitalize">Add Sub-Location</Text>
                </Col>
              )}
            </Row>
          </Col>
          {isSublocationCreated ? (
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <div className={styles.sub_location_notification}>
                <CheckOutlined className={styles.check_icon} />
                <Text className={styles.sub_location_text}>
                  {MESSAGES.SUB_LOCATION_ADDED_SUCCESS}
                </Text>
              </div>
            </Col>
          ) : (
            <Col xs={0} sm={0} md={0} lg={6} xl={6}></Col>
          )}
          <Col xs={12} sm={12} md={12} lg={6} xl={6} className="co2-credit">
            {Object.values(WHITELISTED_WASTE_STREAMS).includes(
              wasteStreamId as number
            ) && (
              <Row gutter={[12, 12]}>
                {getFieldComponent(wasteStreamId as number)}
                <Col
                  xs={11}
                  sm={11}
                  md={10}
                  lg={10}
                  xl={10}
                  className="flex flex-col gap-2 justify-center items-end mt-6"
                >
                  <GenieButtonWrapper position="left" hint="co2_credit">
                    <Switch
                      onChange={(e) => {
                        setFieldValue('reports_enabled', e)
                      }}
                      checked={values.reports_enabled}
                      disabled={disabled}
                    />
                  </GenieButtonWrapper>
                  {!disabled && (
                    <Typography.Text className="text-right text-capitalize">
                      {FORM_LABELS.DISPLAY_ONLY}
                    </Typography.Text>
                  )}
                </Col>
              </Row>
            )}
          </Col>
          <Col xs={0} sm={0} md={0} lg={6} xl={6}></Col>

          {subLocationOpen && !disabled && (
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Formik
                initialValues={{
                  sublocationName: '',
                }}
                validationSchema={DUMPSTER_LOCATION_SCHEMA}
                onSubmit={(values) => {
                  upsertDumpsterLocation(values as DUMPSTER_LOCATION_TYPE)
                }}
                enableReinitialize
              >
                {({
                  errors,
                  handleChange,
                  values,
                  handleBlur,
                  touched,
                  handleSubmit,
                }) => (
                  <Form>
                    <Row gutter={[12, 12]}>
                      <Col span={12} className="form-section">
                        <Row gutter={[24, 24]}>
                          <Col
                            span={24}
                            className="flex items-center justify-center gap-2 flex-row mt-4"
                          >
                            <div className="field">
                              <label htmlFor="sublocationName">
                                {MESSAGES.SUBLOCATION_NAME} *
                              </label>
                              <GenieButtonWrapper hint="sub_location_dropdown">
                                <InputComponent
                                  name="sublocationName"
                                  value={values.sublocationName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  errors={errors}
                                  touched={touched}
                                  placeholder={'Sub-Location Name'}
                                />
                              </GenieButtonWrapper>
                            </div>
                          </Col>

                          <Col span={24} className="dumpster-notes">
                            <Text>{MESSAGES.DUMPSTER_NOTE_1}</Text>
                            <Text>{MESSAGES.DUMPSTER_NOTE_2}</Text>
                            <Text>{MESSAGES.DUMPSTER_NOTE_3}</Text>
                            <Text>{MESSAGES.DUMPSTER_NOTE_4}</Text>
                          </Col>
                        </Row>
                      </Col>
                      {subLocationLoading ? (
                        <Col span={12}>
                          <Spin
                            spinning={subLocationLoading}
                            indicator={CustomLoader}
                          />
                        </Col>
                      ) : (
                        <Col
                          span={12}
                          className="flex items-start justify-start flex-col gap-4"
                        >
                          <div className="flex flex-row justify-start items-start gap-2">
                            <span className={styles.asterisk}>*</span>
                            <div className="dumpster-sub-location">
                              <Text>
                                {MESSAGES.SUB_LOCATION_VALIDATION_NOTE}
                              </Text>
                            </div>
                          </div>
                          <div className="flex items-start justify-start flex-col gap-2">
                            <div className="dumpster-notes">
                              <PlusCircleFilled
                                className={styles.add_icon}
                                onClick={() => handleSubmit()}
                              />
                              <Text>{MESSAGES.ADD_SUB_LOCATION_NOTE}</Text>
                            </div>
                            <div className="dumpster-notes">
                              <MinusCircleOutlined
                                className={styles.del_icon}
                                onClick={handleSubLocation}
                              />
                              <Text>{MESSAGES.CANCEL_SUB_LOCATION_NOTE}</Text>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default StepOne
