'use client'

import { Button, Input, Modal, Spin, Typography, Upload } from 'antd'
import dayjs from 'dayjs'
import {
  ArrowLeftOutlined,
  CheckOutlined,
  FilePdfOutlined,
  QuestionOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useMemo, useRef, useState, type DragEvent } from 'react'
import {
  CREATE_JOB_SITE,
  JobSitesWasteStreamsEntity,
} from '@/src/utils/constants/types'
import { JOB_SITE_STATUS, MESSAGES } from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import {
  applyWeightTicket,
  isAllowedWeightTicketFile,
  processWeightTicket,
  TicketExtraction,
  WEIGHT_TICKET_ACCEPT,
  WEIGHT_TICKET_MAX_BYTES,
  WeightTicketAction,
} from '@/src/services/weightTickets'
import AddressAutocomplete from '@/src/components/common/address-autocomplete'

type WeightTicketStep =
  | 'select'
  | 'upload'
  | 'processing'
  | 'confirmation'
  | 'editing'
  | 'applying'

type StreamOption = {
  id: number
  label: string
  material: string
  materialType: string
  vesselLabel: string
  stream: JobSitesWasteStreamsEntity
}

function formatDateForDisplay(ymd: string) {
  const match = ymd.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ymd
  return `${match[2]}/${match[3]}/${match[1]}`
}

function parseDisplayDateToYmd(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return trimmed
  return `${match[3]}-${match[1]!.padStart(2, '0')}-${match[2]!.padStart(2, '0')}`
}

function isValidYmd(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function getAddressLines(jobSite?: CREATE_JOB_SITE) {
  const address = [
    (jobSite as any)?.address?.addressLine1 ?? (jobSite as any)?.street,
    (jobSite as any)?.address?.city ?? (jobSite as any)?.city,
    (jobSite as any)?.address?.state ?? (jobSite as any)?.state,
    (jobSite as any)?.address?.postalCode ?? (jobSite as any)?.zipcode,
  ].filter(Boolean)

  if (address.length > 0) {
    return [
      jobSite?.title ?? jobSite?.name ?? 'LOCATION ADDRESS',
      address.join(', '),
    ].join('\n')
  }

  return ''
}

function getVesselLabel(
  stream: JobSitesWasteStreamsEntity,
  vesselTotalsByType: Map<number, number>
) {
  const typeId = stream.wasteStreamType?.id
  const typeTotal = typeId ? vesselTotalsByType.get(typeId) : undefined
  const dumpsterCount = Array.isArray(stream.jobSitesWasteStreamsDumpsters)
    ? stream.jobSitesWasteStreamsDumpsters.length
    : 0
  const count =
    typeTotal ?? (dumpsterCount > 0 ? dumpsterCount : stream.moved ?? 0)
  const dumpster = (stream.dumpster_key ?? stream.dumpster_type ?? '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()

  const vesselText = count === 1 ? 'VESSEL' : 'VESSELS'
  return dumpster
    ? `${count} ${vesselText} ${dumpster}`
    : `${count} ${vesselText}`
}

function buildOptions(
  wasteStreams: JobSitesWasteStreamsEntity[]
): StreamOption[] {
  const vesselTotalsByType = wasteStreams.reduce<Map<number, number>>(
    (acc, stream) => {
      const typeId = stream.wasteStreamType?.id
      if (!typeId) return acc
      const vesselCount = Array.isArray(stream.jobSitesWasteStreamsDumpsters)
        ? stream.jobSitesWasteStreamsDumpsters.length
        : stream.moved ?? 0
      acc.set(typeId, (acc.get(typeId) ?? 0) + vesselCount)
      return acc
    },
    new Map<number, number>()
  )

  const seen = new Set<number>()
  return wasteStreams.reduce<StreamOption[]>((acc, stream) => {
    if (seen.has(stream.id)) return acc
    seen.add(stream.id)
    const material =
      stream.wasteStream?.name ?? stream.wasteStreamType?.name ?? 'Waste Stream'
    const materialType =
      stream.wasteStreamType?.name ?? stream.wasteStream?.name ?? material

    acc.push({
      id: stream.id,
      label: material.toUpperCase(),
      material,
      materialType,
      vesselLabel: getVesselLabel(stream, vesselTotalsByType),
      stream,
    })
    return acc
  }, [])
}

function getVesselCountsForMonth(
  stream: JobSitesWasteStreamsEntity | undefined,
  monthYmd: string | undefined // 'YYYY-MM'
) {
  const dumpsters = stream?.jobSitesWasteStreamsDumpsters ?? []
  const inMonth = monthYmd
    ? dumpsters.filter(
        (d) =>
          typeof d.creationDate === 'string' &&
          d.creationDate.startsWith(monthYmd)
      )
    : dumpsters

  const confirmed = inMonth.filter((d) => d.real_weight != null).length
  const estimated = inMonth.filter(
    (d) => d.real_weight == null && d.estimated_weight != null
  ).length

  return {
    confirmed,
    estimated,
    hasAny: confirmed + estimated > 0,
  }
}

function getJobSiteCreationYmd(jobSite?: CREATE_JOB_SITE): string | null {
  // Use the same date the UI shows for "Start Date" (jobSiteValuesConfig.ts)
  // so the comparison matches what the user sees when they edit the receipt date.
  const raw = jobSite?.startDate ?? jobSite?.createdAt
  if (!raw) return null
  const d = dayjs(raw as string | Date)
  if (!d.isValid()) return null
  const ymd = d.format('YYYY-MM-DD')
  return isValidYmd(ymd) ? ymd : null
}

function isInactiveJobSite(jobSite?: CREATE_JOB_SITE) {
  // Prefer status.id when the backend sends it; fall back to status.name.
  const statusId = (jobSite as any)?.status?.id
  if (typeof statusId === 'number') return statusId === 2
  return jobSite?.status?.name === JOB_SITE_STATUS.INACTIVE
}

function extractApiErrorMessage(error: unknown, fallback: string) {
  const err = error as {
    response?: {
      status?: number
      data?: { message?: string | string[]; error?: string }
    }
  }
  const status = err?.response?.status
  const raw = err?.response?.data?.message ?? err?.response?.data?.error
  const message = Array.isArray(raw) ? raw[0] : raw

  if (message) return message
  if (status === 413) return 'File is too large. Max size is 10 MB.'
  if (status === 422) return 'Missing or invalid fields.'
  if (status === 502) return 'Could not analyze the ticket. Please try again.'
  if (status === 403)
    return 'This waste stream is closed and you can no longer add a dumpster.'
  if (status === 404) return 'No vessel was found for the selected month.'
  return fallback
}

export default function WeightTicketUploadFlow({
  jobSiteDetailsData,
  wasteStreams,
  disabled,
  onApplied,
}: {
  jobSiteDetailsData?: CREATE_JOB_SITE
  wasteStreams: JobSitesWasteStreamsEntity[]
  disabled?: boolean
  onApplied?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<WeightTicketStep>('select')
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null)
  const [extraction, setExtraction] = useState<TicketExtraction | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editTonnage, setEditTonnage] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [tonnageDialogOpen, setTonnageDialogOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewKind, setPreviewKind] = useState<'image' | 'pdf' | null>(null)
  const [previewName, setPreviewName] = useState<string>('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const uploadInFlight = useRef(false)

  const triggerNotification = useTriggerNotification()

  const streamOptions = useMemo(
    () => buildOptions(wasteStreams),
    [wasteStreams]
  )
  const selectedStream = streamOptions.find(
    (item) => item.id === selectedStreamId
  )

  const inactive = isInactiveJobSite(jobSiteDetailsData)
  const isClosedStream = selectedStream?.stream?.deletedAt != null

  const ticketMonth = extraction?.date ? extraction.date.slice(0, 7) : undefined
  const vesselCounts = useMemo(
    () => getVesselCountsForMonth(selectedStream?.stream, ticketMonth),
    [selectedStream, ticketMonth]
  )
  const overwriteOnly =
    inactive || (isClosedStream && vesselCounts.estimated > 0)

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPreviewKind(null)
    setPreviewName('')
  }

  const reset = () => {
    setOpen(false)
    setStep('select')
    setSelectedStreamId(null)
    setExtraction(null)
    setEditDate('')
    setEditTonnage('')
    setEditAddress('')
    setTonnageDialogOpen(false)
    setIsDraggingFile(false)
    uploadInFlight.current = false
    clearPreview()
  }

  const handleSelectStream = (streamId: number) => {
    setSelectedStreamId(streamId)
    setStep('upload')
  }

  const handleUpload = async (file: File) => {
    if (!selectedStream || uploadInFlight.current) return false
    uploadInFlight.current = true

    if (!isAllowedWeightTicketFile(file)) {
      uploadInFlight.current = false
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        'Only image and PDF files are allowed.'
      )
      return false
    }

    if (file.size > WEIGHT_TICKET_MAX_BYTES) {
      uploadInFlight.current = false
      triggerNotification(
        'error',
        MESSAGES.FILE_SIZE_ERROR ?? MESSAGES.ERROR,
        'File is too large. Max size is 10 MB.'
      )
      return false
    }

    clearPreview()
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setPreviewKind(
      file.type.startsWith('image/')
        ? 'image'
        : file.type === 'application/pdf'
          ? 'pdf'
          : null
    )
    setPreviewName(file.name)

    setStep('processing')
    try {
      const data = await processWeightTicket({
        file,
        wasteStreamId: selectedStream.id,
        materialType: selectedStream.materialType,
      })

      const safeDate = isValidYmd(data?.date ?? '')
        ? data.date
        : new Date().toISOString().slice(0, 10)
      const safeTonnage = Number(data?.tonnage) || 0
      // Material is locked to the waste stream chosen at selection — ignore OCR.
      const lockedMaterial = selectedStream.material
      const safeAddress = data?.address || ''

      const next: TicketExtraction = {
        date: safeDate,
        tonnage: safeTonnage,
        material: lockedMaterial,
        address: safeAddress,
      }
      setExtraction(next)
      setEditDate(formatDateForDisplay(next.date))
      setEditTonnage(String(next.tonnage))
      setEditAddress(next.address)
      setStep('confirmation')
    } catch (error) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        extractApiErrorMessage(error, 'Could not analyze the ticket.')
      )
      setStep('upload')
    } finally {
      uploadInFlight.current = false
    }

    return false
  }

  const handleEdit = () => {
    if (!extraction) return
    setEditDate(formatDateForDisplay(extraction.date))
    setEditTonnage(String(extraction.tonnage))
    setEditAddress(extraction.address)
    setStep('editing')
  }

  const handleSaveEdit = () => {
    if (!extraction || !selectedStream) return
    const nextDate = parseDisplayDateToYmd(editDate)
    if (!isValidYmd(nextDate)) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        'Please enter a valid date as MM/DD/YYYY.'
      )
      return
    }
    const parsedTonnage = Number.parseFloat(editTonnage)
    if (!Number.isFinite(parsedTonnage) || parsedTonnage <= 0) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        'Please enter a valid tonnage value.'
      )
      return
    }
    setExtraction({
      ...extraction,
      date: nextDate,
      tonnage: parsedTonnage,
      material: selectedStream.material,
      address: editAddress.trim(),
    })
    setStep('confirmation')
  }

  const handleOpenTonnageDialog = () => {
    if (!extraction || !selectedStream) return
    const creationYmd = getJobSiteCreationYmd(jobSiteDetailsData)
    if (creationYmd && extraction.date < creationYmd) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        'The date on the attached receipt cannot be earlier than the Job Site Creation Date.'
      )
      return
    }
    setTonnageDialogOpen(true)
  }

  const handleApply = async (action: WeightTicketAction) => {
    if (!extraction || !selectedStream) return
    setTonnageDialogOpen(false)
    setStep('applying')
    try {
      const response = await applyWeightTicket({
        wasteStreamId: selectedStream.id,
        date: extraction.date,
        tonnage: extraction.tonnage,
        action,
      })

      const isOverwrite =
        action === 'overwrite' || response?.action === 'overwritten'
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        isOverwrite
          ? 'Tonnage has been saved, and the new vessel was added successfully.'
          : 'Tonnage has been saved, and the new vessel was added successfully.'
      )

      onApplied?.()
      reset()
    } catch (error) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        extractApiErrorMessage(error, 'Could not save the weight ticket.')
      )
      setStep('confirmation')
    }
  }

  const renderHeader = () => (
    <div className="weight-ticket-card-header">
      <Typography.Title level={3}>
        {selectedStream?.label ?? 'WEIGHT TICKET'}
      </Typography.Title>
    </div>
  )

  const renderSelect = () => (
    <div className="weight-ticket-flow-body">
      <Typography.Title level={4}>Select Waste Stream</Typography.Title>
      <div className="weight-ticket-stream-list">
        {streamOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            className="weight-ticket-stream-card"
            onClick={() => handleSelectStream(item.id)}
          >
            <span className="weight-ticket-stream-name">{item.label}</span>
            <span className="weight-ticket-stream-vessel">
              {item.vesselLabel}
            </span>
          </button>
        ))}
      </div>
      {streamOptions.length === 0 && (
        <Typography.Text type="secondary">
          No waste streams are available yet.
        </Typography.Text>
      )}
    </div>
  )

  const handleBackToSelect = () => {
    setSelectedStreamId(null)
    setIsDraggingFile(false)
    setStep('select')
  }

  const allowFileDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    allowFileDrag(event)
    setIsDraggingFile(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const nextTarget = event.relatedTarget
    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return
    }
    setIsDraggingFile(false)
  }

  const handleFileDrop = (event: DragEvent<HTMLDivElement>) => {
    allowFileDrag(event)
    setIsDraggingFile(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      void handleUpload(file)
    }
  }

  const renderUpload = () => (
    <div className="weight-ticket-flow-body">
      <Button
        type="text"
        className="weight-ticket-back-btn"
        icon={<ArrowLeftOutlined />}
        onClick={handleBackToSelect}
      >
        Back
      </Button>
      {renderHeader()}
      <div
        className={`weight-ticket-upload-container${
          isDraggingFile ? ' is-dragging' : ''
        }`}
        onDragEnterCapture={handleDragEnter}
        onDragOverCapture={allowFileDrag}
        onDragLeaveCapture={handleDragLeave}
        onDropCapture={handleFileDrop}
      >
        <UploadOutlined />
        <Typography.Text>Drag and drop your ticket here.</Typography.Text>
        <Typography.Text type="secondary">
          Max file size 10 MB · JPG, PNG, PDF
        </Typography.Text>
        <Upload
          accept={WEIGHT_TICKET_ACCEPT}
          showUploadList={false}
          multiple={false}
          beforeUpload={(file) => {
            handleUpload(file as File)
            return false
          }}
        >
          <Button type="primary" className="weight-ticket-upload-btn">
            Upload
          </Button>
        </Upload>
      </div>
    </div>
  )

  const renderPreview = () => {
    if (!previewUrl) return null
    if (previewKind === 'image') {
      return (
        <img
          src={previewUrl}
          alt={previewName || 'Weight ticket preview'}
          className="weight-ticket-preview weight-ticket-preview-image"
        />
      )
    }
    if (previewKind === 'pdf') {
      return (
        <div
          className="weight-ticket-preview weight-ticket-preview-pdf"
          aria-label={previewName || 'PDF preview'}
        >
          <FilePdfOutlined className="weight-ticket-preview-pdf-icon" />
          <span className="weight-ticket-preview-pdf-name">
            {previewName || 'document.pdf'}
          </span>
        </div>
      )
    }
    return null
  }

  const renderProcessing = () => (
    <div className="weight-ticket-flow-body">
      {renderHeader()}
      <div
        className={`weight-ticket-processing${previewUrl ? ' has-preview' : ''}`}
      >
        {renderPreview()}
        <div className="weight-ticket-processing-overlay">
          <Spin size="large" />
          <Typography.Text className="weight-ticket-processing-title">
            Analyzing ticket...
          </Typography.Text>
          <Typography.Text className="weight-ticket-processing-subtitle">
            AI is extracting date and tonnage
          </Typography.Text>
        </div>
      </div>
    </div>
  )

  const renderApplying = () => (
    <div className="weight-ticket-flow-body weight-ticket-flow-body--applying">
      {renderHeader()}
      <div className="weight-ticket-processing">
        <Spin />
        <Typography.Text>Saving tonnage...</Typography.Text>
      </div>
    </div>
  )

  const renderRows = () => {
    if (!extraction) return null
    return (
      <div className="weight-ticket-detail-rows">
        <div>
          <span>DATE:</span>
          <strong>{formatDateForDisplay(extraction.date)}</strong>
        </div>
        <div>
          <span>Tonnage:</span>
          <strong>{extraction.tonnage}</strong>
        </div>
        <div>
          <span>Material:</span>
          <strong>
            {selectedStream?.material ?? extraction.material}
          </strong>
        </div>
        <div>
          <span>ADDRESS:</span>
          <strong className="multiline">{extraction.address}</strong>
        </div>
      </div>
    )
  }

  const renderConfirmation = () => (
    <div className="weight-ticket-card">
      {renderHeader()}
      <div className="weight-ticket-status-icon success">
        <CheckOutlined />
      </div>
      <Typography.Title level={4} className="weight-ticket-mode-title">
        Upload Successful
      </Typography.Title>
      {renderRows()}
      <div className="weight-ticket-actions">
        <Button
          className="weight-ticket-add-btn"
          onClick={handleOpenTonnageDialog}
          type="primary"
        >
          Add
        </Button>
        <Button
          className="weight-ticket-edit-btn"
          onClick={handleEdit}
          type="primary"
        >
          Edit
        </Button>
      </div>
    </div>
  )

  const renderEditing = () => (
    <div className="weight-ticket-card">
      {renderHeader()}
      <div className="weight-ticket-status-icon edit">
        <QuestionOutlined />
      </div>
      <Typography.Title level={4} className="weight-ticket-mode-title">
        Edit Mode
      </Typography.Title>
      <div className="weight-ticket-edit-rows">
        <div>
          <span>DATE:</span>
          <Input
            value={editDate}
            placeholder="MM/DD/YYYY"
            onChange={(e) => setEditDate(e.target.value)}
          />
        </div>
        <div>
          <span>Tonnage:</span>
          <Input
            value={editTonnage}
            onChange={(e) => setEditTonnage(e.target.value)}
          />
        </div>
        <div>
          <span>Material:</span>
          <strong>{extraction?.material}</strong>
        </div>
        <div className="weight-ticket-edit-address-row">
          <span>ADDRESS:</span>
          <AddressAutocomplete
            name="weightTicketAddress"
            className="weight-ticket-edit-address"
            value={editAddress}
            placeholder="Enter address"
            onChange={(value) => setEditAddress(value)}
            onAddressSelect={(address) => {
              setEditAddress(address.addressFull || address.addressLine1 || '')
            }}
          />
        </div>
      </div>
      <div className="weight-ticket-actions">
        <Button className="weight-ticket-edit-btn" onClick={handleSaveEdit}>
          Save
        </Button>
        <Button
          className="weight-ticket-cancel-btn"
          onClick={() => setStep('confirmation')}
        >
          Cancel
        </Button>
      </div>
    </div>
  )

  const renderTonnageDialog = () => {
    let message = ''
    let buttons: Array<{
      label: string
      action: () => void
      className: string
    }> = []

    if (overwriteOnly) {
      if (vesselCounts.hasAny) {
        message = inactive
          ? 'This job site is inactive. You can only overwrite an existing vessel.'
          : 'This waste stream is closed. You can only overwrite an existing vessel with estimated tonnage.'
        buttons = [
          {
            label: 'Overwrite',
            action: () => handleApply('overwrite'),
            className: 'weight-ticket-add-btn',
          },
          {
            label: 'Cancel',
            action: () => setTonnageDialogOpen(false),
            className: 'weight-ticket-cancel-btn',
          },
        ]
      } else {
        message = inactive
          ? 'This job site is inactive. There are no vessels to overwrite for this month.'
          : 'This waste stream is closed. There are no vessels to overwrite for this month.'
        buttons = [
          {
            label: 'OK',
            action: () => setTonnageDialogOpen(false),
            className: 'weight-ticket-add-btn',
          },
        ]
      }
    } else if (vesselCounts.hasAny) {
      message =
        'We found dumpsters with estimated tonnages. Do you want to overwrite or add a new dumpster?'
      buttons = [
        {
          label: 'Add',
          action: () => handleApply('add'),
          className: 'weight-ticket-add-btn',
        },
        {
          label: 'Overwrite',
          action: () => handleApply('overwrite'),
          className: 'weight-ticket-edit-btn',
        },
        {
          label: 'Cancel',
          action: () => setTonnageDialogOpen(false),
          className: 'weight-ticket-cancel-btn',
        },
      ]
    } else {
      message = 'Do you want to add a new dumpster?'
      buttons = [
        {
          label: 'Add',
          action: () => handleApply('add'),
          className: 'weight-ticket-add-btn',
        },
        {
          label: 'Cancel',
          action: () => setTonnageDialogOpen(false),
          className: 'weight-ticket-cancel-btn',
        },
      ]
    }

    return (
      <Modal
        open={tonnageDialogOpen}
        onCancel={() => setTonnageDialogOpen(false)}
        footer={null}
        centered
        width={460}
        className="weight-ticket-modal weight-ticket-tonnage-dialog"
        destroyOnClose
      >
        <div className="weight-ticket-tonnage-body">
          <Typography.Title level={4}>Add Tonnage</Typography.Title>
          <Typography.Paragraph>{message}</Typography.Paragraph>
          <div className="weight-ticket-actions">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                className={btn.className}
                onClick={btn.action}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <>
      <Button
        className="weight-ticket-open-btn"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        Upload Weight Ticket
      </Button>
      <Modal
        open={open}
        onCancel={reset}
        footer={null}
        centered
        width={900}
        className="weight-ticket-modal"
        destroyOnClose
      >
        {step === 'select' && renderSelect()}
        {step === 'upload' && renderUpload()}
        {step === 'processing' && renderProcessing()}
        {step === 'applying' && renderApplying()}
        {step === 'confirmation' && renderConfirmation()}
        {step === 'editing' && renderEditing()}
      </Modal>
      {renderTonnageDialog()}
    </>
  )
}
