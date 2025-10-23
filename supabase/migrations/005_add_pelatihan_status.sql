-- Migration: 005_add_pelatihan_status.sql
-- Purpose: Add an enum type and a `status` column to the `pelatihan` table.
-- Notes: Run this in Supabase SQL editor. Review before running on production.

BEGIN;

-- 1) Create enum type for pelatihan status (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pelatihan_status') THEN
        CREATE TYPE public.pelatihan_status AS ENUM ('AKAN_DATANG', 'SELESAI');
    END IF;
END$$;

-- 2) Add status column to pelatihan table with default 'AKAN_DATANG'
ALTER TABLE public.pelatihan
  ADD COLUMN IF NOT EXISTS status public.pelatihan_status NOT NULL DEFAULT 'AKAN_DATANG';

-- 3) Backfill: mark past trainings as SELESAI
UPDATE public.pelatihan
SET status = 'SELESAI'
WHERE tanggal_pelaksanaan < NOW()::date;

-- 4) Add an index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_pelatihan_status ON public.pelatihan (status);

-- 5) Optional: Add a trigger to automatically set status to SELESAI once tanggal_pelaksanaan passes (daily job recommended)
-- We'll create a helper function, but not schedule it here. You can run an occasional query/job to flip statuses.

-- function to mark finished pelatihan
CREATE OR REPLACE FUNCTION public.mark_pelatihan_selesai()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.pelatihan
  SET status = 'SELESAI'
  WHERE status = 'AKAN_DATANG' AND tanggal_pelaksanaan < NOW()::date;
END;
$$;

COMMIT;

-- USAGE:
-- 1) Open Supabase -> SQL editor
-- 2) Paste the whole file and run
-- 3) To run scheduled updates automatically, consider setting up a CRON job (external) or a Supabase Edge Function that invokes `SELECT public.mark_pelatihan_selesai();` daily.
