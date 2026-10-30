import React from 'react'
import { Button, Row, Col, Typography } from 'antd'
import { Formik, Form, FieldArray, getIn } from 'formik'
import InputComponent from '@/src/components/shared/input'
import RadioComponent from '@/src/components/shared/radio'
import {
  ADD_VESSEL_FORM_OPTIONS,
  BUTTONS,
} from '@/src/utils/constants/form-constants'
import {
  VESSEL_WEIGHT_TYPE,
  MESSAGES,
  DATE_FORMAT,
  VESSEL_FORM,
} from '@/src/utils/constants/app-constants'
import { wasteStreamDumpstersBulkCreate } from '@/src/services/global'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { dayjs } from '@/src/utils/functions/getDate'
import styles from '../styles.module.scss'
import {
  DumpsterIconSolid,
  DumpsterIconStriped,
} from '@/src/components/appicons/icons'
import SecondaryButton from '@/src/components/common/secondaryButton'
import { VESSEL_DETAILS_SCHEMA } from '@/src/utils/constants/schemas'
import { MinusCircleOutlined } from '@ant-design/icons'

const { Title } = Typography

type Props = {
  vesselCount: number
  jobSiteWastestreamsId?: number
  setIsAddVesselOpen: (_isOpen: boolean) => void
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  onBack: () => void
  endDate: string
  colorCodeReal?: string
  colorCodeEst?: string
  subWasteStream?: string
}

export default function VesselDetailsStep({
  vesselCount,
  jobSiteWastestreamsId,
  setIsAddVesselOpen,
  setRefresh,
  onBack,
  endDate,
  colorCodeEst,
  colorCodeReal,
  subWasteStream,
}: Props) {
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()

  const initialValues = {
    vessels: Array.from({ length: vesselCount }, () => ({
      weightType: VESSEL_WEIGHT_TYPE.ESTIMATED,
      weight: null,
    })),
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true)
      const payload = {
        dumpsters: values.vessels.map((v) => ({
          jobSiteWastestreamsId, // directly include it here
          creationDate: endDate
            ? dayjs().utc().isSame(dayjs(endDate).utc(), 'month')
              ? dayjs().utc().format(DATE_FORMAT.DATE_FORMAT_ISO)
              : endDate
            : dayjs().utc().format(DATE_FORMAT.DATE_FORMAT_ISO),
          real_weight: v.weight ? parseFloat(v.weight) : null,
        })),
      }
      await wasteStreamDumpstersBulkCreate(payload)
      triggerNotification('success', MESSAGES.SUCCESS, MESSAGES.DUMPSTER_CREATE)
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={VESSEL_DETAILS_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className={`vessel-modal ${styles.addVesselStep2}`}>
          <Title level={5} className={`mb-6 ${styles.borderBottom}`}>
            {subWasteStream}
          </Title>
          <div className={styles.vesselScrollContainer}>
            <FieldArray name="vessels">
              {({ remove }) =>
                values.vessels.map((v, i) => {
                  const fieldName = `vessels.${i}.weight`
                  const flatErrors = { [fieldName]: getIn(errors, fieldName) }
                  const flatTouched = { [fieldName]: getIn(touched, fieldName) }

                  return (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <Row gutter={16} align="middle">
                        <Col xs={4} sm={5} md={4} lg={4} xl={4} xxl={4}>
                          <div className="flex flex-col gap-5 items-start">
                            {v.weightType === VESSEL_WEIGHT_TYPE.CONFIRMED && (
                              <div className={`${styles.iconBox} icon-box`}>
                                <DumpsterIconSolid colorCode={colorCodeReal} />
                              </div>
                            )}
                            {v.weightType === VESSEL_WEIGHT_TYPE.ESTIMATED && (
                              <div className={`${styles.iconBox} icon-box`}>
                                <DumpsterIconStriped colorCode={colorCodeEst} />
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col
                          xs={17}
                          sm={14}
                          md={14}
                          lg={14}
                          xl={14}
                          xxl={15}
                          className={`flex ${styles.vesselHoverArea}`}
                        >
                          <Row
                            className={styles.vesselCard}
                            style={{
                              borderRadius: '4px',
                              borderColor: '#CAC5CD',
                            }}
                            gutter={[16, 16]}
                          >
                            <Col xs={24} sm={12}>
                              <div className="flex flex-row gap-3 item-center">
                                <div className="flex flex-col justify-center text-center input-vessel">
                                  <Typography.Text>
                                    {MESSAGES.WEIGHT}
                                  </Typography.Text>
                                  <InputComponent
                                    type="number"
                                    name={`vessels.${i}.weight`}
                                    restrictNegativeValue
                                    value={v.weight ?? ''}
                                    onChange={(e: any) =>
                                      setFieldValue(
                                        `vessels.${i}.weight`,
                                        e.target.value
                                      )
                                    }
                                    placeholder={
                                      v.weightType ===
                                      VESSEL_WEIGHT_TYPE.CONFIRMED
                                        ? '0'
                                        : '--'
                                    }
                                    disabled={
                                      v.weightType ===
                                      VESSEL_WEIGHT_TYPE.ESTIMATED
                                    }
                                    errors={flatErrors}
                                    touched={flatTouched}
                                  />
                                </div>
                                <Typography.Text className="tons mt-8">
                                  {MESSAGES.VESSEL_TONS}
                                </Typography.Text>
                              </div>
                            </Col>

                            <Col xs={24} sm={12}>
                              <RadioComponent
                                name={`vessels.${i}.weightType`}
                                options={ADD_VESSEL_FORM_OPTIONS}
                                value={v.weightType}
                                onChange={(e) => {
                                  const newType = Number(e.target.value)
                                  setFieldValue(
                                    `vessels.${i}.weightType`,
                                    newType
                                  )
                                  // If user switches back to ESTIMATED → clear the weight field
                                  if (
                                    newType === VESSEL_WEIGHT_TYPE.ESTIMATED
                                  ) {
                                    setFieldValue(`vessels.${i}.weight`, null)
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                          <MinusCircleOutlined
                            className={`ml-4 ${styles.minusIcon}`}
                            onClick={() => remove(i)}
                          />
                        </Col>
                        {i === 0 && (
                          <Col xs={24} sm={6} md={6} lg={6} xl={6} xxl={5}>
                            <Typography.Text className="addVesselText">
                              {VESSEL_FORM.ESTIMATED_INFO}
                            </Typography.Text>
                          </Col>
                        )}
                      </Row>
                    </div>
                  )
                })
              }
            </FieldArray>
          </div>
          <Row justify="end" gutter={30} className="mt-8">
            <Col>
              <Button
                type="text"
                onClick={onBack}
                className={`${styles.backButton} ${styles.btns}`}
              >
                {BUTTONS.BACK}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => setIsAddVesselOpen(false)}
                className={`${styles.cancelButton} ${styles.btns}`}
              >
                {BUTTONS.CANCEL}
              </Button>
            </Col>
            <Col>
              <SecondaryButton
                type="primary"
                htmlType="submit"
                disabled={values?.vessels?.length === 0}
                className={`${styles.saveButton} ${styles.btns}`}
              >
                {BUTTONS.SAVE}
              </SecondaryButton>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}
