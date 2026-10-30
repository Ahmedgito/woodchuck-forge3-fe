import React, { useEffect } from 'react'
import AddWasteStream from '../addWasteSteam'
import { Col, Row, Typography } from 'antd'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  DUMPSTER_OPTIONS,
  GET_WASTE_STREAM_JOB_SITE_FORM_TYPE,
  HAULER_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import WasteStreamList from '../wasteStreamList'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { WasteStreamProvider } from '@/src/utils/context/waste-stream-context'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'

type Props = {
  dumpsterOptions: DUMPSTER_OPTIONS
  wasteStreamList: WASTE_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  jobSiteId: number | null | undefined
  haulerList: HAULER_TYPE[]
  wasteStreamData: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isRefreshing: boolean
  dumpsterList: DROP_DOWN_OPTIONS
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  readOnly?: boolean
  disabled?: boolean
  setIsNewWasteStream?: React.Dispatch<React.SetStateAction<boolean>>
  isNewWasteStream?: boolean
}

const { Title } = Typography

function WasteStream({
  dumpsterOptions,
  wasteStreamList,
  locationList,
  jobSiteId,
  haulerList,
  wasteStreamData,
  setRefresh,
  isRefreshing,
  dumpsterList,
  cameraData,
  alertData,
  readOnly = false,
  disabled = false,
  setIsNewWasteStream = () => {},
  isNewWasteStream = false,
}: Props) {
  // ✅ Calculate top and set margin-top dynamically
  useEffect(() => {
    const updateMarginTop = () => {
      const target = document.querySelector<HTMLElement>(
        '.live-dumpster-view.offline'
      )
      const parent = document.querySelector<HTMLElement>('.waste-steram-cards')
      const cameraBox = document.querySelector<HTMLElement>('.camera-alignment')

      if (!target || !parent || !cameraBox) return

      const targetRect = target.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      const top = targetRect.top - parentRect.top

      // ✅ Apply margin-top
      cameraBox.style.marginTop = `${top - 40}px`

      // ✅ Log for debugging
      console.log(
        `🔹 .live-dumpster-view.offline top: ${top}px (applied to .camera-alignment)`
      )
    }

    // Run on mount
    updateMarginTop()

    // Run on resize + scroll
    window.addEventListener('resize', updateMarginTop)
    window.addEventListener('scroll', updateMarginTop, { passive: true })

    return () => {
      window.removeEventListener('resize', updateMarginTop)
      window.removeEventListener('scroll', updateMarginTop)
    }
  }, [])

  return (
    <WasteStreamProvider>
      <div className={`waste-steram-cards ${readOnly ? 'mb-200' : ''}`}>
        <Title level={2} className="mt-10 flex">
          <GenieButtonWrapper position="right" hint="wastestream_card">
            {MESSAGES.DUMPSTER_LIVE_VIEW}
          </GenieButtonWrapper>
        </Title>
        <Row>
          <WasteStreamList
            data={wasteStreamData}
            setRefresh={setRefresh}
            isRefreshing={isRefreshing}
            jobSiteId={jobSiteId}
            dumpsterList={dumpsterList}
            haulerList={haulerList}
            locationList={locationList}
            cameraData={cameraData}
            alertData={alertData}
            disabled={disabled}
            setIsNewWasteStream={setIsNewWasteStream}
            isNewWasteStream={isNewWasteStream}
          />
          {!disabled && (
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div className="camera-alignment"></div>
              <AddWasteStream
                dumpsterOptions={dumpsterOptions}
                wasteStreamList={wasteStreamList}
                locationList={locationList}
                jobSiteId={jobSiteId}
                haulerList={haulerList}
                setRefresh={setRefresh}
                isRefreshing={isRefreshing}
                cameraData={cameraData}
                alertData={alertData}
                readOnly={readOnly}
              />
            </Col>
          )}
        </Row>
      </div>
    </WasteStreamProvider>
  )
}

export default WasteStream
