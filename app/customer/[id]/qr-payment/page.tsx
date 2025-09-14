'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase, Bill } from '@/lib/supabase'
import Image from 'next/image'

export default function QRPaymentPage() {
  const params = useParams()
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchBill(params.id as string)
    }
    
    // Get payment data from sessionStorage
    const amount = sessionStorage.getItem('paymentAmount')
    const bank = sessionStorage.getItem('selectedBank')
    if (amount) setPaymentAmount(amount)
    if (bank) setSelectedBank(bank)
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

  const generateTransactionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += '-'
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
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
  const transactionId = generateTransactionId()
  const displayAmount = paymentAmount || bill.amount.toString()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Messages */}
      <div className="mx-4 mt-4 space-y-2">
        <p className="text-red-500 text-sm font-medium text-center">
          หน้านี้ชำระได้เพียงครั้งเดียว
        </p>
        <p className="text-green-600 text-sm font-bold text-center">
          *** แสกนคิวอาร์โค้ดเพื่อชำระเงิน ***
        </p>
      </div>

      {/* QR Code Section */}
      <div className="mx-4 mt-6 bg-white rounded-lg p-6">
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="w-full max-w-sm mx-auto bg-white rounded-lg p-6 shadow-sm">
            <Image
              src="/images/qrcode.jpg"
              alt="QR Code สำหรับชำระเงิน"
              width={400}
              height={400}
              className="w-full h-auto object-contain rounded-lg"
              priority
            />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            QR Code ที่จะแสกนเพื่อชำระเงิน
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mx-4 mt-4 bg-white rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">หมายเลขธุรกรรม:</span>
          <span className="text-sm text-gray-900 font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">จำนวนเงิน:</span>
          <span className="text-sm text-gray-900 font-bold">
            ฿ {formatAmount(parseFloat(displayAmount))}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">หมายเลขพร้อมเพย์:</span>
          <span className="text-sm text-gray-900">095***9346</span>
        </div>
        {selectedBank && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">ธนาคารที่เลือก:</span>
            <span className="text-sm text-gray-900">{selectedBank}</span>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="mx-4 mt-4 text-center">
        <p className="text-xs text-blue-600">
          หมายเหตุ: หน้านี้จ่ายได้เพียงครั้งเดียว
        </p>
      </div>

      {/* Add bottom padding */}
      <div className="h-8"></div>
    </div>
  )
}
