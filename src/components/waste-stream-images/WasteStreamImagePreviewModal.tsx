'use client'

import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Image } from 'antd'
import { WasteStreamImage } from '@/src/utils/constants/types'
import { getPreviewPlaceholderSrc } from '@/src/utils/heicDisplay'
import { useDisplayImageSrc } from '@/src/utils/hooks/useDisplayImageSrc'
import ImageMetadataOverlay from './ImageMetadataOverlay'

type Props = {
  open: boolean
  images: WasteStreamImage[]
  currentIndex: number
  wasteStreamName?: string
  onClose: () => void
  onChangeIndex: (_index: number) => void
}

const PREVIEW_IMG_SELECTOR = '.ant-image-preview-img'
const PREVIEW_PLACEHOLDER_SRC = getPreviewPlaceholderSrc()
const MIN_PREVIEW_OPACITY_FOR_METADATA = 0.98

function getVisiblePreviewImage(): HTMLImageElement | null {
  const wraps = document.querySelectorAll('.ant-image-preview-wrap')

  for (const wrap of Array.from(wraps)) {
    const element = wrap as HTMLElement
    if (element.getAttribute('aria-hidden') === 'true') {
      continue
    }

    const style = window.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') {
      continue
    }

    const img = element.querySelector(
      PREVIEW_IMG_SELECTOR
    ) as HTMLImageElement | null
    if (!img) {
      continue
    }

    const rect = img.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      return img
    }
  }

  return null
}

function isPreviewImageLoaded(img: HTMLImageElement): boolean {
  const src = img.currentSrc || img.src || ''
  const isPlaceholder = src === PREVIEW_PLACEHOLDER_SRC

  return (
    img.complete &&
    img.naturalWidth > 0 &&
    img.naturalHeight > 0 &&
    !isPlaceholder
  )
}

function isPreviewImageVisibleEnough(img: HTMLImageElement): boolean {
  const opacity = Number.parseFloat(window.getComputedStyle(img).opacity || '1')
  return opacity >= MIN_PREVIEW_OPACITY_FOR_METADATA
}

function PreviewMetadataOnImage({
  image,
  open,
  currentIndex,
}: {
  image: WasteStreamImage
  open: boolean
  currentIndex: number
}) {
  const [box, setBox] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useLayoutEffect(() => {
    if (!open) {
      setBox(null)
      setIsImageLoaded(false)
      return
    }

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let observedImg: HTMLImageElement | null = null
    let attempts = 0

    const updateBox = () => {
      if (cancelled) {
        return false
      }

      const img = getVisiblePreviewImage()
      if (!img) {
        setIsImageLoaded(false)
        setBox(null)
        return false
      }

      const rect = img.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        setIsImageLoaded(false)
        setBox(null)
        return false
      }

      if (!isPreviewImageLoaded(img) || !isPreviewImageVisibleEnough(img)) {
        setIsImageLoaded(false)
        setBox(null)
        return false
      }

      setIsImageLoaded(true)
      setBox({
        top: rect.top + 8,
        left: rect.left + 8,
        width: Math.max(rect.width - 16, 120),
      })
      return true
    }

    const observeVisibleImage = () => {
      const img = getVisiblePreviewImage()
      if (!img) {
        return false
      }

      if (observedImg !== img) {
        resizeObserver?.disconnect()
        observedImg?.removeEventListener('load', updateBox)
        observedImg = img
        resizeObserver = new ResizeObserver(updateBox)
        resizeObserver.observe(img)
        img.addEventListener('load', updateBox)
      }

      return updateBox()
    }

    const scheduleRetry = () => {
      if (cancelled) {
        return
      }

      attempts += 1

      if (observeVisibleImage()) {
        return
      }

      if (attempts < 120) {
        requestAnimationFrame(scheduleRetry)
      }
    }

    scheduleRetry()
    window.addEventListener('resize', updateBox)

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      observedImg?.removeEventListener('load', updateBox)
      window.removeEventListener('resize', updateBox)
    }
  }, [open, currentIndex, image.id])

  if (!open || !box || !isImageLoaded) {
    return null
  }

  return createPortal(
    <div
      className="waste-stream-preview-metadata-on-image"
      style={
        {
          '--metadata-overlay-top': `${box.top}px`,
          '--metadata-overlay-left': `${box.left}px`,
          '--metadata-overlay-width': `${box.width}px`,
        } as CSSProperties
      }
    >
      <ImageMetadataOverlay
        key={image.id}
        image={image}
        variant="preview"
        detached
      />
    </div>,
    document.body
  )
}

function PreviewSourceImage({ src, alt }: { src: string; alt: string }) {
  const { displaySrc } = useDisplayImageSrc(src, true)

  return <Image src={displaySrc ?? getPreviewPlaceholderSrc()} alt={alt} />
}

export function WasteStreamImagePreviewModal({
  open,
  images,
  currentIndex,
  wasteStreamName,
  onClose,
  onChangeIndex,
}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeImage = images[currentIndex]

  return (
    <>
      <Image.PreviewGroup
        preview={{
          visible: open,
          current: currentIndex,
          onVisibleChange: (visible) => {
            if (!visible) {
              onClose()
            }
          },
          onChange: (current) => {
            onChangeIndex(current)
          },
        }}
      >
        <div style={{ display: 'none' }}>
          {images.map((img) => (
            <PreviewSourceImage
              key={img.id}
              src={img.file?.path as string}
              alt={wasteStreamName ?? 'waste stream image'}
            />
          ))}
        </div>
      </Image.PreviewGroup>

      {mounted && open && activeImage ? (
        <PreviewMetadataOnImage
          image={activeImage}
          open={open}
          currentIndex={currentIndex}
        />
      ) : null}
    </>
  )
}

export default WasteStreamImagePreviewModal
