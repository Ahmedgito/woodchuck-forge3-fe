import { MESSAGES } from '@/src/utils/constants/app-constants'
import { CREATE_JOB_SITE_FORM } from '@/src/utils/constants/form-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { Typography, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { HAULER_TYPE } from '@/src/utils/constants/types'
import SelectComponent from '../../shared/select'
import { formatNumber } from '@/src/utils/functions/formatNumber'
import { useLoader } from '@/src/utils/context/loader-context'
import { getHaulers } from '@/src/services/global'

const { Title, Text } = Typography
interface Props {
  haulerId: string | undefined
  onChange: (e: string) => void
  disabled?: boolean
}
export default function HaulerDropDown({
  haulerId,
  onChange,
  disabled,
}: Props) {
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const [haulersData, setHaulersData] = useState([])
  const [fieldValue, setFieldValue] = useState<string | undefined>(haulerId)

  useEffect(() => {
    getHaulerData()
  }, [])

  useEffect(() => {
    haulerId && setFieldValue(haulerId)
  }, [haulerId])

  const getHaulerData = async () => {
    try {
      setLoading(true)
      const result = await getHaulers()
      const haulerDataModified = result.data.data.map(
        (hauler: HAULER_TYPE) => ({
          value: hauler.id,
          label: (
            <Row className="select-data">
              <Col span={24}>
                <Text className="font-inter font-medium">{hauler.name}</Text>
              </Col>
              <Col span={24}>
                <Text className="font-inter font-medium">
                  {formatNumber(hauler?.phone)}
                </Text>
              </Col>
            </Row>
          ),
        })
      )
      setHaulersData(haulerDataModified)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_HAULER
      )
    }
  }

  return (
    <div className="mt-16">
      <Title level={5} className="font-600 font-inter mb-5">
        {CREATE_JOB_SITE_FORM.HAULER}
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
        options={haulersData}
      />
    </div>
  )
}
