import { Card, Typography, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import {
  LOCATION_TYPE,
  LOCATION_TYPE_DROPDOWN,
} from '@/src/utils/constants/types'
import {
  LOCATION_HEADINGS,
  LOCATION_TO_TYPES,
  MESSAGES,
} from '@/src/utils/constants/app-constants'
import { getLocationTypes } from '@/src/services/global'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import SettingsModal from '@/src/components/settings/settings-modal'
import LocationForm from './location-form'
import EmptyData from '@/src/components/settings/empty-data'

interface Props {
  locationList: LOCATION_TYPE[]
  getLocationData?: () => void
}

export default function LocationList({
  locationList = [],
  getLocationData = () => {},
}: Props) {
  const { Text } = Typography
  const [locationModal, setLocationModal] = useState(false)
  const [locationId, setLocationId] = useState<number | undefined>()
  const [locationTypes, setLocationTypes] = useState([])
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    getLocationTypesData()
  }, [])

  const handleEdit = (id: number | undefined) => {
    if (!id) return
    setLocationId(id)
    setLocationModal(true)
  }

  const getLocationTypesData = async () => {
    try {
      setLoading(true)
      const result = await getLocationTypes()
      setLocationTypes(result.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_LOCATION
      )
    }
  }

  const getDistance = (location: LOCATION_TYPE) => {
    if (location.toType === LOCATION_TO_TYPES.POWER_PLANT) {
      return location.relatedPowerPlant && location.relatedPowerPlant.name
    } else if (location.toType === LOCATION_TO_TYPES.LOCATION) {
      return location.relatedLocation && location.relatedLocation.name
    } else {
      return 'N/A'
    }
  }

  const getType = (location: LOCATION_TYPE) => {
    const type = locationTypes.find(
      (loc: LOCATION_TYPE_DROPDOWN) => loc.id === location.type
    ) || { label: 'N/A' }
    return type.label
  }

  const { Title } = Typography

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {locationList.length === 0 && <EmptyData />}
          {locationList.map((location: LOCATION_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Title level={5} className="name text-color">
                    {location.name}
                  </Title>

                  <Row gutter={[16, 16]} className="mb-3">
                    <Col
                      xl={6}
                      lg={6}
                      md={8}
                      sm={8}
                      xs={10}
                      className="gap-4 flex flex-col"
                    >
                      <Text>{`${LOCATION_HEADINGS.TYPE}: `}</Text>
                    </Col>

                    <Col
                      xl={18}
                      lg={18}
                      md={14}
                      sm={12}
                      xs={14}
                      className="gap-4 flex flex-col"
                    >
                      <Text className="font-bold">{getType(location)}</Text>
                    </Col>
                  </Row>
                  <i
                    className="icon-pencil edit-icon"
                    onClick={() => handleEdit(location.id)}
                  ></i>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
      {locationModal && (
        <SettingsModal isOpen={locationModal} setIsModalOpen={setLocationModal}>
          <LocationForm
            setIsModalOpen={setLocationModal}
            onRefresh={getLocationData}
            id={locationId}
          />
        </SettingsModal>
      )}
    </>
  )
}
