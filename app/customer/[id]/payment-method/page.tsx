'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Bill } from '@/lib/supabase'
import { Volume2 } from 'lucide-react'

export default function PaymentMethodPage() {
  const params = useParams()
  const router = useRouter()
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState('')

  const banks = [
    'ธนาคารกรุงเทพ',
    'ธนาคารกสิกรไทย',
    'ธนาคารไทยพาณิชย์',
    'ธนาคารกรุงไทย',
    'ธนาคารทหารไทยธนชาต',
    'ธนาคารกรุงศรีอยุธยา'
  ]

  useEffect(() => {
    if (params.id) {
      fetchBill(params.id as string)
    }
  }, [params.id])

  const fetchBill = async (id: string) => {
    let retryCount = 0
    const maxRetries = 3
    
    const attemptFetch = async (): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          console.error('Supabase error:', error)
          throw error
        }
        
        if (!data) {
          throw new Error('No bill data returned')
        }
        
        setBill(data)
        setAmount(data.amount.toString())
      } catch (error) {
        console.error(`Error fetching bill (attempt ${retryCount + 1}):`, error)
        
        if (retryCount < maxRetries) {
          retryCount++
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
          return attemptFetch()
        }
        
        setBill(null)
      } finally {
        setLoading(false)
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
    if (!selectedBank || !amount) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    
    // Store payment data in sessionStorage for next step
    sessionStorage.setItem('paymentAmount', amount)
    sessionStorage.setItem('selectedBank', selectedBank)
    
    router.push(`/customer/${params.id}/qr-payment`)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">ไม่พบข้อมูลบิล</p>
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

      {/* Warning Banner */}
      <div className="mx-4 mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start">
          <Volume2 className="text-orange-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-sm text-orange-800">
            ชำระตรงเวลา ยืมใหม่ปลดบล็อกจำนวนเงินที่สูงขึ้น และอันดับเครดิตก็ดีขึ้นด้วย
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <div className="mx-4 mt-6 space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            กรุณาใส่จำนวนเงินที่ชำระคืนของคุณ
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
          />
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            โปรดเลือกบัตรธนาคาร
          </label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">โปรดเลือกบัตรธนาคาร</option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!selectedBank || !amount}
          className={`w-full py-4 rounded-lg text-lg font-bold transition-colors ${
            selectedBank && amount
              ? 'bg-purple-300 text-white hover:bg-purple-400'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ขั้นตอนต่อไป
        </button>
      </div>

      {/* Add bottom padding */}
      <div className="h-8"></div>
    </div>
  )
}
