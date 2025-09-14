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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Enhanced Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ระบบแจ้งยอดชำระหนี้" />
        <meta property="og:locale" content="th_TH" />
        <meta property="og:title" content="ระบบแจ้งยอดชำระหนี้" />
        <meta property="og:description" content="ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="ระบบแจ้งยอดชำระหนี้" />
        <meta name="twitter:description" content="ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า" />
        
        {/* WhatsApp/LINE specific */}
        <meta property="og:url" content="https://oloanappweb.vercel.app" />
        
        {/* Cache Control - Less aggressive for social media crawlers */}
        <meta httpEquiv="Cache-Control" content="public, max-age=300" />
        
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-noto-thai bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
