import { PlusOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import SettingsModal from '@/src/components/settings/settings-modal'
import { Button } from 'antd'
import WasteStreamStepsForm from '../wasteSteamStepsForm'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DUMPSTER_ALERT_TYPE,
  DUMPSTER_OPTIONS,
  HAULER_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

type Props = {
  dumpsterOptions: DUMPSTER_OPTIONS
  wasteStreamList: WASTE_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  jobSiteId: number | null | undefined
  haulerList: HAULER_TYPE[]
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isRefreshing: boolean
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  readOnly: boolean
}

function AddWasteStream({
  dumpsterOptions,
  wasteStreamList,
  locationList,
  jobSiteId,
  haulerList,
  setRefresh,
  isRefreshing,
  cameraData,
  alertData,
  readOnly,
}: Props) {
  const [isAddStreamOpen, setIsAddStreamOpen] = useState(false)

  const handleAddWasteStream = () => {
    setIsAddStreamOpen(true)
  }
  return (
    <div className="add-waste-stream-button">
      <SettingsModal
        className="waste-stream-modal"
        isOpen={isAddStreamOpen}
        setIsModalOpen={setIsAddStreamOpen}
      >
        <WasteStreamStepsForm
          dumpsterOptions={dumpsterOptions}
          wasteStreamList={wasteStreamList}
          locationList={locationList}
          jobSiteId={jobSiteId}
          haulerList={haulerList}
          setIsAddStreamOpen={setIsAddStreamOpen}
          setRefresh={setRefresh}
          isRefreshing={isRefreshing}
          cameraData={cameraData}
          alertData={alertData}
        />
      </SettingsModal>

      <Button
        onClick={handleAddWasteStream}
        className="size-60 ant-btn-secondary width-100 h-full flex flex-col items-center gap-8 justify-center"
        disabled={readOnly}
      >
        <p>Add Waste Stream</p>
        <PlusOutlined />
      </Button>
      <GenieButtonWrapper
        className="genie-add-waste-stram"
        hint="add_wastestream_button"
      >
        <></>
      </GenieButtonWrapper>
    </div>
  )
}

export default AddWasteStream
