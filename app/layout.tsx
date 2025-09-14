import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ระบบแจ้งยอดชำระหนี้',
  description: 'ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-noto-thai bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
