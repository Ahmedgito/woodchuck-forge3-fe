'use client'
import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import BillingAddress from '@components/common/billingAddress'
import { Button, Col, Row, Typography, Image, Upload } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { USER_TYPE } from '@/utils/constants/types'
import {
  MESSAGES,
  FORM_TYPES,
  FILE_UPLOAD,
} from '@/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import InputComponent from '@/src/components/shared/input'
import CustomMaskedInput from '@/src/components/shared/input/maskedInput'
import './common-client-form.scss'

const { Title } = Typography

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const getPhotoUrl = (photo: any): string => {
  if (!photo) return ''
  if (typeof photo === 'string') return photo
  return ''
}

interface ClientFormProps {
  initialValues: USER_TYPE
  validationSchema: any
  onSubmit: (values: any) => void
  title: string
  formType?: string
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  title,
  formType,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadedImage, setUploadedImage] = useState<string>(
    getPhotoUrl((initialValues as any).photo)
  )
  const [fileSize, setFileSize] = useState<string>('')
  const triggerNotification = useTriggerNotification()

  useEffect(() => {
    const photoUrl = getPhotoUrl((initialValues as any).photo)
    setUploadedImage(photoUrl)
  }, [initialValues.photo])

  const handleDeleteImage = () => {
    setFileList([])
    setUploadedImage('')
    setFileSize('')
  }

  const handleBeforeUpload = (file: FileType) => {
    // Check file size (5MB limit)
    if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
      triggerNotification(
        'error',
        MESSAGES.FILE_SIZE_ERROR,
        MESSAGES.FILE_SIZE_TOO_LARGE
      )
      return false
    }

    // Check file type - only allow JPEG and PNG
    if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      triggerNotification(
        'error',
        MESSAGES.INVALID_FILE_TYPE,
        MESSAGES.INVALID_FILE_TYPE_MESSAGE
      )
      return false
    }

    // If we reach here, all validations passed - create preview
    getBase64(file as FileType)
      .then((preview) => {
        setUploadedImage(preview)
      })
      .catch((error) => {
        console.error('Error creating preview:', error)
      })

    return false // Prevent automatic upload
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleUploadChange: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList)

    if (newFileList.length > 0) {
      const lastFile = newFileList[newFileList.length - 1]

      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (lastFile.originFileObj && lastFile.originFileObj.size > maxSize) {
        alert('File size is too large. Please select a file smaller than 5MB.')
        setFileList([])
        setUploadedImage('')
        return
      }

      // Check file type before creating preview
      if (
        lastFile.originFileObj &&
        !FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(lastFile.originFileObj.type)
      ) {
        setFileList([])
        setUploadedImage('')
        return
      }

      if (lastFile.url || lastFile.thumbUrl) {
        setUploadedImage(lastFile.url || lastFile.thumbUrl || '')
      }
      // If it's a local file, create preview
      else if (lastFile.originFileObj) {
        try {
          const preview = await getBase64(lastFile.originFileObj as FileType)
          setUploadedImage(preview)

          const sizeInMB = (
            lastFile.originFileObj.size /
            (1024 * 1024)
          ).toFixed(2)
          setFileSize(`${sizeInMB} MB`)
        } catch (error) {
          console.error('Error creating preview:', error)
        }
      }
    } else {
      // No files, clear the image
      setUploadedImage('')
      setFileSize('')
    }
  }

  const addFormFieldsToFormData = (formData: FormData, values: USER_TYPE) => {
    Object.keys(values).forEach((key) => {
      const value = (values as any)[key]
      if (value !== null && value !== undefined) {
        if (key === 'photo') return // skip raw photo object/string; handled separately
        formData.append(key, value)
      }
    })
  }

  const addPhotoToFormData = (
    formData: FormData,
    currentFile: UploadFile | null
  ) => {
    if (currentFile?.originFileObj) {
      formData.append('file', currentFile.originFileObj as Blob)
    } else if (initialValues.photo && !uploadedImage) {
      // User explicitly removed the existing image in the UI.
      // Send an explicit removal signal; backend will delete S3 + null out DB field.
      formData.append('photo', '')
    }
  }

  const handleFormSubmit = (values: USER_TYPE) => {
    const currentFile =
      fileList.length > 0 ? fileList[fileList.length - 1] : null

    const formData = new FormData()
    addFormFieldsToFormData(formData, values)
    addPhotoToFormData(formData, currentFile)

    onSubmit(formData)
  }

  return (
    <>
      <Title level={3} className="mb-10">
        {title}
      </Title>
      <div className="form-section">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ errors, handleChange, handleBlur, values, touched }) => (
            <Form>
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Title level={3} className="sub-head">
                    {MESSAGES.USER_INFO}
                  </Title>
                  <div className="field w-full">
                    <label htmlFor="username">{MESSAGES.USER_NAME}</label>
                    <InputComponent
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="field w-full">
                    <label htmlFor="email">{MESSAGES.EMAIL}</label>
                    <InputComponent
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="field w-full">
                    <label htmlFor="name">{MESSAGES.DISPLAY_NAME}</label>
                    <InputComponent
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="field w-full">
                    <label htmlFor="company">{MESSAGES.COMPANY}</label>
                    <InputComponent
                      name="company"
                      value={values.company}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="field w-full">
                    <label htmlFor="phone">{MESSAGES.PHONE}</label>
                    <CustomMaskedInput
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {formType && formType !== FORM_TYPES.END_CLIENT && (
                    <div className="field w-full flex">
                      <div className="image-upload-container">
                      <label className='mt-0'>{MESSAGES.LOGO}</label>
                        <Upload
                          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={handlePreview}
                          onChange={handleUploadChange}
                          beforeUpload={handleBeforeUpload}
                          showUploadList={false}
                          style={{ width: '100%', height: '200px' }}
                        >
                          {uploadedImage ? (
                            <div
                              className="image-display"
                              style={{
                                backgroundImage: `url(${uploadedImage})`,
                                position: 'relative',
                              }}
                            >
                              <div
                                className="pencil-overlay"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteImage()
                                }}
                              >
                                <DeleteOutlined />
                              </div>
                            </div>
                          ) : (
                            <div className="upload-placeholder">
                              <PlusOutlined className="upload-icon" />
                              <div className="upload-text">Upload Image</div>
                            </div>
                          )}
                        </Upload>
                      </div>
                      {previewImage && (
                        <Image
                          wrapperStyle={{ display: 'none' }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(''),
                          }}
                          src={previewImage}
                        />
                      )}
                    </div>
                  )}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="fields-full-width">
                    <BillingAddress
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      values={values}
                      touched={touched}
                    />
                  </div>
                </Col>
              </Row>
              <Row justify="end" className="mt-15">
                <Button type="primary" htmlType="submit">
                  {MESSAGES.SAVE}
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default ClientForm
