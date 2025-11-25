CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sector TEXT NOT NULL,
  industry TEXT NOT NULL,
  age_range TEXT NOT NULL,
  city TEXT NOT NULL,
  salary NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  net_worth NUMERIC NOT NULL,
  rent NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_metrics_user_id ON public.user_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_metrics_sector ON public.user_metrics(sector);
CREATE INDEX IF NOT EXISTS idx_user_metrics_created_at ON public.user_metrics(created_at);

CREATE TABLE IF NOT EXISTS public.global_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector TEXT NOT NULL,
  industry TEXT NOT NULL,
  age_range TEXT NOT NULL,
  city TEXT NOT NULL,
  salary NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  net_worth NUMERIC NOT NULL,
  rent NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_global_metrics_sector ON public.global_metrics(sector);
CREATE INDEX IF NOT EXISTS idx_global_metrics_age_range ON public.global_metrics(age_range);
CREATE INDEX IF NOT EXISTS idx_global_metrics_city ON public.global_metrics(city);
