# OdeeLink - ระบบลิงก์แจ้งยอดชำระหนี้ลูกค้า

## 🎯 Overview
ระบบเว็บแอปพลิเคชันสำหรับสร้างลิงก์แจ้งยอดชำระหนี้ลูกค้า โดยใช้ Next.js + Supabase + Vercel

## 🚀 Features
- ✅ Admin Dashboard สำหรับจัดการบิล
- ✅ ระบบลิงก์ลูกค้า 3 ขั้นตอน
- ✅ Mobile-responsive UI/UX
- ✅ ไม่ต้องล็อกอิน (No Authentication)
- ✅ ฟรี 100% (Vercel Hobby + Supabase Free Tier)

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + Noto Sans Thai
- **Database**: Supabase PostgreSQL
- **Hosting**: Vercel
- **Icons**: Lucide React

## 📱 Routes
- `/` - หน้าแรก (Welcome to My World)
- `/adminLoan` - Admin Dashboard
- `/customer/[id]` - Step 1: ข้อมูลบิล
- `/customer/[id]/payment-method` - Step 2: เลือกวิธีชำระ
- `/customer/[id]/qr-payment` - Step 3: QR Payment

## 🗄 Database Schema
```sql
create table public.bills (
  id uuid default gen_random_uuid() primary key,
  customer_name text,
  amount numeric not null,
  due_date date,
  lender text,
  created_at timestamptz default now()
);
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://oetdtqsdllbnmpsvntnk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldGR0cXNkbGxibm1wc3ZudG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDk2MjIsImV4cCI6MjA3MzIyNTYyMn0.DD2OYmr3a4peJbZ-PKYQ75gU1ikz8T-QZiIYb1ufCns
```

### 3. Setup Supabase Database
Run the SQL commands in `supabase-schema.sql` in your Supabase SQL Editor.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm run build
```
Then deploy to Vercel with the same environment variables.

## 📋 Usage

### Admin Dashboard
1. Go to `/adminLoan`
2. Click "สร้างบิลใหม่" to create new bills
3. Use "ดูลิงก์" to view customer payment links
4. Use "ลบ" to delete bills

### Customer Flow
1. Customer receives link: `/customer/[bill-id]`
2. Step 1: View bill details → Click "ชำระเงินกู้"
3. Step 2: Enter amount & select bank → Click "ขั้นตอนต่อไป"
4. Step 3: Scan QR code to pay

## 🎨 UI/UX Features
- Mobile-first responsive design
- Thai language support with Noto Sans Thai font
- Gradient backgrounds and modern styling
- Collapsible sections for better UX
- Loading states with Thai text
- Bottom navigation bar
- QR code payment interface

## 🔒 Security Notes
- No authentication required (as per requirements)
- Row Level Security enabled on Supabase
- Environment variables for API keys
- Client-side only operations

## 📱 Mobile Compatibility
- iOS Safari ✅
- Android Chrome ✅
- All modern mobile browsers ✅
- WebView support ✅

## 💰 Cost
- **Vercel Hobby**: Free
- **Supabase Free Tier**: Free
- **Total Cost**: ฿0 per month

## 🚀 Deployment
Ready to deploy to Vercel with zero configuration needed!
