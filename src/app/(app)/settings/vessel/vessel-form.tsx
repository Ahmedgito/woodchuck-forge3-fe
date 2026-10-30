import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, FieldArray, FormikTouched, FormikErrors } from 'formik'
import { Button, Input, Typography } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getVessels, saveVessel } from '@/src/services/global'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { VESSEL_SCHEMA } from '@/src/utils/constants/schemas'
import {
  OptionPayload,
  VesselFormValues,
  VesselPayload,
} from '@/src/utils/constants/types'
import SecondaryButton from '@/src/components/common/secondaryButton'
const { Text } = Typography
export default function VesselForm() {
  const optionRefs = useRef<any[][]>([])
  const [initialValues, setInitialValues] = useState({
    vessels: [{ name: '', options: [{ value: null, disabled: false }] }], // fallback
  })

  const focusOption = (vesselIdx: number, optionIdx: number) => {
    const inputInstance = optionRefs.current[vesselIdx]?.[optionIdx]
    if (inputInstance) {
      if (typeof inputInstance.focus === 'function') {
        inputInstance.focus()
      } else if (inputInstance.input?.focus) {
        inputInstance.input.focus()
      }
    }
  }
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const getVesselsList = async () => {
    try {
      setLoading(true)
      const result = await getVessels()
      // Map backend shape to Formik shape
      const mapped = {
        vessels: result.data.data.map((v: VesselPayload) => {
          const options = v.options.map((opt: OptionPayload) => ({
            id: opt.id,
            value: opt.value,
            disabled: opt?.disabled,
          }))

          // ✅ Always keep 1 empty option if less than 6
          if (options.length < 6) {
            options.push({ id: undefined, value: null, disabled: false })
          }

          return {
            id: v.id,
            name: v.name,
            options,
          }
        }),
      }
      setInitialValues(mapped)
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
  useEffect(() => {
    getVesselsList()
  }, [])

  const onSubmit = async (values: VesselFormValues): Promise<void> => {
    try {
      setLoading(true)

      const payload: { vessels: VesselPayload[] } = {
        vessels: values.vessels.map((v) => ({
          ...(v.id ? { id: v.id } : {}), // only include id if exists
          name: v.name,
          options: v.options
            .filter((o) => o.value !== null) // ✅ skip empty placeholder
            .map((o) => ({
              ...(o.id ? { id: o.id } : {}),
              value: o.value!,
            })),
        })),
      }

      await saveVessel(payload)

      triggerNotification('success', MESSAGES.SUCCESS, MESSAGES.VESSEL_UPDATE)
      getVesselsList()
    } catch (err: any) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={VESSEL_SCHEMA}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm,
        dirty,
        isSubmitting,
      }) => (
        <Form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        >
          <FieldArray name="vessels">
            {({ push: pushVessel, remove: removeVessel }) => (
              <div>
                {values?.vessels?.map((vessel, vIdx) => (
                  <div key={vIdx} className="vesselCard">
                    {/* Vessel Name */}
                    <div className="flexColumn">
                      <label>Vessel Name</label>
                      <Input
                        className="vessel-large-input"
                        name={`vessels[${vIdx}].name`}
                        value={vessel.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Vessel Name"
                      />
                      {(touched.vessels?.[vIdx] as any)?.name &&
                        (errors.vessels?.[vIdx] as any)?.name && (
                          <Typography.Text className="error-label">
                            {(errors.vessels?.[vIdx] as any)?.name}
                          </Typography.Text>
                        )}
                    </div>

                    {/* Options */}
                    <FieldArray name={`vessels[${vIdx}].options`}>
                      {({ push, remove }) => (
                        <>
                          {vessel.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flexColumn">
                              <label>YRD</label>
                              <Input
                                name={`vessels[${vIdx}].options[${oIdx}].value`}
                                type="number"
                                value={opt.value ?? ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={'0'}
                                style={{ width: '80px' }}
                                disabled={opt.disabled}
                                ref={(el) => {
                                  if (!optionRefs.current[vIdx])
                                    optionRefs.current[vIdx] = []
                                  optionRefs.current[vIdx][oIdx] = el as any
                                }}
                                onPressEnter={() => {
                                  if (opt.value === 0) {
                                    // Remove this option if value is 0
                                    remove(oIdx)
                                    setTimeout(() => {
                                      // Focus previous option if exists
                                      if (oIdx > 0) focusOption(vIdx, oIdx - 1)
                                    }, 0)
                                  } else if (
                                    oIdx === vessel.options.length - 1 &&
                                    vessel.options.length < 6 &&
                                    opt.value !== null &&
                                    opt.value !== undefined
                                  ) {
                                    push({ value: null })
                                    setTimeout(() => {
                                      focusOption(vIdx, oIdx + 1)
                                    }, 0)
                                  }
                                }}
                              />
                              {(
                                touched.vessels?.[
                                  vIdx
                                ] as FormikTouched<VesselPayload>
                              )?.options &&
                                (errors.vessels?.[vIdx] as any)?.options &&
                                typeof (
                                  errors.vessels?.[
                                    vIdx
                                  ] as FormikErrors<VesselPayload>
                                )?.options === 'string' && (
                                  <Typography.Text className="error-label">
                                    {
                                      (
                                        errors.vessels?.[
                                          vIdx
                                        ] as FormikErrors<VesselPayload>
                                      )?.options as string[]
                                    }
                                  </Typography.Text>
                                )}
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>

                    {!('id' in vessel) && (
                      <div className="flex justify-center align-center mt-6 form-delete-button">
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeVessel(vIdx)}
                          className="text-red-500 mt-2"
                          title="Remove Vessel"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Vessel Button */}
                <div className="flexColumn add-another-vessel-container">
                  <Text className="add-another-vessel">
                    {MESSAGES.ADD_ANOTHER_VESSEL_TYPE}
                  </Text>
                  <SecondaryButton
                    className="add-another-vessel-button"
                    onClick={() =>
                      pushVessel({ name: '', options: [{ value: null }] })
                    }
                  >
                    +
                  </SecondaryButton>
                </div>
              </div>
            )}
          </FieldArray>

          {/* Save / Cancel */}
          <div className="text-right button-container mt-5 mb-6">
            <Button
              disabled={!dirty || isSubmitting}
              htmlType="button"
              onClick={() => resetForm()}
            >
              {MESSAGES.CANCEL}
            </Button>
            <SecondaryButton
              disabled={!dirty || isSubmitting}
              type="default"
              htmlType="submit"
            >
              {MESSAGES.SAVE}
            </SecondaryButton>
          </div>
        </Form>
      )}
    </Formik>
  )
}
