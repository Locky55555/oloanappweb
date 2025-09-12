-- Drop existing constraints and table if they exist
drop policy if exists "Allow all operations on bills" on public.bills;
drop table if exists public.bills cascade;

-- Create bills table for loan payment system
create table public.bills (
  id uuid default gen_random_uuid() primary key,
  customer_name text,
  amount numeric not null,
  due_date date,
  lender text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.bills enable row level security;

-- Create policy to allow all operations (since no authentication required)
create policy "Allow all operations on bills" on public.bills
  for all using (true);

-- Insert sample data
insert into public.bills (customer_name, amount, due_date, lender) values
  ('นายสมชาย ใจดี', 10000.00, '2025-09-06', 'Lend Pro'),
  ('นางสาวมาลี รักดี', 15000.00, '2025-09-10', 'Quick Cash'),
  ('นายประยุทธ์ สุขใจ', 8000.00, '2025-09-08', 'Fast Money');
