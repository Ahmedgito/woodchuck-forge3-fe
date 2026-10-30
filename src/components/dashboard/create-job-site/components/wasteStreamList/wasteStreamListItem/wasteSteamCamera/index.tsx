'use client'

import { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperCore } from 'swiper'
import { A11y } from 'swiper/modules'
import { Skeleton, Image, Typography, Row, Col } from 'antd'
import PreviewIco from '../../../../../../../../public/assets/preview.svg'
import { RedoOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import 'swiper/css'
import { getCameraLiveView } from '@/src/services/global'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/src/utils/constants/app-constants'
import { CAMERA_DROPDOWN_TYPE, CameraInfo } from '@/src/utils/constants/types'
import SelectComponent from '@/src/components/shared/select'
import { transformCameraData } from '@/src/utils/functions/htmlMappers'
import { FormikErrors, FormikTouched, FormikValues } from 'formik'
import { CameraMapper } from '@/src/utils/functions/mappers'
import StripedProgressBar from '../wasteStreamProgressBar'
import CameraException from './cameraException'
import ModalComponent from '@/src/components/shared/modal'

export interface CameraDetail {
  maxLevel: number
  confidenceLevel: number
  camera: {
    cameraId: string
    name: string
  }
  additionalCamera: {
    cameraId: string
    name: string
  }
}

export interface WasteCameraCardProps {
  data: CameraDetail | null | undefined
  isEdit: boolean
  cameraData: CAMERA_DROPDOWN_TYPE[]
  values: FormikValues
  touched: FormikTouched<FormikValues>
  errors: FormikErrors<FormikValues>
  jobsiteWasteStreamId: number
  setFieldValue: (field: string, value: any) => void
  currentCameraIndex: number
  setCurrentCameraIndex: (index: number) => void
}

export function WasteSteamCamera({
  data,
  isEdit,
  cameraData,
  values,
  touched,
  errors,
  jobsiteWasteStreamId,
  setFieldValue,
  currentCameraIndex,
  setCurrentCameraIndex,
}: WasteCameraCardProps) {
  const [cameras, setCameras] = useState<CameraInfo[]>([])
  const swiperRef = useRef<{ swiper: SwiperCore } | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')

  const [loading, isLoading] = useState(false)
  const getDumpsterLiveData = async (refresh?: boolean) => {
    try {
      isLoading(true)

      const response = await getCameraLiveView(jobsiteWasteStreamId, refresh)
      const result = response?.data?.data?.cameras ?? []

      let cameras = result.map((camera: any) =>
        CameraMapper(camera, data ?? {})
      )

      // Ensure exactly 2 camera slots
      while (cameras.length < 2) {
        cameras.push(CameraMapper({}, data ?? {}))
      }

      setCameras(cameras)
    } catch (err) {
      console.error('error in fetching dumpster live data', err)
    } finally {
      isLoading(false)
    }
  }
  useEffect(() => {
    // if (data?.camera) {
    getDumpsterLiveData()
    const intervalId = setInterval(
      getDumpsterLiveData,
      Number(process.env.NEXT_PUBLIC_DUMPSTER_REFRESH_RATE)
    )
    return () => clearInterval(intervalId)
    // }
  }, [data])

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.swiper &&
      swiperRef.current.swiper.activeIndex !== currentCameraIndex
    ) {
      swiperRef.current.swiper.slideTo(currentCameraIndex)
    }
  }, [currentCameraIndex])

  const totalCameras = cameras.length

  const handlePreviousCamera = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNextCamera = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  const handleDotClick = (index: number) => {
    setCurrentCameraIndex(index)
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index)
    }
  }

  const handleSlideChange = (swiper: SwiperCore) => {
    setCurrentCameraIndex(swiper.activeIndex)
  }

  const handlePreviewClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl)
    setPreviewVisible(true)
  }

  const handlePreviewCancel = () => {
    setPreviewVisible(false)
    setPreviewImageUrl('')
  }

  return (
    <div className="w-full flex flex-col justify-between">
      <div>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <Swiper
              ref={swiperRef}
              modules={[A11y]}
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={handleSlideChange}
              className={styles.swiperComponent}
              noSwipingClass="select-camera"
            >
              {cameras.map((camera, index) => (
                <SwiperSlide key={camera.cameraName}>
                  <div className={styles.slideContent}>
                    {isEdit ? (
                      <Row>
                        {/* {currentCameraIndex !== 0 && (
                          <Col span={8}>
                            <div className="w-full flex justify-end items-center right-nav">
                              <LeftOutlined
                                onClick={handlePreviousCamera}
                                className={`${styles.swiperNavButton} ${styles.swiperNavPrev}`}
                              />
                            </div>
                          </Col>
                        )} */}
                        <Col span={16}>
                          <div className="select-camera">
                            <p className={styles.cameraLabel}>{'Camera'}</p>
                            <SelectComponent
                              placeholder="Camera ID"
                              name={
                                index === 0 ? 'cameraId' : 'additionalCameraId'
                              }
                              className="form_select"
                              value={
                                index === 0
                                  ? values.cameraId
                                  : values.additionalCameraId
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  index === 0
                                    ? 'cameraId'
                                    : 'additionalCameraId',
                                  e
                                )
                              }}
                              options={transformCameraData(cameraData).filter(
                                (camera) => {
                                  let value =
                                    index === 0
                                      ? values.additionalCameraId
                                      : values.cameraId
                                  return camera.value !== value
                                }
                              )}
                              showError
                              errors={errors}
                              touched={touched}
                              getPopupContainer={() => document.body}
                              // allowClear
                              // onClear={() => {
                              //   setFieldValue(
                              //     index === 0
                              //       ? 'cameraId'
                              //       : 'additionalCameraId',
                              //     null
                              //   )
                              // }}
                            />
                          </div>
                        </Col>
                        {
                          <Col span={24}>
                            <div className={styles.cameraTimestamps}>
                              <p>
                                Last Image Captured:{' '}
                                <span className={styles.timestampValue}>
                                  {camera.captureDatetime
                                    ? dayjs(camera.captureDatetime).format(
                                        DATE_FORMAT.MM_YY_HH_MM
                                      )
                                    : '-'}
                                </span>{' '}
                              </p>
                              <p>
                                Image Count:{' '}
                                <span className={styles.timestampValue}>
                                  {camera.captureCount ?? '-'}
                                </span>
                              </p>
                            </div>
                          </Col>
                        }
                      </Row>
                    ) : (
                      <div className="camera-details">
                        {camera.confidenceLevel || camera.fillLevel ? (
                          <>
                            <Row>
                              {/* {currentCameraIndex !== 0 && (
                                <Col span={8}>
                                  <div className="w-full flex justify-start items-center for-camera-applied">
                                    <LeftOutlined
                                      onClick={handlePreviousCamera}
                                      className={`${styles.swiperNavPrev}`}
                                    />
                                  </div>
                                </Col>
                              )} */}
                              <Col span={16}>
                                <div>
                                  <p className={styles.cameraLabel}>
                                    {'Camera'}
                                  </p>
                                  <p className={styles.cameraName}>
                                    {camera.cameraName ?? '-'}
                                  </p>
                                </div>
                              </Col>
                              {/* {currentCameraIndex !== totalCameras - 1 && (
                                <Col span={8}>
                                  <div className="w-full flex justify-end items-center for-camera-applied">
                                    <RightOutlined
                                      onClick={handleNextCamera}
                                      className={`${styles.swiperNavNext}`}
                                    />
                                  </div>
                                </Col>
                              )} */}
                              {
                                <Col span={24} className="mt-5">
                                  <div className={styles.cameraTimestamps}>
                                    <p>
                                      Last Image Captured:{' '}
                                      <span className={styles.timestampValue}>
                                        {camera.captureDatetime
                                          ? dayjs(
                                              camera.captureDatetime
                                            ).format(DATE_FORMAT.MM_YY_HH_MM)
                                          : '-'}
                                      </span>{' '}
                                    </p>
                                    <p>
                                      Image Count:{' '}
                                      <span className={styles.timestampValue}>
                                        {camera.captureCount ?? '-'}
                                      </span>
                                    </p>
                                  </div>
                                </Col>
                              }
                            </Row>
                          </>
                        ) : null}
                      </div>
                    )}

                    {camera.s3ImageUrl ? (
                      <>
                        {/* {isEdit && (
                          <div className="camera-details">
                            <div className={styles.cameraTimestamps}>
                              <p>
                                Last Image Captured:{' '}
                                <span className={styles.timestampValue}>
                                  {camera.captureDatetime
                                    ? dayjs(camera.captureDatetime).format(
                                        DATE_FORMAT.MM_YY_HH_MM
                                      )
                                    : '-'}
                                </span>{' '}
                              </p>
                              <p>
                                Image Count:{' '}
                                <span className={styles.timestampValue}>
                                  {camera.captureCount ?? '-'}
                                </span>
                              </p>
                            </div>
                          </div>
                        )} */}
                        <div
                          className={`live-dumpster-view ${styles.cameraImageWrapper} ${camera.isPolluted ? 'polluted' : ''} ${!camera.isOnline ? 'offline' : ''}`}
                        >
                          {camera.isOnline ? (
                            <>
                              <Image
                                className={`${styles.cameraImage} live-view-image`}
                                alt={'camera'}
                                src={camera.s3ImageUrl}
                                preview={false}
                              />
                            </>
                          ) : (
                            <CameraException title="Camera Offline" />
                          )}

                          {camera?.isPolluted && camera.isOnline && (
                            <div className="polluted-text">
                              <Typography.Text className="font-bold">
                                Polluted
                              </Typography.Text>
                            </div>
                          )}

                          {camera.isOnline && (
                            <StripedProgressBar
                              fillLevel={
                                camera.folio3FillPercentage > 100
                                  ? 100
                                  : camera.folio3FillPercentage
                              }
                              status={
                                camera.folio3FillPercentage > camera.fillLevel
                                  ? 'exception'
                                  : 'normal'
                              }
                              confidence={camera.folio3ConfidenceLevel}
                              markerLevel={camera.fillLevel}
                              isFolio3ConfidenceHigher={
                                camera.folio3ConfidenceLevel >=
                                camera.confidenceLevel
                              }
                            />
                          )}

                          <div className={styles.imageOverlayActions}>
                            <div
                              className={styles.imageOverlayButtonsContainer}
                            >
                              {camera.enableRefresh && (
                                <RedoOutlined
                                  className={styles.icon}
                                  onClick={() => getDumpsterLiveData(true)}
                                />
                              )}
                              <img
                                src={PreviewIco.src}
                                alt="Preview"
                                className={styles.icon}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePreviewClick(camera.s3ImageUrl)
                                }}
                              />
                            </div>
                          </div>
                        </div>{' '}
                      </>
                    ) : (
                      <>
                        {camera.cameraName ? (
                          <div className="live-dumpster-view offline">
                            <CameraException title="Camera Offline" />
                          </div>
                        ) : (
                          <div className="live-dumpster-view offline">
                            <CameraException title="No Camera Applied" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex justify-center items-center">
              {Array.from({ length: totalCameras }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.paginationDot} ${index === currentCameraIndex ? styles.paginationDotActive : ''}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {totalCameras > 1 && (
        <>
          {currentCameraIndex !== 0 && (
            <LeftOutlined
              onClick={handlePreviousCamera}
              className={`${styles.swiperNavButton} ${styles.swiperNavPrev}`}
            />
          )}

          {currentCameraIndex !== totalCameras - 1 && (
            <RightOutlined
              onClick={handleNextCamera}
              className={`${styles.swiperNavButton} ${styles.swiperNavNext}`}
            />
          )}
        </>
      )}

      <ModalComponent
        isOpen={previewVisible}
        handleOk={handlePreviewCancel}
        handleCancel={handlePreviewCancel}
        footer={null}
        className="waste-stram-modal"
      >
        {previewImageUrl && (
          <img
            alt="Preview"
            src={previewImageUrl}
            style={{
              width: '100%',
              maxWidth: '80vw',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        )}
      </ModalComponent>
    </div>
  )
}
