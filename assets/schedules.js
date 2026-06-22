/* ============================================================
   FARMKO GLS — 선박 스케줄 단일 원본 (Single Source of Truth)
   ------------------------------------------------------------
   ▸ 이 파일 하나만 수정하면 E-Service 전체(스케줄 표·검색·집계)가 바뀝니다.
   ▸ 출처 기준: https://farmkogls.plism.com/svc/schedule
     PLISM 스케줄 화면의 내용을 보고 아래 list 를 갱신하세요.
     (PLISM 은 로그인·자바스크립트 기반이라 자동 수집은 불가 → 수기 갱신)

   ── 한 항차(row) 작성법 ──────────────────────────────────────
   {
     carrier: "ESL",                // 선사 코드 (아래 carriers 목록)
     vessel:  "EMIRATES PIONEER",   // 선박명(모선)
     voyage:  "0125E",              // 항차
     pol:     "KRPUS",              // 선적항 (아래 ports 목록, UN/LOCODE)
     pod:     "AEDXB",              // 양하항
     space:   "OK",                 // 잔여: "OK"(여유) | "LOW"(임박)
     cy:      "PNC 부산신항",        // CY/반입지(터미널)

     // ▼ 날짜는 두 가지 방식 중 하나 (둘 다 있으면 절대일자 우선)
     // (A) 절대일자 — PLISM 실제 일자를 그대로 (권장)
     etd:        "2026-07-01",          // 출항예정 (YYYY-MM-DD)
     eta:        "2026-07-19",          // 도착예정
     docClose:   "2026-06-29T17:00",    // 서류마감 (YYYY-MM-DDTHH:mm)
     cargoClose: "2026-06-30T12:00",    // 반입마감
     // (B) 상대일자 — 데모/예시용. 오늘 기준으로 자동 계산되어 항상 최신처럼 보임
     //     off: 오늘+N일 = ETD,  tr: ETD+N일 = ETA  (docClose=ETD-2일, cargoClose=ETD-1일 자동)
     off: 5, tr: 18
   }
   ※ 아래 예시 list 는 (B) 상대일자로 되어 있어 날짜가 항상 미래로 표시됩니다.
     PLISM 실제 스케줄을 넣을 때는 (A) 절대일자(etd/eta/docClose/cargoClose)로 교체하세요.
   ============================================================ */
window.FARMKO_SCHEDULES = {
  source: "farmkogls.plism.com/svc/schedule",
  updatedAt: "2026-06-22",   // 마지막 갱신일 (참고용)

  // 항구 마스터 (검색 드롭다운 + 표 표기에 사용)
  ports: [
    { code: "KRPUS", ko: "부산" },        { code: "KRINC", ko: "인천" },
    { code: "KRKAN", ko: "광양" },        { code: "KRUSN", ko: "울산" },
    { code: "AEDXB", ko: "두바이" },      { code: "AEJEA", ko: "제벨알리" },
    { code: "NLRTM", ko: "로테르담" },    { code: "DEHAM", ko: "함부르크" },
    { code: "USNYC", ko: "뉴욕" },        { code: "USLAX", ko: "로스앤젤레스" },
    { code: "CNSHA", ko: "상하이" },      { code: "SGSIN", ko: "싱가포르" },
    { code: "INMAA", ko: "첸나이" }
  ],

  // 선사 마스터
  carriers: [
    { code: "ESL",  name: "Emirates Shipping Line" },
    { code: "ESHP", name: "e-Shipping Line" },
    { code: "MSC",  name: "MSC" },
    { code: "ONE",  name: "Ocean Network Express" },
    { code: "HMM",  name: "HMM" }
  ],

  // 스케줄 목록 (PLISM /svc/schedule 기준으로 갱신)
  list: [
    { carrier: "ESL",  vessel: "EMIRATES PIONEER", voyage: "0125E", pol: "KRPUS", pod: "AEDXB", space: "OK",  cy: "PNC 부산신항", off: 5,  tr: 18 },
    { carrier: "ESL",  vessel: "EMIRATES VICTORY", voyage: "0127E", pol: "KRPUS", pod: "AEDXB", space: "LOW", cy: "PNC 부산신항", off: 12, tr: 18 },
    { carrier: "MSC",  vessel: "MSC AURORA",       voyage: "114W",  pol: "KRPUS", pod: "NLRTM", space: "OK",  cy: "PNC 부산신항", off: 2,  tr: 32 },
    { carrier: "ONE",  vessel: "ONE COLUMBA",      voyage: "088E",  pol: "KRPUS", pod: "USLAX", space: "OK",  cy: "PNC 부산신항", off: 7,  tr: 14 },
    { carrier: "HMM",  vessel: "HMM JEJU",         voyage: "2206S", pol: "KRPUS", pod: "CNSHA", space: "OK",  cy: "PNC 부산신항", off: 3,  tr: 3  },
    { carrier: "HMM",  vessel: "HMM NURI",         voyage: "2210S", pol: "KRINC", pod: "CNSHA", space: "LOW", cy: "ICT 인천",     off: 4,  tr: 2  },
    { carrier: "MSC",  vessel: "MSC TESSA",        voyage: "118W",  pol: "KRPUS", pod: "DEHAM", space: "OK",  cy: "PNC 부산신항", off: 9,  tr: 34 },
    { carrier: "ESHP", vessel: "E-SHIPPING STAR",  voyage: "0042W", pol: "KRKAN", pod: "INMAA", space: "OK",  cy: "광양항 GIT",   off: 6,  tr: 21 },
    { carrier: "ONE",  vessel: "ONE TRIBUTE",      voyage: "091S",  pol: "KRPUS", pod: "SGSIN", space: "LOW", cy: "PNC 부산신항", off: 1,  tr: 6  },
    { carrier: "MSC",  vessel: "MSC LORETO",       voyage: "212W",  pol: "KRPUS", pod: "USNYC", space: "OK",  cy: "PNC 부산신항", off: 14, tr: 30 }
  ]
};
