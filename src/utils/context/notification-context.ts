'use client'

import { notification } from 'antd'

const ACCOUNT_CHANGE_LOGOUT_MARKER = 'account-change-logout-warning-at'
const ACCOUNT_CHANGE_SUPPRESSION_MS = 10000

export const useTriggerNotification = () => {
  const triggerNotification = (
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    description: string,
    duration: number = 4.5
  ) => {
    if (type === 'error' && typeof window !== 'undefined') {
      const marker = sessionStorage.getItem(ACCOUNT_CHANGE_LOGOUT_MARKER)
      if (marker) {
        const shouldSuppress =
          Number.isFinite(Number(marker)) &&
          Date.now() - Number(marker) < ACCOUNT_CHANGE_SUPPRESSION_MS

        if (shouldSuppress) {
          return
        }

        sessionStorage.removeItem(ACCOUNT_CHANGE_LOGOUT_MARKER)
      }
    }

    notification.destroy()
    notification[type]({
      message: message,
      description: description,
      duration: duration,
      placement: 'topRight', // Adjust placement as needed
    })
  }

  return triggerNotification
}
