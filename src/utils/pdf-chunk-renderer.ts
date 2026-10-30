import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { PDF_EXPORT } from './constants/app-constants'

interface ChunkRenderOptions {
  element: HTMLElement
  pdf: jsPDF
  margin: number
  contentWidth: number
  contentHeight: number
}

interface SingleCanvasOptions {
  element: HTMLElement
  pdf: jsPDF
  margin: number
  contentWidth: number
  contentHeight: number
}

export const renderDOMInChunks = async ({
  element,
  pdf,
  margin,
  contentWidth,
  contentHeight,
}: ChunkRenderOptions): Promise<void> => {
  const domHeight = element.scrollHeight
  const chunkHeight = PDF_EXPORT.MAX_SAFE_CANVAS_HEIGHT
  const totalChunks = Math.ceil(domHeight / chunkHeight)
  let isFirstPage = true
  let currentPageRemainingHeight = contentHeight

  // Store original styles
  const originalOverflow = element.style.overflow
  const originalHeight = element.style.height
  const originalPosition = element.style.position

  // Create wrapper for controlled rendering
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.left = '-50000px'
  wrapper.style.top = '0'
  wrapper.style.width = `${element.offsetWidth}px`
  wrapper.style.overflow = 'hidden'
  wrapper.style.zIndex = '-1000'

  document.body.appendChild(wrapper)

  try {
    for (let i = 0; i < totalChunks; i++) {
      const yOffset = i * chunkHeight
      const remainingHeight = Math.min(chunkHeight, domHeight - yOffset)

      // Clone content for this chunk
      const chunkClone = element.cloneNode(true) as HTMLElement
      chunkClone.style.position = 'relative'
      chunkClone.style.top = `-${yOffset}px`
      chunkClone.style.width = '100%'

      // Set wrapper to show only this chunk
      wrapper.style.height = `${remainingHeight}px`
      wrapper.innerHTML = ''
      wrapper.appendChild(chunkClone)
      wrapper.offsetHeight // Force layout calculation

      try {
        const canvas = await html2canvas(wrapper, {
          useCORS: true,
          allowTaint: true,
          scale: Math.min(PDF_EXPORT.CANVAS_SCALE, 1.0),
          backgroundColor: '#ffffff',
          logging: false,
          width: element.offsetWidth,
          height: remainingHeight,
          removeContainer: true,
          foreignObjectRendering: false,
        })

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Chunk ${i + 1} produced empty canvas, skipping`)
          continue
        }

        const imgWidth = contentWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Check if chunk fits on current page or needs new page
        const fitsOnCurrentPage = imgHeight <= currentPageRemainingHeight
        const fitsOnSinglePage = imgHeight <= contentHeight
        const isLastChunk = i === totalChunks - 1

        if (!fitsOnSinglePage) {
          // Chunk too tall for single page - add to new page and clip if needed
          pdf.addPage()
          currentPageRemainingHeight = contentHeight

          const imgData = canvas.toDataURL(
            'image/jpeg',
            PDF_EXPORT.JPEG_QUALITY
          )
          if (imgData && imgData !== 'data:,') {
            pdf.addImage(
              imgData,
              'JPEG',
              margin,
              margin,
              imgWidth,
              Math.min(imgHeight, contentHeight)
            )
            currentPageRemainingHeight = 0
          }
        } else if (fitsOnCurrentPage) {
          // Chunk fits on current page with remaining space
          const imgData = canvas.toDataURL(
            'image/jpeg',
            PDF_EXPORT.JPEG_QUALITY
          )
          if (imgData && imgData !== 'data:,') {
            const yPosition =
              margin + (contentHeight - currentPageRemainingHeight)
            pdf.addImage(
              imgData,
              'JPEG',
              margin,
              yPosition,
              imgWidth,
              imgHeight
            )
            currentPageRemainingHeight -= imgHeight
          }
        } else {
          // Chunk needs a new page
          // For the last chunk, create a page with optimal height
          if (isLastChunk && imgHeight < contentHeight) {
            const optimalPageHeight = imgHeight + margin * 2
            pdf.addPage([PDF_EXPORT.PAGE_WIDTH, optimalPageHeight])
            currentPageRemainingHeight = imgHeight
          } else {
            pdf.addPage()
            currentPageRemainingHeight = contentHeight
          }

          const imgData = canvas.toDataURL(
            'image/jpeg',
            PDF_EXPORT.JPEG_QUALITY
          )
          if (imgData && imgData !== 'data:,') {
            pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight)
            currentPageRemainingHeight -= imgHeight
          }
        }

        isFirstPage = false
      } catch (chunkError) {
        console.error(`Error processing chunk ${i + 1}:`, chunkError)
        // Continue with next chunk instead of failing completely
      }
    }
  } finally {
    // Clean up
    document.body.removeChild(wrapper)

    // Restore original styles
    element.style.overflow = originalOverflow
    element.style.height = originalHeight
    element.style.position = originalPosition
  }
}

export const renderSingleCanvas = async ({
  element,
  pdf,
  margin,
  contentWidth,
  contentHeight,
}: SingleCanvasOptions): Promise<void> => {
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    scale: PDF_EXPORT.CANVAS_SCALE,
    backgroundColor: '#ffffff',
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    removeContainer: true,
    foreignObjectRendering: false,
  })

  const imgWidth = contentWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const imgData = canvas.toDataURL('image/jpeg', PDF_EXPORT.JPEG_QUALITY)

  if (imgHeight <= contentHeight) {
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight)
  } else {
    // Split across multiple pages
    let yPosition = 0
    let pageNumber = 0

    while (yPosition < imgHeight) {
      const remainingHeight = imgHeight - yPosition
      const pageImageHeight = Math.min(remainingHeight, contentHeight)
      const isLastPage = remainingHeight <= contentHeight

      if (pageNumber > 0) {
        if (isLastPage && pageImageHeight < contentHeight) {
          const optimalPageHeight = pageImageHeight + margin * 2
          pdf.addPage([PDF_EXPORT.PAGE_WIDTH, optimalPageHeight])
        } else {
          pdf.addPage()
        }
      }

      const sourceY = (yPosition / imgHeight) * canvas.height
      const sourceHeight = (pageImageHeight / imgHeight) * canvas.height

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sourceHeight
      const pageCtx = pageCanvas.getContext('2d')

      pageCtx?.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      )

      const pageImgData = pageCanvas.toDataURL(
        'image/jpeg',
        PDF_EXPORT.JPEG_QUALITY
      )
      pdf.addImage(
        pageImgData,
        'JPEG',
        margin,
        margin,
        imgWidth,
        pageImageHeight
      )

      yPosition += contentHeight
      pageNumber++
    }
  }
}

// New function to create PDF with optimal dimensions
export const createOptimalPDF = async (
  element: HTMLElement,
  margin: number
): Promise<jsPDF> => {
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    scale: Math.min(PDF_EXPORT.CANVAS_SCALE, 1.0),
    backgroundColor: '#ffffff',
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    removeContainer: true,
    foreignObjectRendering: false,
  })

  const contentWidth = PDF_EXPORT.PAGE_WIDTH - margin * 2
  const imgWidth = contentWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const contentHeight = PDF_EXPORT.PAGE_HEIGHT - margin * 2

  const optimalPageHeight = Math.min(
    imgHeight + margin * 2,
    PDF_EXPORT.PAGE_HEIGHT
  )

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [PDF_EXPORT.PAGE_WIDTH, optimalPageHeight],
  })

  return pdf
}
