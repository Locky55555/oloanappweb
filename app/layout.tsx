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
        
        {/* Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="th_TH" />
        <meta property="og:site_name" content="ระบบแจ้งยอดชำระหนี้" />
        <meta name="twitter:card" content="summary" />
        
        {/* WhatsApp specific */}
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        
        {/* Prevent caching for dynamic content */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="font-noto-thai bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
