import {
  VESSEL_FORM,
  MESSAGES,
  VESSEL_WEIGHT_TYPE,
  DATE_FORMAT,
} from '@/src/utils/constants/app-constants'
import {
  ADD_VESSEL_FORM_OPTIONS,
  BUTTONS,
} from '@/src/utils/constants/form-constants'
import { Button, Col, Row, Typography } from 'antd'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import styles from './styles.module.scss'
import RadioComponent from '@/src/components/shared/radio'
import { VESSEL_FORM_SCHEMA } from '@/src/utils/constants/schemas'
import InputComponent from '@/src/components/shared/input'
import { useLoader } from '@/src/utils/context/loader-context'
import {
  createWasteStreamDumpster,
  deleteDumpster,
  updateWasteStreamDumster,
} from '@/src/services/global'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import {
  DumpsterIconSolid,
  DumpsterIconStriped,
} from '@/src/components/appicons/icons'
import { JobSitesWasteStreamsDumpster } from '@/src/utils/constants/types'
import SecondaryButton from '@/src/components/common/secondaryButton'
import DeleteDumpster from './deleteDumpster'
import { dayjs } from '@/src/utils/functions/getDate'

type Props = {
  setIsAddVesselOpen: (_isOpen: boolean) => void
  subWasteStream: string | undefined
  colorCodeEst: string | undefined
  colorCodeReal: string | undefined
  jobSiteWastestreamsId: number | undefined
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
  vessel?: JobSitesWasteStreamsDumpster
  deletedAt?: string | null
  endDate: string
}

const { Title } = Typography

function VesselForm({
  setIsAddVesselOpen,
  subWasteStream,
  colorCodeEst,
  colorCodeReal,
  jobSiteWastestreamsId,
  setRefresh,
  isEdit,
  vessel,
  deletedAt,
  endDate,
}: Props) {
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [isDelete, setIsDelete] = useState(false)

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      const weightValue = values.weight ? parseFloat(values.weight) : null
      if (isEdit) {
        const payload = {
          real_weight: weightValue,
        }
        await updateWasteStreamDumster(vessel?.id as number, payload)
        triggerNotification(
          'success',
          MESSAGES.SUCCESS,
          MESSAGES.DUMPSTER_UPDATE
        )
      } else {
        const payload = {
          jobSiteWastestreamsId,
          real_weight: weightValue,
          no_of_dumpster: 1,
          creationDate: endDate
            ? dayjs().utc().isSame(dayjs(endDate).utc(), 'month')
              ? dayjs().utc().format(DATE_FORMAT.DATE_FORMAT_ISO)
              : endDate
            : dayjs().utc().format(DATE_FORMAT.DATE_FORMAT_ISO),
        }
        await createWasteStreamDumpster(payload)
        triggerNotification(
          'success',
          MESSAGES.SUCCESS,
          MESSAGES.DUMPSTER_CREATE
        )
      }
      setRefresh(true)
      setIsAddVesselOpen(false)
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

  const handleDeleteVessel = async (vesselId: number) => {
    try {
      setLoading(true)
      await deleteDumpster(vesselId)
      triggerNotification('success', MESSAGES.SUCCESS, MESSAGES.DUMPSTER_DELETE)
      setRefresh(true)
      setIsAddVesselOpen(false)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  return (
    <Formik
      initialValues={{
        weightType: isEdit
          ? vessel?.real_weight
            ? VESSEL_WEIGHT_TYPE.CONFIRMED
            : VESSEL_WEIGHT_TYPE.ESTIMATED
          : VESSEL_WEIGHT_TYPE.ESTIMATED,
        weight: isEdit ? vessel?.real_weight : null,
      }}
      validationSchema={VESSEL_FORM_SCHEMA}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => {
        const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFieldValue('weight', value === '' ? null : value)
          }
        }

        return (
          <Form className="vessel-modal">
            <div className="container my-5">
              <Title level={1}>
                {isEdit
                  ? VESSEL_FORM.EDIT_VESSEL_MAIN_HEADING
                  : VESSEL_FORM.ADD_VESSEL_MAIN_HEADING}
              </Title>
            </div>
            <Row className={styles.vesselContainer}>
              <Row gutter={[16, 16]} style={{ width: '80%', margin: 'auto' }}>
                <div className="flex flex-col gap-5 items-start">
                  <Title level={5}>{subWasteStream}</Title>
                  {values.weightType === VESSEL_WEIGHT_TYPE.CONFIRMED && (
                    <div className={`${styles.iconBox} icon-box`}>
                      <DumpsterIconSolid colorCode={colorCodeReal} />
                    </div>
                  )}
                  {values.weightType === VESSEL_WEIGHT_TYPE.ESTIMATED && (
                    <div className={`${styles.iconBox} icon-box`}>
                      <DumpsterIconStriped colorCode={colorCodeEst} />
                    </div>
                  )}
                </div>
                <Row
                  className={styles.vesselCard}
                  style={{ borderRadius: '4px', borderColor: '#CAC5CD' }}
                >
                  <Col xs={24} sm={12}>
                    <div className="flex flex-row gap-3 items-center justify-center">
                      <div className="flex flex-col justify-center text-center input-vessel">
                        <Typography.Text>WEIGHT</Typography.Text>
                        <InputComponent
                          type="number"
                          restrictNegativeValue={true}
                          name="weight"
                          onChange={handleWeightChange}
                          value={
                            values.weight !== null &&
                            values.weight !== undefined
                              ? values.weight
                              : ''
                          }
                          touched={touched}
                          placeholder={
                            values.weightType === VESSEL_WEIGHT_TYPE.CONFIRMED
                              ? '0'
                              : '--'
                          }
                          errors={errors}
                          disabled={
                            values.weightType === VESSEL_WEIGHT_TYPE.ESTIMATED
                          }
                          step="0.01"
                        />
                      </div>
                      <Typography.Text className="tons mt-4">
                        Tons
                      </Typography.Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <RadioComponent
                      options={ADD_VESSEL_FORM_OPTIONS}
                      onChange={(e) => {
                        e.target.value === VESSEL_WEIGHT_TYPE.CONFIRMED
                          ? setFieldValue('weight', vessel?.real_weight)
                          : setFieldValue('weight', null)
                        setFieldValue('weightType', Number(e.target.value))
                      }}
                      name="weightType"
                      value={values.weightType}
                      errors={errors}
                      touched={touched}
                      showError={true}
                    />
                  </Col>
                </Row>
                {values.weightType === VESSEL_WEIGHT_TYPE.ESTIMATED && (
                  <div className="w-20 ml-10">
                    <Typography.Text className="font-inter colorTextHeading">
                      {VESSEL_FORM.INFO_CONTENT}
                    </Typography.Text>
                  </div>
                )}
              </Row>
            </Row>

            <Row className="flex justify-end gap-10 mt-10 vessel-btns">
              <Button
                onClick={() => setIsAddVesselOpen(false)}
                className="px-10"
              >
                {BUTTONS.CANCEL}
              </Button>
              {isEdit && !deletedAt && (
                <>
                  {isDelete ? (
                    <div className="relative">
                      <DeleteDumpster setIsDelete={setIsDelete} />
                      <Button
                        type="default"
                        danger
                        className="px-10"
                        onClick={() => handleDeleteVessel(vessel?.id as number)}
                      >
                        {`Yes, ${BUTTONS.DELETE} Vessel`}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="default"
                      danger
                      className="px-10"
                      onClick={() => setIsDelete(true)}
                    >
                      {`${BUTTONS.DELETE} Vessel`}
                    </Button>
                  )}
                </>
              )}
              <SecondaryButton
                type="default"
                className="px-10"
                htmlType="submit"
              >
                {BUTTONS.SAVE}
              </SecondaryButton>
            </Row>
          </Form>
        )
      }}
    </Formik>
  )
}

export default VesselForm
