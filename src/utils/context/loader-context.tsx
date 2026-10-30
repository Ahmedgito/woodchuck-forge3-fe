'use client'

import React, { createContext, useContext, useState } from 'react'
import { Spin } from 'antd' // Import Spin from Ant Design

interface LoadingState {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const LoadingContext = createContext<LoadingState>({
  loading: false,
  setLoading: () => {}, // Default function that does nothing
})

const useLoader = () => useContext(LoadingContext)

const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading = () => {}] = useState(false)

  const value: LoadingState = { loading, setLoading }

  // Custom SVG loader
  const CustomLoader = (
    <img
      src="/images/loader.png"
      alt="Loading..."
      style={{
        width: 136,
        height: 136,
        animation: 'spin 1s linear infinite',
        transformOrigin: 'center center',
      }}
    />
  )

  return (
    <LoadingContext.Provider value={value}>
      <Spin spinning={loading} fullscreen indicator={CustomLoader} />
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, useLoader }
