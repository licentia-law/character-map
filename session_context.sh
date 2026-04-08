#!/bin/bash
# Character Map — 개발 환경 컨텍스트 스크립트
# 사용법: source session_context.sh

PROJECT_ROOT="/Users/law/Downloads/Dev/character-map"
CLIENT_DIR="$PROJECT_ROOT/client"
SERVER_DIR="$PROJECT_ROOT/server"

echo "==================================="
echo "  Character Map 개발 환경"
echo "==================================="
echo ""

# 현재 Phase 출력
echo "[현재 Phase]"
cat "$PROJECT_ROOT/current_phase.txt" | head -3
echo ""

# 포트 정보
echo "[포트]"
echo "  프론트엔드 : http://localhost:5173"
echo "  백엔드 API  : http://localhost:3001"
echo ""

# 서버 실행 명령
echo "[실행 명령]"
echo "  백엔드  : cd server && npm run dev"
echo "  프론트  : cd client && npm run dev"
echo ""

# 환경변수 확인
echo "[server/.env 상태]"
if [ -f "$SERVER_DIR/.env" ]; then
  echo "  ✅ .env 파일 존재"
  grep -v "SECRET\|PASSWORD" "$SERVER_DIR/.env"
else
  echo "  ❌ .env 파일 없음 — server/.env 생성 필요"
fi
echo ""

# 편의 alias
alias cm-server="cd $SERVER_DIR && npm run dev"
alias cm-client="cd $CLIENT_DIR && npm run dev"
alias cm-root="cd $PROJECT_ROOT"

echo "[Alias 등록됨]"
echo "  cm-server  : 백엔드 dev 서버 실행"
echo "  cm-client  : 프론트엔드 dev 서버 실행"
echo "  cm-root    : 프로젝트 루트로 이동"
echo "==================================="
