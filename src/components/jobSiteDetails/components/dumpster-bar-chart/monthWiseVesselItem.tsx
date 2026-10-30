import { JobSitesWasteStreamsDumpster } from '@/src/utils/constants/types'
import { Checkbox, Typography } from 'antd'
import React, { useState } from 'react'
import styles from './styles.module.scss'
import {
  DumpsterIconSolid,
  DumpsterIconStriped,
} from '@/src/components/appicons/icons'
import SettingsModal from '@/src/components/settings/settings-modal'
import VesselForm from './vesselForm'
import { CheckboxProps } from 'antd/lib'
import { COLOR_LIGHTEN_FACTOR } from '@/src/utils/constants/app-constants'
import { lightenHexForCheckboxBackground } from '@/src/utils/functions/colorsUtils'

type Props = {
  vessel: JobSitesWasteStreamsDumpster
  colorCodeEst: string
  colorCodeReal: string
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  subItem: any
  endDate: string
  readOnly: boolean
  disabled: boolean
  isSelect?: boolean
  selectedVessels?: number[]
  setSelectedVessels?: React.Dispatch<React.SetStateAction<number[]>>
}

function MonthWiseVesselItem({
  vessel,
  colorCodeEst,
  colorCodeReal,
  setRefresh,
  subItem,
  endDate,
  readOnly,
  disabled,
  isSelect,
  selectedVessels,
  setSelectedVessels,
}: Props) {
  const [isEditHover, setIsEditHover] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [subWasteStream, setSubWasteStream] = useState<string>()
  const [deletedAt, setDeletedAt] = useState<string | null>(null)
  const [jobSiteWastestreamsId, setJobSiteWastestreamsId] = useState<number>()

  const handleAddVessel = (
    subWasteStream: string,
    jobSiteWastestreamsId: number,
    deletedAt: string | null
  ) => {
    setSubWasteStream(subWasteStream)
    setJobSiteWastestreamsId(jobSiteWastestreamsId)
    setIsEditOpen(true)
    setDeletedAt(deletedAt)
  }
  const onChange: CheckboxProps['onChange'] = (e) => {
    const { checked } = e.target
    if (checked) {
      setSelectedVessels?.((prev) => [...prev, vessel.id])
    } else {
      setSelectedVessels?.((prev) => prev.filter((id) => id !== vessel.id))
    }
  }
  const colorCode = vessel?.real_weight ? colorCodeReal : colorCodeEst

  const lightColor = lightenHexForCheckboxBackground(
    colorCode,
    COLOR_LIGHTEN_FACTOR.FORTY_PERCENT //colorLightenFactor : can be adjusted
  )

  return (
    <>
      <SettingsModal
        isOpen={isEditOpen}
        setIsModalOpen={setIsEditOpen}
        width={800}
      >
        <VesselForm
          setIsAddVesselOpen={setIsEditOpen}
          subWasteStream={subWasteStream}
          colorCodeEst={colorCodeEst}
          colorCodeReal={colorCodeReal}
          jobSiteWastestreamsId={jobSiteWastestreamsId}
          setRefresh={setRefresh}
          isEdit={isEditOpen}
          vessel={vessel}
          deletedAt={deletedAt}
          endDate={endDate}
        />
      </SettingsModal>

      <div
        className={`flex flex-col items-center relative ${readOnly || disabled ? 'cursor-default' : 'cursor-pointer'}`}
        onMouseOver={
          !readOnly && !disabled ? () => setIsEditHover(true) : undefined
        }
        onMouseLeave={
          !readOnly && !disabled ? () => setIsEditHover(false) : undefined
        }
        onClick={
          !readOnly && !disabled && !isSelect
            ? () => {
                handleAddVessel(
                  subItem.wasteStreamType.name,
                  subItem.id,
                  vessel.deletedAt
                )
              }
            : undefined
        }
      >
        {isEditHover && !readOnly && !disabled && !isSelect && (
          <div
            className={`absolute top-2 right-50 ${vessel.real_weight ? 'solid' : 'stripe'}`}
          >
            <Typography.Text
              className={`font-inter font-bold color-white ${styles.editText}`}
              style={{ backgroundColor: colorCode }}
            >
              Edit
            </Typography.Text>
          </div>
        )}
        {isSelect && !readOnly && !disabled && (
          <div
            className={`absolute top-2 right-50 ${vessel.real_weight ? 'solid' : 'stripe'}`}
            style={
              {
                '--color-code-est': colorCode,
                '--color-code-est-light': lightColor,
              } as React.CSSProperties
            }
          >
            <Checkbox
              onChange={onChange}
              checked={selectedVessels?.includes(vessel.id)}
            />
          </div>
        )}
        {vessel.real_weight !== null && vessel.real_weight !== undefined ? (
          <div className={styles.iconBox}>
            <DumpsterIconSolid colorCode={colorCodeReal} />
          </div>
        ) : (
          <div className={styles.iconBox}>
            <DumpsterIconStriped colorCode={colorCodeEst} />
          </div>
        )}
        <Typography.Text
          className={`${isEditHover ? 'font-bold tons text' : 'font-regular tons text'}`}
        >{`${vessel.real_weight !== null && vessel.real_weight !== undefined ? vessel.real_weight : vessel.estimated_weight} tn`}</Typography.Text>
      </div>
    </>
  )
}

export default MonthWiseVesselItem
