import { MESSAGES, MMR_LOCATIONS } from '@/src/utils/constants/app-constants'
import { Typography } from 'antd'
import { useEffect, useState } from 'react'
import SelectComponent from '../../shared/select'

const { Title } = Typography

interface Props {
  mmrLocation: number | undefined
  onChange: (e: number) => void
  disabled?: boolean
}

export default function MMRDropDown({
  mmrLocation,
  onChange,
  disabled,
}: Props) {
  const [fieldValue, setFieldValue] = useState<number | undefined>()

  useEffect(() => {
    if (mmrLocation) setFieldValue(mmrLocation)
  }, [mmrLocation])

  return (
    <div className="width-100">
      <Title level={5} className="font-600 font-inter mb-5">
        {MESSAGES.MMR_LOCATION}
      </Title>
      <SelectComponent
        name=""
        className="width-100 select-height"
        value={fieldValue}
        disabled={disabled}
        onChange={(e) => {
          setFieldValue(e)
          onChange(e)
        }}
        options={MMR_LOCATIONS}
      />
    </div>
  )
}
