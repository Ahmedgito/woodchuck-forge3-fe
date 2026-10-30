import { useSession } from 'next-auth/react'
import { useLoader } from '@/src/utils/context/loader-context'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import {
  setAdminTokenCookie,
  clearAdminTokenCookie,
} from '@/src/utils/cookie-utils'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clearSessionCache } from '@/src/services'

export const useImpersonation = () => {
  const { data: session, update } = useSession()
  const { setLoading } = useLoader()
  const triggerNotification = useTriggerNotification()
  const router = useRouter()

  // Listen for session restoration events from axios interceptor
  useEffect(() => {
    const handleRestoreAdminSession = async (event: Event) => {
      const customEvent = event as CustomEvent
      const storedAdminToken = customEvent.detail

      if (storedAdminToken) {
        console.log('🔄 Restoring admin session from axios interceptor event')

        try {
          clearSessionCache() // Clear cache before updating session
          await update({
            token: storedAdminToken.token,
            user: storedAdminToken.user,
            status: 'authenticated',
            role: storedAdminToken.role,
            impersonated: false,
          })

          // Show notification that admin session was restored
          triggerNotification(
            'success',
            MESSAGES.ADMIN_SESSION_RESTORED,
            MESSAGES.IMPERSONATION_SESSION_EXPIRED,
            4.5
          )

          console.log('✅ Successfully restored admin session from event')
        } catch (error) {
          console.error('Failed to restore admin session from event:', error)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'restore-admin-session',
        handleRestoreAdminSession as EventListener
      )

      return () => {
        window.removeEventListener(
          'restore-admin-session',
          handleRestoreAdminSession as EventListener
        )
      }
    }
  }, [update, triggerNotification])

  const startImpersonating = async (targetUserId: number) => {
    try {
      setLoading(true)

      // Store current admin session data in cookie before starting impersonation
      if (session && !session.impersonated) {
        const adminTokenData = {
          token: session.token,
          user: session.user,
          role: session.role,
          impersonated: false,
        }
        setAdminTokenCookie(adminTokenData)
      }
      // Trigger server-side impersonation via next-auth jwt callback
      clearSessionCache() // Clear cache before updating session
      await update({ action: 'startImpersonation', targetUserId })
      router.refresh()
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to start impersonation:', error)
      return { success: false, error: 'Failed to start impersonation' }
    } finally {
      setLoading(false)
    }
  }

  const stopImpersonating = async () => {
    try {
      setLoading(true)
      // Trigger server-side stop via next-auth jwt callback
      clearSessionCache() // Clear cache before updating session
      await update({ action: 'stopImpersonation' })

      clearAdminTokenCookie()
      // Redirect to dashboard after reverting impersonation
      router.replace('/')
      return { success: true }
    } catch (error) {
      console.error('Failed to stop impersonation:', error)
      return { success: false, error: 'Failed to stop impersonation' }
    } finally {
      setLoading(false)
    }
  }

  return {
    startImpersonating,
    stopImpersonating,
  }
}
