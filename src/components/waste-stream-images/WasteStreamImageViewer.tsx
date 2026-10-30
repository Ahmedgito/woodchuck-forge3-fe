'use client'
import React, { useState } from 'react'
import { Modal, Spin } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import { WasteStreamImage } from '@/src/utils/constants/types'
import { warmAllDisplayImageSrcs } from '@/src/utils/heicDisplay'
import AIBadge from './AIBadge'
import WasteStreamDisplayImage from './WasteStreamDisplayImage'
import WasteStreamImagePreviewModal from './WasteStreamImagePreviewModal'

interface WasteStreamImageViewerProps {
  images: WasteStreamImage[]
  wasteStreamName?: string
}

export function WasteStreamImageViewer({
  images,
  wasteStreamName,
}: WasteStreamImageViewerProps) {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

  if (!images || images.length === 0) return null

  const latestImages = images.filter((img) => img.isLatest)

  const openPreview = async (idx: number) => {
    const sources = latestImages.map((img) => img.file?.path as string | undefined)
    try {
      await warmAllDisplayImageSrcs(sources.filter(Boolean) as string[])
    } catch {
      /* preview will fall back to placeholders */
    }
    setPreviewIndex(idx)
    setPreviewVisible(true)
  }

  return (
    <>
      <WasteStreamImagePreviewModal
        open={previewVisible}
        images={latestImages}
        currentIndex={previewIndex}
        wasteStreamName={wasteStreamName}
        onClose={() => setPreviewVisible(false)}
        onChangeIndex={setPreviewIndex}
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {latestImages.map((img, idx) => (
          <div
            key={img.id}
            style={{
              position: 'relative',
              width: 72,
              cursor: 'pointer',
            }}
            onClick={() => {
              void openPreview(idx)
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid #d9d9d9',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {img.aiStatus === 'pending' || img.aiStatus === 'processing' ? (
                <Spin size="small" />
              ) : (
                <WasteStreamDisplayImage
                  src={img.file?.path as string}
                  alt={`${wasteStreamName} image`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <div style={{ marginTop: 2 }}>
              <AIBadge
                aiStatus={img.aiStatus}
                aiConfidenceLevel={img.aiConfidenceLevel}
                adminConfidenceOverride={img.adminConfidenceOverride}
                aiVerified={img.aiVerified}
                isAdmin={false}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

interface WasteStreamImageIndicatorProps {
  images: WasteStreamImage[]
  wasteStreamName?: string
}

/** Small clickable icon shown at the top of a waste stream when images exist (client view) */
export function WasteStreamImageIndicator({
  images,
  wasteStreamName,
}: WasteStreamImageIndicatorProps) {
  const [open, setOpen] = useState(false)
  const latestImages = images?.filter((img) => img.isLatest) ?? []

  if (latestImages.length === 0) return null

  return (
    <>
      <span
        title={`${latestImages.length} image(s) attached`}
        style={{ cursor: 'pointer', marginRight: 8 }}
        onClick={() => setOpen(true)}
      >
        <PictureOutlined style={{ color: '#1677ff', fontSize: 16 }} />
        <span style={{ fontSize: 11, marginLeft: 2, color: '#1677ff' }}>
          {latestImages.length}
        </span>
      </span>

      <Modal
        title={`Images — ${wasteStreamName ?? 'Waste Stream'}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={520}
      >
        <WasteStreamImageViewer images={latestImages} wasteStreamName={wasteStreamName} />
      </Modal>
    </>
  )
}

export default WasteStreamImageViewer
