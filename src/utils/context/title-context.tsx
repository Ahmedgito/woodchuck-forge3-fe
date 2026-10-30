'use client'

import React, { createContext, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export const TitleContext = createContext<null>(null)

type TitleProviderProps = {
  children: ReactNode
}

export const TitleProvider = ({ children }: TitleProviderProps) => {
  const pathname = usePathname()

  // We only need to change the title of the pages, not for SEO purposes
  useEffect(() => {
    const setTitle = () => {
      const routeName = pathname.split('/').pop() || 'Woodchuck.AI'
      document.title = routeName.charAt(0).toUpperCase() + routeName.slice(1)
    }

    setTitle()
  }, [pathname])

  return <TitleContext.Provider value={null}>{children}</TitleContext.Provider>
}
