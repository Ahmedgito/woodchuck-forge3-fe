'use client'

import { useSession } from 'next-auth/react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as io from 'socket.io-client'
import { ROLES } from '../constants/app-constants'

interface ISocketContext {
  socket: io.Socket | null
  notificationReceived: boolean
  setNotificationReceived: React.Dispatch<React.SetStateAction<boolean>>
}

export const SocketContext = createContext<ISocketContext | null>(null)

const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<io.Socket | null>(null)
  const [notificationReceived, setNotificationReceived] =
    useState<boolean>(false)

  const { status, data: session } = useSession()

  const connectWebSocket = () => {
    const soc = io.default(
      process.env.NEXT_PUBLIC_SOCKET_URL ||
        'https://woodchuck-api.folio3.com:7000',
      {
        secure: true,
      }
    )
    setSocket(soc)
  }

  socket?.on('requestNotification', () => {
    setNotificationReceived(true)
  })

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !socket &&
      session?.user.role.enum === ROLES.ADMIN
    ) {
      connectWebSocket()
    }

    // return () => socket.disconnect()
  }, [socket, status])
  return (
    <SocketContext.Provider
      value={{ socket, notificationReceived, setNotificationReceived }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export { SocketProvider, useSocket }
