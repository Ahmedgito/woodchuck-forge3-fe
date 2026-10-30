'use client'
import { ADD_GLOBAL_DATA_SCHEMA } from '@/src/utils/constants/schemas'
import { Formik, Form, FormikProps } from 'formik'
import { Row, Col, Typography, Card } from 'antd'
import { MESSAGES } from '@/utils/constants/app-constants'
import { GLOBAL_DATA_FORM } from '@/src/utils/constants/form-constants'
import { useEffect, useState } from 'react'
import { GLOBAL_DATA_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import { GLOBAL_DATA_TYPE } from '@/src/utils/constants/types'
import GlobalDataEditModal from '@/src/components/settings/global-data-edit-modal'
import { useSession } from 'next-auth/react'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { getGlobalData, updateGlobalData } from '@/src/services/global'
import { useRef } from 'react'
import './style.module.scss'

const { Title, Text, Link } = Typography

export default function GlobalData() {
  const { data: session, status } = useSession()
  const [globalData, setGlobalData] = useState<GLOBAL_DATA_TYPE>(
    GLOBAL_DATA_INITIAL_STATE
  )
  const [isFieldModalOpen, setIsFieldModalOpen] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [confirmationModal, setConfirmationModal] = useState<boolean>()
  const [fieldName, setFieldName] = useState<string | null>('')
  const [fieldLabel, setFieldLabel] = useState<string | null>('')
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  const formikRef = useRef<FormikProps<any>>(null)

  const handleSubmit = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit()
    }
  }
  const getGlobalDetails = async () => {
    try {
      setLoading(true)
      // let result = await getGlobalData(session?.user?.id)
      let result = await getGlobalData(
        Number(process.env.NEXT_PUBLIC_GLOBAL_DATA_ID)
      )
      setGlobalData(result.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error('error get global data ' + err)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') getGlobalDetails()
  }, [status])

  const openEditModal = (name: string, label: string) => {
    setFieldName(name)
    setFieldLabel(label)
    setIsFieldModalOpen(true)
  }

  const onFieldChange = (name: string, value: string | number) => {
    setIsFieldModalOpen(false)
    onSubmit({ [name]: value })
    setFieldName(null)
    setFieldLabel(null)
  }

  const onSubmit = async (payload: GLOBAL_DATA_TYPE) => {
    try {
      setLoading(true)
      // updateGlobalData(session?.user.id, payload)
      updateGlobalData(Number(process.env.NEXT_PUBLIC_GLOBAL_DATA_ID), payload)
      setConfirmationModal(false)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.GLOBAL_DATA_UPDATED
      )
      getGlobalDetails()
      setIsDisabled(true)
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
    <>
      <Title className="mt-0">{MESSAGES.SETTINGS}</Title>
      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={globalData}
        validationSchema={ADD_GLOBAL_DATA_SCHEMA}
        onSubmit={onSubmit}
      >
        {({ errors, values, touched, handleChange }) => (
          <Form>
            <Row>
              <Col span={24}>
                <Title level={5} className="mb-0">
                  <span className="font-semibold txt-uppercase">
                    {MESSAGES.MESSAGE_TEMPLATE}
                  </span>
                </Title>
                <Title level={5} className="mb-5 mt-1">
                  <span className="font-bold txt-uppercase">
                    {MESSAGES.INSTRUCTIONS_TO_SUPERVISOR}
                  </span>
                </Title>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-4">
              <Col
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={24}
                className="field width-100"
              >
                <label>{GLOBAL_DATA_FORM.SUPERVISOR_ONBOARDING}</label>
                <Card className="grey-bg">
                  <div
                    className="scroll-bar height-250"
                    dangerouslySetInnerHTML={{
                      __html: `${values.supervisorOnboarding}`,
                    }}
                  />
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() =>
                      openEditModal(
                        'supervisorOnboarding',
                        GLOBAL_DATA_FORM.SUPERVISOR_ONBOARDING
                      )
                    }
                  ></i>
                </Card>
              </Col>

              <Col
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={24}
                className="field width-100"
              >
                <label>{GLOBAL_DATA_FORM.AUTO_RESPONSE}</label>
                <Card className="grey-bg">
                  <div
                    className="scroll-bar height-100"
                    dangerouslySetInnerHTML={{
                      __html: `${values.autoResponse}`,
                    }}
                  />
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() =>
                      openEditModal(
                        'autoResponse',
                        GLOBAL_DATA_FORM.AUTO_RESPONSE
                      )
                    }
                  ></i>
                </Card>
              </Col>
            </Row>

            {isFieldModalOpen && fieldName && fieldLabel && (
              <GlobalDataEditModal
                name={fieldName}
                label={fieldLabel}
                isOpen={isFieldModalOpen}
                defaultValue={
                  values[fieldName as keyof GLOBAL_DATA_TYPE] as string
                }
                setIsModalOpen={setIsFieldModalOpen}
                onChange={onFieldChange}
              />
            )}
          </Form>
        )}
      </Formik>
    </>
  )
}
