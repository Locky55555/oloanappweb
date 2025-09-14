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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ระบบแจ้งยอดชำระหนี้" />
        <meta property="og:description" content="ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า" />
        
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
