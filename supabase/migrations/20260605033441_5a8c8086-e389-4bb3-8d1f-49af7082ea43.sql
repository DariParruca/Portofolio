
CREATE TABLE public.cv_downloads (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone not null default now(),
  user_agent text,
  referrer text
);
GRANT INSERT ON public.cv_downloads TO anon, authenticated;
GRANT ALL ON public.cv_downloads TO service_role;
ALTER TABLE public.cv_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert cv download" ON public.cv_downloads
  FOR INSERT TO anon, authenticated WITH CHECK (true);
