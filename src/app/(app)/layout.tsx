'use client'
import { ReactNode, Suspense } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {/* <SessionProvider> */}
      <Suspense fallback={<div></div>}>
        <main>{children}</main>
      </Suspense>
      {/* </SessionProvider> */}
    </>
  )
}
