'use client'
import { Divider, Typography, Row, Col, Button, Card } from 'antd'
import { useState, useEffect } from 'react'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import DumpsterRefusedEditModal from './modal'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { getDumpsterStatus } from '@/src/services/jobsite'
import { useLoader } from '@/src/utils/context/loader-context'
interface Dumpster {
  size: number
  delivered: number
  miles: number
  waste: number
  refused: number
}
interface Gate {
  name: string
  dumpster_location: number
  dumpster: Dumpster[]
}

interface DumpsterData {
  total_delivered: number
  total_miles: number
  total_waste: number
  total_refused: number
  gates: Gate[]
}

export default function DumpsterStatus({
  id,
  disabled,
  refresh,
  setRefresh,
}: {
  id: number | null | undefined
  disabled: boolean
  refresh: boolean
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const triggerNotification = useTriggerNotification()
  const [fieldLabel, setFieldLabel] = useState<number | null | undefined>()
  const [dumpsterLocationId, setDumpsterLocationId] = useState<
    number | undefined | null
  >()
  const [isFieldModalOpen, setIsFieldModalOpen] = useState<boolean>(false)
  const [dumpsterStatus, setDumpsterStatus] = useState<DumpsterData | null>(
    null
  )
  const [dumpsterRefusedCount, setDumpsterRefusedCount] = useState(0)
  const [dumpsterUpdated, setDumpsterUpdated] = useState(false)
  const { setLoading } = useLoader()

  const openEditModal = (label: number | undefined, id: number) => {
    setFieldLabel(label)
    setDumpsterLocationId(id)
    setIsFieldModalOpen(true)
  }
  const onFieldChange = () => {
    setIsFieldModalOpen(false)
    setDumpsterLocationId(null)
    setFieldLabel(null)
    setDumpsterUpdated((prevState) => !prevState)
    setRefresh((prevState) => !prevState)
  }
  const getDumpsterStatusData = async () => {
    try {
      setLoading(true)
      let result = await getDumpsterStatus(id)
      setDumpsterStatus(result.data.data)
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
    if (id) getDumpsterStatusData()
  }, [id, dumpsterUpdated, refresh])
  const { Title, Text } = Typography
  return (
    <Typography>
      {isFieldModalOpen && fieldLabel && (
        <DumpsterRefusedEditModal
          dumpsterSize={fieldLabel}
          dumpsterLocationId={dumpsterLocationId}
          jobsiteId={id}
          isOpen={isFieldModalOpen}
          defaultValue={dumpsterRefusedCount}
          setIsModalOpen={setIsFieldModalOpen}
          onChange={onFieldChange}
        />
      )}
      <Title className="font-600 mt-15" level={5}>
        {MESSAGES.DUMPSTER_STATUS}
      </Title>
      <Row className="dumpster-status" gutter={24}>
        <Col span={24}>
          <Row gutter={24}>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Title>{dumpsterStatus?.total_delivered || 0}</Title>
              <Text className="font-medium">
                {MESSAGES.DUMPSTERS_DELIVERED}
              </Text>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Title level={1}>
                {dumpsterStatus?.total_miles || 0}
                <span> {MESSAGES.MI}</span>
              </Title>
              <Text className="font-medium">{MESSAGES.TOTAL_MILES_TO_MMR}</Text>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Title level={1}>
                {dumpsterStatus?.total_waste || 0}
                <span> t</span>
              </Title>
              <Text className="font-medium">
                {MESSAGES.COLLECTED_WOOD_WASTE}
              </Text>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="red">
              <Title level={1}>{dumpsterStatus?.total_refused || 0}</Title>
              <Text className="font-medium">
                {MESSAGES.DUMPSTER_REFUSED_BY_MMR}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={24}>
            {dumpsterStatus?.gates?.map((gate, index) => (
              <>
                <Col span={24} key={index}>
                  <Title level={4} className="font-bold">
                    {gate.name}
                  </Title>
                </Col>

                {gate.dumpster.map((dumpster, index) => (
                  <>
                    <Col xs={24} sm={24} md={12} lg={6} xl={6} key={index}>
                      <Card className="grey-bg">
                        <Title level={4}>
                          {dumpster.delivered || 0}{' '}
                          <span className="font-bold">x</span>{' '}
                          <span className="font-bold">
                            {dumpster.size || 0}{' '}
                          </span>
                          <span className="font-bold">{MESSAGES.YARDS}</span>
                        </Title>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                      <Card className="grey-bg">
                        <Title level={4}>
                          {dumpster.miles || 0} {MESSAGES.MI}
                        </Title>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                      <Card className="grey-bg">
                        <Title level={4}>
                          {dumpster.waste || 0}
                          <span className="font-bold">{MESSAGES.RECYCLED}</span>
                        </Title>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6} xl={6} className="red">
                      <Card className="grey-bg">
                        <Title level={4}>
                          {dumpster.refused || 0}{' '}
                          <span className="font-bold">x</span>{' '}
                          <span className="font-bold">{dumpster.size}</span>{' '}
                          <span className="font-bold">{MESSAGES.YARDS}</span>
                        </Title>
                        {!disabled && (
                          <Button
                            className="edit-icon"
                            type="text"
                            icon={<i className="icon-pencil"></i>}
                            onClick={() => {
                              setDumpsterRefusedCount(dumpster.refused),
                                openEditModal(
                                  dumpster.size,
                                  gate.dumpster_location
                                )
                            }}
                          />
                        )}
                      </Card>
                    </Col>
                  </>
                ))}
              </>
            ))}
          </Row>
        </Col>
        <Divider />
      </Row>
    </Typography>
  )
}
