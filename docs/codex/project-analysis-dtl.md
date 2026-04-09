# Character Map 프로젝트 분석 DTL

## 1. 문서 목적

이 문서는 현재 코드베이스를 기준으로 Character Map 프로젝트가 어떤 프로젝트인지, 실제로 어디까지 구현되어 있는지, 어떤 부분이 아직 연결되지 않았는지를 정리하기 위한 내부 분석 문서다.

기준 시점은 2026-04-09이며, 실제 파일 구조와 구현 코드를 직접 확인한 결과를 바탕으로 작성했다.

---

## 2. 프로젝트 정체성

Character Map은 책, 영화, 드라마, 애니메이션 같은 작품의 등장인물과 인물 간 관계를 기록하고, 이를 관계도 형태의 인터랙티브 맵으로 시각화하는 개인용 웹 앱이다.

핵심 목적은 다음과 같다.

- 감상 중 새로 등장한 인물을 바로 기록한다.
- 인물 사이의 관계를 함께 축적한다.
- 감상 완료 후 전체 인물 관계를 한눈에 복습한다.
- EC2 배포를 통해 여러 기기에서 같은 데이터를 사용한다.

기획 의도와 목표 기능은 `docs/PRD.md`에 정리되어 있다.

---

## 3. 기술 스택과 구조

### 프론트엔드

- React 19
- Vite 8
- Tailwind CSS 4
- Zustand 5
- react-force-graph-2d
- Lucide React

### 백엔드

- Node.js
- Express 5
- better-sqlite3
- jsonwebtoken
- dotenv
- cors

### 데이터베이스

- SQLite
- 테이블: `works`, `characters`, `relations`

### 배포 구조 의도

- Nginx
- AWS EC2
- PM2

### 디렉터리 구조

```text
character-map/
├── client/
├── server/
├── nginx/
├── docs/
├── current_phase.txt
└── session_notes.txt
```

---

## 4. 핵심 기능 의도

PRD 기준 이 프로젝트의 기능 범위는 다음과 같다.

- 단일 비밀번호 기반 로그인
- 작품 목록 관리
- 작품별 인물 관리
- 작품별 관계 관리
- Force Graph 기반 시냅스 맵 시각화
- JSON export/import
- 설정 및 배포

즉, 단순 메모 앱이 아니라 작품 단위 데이터 관리와 그래프 시각화를 결합한 전용 관계도 관리 도구다.

---

## 5. 실제 구현 상태 요약

현재 코드베이스는 기획상으로는 작품, 인물, 관계, 맵까지 모두 다루는 구조를 갖추고 있다. 다만 실제로 끝까지 동작하는 범위는 인증과 작품 관리 중심이며, 인물/관계 영역은 프론트 UI가 먼저 만들어지고 서버 API가 아직 따라오지 않은 상태다.

한 줄로 요약하면 다음과 같다.

> 프로젝트의 방향성과 화면 구조는 명확하지만, 백엔드 연결이 일부 비어 있어 핵심 기능이 완전히 동작하지는 않는다.

---

## 6. 현재 동작하는 기능

### 6.1 인증

구현 상태

- 로그인 화면 존재
- 비밀번호 입력 후 JWT 발급
- 인증 토큰 localStorage 저장
- 인증되지 않은 경우 로그인 화면으로 분기
- 인증 미들웨어로 보호된 API 접근

관련 파일

- `client/src/pages/Login.jsx`
- `client/src/store/useStore.js`
- `client/src/api/client.js`
- `server/src/routes/auth.js`
- `server/src/middleware/auth.js`

판단

인증 흐름은 현재 프로젝트에서 가장 안정적으로 연결된 영역이다.

### 6.2 DB 초기화

구현 상태

- SQLite 연결
- WAL 모드 활성화
- foreign key 활성화
- `works`, `characters`, `relations` 테이블 생성
- cascade 삭제 설정 적용

관련 파일

- `server/src/db/database.js`
- `server/src/db/init.js`

판단

데이터 구조의 기반은 정상적으로 준비되어 있다.

### 6.3 작품 관리

구현 상태

- 작품 목록 조회 API
- 작품 추가 API
- 작품 수정 API
- 작품 삭제 API
- 홈 화면 카드 그리드
- 작품 타입 필터
- 작품 상태 필터
- 작품 추가/수정 슬라이드 패널
- 작품 선택 후 상세 화면 진입

관련 파일

- `server/src/routes/works.js`
- `client/src/pages/Home.jsx`
- `client/src/components/WorkForm.jsx`
- `client/src/store/useStore.js`

판단

로그인 후 홈 화면에서 작품을 관리하는 흐름은 실제 사용 가능한 수준에 가깝다.

### 6.4 작품 단위 export/import

구현 상태

- 작품 export API 존재
- 작품 import API 존재
- 홈 화면에서 JSON 가져오기 가능
- 상세 화면에서 JSON 내보내기 가능

관련 파일

- `server/src/routes/works.js`
- `client/src/api/client.js`
- `client/src/pages/Home.jsx`
- `client/src/pages/WorkDetail.jsx`

판단

이 기능은 서버와 프론트가 연결되어 있으며, 현재 구현된 범위 안에서는 실사용 가능성이 있다.

### 6.5 작품 상세 UI와 맵 UI

구현 상태

- 작품 상세 화면 존재
- 탭 구조: 인물 / 관계 / 맵
- 인물 추가/수정 폼 UI 존재
- 관계 추가/수정 폼 UI 존재
- 그래프 시각화 컴포넌트 존재

관련 파일

- `client/src/pages/WorkDetail.jsx`
- `client/src/components/CharacterForm.jsx`
- `client/src/components/RelationForm.jsx`
- `client/src/components/SynapseMap.jsx`

판단

화면 껍데기와 상호작용 구조는 상당 부분 준비되어 있다.

---

## 7. 현재 동작하지 않거나 불완전한 기능

### 7.1 인물 API 미구현

프론트는 아래 API 호출을 전제로 작성되어 있다.

- `GET /api/works/:workId/characters`
- `POST /api/works/:workId/characters`
- `PUT /api/characters/:id`
- `PATCH /api/characters/:id/favorite`
- `DELETE /api/characters/:id`

하지만 실제 서버 라우트에는 해당 구현이 없다.

실제 존재하는 서버 라우트 파일

- `server/src/routes/auth.js`
- `server/src/routes/works.js`

영향

- 작품 상세 진입 시 인물 목록 조회 실패 가능
- 인물 추가/수정/삭제 불가
- 즐겨찾기 토글 불가

### 7.2 관계 API 미구현

프론트는 아래 API 호출을 전제로 작성되어 있다.

- `GET /api/works/:workId/relations`
- `POST /api/works/:workId/relations`
- `PUT /api/relations/:id`
- `DELETE /api/relations/:id`

하지만 서버에는 구현이 없다.

영향

- 관계 목록 조회 불가
- 관계 추가/수정/삭제 불가
- 맵 데이터가 비어 있거나 에러 상태가 될 수 있음

### 7.3 상세 화면의 실제 동작 불안정

`WorkDetail.jsx`는 진입 시 다음 동작을 즉시 시도한다.

- `fetchCharacters(selectedWorkId)`
- `fetchRelations(selectedWorkId)`

이 호출은 현재 서버에 대응 라우트가 없으므로, 작품 상세 페이지는 UI는 존재하지만 실제 사용 시 API 오류에 걸릴 가능성이 높다.

### 7.4 RelationForm의 ID 처리 오류 가능성

`RelationForm.jsx`에서 `source`, `target` 선택값을 `Number(e.target.value)`로 변환하고 있다.

하지만 현재 서버는 `randomUUID()`를 사용하므로 ID는 숫자가 아니라 문자열이다.

영향

- 서버 라우트를 나중에 구현해도 관계 추가/수정 시 잘못된 값이 전달될 수 있음

### 7.5 맵 기능은 기본 렌더링 수준

현재 맵 컴포넌트는 다음 정도까지 구현되어 있다.

- 노드 렌더링
- 링크 렌더링
- 선택 노드 강조
- 리사이즈 대응

하지만 PRD 기준 고급 기능은 아직 부족하다.

- 우측 상세 패널 없음
- 즐겨찾기 강조 연동 미흡
- 즐겨찾기만 보기와 맵의 완전한 연동 없음
- 관계 유형별 선 스타일 세분화 부족

---

## 8. 문서와 실제 코드의 차이

### 8.1 current_phase.txt와 실제 구현 상태 차이

`current_phase.txt`에는 현재 Phase 3 진행 중으로 기록되어 있다.

기록 내용

- 인증 완료
- 다음은 작품 관리 CRUD

하지만 실제 코드는 이미 그보다 앞선 UI를 포함한다.

- `Home.jsx` 구현 완료
- `WorkDetail.jsx` 구현 존재
- `CharacterForm.jsx` 구현 존재
- `RelationForm.jsx` 구현 존재
- `SynapseMap.jsx` 구현 존재

즉, 프론트엔드는 Phase 4~6 일부까지 선행 구현된 상태이고, 백엔드는 Phase 3 수준에 더 가깝다.

### 8.2 session_notes.txt와 실제 구조 차이

세션 노트에는 `client/src/components/works/WorkForm.jsx` 같은 경로가 언급되지만, 실제 파일은 다음 경로에 있다.

- `client/src/components/WorkForm.jsx`

즉, 메모와 실제 파일 구조가 완전히 일치하지는 않는다.

---

## 9. 현재 시점의 정확한 프로젝트 해석

현재 Character Map은 다음처럼 해석하는 것이 가장 정확하다.

### 성격

- 개인용 등장인물 관계도 관리 웹 앱

### 구현 성숙도

- 초기 MVP 중반 단계

### 실사용 가능 범위

- 로그인
- 작품 생성/수정/삭제
- 작품 목록 필터링
- 작품 export/import 일부

### 미완성 핵심 영역

- 인물 CRUD 백엔드
- 관계 CRUD 백엔드
- 맵과 상세 정보의 완전한 연결

즉, 프로젝트는 단순 프로토타입 수준을 넘어서 화면과 데이터 모델은 잘 잡혀 있지만, 가장 중요한 인물/관계 데이터 흐름이 아직 끝나지 않은 상태다.

---

## 10. 다음 구현 우선순위

현재 코드 상태에서 가장 합리적인 우선순위는 다음과 같다.

### 1순위: 인물 API 구현

필요 엔드포인트

- `GET /api/works/:workId/characters`
- `POST /api/works/:workId/characters`
- `PUT /api/characters/:id`
- `PATCH /api/characters/:id/favorite`
- `DELETE /api/characters/:id`

이유

- 작품 상세 화면의 인물 탭이 실제 사용 가능해진다.
- 관계 기능 구현의 전제가 된다.

### 2순위: 관계 API 구현

필요 엔드포인트

- `GET /api/works/:workId/relations`
- `POST /api/works/:workId/relations`
- `PUT /api/relations/:id`
- `DELETE /api/relations/:id`

이유

- 인물 간 연결이 가능해진다.
- 맵 탭이 실질적인 기능을 갖게 된다.

### 3순위: 서버 라우트 등록

필요 작업

- `server/src/index.js`에 characters, relations 라우트 연결

이유

- 구현한 API가 실제로 노출되어야 한다.

### 4순위: RelationForm 값 처리 수정

필요 작업

- `Number(e.target.value)` 제거
- UUID 문자열 그대로 저장

이유

- 이후 관계 CRUD 연결 시 데이터 타입 오류를 막는다.

### 5순위: 통합 동작 검증

우선 검증 시나리오

1. 로그인
2. 작품 생성
3. 작품 상세 진입
4. 인물 추가
5. 관계 추가
6. 맵 렌더링 확인

이유

- 프로젝트 핵심 가치가 한 번에 검증되는 최소 흐름이다.

---

## 11. 결론

Character Map은 등장인물과 관계를 기록하고 시각화하는 개인용 관계도 웹 앱이다. 프로젝트의 목적과 데이터 구조, UI 방향은 명확하며, 인증과 작품 관리까지는 비교적 잘 구현되어 있다.

하지만 현재 시점의 핵심 판단은 다음과 같다.

- 프론트엔드는 인물/관계/맵까지 포함한 구조를 이미 갖췄다.
- 백엔드는 인증과 작품 관리까지만 연결되어 있다.
- 따라서 현재 실질적으로 안정적으로 동작하는 영역은 로그인과 작품 관리다.
- 다음 핵심 작업은 인물/관계 API 구현과 상세 화면의 실제 데이터 연결이다.

즉, 이 프로젝트는 방향이 불명확한 실험 코드가 아니라, 완성 경로가 분명한 미완성 MVP라고 보는 것이 맞다.
