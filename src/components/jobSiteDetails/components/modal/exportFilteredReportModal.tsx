'use client'
import ModalComponent from '@/src/components/shared/modal'
import { Button, Typography, Row, Col, Image } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { FileTextOutlined } from '@ant-design/icons'

interface Props {
  isOpen: boolean
  setIsModalOpen: (value: boolean) => void
  onExport: () => void
}

const { Title, Paragraph } = Typography

const ExportFilteredReportModal: React.FC<Props> = ({
  isOpen,
  setIsModalOpen,
  onExport,
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      handleOk={() => setIsModalOpen(false)}
      handleCancel={() => setIsModalOpen(false)}
      footer={null}
      width={520}
      maskClosable={true}
      destroyOnClose={true}
      className="modal-sm"
    >
      <Row justify="center" align="middle">
        <Col span={24}>
          <Title level={2}>
            {MESSAGES.EXPORT_FILTERED_REPORT_VIEW}
            <Image
              src={'/images/download-icon.svg'}
              preview={false}
              className="cursor-pointer download-icon"
            />
          </Title>

          <Paragraph>{MESSAGES.EXPORT_FILTERED_DATA_DESCRIPTION}</Paragraph>

          <Row justify="center" align="middle" style={{ marginBottom: '32px' }}>
            <FileTextOutlined
              style={{
                fontSize: '64px',
                color: '#2c3e50',
              }}
            />
          </Row>

          <Row justify="end">
            <Col>
              <Button type="primary" onClick={onExport}>
                {MESSAGES.EXPORT}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </ModalComponent>
  )
}

export default ExportFilteredReportModal
