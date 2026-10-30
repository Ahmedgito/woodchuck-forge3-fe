const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let debounceTimer: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func(...args), delay)
  }) as T
}

export default debounce
