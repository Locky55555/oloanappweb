import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oetdtqsdllbnmpsvntnk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldGR0cXNkbGxibm1wc3ZudG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDk2MjIsImV4cCI6MjA3MzIyNTYyMn0.DD2OYmr3a4peJbZ-PKYQ75gU1ikz8T-QZiIYb1ufCns'

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Bill = {
  id: string
  customer_name: string | null
  amount: number
  due_date: string | null
  lender: string | null
  created_at: string
}
