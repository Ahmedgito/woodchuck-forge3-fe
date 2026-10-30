import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Row, Typography } from 'antd'
import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import React from 'react'
import styles from '../style.module.scss'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  HAULER_TYPE,
} from '@/src/utils/constants/types'
import { useWasteSteamForm } from '@/src/utils/hooks/wasteSteamForm'
import { MESSAGES } from '@/src/utils/constants/app-constants'

type Props = {
  values: FormikValues
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FormikErrors<FormikValues>
  touched: FormikTouched<FormikValues>
  setFieldValue: (field: string, value: any) => void
  firstEntry?: boolean
  locationList: COMBINED_LOCATION_TYPE[]
  haulerList: HAULER_TYPE[]
  currentStep: number
  isStepFourMandatory: boolean
  jobSiteId: number | null | undefined
  setIsStepFourMandatory: (value: boolean) => void
  disabled?: boolean
  fields: {
    name: string
    label: string
    type: string
    placeholder: string
    span: number
    allowClear: boolean
    readOnly?: boolean
    disabled?: boolean
    isMandatory: boolean
    secondaryName?: string
    isSelector?: boolean
    suffix?: string
    isTooltip?: boolean
    ToolipComponent?: React.ReactNode | null
    className?: string
    labelClassName?: string
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }[]
  title: string | null
  isStepFour?: boolean
  dumpsterList: DROP_DOWN_OPTIONS
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  className?: string
  isRequired?: boolean
}
const { Text, Title } = Typography

function WasteStreamStep({
  values,
  handleChange,
  errors,
  touched,
  setFieldValue,
  locationList,
  haulerList,
  currentStep,
  isStepFourMandatory,
  setIsStepFourMandatory,
  jobSiteId,
  disabled = false,
  fields,
  title,
  isStepFour = false,
  dumpsterList,
  cameraData,
  alertData,
  className,
  isRequired = false,
}: Props) {
  const { renderField } = useWasteSteamForm({
    handleChange,
    values,
    touched,
    errors,
    setFieldValue,
    locationList,
    haulerList,
    jobSiteId,
    dumpsterList,
    cameraData,
    alertData,
  })

  return (
    <Row gutter={[24, 12]} className="py-4">
      {/* Only show title for current step */}
      {title && (
        <Col span={24} className="mt-5">
          <Title level={1}>
            {title}{' '}
            {isStepFour ? <span className="opacity-50">(Optional)</span> : ''}{' '}
          </Title>
          {isRequired && (
            <div className="validation-note">
              <span className={styles.asterisk}>*</span>
              <Text>{MESSAGES.REQUIRED_NOTE}</Text>
            </div>
          )}
        </Col>
      )}
      <Col span={24}>
        {disabled && <Divider dashed className="my-0 mb-5" />}
        <Row gutter={[24, 24]}>
          {fields.map((field) => (
            <Col
              span={field.span}
              key={field.name}
              xs={field.xs}
              sm={field.sm}
              md={field.md}
              lg={field.lg}
              xl={field.xl}
            >
              <Typography.Text className={field.labelClassName}>
                {field.isMandatory && !disabled && (
                  <span className={styles.asterisk}>*</span>
                )}
                {field.label}
              </Typography.Text>
              {renderField(
                field.type,
                field.name,
                field.placeholder,
                field.secondaryName,
                field.allowClear,
                field.isSelector,
                field.readOnly,
                field.disabled || disabled,
                field.suffix,
                field.isTooltip,
                field.ToolipComponent,
                field.className
              )}
            </Col>
          ))}
          {isStepFour && (
            <Col
              span={6}
              className={
                isStepFourMandatory
                  ? 'flex items-center justify-start mt-5'
                  : ''
              }
            >
              {isStepFour && !isStepFourMandatory && (
                <div className="flex flex-col items-end justify-center">
                  <h3 className="my-3 font-semibold">ADD A DESTINATION</h3>
                  <Button
                    type="primary"
                    className="size-60"
                    onClick={() => setIsStepFourMandatory(true)}
                  >
                    <PlusOutlined />
                  </Button>
                </div>
              )}
              {!disabled && isStepFour && isStepFourMandatory && (
                <CloseCircleOutlined
                  className={styles.del_icon}
                  onClick={() => setIsStepFourMandatory(false)}
                />
              )}
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default WasteStreamStep
