import { Card, Typography, Row, Col } from 'antd'
import { useState } from 'react'
import { CAMERA_TYPE } from '@/src/utils/constants/types'
import SettingsModal from '@/src/components/settings/settings-modal'
import EmptyData from '@/src/components/settings/empty-data'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import CameraForm from './camera-form'
import ConfirmationModal from '@/src/components/jobSiteDetails/components/modal/closeJobSiteModal'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { DeleteFilled } from '@ant-design/icons'
import { EyeFilled } from '@ant-design/icons'
import { deleteCameras } from '@/src/services/global'

interface Props {
  cameraList: CAMERA_TYPE[]
  getCameraData?: () => void
}
export default function CameraList({
  cameraList = [],
  getCameraData: getCameraData = () => {},
}: Props) {
  const { Text } = Typography
  const triggerNotification = useTriggerNotification()
  const [cameraModal, setCameraModal] = useState(false)
  const [cameraId, setCameraId] = useState<number | undefined>()
  const [confirmationModal, setConfirmationModal] = useState(false)

  const handleEdit = (id: number | undefined) => {
    if (!id) return
    setCameraId(id)
    setCameraModal(true)
  }
  const handleDeleteCamera = async () => {
    try {
      await deleteCameras(cameraId)
      setConfirmationModal(false)
      getCameraData()
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.CAMERA_SUCCESSFULLY_DELETED
      )
    } catch (err: any) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        err?.response?.data?.errors?.camera === 'cameraAssociated'
          ? `${MESSAGES.SOMETHING_WENT_WRONG_CAMERA_DELETE_JOB_SITE_ASSOCIATION} ${err?.response?.data?.errors?.jobName} of client ${err?.response?.data?.errors?.clientName} and cannot be deleted.`
          : MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  return (
    <>
      <div className="scroll-bar">
        <Row gutter={[16, 16]}>
          {cameraList.length === 0 && <EmptyData />}
          {cameraList.map((camera: CAMERA_TYPE, index) => {
            return (
              <Col xl={12} lg={12} md={12} sm={12} xs={24} key={index}>
                <Card className="grey-bg">
                  <Row>
                    <Text className="name">ID: </Text>
                    <Text className="name font-bold"> {camera.cameraId}</Text>
                  </Row>
                  <Row>
                    {!camera.isAdmin ? (
                      <i
                        className="icon-pencil edit-icon"
                        onClick={() => handleEdit(camera.id)}
                      ></i>
                    ) : (
                      <EyeFilled
                        className="view-icon"
                        onClick={() => handleEdit(camera.id)}
                      />
                    )}
                    {!camera.isAdmin && (
                      <DeleteFilled
                        className="delete-icon"
                        onClick={() => {
                          setCameraId(camera.id), setConfirmationModal(true)
                        }}
                      />
                    )}
                  </Row>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>

      {cameraModal && (
        <SettingsModal isOpen={cameraModal} setIsModalOpen={setCameraModal}>
          <CameraForm
            setIsModalOpen={setCameraModal}
            onRefresh={getCameraData}
            id={cameraId}
          />
        </SettingsModal>
      )}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal}
          title={MESSAGES.DELETE_CAMERA_TITLE}
          closeButtonText={MESSAGES.DELETE_CAMERA}
          keepButtonText={MESSAGES.KEEP_CAMERA}
          setIsModalOpen={setConfirmationModal}
          onConfirmation={handleDeleteCamera}
        />
      )}
    </>
  )
}
