'use client'
import { Col } from 'antd'
import ClientList from './construction-companies/listing'
import HaulerList from './hauler/listing'
import GlobalData from './global-data/page'
import CollapseTab from '@/src/components/common/collapse'
import { CollapseProps } from 'antd/lib'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { ReactNode, useEffect, useState } from 'react'
import CollapseTitle from '@/src/components/common/collapseTitle'
import { useLoader } from '@/src/utils/context/loader-context'
import WasteStreamList from './wasteStream/listing'
import PowerPlantList from './power-plant/listing'
import EmissionFactorList from './emission-factor/listing'
import {
  fetchCameraData,
  fetchClientData,
  fetchEndClientData,
  fetchHaulerData,
  fetchLocationData,
  fetchManufacturerData,
  fetchOfftakeData,
  fetchPowerPlantData,
  fetchEmissionFactorData,
  fetchWasteStreamData,
} from './dataFetchers'
import {
  CAMERA_TYPE,
  HAULER_TYPE,
  LOCATION_TYPE,
  POWER_PLANT_TYPE,
  EMISSION_FACTOR_TYPE,
  USER_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import LocationList from './location/listing'
import LocationForm from './location/location-form'
import SettingsModal from '@/src/components/settings/settings-modal'
import ConstructionCompaniesForm from './construction-companies/construction-companies-form'
import HaulerForm from './hauler/hauler-form'
import CameraList from './camera/listing'
import PowerPlantForm from './power-plant/powerPlant-form'
import EmissionFactorForm from './emission-factor/emissionFactor-form'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import CameraForm from './camera/camera-form'
import EndClientList from './end-client/listing'
import EndClientForm from './end-client/end-client-form'
import ManufacturerList from './manufacturer/listing'
import ManufacturerForm from './manufacturer/manufacturer-form'
import OfftakeList from './offtake/listing'
import OfftakeForm from './offtake/offtake-form'
import VesselForm from './vessel/vessel-form'

export default function Setting() {
  const [clients, setClients] = useState<USER_TYPE[]>([])
  const [endClients, setEndClients] = useState<USER_TYPE[]>([])
  const [manufacturer, setManufacturer] = useState<USER_TYPE[]>([])
  const [offtake, setOfftake] = useState<USER_TYPE[]>([])
  const [haulerList, setHauler] = useState<HAULER_TYPE[]>([])
  const [cameraList, setCameraList] = useState<CAMERA_TYPE[]>([])
  const [haulerModal, setHaulerModal] = useState(false)
  const [cameraModal, setCameraModal] = useState(false)
  const [clientModal, setClientModal] = useState(false)
  const [endClientsModal, setEndClientsModal] = useState(false)
  const [manufacturerModal, setManufacturerModal] = useState(false)
  const [offtakeModal, setOfftakeModal] = useState(false)
  const [wasteStreamList, setWasteStreamList] = useState<WASTE_TYPE[]>([])
  const [wasteStreamModal, setWasteStreamModal] = useState(false)
  const [powerPlantList, setPowerPlantList] = useState<POWER_PLANT_TYPE[]>([])
  const [powerPlantModal, setPowerPlantModal] = useState(false)
  const [emissionFactorList, setEmissionFactorList] = useState<
    EMISSION_FACTOR_TYPE[]
  >([])
  const [emissionFactorModal, setEmissionFactorModal] = useState(false)
  const [locationModal, setLocationModal] = useState(false)
  const [locationList, setLocationList] = useState<LOCATION_TYPE[]>([])
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()

  const trigger = createTriggerNotification(triggerNotification)

  useEffect(() => {
    fetchClientData({
      setState: setClients,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchEndClientData({
      setState: setEndClients,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchManufacturerData({
      setState: setManufacturer,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchOfftakeData({
      setState: setOfftake,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchHaulerData({
      setState: setHauler,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchWasteStreamData({
      setState: setWasteStreamList,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchPowerPlantData({
      setState: setPowerPlantList,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchEmissionFactorData({
      setState: setEmissionFactorList,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchLocationData({
      setState: setLocationList,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
    fetchCameraData({
      setState: setCameraList,
      setLoading: setLoading,
      triggerNotification: trigger,
    })
  }, [])

  const defaultItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <CollapseTitle
          title={MESSAGES.CLIENTS}
          state={clientModal}
          setState={setClientModal}
          buttonText={MESSAGES.ADD_CLIENT}
        />
      ),
      children: (
        <ClientList
          clients={clients}
          getClientData={() =>
            fetchClientData({
              setState: setClients,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '2',
      label: (
        <CollapseTitle
          title={MESSAGES.END_CLIENTS}
          state={endClientsModal}
          setState={setEndClientsModal}
          buttonText={MESSAGES.ADD_END_CLIENT}
        />
      ),
      children: (
        <EndClientList
          endClients={endClients}
          getEndClientData={() =>
            fetchEndClientData({
              setState: setEndClients,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '3',
      label: (
        <CollapseTitle
          title={MESSAGES.MANUFACTURERS}
          state={manufacturerModal}
          setState={setManufacturerModal}
          buttonText={MESSAGES.ADD_MANUFACTURER}
        />
      ),
      children: (
        <ManufacturerList
          manufacturer={manufacturer}
          getManufacturerData={() =>
            fetchManufacturerData({
              setState: setManufacturer,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '11',
      label: (
        <CollapseTitle
          title={MESSAGES.OFFTAKES}
          state={offtakeModal}
          setState={setOfftakeModal}
          buttonText={MESSAGES.ADD_OFFTAKE}
        />
      ),
      children: (
        <OfftakeList
          offtake={offtake}
          getOfftakeData={() =>
            fetchOfftakeData({
              setState: setOfftake,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '4',
      label: (
        <CollapseTitle
          title={MESSAGES.ESTIMATED_TON_PER_WASTE_TYPE_AND_DUMPSTER_SIZE_TYPE}
          state={wasteStreamModal}
          setState={setWasteStreamModal}
        />
      ),
      children: (
        <WasteStreamList
          wasteStreamList={wasteStreamList}
          getWasteStreamData={() =>
            fetchWasteStreamData({
              setState: setWasteStreamList,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '5',
      label: <CollapseTitle title={MESSAGES.VESSEL_HEADING} />,
      children: <VesselForm />,
    },
    {
      key: '6',
      label: (
        <CollapseTitle
          title={MESSAGES.LOCATIONS}
          state={locationModal}
          setState={setLocationModal}
          buttonText={MESSAGES.ADD_LOCATION}
        />
      ),
      children: (
        <LocationList
          locationList={locationList}
          getLocationData={() =>
            fetchLocationData({
              setState: setLocationList,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '7',
      label: (
        <CollapseTitle
          title={MESSAGES.POWER_PLANTS}
          state={powerPlantModal}
          setState={setPowerPlantModal}
          buttonText={MESSAGES.ADD_PLANTS}
        />
      ),
      children: (
        <PowerPlantList
          powerPlantList={powerPlantList}
          getpowerPlantData={() =>
            fetchPowerPlantData({
              setState: setPowerPlantList,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '9',
      label: (
        <CollapseTitle
          title={MESSAGES.HAULERS}
          state={haulerModal}
          setState={setHaulerModal}
          buttonText={MESSAGES.ADD_HAULER}
        />
      ),
      children: (
        <HaulerList
          haulerList={haulerList}
          getHaulerData={() =>
            fetchHaulerData({
              setState: setHauler,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '10',
      label: (
        <CollapseTitle
          title={MESSAGES.CAMERA_ID}
          state={cameraModal}
          setState={setCameraModal}
          buttonText={MESSAGES.ADD_CAMERAS}
        />
      ),
      children: (
        <CameraList
          cameraList={cameraList}
          getCameraData={() =>
            fetchCameraData({
              setState: setCameraList,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
    {
      key: '8',
      label: (
        <CollapseTitle
          title={MESSAGES.EMISSION_FACTORS}
          state={emissionFactorModal}
          setState={setEmissionFactorModal}
          buttonText={MESSAGES.ADD_EMISSION_FACTOR}
        />
      ),
      children: (
        <EmissionFactorList
          emissionFactorList={emissionFactorList}
          getEmissionFactorData={() =>
            fetchEmissionFactorData({
              setState: setEmissionFactorList,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      ),
    },
  ]

  const renderModal = () => {
    let children: ReactNode
    let props: any

    switch (true) {
      case clientModal:
        props = {
          isOpen: clientModal,
          setIsModalOpen: setClientModal,
          children: (
            <ConstructionCompaniesForm
              setIsModalOpen={setClientModal}
              onRefresh={() =>
                fetchClientData({
                  setState: setClients,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
              id={undefined}
            />
          ),
        }
        break

      case endClientsModal:
        props = {
          isOpen: endClientsModal,
          setIsModalOpen: setEndClientsModal,
          children: (
            <EndClientForm
              setIsModalOpen={setEndClientsModal}
              onRefresh={() =>
                fetchEndClientData({
                  setState: setEndClients,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
              id={null}
            />
          ),
        }
        break

      case manufacturerModal:
        props = {
          isOpen: manufacturerModal,
          setIsModalOpen: setManufacturerModal,
          children: (
            <ManufacturerForm
              setIsModalOpen={setManufacturerModal}
              onRefresh={() =>
                fetchManufacturerData({
                  setState: setManufacturer,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
              id={null}
            />
          ),
        }
        break

      case offtakeModal:
        props = {
          isOpen: offtakeModal,
          setIsModalOpen: setOfftakeModal,
          children: (
            <OfftakeForm
              setIsModalOpen={setOfftakeModal}
              onRefresh={() =>
                fetchOfftakeData({
                  setState: setOfftake,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
              id={null}
            />
          ),
        }
        break

      case haulerModal:
        props = {
          isOpen: haulerModal,
          setIsModalOpen: setHaulerModal,
          children: (
            <HaulerForm
              setIsModalOpen={setHaulerModal}
              id={null}
              onRefresh={() =>
                fetchHaulerData({
                  setState: setHauler,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
            />
          ),
        }
        break
      case powerPlantModal:
        props = {
          isOpen: powerPlantModal,
          setIsModalOpen: setPowerPlantModal,
          children: (
            <PowerPlantForm
              setIsModalOpen={setPowerPlantModal}
              id={null}
              onRefresh={() =>
                fetchPowerPlantData({
                  setState: setPowerPlantList,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
            />
          ),
        }
        break

      case emissionFactorModal:
        props = {
          isOpen: emissionFactorModal,
          setIsModalOpen: setEmissionFactorModal,
          children: (
            <EmissionFactorForm
              setIsModalOpen={setEmissionFactorModal}
              id={null}
              onRefresh={() =>
                fetchEmissionFactorData({
                  setState: setEmissionFactorList,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
            />
          ),
        }
        break

      case locationModal:
        props = {
          isOpen: locationModal,
          setIsModalOpen: setLocationModal,
          children: (
            <LocationForm
              setIsModalOpen={setLocationModal}
              onRefresh={() =>
                fetchLocationData({
                  setState: setLocationList,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
            />
          ),
        }
        break

      case cameraModal:
        props = {
          isOpen: cameraModal,
          setIsModalOpen: setCameraModal,
          children: (
            <CameraForm
              setIsModalOpen={setCameraModal}
              onRefresh={() =>
                fetchCameraData({
                  setState: setCameraList,
                  setLoading: setLoading,
                  triggerNotification: trigger,
                })
              }
            />
          ),
        }
        break

      default:
        return null
    }

    return <SettingsModal {...props} />
  }

  return (
    <>
      {renderModal()}
      <section className="container white-area">
        <div className="form-section settings-form">
          <GlobalData />
          <Col>
            <CollapseTab className="collapse-primary" items={defaultItems} />
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {/* <ClientList /> */}
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {/* <HaulerList /> */}
            </Col>
          </Col>
        </div>
      </section>
    </>
  )
}
