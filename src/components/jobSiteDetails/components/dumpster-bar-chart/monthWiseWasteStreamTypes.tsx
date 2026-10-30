import { JobSitesWasteStreamsEntity } from '@/src/utils/constants/types'
import React, { useState } from 'react'
import { Button, Row, Typography } from 'antd'
import styles from './styles.module.scss'
import MonthWiseVesselItem from './monthWiseVesselItem'
import { PlusOutlined } from '@ant-design/icons'
import SettingsModal from '@/src/components/settings/settings-modal'
import EmptyData from '@/src/components/settings/empty-data'
import {
  LOCATION_TYPE,
  MESSAGES,
  ROLES,
  VESSEL_FORM,
  WASTE_STREAM_LOCATION_TYPE,
  WASTE_STREAMS,
} from '@/src/utils/constants/app-constants'
import { EmptyDumpsterIcon } from '@/src/components/appicons/icons'
import VesselFormWrapper from './add-bulk-vessels/VesselFormWrapper'
import DeleteVesselModal from '../modal/bulkDeleteModal'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { wasteStreamDumpstersBulkDelete } from '@/src/services/global'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'
import { useSession } from 'next-auth/react'
import { WasteStreamImageUploader } from '@/src/components/waste-stream-images/WasteStreamImageUploader'
import { WasteStreamReportImages } from '@/src/components/waste-stream-images/WasteStreamReportImages'

type Props = {
  subValue: JobSitesWasteStreamsEntity[]
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  endDate: string
  readOnly: boolean
  disabled: boolean
  reporting?: boolean
  showReportImages?: boolean
  selectModeSubId: number | null
  setSelectModeSubId: React.Dispatch<React.SetStateAction<number | null>>
  selectedVessels: number[]
  setSelectedVessels: React.Dispatch<React.SetStateAction<number[]>>
  isActive?: boolean
}

function MonthWiseWasteStreamTypes({
  subValue,
  setRefresh,
  endDate,
  readOnly,
  disabled,
  reporting,
  showReportImages = true,
  selectModeSubId,
  setSelectModeSubId,
  selectedVessels,
  setSelectedVessels,
  isActive,
}: Props) {
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [isAddVesselOpen, setIsAddVesselOpen] = useState(false)
  const [subWasteStream, setSubWasteStream] = useState<string>()
  const [colorCodeEst, setColorCodeEst] = useState<string>()
  const [colorCodeReal, setColorCodeReal] = useState<string>()
  const [jobSiteWastestreamsId, setJobSiteWastestreamsId] = useState<number>()
  const [inselectMode, setInselectMode] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { data: session } = useSession()
  const isAdminUser = session?.user.role.enum === ROLES.ADMIN
  const handleAddVessel = (
    subWasteStream: string,
    colorCodeEst: string,
    colorCodeReal: string,
    jobSiteWastestreamsId: number
  ) => {
    setSubWasteStream(subWasteStream)
    setColorCodeEst(colorCodeEst)
    setColorCodeReal(colorCodeReal)
    setJobSiteWastestreamsId(jobSiteWastestreamsId)
    setIsAddVesselOpen(true)
  }

  const getWasteStreamColor = (
    subItem: JobSitesWasteStreamsEntity,
    defaultColor: string
  ) => {
    const processingLocation = subItem?.wasteStreamLocations.find(
      (location) => location.type === WASTE_STREAM_LOCATION_TYPE.LOCATION
    )
    return processingLocation?.location?.typeLabel === LOCATION_TYPE.LANDFILL &&
      subItem?.wasteStream?.name?.toUpperCase() === WASTE_STREAMS.WOOD_WASTE
      ? '#E11212'
      : defaultColor
  }

  const getLocationName = (subItem: JobSitesWasteStreamsEntity) => {
    const locations = subItem?.wasteStreamLocations ?? []

    // If we have exactly 2 locations, display "Location A > Location B"
    if (locations.length === 2) {
      const start = locations.find(
        (l) => l.type === WASTE_STREAM_LOCATION_TYPE.LOCATION
      )
      const end = locations.find(
        (l) => l.type === WASTE_STREAM_LOCATION_TYPE.END_POINT
      )

      const orderedNames = [start?.locationName, end?.locationName].filter(
        Boolean
      ) as string[]

      if (orderedNames.length === 2) return orderedNames.join(' > ')

      // Fallback to array order if types are missing/unexpected
      const fallbackNames = locations
        .map((l) => l?.locationName)
        .filter(Boolean) as string[]

      return fallbackNames.length ? fallbackNames.join(' > ') : undefined
    }

    const location = locations.find(
      (location) => location.type === WASTE_STREAM_LOCATION_TYPE.LOCATION
    )
    return location?.locationName
  }
  const handleBulkDelete = async () => {
    try {
      setLoading(true)
      const payload = {
        jobSiteWastestreamsId: selectModeSubId,
        ids: selectedVessels,
      }
      await wasteStreamDumpstersBulkDelete(payload)
      triggerNotification('success', MESSAGES.SUCCESS, MESSAGES.VESSEL_DELETE)
      setRefresh(true)
      setSelectedVessels([])
      setSelectModeSubId(null)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    } finally {
      setIsDeleteModalOpen(false)
      setInselectMode(false)
    }
  }
  return (
    <div>
      <SettingsModal
        isOpen={isAddVesselOpen}
        setIsModalOpen={setIsAddVesselOpen}
        width={900}
      >
        <VesselFormWrapper
          setIsAddVesselOpen={setIsAddVesselOpen}
          subWasteStream={subWasteStream}
          colorCodeEst={colorCodeEst}
          colorCodeReal={colorCodeReal}
          jobSiteWastestreamsId={jobSiteWastestreamsId}
          setRefresh={setRefresh}
          endDate={endDate}
        />
      </SettingsModal>
      <DeleteVesselModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setSelectedVessels([])
          setIsDeleteModalOpen(false)
        }}
        onConfirm={handleBulkDelete}
      />
      {subValue.map((subItem: JobSitesWasteStreamsEntity) => {
        console.log('🚀 ~ MonthWiseWasteStreamTypes ~ subItem:', subItem)
        return (
          <div key={subItem.id} className="vessel-items">
            <div className="flex flex-row justify-between items-center for-mobile">
              <Typography.Title
                level={5}
                style={{
                  color: getWasteStreamColor(subItem, '#000000'),
                  textTransform: 'none',
                }}
              >
                <span className="font-bold">
                  {subItem.wasteStreamType.name}:
                  
                </span>{' '}
                <span className={styles.grayText}>
                  {getLocationName(subItem)}
                </span>
              </Typography.Title>
              {/* In report/PDF mode, only render preloaded report images (or nothing).
                  Never mount the uploader in reporting mode to avoid auth redirects. */}
              {reporting && showReportImages ? (
                <WasteStreamReportImages
                  jobsiteWasteStreamId={subItem.id}
                  wasteStreamName={subItem.wasteStreamType?.name}
                />
              ) : !reporting && readOnly ? (
                <WasteStreamImageUploader
                  jobsiteWasteStreamId={subItem.id}
                  wasteStreamName={subItem.wasteStreamType?.name}
                  readOnly={!isAdminUser}
                  isAdminUser={isAdminUser}
                />
              ) : null}
              {!readOnly && isActive && !reporting ? (
                subItem.deletedAt ? (
                  <Typography.Text>
                    {VESSEL_FORM.NO_LONGER_ACTIVE}
                  </Typography.Text>
                ) : (
                  <Row>
                    {selectModeSubId === subItem.id ? (
                      <Row>
                        {selectedVessels.length > 0 && (
                          <Button
                            className="normal"
                            danger
                            onClick={() => setIsDeleteModalOpen(true)}
                          >
                            {MESSAGES.DELETE}
                          </Button>
                        )}
                        <Button
                          className="normal"
                          disabled={
                            subItem.jobSitesWasteStreamsDumpsters.length > 0 &&
                            subItem.jobSitesWasteStreamsDumpsters.every((d) =>
                              selectedVessels.includes(d.id)
                            )
                          }
                          type="text"
                          onClick={() => {
                            // Select all vessels under this subitem
                            const allIds =
                              subItem.jobSitesWasteStreamsDumpsters.map(
                                (d) => d.id
                              )
                            setSelectedVessels(allIds)
                          }}
                        >
                          {MESSAGES.SELECT_ALL}
                        </Button>
                        <Button
                          className="normal"
                          type="text"
                          onClick={() => {
                            setSelectModeSubId(null)
                            setSelectedVessels([])
                            setInselectMode(false)
                          }}
                        >
                          {MESSAGES.CANCEL}
                        </Button>
                      </Row>
                    ) : (
                      <>
                        {subItem.jobSitesWasteStreamsDumpsters.length > 0 &&
                          isAdminUser && (
                            <Button
                              className="normal"
                              type="text"
                              onClick={() => {
                                setInselectMode(true)
                                setSelectModeSubId(subItem.id)
                              }}
                              disabled={
                                selectModeSubId !== null &&
                                selectModeSubId !== subItem.id
                              }
                            >
                              {MESSAGES.SELECT}
                            </Button>
                          )}
                      </>
                    )}
                    {isAdminUser && (
                      <GenieButtonWrapper hint="vessel_add">
                        <Button
                          type="default"
                          className="size-60 vessel-btn"
                          disabled={inselectMode}
                          onClick={() =>
                            handleAddVessel(
                              subItem.wasteStreamType.name,
                              getWasteStreamColor(
                                subItem,
                                subItem.wasteStreamType.colorCodeEst
                              ),
                              getWasteStreamColor(
                                subItem,
                                subItem.wasteStreamType.colorCodeReal
                              ),
                              subItem.id
                            )
                          }
                        >
                          <PlusOutlined /> {MESSAGES.ADD}
                        </Button>
                      </GenieButtonWrapper>
                    )}
                  </Row>
                )
              ) : null}
            </div>

            {subItem.jobSitesWasteStreamsDumpsters.length > 0 ? (
              <div className="flex flex-row dumpster-boxes">
                {subItem.jobSitesWasteStreamsDumpsters.map((item) => (
                  <MonthWiseVesselItem
                    vessel={item}
                    key={item.id}
                    colorCodeEst={getWasteStreamColor(
                      subItem,
                      subItem.wasteStreamType.colorCodeEst
                    )}
                    colorCodeReal={getWasteStreamColor(
                      subItem,
                      subItem.wasteStreamType.colorCodeReal
                    )}
                    setRefresh={setRefresh}
                    subItem={subItem}
                    endDate={endDate}
                    readOnly={readOnly}
                    disabled={disabled}
                    isSelect={selectModeSubId === subItem.id}
                    selectedVessels={selectedVessels}
                    setSelectedVessels={setSelectedVessels}
                  />
                ))}

                <div className="flex flex-col total-moved-unit">
                  <Typography.Title level={3}>
                    = {subItem.moved}
                  </Typography.Title>
                  <Typography.Text className="tons">{`${subItem.tons} tn`}</Typography.Text>
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center">
                <div className="icon-box">
                  <EmptyDumpsterIcon
                    colorCode={getWasteStreamColor(subItem, '#8B8B9A')}
                  />
                </div>
                <EmptyData message={MESSAGES.NO_VESSELS_ADDED} />
              </div>
            )}

            
          </div>
        )
      })}
    </div>
  )
}

export default MonthWiseWasteStreamTypes
