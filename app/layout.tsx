import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OdeeLink - ระบบแจ้งยอดชำระหนี้',
  description: 'ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-noto-thai bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
