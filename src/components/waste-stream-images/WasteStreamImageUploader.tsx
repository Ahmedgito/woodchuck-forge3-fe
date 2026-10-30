'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, Modal, Tooltip, Typography, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { WasteStreamImage } from '@/src/utils/constants/types'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import {
  createWasteStreamImage,
  deleteWasteStreamImage,
  getWasteStreamImages,
  getWasteStreamImageStatus,
  replaceWasteStreamImage,
  updateWasteStreamImageConfidence,
  uploadFileToS3,
} from '@/src/services/wasteStreamImages'
import AIBadge from './AIBadge'
import WasteStreamDisplayImage from './WasteStreamDisplayImage'
import WasteStreamImagePreviewModal from './WasteStreamImagePreviewModal'
import ConfirmationModal from '@/src/components/jobSiteDetails/components/modal/closeJobSiteModal'
import { warmAllDisplayImageSrcs } from '@/src/utils/heicDisplay'
import {
  extractImageMetadataFromFile,
  ImageUploadMetadata,
  isAllowedWasteStreamImageFile,
  WASTE_STREAM_IMAGE_ACCEPT,
} from '@/src/utils/imageMetadata'

const MAX_IMAGES = 4
const POLL_INTERVAL_MS = 4000
const ZERO_CONFIDENCE_REJECTED_MESSAGE =
  'The uploaded image has a confidence level of zero; therefore, it cannot be uploaded for verification.'

interface Props {
  jobsiteWasteStreamId: number
  wasteStreamName?: string
  readOnly?: boolean
  isAdminUser?: boolean
}

type PendingUpload = {
  file: File
  replaceId?: string
  metadata: ImageUploadMetadata
}

export function WasteStreamImageUploader({
  jobsiteWasteStreamId,
  wasteStreamName,
  readOnly = false,
  isAdminUser: _isAdminUser = false,
}: Props) {
  const [images, setImages] = useState<WasteStreamImage[]>([])
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [missingGeoConfirmOpen, setMissingGeoConfirmOpen] = useState(false)
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const replacingRef = useRef<string | null>(null) // imageId being replaced
  const shownRejectedNoticeRef = useRef<Set<string>>(new Set())
  const triggerNotification = useTriggerNotification()

  const latestImages = Array.isArray(images)
    ? images.filter((img) => img.isLatest)
    : []

  const fetchImages = useCallback(async () => {
    try {
      const res = await getWasteStreamImages(jobsiteWasteStreamId)
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray((res as any)?.data?.data)
          ? (res as any).data.data
          : []

      setImages(data ?? [])
    } catch (err) {
      console.error('Failed to fetch waste stream images', err)
      setImages([])
    }
  }, [jobsiteWasteStreamId])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // Poll images that are still pending/processing
  useEffect(() => {
    const pendingImages = images.filter(
      (img) =>
        img.isLatest &&
        (img.aiStatus === 'pending' || img.aiStatus === 'processing')
    )
    if (pendingImages.length === 0) {
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }

    if (!pollRef.current) {
      pollRef.current = setInterval(async () => {
        const stillPending = images.filter(
          (img) =>
            img.isLatest &&
            (img.aiStatus === 'pending' || img.aiStatus === 'processing')
        )
        if (stillPending.length === 0) {
          if (pollRef.current) clearInterval(pollRef.current)
          pollRef.current = null
          return
        }
        // Update only the polled images
        const updates = await Promise.allSettled(
          stillPending.map((img) => getWasteStreamImageStatus(img.id))
        )
        const statusUpdates = new Map<
          string,
          Pick<
            WasteStreamImage,
            'aiStatus' | 'aiConfidenceLevel' | 'aiVerified'
          >
        >()
        const rejectedMessagesById = new Map<string, string>()

        updates.forEach((res, i) => {
          const pendingImage = stillPending[i]
          if (!pendingImage) return

          if (res.status === 'fulfilled') {
            const status = (res.value as any).data?.data ?? res.value.data
            const rawConfidence = status.aiConfidenceLevel
            const confidenceLevel =
              rawConfidence === null || rawConfidence === undefined
                ? null
                : Number(rawConfidence)
            const isRejectedZeroConfidence =
              confidenceLevel !== null &&
              Number.isFinite(confidenceLevel) &&
              confidenceLevel <= 0

            if (isRejectedZeroConfidence) {
              rejectedMessagesById.set(
                pendingImage.id,
                ZERO_CONFIDENCE_REJECTED_MESSAGE
              )
              return
            }

            statusUpdates.set(pendingImage.id, {
              aiStatus: status.aiStatus as WasteStreamImage['aiStatus'],
              aiConfidenceLevel: status.aiConfidenceLevel,
              aiVerified: status.aiVerified,
            })
            return
          }

          const statusCode = (res.reason as any)?.response?.status
          if (statusCode === 404) {
            rejectedMessagesById.set(
              pendingImage.id,
              ZERO_CONFIDENCE_REJECTED_MESSAGE
            )
          }
        })

        if (statusUpdates.size > 0 || rejectedMessagesById.size > 0) {
          setImages((prev) => {
            const withoutRejected = prev.filter(
              (img) => !rejectedMessagesById.has(img.id)
            )
            return withoutRejected.map((img) => {
              const nextStatus = statusUpdates.get(img.id)
              return nextStatus ? { ...img, ...nextStatus } : img
            })
          })
        }

        const newRejectedMessages = Array.from(
          rejectedMessagesById.entries()
        ).filter(([imageId]) => !shownRejectedNoticeRef.current.has(imageId))

        if (newRejectedMessages.length > 0) {
          newRejectedMessages.forEach(([imageId]) =>
            shownRejectedNoticeRef.current.add(imageId)
          )
          triggerNotification(
            'error',
            'Image Rejected',
            newRejectedMessages[0]?.[1] ?? ZERO_CONFIDENCE_REJECTED_MESSAGE
          )
        }
      }, POLL_INTERVAL_MS)
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [images, triggerNotification])

  const handleUpload = async (
    file: File,
    replaceId?: string,
    preExtractedMetadata?: ImageUploadMetadata
  ) => {
    const nextOrder = replaceId
      ? latestImages.find((img) => img.id === replaceId)?.displayOrder ?? 1
      : latestImages.length + 1

    setUploadingSlot(nextOrder)

    try {
      const metadata =
        preExtractedMetadata ?? (await extractImageMetadataFromFile(file))

      // 1. Upload file to S3 via existing endpoint
      const uploadRes = await uploadFileToS3(file)
      const uploadBody =
        (uploadRes as any).data?.data ?? (uploadRes as any).data
      const uploadedFile: { id: string; path: string } = uploadBody?.file
      const fileId: string = uploadedFile?.id
      const imagePayload = {
        jobsiteWasteStreamId,
        fileId,
        displayOrder: nextOrder,
        ...metadata,
      }

      // 2. Create or replace image record
      let newImage: WasteStreamImage
      if (replaceId) {
        const res = await replaceWasteStreamImage(replaceId, imagePayload)
        const record = (res as any).data?.data ?? res.data
        newImage = record.file ? record : { ...record, file: uploadedFile }
      } else {
        const res = await createWasteStreamImage(imagePayload)
        const record = (res as any).data?.data ?? res.data
        newImage = record.file ? record : { ...record, file: uploadedFile }
      }

      setImages((prev) => {
        const filtered = replaceId
          ? prev.map((img) =>
              img.id === replaceId ? { ...img, isLatest: false } : img
            )
          : prev
        return [...filtered, newImage]
      })

      triggerNotification(
        'success',
        'Success',
        'Image has been uploaded. AI analysis is in progress.'
      )
    } catch (err: any) {
      triggerNotification(
        'error',
        'Error',
        err?.response?.data?.message ?? 'Upload failed'
      )
    } finally {
      setUploadingSlot(null)
      replacingRef.current = null
    }
  }

  const hasGeoCoordinates = (metadata: ImageUploadMetadata): boolean =>
    typeof metadata.latitude === 'number' &&
    typeof metadata.longitude === 'number'

  const handleMissingGeoModalState = (isOpen: boolean) => {
    setMissingGeoConfirmOpen(isOpen)
    if (!isOpen) {
      setPendingUpload(null)
    }
  }

  const handleConfirmUploadWithoutGeo = async () => {
    if (!pendingUpload) {
      handleMissingGeoModalState(false)
      return
    }

    const { file, replaceId, metadata } = pendingUpload
    handleMissingGeoModalState(false)
    await handleUpload(file, replaceId, metadata)
  }

  const prepareUpload = async (file: File, replaceId?: string) => {
    let metadata: ImageUploadMetadata = {}
    try {
      metadata = await extractImageMetadataFromFile(file)
    } catch {
      metadata = {}
    }

    if (!hasGeoCoordinates(metadata)) {
      setPendingUpload({ file, replaceId, metadata })
      setMissingGeoConfirmOpen(true)
      return
    }

    await handleUpload(file, replaceId, metadata)
  }

  const handleDelete = (imageId: string) => {
    Modal.confirm({
      title: 'Delete image',
      content: 'Do you want to delete this image?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      wrapClassName: 'waste-stream-image-delete-modal',
      className: 'waste-stream-image-delete-modal',
      okButtonProps: { className: 'waste-stream-image-delete-modal__ok' },
      cancelButtonProps: { className: 'secondary' },
      onOk: async () => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, isLatest: false } : img
          )
        )
        try {
          await deleteWasteStreamImage(imageId)
          triggerNotification('success', 'Success', 'Image has been deleted')
        } catch {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId ? { ...img, isLatest: true } : img
            )
          )
          triggerNotification('error', 'Error', 'Failed to delete image')
          throw new Error('Delete failed')
        }
      },
    })
  }

  const handleConfidenceOverride = async (imageId: string, value: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, adminConfidenceOverride: value } : img
      )
    )
    try {
      const res = await updateWasteStreamImageConfidence(imageId, value)
      const updated: WasteStreamImage = (res as any).data?.data ?? res.data
      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? updated : img))
      )
      triggerNotification(
        'success',
        'Success',
        'Confidence level has been updated. '
      )
    } catch {
      triggerNotification(
        'error',
        'Error',
        'Failed to update confidence level.'
      )
    }
  }

  const beforeUpload = (file: File, replaceId?: string): boolean => {
    if (!isAllowedWasteStreamImageFile(file)) {
      triggerNotification('error', 'Error', 'Only image files are allowed')
      return false
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      triggerNotification('error', 'Error', 'Image must be smaller than 10MB')
      return false
    }
    void prepareUpload(file, replaceId)
    return false // prevent default Upload behaviour
  }

  const canAddMore = latestImages.length < MAX_IMAGES

  const openPreview = async (idx: number) => {
    const sources = latestImages.map(
      (img) => img.file?.path as string | undefined
    )
    try {
      await warmAllDisplayImageSrcs(sources.filter(Boolean) as string[])
    } catch {
      /* preview will fall back to placeholders */
    }
    setPreviewIndex(idx)
    setPreviewVisible(true)
  }

  return (
    <div className="waste-stream-image-uploader mt-4 mb-5 flex gap-8 items-center">
      {/* Empty state */}
      {latestImages.length === 0 && !readOnly && (
        <Typography.Text type="secondary">
          Please upload up to four images for <br></br> waste stream
          verification.
        </Typography.Text>
      )}

      {/* Full-size preview with date/location overlay */}
      <WasteStreamImagePreviewModal
        open={previewVisible}
        images={latestImages}
        currentIndex={previewIndex}
        wasteStreamName={wasteStreamName}
        onClose={() => setPreviewVisible(false)}
        onChangeIndex={setPreviewIndex}
      />

      {missingGeoConfirmOpen && (
        <ConfirmationModal
          isOpen={missingGeoConfirmOpen}
          title={
            "THE UPLOADED IMAGE DOESN'T HAVE ADDRESS INFORMATION.\nDO YOU STILL WANT TO UPLOAD IT?"
          }
          closeButtonText="Yes"
          keepButtonText="No"
          setIsModalOpen={handleMissingGeoModalState}
          onConfirmation={() => {
            void handleConfirmUploadWithoutGeo()
          }}
        />
      )}

      {/* Thumbnail grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        {latestImages.map((img, idx) => (
          <div
            key={img.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 80,
            }}
          >
            {/* Thumbnail */}
            <div
              className="waste-stream-image-thumbnail"
              onClick={() => {
                void openPreview(idx)
              }}
            >
              {img.aiStatus === 'pending' || img.aiStatus === 'processing' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <WasteStreamDisplayImage
                    src={img.file?.path as string}
                    alt="processing"
                    showLoadingIndicator={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <Image
                      src="/images/processing-spinner.svg"
                      alt="Processing"
                      preview={false}
                      width={20}
                      height={20}
                      className="processing-spinner-icon"
                    />
                  </div>
                </div>
              ) : (
                <WasteStreamDisplayImage
                  src={img.file?.path as string}
                  alt={wasteStreamName ?? 'waste stream image'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#efefef',
                  }}
                />
              )}

              {/* Admin overlay controls — top-right (delete shown on hover via CSS) */}
              {!readOnly && (
                <div
                  className="waste-stream-image-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Replace disabled per requirements */}
                  {/* Delete */}
                  <Tooltip title="Remove image">
                    <span
                      className="waste-stream-image-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(img.id)
                      }}
                    >
                      <img src="/images/cross-icon.svg" alt="Delete" />
                    </span>
                  </Tooltip>
                </div>
              )}

              {/* AI badge — overlaid at bottom of thumbnail */}
              <div
                className="ai-badge-container"
                onClick={(e) => e.stopPropagation()}
              >
                <AIBadge
                  aiStatus={img.aiStatus}
                  aiConfidenceLevel={img.aiConfidenceLevel}
                  adminConfidenceOverride={img.adminConfidenceOverride}
                  aiVerified={img.aiVerified}
                  isAdmin={!readOnly}
                  onOverrideConfidence={(val) =>
                    handleConfidenceOverride(img.id, val)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {/* Upload slot(s) — show spinner if uploading, or + button if slots available */}
        {!readOnly && uploadingSlot !== null && (
          <div className="add-image-button">
            <Image
              src="/images/processing-spinner.svg"
              alt="Processing"
              preview={false}
              width={20}
              height={20}
              className="processing-spinner-icon"
            />
          </div>
        )}

        {!readOnly && canAddMore && uploadingSlot === null && (
          <Upload
            accept={WASTE_STREAM_IMAGE_ACCEPT}
            showUploadList={false}
            beforeUpload={(file) => beforeUpload(file)}
          >
            <Tooltip
              title="Upload Image"
              open={missingGeoConfirmOpen ? false : undefined}
            >
              <div className="add-image-button">
                <PlusOutlined style={{ fontSize: 14 }} />
                <span>Add</span>
              </div>
            </Tooltip>
          </Upload>
        )}
      </div>
    </div>
  )
}

export default WasteStreamImageUploader
