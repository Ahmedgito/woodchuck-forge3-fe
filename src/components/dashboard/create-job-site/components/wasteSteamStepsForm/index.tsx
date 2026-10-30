import { Button, Row, Steps, Typography } from 'antd'
import { Form, Formik, FormikErrors, FormikTouched, FormikValues } from 'formik'
import React, { useState, useEffect } from 'react'
import StepOne from './stepOne'
import {
  ADD_WASTE_STREAM_STEP_FOUR_SCHEMA,
  ADD_WASTE_STREAM_STEP_ONE_SCHEMA,
  ADD_WASTE_STREAM_STEP_THREE_SCHEMA,
  ADD_WASTE_STREAM_STEP_TWO_SCHEMA,
} from '@/src/utils/constants/schemas'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DUMPSTER_ALERT_TYPE,
  DUMPSTER_LOCATION_OPTIONS,
  DUMPSTER_LOCATION_TYPE,
  DUMPSTER_OPTIONS,
  HAULER_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import WasteStreamStep from './wasteStreamStep'
import {
  BUTTONS,
  getDynamicFormFields,
  WASTE_STREAM_STEPS,
} from '@/src/utils/constants/form-constants'
import {
  fetchdumpsterLocation,
  fetchUnassociatedCameraData,
} from '@/src/app/(app)/settings/dataFetchers'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { addDumpster } from '@/src/services/jobsite'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { createWasteStreamJobistes } from '@/src/services/global'
import { extractPayload } from '@/src/utils/functions/extractPayload'
import SecondaryButton from '@/src/components/common/secondaryButton'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

type Props = {
  dumpsterOptions: DUMPSTER_OPTIONS
  wasteStreamList: WASTE_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  jobSiteId: number | null | undefined
  haulerList: HAULER_TYPE[]
  setIsAddStreamOpen: (value: boolean) => void
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isRefreshing: boolean
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
}
type StepProps = {
  values: FormikValues
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FormikErrors<FormikValues>
  touched: FormikTouched<FormikValues>
  setFieldValue: (field: string, value: any) => void
}
const { Step } = Steps
const { Title } = Typography

function WasteStreamStepsForm({
  dumpsterOptions,
  wasteStreamList,
  locationList,
  jobSiteId,
  haulerList,
  setIsAddStreamOpen,
  setRefresh,
  isRefreshing,
  // cameraData,
  alertData,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isStepFourMandatory, setIsStepFourMandatory] = useState(false)
  const [dumpsterList, setDumpsterList] = useState<DUMPSTER_LOCATION_OPTIONS>(
    []
  )
  const [cameraData, setCameraData] = useState<CAMERA_DROPDOWN_TYPE[]>([])
  const [subLocationOpen, setSubLocationOpen] = useState<boolean>(false)
  const [defaultVesselLocation, setDefaultVesselLocation] = useState<
    number | null
  >(null)
  const [subLocationLoading, setSubLocationLoading] = useState<boolean>(false)
  const [isSublocationCreated, setIsSublocationCreated] =
    useState<boolean>(false)
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)
  const { setLoading } = useLoader()

  const getVesselLocationList = async () => {
    await fetchdumpsterLocation({
      setState: setDumpsterList,
      setLoading: setSubLocationLoading,
      triggerNotification: trigger,
      id: jobSiteId,
    })
  }

  const getUnassociatedCamerasData = async () => {
    await fetchUnassociatedCameraData({
      setState: setCameraData,
      setLoading: setLoading,
      triggerNotification: trigger,
      id: jobSiteId,
    })
  }

  useEffect(() => {
    if (jobSiteId) {
      getVesselLocationList()
      getUnassociatedCamerasData()
    }
  }, [jobSiteId])

  useEffect(() => {
    if (dumpsterList.length > 0) {
      setDefaultVesselLocation(
        dumpsterList.find((item) => item.isDefault === true)?.value as number
      )
    }
  }, [dumpsterList])
  const onChange = async (
    value: number,
    values: FormikValues,
    setErrors: (errors: FormikErrors<FormikValues>) => void,
    setTouched: (touched: FormikTouched<FormikValues>) => void
  ) => {
    if (value < currentStep) {
      setCurrentStep(value)
      return
    }
    const currentStepSchema = getValidationSchema(currentStep)
    try {
      if (currentStepSchema) {
        await currentStepSchema.validate(values, { abortEarly: false })
      }
      setCurrentStep(value)
    } catch (error: any) {
      // Create errors object and touched object for current step fields
      const errors: FormikErrors<FormikValues> = {}
      const touched: FormikTouched<FormikValues> = {}
      if (Array.isArray(error.inner)) {
        error.inner.forEach((error: any) => {
          errors[error.path] = error.message
          touched[error.path] = true
        })
      }

      // Set errors and touched state to display validation messages
      setErrors(errors)
      setTouched(touched)
    }
  }

  const upsertDumpsterLocation = async (
    subLocation: DUMPSTER_LOCATION_TYPE
  ) => {
    try {
      setSubLocationLoading(true)
      await addDumpster(jobSiteId, subLocation)
      setSubLocationLoading(false)
      setSubLocationOpen(false)
      setIsSublocationCreated(true)
      setTimeout(() => {
        setIsSublocationCreated(false)
      }, 3000)
      await getVesselLocationList()
    } catch (err) {
      setSubLocationLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  const handleSubLocation = () => {
    setSubLocationOpen(!subLocationOpen)
  }

  const onSubmit = async (values: FormikValues) => {
    const payload = extractPayload(values, jobSiteId)
    try {
      setLoading(true)
      await createWasteStreamJobistes(payload)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.WASTE_STREAM_SUCCESSFULLY_CREATED
      )
      setRefresh(true)
      setLoading(false)
      setIsAddStreamOpen(false)
    } catch (err: any) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  // Get validation schema for current step
  const getValidationSchema = (step: number) => {
    switch (step) {
      case 0:
        return ADD_WASTE_STREAM_STEP_ONE_SCHEMA
      case 1:
        return ADD_WASTE_STREAM_STEP_TWO_SCHEMA
      case 2:
        return ADD_WASTE_STREAM_STEP_THREE_SCHEMA
      case 3:
        return isStepFourMandatory ? ADD_WASTE_STREAM_STEP_FOUR_SCHEMA : null
      default:
        return
    }
  }

  const renderStep = (props: StepProps) => {
    const commonProps = {
      locationList,
      jobSiteId,
      haulerList,
      currentStep,
      isStepFourMandatory,
      setIsStepFourMandatory,
      dumpsterList,
      cameraData,
      alertData,
    }
    const steps = [
      <StepOne
        dumpsterOptions={dumpsterOptions}
        wasteStreamList={wasteStreamList}
        locationList={locationList}
        jobSiteId={jobSiteId}
        dumpsterList={dumpsterList}
        upsertDumpsterLocation={upsertDumpsterLocation}
        handleSubLocation={handleSubLocation}
        subLocationOpen={subLocationOpen}
        subLocationLoading={subLocationLoading}
        disabled={currentStep > 0}
        title={currentStep === 0 ? WASTE_STREAM_STEPS[0].title : null}
        isSublocationCreated={isSublocationCreated}
        key={0}
        {...props}
      />,
      <GenieButtonWrapper position="left" hint="camera_entry_fields" key={0}>
        <WasteStreamStep
          fields={getDynamicFormFields(
            1,
            props.values.cameraId ? false : true,
            !props.values.cameraId && currentStep <= 1 ? 'camera-disabled' : '',
            props.values.cameraId && currentStep <= 1 ? 'field-label' : ''
          )}
          disabled={currentStep > 1}
          title={currentStep === 1 ? WASTE_STREAM_STEPS[1].title : null}
          key={1}
          className={props.values.cameraId ? '' : 'camera-disabled'}
          isRequired={props.values.cameraId ? true : false}
          {...commonProps}
          {...props}
        />
      </GenieButtonWrapper>,
      <GenieButtonWrapper
        //position="left"
        hint="vessel_destination_entry_fields"
        key={2}
      >
        <WasteStreamStep
          fields={getDynamicFormFields(2, props.values.cameraId ? false : true)}
          disabled={currentStep > 2}
          title={currentStep === 2 ? WASTE_STREAM_STEPS[2].title : null}
          isStepFour={currentStep === 3}
          key={2}
          isRequired={true}
          {...commonProps}
          {...props}
        />
      </GenieButtonWrapper>,
    ]

    if (isStepFourMandatory) {
      steps.push(
        <WasteStreamStep
          fields={getDynamicFormFields(3)}
          disabled={currentStep > 3}
          title={currentStep === 3 ? WASTE_STREAM_STEPS[3].title : null}
          isStepFour={isStepFourMandatory}
          key={3}
          isRequired={false}
          {...commonProps}
          {...props}
        />
      )
    }

    if (currentStep === 4) {
      steps.push(
        <WasteStreamStep
          fields={[]}
          disabled={currentStep > 4}
          title={currentStep === 4 ? WASTE_STREAM_STEPS[4].title : null}
          key={4}
          {...commonProps}
          {...props}
        />
      )
    }

    return steps.slice(0, currentStep + 1)
  }
  return (
    <section className="container my-5">
      {defaultVesselLocation && (
        <Formik
          initialValues={{
            wastestreamsId: null,
            vesselId: null,
            vesselLocationId: defaultVesselLocation,
            co2: null,
          }}
          validationSchema={getValidationSchema(currentStep)}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            setErrors,
            setTouched,
          }) => {
            return (
              <Form className="step-form">
                <div className="form-section width">
                  <Steps
                    current={currentStep}
                    onChange={(value) => {
                      onChange(value, values, setErrors, setTouched)
                    }}
                    className="registration-steps"
                  >
                    {WASTE_STREAM_STEPS.map((step) => (
                      <Step key={step.title} />
                    ))}
                  </Steps>
                </div>

                {renderStep({
                  values,
                  handleChange,
                  handleBlur,
                  errors,
                  touched,
                  setFieldValue,
                })}
                <Row className="flex justify-end gap-10 mt-10 waste-stream-buttons">
                  {currentStep > 0 && (
                    <Button
                      onClick={() => {
                        onChange(currentStep - 1, values, setErrors, setTouched)
                      }}
                      className="px-10"
                      disabled={isRefreshing}
                    >
                      {BUTTONS.BACK}
                    </Button>
                  )}
                  {currentStep === 4 ? (
                    <SecondaryButton
                      type="default"
                      className="px-10"
                      onClick={() => {
                        onSubmit(values)
                      }}
                      disabled={isRefreshing}
                    >
                      {BUTTONS.SAVE}
                    </SecondaryButton>
                  ) : (
                    <SecondaryButton
                      className="px-10"
                      type="default"
                      onClick={() => {
                        onChange(currentStep + 1, values, setErrors, setTouched)
                      }}
                      disabled={isRefreshing}
                    >
                      {BUTTONS.NEXT}
                    </SecondaryButton>
                  )}
                </Row>
              </Form>
            )
          }}
        </Formik>
      )}
    </section>
  )
}

export default WasteStreamStepsForm
