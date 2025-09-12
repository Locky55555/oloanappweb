-- Complete database reset script
-- Run this in Supabase SQL Editor to fix constraint issues

-- Step 1: Drop all existing policies and constraints
DO $$ 
BEGIN
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "Allow all operations on bills" ON public.bills;
    
    -- Drop table with cascade to remove all dependencies
    DROP TABLE IF EXISTS public.bills CASCADE;
    
EXCEPTION WHEN OTHERS THEN
    -- Continue if errors occur
    NULL;
END $$;

-- Step 2: Create fresh bills table
CREATE TABLE public.bills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text,
  amount numeric NOT NULL,
  due_date date,
  lender text,
  created_at timestamptz DEFAULT now()
);

-- Step 3: Enable RLS
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy
CREATE POLICY "Allow all operations on bills" ON public.bills
  FOR ALL USING (true);

-- Step 5: Insert sample data
INSERT INTO public.bills (customer_name, amount, due_date, lender) VALUES
  ('นายสมชาย ใจดี', 10000.00, '2025-09-06', 'Lend Pro'),
  ('นางสาวมาลี รักดี', 15000.00, '2025-09-10', 'Quick Cash'),
  ('นายประยุทธ์ สุขใจ', 8000.00, '2025-09-08', 'Fast Money');

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bills' AND table_schema = 'public'
ORDER BY ordinal_position;
