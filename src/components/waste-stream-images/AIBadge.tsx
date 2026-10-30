'use client'
import React from 'react'
import { Tag, InputNumber, Space } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import Image from 'next/image'
import { AiStatus } from '@/src/utils/constants/types'

interface AIBadgeProps {
  aiStatus: AiStatus
  aiConfidenceLevel: number | null
  adminConfidenceOverride: number | null
  aiVerified: boolean | null
  isAdmin?: boolean
  onOverrideConfidence?: (value: number) => void
  overrideLoading?: boolean
}

export function AIBadge({
  aiStatus,
  aiConfidenceLevel,
  adminConfidenceOverride,
  aiVerified,
  isAdmin = false,
  onOverrideConfidence,
  overrideLoading = false,
}: AIBadgeProps) {
  const [editingConfidence, setEditingConfidence] = React.useState(false)
  const [pendingValue, setPendingValue] = React.useState<number | null>(null)
  const confidenceEditorRef = React.useRef<HTMLDivElement>(null)

  const displayConfidence = adminConfidenceOverride ?? aiConfidenceLevel

  const formatConfidence = (value: number | null | undefined) =>
    value == null ? '' : `${Math.round(Number(value))}%`

  const handleConfirmOverride = React.useCallback(() => {
    if (pendingValue !== null && onOverrideConfidence && displayConfidence !== null) {
      const next = Math.round(Number(pendingValue))
      const current = Math.round(Number(displayConfidence))
      if (next !== current) {
        onOverrideConfidence(next)
      }
    }
    setEditingConfidence(false)
  }, [pendingValue, onOverrideConfidence, displayConfidence])

  React.useEffect(() => {
    if (!editingConfidence) return

    const handlePointerDown = (event: PointerEvent) => {
      const el = confidenceEditorRef.current
      if (el && !el.contains(event.target as Node)) {
        handleConfirmOverride()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [editingConfidence, handleConfirmOverride])

  if (aiStatus === 'pending' || aiStatus === 'processing') {
    return null // Handled by spinner in parent
  }

  if (aiStatus === 'failed') {
    return (
      <Tag color="default" style={{ fontSize: 10 }}>
        AI analysis failed
      </Tag>
    )
  }

  if (aiStatus !== 'complete') {
    return null
  }

  return (
    <Space direction="vertical" size={2} style={{ width: '100%' }}>
      {aiVerified ? (
        <Tag className='ai-badge'>
          <Image src="/images/ai-verified.svg" alt="AI Verified"  width={20} height={20}/>
        </Tag>
      ) : null}

      {displayConfidence !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Read-only view (all users, admins can click to edit) */}
          {!editingConfidence && (
            <span
              className='ai-confidence-level'
              style={{
                fontSize: 11,
                color: adminConfidenceOverride !== null ? '#462C75' : '#462C75',
                cursor: isAdmin ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (!isAdmin) return
                setPendingValue(
                  Math.round(Number(displayConfidence ?? 0))
                )
                setEditingConfidence(true)
              }}
            >
              {formatConfidence(displayConfidence)}
            </span>
          )}

          {/* Inline editor for admins only; closes on Enter or outside click */}
          {isAdmin && editingConfidence && (
            <div ref={confidenceEditorRef} style={{ display: 'inline-block' }}>
              <InputNumber
                size="small"
                min={0}
                max={100}
                step={1}
                precision={0}
                controls={false}
                value={pendingValue ?? displayConfidence ?? 0}
                onChange={(val) => setPendingValue(val)}
                onPressEnter={handleConfirmOverride}
                style={{ width: 80, fontSize: 11 }}
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </Space>
  )
}

export default AIBadge
