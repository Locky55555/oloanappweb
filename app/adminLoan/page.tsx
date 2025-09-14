'use client'

import { useState, useEffect } from 'react'
import { supabase, Bill } from '@/lib/supabase'
import { Trash2, Plus, Eye, ExternalLink } from 'lucide-react'

export default function AdminDashboard() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    amount: '',
    due_date: '',
    lender: 'Lend Pro'
  })

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setBills(data || [])
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBill = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบบิลนี้?')) return
    
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchBills()
    } catch (error) {
      console.error('Error deleting bill:', error)
    }
  }

  const createBill = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([
          {
            customer_name: formData.customer_name,
            amount: parseFloat(formData.amount),
            due_date: formData.due_date || null,
            lender: formData.lender
          }
        ])
        .select()
      
      if (error) throw error
      
      setFormData({
        customer_name: '',
        amount: '',
        due_date: '',
        lender: 'Lend Pro'
      })
      setShowForm(false)
      fetchBills()
    } catch (error) {
      console.error('Error creating bill:', error)
    }
  }

  const createTestBill = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([
          {
            id: 'ea13618a-7738-4d9e-8ff6-e159f0809cc2',
            customer_name: 'ลูกค้าทดสอบ',
            amount: 15000,
            due_date: '2024-12-31',
            lender: 'Lend Pro'
          }
        ])
        .select()
      
      if (error) throw error
      
      alert('สร้างข้อมูลทดสอบสำเร็จ!')
      fetchBills()
    } catch (error) {
      console.error('Error creating test bill:', error)
      alert('เกิดข้อผิดพลาด: ' + (error as any).message)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด กรุณารอสักครู่...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">จัดการบิลเงินกู้</h1>
          <div className="flex gap-2">
            <button
              onClick={createTestBill}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              สร้างข้อมูลทดสอบ
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              เพิ่มบิลใหม่
            </button>
          </div>
        </div>

          {showForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">สร้างบิลใหม่</h2>
              <form onSubmit={createBill} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อลูกค้า
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนเงิน (บาท)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันครบกำหนด
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ผู้ให้กู้
                  </label>
                  <input
                    type="text"
                    value={formData.lender}
                    onChange={(e) => setFormData({...formData, lender: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="กรอกชื่อผู้ให้กู้"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    สร้างบิล
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ชื่อลูกค้า</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">จำนวนเงิน</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">วันครบกำหนด</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ผู้ให้กู้</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">วันที่สร้าง</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{bill.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {formatAmount(bill.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {bill.due_date ? formatDate(bill.due_date) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{bill.lender}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(bill.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <a
                          href={`/customer/${bill.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                          title="ดูลิงก์"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={`/customer/${bill.id}`}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                          title="คัดลอกลิงก์"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {bills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ไม่มีข้อมูลบิล
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
