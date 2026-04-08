# Character Map — CLAUDE.md

## 프로젝트 기본 규칙

- **모든 작업은 메인 프로젝트 폴더에 반영**: `/Users/law/Downloads/Dev/character-map/`
- 워크트리(`.claude/worktrees/`)에 파일을 작성하지 않는다
- UI 언어는 **한국어 고정**
- 불필요한 주석, 타입 어노테이션, 에러 핸들링 추가 금지
- 요청 범위 밖의 리팩토링·기능 추가 금지

## 프로젝트 구조

```
character-map/
├── client/          # React + Vite 프론트엔드 (포트 5173)
├── server/          # Node.js + Express 백엔드 (포트 3001)
├── nginx/           # Nginx 설정 (EC2 배포용)
├── docs/PRD.md      # 전체 기획 문서
├── current_phase.txt
└── session_notes.txt
```

## 기술 스택

- **프론트**: React 19 + Vite 8 + Tailwind CSS 4 + Zustand 5 + react-force-graph-2d + Lucide React
- **백엔드**: Node.js + Express 5 + better-sqlite3 + jsonwebtoken + dotenv + cors
- **배포**: AWS EC2 (t2.micro) + Nginx + PM2

## 개발 서버 실행

```bash
# 백엔드
cd server && npm run dev

# 프론트엔드
cd client && npm run dev
```

## 환경변수 (`server/.env`)

```
PORT=3001
APP_PASSWORD=...
JWT_SECRET=...
DB_PATH=./data/database.sqlite
NODE_ENV=development
```

## DB 스키마 (SQLite 3개 테이블)

- `works` — 작품 (id, title, type, status, genre, created_at)
- `characters` — 인물 (id, work_id, name, alias, desc, group_name, group_color, importance, appeared_at, memo, is_favorite)
- `relations` — 관계 (id, work_id, source, target, type, strength, memo)

## 개발 Phase

| Phase | 내용 | 상태 |
|-------|------|------|
| 1 | 프로젝트 셋업 + DB 초기화 | ✅ 완료 |
| 2 | 인증 (JWT) | 🔜 다음 |
| 3 | 작품 관리 CRUD | ⬜ |
| 4 | 인물 카드 CRUD | ⬜ |
| 5 | 관계 연결 CRUD | ⬜ |
| 6 | 시냅스 맵 (react-force-graph-2d) | ⬜ |
| 7 | 설정 & 마무리 (export/import) | ⬜ |
| 8 | EC2 배포 | ⬜ |

## 관계 유형 색상

| 유형 | 색상 |
|------|------|
| 가족 family | `#7C3AED` |
| 동료 colleague | `#2563EB` |
| 친구 friend | `#16A34A` |
| 적대 enemy | `#DC2626` |
| 연인 lover | `#DB2777` |
| 기타 other | `#6B7280` |
