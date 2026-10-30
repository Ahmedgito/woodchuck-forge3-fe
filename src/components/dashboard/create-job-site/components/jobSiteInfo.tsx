'use client'
import {
  // fetchEndClientData,
  fetchPowerPlantData,
} from '@/src/app/(app)/settings/dataFetchers'
import InputComponent from '@/src/components/shared/input'
import SelectComponent from '@/src/components/shared/select'
import {
  DATE_FORMAT,
  ROLES,
  MESSAGES,
} from '@/src/utils/constants/app-constants'
import { CREATE_JOB_SITE_FORM } from '@/src/utils/constants/form-constants'
import {
  DROP_DOWN_OPTIONS,
  POWER_PLANT_TYPE,
  USER_TYPE,
} from '@/src/utils/constants/types'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { dropDownMapper } from '@/src/utils/functions/mappers'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import { Typography, Row, Col, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { PlusCircleFilled } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'

interface Props {
  values: { [key: string]: any }
  errors: { [key: string]: any }
  touched: { [key: string]: any }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  setFieldValue: (name: string, value: string) => void
  placeholder?: string
  disabled?: boolean
  handleEndClientModal: () => void
  endClients: USER_TYPE[]
  jobsiteClient?: USER_TYPE | undefined
  currentTab?: string | null
}

const { Text } = Typography

const JobSiteInfoForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  setFieldValue,
  placeholder,
  disabled,
  handleEndClientModal,
  endClients,
  jobsiteClient,
  currentTab,
}: Props) => {
  const [powerPlantList, setPowerPlantList] = useState<POWER_PLANT_TYPE[]>([])
  // const [endClientList, setEndClientList] = useState<USER_TYPE[]>([])
  const { setLoading } = useLoader()
  const [dropDownOptions, setDropDownOptions] = useState<DROP_DOWN_OPTIONS>([])
  const [endClientOptions, setEndClientOptions] = useState<DROP_DOWN_OPTIONS>(
    []
  )
  const triggerNotification = useTriggerNotification()

  const trigger = createTriggerNotification(triggerNotification)
  useEffect(() => {
    // fetching powerplants for jobsite dropdown
    const fetchData = async () => {
      await fetchPowerPlantData({
        setState: setPowerPlantList,
        setLoading: setLoading,
        triggerNotification: trigger,
      })
      // await fetchEndClientData({
      //   setState: setEndClientList,
      //   setLoading: setLoading,
      //   triggerNotification: trigger,
      // })
    }
    fetchData()
  }, [])

  useEffect(() => {
    setDropDownOptions(dropDownMapper(powerPlantList))
    setEndClientOptions(dropDownMapper(endClients))
  }, [powerPlantList, endClients])

  return (
    <>
      <Row gutter={[8, 8]} className="field">
        <Col
          xl={8}
          lg={8}
          md={8}
          sm={8}
          xs={24}
          className="flex items-start justify-end lg-justify-start"
        >
          <label className="font-medium">{CREATE_JOB_SITE_FORM.JS_TITLE}</label>
        </Col>

        <Col xl={16} lg={16} md={16} sm={16} xs={24}>
          <InputComponent
            restrictNegativeValue={true}
            name="title"
            onChange={onChange}
            onBlur={onBlur}
            value={values.title}
            errors={errors}
            touched={touched}
          />
        </Col>
      </Row>

      <Row gutter={[8, 8]} className="field">
        <Col
          xl={8}
          lg={8}
          md={8}
          sm={8}
          xs={24}
          className="flex items-start justify-end lg-justify-start"
        >
          <label className="font-medium">{CREATE_JOB_SITE_FORM.SIZE}</label>
        </Col>

        <Col xl={16} lg={16} md={16} sm={16} xs={24}>
          <InputComponent
            type="number"
            restrictNegativeValue={true}
            name="size"
            onChange={onChange}
            onBlur={onBlur}
            value={values.size}
            errors={errors}
            touched={touched}
          />
        </Col>
      </Row>

      <Row gutter={[8, 8]} className="field">
        <Col
          xl={8}
          lg={8}
          md={8}
          sm={8}
          xs={24}
          className="flex items-startjustify-end lg-justify-start"
        >
          <label className="font-medium">
            {CREATE_JOB_SITE_FORM.COMPLETION_BY}
          </label>
        </Col>

        <Col xl={16} lg={16} md={16} sm={16} xs={24}>
          <DatePicker
            className="w-full"
            allowClear={false}
            format={DATE_FORMAT.MM_DD_YYYY}
            onChange={(val) => {
              setFieldValue(
                'completionBy',
                dayjs(val).format(DATE_FORMAT.MM_DD_YYYY)
              )
            }}
            value={values.completionBy && dayjs(values.completionBy)}
          />
        </Col>
      </Row>
      {currentTab !== MESSAGES.MANUFACTURER &&
        currentTab !== MESSAGES.OFFTAKES &&
        jobsiteClient?.role?.enum !== ROLES.MANUFACTURER &&
        jobsiteClient?.role?.enum !== ROLES.OFFTAKE && (
          <Row gutter={[8, 8]} className="field">
            <Col
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={24}
              className="flex items-start justify-end lg-justify-start"
            >
              <label className="font-medium">
                {CREATE_JOB_SITE_FORM.END_CLIENT}
              </label>
            </Col>
            <Col
              xl={14}
              lg={14}
              md={16}
              sm={14}
              xs={24}
              className="flex items-center flex-wrap"
            >
              <SelectComponent
                name="end_client"
                value={values.endClientId || null}
                placeholder="Select"
                errors={errors}
                touched={touched}
                showError={true}
                className="w-full"
                disabled={disabled}
                onChange={(e) => {
                  setFieldValue('endClientId', e)
                }}
                options={endClientOptions}
              />
            </Col>
            <Col
              className="flex items-center"
              xl={2}
              lg={2}
              md={2}
              sm={2}
              xs={24}
            >
              <PlusCircleFilled
                onClick={handleEndClientModal}
                style={{ color: '#a2c900', fontSize: '20px' }}
              />
            </Col>
          </Row>
        )}
    </>
  )
}

export default JobSiteInfoForm
