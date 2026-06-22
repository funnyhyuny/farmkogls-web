# FARMKO GLS 웹사이트

㈜팜코지엘에스(FARMKO GLS) 공식 웹사이트입니다. **백엔드 없는 순수 정적 사이트**(HTML/CSS/JS)로, 빌드 과정 없이 그대로 배포됩니다.

## 페이지 구성
| 파일 | 설명 |
|------|------|
| `index.html` | 메인 (회사 소개·사업분야 요약·선박 스케줄 부킹 강조) |
| `eservice.html` | E-Service — 선박 스케줄 안내 + KLNET PLISM 부킹 연결 |
| `company.html` | 회사소개 |
| `business.html` | 사업분야 |
| `center.html` | 부산신항 물류센터 |
| `esg.html` | 지속가능경영 |
| `pr.html` | 홍보센터 |
| `careers.html` | 인재채용 |
| `assets/` | 이미지, 공용 스타일(`sub.css`), 한/영 전환(`i18n.js`), 스케줄 데이터(`schedules.js`) |

## 선박 스케줄 수정
`assets/schedules.js` 의 `list` 배열만 수정하면 E-Service 스케줄 표·검색·집계가 한 번에 갱신됩니다. (작성법은 파일 상단 주석 참고)

## 로컬에서 보기
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 배포 (GitHub + Vercel)
정적 사이트라 **빌드 설정이 필요 없습니다.** GitHub 저장소에 연결된 Vercel이 `main` 브랜치에 푸시될 때마다 자동으로 전 세계에 배포합니다. 별도 서버·DB 없음.
