export const FLOW_ARROW_SYMBOL: google.maps.Symbol = {
  path: 'M -15 -26 L 0 -26 15 0 0 26 -15 26 0 0 -15 -26 Z',
  fillOpacity: 1,
  strokeOpacity: 0,
  scale: 0.115,
}

export const darkenArrowColors = (hex: string, amount: number) => {
  const num = parseInt(hex.replace('#', ''), 16)
  let r = (num >> 16) - amount
  let g = ((num >> 8) & 0xff) - amount
  let b = (num & 0xff) - amount

  r = Math.max(0, r)
  g = Math.max(0, g)
  b = Math.max(0, b)

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export const splitArrowsIntoSegments = <T>(
  arr: T[],
  segments: number
): T[][] => {
  const result: T[][] = []
  if (arr.length < 2) return [arr]

  const baseSize = Math.floor((arr.length - 1) / segments)
  let start = 0

  for (let i = 0; i < segments; i++) {
    const edges = i === segments - 1 ? arr.length - 1 - start : baseSize
    const endIndex = start + edges

    if (i === 0) {
      result.push(arr.slice(start, endIndex + 1))
    } else {
      const seg: T[] = []
      seg.push(arr[start])
      for (let j = start + 1; j <= endIndex; j++) seg.push(arr[j])
      result.push(seg)
    }

    start = endIndex
  }

  return result
}

export const addMapControl = (
  map: google.maps.Map,
  element: HTMLElement | null,
  position: google.maps.ControlPosition
) => {
  if (element) {
    map.controls[position].push(element)
  }
}