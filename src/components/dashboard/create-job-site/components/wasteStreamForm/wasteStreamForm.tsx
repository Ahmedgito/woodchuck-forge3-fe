'use client'

import { ADD_WASTE_STREAM_SCHEMA } from '@/src/utils/constants/schemas'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import {
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_OPTIONS,
  DUMPSTER_TRANSFORMED_OPTIONS,
  HAULER_TYPE,
  WASTE_STREAM_JOB_SITE_FORM_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import { useLoader } from '@/src/utils/context/loader-context'
import { WASTE_STREAM_JOB_SITE_FORM_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import { Button, Col, Input, Row } from 'antd'
import SelectComponent from '@/src/components/shared/select'
import InputComponent from '@/src/components/shared/input'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import {
  createWasteStreamJobistes,
  updateWasteStreamJobistes,
} from '@/src/services/global'
import { useTriggerNotification } from '@/src/utils/context/notification-context'

import { dropDownMapper } from '@/src/utils/functions/mappers'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { PlusCircleFilled } from '@ant-design/icons'
import styles from './style.module.scss'

interface Props {
  wasteStreamData: WASTE_STREAM_JOB_SITE_FORM_TYPE
  firstEntry?: boolean
  handleDelete: () => void
  handleDumpsterModal: () => void
  dumpsterList: DROP_DOWN_OPTIONS
  index: number
  setaddbutton: React.Dispatch<React.SetStateAction<boolean>>
  addButton: boolean
  totalItems: number
  dotRemove: boolean
  setdotRemove: React.Dispatch<React.SetStateAction<boolean>>
  dumpsterOptions: DUMPSTER_OPTIONS
  wasteStreamList: WASTE_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  haulerList: HAULER_TYPE[]
  formDisabled: boolean
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isRefreshing: boolean
}

const JobSiteWasteStreamForm: React.FC<Props> = ({
  wasteStreamData,
  firstEntry,
  handleDelete,
  handleDumpsterModal,
  dumpsterList,
  index,
  setaddbutton,
  addButton,
  totalItems,
  dotRemove,
  setdotRemove,
  dumpsterOptions,
  wasteStreamList,
  locationList,
  haulerList,
  formDisabled,
  setRefresh,
  isRefreshing,
}) => {
  const [disabled, setDisabled] = useState(firstEntry === true ? false : true)
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [haulerDropDownOptions, setHaulerDropDownOptions] =
    useState<DROP_DOWN_OPTIONS>([])
  const [wasteStreamDropDownOptions, setwasteStreamDropDownOptions] =
    useState<DROP_DOWN_OPTIONS>([])
  const [locationDropDownOptions, setlocationDropDownOptions] = useState<
    DUMPSTER_TRANSFORMED_OPTIONS[]
  >([])
  const [groupedOptions, setGroupedOptions] = useState<
    DUMPSTER_TRANSFORMED_OPTIONS[]
  >([])

  useEffect(() => {
    setHaulerDropDownOptions(dropDownMapper(haulerList))
    setwasteStreamDropDownOptions(dropDownMapper(wasteStreamList))
    setGroupedOptions(transformData(dumpsterOptions))
    setlocationDropDownOptions(transformLocationList(locationList))
  }, [haulerList, locationList, wasteStreamList])

  const onSubmit = async (payload: WASTE_STREAM_JOB_SITE_FORM_TYPE) => {
    try {
      setLoading(true)
      payload.firstEntry
        ? await createWasteStreamJobistes(payload)
        : await updateWasteStreamJobistes(payload.id, payload)

      setRefresh(true)
      !payload.firstEntry && setDisabled(true)
      setaddbutton(false)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        payload.firstEntry
          ? MESSAGES.WASTE_STREAM_SUCCESSFULLY_CREATED
          : MESSAGES.WASTE_STREAM_SUCCESSFULLY_UPDATED
      )
    } catch (err: any) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        err?.response?.data.errors.camera === 'associatedWithCamera'
          ? MESSAGES.SOMETHING_WENT_WRONG_UNASSIGN_HAULER
          : MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }
  const transformData = (
    data: DUMPSTER_OPTIONS
  ): DUMPSTER_TRANSFORMED_OPTIONS[] => {
    const grouped = data.reduce<{
      [key: string]: DUMPSTER_TRANSFORMED_OPTIONS
    }>((acc, item) => {
      if (!acc[item.dumpsterKey]) {
        acc[item.dumpsterKey] = {
          label: <span className="dropdown-sub-head">{item.dumpsterType}</span>,
          title: item.dumpsterType,
          options: [],
        }
      }
      acc[item.dumpsterKey].options.push({
        label: <span>{item.dumpsterWeight}</span>,
        value: item.key,
      })
      return acc
    }, {})

    return Object.values(grouped)
  }
  const transformLocationList = (
    data: COMBINED_LOCATION_TYPE[]
  ): DUMPSTER_TRANSFORMED_OPTIONS[] => {
    const grouped = data.reduce<{
      [key: string]: DUMPSTER_TRANSFORMED_OPTIONS
    }>((acc, item) => {
      if (!acc[item.typeLabel]) {
        acc[item.typeLabel] = {
          label: <span className="dropdown-sub-head">{item.typeLabel}</span>,
          title: item.typeLabel,
          options: [],
        }
      }
      acc[item.typeLabel].options.push({
        label: <span>{item.name}</span>,
        value: item.id + '_' + item.entityType,
        entityType: item.entityType,
      })
      return acc
    }, {})

    return Object.values(grouped)
  }

  return (
    <>
      <form className={totalItems ? styles.add_waste_form : ''}>
        {index === 0 && wasteStreamData && (
          <Row
            align={'middle'}
            gutter={[6, 16]}
            wrap={false}
            className={`${styles.row_head} sm-hidden`}
          >
            <Col xs={24} sm={12} md={4} lg={4}>
              <h3>{MESSAGES.WASTE_STREAMS}</h3>
            </Col>
            <Col xs={24} sm={12} md={4} lg={3}>
              <h3>{MESSAGES.DUMPSTER}</h3>
            </Col>
            <Col xs={24} sm={12} md={5} lg={5}>
              <h3>{MESSAGES.DUMPSTER_LOCATION}</h3>
            </Col>
            <Col xs={24} sm={12} md={4} lg={5}>
              <h3>{MESSAGES.DELIVERY_lOCATION}</h3>
            </Col>
            <Col xs={24} sm={12} md={3} lg={2}>
              <h3>{MESSAGES.DISTANCE}</h3>
            </Col>
            <Col xs={24} sm={12} md={4} lg={5}>
              <h3>{MESSAGES.HAULER}</h3>
            </Col>
          </Row>
        )}
        {disabled && (
          <Row
            align={'middle'}
            gutter={[6, { xs: 6, sm: 16, md: 16, lg: 16 }]}
            wrap={false}
            className={`${styles.form_row} ${index === totalItems - 1 ? styles.form_row_last : ''} sm-flex-wrap`}
          >
            <Col xs={24} sm={12} md={4} lg={4}>
              <div className={`${styles.row_head} hidden sm-visible mb-2`}>
                <h3>{MESSAGES.WASTE_STREAMS}</h3>
              </div>
              <Input
                name="WASTE STREAMS"
                value={wasteStreamData.wasteStreamName}
                className={styles.textfield}
                disabled={true}
              />
            </Col>
            <Col xs={24} sm={12} md={4} lg={3}>
              <div className={`${styles.row_head} hidden sm-visible mb-2`}>
                <h3>{MESSAGES.DUMPSTER}</h3>
              </div>
              <Input
                name="Off Roll 30YD"
                value={
                  wasteStreamData.dumpster_type
                    ? wasteStreamData.dumpster_type.replace(/_/g, ' ')
                    : ''
                }
                className={styles.textfield}
                disabled={true}
                title={
                  wasteStreamData.dumpster_type
                    ? wasteStreamData.dumpster_type.replace(/_/g, ' ')
                    : ''
                }
              />
            </Col>
            <Col xs={24} sm={12} md={5} lg={5}>
              <div className={`${styles.row_head} hidden sm-visible mb-2`}>
                <h3>{MESSAGES.DUMPSTER_LOCATION}</h3>
              </div>
              <Input
                name="Job Site"
                value={wasteStreamData.dumpsterName}
                className={styles.textfield}
                disabled={true}
              />
            </Col>
            <Col xs={24} sm={12} md={4} lg={5}>
              <div className={`${styles.row_head} hidden sm-visible mb-2`}>
                <h3>{MESSAGES.DELIVERY_lOCATION}</h3>
              </div>
              <Input
                name="MMR Macomb"
                value={wasteStreamData.locationName}
                disabled={true}
                className={styles.textfield}
              />
            </Col>
            <Col xs={24} sm={12} md={3} lg={2}>
              <div className={`${styles.row_head} hidden sm-visible mb-2`}>
                <h3>{MESSAGES.DISTANCE}</h3>
              </div>
              <Input
                name="distance"
                value={wasteStreamData.distance}
                className={styles.textfield}
                disabled={true}
              />
            </Col>
            <Col xs={24} sm={12} md={4} lg={5}>
              <div className={`${styles.row_head} hidden sm-visible mb-2`}>
                <h3>{MESSAGES.HAULER}</h3>
              </div>
              <Input
                name="Blue Ridge Disposal Co."
                value={wasteStreamData.haulerName}
                className={styles.textfield}
                disabled={true}
              />
            </Col>
            {!formDisabled &&
              !isRefreshing &&
              (addButton || (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setDisabled(false)
                    setdotRemove(false)
                    setaddbutton(true)
                  }}
                  title="Change"
                  className={styles.change_icon}
                >
                  <i className="icon-pencil"></i>
                  {MESSAGES.CHANGE}
                </a>
              ))}
          </Row>
        )}
      </form>
      <Formik
        initialValues={
          wasteStreamData || WASTE_STREAM_JOB_SITE_FORM_INITIAL_STATE
        }
        validationSchema={ADD_WASTE_STREAM_SCHEMA}
        onSubmit={(values) => {
          onSubmit(values)
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className={styles.add_waste_form}>
            <Row gutter={[6, 16]}>
              <Col
                xl={{ span: 17, offset: 7 }}
                lg={{ span: 17, offset: 7 }}
                md={{ span: 16, offset: 8 }}
                sm={{ span: 16, offset: 8 }}
                xs={{ span: 4, offset: 20 }}
                className={`flex justify-end sm-mt-2 ${dotRemove ? '' : styles.bx_1}`}
              >
                {disabled || firstEntry || (
                  <Button
                    htmlType="submit"
                    type="text"
                    //onClick={() => setDisabled(true)}
                    className="icon-btn sm-px-0"
                  >
                    <CheckCircleOutlined className={styles.add_icon} />
                  </Button>
                )}
                {disabled || !firstEntry || (
                  <Button
                    type="text"
                    onClick={() => {
                      setDisabled(true)
                      handleDelete()
                      setdotRemove(!dotRemove)
                    }}
                    className="my-3 sm-px-0"
                  >
                    <CloseCircleOutlined className={styles.del_icon} />
                  </Button>
                )}
              </Col>
            </Row>

            {disabled || (
              <Row
                gutter={[6, 16]}
                style={{ marginTop: 0 }}
                className={` ${styles.form_select_row}  ${dotRemove ? 'mt-0' : styles.form_row} ${index === totalItems - 1 ? styles.form_row_last : ''}  `}
              >
                <Col xs={24} sm={12} md={4} lg={4}>
                  <SelectComponent
                    placeholder="Waste Stream"
                    title="Select Waste Stream"
                    name="wastestreamsId"
                    errors={errors}
                    touched={touched}
                    showError={true}
                    value={values.wastestreamsId}
                    className="form_select"
                    disabled={!firstEntry}
                    onChange={(e) => {
                      setFieldValue('wastestreamsId', e)
                    }}
                    options={wasteStreamDropDownOptions}
                  />
                </Col>
                <Col xs={24} sm={12} md={4} lg={3}>
                  <SelectComponent
                    name="dumpster_type"
                    errors={errors}
                    touched={touched}
                    showError={true}
                    value={values.dumpster_type}
                    className="form_select"
                    disabled={!firstEntry}
                    onChange={(e) => {
                      setFieldValue('dumpster_type', e)
                    }}
                    options={groupedOptions}
                    placeholder="Dumpster Type/Size"
                    title="Dumpster Type/Size"
                  />
                </Col>
                <Col xs={24} sm={12} md={5} lg={5}>
                  <Row align={'middle'} gutter={[6, 16]} wrap={false}>
                    <Col flex={'auto'}>
                      <SelectComponent
                        name="dumpsterId"
                        errors={errors}
                        touched={touched}
                        showError={true}
                        value={values.dumpsterId}
                        className="form_select"
                        disabled={disabled}
                        onChange={(e) => {
                          setFieldValue('dumpsterId', e)
                        }}
                        options={dumpsterList}
                        placeholder="Dumpster Location"
                        title="Select Dumpster Location"
                      />
                    </Col>
                    {firstEntry && (
                      <Col flex={'32px'}>
                        <PlusCircleFilled
                          onClick={handleDumpsterModal}
                          className={styles.add_icon}
                        />
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col xs={24} sm={12} md={4} lg={5}>
                  <SelectComponent
                    name={values.powerplantId ? 'locationId' : 'powerplantId'}
                    errors={errors}
                    touched={touched}
                    showError={true}
                    value={
                      values.locationId
                        ? `${values.locationId}_2`
                        : values.powerplantId
                          ? `${values.powerplantId}_1`
                          : null
                    }
                    className="form_select"
                    // disabled={disabled}
                    onChange={(e) => {
                      const [id, entityType] = e.split('_')
                      const selectedOption = locationList.find(
                        (item) =>
                          item.id === Number(id) &&
                          item.entityType === Number(entityType)
                      )
                      if (selectedOption) {
                        if (selectedOption.entityType === 2) {
                          setFieldValue('locationId', id)
                          setFieldValue('powerplantId', null)
                        } else if (selectedOption.entityType === 1) {
                          setFieldValue('powerplantId', id)
                          setFieldValue('locationId', null)
                        }
                      }
                    }}
                    options={locationDropDownOptions}
                    placeholder="Delivery Location"
                    title="Select Delivery Location"
                  />
                </Col>
                <Col xs={24} sm={12} md={3} lg={2}>
                  <InputComponent
                    type="number"
                    restrictNegativeValue={true}
                    name="distance"
                    onChange={handleChange}
                    value={values.distance}
                    touched={touched}
                    placeholder="MILES"
                    errors={errors}
                    // disabled={disabled}
                    className="form_select"
                  />
                </Col>
                <Col xs={24} sm={12} md={4} lg={5}>
                  <SelectComponent
                    name="haulerId"
                    errors={errors}
                    touched={touched}
                    showError={true}
                    value={values.haulerId}
                    className="form_select"
                    // disabled={disabled}
                    onChange={(e) => {
                      setFieldValue('haulerId', e)
                    }}
                    options={haulerDropDownOptions}
                    placeholder="Hauler"
                    title="Select Hauler"
                  />
                </Col>
              </Row>
            )}

            {firstEntry && (
              <Row align={'middle'} gutter={[6, 16]} justify={'end'}>
                <Col>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={`mt-4 ${styles.add_button}`}
                  >
                    {MESSAGES.CREATE_WASTE_STREAM}
                  </Button>
                </Col>
              </Row>
            )}
          </form>
        )}
      </Formik>
    </>
  )
}

export default JobSiteWasteStreamForm
