'use client'

import { useSession } from 'next-auth/react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUser } from '@/src/services/user'
import { MESSAGES } from '../constants/app-constants'
import { useTriggerNotification } from './notification-context'
import { useLoader } from './loader-context'

interface User {
  id: number
  name: string
  phone: string
  photo: string
  username: string
  company: string
  role: {
    enum: string
  }
}

interface userContext {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  setUpdateUser: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserContext = createContext<userContext | null>(null)

const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const triggerNotification = useTriggerNotification()
  const [user, setUser] = useState<any>()
  const [updateUser, setUpdateUser] = useState(false)
  const { setLoading } = useLoader()

  const { data: session, status } = useSession()

  const getAuthenticated = () => {
    return status === 'authenticated'
  }
  const getUserData = async () => {
    try {
      setLoading(true)
      const result = await getUser()
      setUser(result.data.data)
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
    getAuthenticated() && getUserData()
  }, [status, updateUser, session?.user?.id])

  return (
    <UserContext.Provider value={{ user, setUser, setUpdateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, useUser }
