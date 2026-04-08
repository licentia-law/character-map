# 📚 등장인물 관계도 맵 앱 — PRD v2.0
**Character Relationship Map**

> 책·영화·드라마·애니를 보며 등장인물과 관계를 실시간으로 기록하고,  
> 시냅스처럼 연결된 인터랙티브 맵으로 시각화하는 개인용 웹 도구
> 앱 이름: **Character Map**

`React` `Vite` `Tailwind CSS` `Zustand` `Node.js` `Express` `SQLite` `Nginx` `AWS EC2`


---

## 1. 프로젝트 개요

### 💡 만들고자 하는 것

책·영화·드라마·애니를 볼 때 새로운 등장인물이 나올 때마다 브라우저에서 인물 정보와 관계를 기록하고,
완독/완시청 후 모든 인물의 관계를 시냅스처럼 연결된 인터랙티브 맵으로 한눈에 확인하는 개인용 웹 도구.
AWS EC2에 배포하여 모바일·노트북 등 여러 기기에서 동일한 데이터에 접근 가능.

### 사용 시나리오 (삼체 예시)

1. **1장** — 예원제 등장 → 브라우저에서 "예원제" 인물 추가, 설명 기록
2. **3장** — 왕먀오 등장 → 추가, 예원제와 "동료" 관계 연결
3. **10장** — 나노텍 인물들 등장 → 추가, 관계 확장
4. **완독 후** → 전체 관계도 맵을 열어 한눈에 복습

---

## 2. 기술 스택

| 분류 | 기술 | 선택 이유 |
|---|---|---|
| UI 프레임워크 | React + Vite | 빠른 개발 환경, 컴포넌트 기반 구조 |
| 그래프 시각화 | react-force-graph-2d | D3 기반, 시냅스 맵 느낌의 Force-directed 그래프 |
| 스타일링 | Tailwind CSS | 빠른 UI 구성, 별도 CSS 파일 최소화 |
| 상태 관리 | Zustand | 가볍고 심플한 전역 상태 관리 |
| 아이콘 | Lucide React | 깔끔한 오픈소스 아이콘 세트 |
| 백엔드 | Node.js + Express | REST API 서버, SQLite 연동 |
| 데이터베이스 | SQLite | 서버 내 파일 DB, 별도 비용 없음, 다기기 데이터 공유 |
| 웹서버 | Nginx | 정적 파일 서빙 + API 리버스 프록시 |
| 배포 | AWS EC2 (t2.micro) | 프리티어 활용 가능, 단일 서버 구성 |
| 인증 | 단일 비밀번호 | 환경변수로 관리, 간단한 접근 제한 |
| 데이터 백업 | JSON export/import | 수동 백업 및 기기 간 이동 지원 |

---

## 3. 시스템 아키텍처

```
[브라우저 - 모바일/노트북/PC]
        ↓ HTTP 요청
[AWS EC2]
  ├── Nginx (포트 80)
  │     ├── / → React 정적 빌드 서빙
  │     └── /api → Node.js 리버스 프록시
  ├── Node.js + Express (포트 3001)
  │     └── REST API
  └── SQLite (database.sqlite)
        └── works / characters / relations 테이블
```

---

## 4. 핵심 기능

### 🔐 인증
- 단일 비밀번호 로그인 (환경변수 `APP_PASSWORD` 설정)
- 로그인 후 세션 토큰 발급 (JWT 또는 간단한 세션)
- 미인증 시 모든 API 접근 차단

### 📚 작품 관리
- 작품 타입: **책 / 영화 / 드라마 / 애니 / 기타**
- 작품별 독립 데이터 관리
- 감상 상태 태그: 감상 중 / 완료
- 작품 목록 대시보드 (카드 그리드)
- 작품 추가 / 편집 / 삭제

### 👤 인물 카드
- 이름 (필수), 별명/호칭
- 한줄 설명
- 소속 / 진영 (색상 그룹)
- 등장 시점 (챕터 / 회차)
- 중요도 (1~3★) → 노드 크기로 표현
- 메모 (자유 텍스트)
- **⭐ 즐겨찾기** → 관계도 맵에서 강조 + 필터링

### 🔗 관계 연결
- 인물 A ↔ B 관계 설정
- 관계 유형 태그 (가족 / 친구 / 적대 / 동료 / 연인 / 기타)
- 관계 강도 1~3 (선 굵기로 표현)
- 관계 설명 메모

### 🗺️ 시냅스 맵
- Force-directed 인터랙티브 그래프 (react-force-graph-2d)
- 소속별 노드 색상, 중요도별 노드 크기
- 관계 유형별 선 색상 및 스타일
- 노드 클릭 → 인물 상세 패널 (우측)
- 드래그로 레이아웃 조정
- 줌 인/아웃, 전체 보기
- **⭐ 즐겨찾기 강조**: 즐겨찾기 인물 노드에 별★ 아이콘 + 테두리 강조
- **⭐ 즐겨찾기 필터**: 즐겨찾기 인물만 표시하는 필터 토글

### ⚙️ 설정
- 데이터 JSON 내보내기 / 불러오기
- 데이터 전체 초기화

---

## 5. 관계 유형 정의

| 유형 | 색상 | 선 스타일 |
|---|---|---|
| 👨‍👩‍👧 가족 | 보라색 `#7C3AED` | 실선 (굵음) |
| 🤝 동료 | 파란색 `#2563EB` | 실선 |
| 💚 친구 | 초록색 `#16A34A` | 실선 |
| ⚔️ 적대 | 빨간색 `#DC2626` | 점선 |
| 💘 연인 | 분홍색 `#DB2777` | 실선 (굵음) |
| 🔍 기타 | 회색 `#6B7280` | 점선 |

---

## 6. 데이터 구조 (DB 스키마)

### works 테이블
```sql
CREATE TABLE works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,       -- book | movie | drama | anime | other
  status TEXT NOT NULL,     -- watching | completed
  genre TEXT,
  created_at TEXT NOT NULL
);
```

### characters 테이블
```sql
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  name TEXT NOT NULL,
  alias TEXT,
  desc TEXT,
  group_name TEXT,
  group_color TEXT,
  importance INTEGER DEFAULT 1,   -- 1 | 2 | 3
  appeared_at TEXT,
  memo TEXT,
  is_favorite INTEGER DEFAULT 0,  -- 0 | 1 (즐겨찾기)
  FOREIGN KEY (work_id) REFERENCES works(id)
);
```

### relations 테이블
```sql
CREATE TABLE relations (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT NOT NULL,       -- family | colleague | friend | enemy | lover | other
  strength INTEGER DEFAULT 1,  -- 1 | 2 | 3
  memo TEXT,
  FOREIGN KEY (work_id) REFERENCES works(id),
  FOREIGN KEY (source) REFERENCES characters(id),
  FOREIGN KEY (target) REFERENCES characters(id)
);
```

### JSON export 형식
```json
{
  "exportedAt": "2026-04-08T00:00:00Z",
  "version": "2.0",
  "works": [...],
  "characters": [...],
  "relations": [...]
}
```

---

## 7. API 설계

### 인증
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/auth/login` | 비밀번호 로그인, 토큰 발급 |
| POST | `/api/auth/logout` | 로그아웃 |

### 작품
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/works` | 작품 목록 조회 |
| POST | `/api/works` | 작품 추가 |
| PUT | `/api/works/:id` | 작품 수정 |
| DELETE | `/api/works/:id` | 작품 삭제 |

### 인물
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/works/:workId/characters` | 인물 목록 조회 |
| POST | `/api/works/:workId/characters` | 인물 추가 |
| PUT | `/api/characters/:id` | 인물 수정 |
| PATCH | `/api/characters/:id/favorite` | 즐겨찾기 토글 |
| DELETE | `/api/characters/:id` | 인물 삭제 |

### 관계
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/works/:workId/relations` | 관계 목록 조회 |
| POST | `/api/works/:workId/relations` | 관계 추가 |
| PUT | `/api/relations/:id` | 관계 수정 |
| DELETE | `/api/relations/:id` | 관계 삭제 |

### 설정
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/export` | 전체 데이터 JSON 내보내기 |
| POST | `/api/import` | JSON 데이터 불러오기 |

---

## 8. 화면 구성 (UI)

### 주요 화면 목록

| 화면 | 설명 |
|---|---|
| 🔐 로그인 | 비밀번호 입력, 인증 실패 시 접근 불가 |
| 🏠 홈 (작품 목록) | 작품 카드 그리드 / 새 작품 추가 / 타입·상태 필터 |
| 📖 작품 상세 | 인물 목록 사이드바 + 관계도 맵 메인 영역 |
| 👤 인물 추가/편집 | 슬라이드 패널 폼 |
| 🔗 관계 설정 | 두 인물 선택 + 유형 선택 + 메모 |
| 🗺️ 관계도 맵 | Force Graph + 즐겨찾기 강조/필터 + 우측 상세 패널 |
| ⚙️ 설정 | JSON export/import / 초기화 |

### 관계도 맵 레이아웃

```
┌─────────────────────────────────┬──────────────────┐
│  [즐겨찾기만 보기 토글] [전체]  │  📋 인물 상세    │
│                                 │  패널 (30%)      │
│   🗺️ Force Graph 영역 (70%)    │                  │
│                                 │  이름: 예원제 ⭐  │
│  • 노드: 원형, 소속별 색상     │  소속: 과학자    │
│  • ⭐ 즐겨찾기: 금색 테두리    │  설명: 물리학자  │
│    + 별 아이콘 표시             │                  │
│  • 관계선: 유형별 색상         │  관계:           │
│  • 드래그: 노드 이동           │  └ 왕먀오 (동료) │
│  • 스크롤: 줌 인/아웃         │  └ 예 (가족)     │
│                                 │                  │
│                                 │  메모: ...       │
│                                 │  [편집] [삭제]   │
└─────────────────────────────────┴──────────────────┘
```

---

## 9. 프로젝트 폴더 구조

```
project-root/
├── client/                          # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   │   ├── works/
│   │   │   │   ├── WorkCard.jsx
│   │   │   │   ├── WorkForm.jsx
│   │   │   │   └── WorkList.jsx
│   │   │   ├── characters/
│   │   │   │   ├── CharacterCard.jsx
│   │   │   │   ├── CharacterForm.jsx
│   │   │   │   └── CharacterDetail.jsx
│   │   │   ├── relations/
│   │   │   │   └── RelationForm.jsx
│   │   │   ├── graph/
│   │   │   │   ├── GraphView.jsx
│   │   │   │   └── GraphControls.jsx
│   │   │   └── common/
│   │   │       ├── Modal.jsx
│   │   │       ├── SlidePanel.jsx
│   │   │       └── Badge.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── WorkDetail.jsx
│   │   │   └── Settings.jsx
│   │   ├── store/
│   │   │   └── useStore.js
│   │   ├── api/
│   │   │   └── client.js            # API 호출 함수 모음
│   │   ├── constants/
│   │   │   └── relationTypes.js
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js 백엔드
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── works.js
│   │   │   ├── characters.js
│   │   │   ├── relations.js
│   │   │   └── exportImport.js
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT 인증 미들웨어
│   │   ├── db/
│   │   │   ├── init.js              # DB 초기화 및 스키마 생성
│   │   │   └── database.js          # SQLite 연결
│   │   └── index.js                 # Express 앱 진입점
│   ├── data/
│   │   └── database.sqlite          # SQLite 파일 (gitignore)
│   ├── .env                         # APP_PASSWORD, JWT_SECRET 등
│   └── package.json
│
└── nginx/
    └── default.conf                 # Nginx 설정 파일
```

---

## 10. 개발 계획 (Phase별)

| 단계 | 목표 | 주요 작업 |
|---|---|---|
| Phase 1 | 프로젝트 셋업 | 폴더 구조 생성, 패키지 설치, SQLite DB 초기화, 환경변수 설정 |
| Phase 2 | 인증 구현 | 로그인 API, JWT 미들웨어, 로그인 페이지 UI |
| Phase 3 | 작품 관리 | 작품 CRUD API + 홈 화면 UI (카드 그리드, 필터) |
| Phase 4 | 인물 카드 CRUD | 인물 CRUD API + 슬라이드 패널 UI + 즐겨찾기 토글 |
| Phase 5 | 관계 연결 | 관계 CRUD API + 관계 설정 UI |
| Phase 6 | 시냅스 맵 | react-force-graph-2d 통합, 즐겨찾기 강조/필터, 클릭 상세 패널 |
| Phase 7 | 설정 & 마무리 | JSON export/import, 빈 상태 처리, UI 다듬기, 전체 테스트 |
| Phase 8 | EC2 배포 | Nginx 설정, PM2로 Node.js 관리, EC2 배포 |

---

## 11. EC2 배포 구성

### 서버 환경
```
OS: Ubuntu 22.04 LTS
Instance: t2.micro (프리티어)
포트: 80 (HTTP, Nginx)
Node.js: 20.x LTS
```

### Nginx 설정 (`/etc/nginx/sites-available/default`)
```nginx
server {
    listen 80;
    server_name _;

    # React 정적 파일
    location / {
        root /var/www/character-map/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Node.js API 리버스 프록시
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 프로세스 관리
```bash
# PM2로 Node.js 서버 관리
pm2 start server/src/index.js --name character-map
pm2 save
pm2 startup
```

---

## 12. 환경변수 설정 (`server/.env`)

```env
PORT=3001
APP_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_here
DB_PATH=./data/database.sqlite
NODE_ENV=production
```

---

---

# 🚀 Claude Code 시작 프롬프트

> 아래 내용을 Claude Code 새 대화창에 복사하여 붙여넣기

---

```
React + Node.js + SQLite로 등장인물 관계도 웹앱을 만들어줘.

## 기술 스택
- 프론트엔드: React + Vite + Tailwind CSS + Zustand + react-force-graph-2d + Lucide React
- 백엔드: Node.js + Express
- DB: SQLite (better-sqlite3)
- 인증: JWT (단일 비밀번호)
- 배포: AWS EC2 + Nginx (HTTP)
- UI 언어: 한국어 고정

## 프로젝트 구조
client/ (React 프론트엔드)
server/ (Node.js 백엔드)
nginx/ (Nginx 설정)

## 핵심 기능
1. 단일 비밀번호 로그인 (환경변수 APP_PASSWORD, JWT 발급)
2. 작품 관리: 책/영화/드라마/애니/기타 타입, 감상중/완료 상태
3. 인물 카드: 이름/별명/설명/소속(색상그룹)/중요도(1~3★)/등장시점/메모/즐겨찾기(⭐)
4. 관계 연결: 인물 쌍 + 유형(가족/동료/친구/적대/연인/기타) + 강도(1~3) + 메모
5. 시냅스 맵 (react-force-graph-2d):
   - 소속별 노드 색상, 중요도별 노드 크기
   - 관계 유형별 선 색상 (가족:보라/동료:파랑/친구:초록/적대:빨강/연인:분홍/기타:회색)
   - 즐겨찾기 인물: 금색 테두리 + 별★ 아이콘 강조
   - 즐겨찾기만 보기 필터 토글
   - 노드 클릭 시 우측 상세 패널
   - 드래그/줌
6. JSON export/import

## DB 스키마 (SQLite)
works: id, title, type, status, genre, created_at
characters: id, work_id, name, alias, desc, group_name, group_color, importance, appeared_at, memo, is_favorite
relations: id, work_id, source, target, type, strength, memo

## API
- POST /api/auth/login
- GET/POST /api/works
- PUT/DELETE /api/works/:id
- GET/POST /api/works/:workId/characters
- PUT/DELETE /api/characters/:id
- PATCH /api/characters/:id/favorite
- GET/POST /api/works/:workId/relations
- PUT/DELETE /api/relations/:id
- GET /api/export, POST /api/import

## 환경변수 (server/.env)
PORT=3001
APP_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_here
DB_PATH=./data/database.sqlite

## Phase 1부터 시작해줘:
1. 폴더 구조 및 패키지 설치 (client, server 분리)
2. SQLite DB 초기화 및 스키마 생성
3. Express 서버 기본 설정
4. JWT 인증 미들웨어
5. Zustand 스토어 기본 설계 (API 호출 함수 포함)
```

---

*PRD v2.0 | 2026-04-08*
