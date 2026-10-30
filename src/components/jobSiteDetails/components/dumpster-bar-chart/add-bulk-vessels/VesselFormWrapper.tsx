import { VESSEL_FORM, MESSAGES } from '@/src/utils/constants/app-constants'
import { BUTTONS } from '@/src/utils/constants/form-constants'
import { Button, Col, Row, Typography } from 'antd'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import styles from '../styles.module.scss'
import { VESSEL_COUNT_SCHEMA } from '@/src/utils/constants/schemas'
import InputComponent from '@/src/components/shared/input'
import { JobSitesWasteStreamsDumpster } from '@/src/utils/constants/types'
import SecondaryButton from '@/src/components/common/secondaryButton'
import VesselDetailsStep from './vesselDetailsStep'

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

function VesselFormWrapper({
  setIsAddVesselOpen,
  subWasteStream,
  colorCodeEst,
  colorCodeReal,
  jobSiteWastestreamsId,
  setRefresh,
  endDate,
}: Props) {
  const [step, setStep] = useState(1)
  const [vesselCount, setVesselCount] = useState<number | null>()
  const handleNext = (count: number) => {
    setVesselCount(count)
    setStep(2)
  }
  const handleBack = () => setStep(1)
  return (
    <>
      <div className={`container mt-15 mb-10 ${styles.vesselModalHeader}`}>
        <Title level={1} className={`font-inter ${styles.width}`}>
          {VESSEL_FORM.ADD_VESSEL_MAIN_HEADING}
        </Title>
      </div>
      {step === 1 && (
        <>
          <Formik
            initialValues={{ vesselCount: vesselCount ?? '' }}
            validationSchema={VESSEL_COUNT_SCHEMA}
            validateOnChange
            validateOnBlur
            onSubmit={(vals) => {
              handleNext(Number(vals.vesselCount))
            }}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form className={`vessel-modal ${styles.addVesselModal}`}>
                <Row className={styles.vesselContainer} align={'middle'}>
                  <Typography.Text className={styles.howMany}>
                    {VESSEL_FORM.HOW_MANY_VESSLES}
                  </Typography.Text>
                  <Col
                    xs={24}
                    md={10}
                    lg={10}
                    xl={10}
                    xxl={10}
                    className={styles.col1}
                  >
                    <div className="flex flex-row gap-3 items-center justify-center">
                      <div className="flex flex-col justify-center text-center input-vessel">
                        <Typography.Text className={styles.number}>
                          {' '}
                          {MESSAGES.NUMBER}
                        </Typography.Text>
                        <InputComponent
                          type="number"
                          restrictNegativeValue={true}
                          name="vesselCount"
                          onChange={handleChange}
                          value={values.vesselCount}
                          touched={touched}
                          errors={errors}
                          placeholder="0"
                        />
                      </div>
                      <Typography.Text className="tons mt-4">
                        {MESSAGES.VESSELS}
                      </Typography.Text>
                    </div>
                  </Col>
                  <Col xs={24} md={11} lg={11} xl={11} xxl={11}>
                    <div className="ml-5">
                      <Typography.Text className="font-inter colorTextHeading">
                        {VESSEL_FORM.ADD_VESSEL_INFO_CONTENT}
                      </Typography.Text>
                    </div>
                  </Col>
                </Row>
                <Row className="flex justify-end gap-10 mt-10 vessel-btns">
                  <Button
                    onClick={() => setIsAddVesselOpen(false)}
                    className="px-10"
                  >
                    {BUTTONS.CANCEL}
                  </Button>

                  <SecondaryButton
                    type="default"
                    className="px-10"
                    htmlType="submit"
                  >
                    {BUTTONS.NEXT}
                  </SecondaryButton>
                </Row>
              </Form>
            )}
          </Formik>
        </>
      )}
      {step === 2 && vesselCount && (
        <VesselDetailsStep
          vesselCount={vesselCount}
          onBack={handleBack}
          setIsAddVesselOpen={setIsAddVesselOpen}
          jobSiteWastestreamsId={jobSiteWastestreamsId}
          setRefresh={setRefresh}
          endDate={endDate}
          colorCodeEst={colorCodeEst}
          colorCodeReal={colorCodeReal}
          subWasteStream={subWasteStream}
        />
      )}
    </>
  )
}

export default VesselFormWrapper
