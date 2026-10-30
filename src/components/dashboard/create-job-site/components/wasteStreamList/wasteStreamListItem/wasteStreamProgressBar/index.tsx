'use client'
import React from 'react'
import styles from './style.module.scss'

interface StripedProgressBarProps {
  fillLevel: number // How much the bar is filled (0-100)
  status: 'normal' | 'exception'
  confidence: number // Determines stripe thickness (0-100)
  markerLevel?: number // Marker position (default: threshold)
  isFolio3ConfidenceHigher?: boolean
}

const variants = {
  normal: {
    fillColor: '#4B287D',
  },
  exception: {
    fillColor: '#D62222',
  },
}

const StripedProgressBar: React.FC<StripedProgressBarProps> = ({
  fillLevel,
  status,
  confidence,
  markerLevel = 0,
  isFolio3ConfidenceHigher,
}) => {
  const fillColor = variants[status].fillColor
  const clampedConfidence = Math.min(
    Math.max(confidence, confidence < 1 ? 0 : 1),
    100
  )

  let stripeThickness: number
  let stripeGap: number

  if (clampedConfidence === 0) {
    stripeThickness = 0
    stripeGap = 0
  } else if (clampedConfidence <= 30) {
    stripeThickness = Math.round((clampedConfidence / 30) * 1 + 1)
    stripeGap = 7 - (clampedConfidence / 30) * 2
  } else if (clampedConfidence <= 60) {
    stripeThickness = Math.round(((clampedConfidence - 30) / 30) * 2 + 2)
    stripeGap = 5 - ((clampedConfidence - 30) / 30) * 2
  } else if (clampedConfidence <= 90) {
    stripeThickness = Math.round(((clampedConfidence - 60) / 30) * 2 + 4)
    stripeGap = 3 - ((clampedConfidence - 60) / 30) * 2
  } else {
    stripeThickness = Math.round(((clampedConfidence - 90) / 10) * 1 + 6)
    stripeGap = 1 - ((clampedConfidence - 90) / 10) * 0.8
  }

  const patternSize = stripeThickness + stripeGap

  // helper to calculate offset dynamically
  const getTextOffset = (fillLevel: number): string => {
    if (fillLevel === 100) {
      return 'calc(100% - 42px)'
    }

    let offset = 6 // default offset

    if (fillLevel === 89 || fillLevel === 90) {
      offset = 1
    } else if (fillLevel === 91) {
      offset = -1
    } else if (fillLevel >= 92 && fillLevel < 100) {
      offset = -36
    }

    return `calc(${fillLevel}% + ${offset}px)`
  }

  return (
    <div className={styles['progress-container']}>
      {/* Top Marker */}
      <div className={styles['marker-top']} style={{ left: `${markerLevel}%` }}>
        <div className={styles['arrow']}>▼</div>
        {/* <div className={styles['marker-label']}>{Math.round(markerLevel)}%</div> */}
      </div>

      {/* Fill */}
      <div
        className={[
          styles['progress-fill'],
          !isFolio3ConfidenceHigher ? styles['border-red'] : '',
        ].join(' ')}
        style={{ width: `${fillLevel > 1 ? fillLevel : 0.5}%` }}
      >
        {clampedConfidence === 100 ? (
          <div
            className={styles['solid-fill']}
            style={{ backgroundColor: fillColor }}
          />
        ) : clampedConfidence === 0 ? (
          <div
            className={styles['solid-fill']}
            style={
              isFolio3ConfidenceHigher
                ? {
                    borderRight: `2px solid ${fillColor}`,
                  }
                : undefined
            }
          >
            {/* Custom content for confidence 10 */}
          </div>
        ) : (
          <svg
            style={
              isFolio3ConfidenceHigher
                ? {
                    borderRight: `2px solid ${fillColor}`,
                  }
                : undefined
            }
            className={styles['stripe-svg']}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="diagonalStripes"
                patternUnits="userSpaceOnUse"
                width={patternSize}
                height={patternSize}
                patternTransform="rotate(-45)"
              >
                <rect
                  width={stripeThickness}
                  height={patternSize}
                  fill={fillColor}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalStripes)" />
          </svg>
        )}
      </div>

      {/* Fill Label */}
      <div
        className={styles['progress-text']}
        style={{ left: getTextOffset(fillLevel) }}
      >
        {Math.round(fillLevel)}%
      </div>

      {/* Bottom Marker */}
      <div
        className={styles['marker-bottom']}
        style={{ left: `${markerLevel}%` }}
      >
        <div className={styles['arrow']}>▲</div>
        <div
          className={`${styles['marker-label']} ${
            markerLevel === 100 ? styles['marker100'] : ''
          }`}
        >
          {Math.round(markerLevel)}%
        </div>
      </div>
    </div>
  )
}

export default StripedProgressBar
