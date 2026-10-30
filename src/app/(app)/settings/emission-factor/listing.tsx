import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { EMISSION_FACTOR_TYPE } from '@/src/utils/constants/types'
import { EMISSION_FACTOR_HEADINGS } from '@/src/utils/constants/app-constants'
import SettingsModal from '@/src/components/settings/settings-modal'
import EmissionFactorForm from './emissionFactor-form'
import EmptyData from '@/src/components/settings/empty-data'

interface Props {
  emissionFactorList: EMISSION_FACTOR_TYPE[]
  getEmissionFactorData?: () => void
}

export default function EmissionFactorList({
  emissionFactorList = [],
  getEmissionFactorData = () => {},
}: Props) {
  const { Text } = Typography
  const [emissionFactorModal, setEmissionFactorModal] = useState(false)
  const [emissionFactorId, setEmissionFactorId] = useState<number | undefined>()

  const handleEdit = (id: number | undefined) => {
    if (!id) return
    setEmissionFactorId(id)
    setEmissionFactorModal(true)
  }
  const { Title } = Typography

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {emissionFactorList.length === 0 && <EmptyData />}
          {emissionFactorList.map((emissionFactor: EMISSION_FACTOR_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Title level={5} className="name text-color">
                    {emissionFactor.name}
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
                      <Text>{EMISSION_FACTOR_HEADINGS.KEY}</Text>
                      <Text>{EMISSION_FACTOR_HEADINGS.VALUE}</Text>
                    </Col>

                    <Col
                      xl={12}
                      lg={12}
                      md={14}
                      sm={14}
                      xs={12}
                      className="gap-4 flex flex-col"
                    >
                      <Text className="font-bold">{emissionFactor.key}</Text>
                      <Text className="font-bold">{emissionFactor.value}</Text>
                    </Col>
                  </Row>

                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(emissionFactor.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {emissionFactorModal && (
        <SettingsModal
          isOpen={emissionFactorModal}
          setIsModalOpen={setEmissionFactorModal}
        >
          <EmissionFactorForm
            setIsModalOpen={setEmissionFactorModal}
            onRefresh={getEmissionFactorData}
            id={emissionFactorId}
          />
        </SettingsModal>
      )}
    </>
  )
}

