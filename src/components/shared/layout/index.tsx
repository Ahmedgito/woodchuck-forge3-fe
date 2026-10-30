'use client'
import React, { ReactNode } from 'react'
import HeaderComponent from '../header'
import { Layout } from 'antd'
import { useSession } from 'next-auth/react'
const { Header, Content } = Layout
interface LayoutProps {
  children: ReactNode
}

const LayoutComponent = ({ children }: LayoutProps) => {
  const { data: session } = useSession()
  return (
    <Layout>
      <Header
        className={`header ${session?.impersonated ? 'impersonated' : ''} `}
      >
        <HeaderComponent />
      </Header>
      <Content> {children}</Content>
    </Layout>
  )
}

export default LayoutComponent
