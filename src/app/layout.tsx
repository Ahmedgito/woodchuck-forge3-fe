import React from 'react'
import localFont from 'next/font/local'
import { ConfigProvider } from 'antd'
import theme from './theme/themeConfig'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import LayoutComponent from '../components/shared/layout'
import AuthProvider from './context/AuthProvider'
import { UserProvider } from '../utils/context/user-context'
import { LoadingProvider } from '../utils/context/loader-context'
import { TitleProvider } from '../utils/context/title-context'
import { ReportSubscriptionsProvider } from '../utils/context/report-subscriptions-context'
import { ReportGenerationProvider } from '../utils/context/report-generation-context'
import { GenieModeProvider } from '../utils/context/genie-mode-context'

import '@styles/index.scss'

// Define the type for the parameters
interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

const PathwayCondensed = localFont({
  src: '../fonts/PathwayExtreme_120pt_Condensed-Medium.ttf',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-condensed',
})

const RootLayout: React.FC<RootLayoutProps> = (props) => {
  return (
    <html lang="en" className={PathwayCondensed.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Pathway+Extreme:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConfigProvider theme={theme}>
          <AntdRegistry>
            <TitleProvider>
              <AuthProvider>
                {/* <SocketProvider> */}
                <UserProvider>
                  <ReportSubscriptionsProvider>
                    <LoadingProvider>
                      <GenieModeProvider>
                        <ReportGenerationProvider>
                          <LayoutComponent>{props.children}</LayoutComponent>
                        </ReportGenerationProvider>
                      </GenieModeProvider>
                    </LoadingProvider>
                  </ReportSubscriptionsProvider>
                </UserProvider>
                {/* </SocketProvider> */}
              </AuthProvider>
            </TitleProvider>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}

export default RootLayout
