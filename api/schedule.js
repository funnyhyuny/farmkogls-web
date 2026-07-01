/* ============================================================
   FARMKO GLS — E-Service 선박 스케줄 프록시 (Vercel Serverless)
   ------------------------------------------------------------
   ▸ 브라우저(같은 도메인) → 이 함수 → PLISM getLineSchCal
     · 브라우저는 자기 도메인(/api/schedule)만 호출 → CSP(connect-src 'self') OK, CORS 무관
     · 이 함수는 PLISM 을 서버-대-서버로 호출 → 브라우저 정책(CORS/CSP) 영향 없음
   ▸ PLISM(/svc/schedule) 화면은 로그인·React 렌더라 HTML 로는 못 읽지만,
     백엔드 스케줄 API(/api/getLineSchCal)는 인증 없이 열려 있어 FARMKO(FAG) 스케줄을 받아올 수 있음.
   ▸ 반환: 정규화된 다가오는 항차 목록 + 드롭다운용 항구 목록.
   ============================================================ */

const PLISM_API = 'https://farmkogls.plism.com/api/getLineSchCal';
const LINE_CODE = 'FAG'; // 팜코지엘에스 (getMainInfo keyword=farmkogls 로 확인)
const WINDOW = '12 week'; // 조회 윈도우 (현재 전체 FAG 스케줄이 이 안에 들어옴)

function pad(n) { return String(n).padStart(2, '0'); }

// "YYYYMMDDHHmm" 또는 "YYYYMMDD" → "YYYY-MM-DD HH:mm"
function fmtCompact(s) {
  if (!s) return '';
  s = String(s);
  const base = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  return s.length >= 12 ? `${base} ${s.slice(8, 10)}:${s.slice(10, 12)}` : base;
}
// "YYYYMMDD..." → 비교용 정수 (YYYYMMDD)
function dateKey(s) { return s ? (parseInt(String(s).slice(0, 8), 10) || 0) : 0; }

module.exports = async function handler(req, res) {
  try {
    const now = new Date();
    const monthStart = `${now.getFullYear()}${pad(now.getMonth() + 1)}01`;
    const todayKey = parseInt(`${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`, 10);

    // ── PLISM 호출 (타임아웃 12s) ─────────────────────────────
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    let rows;
    try {
      const r = await fetch(PLISM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line_code: LINE_CODE, eta: monthStart, week: WINDOW, startport: [], endport: '' }),
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error('PLISM HTTP ' + r.status);
      rows = await r.json();
    } finally {
      clearTimeout(timer);
    }
    if (!Array.isArray(rows)) rows = [];

    // ── FAG 만 · 정확 중복 제거 · 이미 출항한 항차 제외 · 정규화 ──
    const seen = new Set();
    const list = [];
    for (const x of rows) {
      if (x.plism_line_code !== LINE_CODE) continue;
      const etd = x.sch_etd || '';
      if (dateKey(etd) && dateKey(etd) < todayKey) continue; // 이미 출항
      const key = [x.sch_vessel_name, x.voyage_no, x.sch_pol, x.sch_pod, etd].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      list.push({
        carrier: x.carrier_knm || '팜코지엘에스',
        vessel: x.sch_vessel_name || x.vsl_name || '',
        voyage: x.voyage_no || x.sch_vessel_voyage || '',
        pol: x.sch_pol || x.start_port || '',
        polName: x.sch_pol_name || '',
        pod: x.sch_pod || x.end_port || '',
        podName: x.sch_pod_name || '',
        etd: fmtCompact(x.sch_etd),
        eta: fmtCompact(x.sch_eta),
        tt: x.tt || '',
        docClose: (x.doc_closing_date || '').slice(0, 16),
        cargoClose: (x.cargo_closing_date || '').slice(0, 16),
        bkgClose: (x.booking_closing_date || '').slice(0, 16),
        bookable: x.booking_yn === 'Y',
        color: x.sch_color || '',
        remark: x.remark || '',
        _etd: dateKey(etd),
      });
    }
    list.sort((a, b) => (a._etd - b._etd) || a.vessel.localeCompare(b.vessel) || a.pod.localeCompare(b.pod));
    list.forEach((o) => { delete o._etd; });

    // ── 드롭다운용 항구 목록 (등장 순서 무관, 코드 정렬) ──
    const polMap = {}, podMap = {};
    for (const o of list) { if (o.pol) polMap[o.pol] = o.polName; if (o.pod) podMap[o.pod] = o.podName; }
    const toPorts = (m) => Object.keys(m).sort().map((code) => ({ code, name: m[code] }));

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    // CDN 30분 캐시 + 1시간 stale-while-revalidate → 사실상 실시간, PLISM 부하 최소화
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json({
      ok: true,
      source: 'farmkogls.plism.com/svc/schedule',
      line: LINE_CODE,
      updatedAt: now.toISOString(),
      count: list.length,
      pols: toPorts(polMap),
      pods: toPorts(podMap),
      list,
    });
  } catch (err) {
    // 상세 오류는 서버 로그로만 — 클라이언트엔 일반 메시지만 노출(정보 노출 방지)
    console.error('[schedule] upstream error:', (err && err.message) || err);
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({
      ok: false,
      error: '스케줄을 불러오지 못했습니다.',
    });
  }
};
