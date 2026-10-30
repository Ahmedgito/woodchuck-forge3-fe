import { Card, Typography, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { WASTE_TYPE, WoodWasteVessel } from '@/src/utils/constants/types'
import {
  MESSAGES,
  WASTE_STREAM_HEADINGS,
  WASTE_STREAM_STRINGS,
} from '@/src/utils/constants/app-constants'
import SettingsModal from '@/src/components/settings/settings-modal'
import WasteStreamForm from './wasteStream-form'
import EmptyData from '@/src/components/settings/empty-data'
import { getVessels } from '@/src/services/global'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'

interface Props {
  wasteStreamList: WASTE_TYPE[]
  getWasteStreamData?: () => void
}
export default function WasteStreamList({
  wasteStreamList = [],
  getWasteStreamData = () => {},
}: Props) {
  const { Text } = Typography
  const [wasteModal, setWasteModal] = useState(false)
  const [wasteID, setwasteID] = useState<number | undefined>()
  const [vessels, setVessels] = useState<WoodWasteVessel[]>([])
  const { Title } = Typography
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()

  const handleEdit = async (id: number | undefined) => {
    if (!id) return
    setwasteID(id)

    try {
      setLoading(true)
      const result = await getVessels()
      setVessels(result.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }

    setWasteModal(true)
  }

  const getVesselsList = async () => {
    try {
      setLoading(true)
      const result = await getVessels()
      setVessels(result.data.data)
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
  useEffect(() => {
    getVesselsList()
  }, [])
  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {wasteStreamList.length === 0 && <EmptyData />}
          {wasteStreamList.map((wasteStream: WASTE_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Title className="text-color" level={5}>
                    {wasteStream.name}
                  </Title>
                  <Row gutter={[16, 0]}>
                    <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                      <Text>
                        {WASTE_STREAM_HEADINGS.tonPerOffRoleYard}
                        <span className="font-bold">
                          {wasteStream.tonPerOffRoleYard}
                        </span>
                      </Text>
                      <Text>
                        {WASTE_STREAM_HEADINGS.tonPerFrontLoadYard}
                        <span className="font-bold">
                          {wasteStream.tonPerFrontLoadYard}
                        </span>
                      </Text>
                      <Text>
                        {WASTE_STREAM_HEADINGS.tonPerCompactorYard}
                        <span className="font-bold">
                          {wasteStream.tonPerCompactorYard}
                        </span>
                      </Text>
                    </Col>

                    <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                      <Text>
                        {WASTE_STREAM_HEADINGS.colorCodeEst}
                        <span className="font-bold">
                          {wasteStream.colorCodeEst}
                        </span>
                      </Text>
                      <Text>
                        {WASTE_STREAM_HEADINGS.colorCodeReal}
                        <span className="font-bold">
                          {wasteStream.colorCodeReal}
                        </span>
                      </Text>
                    </Col>
                  </Row>
                  {Array.isArray(wasteStream?.wasteStreamTypes) &&
                  wasteStream.wasteStreamTypes.length > 0 ? (
                    wasteStream.wasteStreamTypes.map((type) => (
                      <>
                        <Row gutter={[16, 0]} className="mt-5">
                          <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                            <Text>{type?.name}</Text>
                          </Col>
                          <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                            <Text>
                              {WASTE_STREAM_HEADINGS.colorCodeEst}
                              <span className="font-bold">
                                {type?.colorCodeEst ?? 'N/A'}
                              </span>
                            </Text>
                            <Text>
                              {WASTE_STREAM_HEADINGS.colorCodeReal}
                              <span className="font-bold">
                                {type?.colorCodeReal ?? 'N/A'}
                              </span>
                            </Text>
                          </Col>
                        </Row>

                        {Array.isArray(type?.vessels) &&
                        type.vessels.length > 0 ? (
                          type.vessels.map((vessel, index) => (
                            <Col
                              xl={12}
                              lg={12}
                              md={12}
                              sm={12}
                              xs={24}
                              key={index}
                            >
                              <Text>
                                {WASTE_STREAM_STRINGS.TON_PER}{' '}
                                {vessel?.vessel?.name} :{' '}
                                <span className="font-bold">
                                  {vessel?.tons ?? 'N/A'}
                                </span>
                              </Text>
                            </Col>
                          ))
                        ) : (
                          <Col span={24}>
                            <Text type="secondary">
                              {' '}
                              {WASTE_STREAM_STRINGS.NO_VESSEL_AVAILABLE}
                            </Text>
                          </Col>
                        )}
                      </>
                    ))
                  ) : (
                    <Row>
                      <Col span={24}>
                        <Text type="secondary">
                          {WASTE_STREAM_STRINGS.NO_WASTE_STREAM_AVAILABLE}
                        </Text>
                      </Col>
                    </Row>
                  )}

                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(wasteStream.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {wasteModal && (
        <SettingsModal isOpen={wasteModal} setIsModalOpen={setWasteModal}>
          <WasteStreamForm
            setIsModalOpen={setWasteModal}
            onRefresh={getWasteStreamData}
            id={wasteID}
            vessels={vessels}
          />
        </SettingsModal>
      )}
    </>
  )
}
