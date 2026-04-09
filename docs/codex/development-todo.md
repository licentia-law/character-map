# Character Map 개발 TODO

기준일: 2026-04-09  
기준 문서: `docs/codex/project-analysis-dtl.md`

## 목적

현재 코드 상태에서 실제 동작 가능한 MVP를 빠르게 완성하기 위한 실행 TODO를 정의한다.  
범위는 기존 기획(PRD) 내 기능으로 제한한다.

## 우선순위 요약

1. 인물 API 구현
2. 관계 API 구현
3. 서버 라우트 등록 및 프론트 연결 검증
4. 타입/데이터 정합성 수정
5. 핵심 사용자 흐름 수동 테스트

## P0 (즉시)

### 1) 인물 CRUD API 구현

- [ ] `server/src/routes/characters.js` 생성
- [ ] `GET /api/works/:workId/characters`
- [ ] `POST /api/works/:workId/characters`
- [ ] `PUT /api/characters/:id`
- [ ] `PATCH /api/characters/:id/favorite`
- [ ] `DELETE /api/characters/:id`
- [ ] works/characters 소유 관계 검증 로직 최소 반영

완료 기준

- 작품 상세 진입 시 인물 목록 로딩 성공
- 인물 추가/수정/삭제/즐겨찾기 토글 정상 동작

### 2) 관계 CRUD API 구현

- [ ] `server/src/routes/relations.js` 생성
- [ ] `GET /api/works/:workId/relations`
- [ ] `POST /api/works/:workId/relations`
- [ ] `PUT /api/relations/:id`
- [ ] `DELETE /api/relations/:id`
- [ ] source/target 인물 존재 여부 검증

완료 기준

- 관계 목록 로딩 성공
- 관계 추가/수정/삭제 정상 동작
- 인물 삭제 시 관계 cascade 반영 확인

### 3) 서버 라우트 결합

- [ ] `server/src/index.js`에 characters/relations 라우트 등록
- [ ] 기존 works/auth 라우트와 충돌 없는지 확인

완료 기준

- API 경로 기준 404 없이 호출 성공

### 4) 프론트 데이터 정합성 수정

- [ ] `client/src/components/RelationForm.jsx`의 `Number(e.target.value)` 제거
- [ ] UUID 문자열 ID를 그대로 전달하도록 수정

완료 기준

- 관계 생성/수정 시 source/target가 문자열 UUID로 전송됨

## P1 (P0 직후)

### 5) 핵심 흐름 통합 테스트

- [ ] 로그인
- [ ] 작품 생성
- [ ] 작품 상세 진입
- [ ] 인물 2명 이상 추가
- [ ] 관계 추가
- [ ] 맵 탭 렌더링 확인
- [ ] 작품 export/import 왕복 확인

완료 기준

- 주요 데모 흐름이 중단 없이 1회 이상 통과

### 6) 에러/빈 상태 점검

- [ ] API 실패 시 프론트 최소 안내 메시지 동작 확인
- [ ] 빈 목록 화면(작품/인물/관계/맵) UX 확인

완료 기준

- 빈 상태 및 실패 상태에서 화면 깨짐 없음

## P2 (후속)

### 7) 맵 기능 고도화 (PRD 정렬)

- [ ] 즐겨찾기 노드 강조 표현 보강
- [ ] 관계 타입별 선 스타일 보강
- [ ] 노드 클릭 상세 정보 연동 보강

### 8) 설정 영역 확장

- [ ] 전체 export/import API 설계 재검토
- [ ] 데이터 전체 초기화 기능 설계

## 작업 규칙

- 요청 범위 외 리팩토링 금지
- 기존 UI 톤 유지
- API 스펙은 PRD 및 현재 프론트 호출 경로와 일치시킴
- 문서와 실제 구현 상태를 동기화하며 진행

