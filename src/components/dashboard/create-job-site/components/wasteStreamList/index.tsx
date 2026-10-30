import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  DROP_DOWN_OPTIONS,
  DUMPSTER_ALERT_TYPE,
  GET_WASTE_STREAM_JOB_SITE_FORM_TYPE,
  HAULER_TYPE,
  REORDER_WASTE_STREAM_TYPE,
} from '@/src/utils/constants/types'
import WasteStreamListItem from './wasteStreamListItem'
import { reorderWasteStream } from '@/src/services/jobsite'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useWasteStreamContext } from '@/src/utils/context/waste-stream-context'

interface WasteStreamListProps {
  data: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isRefreshing: boolean
  jobSiteId: number | null | undefined
  dumpsterList: DROP_DOWN_OPTIONS
  haulerList: HAULER_TYPE[]
  locationList: COMBINED_LOCATION_TYPE[]
  cameraData: CAMERA_DROPDOWN_TYPE[]
  alertData: DUMPSTER_ALERT_TYPE[]
  disabled?: boolean
  setIsNewWasteStream: React.Dispatch<React.SetStateAction<boolean>>
  isNewWasteStream: boolean
}

interface DragAndDropHookReturn {
  items: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  setItems: React.Dispatch<
    React.SetStateAction<GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]>
  >
  activeId: string | null
  activeItem: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE | undefined
  sensors: any
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  handleDragCancel: () => void
  editableItemId: number | null
  setEditableItemId: React.Dispatch<React.SetStateAction<number | null>>
}

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.BeforeDragging,
  },
}

// Custom hook for drag and drop functionality
const useDragAndDrop = (
  initialItems: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[],
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  isRefreshing: boolean,
  jobSiteId: number | null | undefined
): DragAndDropHookReturn => {
  const [items, setItems] = useState<GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const triggerNotification = useTriggerNotification()
  const [editableItemId, setEditableItemId] = useState<number | null>(null)
  const [hasReordered, setHasReordered] = useState(false)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  useEffect(() => {
    if (!isRefreshing && items.length > 0 && hasReordered) {
      const normalizedItems = items.map((item, index) => ({
        id: item.id,
        order: index + 1,
      }))
      handleWasteStreamReorder(jobSiteId, normalizedItems)
      setHasReordered(false)
    }
  }, [items, isRefreshing, hasReordered])

  const handleWasteStreamReorder = async (
    jobSiteId: number | null | undefined,
    items: REORDER_WASTE_STREAM_TYPE[]
  ) => {
    try {
      await reorderWasteStream(jobSiteId, items)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.WASTE_STREAM_REORDER_SUCCESS
      )
      setRefresh(true)
    } catch (err) {
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  // Memoized sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent): void => {
    setActiveId(event.active.id as string)
  }, [])

  const handleReorder = (
    items: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[],
    event: DragEndEvent
  ) => {
    const { active, over } = event
    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over!.id)
    const updatedArray = arrayMove(items, oldIndex, newIndex)
    return updatedArray
  }

  const handleDragEnd = useCallback((event: DragEndEvent): void => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setItems((items) => handleReorder(items, event))
      setHasReordered(true)
    }
    setActiveId(null)
  }, [])

  const handleDragCancel = useCallback((): void => {
    setActiveId(null)
  }, [])

  const activeItem = useMemo(
    (): GET_WASTE_STREAM_JOB_SITE_FORM_TYPE | undefined =>
      items.find((item) => item.id === Number(activeId)),
    [items, activeId]
  )

  return {
    items,
    setItems,
    activeId,
    activeItem,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    editableItemId,
    setEditableItemId,
  }
}

const WasteStreamList: React.FC<WasteStreamListProps> = ({
  data,
  setRefresh,
  isRefreshing,
  jobSiteId,
  dumpsterList,
  haulerList,
  locationList,
  cameraData,
  alertData,
  disabled = false,
  setIsNewWasteStream,
  isNewWasteStream,
}) => {
  const {
    items,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    editableItemId,
    setEditableItemId,
  } = useDragAndDrop(data, setRefresh, isRefreshing, jobSiteId)

  const {
    previousItems,
    newItemIds,
    updatePreviousItems,
    updateNewItemIds,
    clearNewItemIds,
  } = useWasteStreamContext()

  // Detect new items on data change
  useEffect(() => {
    if (data && data.length > 0) {
      if (isNewWasteStream) {
        updatePreviousItems(data)
        setIsNewWasteStream(false)
      } else {
        const previousIds = previousItems.map((item) => item.id)
        const newIds = data
          .filter((item) => !previousIds.includes(item.id))
          .map((item) => item.id)
        updateNewItemIds(newIds)
        if (newIds.length > 0) {
          const timeout = setTimeout(() => {
            updatePreviousItems(data)
            clearNewItemIds()
          }, 10000)
          return () => clearTimeout(timeout)
        }
      }
    }
  }, [data])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={measuringConfig}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
        disabled={disabled}
      >
        {items.map(
          (item: GET_WASTE_STREAM_JOB_SITE_FORM_TYPE, index: number) => (
            <>
              <WasteStreamListItem
                key={item.id}
                item={item}
                dumpsterList={dumpsterList}
                haulerList={haulerList}
                locationList={locationList}
                cameraData={cameraData}
                alertData={alertData}
                setRefresh={setRefresh}
                jobSiteId={jobSiteId}
                index={index + 1}
                editableItemId={editableItemId}
                setEditableItemId={setEditableItemId}
                disabled={disabled}
                isNewItem={
                  newItemIds.find((id) => id === item.id) ? true : false
                }
              />
            </>
          )
        )}
      </SortableContext>
    </DndContext>
  )
}

export default WasteStreamList
