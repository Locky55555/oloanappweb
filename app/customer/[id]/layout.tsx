import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: bill } = await supabase
      .from('bills')
      .select('*')
      .eq('id', params.id)
      .single()

    if (bill) {
      const amount = new Intl.NumberFormat('th-TH').format(bill.amount)
      const title = `ชำระเงินกู้ ฿${amount} - ${bill.customer_name || 'ลูกค้า'}`
      const description = `ยอดที่ต้องชำระ ฿${amount} จาก ${bill.lender || 'ผู้ให้กู้'}`
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'website',
          locale: 'th_TH',
          siteName: 'ระบบแจ้งยอดชำระหนี้',
        },
        twitter: {
          card: 'summary',
          title,
          description,
        },
        other: {
          'og:image:width': '1200',
          'og:image:height': '630',
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: 'ระบบแจ้งยอดชำระหนี้',
    description: 'ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า',
    openGraph: {
      title: 'ระบบแจ้งยอดชำระหนี้',
      description: 'ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า',
      type: 'website',
      locale: 'th_TH',
    }
  }
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
