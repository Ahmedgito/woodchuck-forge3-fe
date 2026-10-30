import { useEffect, useState } from 'react'

export function useTypingEffect(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('') // reset
    let i = 0

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++

      if (i >= text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [text])

  return displayed
}
