import { MESSAGES } from '@/src/utils/constants/app-constants'
import { Typography, Card, Button, Row, Col } from 'antd'
import { PlusCircleFilled } from '@ant-design/icons'
import { useState } from 'react'
import { DUMPSTER_LOCATION_TYPE } from '@/src/utils/constants/types'
import CreateOrEditDumpsterLocationModal from './modal/dumpsterLocationModal'

const { Title, Text } = Typography

export default function DumpsterLocation(props: {
  dumpstersLocation: [DUMPSTER_LOCATION_TYPE] | undefined
  onRefresh: (id: number | null | undefined) => void
  jobSiteId: number | null | undefined
  disabled: boolean
  jobsiteTitle: string
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [dumpsterLocation, setDumpsterLocation] =
    useState<DUMPSTER_LOCATION_TYPE>()
  const [dumpsterLocationModal, setDumpsterLocationModal] = useState(false)

  const handleEdit = (obj: DUMPSTER_LOCATION_TYPE) => {
    if (!obj) return
    setDumpsterLocation(obj)
    setDumpsterLocationModal(true)
  }

  const handleCreate = () => {
    setDumpsterLocationModal(true)
    setDumpsterLocation(undefined)
  }

  return (
    <>
      <Title level={5} className="font-600 font-inter mb-5">
        {MESSAGES.DUMPSTER_LOCATION}
      </Title>
      {(props.dumpstersLocation?.length ?? 0) > 0 && (
        <div className="scroll-bar">
          {props.dumpstersLocation?.map(
            (dupsterLocationObj: DUMPSTER_LOCATION_TYPE, index) => {
              return (
                <div className="field width-100 mb-5" key={index}>
                  <Card className="grey-bg">
                    <Row>
                      <Col span={24}>
                        <Text className="font-inter font-medium">
                          {dupsterLocationObj.sublocationName}
                        </Text>
                      </Col>
                      <Col span={24}>
                        <Text className="font-inter font-medium">
                          {dupsterLocationObj.distanceToMmr}{' '}
                          {MESSAGES.MI_TO_MMR}
                        </Text>
                      </Col>
                    </Row>
                    {!props.disabled && (
                      <i
                        className="edit-icon icon-pencil"
                        onClick={() => handleEdit(dupsterLocationObj)}
                      ></i>
                    )}
                  </Card>
                </div>
              )
            }
          )}
        </div>
      )}

      {!props.disabled && (
        <Button className="icon-button mt-5 width-100" onClick={handleCreate}>
          {MESSAGES.ADD_DUMPSTER_LOCATION} <PlusCircleFilled />
        </Button>
      )}

      {dumpsterLocationModal && (
        <CreateOrEditDumpsterLocationModal
          isOpen={dumpsterLocationModal}
          dumpsterLocation={dumpsterLocation}
          setIsModalOpen={setDumpsterLocationModal}
          onRefresh={props.onRefresh}
          jobSiteId={props.jobSiteId}
          jobsiteTitle={props.jobsiteTitle}
          setRefresh={props.setRefresh}
        />
      )}
    </>
  )
}
