import { Button, Typography } from 'antd'
import React from 'react'
import SelectComponent from '../shared/select'
import {
  DROP_DOWN_OPTIONS,
  DUMPSTER_TRANSFORMED_OPTIONS,
} from '@/src/utils/constants/types'
import './components/style.scss'
import GenieButtonWrapper from '../shared/hocs/genie-wrapper'

type Props = {
  vesselTypeDropDownOptions: DROP_DOWN_OPTIONS
  wasteStreamDropDownOptions: DUMPSTER_TRANSFORMED_OPTIONS[]
  vesselType: string | null
  setVesselType: (value: string | null) => void
  wasteStreamId: string | null
  setWasteStreamId: (value: string | null) => void
  loading?: boolean
}
const { Title } = Typography
function DumpsterChartFilters({
  vesselType,
  setVesselType,
  wasteStreamId,
  setWasteStreamId,
  vesselTypeDropDownOptions,
  wasteStreamDropDownOptions,
  loading = false,
}: Props) {
  const handleReset = () => {
    setVesselType(null)
    setWasteStreamId(null)
  }

  return (
    <div className="flex flex-row gap-7 ma-4 vessel-filters mb-10">
      <GenieButtonWrapper hint="monthly_reports_dropdown">
        <Button
          onClick={handleReset}
          className={wasteStreamId || vesselType ? '' : 'all-selected'}
        >
          All
        </Button>
        <SelectComponent
          className="selector"
          placeholder="Vessel Type"
          name="vesselType"
          value={vesselType}
          onChange={(e) => setVesselType(e)}
          options={vesselTypeDropDownOptions}
          allowClear
          onClear={() => setVesselType(null)}
          cssClassName="vessel-type-dropdown"
          disabled={loading}
        />
        <SelectComponent
          className="selector"
          placeholder="Waste Stream"
          name="wasteStream"
          onChange={(e) => setWasteStreamId(e)}
          value={wasteStreamId}
          options={wasteStreamDropDownOptions}
          allowClear
          onClear={() => setWasteStreamId(null)}
          cssClassName="vessel-type-dropdown"
          disabled={loading}
        />
      </GenieButtonWrapper>
    </div>
  )
}

export default DumpsterChartFilters
