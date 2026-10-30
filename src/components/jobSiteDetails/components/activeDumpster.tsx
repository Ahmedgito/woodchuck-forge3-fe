'use client'
import { Divider, Typography, Row, Col, Space, Image } from 'antd'
import { MESSAGES } from '../../../utils/constants/app-constants'
import DumpsterImage from '../../../../public/assets/activeDumpster.png'
import { useEffect, useState } from 'react'
import { useLoader } from '@/src/utils/context/loader-context'
import { getDumpsterData } from '@/src/services/jobsite'

import PreviewIco from '../../../../public/assets/preview.svg'
import CustomProgress from './customProgress'
import SettingsModal from '../../settings/settings-modal'
import AddLiveDumpsterForm from './modal/addLiveDumpsterModal'
import LiveDumpsterView from './liveDumpsterView'

export default function ActiveDumpster({
  id,
  liveDumpsterList,
  disabled,
  newJobsite,
  setPageRefresh,
}: {
  id?: number | null | undefined
  liveDumpsterList?: any[]
  disabled?: boolean
  newJobsite?: boolean
  setPageRefresh?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { Title, Text } = Typography
  const [adminSite, setAdminSite] = useState<boolean>(false)
  const [dumpsterModal, setDumsterModal] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const { setLoading } = useLoader()
  const [liveDumpsterId, setLiveDumpsterId] = useState<number | undefined>()

  const getPercent = (name: string) => {
    if (name.includes('Empty')) {
      return 0
    } else if (name.includes('Full')) {
      return 100
    } else {
      return 0
    }
  }

  const getDumpsterLiveData = async () => {
    try {
      const response = await getDumpsterData()
      if (response?.data.data) {
        setData({
          url: response.data.data.s3ImageUrl,
          percent: response.data.data.fillPercentage,
        })
      }
      console.log('response')
      console.log('dumpster live data', data)
    } catch (err) {
      console.log('error in fetching dumpster live data', err)
    }
  }

  // useEffect(() => {
  //   if (s3Client) {
  //     const intervalId = setInterval(fetchData, 5000) // Fetch data every 5 seconds
  //     return () => clearInterval(intervalId)
  //   }
  // }, [s3Client])

  useEffect(() => {
    if (id && id?.toString() === process.env.NEXT_PUBLIC_CLIENT_JOBSITE_ID) {
      setAdminSite(true)
      // connectS3()
      getDumpsterLiveData()

      const intervalId = setInterval(
        getDumpsterLiveData,
        Number(process.env.NEXT_PUBLIC_DUMPSTER_REFRESH_RATE)
      ) // Fetch data every 5 seconds
      return () => clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (dumpsterModal === false) {
      setLiveDumpsterId(undefined)
    }
  }, [dumpsterModal])

  return (
    <section className="active-dumpster">
      {dumpsterModal && (
        <SettingsModal isOpen={dumpsterModal} setIsModalOpen={setDumsterModal}>
          <AddLiveDumpsterForm
            setIsModalOpen={setDumsterModal}
            onRefresh={() => setPageRefresh && setPageRefresh(true)}
            jobSiteId={id}
            liveDumpsterId={liveDumpsterId}
          />
        </SettingsModal>
      )}
      <Title className="mt-3 mb-8" level={1}>
        {MESSAGES.DUMPSTER_LIVE_VIEW}
      </Title>

      {adminSite && data && (
        <>
          <Row className="mb-5">
            <Space size={8}>
              <i className="icon-light"></i>
              <Title level={2}>{adminSite ? 1 : 2}</Title>
              <Text className="font-medium">
                {adminSite
                  ? MESSAGES.ACTIVE_DUMPSTER
                  : MESSAGES.ACTIVE_DUMPSTERS}
              </Text>
            </Space>
          </Row>

          <Row gutter={24}>
            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
              <Image
                alt="activeDumpster"
                src={data.url}
                preview={{
                  mask: (
                    <>
                      <img src={PreviewIco.src} />
                    </>
                  ),
                  maskClassName: 'custom-mask',
                }}
              />
              <div className="mt-5">
                <CustomProgress percent={data.percent} threshold={100} />
              </div>
            </Col>
          </Row>
        </>
      )}

      {!adminSite && (
        <>
          {newJobsite ? (
            <>
              {!adminSite && (
                <Row gutter={24}>
                  <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Image
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
                    <div className="mt-5">
                      <Text className="font-medium">South Gate</Text>
                      <CustomProgress percent={81} />
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Image
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
                    <div className="mt-5">
                      <Text className="font-medium">South Gate</Text>
                      <CustomProgress percent={29} />
                    </div>
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <LiveDumpsterView
              setDumsterModal={setDumsterModal}
              liveDumpsterList={liveDumpsterList}
              setLiveDumpsterId={setLiveDumpsterId}
              disabled={disabled}
            />
          )}
        </>
      )}

      <Divider />
    </section>
  )
}
