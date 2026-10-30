import { ApiClient } from '.'
import { ROUTES } from '../utils/constants/app-constants'

export type TicketExtraction = {
  date: string // YYYY-MM-DD
  tonnage: number
  material: string
  address: string
}

export type WeightTicketAction = 'add' | 'overwrite'

export type ApplyWeightTicketPayload = {
  wasteStreamId: number
  date: string // YYYY-MM-DD
  tonnage: number
  action: WeightTicketAction
}

export type ApplyWeightTicketResponse = {
  action: 'added' | 'overwritten'
  dumpsterId?: number
  success: true
}

// Images and PDF — jpg, jpeg, png, gif, heic, heif, pdf
export const WEIGHT_TICKET_MAX_BYTES = 10 * 1024 * 1024 // 10 MB
export const WEIGHT_TICKET_ACCEPT =
  '.jpg,.jpeg,.png,.gif,.heic,.heif,image/*,.pdf,application/pdf'

export function isAllowedWeightTicketFile(file: File) {
  if (file.type.startsWith('image/') || file.type === 'application/pdf') {
    return true
  }
  const name = file.name.toLowerCase()
  return /\.(jpe?g|png|gif|heic|heif|pdf)$/.test(name)
}

function unwrap<T>(response: { data: unknown }): T {
  const data = response.data as { data?: T } | T
  if (data && typeof data === 'object' && 'data' in (data as any)) {
    return ((data as any).data ?? data) as T
  }
  return data as T
}

export const processWeightTicket = async (params: {
  file: File
  wasteStreamId: number
  materialType: string
}): Promise<TicketExtraction> => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('wasteStreamId', String(params.wasteStreamId))
  formData.append('materialType', params.materialType)

  const res = await ApiClient.postMultipart(
    ROUTES.WEIGHT_TICKETS_PROCESS,
    formData
  )
  return unwrap<TicketExtraction>(res)
}

export const applyWeightTicket = async (
  payload: ApplyWeightTicketPayload
): Promise<ApplyWeightTicketResponse> => {
  const res = await ApiClient.post(ROUTES.WEIGHT_TICKETS_APPLY, payload, {
    'Content-Type': 'application/json',
  })
  return unwrap<ApplyWeightTicketResponse>(res)
}
