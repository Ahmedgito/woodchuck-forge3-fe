'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLoader } from './loader-context'
import { getGenieContent } from '@/src/services/global'
import { useTriggerNotification } from './notification-context'
import { MESSAGES } from '../constants/app-constants'
interface GenieHint {
  value: string
  description: string
}
interface GenieModeContextValue {
  genie: boolean
  toggle: () => void
  hints: Record<string, string>
}
const GenieModeContext = createContext<GenieModeContextValue>({
  genie: false,
  toggle: () => {},
  hints: {}, // now correctly typed
})

export const GenieModeProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [genie, setGenie] = useState(false)
  const [hints, setHints] = useState<Record<string, string>>({})
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()

  const toggle = () => setGenie((prev) => !prev)
  const fetchGenieContent = async () => {
    try {
      setLoading(true)
      const result = await getGenieContent()
      const mapped: Record<string, string> = {}
      ;(result.data.data as GenieHint[]).forEach((item) => {
        mapped[item.value] = item.description
      })
      setHints(mapped)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  useEffect(() => {
    if (!genie) return // ❌ Do nothing when turning OFF
    if (Object.keys(hints).length > 0) return // ❌ Do nothing if hints already fetched
    fetchGenieContent()
  }, [genie])

  return (
    <GenieModeContext.Provider value={{ genie, toggle, hints }}>
      {children}
    </GenieModeContext.Provider>
  )
}

export const useGenie = () => useContext(GenieModeContext)
