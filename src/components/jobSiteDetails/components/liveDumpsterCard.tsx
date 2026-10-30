import { Row, Col, Image, Typography, Space, Tooltip, Spin } from 'antd'
import DumpsterImage from '../../../../public/assets/activeDumpster.png'
import PreviewIco from '../../../../public/assets/preview.svg'
import { useEffect, useState } from 'react'
import { getCameraLiveView } from '@/src/services/global'
import CustomProgress from './customProgress'
import { getDumpsterDataByJobsiteId } from '@/src/services/jobsite'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const { Text } = Typography
dayjs.extend(utc)
dayjs.extend(timezone)

export default function DumpsterCard({
  dumpster,
  disabled,
  setLiveDumpsterId,
  setDumsterModal,
}: {
  dumpster: any
  disabled?: boolean
  setLiveDumpsterId: (_value: number | undefined) => void
  setDumsterModal: (_value: boolean) => void
}) {
  const [data, setData] = useState<any>(null)
  const [loading, isLoading] = useState(false)
  const getDumpsterLiveData = async (refresh?: boolean) => {
    isLoading(true)
    try {
      let route
      if (dumpster?.camera?.isAdmin) {
        route = getDumpsterDataByJobsiteId(dumpster?.jobSiteId)
      } else {
        route = getCameraLiveView(dumpster?.camera?.cameraId, refresh)
      }
      const response = await route
      const data = response?.data?.data

      if (data) {
        const {
          s3ImageUrl,
          fillPercentage,
          isOnline,
          captureCount,
          captureDatetime,
          folio3FillPercentage,
          enableRefresh,
          isPolluted,
        } = data

        setData({
          s3ImageUrl,
          fillPercentage,
          isOnline,
          captureCount,
          captureDatetime,
          folio3FillPercentage,
          enableRefresh,
          isPolluted,
        })
      } else {
        setData(null)
      }
      isLoading(false)
    } catch (err) {
      isLoading(false)
      console.log('error in fetching dumpster live data', err)
    }
  }
  useEffect(() => {
    if (dumpster?.cameraId) {
      getDumpsterLiveData()
      const intervalId = setInterval(
        getDumpsterLiveData,
        Number(process.env.NEXT_PUBLIC_DUMPSTER_REFRESH_RATE)
      )
      return () => clearInterval(intervalId)
    }
  }, [dumpster])

  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-5">
        <Row className="ant-row-space-between">
          <Space className="card-icons">
            <Tooltip title={dumpster.name} trigger="hover">
              <Text className="font-medium dumpster-text">
                <i className="icon-light mr-2"></i> <p>{dumpster.name}</p>
              </Text>
            </Tooltip>
          </Space>
          {loading && <Spin size="small" />}
          {!disabled && !loading && data?.enableRefresh && (
            <i
              onClick={() => {
                getDumpsterLiveData(true)
              }}
              className="ml-2 icon-repeat edit-icon"
              style={{ color: '#3a025f' }}
            />
          )}
          {!disabled && (
            <i
              onClick={() => {
                setLiveDumpsterId(dumpster.id)
                setDumsterModal(true)
              }}
              className="ml-2 icon-pencil edit-icon"
              style={{ color: '#3a025f' }}
            />
          )}
        </Row>
        <Row className="ant-row-space-between">
          <Text className="font-bold">
            Last Image Captured:{' '}
            <span className="max-level">
              {data?.captureDatetime &&
                dayjs(data?.captureDatetime)
                  .tz('America/New_York')
                  .format('MM/DD HH:mm')}
            </span>
          </Text>
        </Row>
        <Row className="ant-row-space-between mb-2">
          <Text className="font-bold">
            Image(s) Count:{' '}
            <span className="max-level">{data?.captureCount || 0}</span>
          </Text>
        </Row>

        {data?.isOnline && (
          <>
            <div
              className={`live-dumpster-view ${data.isPolluted ? 'polluted' : ''}`}
            >
              <Image
                className="live-view-image"
                alt="activeDumpster"
                src={data?.s3ImageUrl || DumpsterImage.src}
                preview={{
                  mask: (
                    <>
                      <img src={PreviewIco.src} />
                    </>
                  ),
                  maskClassName: 'custom-mask',
                }}
              />
              {data?.isPolluted && (
                <div className="polluted-text">
                  <Text className="font-bold">
                    Polluted <i className="icon-warning"></i>
                  </Text>
                </div>
              )}
            </div>
            {/* <div className="mt-5 camera-date"> */}
            {/* <Text className="font-bold">
                <span className="max-level">
                  {dayjs(data?.captureDatetime).format('MM/DD HH:mm')}
                </span>
              </Text> */}
            {/* </div> */}
            <div className="mt-5">
              <Text className="font-bold">
                SB Fill Level:{' '}
                <span className="max-level">{` Max ${dumpster.maxLevel || 0}%`}</span>
              </Text>
              <CustomProgress
                percent={data?.fillPercentage || 0}
                threshold={dumpster.maxLevel}
              />
            </div>
            <div className="mt-5">
              <Text className="font-bold">
                Folio3 Fill Level:{' '}
                <span className="max-level">{` Max ${dumpster.maxLevel || 0}%`}</span>
              </Text>
              <CustomProgress
                percent={data?.folio3FillPercentage || 0}
                threshold={dumpster.maxLevel}
              />
            </div>
          </>
        )}

        {(!data || (data && !data.isOnline)) && (
          <div className="live-dumpster-view offline">
            <Image
              className="live-view-image"
              alt="activeDumpster"
              src={DumpsterImage.src}
              preview={{
                mask: (
                  <>
                    <img src={PreviewIco.src} />
                  </>
                ),
                maskClassName: 'custom-mask',
              }}
            />
            <div className="offline-text">OFFLINE</div>
          </div>
        )}
      </Col>
    </>
  )
}
