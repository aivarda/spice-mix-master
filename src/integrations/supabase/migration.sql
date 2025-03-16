
-- Create production_status table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.production_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  process TEXT NOT NULL,
  raw_material_id UUID NOT NULL REFERENCES public.raw_materials(id),
  opening_balance NUMERIC NOT NULL DEFAULT 0,
  assigned NUMERIC NOT NULL DEFAULT 0,
  completed NUMERIC NOT NULL DEFAULT 0,
  wastage NUMERIC NOT NULL DEFAULT 0,
  pending NUMERIC NOT NULL DEFAULT 0,
  adjustment NUMERIC NOT NULL DEFAULT 0,
  closing_balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on month, year, process and raw_material_id
ALTER TABLE public.production_status
DROP CONSTRAINT IF EXISTS production_status_unique_month_year_process_material;

ALTER TABLE public.production_status
ADD CONSTRAINT production_status_unique_month_year_process_material
UNIQUE (month, year, process, raw_material_id);
