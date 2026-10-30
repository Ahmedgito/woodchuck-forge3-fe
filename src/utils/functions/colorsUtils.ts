export const lightenHexForCheckboxBackground = (hex: string, pct: number) => {
  if (!hex) return hex
  const v = hex.replace('#', '')
  if (v.length !== 6) return hex
  const num = parseInt(v, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255
  const adj = (c: number) => Math.round(c + (255 - c) * pct)
  r = adj(r)
  g = adj(g)
  b = adj(b)
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}
