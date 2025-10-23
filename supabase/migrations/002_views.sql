-- 002_views.sql
-- Views for summaries and reports

-- Pelatihan summary view: jumlah peserta & total pendapatan per pelatihan
CREATE OR REPLACE VIEW public.pelatihan_summary AS
SELECT
  p.id,
  p.nama_pelatihan,
  p.kategori_pelatihan,
  p.batch_pelatihan,
  p.tanggal_pelaksanaan,
  p.harga_pelatihan,
  COALESCE(cnt.jumlah_peserta,0) AS jumlah_peserta,
  COALESCE(total.total_pendapatan,0) AS total_pendapatan
FROM public.pelatihan p
LEFT JOIN (
  SELECT pelatihan_id, COUNT(*) AS jumlah_peserta
  FROM public.peserta
  GROUP BY pelatihan_id
) cnt ON cnt.pelatihan_id = p.id
LEFT JOIN (
  SELECT pe.pelatihan_id, SUM(pb.jumlah) AS total_pendapatan
  FROM public.pembayaran pb
  JOIN public.peserta pe ON pe.id = pb.peserta_id
  GROUP BY pe.pelatihan_id
) total ON total.pelatihan_id = p.id;

-- Monthly financial report view: pendapatan per month, pengeluaran per month
CREATE OR REPLACE VIEW public.financial_monthly AS
SELECT
  date_trunc('month', pb.tanggal_pembayaran) AS month,
  SUM(pb.jumlah) AS total_pendapatan
FROM public.pembayaran pb
GROUP BY 1
ORDER BY 1;

CREATE OR REPLACE VIEW public.expenses_monthly AS
SELECT
  date_trunc('month', p.tanggal_pengeluaran) AS month,
  SUM(p.jumlah) AS total_pengeluaran
FROM public.pengeluaran p
GROUP BY 1
ORDER BY 1;

-- Combined monthly report (left join months)
CREATE OR REPLACE VIEW public.monthly_report AS
SELECT
  COALESCE(f.month, e.month) AS month,
  COALESCE(f.total_pendapatan,0) AS total_pendapatan,
  COALESCE(e.total_pengeluaran,0) AS total_pengeluaran,
  COALESCE(f.total_pendapatan,0) - COALESCE(e.total_pengeluaran,0) AS saldo
FROM public.financial_monthly f
FULL OUTER JOIN public.expenses_monthly e ON f.month = e.month
ORDER BY month;
