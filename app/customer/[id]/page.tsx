'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Bill } from '@/lib/supabase'
import { ChevronDown, ChevronUp, Clipboard, FileText, Headphones } from 'lucide-react'

export default function CustomerBillPage() {
  const params = useParams()
  const router = useRouter()
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoanDetails, setShowLoanDetails] = useState(false)
  const [showQuotaDetails, setShowQuotaDetails] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchBill(params.id as string)
    }
  }, [params.id])

  // Add URL validation for social media crawlers
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const fbclid = urlParams.get('fbclid')
    const gclid = urlParams.get('gclid')
    
    // If coming from social media, ensure proper loading
    if (fbclid || gclid || document.referrer.includes('facebook') || 
        document.referrer.includes('whatsapp') || document.referrer.includes('line')) {
      // Add extra delay for social media browsers
      setTimeout(() => {
        if (!bill && params.id) {
          fetchBill(params.id as string)
        }
      }, 500)
    }
  }, [])

  const fetchBill = async (id: string) => {
    let retryCount = 0
    const maxRetries = 5 // Increase retries for social media browsers
    
    const attemptFetch = async (): Promise<void> => {
      try {
        // Longer delay for social media browsers
        const delay = retryCount === 0 ? 200 : 500 * retryCount
        await new Promise(resolve => setTimeout(resolve, delay))
        
        // Validate ID format
        if (!id || id.length < 10) {
          throw new Error('Invalid bill ID format')
        }
        
        console.log(`Attempting to fetch bill with ID: ${id}`)
        
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          console.error('Supabase error:', error)
          // Check if it's a network error vs data not found
          if (error.code === 'PGRST116') {
            throw new Error('Bill not found')
          }
          throw error
        }
        
        if (!data) {
          throw new Error('No bill data returned')
        }
        
        console.log('Bill data loaded successfully:', data)
        setBill(data)
      } catch (error) {
        console.error(`Error fetching bill (attempt ${retryCount + 1}):`, error)
        
        if (retryCount < maxRetries) {
          retryCount++
          // Longer exponential backoff for social media browsers
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount))
          return attemptFetch()
        }
        
        // Final attempt failed
        console.error('All retry attempts failed')
        setBill(null)
      } finally {
        if (retryCount >= maxRetries || bill) {
          setLoading(false)
        }
      }
    }
    
    await attemptFetch()
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleNext = () => {
    router.push(`/customer/${params.id}/payment-method`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด กรุณารอสักครู่...</p>
        </div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              ไม่พบข้อมูลบิล
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              ไม่สามารถโหลดข้อมูลบิลได้ กรุณาตรวจสอบลิงก์หรือลองใหม่อีกครั้ง
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setLoading(true)
                  setBill(null)
                  if (params.id) {
                    fetchBill(params.id as string)
                  }
                }}
                className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600 transition-colors"
              >
                โหลดใหม่
              </button>
              <p className="text-xs text-gray-500 text-center">
                หากมาจาก WhatsApp/Facebook/LINE กรุณาเปิดในเบราว์เซอร์
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const daysUntilDue = bill.due_date ? getDaysUntilDue(bill.due_date) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Amount to Pay */}
      <div className="bg-gradient-primary mx-4 mt-4 rounded-xl p-5 text-center text-white">
        <p className="text-sm font-medium mb-2">ยอดที่ต้องชำระ</p>
        <p className="text-3xl font-bold mb-2">฿ {formatAmount(bill.amount)}</p>
        {bill.due_date && (
          <>
            <p className="text-sm mb-3">วันที่ครบกำหนด: {formatDate(bill.due_date)}</p>
            <div className="inline-block bg-orange-500 px-4 py-2 rounded-full">
              <span className="text-sm font-bold">
                อีก {daysUntilDue} วันครบกำหนด
              </span>
            </div>
          </>
        )}
      </div>

      {/* Loan Information Section */}
      <div className="mx-4 mt-4 bg-white rounded-lg p-4">
        <button
          onClick={() => setShowLoanDetails(!showLoanDetails)}
          className="w-full flex justify-between items-center"
        >
          <span className="text-sm font-medium text-gray-900">ข้อมูลเงินกู้</span>
          {showLoanDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {showLoanDetails && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">กลไกปล่อยเงินกู้</span>
              <span className="text-sm text-gray-900">{bill.lender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ยอดเงินที่สมัครกู้</span>
              <span className="text-sm text-gray-900">฿ {formatAmount(bill.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">วันครบกำหนด</span>
              <span className="text-sm text-gray-900">
                {bill.due_date ? formatDate(bill.due_date) : '-'}
              </span>
            </div>
            <div className="text-right">
              <a href="#" className="text-xs text-purple-500 underline">
                หลักฐานการโอนเงิน
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Quota Section */}
      <div className="mx-4 mt-4 bg-white rounded-lg p-4">
        <button
          onClick={() => setShowQuotaDetails(!showQuotaDetails)}
          className="w-full flex justify-between items-center"
        >
          <span className="text-sm font-medium text-gray-900">ชำระเงินกู้คืน วงเงินเพิ่ม</span>
          {showQuotaDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {showQuotaDetails && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                <span className="text-sm text-gray-600">โควต้ารอบที่แล้ว</span>
              </div>
              <span className="text-sm text-gray-900">฿ 5,000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-primary-500 border-2 border-primary-500 mr-3"></div>
                <span className="text-sm text-gray-600">โควต้ารอบนี้</span>
              </div>
              <span className="text-sm text-gray-900">฿ {formatAmount(bill.amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                <span className="text-sm text-gray-600">โควต้ารอบต่อไป</span>
              </div>
              <span className="text-sm text-gray-900">฿ 20,000</span>
            </div>
            <p className="text-xs text-red-500 mt-2">
              ชำระตรงเวลา ขอกู้ใหม่ได้ ฿ 50,000
            </p>
          </div>
        )}
      </div>

      {/* Pay Button */}
      <div className="mx-4 mt-6">
        <button
          onClick={handleNext}
          className="w-full bg-primary-500 text-white py-4 rounded-lg text-lg font-bold hover:bg-primary-600 transition-colors"
        >
          ชำระเงินกู้
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-14">
        <div className="flex justify-around items-center h-full">
          <div className="flex flex-col items-center">
            <Clipboard size={20} className="text-primary-500" />
            <span className="text-xs text-primary-500 mt-1">คำสั่ง</span>
          </div>
          <div className="flex flex-col items-center">
            <FileText size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">ความคืบหน้าการชำระ</span>
          </div>
          <div className="flex flex-col items-center">
            <Headphones size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">การบริการลูกค้า</span>
          </div>
        </div>
      </div>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-16"></div>
    </div>
  )
}
