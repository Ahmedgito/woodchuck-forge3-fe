'use client'

import { CSSProperties, ImgHTMLAttributes } from 'react'
import { Typography } from 'antd'
import { useDisplayImageSrc } from '@/src/utils/hooks/useDisplayImageSrc'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | undefined
  convert?: boolean
  wrapperStyle?: CSSProperties
  /** Hide the internal conversion spinner (e.g. when a parent overlay already shows a loader) */
  showLoadingIndicator?: boolean
}

export function WasteStreamDisplayImage({
  src,
  convert = true,
  style,
  wrapperStyle,
  alt,
  showLoadingIndicator = true,
  ...imgProps
}: Props) {
  const { displaySrc, loading, error } = useDisplayImageSrc(src, convert)

  if (!src) {
    return null
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: 4,
          textAlign: 'center',
          ...wrapperStyle,
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: 10 }}>
          Preview unavailable
        </Typography.Text>
      </div>
    )
  }

  if (loading || !displaySrc) {
    if (!showLoadingIndicator) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            ...wrapperStyle,
          }}
        />
      )
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          ...wrapperStyle,
        }}
      >
        <img
          src="/images/processing-spinner.svg"
          alt="Loading"
          width={20}
          height={20}
          className="processing-spinner-icon"
        />
      </div>
    )
  }

  return (
    <img
      {...imgProps}
      src={displaySrc}
      alt={alt}
      style={style}
    />
  )
}

export default WasteStreamDisplayImage
