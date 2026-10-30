import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  HAULER_TYPE,
} from '@/src/utils/constants/types'
import { useWasteSteamForm } from '@/src/utils/hooks/wasteSteamForm'
import { Col, Input, Popover, Row, Typography, Image } from 'antd'
import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import React, { useEffect, useState } from 'react'
import ConfirmationModal from '@/src/components/jobSiteDetails/components/modal/closeJobSiteModal'
import { deleteWasteStreamJobistes } from '@/src/services/global'
import {
  MESSAGES,
  WHITELISTED_WASTE_STREAMS,
} from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import WasteStreamCardTooltip from '../wasteSteamCardTooltip'
import styles from './style.module.scss'
import SecondaryButton from '@/src/components/common/secondaryButton'

type Props = {
  dumpsterList: DROP_DOWN_OPTIONS
  locationList: COMBINED_LOCATION_TYPE[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: FormikValues
  touched: FormikTouched<FormikValues>
  errors: FormikErrors<FormikValues>
  setFieldValue: (field: string, value: any) => void
  haulerList: HAULER_TYPE[]
  jobSiteId: number | null | undefined
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  id: number | null | undefined
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  setEditableItemId: React.Dispatch<React.SetStateAction<number | null>>
}

const NumberInput: React.FC<{
  name: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  values: FormikValues
  touched: { [key: string]: any }
  errors: { [key: string]: any }
}> = ({ name, handleChange, values, touched, errors, ...props }) => {
  return (
    <div className="flex flex-col">
      <Input
        {...props}
        type="number"
        className={styles.block_input}
        min={0}
        max={100}
        name={name}
        onChange={handleChange}
        value={values[name]}
        suffix={'%'}
      />
      {errors[name] && touched[name] && (
        <Typography.Text className="error-label">
          {errors[name]}
        </Typography.Text>
      )}
    </div>
  )
}

function EditWasteStreamForm({
  dumpsterList,
  locationList,
  handleChange,
  values,
  touched,
  errors,
  setFieldValue,
  haulerList,
  jobSiteId,
  cameraData,
  alertData,
  id,
  setRefresh,
  setEditableItemId,
}: Props) {
  const [fields, setFields] = useState<
    {
      name: string
      label: string
      span: number
      type: string
      placeholder: string
      allowClear: boolean
      secondaryName?: string
      isSelector?: boolean
      readOnly?: boolean
      disabled?: boolean
      suffix?: string
      className?: string
    }[]
  >([])
  const [confirmationModal, setConfirmationModal] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    let fields = [
      {
        name: 'alertId',
        label: 'Alert',
        type: 'selector',
        placeholder: 'Alert',
        isSelector: true,
        allowClear: false,
        span: 18,
      },
      {
        name: 'vessel',
        label: 'Vessel',
        type: 'number',
        placeholder: 'Vessel',
        span: 11,
        allowClear: false,
        readOnly: true,
        className: 'value-edit',
      },
      ...(Object.values(WHITELISTED_WASTE_STREAMS).includes(
        values.wastestreamsId as number
      )
        ? [
            {
              name:
                values.wastestreamsId === WHITELISTED_WASTE_STREAMS.WOOD_WASTE
                  ? 'co2'
                  : 'recycling_rebate',
              label:
                values.wastestreamsId === WHITELISTED_WASTE_STREAMS.WOOD_WASTE
                  ? 'CO₂ Credit'
                  : 'Recycling Rebate',
              type: 'number',
              placeholder: '0',
              span: 7,
              allowClear: false,
              suffix: '$/ton',
              className: 'co2-edit',
            },
            {
              name: 'reports_enabled',
              label: '',
              placeholder: '',
              type: 'switch',
              span: 6,
              allowClear: false,
              disabled: false,
              className: 'text-right switch-text',
            },
          ]
        : []),
      {
        name: 'vesselLocationId',
        label: 'Vessel Location',
        type: 'selector',
        placeholder: 'Vessel Location',
        isSelector: true,
        allowClear: false,
        span: 18,
      },
      {
        name: 'distance',
        label: 'Distance',
        type: 'number',
        placeholder: 'MILES',
        readOnly: true,
        allowClear: false,
        span: 12,
        className: 'value-edit',
      },
      {
        name: 'locationName',
        label: 'Processing Location',
        type: 'number',
        placeholder: 'Location',
        readOnly: true,
        allowClear: false,
        span: 12,
        className: 'value-edit',
      },
      {
        name: 'haulerId',
        label: 'Hauler',
        type: 'selector',
        placeholder: 'Select Hauler',
        isSelector: true,
        allowClear: true,
        span: 18,
      },
    ]

    let endPointFields = [
      {
        name: 'distance_2',
        label: 'Distance To',
        type: 'number',
        placeholder: 'MILES',
        readOnly: true,
        allowClear: false,
        span: 12,
        className: 'value-edit',
      },
      {
        name: 'endPoint',
        label: 'End Point',
        type: 'number',
        placeholder: 'Location',
        readOnly: true,
        allowClear: false,
        span: 12,
        className: 'value-edit',
      },
      {
        name: 'haulerId_2',
        label: 'Hauler',
        type: 'selector',
        placeholder: 'Select Hauler',
        isSelector: true,
        allowClear: true,
        span: 18,
      },
    ]

    if (values.isEndPoint) {
      fields = [...fields, ...endPointFields] as any
    }
    setFields(fields)
  }, [])

  const handleConfirmationModal = () => {
    setConfirmationModal(!confirmationModal)
  }

  const handleDeleteDumpster = async () => {
    try {
      setLoading(true)
      handleConfirmationModal()
      await deleteWasteStreamJobistes(id)
      setRefresh(true)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.WASTE_STREAM_SUCCESSFULLY_DELETED
      )
      setEditableItemId(null)
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

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
    <>
      <Row gutter={[16, 24]}>
        <ConfirmationModal
          isOpen={confirmationModal}
          setIsModalOpen={setConfirmationModal}
          onConfirmation={handleDeleteDumpster}
          closeButtonText={'Yes'}
          keepButtonText={'No'}
          title="Sure you want to delete this waste stream?"
          cssClass="modal-lg new-modal-box"
        />
        <Col span={24}>
          <Row gutter={[16, 24]}>
            <Col span={22} className="flex flex-col gap-2 level-main">
              <div className="flex flex-row gap-2 items-center level">
                <Typography.Text>Fill Level Max: </Typography.Text>
                <NumberInput
                  name="fillLevel"
                  handleChange={handleChange}
                  values={values}
                  touched={touched}
                  errors={[]}
                />
              </div>
              <div className="flex flex-row gap-2 items-center level">
                <Typography.Text>
                  Content Confidence Level Min:{' '}
                </Typography.Text>
                <NumberInput
                  name="confidenceLevel"
                  handleChange={handleChange}
                  values={values}
                  touched={touched}
                  errors={[]}
                />
              </div>
            </Col>
            <Col span={2} className="flex justify-end items-end info-icon-main">
              <Popover content={<WasteStreamCardTooltip />}>
                <Image
                  src={'/images/chart/info-icon.svg'}
                  preview={false}
                  className="cursor-pointer mt-2 info-icon"
                />
              </Popover>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        {fields.map((field, index) => (
          <Col span={field.span} key={field.name} className={`cols-${index}`}>
            <Typography.Text className="font-medium text-uppercase">
              {field.label}
            </Typography.Text>
            {renderField(
              field.type,
              field.name,
              field.placeholder,
              field.secondaryName ?? '',
              field.allowClear,
              field.isSelector,
              field.readOnly,
              field.disabled,
              field.suffix,
              false,
              null,
              field.className || ''
            )}
          </Col>
        ))}
        <Col span={24} className="mt-7">
          <SecondaryButton
            type="default"
            className="w-full"
            onClick={handleConfirmationModal}
          >
            Delete Waste Stream
          </SecondaryButton>
        </Col>
      </Row>
    </>
  )
}

export default EditWasteStreamForm
