# 04. Tasks — MVP 작업 체크리스트

## 개요

| 항목 | 내용 |
|------|------|
| 범위 | MVP 3개 Phase (설계 → 백엔드 → 프론트) |
| 확장 단계 | 본 문서 미포함 — 별도 문서에서 관리 |
| 진행 방식 | 순서대로만 · 병렬 금지 · 단계별 검증 필수 |

---

## 진행 규칙

1. **순서 준수** — 이전 단계 검증 통과 전 다음 단계 시작 불가
2. **병렬 작업 금지** — 두 단계를 동시에 진행하지 않는다
3. **검증 필수** — 각 단계의 검증 방법을 실행하고 눈으로 확인해야 ✅ 처리
4. **완료 선언 기준** — 검증 방법 통과 = 완료. 추측으로 완료 선언 금지

---

## Phase 1 — 설계

> **목표**: `CLAUDE.md` + `docs/` 6종 작성
> **상태**: ✅ 완료

| # | 단계 | 작업 내용 | 검증 방법 | 상태 |
|---|------|-----------|-----------|------|
| 1 | 프로젝트 디렉토리 생성 | `D:\taskflow-pro\` 생성 + `git init` | `git status` → `On branch main` 출력 | ✅ |
| 2 | CLAUDE.md 작성 | 역할·필독 순서·절대 규칙·모호 처리 정의 | 파일 존재 · 절대 규칙 5개 포함 확인 | ✅ |
| 3 | 00-overview.md 작성 | 문서 구성 매핑표·읽는 순서·분리 원칙 | 파일 존재 · 6개 파일 매핑표 포함 확인 | ✅ |
| 4 | 01-product.md 작성 | 목표·페르소나·MVP 범위·UI 톤·성공 기준 | 파일 존재 · 성공 기준 5개 포함 확인 | ✅ |
| 5 | 02-specs.md 작성 | Task 모델·검증 규칙·API 5개·화면 명세 | 파일 존재 · API 5개 엔드포인트 포함 확인 | ✅ |
| 6 | 03-design.md 작성 | 기술 결정 8개·디자인 토큰·의존성 정책 | 파일 존재 · 결정 표 8행 포함 확인 | ✅ |
| 7 | 04-tasks.md 작성 | 본 문서 — Phase별 체크리스트 | 파일 존재 · Phase 1~3 테이블 포함 확인 | ✅ |
| 8 | 05-conventions.md 작성 | 네이밍·커밋·코드 스타일·금지 사항 | 파일 존재 · 커밋 컨벤션 섹션 포함 확인 | ✅ |
| 9 | docs/ 구조 확인 | 6개 파일 모두 존재하는지 최종 점검 | `ls docs/` → 파일 6개 출력 | ✅ |
| 10 | Phase 1 초기 커밋 | `git add -A` + `git commit` | `git log --oneline` → 커밋 1건 이상 확인 | ✅ |

---

## Phase 2 — 백엔드

> **목표**: `backend/` FastAPI CRUD API 5개 구현 → Swagger 확인
> **상태**: ⬜ 대기 중

| # | 단계 | 작업 내용 | 검증 방법 | 상태 |
|---|------|-----------|-----------|------|
| 1 | 가상환경 + 의존성 | `python -m venv .venv` · `fastapi uvicorn sqlalchemy` 설치 · `requirements.txt` 생성 | `pip list` → 3개 패키지 확인 | ⬜ |
| 2 | 앱 진입점 | `backend/main.py` — FastAPI 인스턴스 · CORS 전체 허용 · `/health` 엔드포인트 | `curl localhost:8000/health` → `{"status":"ok"}` | ⬜ |
| 3 | DB 설정 | `backend/database.py` — SQLite 연결 · 세션 팩토리 · `create_all()` | 서버 기동 시 `tasks.db` 파일 자동 생성 확인 | ⬜ |
| 4 | Task 모델 + 스키마 | `backend/models.py` — SQLAlchemy 모델 (7개 필드) · Pydantic `TaskCreate` / `TaskUpdate` / `TaskResponse` / `TaskListItem` | `python -c "from models import Task"` 오류 없음 | ⬜ |
| 5 | CRUD 함수 | `backend/crud.py` — `create` / `get_list` / `get_one` / `update` / `delete` 함수 | `python -c "from crud import create_task"` 오류 없음 | ⬜ |
| 6 | `POST /tasks` | `backend/routers/tasks.py` — 생성 엔드포인트 구현 | `curl -X POST /tasks` → `201` · 생성 객체 반환 | ⬜ |
| 7 | `GET /tasks` | 목록 조회 구현 — `description` 제외 · `created_at` 내림차순 | `curl /tasks` → `200` · 배열 반환 · `description` 필드 없음 확인 | ⬜ |
| 8 | `GET /tasks/{id}` | 단건 조회 구현 — `description` 포함 · 없는 id → `404` | `curl /tasks/1` → `200` · `description` 포함 / 없는 id → `404` 확인 | ⬜ |
| 9 | `PUT /tasks/{id}` | 부분 수정 구현 — 누락 필드 기존 값 유지 · `updated_at` 갱신 | `curl -X PUT /tasks/1` → `200` · `updated_at` 변경 확인 | ⬜ |
| 10 | `DELETE /tasks/{id}` + Swagger | 삭제 구현 (`204 No Content`) → `localhost:8000/docs` 열기 | 브라우저에서 5개 엔드포인트 표시 · Try it out 전체 성공 | ⬜ |

---

## Phase 3 — 프론트엔드

> **목표**: `frontend/` HTML + JS + Tailwind → 메인 화면 → API 연결 → git push
> **상태**: ⬜ 대기 중

| # | 단계 | 작업 내용 | 검증 방법 | 상태 |
|---|------|-----------|-----------|------|
| 1 | 디렉토리 + 기본 파일 | `frontend/index.html` · `frontend/app.js` 생성 · Tailwind CDN `<head>` 추가 | 브라우저 오픈 → Tailwind 클래스 스타일 적용 확인 | ⬜ |
| 2 | 테마 토글 | `<html class="dark">` 전환 · `localStorage('theme')` 저장 · 초기값 `prefers-color-scheme` · FOUC 방지 인라인 스크립트 | 토글 클릭 → 테마 전환 → 새로고침 후 유지 | ⬜ |
| 3 | 메인 레이아웃 | 헤더(제목 + 테마 버튼) · 추가 폼 · 카드 목록 영역 마크업 · `rounded-xl shadow-lg backdrop-blur` 토큰 적용 | 360px 너비에서 레이아웃 깨짐 없음 (DevTools 확인) | ⬜ |
| 4 | 태스크 추가 폼 | `title` · `due_at` datetime-local · `status` 드롭다운 · 제출 → `POST /tasks` · 성공 시 목록 갱신 | 입력 후 제출 → 카드 목록에 즉시 반영 | ⬜ |
| 5 | 태스크 목록 렌더링 | 페이지 로드 시 `GET /tasks` · 카드 렌더링 · `status` 배지 색상 · `D-N HH:MM` 마감 표시 · D-1 이하 주황 · 지남 빨강 | 빈 목록 → "태스크 없음" / 데이터 있으면 카드 표시 | ⬜ |
| 6 | 수정 모달 | 카드 클릭 → `GET /tasks/{id}` → 모달 오픈 · 전체 필드 편집 · "저장" → `PUT /tasks/{id}` · 모달 외부 클릭·ESC 닫기 | 수정 저장 후 카드 내용 변경 반영 확인 | ⬜ |
| 7 | 삭제 확인 | 휴지통 아이콘 → 인라인 확인 메시지 → "삭제" → `DELETE /tasks/{id}` → `204` 시 카드 제거 · "취소" 시 복귀 | 삭제 후 목록에서 카드 사라짐 · 새로고침 후 미복원 확인 | ⬜ |
| 8 | 성공 기준 전체 확인 + git push | `01-product.md` 성공 기준 5개 직접 실행 → 전부 통과 → `git add -A && git commit && git push` | `git log --oneline` · 원격 저장소 반영 확인 | ⬜ |

---

## 상태 범례

| 아이콘 | 의미 |
|--------|------|
| ✅ | 검증 완료 |
| 🔄 | 진행 중 |
| ⬜ | 대기 중 |
| ❌ | 검증 실패 — 재작업 필요 |
