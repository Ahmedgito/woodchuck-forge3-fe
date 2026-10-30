import { WASTE_STREAMS } from '../constants/app-constants'

export const wasteStreamChartLineStyle = (styles: any, name: string) => {
  switch (name.toUpperCase()) {
    case WASTE_STREAMS.PLASTIC:
      return `${styles.chart_column} ${styles.plastic}`
    case WASTE_STREAMS.WOOD_WASTE:
      return `${styles.chart_column} ${styles.wood_waste}`
    case WASTE_STREAMS.CARD_BOARD:
      return `${styles.chart_column} ${styles.card_board}`
    case WASTE_STREAMS.WASTE_HAULING:
      return `${styles.chart_column} ${styles.waste_hauling}`
    case WASTE_STREAMS.METAL:
      return `${styles.chart_column} ${styles.metal}`
    case WASTE_STREAMS.CONCRETE:
      return `${styles.chart_column} ${styles.concrete}`
    default:
      return styles.chart_column
  }
}

export const computeColumnWidth = (tons?: number): number => {
  const base = 84
  const max = 260
  const valueScale = 0.5
  const t = Number(tons || 0)
  const widthByValue = base + t * valueScale

  const raw = widthByValue
  return Math.min(Math.max(raw, base), max)
}
