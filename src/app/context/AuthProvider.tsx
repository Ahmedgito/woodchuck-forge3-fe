'use client'
import { SessionProvider } from 'next-auth/react'
import React, { useEffect } from 'react'
import { clearSessionCache } from '@/src/services'

function SessionCacheManager() {
  useEffect(() => {
    // Clear session cache when session changes
    const handleSessionChange = () => {
      clearSessionCache()
    }
    
    // Listen for storage events (cross-tab session changes)
    window.addEventListener('storage', handleSessionChange)
    
    return () => {
      window.removeEventListener('storage', handleSessionChange)
    }
  }, [])
  
  return null
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <SessionCacheManager />
      {children}
    </SessionProvider>
  )
}
