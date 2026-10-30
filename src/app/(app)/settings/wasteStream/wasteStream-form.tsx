'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import { Button, Col, Input, Row, Steps, Typography } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import InputComponent from '@/src/components/shared/input'
import ColorPickerField from '@/src/components/colorPicker'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getWasteStreams, updateWasteStreams } from '@/src/services/global'
import styles from './style.module.scss'
import SecondaryButton from '@/src/components/common/secondaryButton'
import {
  colorPickerFields,
  MESSAGES,
  WASTE_STREAM_STRINGS,
  WOOD_WASTE_STEPS,
} from '@/src/utils/constants/app-constants'
import {
  WasteStreamFormType,
  WoodWasteVessel,
} from '@/src/utils/constants/types'
import { WASTE_STREAM_SCHEMA } from '@/src/utils/constants/schemas'
import { WASTE_STREAM_FORM_INITIAL_VALUES } from '@/src/utils/constants/form-constants'
import {
  mapWasteStreamPayload,
  mergeWasteStreamTypesWithVessels,
} from '@/src/utils/functions/wasteStreamFormMappers'
import { toProperCase } from '@/src/utils/functions/getValueWithArticle'

const { Title, Text } = Typography
const { Step } = Steps

export default function WasteStreamStepper({
  setIsModalOpen,
  onRefresh,
  id,
  vessels,
}: {
  setIsModalOpen: (_value: boolean) => void
  onRefresh: () => void
  id: number | undefined
  vessels: WoodWasteVessel[]
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [wasteStreamObject, setWasteStreamObject] = useState({
    ...WASTE_STREAM_FORM_INITIAL_VALUES,
    wasteStreamTypes: [],
  })

  const getWasteStreamData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getWasteStreams(id)
      const data = result.data?.data || {}

      const mergedWasteStreamTypes = mergeWasteStreamTypesWithVessels(
        data.wasteStreamTypes ?? [],
        vessels ?? []
      )

      setWasteStreamObject({
        ...data,
        wasteStreamTypes: mergedWasteStreamTypes,
      })

      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_CLIENT
      )
    }
  }

  useEffect(() => {
    if (id && vessels && vessels.length) {
      getWasteStreamData(id)
    }
  }, [id, vessels])

  const handleSubmit = async (values: WasteStreamFormType) => {
    const payload = mapWasteStreamPayload(values)
    try {
      setLoading(true)
      await updateWasteStreams(id, payload)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.WASTE_STREAM_SUCCESSFULLY_UPDATED
      )
      onRefresh()
      setIsModalOpen(false)
    } catch (err) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setLoading(false)
    }
  }

  const subTypesRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (subTypesRef.current && scrollContainerRef.current) {
        const rect = subTypesRef.current.getBoundingClientRect()
        const containerRect = scrollContainerRef.current.getBoundingClientRect()
        if (rect.top <= containerRect.top + 50) {
          setCurrentStep(1)
        } else {
          setCurrentStep(0)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const renderForm = (formikProps: any, push: any, remove: any) => {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } =
      formikProps

    return (
      <>
        <div
          className={`${styles.editWoodWasteModal} ${
            currentStep === 0 ? styles.activeBg : ''
          }`}
        >
          {/* Step 1 */}
          {values.name && (
            <Title level={1} className={styles.mainHeading}>
              {currentStep === 0
                ? `Edit your ${toProperCase(values.name)}`
                : `Add a Sub-Type to ${toProperCase(values.name)}`}
            </Title>
          )}

          <div className={styles.scrollBarInner} ref={scrollContainerRef}>
            <div className="mt-8 mb-8">
              {values.name && (
                <Title className={styles.subHeading} level={4}>
                  {toProperCase(values.name)}
                </Title>
              )}
              <Row gutter={16} className="mt-4">
                <Col xs={8} sm={8} md={6} lg={6} xl={6}>
                  <label>{WASTE_STREAM_STRINGS.WASTE_STREAM_NAME}</label>
                  <InputComponent
                    disabled
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </Col>
                {colorPickerFields.map((field) => (
                  <Col xs={8} sm={8} md={4} lg={4} xl={4} key={field.name}>
                    <label>{field.label}</label>
                    <ColorPickerField
                      style={{
                        borderColor: '#462C75',
                        height: '40px',
                        backgroundColor: '#F2EFF5',
                        width: '100%',
                      }}
                      name={field.name}
                      label={''}
                    />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Step 2 */}
            <div ref={subTypesRef}>
              <Title className={`${styles.subHeading} sticky-header`} level={4}>
                {MESSAGES.SUB_TYPES}
              </Title>

              {values.wasteStreamTypes.map((sub: any, index: number) => (
                <div
                  key={index}
                  className="section-divider"
                  data-row-index={index}
                >
                  <Row gutter={16} align="bottom">
                    <Col xs={7} sm={7} md={5} lg={5} xl={5} className="pb-8">
                      <label>{MESSAGES.SUB_TYPE_NAME}</label>
                      <Input
                        name={`wasteStreamTypes[${index}].name`}
                        placeholder="Material or Sub-Type"
                        value={sub.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {(touched.wasteStreamTypes?.[index] as any)?.name &&
                        (errors.wasteStreamTypes?.[index] as any)?.name && (
                          <Typography.Text className="error-label absolute w-full left-5 bottom-0">
                            {(errors.wasteStreamTypes?.[index] as any)?.name}
                          </Typography.Text>
                        )}
                    </Col>
                    <Col xs={7} sm={7} md={4} lg={4} xl={4} className="pb-8">
                      <label>Color Code EST</label>
                      <ColorPickerField
                        style={{
                          borderColor: '#462C75',
                          height: '40px',
                          backgroundColor: '#F2EFF5',
                          width: '100%',
                        }}
                        name={`wasteStreamTypes[${index}].colorCodeEst`}
                        label=""
                      />
                    </Col>
                    <Col xs={7} sm={7} md={4} lg={4} xl={4} className="pb-8">
                      <label>Color Code REAL</label>
                      <ColorPickerField
                        style={{
                          borderColor: '#462C75',
                          height: '40px',
                          backgroundColor: '#F2EFF5',
                          width: '100%',
                        }}
                        name={`wasteStreamTypes[${index}].colorCodeReal`}
                        label=""
                      />
                    </Col>
                    <Col
                      xs={3}
                      sm={3}
                      md={1}
                      lg={1}
                      xl={1}
                      className="flex items-end pb-9"
                    >
                      {!sub?.isAssociatedWithJobSiteWasteStreams && (
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700"
                          style={{ padding: '4px 8px' }}
                        />
                      )}
                    </Col>
                  </Row>

                  {/* Vessel Types */}
                  <Row className="mt-10 mb-3">
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label>{MESSAGES.VESSEL_TYPES}</label>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label>{MESSAGES.TONNAGE}</label>
                    </Col>
                  </Row>

                  {sub.vessels?.map((v: any, vIdx: number) => (
                    <Row
                      key={v.id || vIdx}
                      align="middle"
                      gutter={8}
                      className="mb-4"
                    >
                      <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
                      <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            defaultChecked={!!v.enabled}
                            disabled={v.disabled}
                            onChange={(e) =>
                              setFieldValue(
                                `wasteStreamTypes[${index}].vessels[${vIdx}].enabled`,
                                e.target.checked
                              )
                            }
                          />
                          &nbsp;{v?.name}
                        </label>
                      </Col>

                      <Col xs={5} sm={5} md={2} lg={2} xl={2}>
                        {v.enabled && (
                          <Input
                            type="number"
                            placeholder="0"
                            value={v.tons}
                            step="0.01"
                            onChange={(e) =>
                              setFieldValue(
                                `wasteStreamTypes[${index}].vessels[${vIdx}].tons`,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </Col>
                      <Col xs={5} sm={5} md={3} lg={3} xl={3}>
                        {v.enabled && (
                          <span className={styles.ton}>ton / yrd</span>
                        )}
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <Formik
      initialValues={wasteStreamObject}
      validationSchema={WASTE_STREAM_SCHEMA}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <Form className="step-form">
          <div className="form-section width for-estimate-dumpster">
            <Steps className="registration-steps" current={currentStep}>
              {WOOD_WASTE_STEPS.map((step) => (
                <Step key={step.title} />
              ))}
            </Steps>
          </div>

          <FieldArray name="wasteStreamTypes">
            {({ push, remove }) => (
              <>
                {renderForm(formikProps, push, remove)}

                <Title className={styles.addSubType} level={5}>
                  ADD Another Sub-Type
                </Title>
                <div
                  className={`${styles.editBtns} mt-2 flex gap-10 justify-end`}
                >
                  <SecondaryButton
                    className={styles.addButton}
                    type="default"
                    onClick={() => {
                      setCurrentStep(1)
                      const newIndex =
                        formikProps.values.wasteStreamTypes.length
                      push({
                        name: '',
                        colorCodeEst: '#000000',
                        colorCodeReal: '#000000',
                        vessels: (vessels || []).map((mv: any) => ({
                          vesselId: mv.id,
                          name: mv.name,
                          enabled: false,
                          tons: '',
                        })),
                      })

                      // Auto-scroll to the newly added row
                      requestAnimationFrame(() => {
                        const newRowElement = document.querySelector(
                          `[data-row-index="${newIndex}"]`
                        ) as HTMLElement
                        if (newRowElement && scrollContainerRef.current) {
                          newRowElement.scrollIntoView({
                            behavior: 'auto',
                            block: 'start',
                          })
                          requestAnimationFrame(() => {
                            if (scrollContainerRef.current) {
                              scrollContainerRef.current.scrollTop -= 80
                            }
                          })
                        }
                      })
                    }}
                  >
                    +
                  </SecondaryButton>

                  <Button
                    className={styles.saveBtns}
                    type="default"
                    htmlType="submit"
                  >
                    {MESSAGES.SAVE}
                  </Button>
                </div>
              </>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  )
}
