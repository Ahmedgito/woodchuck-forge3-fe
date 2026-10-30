import { ApiClient } from '.'
import { ROUTES } from '../utils/constants/app-constants'
import { ImageMetadataSource, WasteStreamImage } from '../utils/constants/types'

export type WasteStreamImagePayload = {
  jobsiteWasteStreamId: number
  fileId: string
  displayOrder: number
  capturedAt?: string
  latitude?: number
  longitude?: number
  metadataSource?: ImageMetadataSource
}

export const getWasteStreamImages = (
  jobsiteWasteStreamId: number
): Promise<{ data: WasteStreamImage[] }> => {
  return ApiClient.get(
    `${ROUTES.WASTE_STREAM_IMAGES}/by-waste-stream/${jobsiteWasteStreamId}`
  )
}

export const createWasteStreamImage = (
  payload: WasteStreamImagePayload
): Promise<{ data: WasteStreamImage }> => {
  return ApiClient.post(ROUTES.WASTE_STREAM_IMAGES, payload)
}

export const replaceWasteStreamImage = (
  imageId: string,
  payload: WasteStreamImagePayload
): Promise<{ data: WasteStreamImage }> => {
  return ApiClient.post(`${ROUTES.WASTE_STREAM_IMAGES}/${imageId}/replace`, payload)
}

export const deleteWasteStreamImage = (
  imageId: string
): Promise<{ data: { success: boolean } }> => {
  return ApiClient.delete(`${ROUTES.WASTE_STREAM_IMAGES}/${imageId}`, undefined)
}

export const updateWasteStreamImageConfidence = (
  imageId: string,
  adminConfidenceOverride: number
): Promise<{ data: WasteStreamImage }> => {
  return ApiClient.patch(
    `${ROUTES.WASTE_STREAM_IMAGES}/${imageId}/confidence`,
    { adminConfidenceOverride }
  )
}

export const getWasteStreamImageStatus = (
  imageId: string
): Promise<{
  data: {
    id: string
    aiStatus: string
    aiConfidenceLevel: number | null
    aiVerified: boolean | null
  }
}> => {
  return ApiClient.get(`${ROUTES.WASTE_STREAM_IMAGES}/${imageId}/status`)
}

export const uploadFileToS3 = (file: File): Promise<{ data: { file: { id: string; path: string } } }> => {
  const formData = new FormData()
  formData.append('file', file)
  return ApiClient.postMultipart(ROUTES.FILES_UPLOAD, formData)
}
