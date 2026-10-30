import InputComponent from '@/src/components/shared/input'
import SelectComponent from '@/src/components/shared/select'
import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import React, { useEffect, useState } from 'react'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  HAULER_TYPE,
} from '../constants/types'
import { dropDownMapper } from '../functions/mappers'
import {
  transformAlertData,
  transformCameraData,
  transformLocationList,
} from '../functions/htmlMappers'
import { useTriggerNotification } from '../context/notification-context'
import { createTriggerNotification } from '../functions/notificationUtils'

import { Switch, Typography } from 'antd'
import { FORM_LABELS } from '../constants/form-constants'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: FormikValues
  touched: FormikTouched<FormikValues>
  errors: FormikErrors<FormikValues>
  setFieldValue: (field: string, value: any) => void
  locationList: COMBINED_LOCATION_TYPE[]
  haulerList: HAULER_TYPE[]
  jobSiteId: number | null | undefined
  dumpsterList: DROP_DOWN_OPTIONS
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  className?: string | undefined
}

export const useWasteSteamForm = ({
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
}: Props) => {
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)
  const [options, setOptions] = useState<{}>({})

  useEffect(() => {
    const data = {
      haulerId: dropDownMapper(haulerList),
      locationId: transformLocationList(locationList),
      haulerId_2: dropDownMapper(haulerList),
      locationId_2: transformLocationList(locationList),
      alertId: transformAlertData(alertData),
      cameraId: transformCameraData(cameraData).filter(
        (camera) => camera.value !== values.additionalCameraId
      ),
      additionalCameraId: transformCameraData(cameraData).filter(
        (additionalCamera) => additionalCamera.value !== values.cameraId
      ),
      vesselLocationId: dumpsterList,
    }
    setOptions(data)
  }, [haulerList, locationList, alertData, cameraData, dumpsterList, values])

  const renderField = (
    type: string,
    name: string,
    placeholder: string,
    secondaryName: string = '',
    allowClear: boolean,
    isSelector: boolean = false,
    readOnly: boolean = false,
    disabled: boolean = false,
    suffix: string = '',
    isTooltip: boolean = false,
    ToolipComponent: React.ReactNode = null,
    className: string = ''
  ) => {
    console.log('🚀 ~ renderField ~ name:', name)

    switch (type) {
      case 'number':
        return (
          <>
            {readOnly ? (
              <div>
                <Typography.Text className={`text-uppercase ${className}`}>
                  {values[name]}
                </Typography.Text>
              </div>
            ) : (
              <>
                {name === 'fillLevel' ? (
                  <GenieButtonWrapper hint="fill_level_max" position="bottom">
                    <InputComponent
                      type="number"
                      restrictNegativeValue={true}
                      name={name}
                      onChange={handleChange}
                      value={values[name]}
                      touched={touched}
                      placeholder={placeholder}
                      errors={errors}
                      className={`form_select ${className}`}
                      disabled={disabled}
                      {...{
                        suffix: suffix,
                      }}
                    />
                    {isTooltip && ToolipComponent}
                  </GenieButtonWrapper>
                ) : (
                  <>
                    <InputComponent
                      type="number"
                      restrictNegativeValue={true}
                      name={name}
                      onChange={handleChange}
                      value={values[name]}
                      touched={touched}
                      placeholder={placeholder}
                      errors={errors}
                      className={`form_select ${className}`}
                      disabled={disabled}
                      {...{
                        suffix: suffix,
                      }}
                    />
                    {isTooltip && ToolipComponent}
                  </>
                )}
              </>
            )}
          </>
        )
      case 'selector':
        return (
          <>
            {isSelector ? (
              <SelectComponent
                name={name}
                errors={errors}
                touched={touched}
                showError={true}
                value={values[name]}
                className={`form_select ${className}`}
                onChange={(e) => {
                  setFieldValue(name, e)
                }}
                options={options[name as keyof typeof options]}
                placeholder={placeholder}
                disabled={disabled}
                allowClear={allowClear}
                onClear={() => {
                  setFieldValue(name, null)
                  // Reset fill level, confidence level, and alert when camera is removed
                  if (name === 'cameraId') {
                    setFieldValue('fillLevel', null)
                    setFieldValue('confidenceLevel', null)
                    setFieldValue('alertId', null)
                  }
                }}
              />
            ) : (
              <SelectComponent
                name={values[secondaryName] ? name : secondaryName}
                errors={errors}
                touched={touched}
                showError={true}
                value={
                  values[name]
                    ? `${values[name]}_2`
                    : values[secondaryName]
                      ? `${values[secondaryName]}_1`
                      : null
                }
                className={`form_select ${className}`}
                onChange={(e) => {
                  const [id, entityType] = e.split('_')
                  const selectedOption = locationList.find(
                    (item) =>
                      item.id === Number(id) &&
                      item.entityType === Number(entityType)
                  )
                  if (selectedOption) {
                    if (selectedOption.entityType === 2) {
                      setFieldValue(name, id)
                      setFieldValue(secondaryName, null)
                    } else if (selectedOption.entityType === 1) {
                      setFieldValue(secondaryName, id)
                      setFieldValue(name, null)
                    }
                  }
                }}
                options={options[name as keyof typeof options]}
                placeholder={placeholder}
                disabled={disabled}
              />
            )}
          </>
        )

      case 'switch':
        return (
          <div className={`${className}`}>
            <Switch
              onChange={(e) => {
                setFieldValue(name, e)
              }}
              checked={values[name]}
              disabled={disabled}
            />
            {!disabled && (
              <Typography.Text className="font-medium">
                {FORM_LABELS.DISPLAY_ONLY}
              </Typography.Text>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return {
    renderField,
  }
}
