export const roundToNearestMillion = (num: number) => {
  if (num < 1000000) {
    return num.toString()
  }
  const roundedValue = (num / 1000000).toFixed(1)
  return `${roundedValue}M`
}
