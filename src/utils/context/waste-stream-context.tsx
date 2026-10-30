import React, { createContext, useContext, useState, ReactNode } from 'react'
import { GET_WASTE_STREAM_JOB_SITE_FORM_TYPE } from '@/src/utils/constants/types'

interface WasteStreamContextType {
  previousItems: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  newItemIds: number[]
  updatePreviousItems: (items: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]) => void
  updateNewItemIds: (ids: number[]) => void
  clearNewItemIds: () => void
}

const WasteStreamContext = createContext<WasteStreamContextType | undefined>(
  undefined
)

interface WasteStreamProviderProps {
  children: ReactNode
}

export const WasteStreamProvider: React.FC<WasteStreamProviderProps> = ({
  children,
}) => {
  const [previousItems, setPreviousItems] = useState<
    GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  >([])
  const [newItemIds, setNewItemIds] = useState<number[]>([])

  const updatePreviousItems = (
    items: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  ) => {
    setPreviousItems(items)
  }

  const updateNewItemIds = (ids: number[]) => {
    setNewItemIds(ids)
  }

  const clearNewItemIds = () => {
    setNewItemIds([])
  }

  const value: WasteStreamContextType = {
    previousItems,
    newItemIds,
    updatePreviousItems,
    updateNewItemIds,
    clearNewItemIds,
  }

  return (
    <WasteStreamContext.Provider value={value}>
      {children}
    </WasteStreamContext.Provider>
  )
}

export const useWasteStreamContext = (): WasteStreamContextType => {
  const context = useContext(WasteStreamContext)
  if (context === undefined) {
    throw new Error(
      'useWasteStreamContext must be used within a WasteStreamProvider'
    )
  }
  return context
}
