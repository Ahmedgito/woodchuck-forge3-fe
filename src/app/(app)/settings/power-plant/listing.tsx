import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { POWER_PLANT_TYPE } from '@/src/utils/constants/types'
import { POWER_PLANT_HEADINGS } from '@/src/utils/constants/app-constants'
import SettingsModal from '@/src/components/settings/settings-modal'
import PowerPlantForm from './powerPlant-form'
import EmptyData from '@/src/components/settings/empty-data'
interface Props {
  powerPlantList: POWER_PLANT_TYPE[]
  getpowerPlantData?: () => void
}
export default function PowerPlantList({
  powerPlantList = [],
  getpowerPlantData = () => {},
}: Props) {
  const { Text } = Typography
  const [powerPlantModal, setPowerPlantModal] = useState(false)
  const [powerPlantId, setpowerPlantId] = useState<number | undefined>()

  const handleEdit = (id: number | undefined) => {
    if (!id) return
    setpowerPlantId(id)
    setPowerPlantModal(true)
  }
  const { Title } = Typography

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {powerPlantList.length === 0 && <EmptyData />}
          {powerPlantList.map((powerPlant: POWER_PLANT_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Title level={5} className="name text-color">
                    {powerPlant.name}
                  </Title>

                  <Row>
                    <Col
                      xl={6}
                      lg={6}
                      md={10}
                      sm={10}
                      xs={12}
                      className="gap-4 flex flex-col"
                    >
                      <Text>{POWER_PLANT_HEADINGS.TYPE}</Text>
                      {/* Hidden for future use */}
                      {/* <Text>{POWER_PLANT_HEADINGS.BTU_PER_TON}</Text> */}
                      <Text>{POWER_PLANT_HEADINGS.KWH_PER_TON}</Text>
                    </Col>

                    <Col
                      xl={12}
                      lg={12}
                      md={14}
                      sm={14}
                      xs={12}
                      className="gap-4 flex flex-col"
                    >
                      <Text className="font-bold">
                        {POWER_PLANT_HEADINGS.POWER_PLANT}
                      </Text>
                      {/* Hidden for future use */}
                      {/* <Text className="font-bold">{powerPlant.btuPerTon}</Text> */}
                      <Text className="font-bold">{powerPlant.kwhPerTon}</Text>
                    </Col>
                  </Row>

                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(powerPlant.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {powerPlantModal && (
        <SettingsModal
          isOpen={powerPlantModal}
          setIsModalOpen={setPowerPlantModal}
        >
          <PowerPlantForm
            setIsModalOpen={setPowerPlantModal}
            onRefresh={getpowerPlantData}
            id={powerPlantId}
          />
        </SettingsModal>
      )}
    </>
  )
}
