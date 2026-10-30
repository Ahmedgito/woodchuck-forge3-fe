'use client'

import { useLayoutEffect, useState } from 'react'

const PREVIEW_IMG_SELECTOR = '.ant-image-preview-img'

export type PreviewImageRect = {
  top: number
  left: number
  width: number
  height: number
  bottom: number
}

export function getVisiblePreviewImage(): HTMLImageElement | null {
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

export function usePreviewImageRect(
  open: boolean,
  currentIndex: number,
  imageId: string
): PreviewImageRect | null {
  const [rect, setRect] = useState<PreviewImageRect | null>(null)

  useLayoutEffect(() => {
    if (!open) {
      setRect(null)
      return
    }

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let observedImg: HTMLImageElement | null = null
    let attempts = 0

    const updateRect = () => {
      if (cancelled) {
        return
      }

      const img = getVisiblePreviewImage()
      if (!img) {
        return
      }

      const box = img.getBoundingClientRect()
      if (box.width <= 0 || box.height <= 0) {
        return
      }

      setRect({
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        bottom: box.bottom,
      })
    }

    const observeVisibleImage = () => {
      const img = getVisiblePreviewImage()
      if (!img) {
        return false
      }

      if (observedImg !== img) {
        resizeObserver?.disconnect()
        observedImg?.removeEventListener('load', updateRect)
        observedImg = img
        resizeObserver = new ResizeObserver(updateRect)
        resizeObserver.observe(img)
        img.addEventListener('load', updateRect)
      }

      updateRect()
      return true
    }

    const scheduleRetry = () => {
      if (cancelled) {
        return
      }

      if (observeVisibleImage()) {
        return
      }

      attempts += 1
      if (attempts < 120) {
        requestAnimationFrame(scheduleRetry)
      }
    }

    scheduleRetry()
    window.addEventListener('resize', updateRect)

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      observedImg?.removeEventListener('load', updateRect)
      window.removeEventListener('resize', updateRect)
    }
  }, [open, currentIndex, imageId])

  return rect
}
