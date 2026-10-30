import ReadOnlyField from '@/src/components/common/readOnlyField'
import { FORM_LABELS } from '@/src/utils/constants/form-constants'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  GET_WASTE_STREAM_JOB_SITE_FORM_TYPE,
  HAULER_TYPE,
} from '@/src/utils/constants/types'
import { Card, Col, Popover, Row, Typography, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import { WasteSteamCamera } from './wasteSteamCamera'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CloseCircleOutlined, DragOutlined } from '@ant-design/icons'
import { Formik, FormikValues, Form } from 'formik'
import EditWasteStreamForm from '../../editWasteStreamForm'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import {
  MESSAGES,
  WHITELISTED_WASTE_STREAMS,
} from '@/src/utils/constants/app-constants'
import { updateWasteStreamJobistes } from '@/src/services/global'
import { extractPayload } from '@/src/utils/functions/extractPayload'
import WasteStreamCardTooltip from '../../wasteSteamCardTooltip'
import { EDIT_WASTE_STREAM_ITEM_SCHEMA } from '@/src/utils/constants/schemas'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

type Props = {
  item: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE
  dumpsterList: DROP_DOWN_OPTIONS
  haulerList: HAULER_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  jobSiteId: number | null | undefined
  index: number
  editableItemId: number | null
  setEditableItemId: React.Dispatch<React.SetStateAction<number | null>>
  disabled?: boolean
  isNewItem?: boolean
}

const WasteStreamListItem: React.FC<Props> = ({
  item,
  dumpsterList,
  haulerList,
  locationList,
  cameraData,
  alertData,
  setRefresh,
  jobSiteId,
  index,
  editableItemId,
  setEditableItemId,
  disabled = false,
  isNewItem = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { item },
  })
  const [isEdit, setIsEdit] = useState(false)
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  const [cameras, setCameras] = useState<CAMERA_DROPDOWN_TYPE[]>([])
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0)
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'default' : 'grab',
  }

  useEffect(() => {
    const cameraOptions = [
      ...cameraData.map((camera: CAMERA_DROPDOWN_TYPE) => ({
        id: camera.id,
        cameraId: camera.cameraId,
      })),
      ...(isEdit && item.wasteStreamCameras?.camera
        ? [
            {
              id: item.wasteStreamCameras?.camera?.id,
              cameraId: item.wasteStreamCameras?.camera?.cameraId,
            },
          ]
        : []),
      ...(isEdit && item.wasteStreamCameras?.additionalCamera
        ? [
            {
              id: item.wasteStreamCameras?.additionalCamera?.id,
              cameraId: item.wasteStreamCameras?.additionalCamera?.cameraId,
            },
          ]
        : []),
    ]
    setCameras(cameraOptions)
  }, [cameraData, isEdit])

  const onSubmit = async (values: FormikValues) => {
    const payload = extractPayload(values, jobSiteId, true)
    try {
      setLoading(true)
      await updateWasteStreamJobistes(item.id, payload)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.WASTE_STREAM_SUCCESSFULLY_UPDATED
      )
      setCurrentCameraIndex(0)
      setIsEdit(false)
      setEditableItemId(null)
      setRefresh(true)
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

  const renderByWasteStreamType = (
    type: number,
    data: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE
  ) => {
    switch (type) {
      case WHITELISTED_WASTE_STREAMS.WOOD_WASTE:
        return (
          <Col span={12}>
            <ReadOnlyField
              label={FORM_LABELS.CARBON_CREDIT}
              value={data.co2 ? `$${data.co2}/ton` : '-'}
            />
          </Col>
        )

      case WHITELISTED_WASTE_STREAMS.CARD_BOARD:
        return (
          <Col span={12}>
            <ReadOnlyField
              label={FORM_LABELS.RECYCLING_REBATE}
              value={
                data.recycling_rebate ? `$${data.recycling_rebate}/ton` : '-'
              }
            />
          </Col>
        )

      default:
        return null
    }
  }

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`waste-stream-item ${isEdit ? 'is-edit' : ''}`}
      >
        <Card
          className={`p-5 ${index % 2 === 1 ? 'light-grey' : ''} ${isNewItem ? 'new-item' : ''}`}
        >
          <Formik
            initialValues={{
              co2: item.co2,
              recycling_rebate: item.recycling_rebate,
              reports_enabled: item.reports_enabled,
              dumpsterId: item.dumpsterId,
              vesselId: item.vesselId,
              vesselOptionId: item.vesselOptionId,
              wastestreamsId: item.wastestreamsId,
              wasteStreamTypeId: item.wasteStreamTypeId,
              distance: item.distance,
              haulerId: item.haulerId,
              locationId: item.locationId,
              powerplantId: item.powerplantId,
              locationName: item.locationName,
              alertId: item.wasteStreamCameras
                ? `${item.wasteStreamCameras.alertTo}-${item.wasteStreamCameras.alertToType}`
                : null,
              vessel: item.vessel,
              vesselLocationId: item.dumpsterId,
              isEndPoint: item.isEndPoint,
              locationId_2: item.endPointLocationId,
              powerplantId_2: item.endPointPowerplantId,
              endPoint: item.endPointLocation,
              distance_2: item.endPointDistance,
              haulerId_2: item.endPointHaulerId,
              cameraId: item.wasteStreamCameras
                ? item.wasteStreamCameras.cameraId
                : null,
              additionalCameraId: item.wasteStreamCameras
                ? item.wasteStreamCameras.additionalCameraId
                : null,
              fillLevel: item.wasteStreamCameras
                ? item.wasteStreamCameras.maxLevel
                : null,
              confidenceLevel: item.wasteStreamCameras
                ? item.wasteStreamCameras.confidenceLevel
                : null,
            }}
            validationSchema={EDIT_WASTE_STREAM_ITEM_SCHEMA}
            onSubmit={(values: FormikValues) => {
              onSubmit(values)
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              resetForm,
            }) => (
              <Form>
                {!disabled && (
                  <div className="flex justify-between mb-3">
                    <div>
                      <DragOutlined />
                    </div>
                    <div>
                      {isEdit ? (
                        <div className="flex gap-2">
                          <CloseCircleOutlined
                            className="close-btn"
                            onClick={() => {
                              setIsEdit(false)
                              setEditableItemId(null)
                              resetForm()
                            }}
                          />
                          <button
                            type="submit"
                            className="save-button"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <img
                              src={'/images/check-icon.svg'}
                              className="cursor-pointer"
                              alt="check"
                            />
                            <span>Save</span>
                          </button>
                        </div>
                      ) : !!editableItemId && editableItemId !== item.id ? (
                        <button
                          className="cursor-pointer"
                          disabled={
                            !!editableItemId && editableItemId !== item.id
                          }
                          type="reset"
                        >
                          <Image
                            src={'/images/chart/pencil-icon.svg'}
                            preview={false}
                            className="cursor-pointer"
                          />
                          <span className="edit-waste">Edit</span>
                        </button>
                      ) : (
                        <button
                          className="cursor-pointer card-edit-btn"
                          onClick={() => {
                            setIsEdit(true)
                            setEditableItemId(item.id)
                          }}
                          disabled={
                            !!editableItemId && editableItemId !== item.id
                          }
                        >
                          <Image
                            src={'/images/chart/pencil-icon.svg'}
                            preview={false}
                            className="cursor-pointer"
                          />
                          <span className="edit-waste">Edit</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {/* {!isEdit && ( */}
                <GenieButtonWrapper hint="jobsite_info">
                  <div className="card-heading">
                    <Typography.Title level={5}>
                      {`${item.wasteStreamName} ${item.wasteStreamType}`}
                    </Typography.Title>
                  </div>
                </GenieButtonWrapper>

                {/* )} */}

                <WasteSteamCamera
                  data={item.wasteStreamCameras}
                  isEdit={isEdit}
                  cameraData={cameras}
                  values={values}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  jobsiteWasteStreamId={item.id}
                  currentCameraIndex={currentCameraIndex}
                  setCurrentCameraIndex={setCurrentCameraIndex}
                />

                {isEdit ? (
                  <EditWasteStreamForm
                    dumpsterList={dumpsterList}
                    locationList={locationList}
                    handleChange={handleChange}
                    values={values}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    haulerList={haulerList}
                    jobSiteId={item.jobSiteId}
                    cameraData={cameraData}
                    alertData={alertData}
                    id={item.id}
                    setRefresh={setRefresh}
                    setEditableItemId={setEditableItemId}
                  />
                ) : (
                  <Row gutter={[16, 24]}>
                    <Col span={24}>
                      {item.wasteStreamCameras ? (
                        <Row gutter={[16, 24]}>
                          <Col span={19} className="flex flex-col gap-2 level">
                            <Typography.Text>
                              Fill Level Max:{' '}
                              <span>{item.wasteStreamCameras.maxLevel} %</span>
                            </Typography.Text>
                            <Typography.Text>
                              Content Confidence Level Min:{' '}
                              <span>
                                {item.wasteStreamCameras.confidenceLevel} %
                              </span>
                            </Typography.Text>
                          </Col>
                          <Col
                            span={5}
                            className="flex justify-end items-start mt-11"
                          >
                            <Popover content={<WasteStreamCardTooltip />}>
                              <Image
                                src={'/images/chart/info-icon.svg'}
                                preview={false}
                                className="cursor-pointer"
                              />
                            </Popover>
                          </Col>
                        </Row>
                      ) : (
                        <div className="level"></div>
                      )}
                    </Col>
                    <Col span={24}>
                      <ReadOnlyField
                        label={FORM_LABELS.ALERT}
                        value={
                          item.wasteStreamCameras?.alertToName
                            ? item.wasteStreamCameras?.alertToName
                            : '-'
                        }
                        // value={item.wasteStreamCameras?.alertToName as string}
                      />
                    </Col>
                    <Col span={12}>
                      <ReadOnlyField
                        label={FORM_LABELS.VESSEL}
                        value={item.vessel as string}
                      />
                    </Col>
                    {Object.values(WHITELISTED_WASTE_STREAMS).includes(
                      item.wastestreamsId as number
                    ) &&
                      renderByWasteStreamType(
                        item.wastestreamsId as number,
                        item
                      )}
                    <Col span={24}>
                      <ReadOnlyField
                        label={FORM_LABELS.VESSEL_LOCATION}
                        value={item.dumpsterName as string}
                      />
                    </Col>
                    <Col span={10}>
                      <ReadOnlyField
                        label={FORM_LABELS.DISTANCE_TO}
                        value={item.distance ? `${item.distance} miles` : '-'}
                      />
                    </Col>
                    <Col span={14}>
                      <ReadOnlyField
                        label={FORM_LABELS.PROCESSING_LOCATION}
                        value={item.locationName || '-'}
                      />
                    </Col>
                    <Col span={24}>
                      <ReadOnlyField
                        label={FORM_LABELS.HAULER}
                        value={item.haulerName || '-'}
                      />
                    </Col>
                    {item.isEndPoint && (
                      <>
                        <Col span={12}>
                          <ReadOnlyField
                            label={FORM_LABELS.DISTANCE_TO}
                            value={
                              item.endPointDistance
                                ? `${item.endPointDistance} miles`
                                : '-'
                            }
                          />
                        </Col>
                        <Col span={12}>
                          <ReadOnlyField
                            label={FORM_LABELS.END_POINT}
                            value={item.endPointLocation as string}
                          />
                        </Col>
                        <Col span={24}>
                          <ReadOnlyField
                            label={FORM_LABELS.HAULER}
                            value={item.endPointHauler as string}
                          />
                        </Col>
                      </>
                    )}
                  </Row>
                )}
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </Col>
  )
}

export default React.memo(WasteStreamListItem)
