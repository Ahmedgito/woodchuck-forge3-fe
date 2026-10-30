import React from 'react'
import { Modal } from 'antd'

interface Props {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  title?: string
  children: React.ReactNode
  width?: number
  okText?: string
  cancelText?: string
  maskClosable?: boolean
  destroyOnClose?: boolean
  footer?: React.ReactNode
  className?: string
}

const ModalComponent: React.FC<Props> = ({
  isOpen,
  handleOk,
  handleCancel,
  title,
  children,
  width,
  okText,
  cancelText,
  maskClosable,
  destroyOnClose,
  footer,
  className,
}) => {
  const props = {
    title: title,
    open: isOpen,
    onOk: handleOk,
    onCancel: handleCancel,
    centered: true,
    width: width || '',
    okText: okText || 'Ok',
    cancelText: cancelText || 'Cancel',
    maskClosable: maskClosable && true,
    destroyOnClose: destroyOnClose || false,
    className: className || '',
    footer: footer || '',
  }
  return <Modal {...props}>{children}</Modal>
}

export default ModalComponent
