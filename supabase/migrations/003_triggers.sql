-- 003_triggers.sql
-- Optional triggers: recalc pelatihan totals and keep updated_at current

-- 1) FUNCTION to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_timestamp()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- attach to tables which have updated_at
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='pelatihan' AND column_name='updated_at') THEN
    DROP TRIGGER IF EXISTS trg_pelatihan_set_timestamp ON public.pelatihan;
    CREATE TRIGGER trg_pelatihan_set_timestamp
    BEFORE UPDATE ON public.pelatihan
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='peserta' AND column_name='updated_at') THEN
    DROP TRIGGER IF EXISTS trg_peserta_set_timestamp ON public.peserta;
    CREATE TRIGGER trg_peserta_set_timestamp
    BEFORE UPDATE ON public.peserta
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='pengeluaran' AND column_name='updated_at') THEN
    DROP TRIGGER IF EXISTS trg_pengeluaran_set_timestamp ON public.pengeluaran;
    CREATE TRIGGER trg_pengeluaran_set_timestamp
    BEFORE UPDATE ON public.pengeluaran
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='karyawan' AND column_name='updated_at') THEN
    DROP TRIGGER IF EXISTS trg_karyawan_set_timestamp ON public.karyawan;
    CREATE TRIGGER trg_karyawan_set_timestamp
    BEFORE UPDATE ON public.karyawan
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;
END$$;

-- 2) Optional: recalc pelatihan totals (only if you added stored columns jumlah_peserta/total_pendapatan)
-- Provide function, but do not auto-create triggers unless you decide to store values.
CREATE OR REPLACE FUNCTION public.recalc_pelatihan_totals(p_pelatihan_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.pelatihan p
  SET
    -- ensure these columns exist before running
    jumlah_peserta = COALESCE(sub.count_peserta,0),
    total_pendapatan = COALESCE(sub.total_pendapatan,0),
    updated_at = now()
  FROM (
    SELECT
      pelatihan_id,
      COUNT(DISTINCT pes.id) AS count_peserta,
      COALESCE(SUM(pb.jumlah),0) AS total_pendapatan
    FROM public.peserta pes
    LEFT JOIN public.pembayaran pb ON pb.peserta_id = pes.id
    WHERE pes.pelatihan_id = p_pelatihan_id
    GROUP BY pelatihan_id
  ) sub
  WHERE p.id = p_pelatihan_id;
END;
$$;

-- Example trigger functions (commented) - uncomment if you add stored columns
--
-- CREATE OR REPLACE FUNCTION trg_peserta_after_change()
-- RETURNS trigger LANGUAGE plpgsql AS $$
-- BEGIN
--   PERFORM public.recalc_pelatihan_totals(NEW.pelatihan_id);
--   RETURN NEW;
-- END;
-- $$;
--
-- CREATE TRIGGER tr_peserta_after_insert
-- AFTER INSERT ON public.peserta
-- FOR EACH ROW EXECUTE FUNCTION trg_peserta_after_change();
--
-- CREATE TRIGGER tr_peserta_after_update
-- AFTER UPDATE ON public.peserta
-- FOR EACH ROW EXECUTE FUNCTION trg_peserta_after_change();
--
-- CREATE TRIGGER tr_peserta_after_delete
-- AFTER DELETE ON public.peserta
-- FOR EACH ROW EXECUTE FUNCTION public.recalc_pelatihan_totals(OLD.pelatihan_id);
--
-- CREATE OR REPLACE FUNCTION trg_pembayaran_after_change()
-- RETURNS trigger LANGUAGE plpgsql AS $$
-- DECLARE
--   pel_id uuid;
-- BEGIN
--   IF TG_OP = 'INSERT' THEN
--     SELECT pelatihan_id INTO pel_id FROM public.peserta WHERE id = NEW.peserta_id;
--     PERFORM public.recalc_pelatihan_totals(pel_id);
--     RETURN NEW;
--   ELSIF TG_OP = 'UPDATE' THEN
--     SELECT pelatihan_id INTO pel_id FROM public.peserta WHERE id = NEW.peserta_id;
--     PERFORM public.recalc_pelatihan_totals(pel_id);
--     RETURN NEW;
--   ELSIF TG_OP = 'DELETE' THEN
--     SELECT pelatihan_id INTO pel_id FROM public.peserta WHERE id = OLD.peserta_id;
--     PERFORM public.recalc_pelatihan_totals(pel_id);
--     RETURN OLD;
--   END IF;
-- END;
-- $$;
--
-- CREATE TRIGGER tr_pembayaran_after_insert
-- AFTER INSERT ON public.pembayaran
-- FOR EACH ROW EXECUTE FUNCTION trg_pembayaran_after_change();
--
-- CREATE TRIGGER tr_pembayaran_after_update
-- AFTER UPDATE ON public.pembayaran
-- FOR EACH ROW EXECUTE FUNCTION trg_pembayaran_after_change();
--
-- CREATE TRIGGER tr_pembayaran_after_delete
-- AFTER DELETE ON public.pembayaran
-- FOR EACH ROW EXECUTE FUNCTION trg_pembayaran_after_change();

