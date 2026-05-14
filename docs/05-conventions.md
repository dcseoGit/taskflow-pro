# 05. Conventions — 협업 규칙

## 명명 규칙

| 대상 | 방식 | 예시 |
|------|------|------|
| Python 변수·함수·파일 | `snake_case` | `get_task`, `task_id`, `crud.py` |
| Python 클래스 | `PascalCase` | `Task`, `TaskCreate`, `TaskResponse` |
| Python 상수 | `UPPER_SNAKE_CASE` | `DATABASE_URL`, `DEFAULT_STATUS` |
| JS 변수·함수 | `camelCase` | `fetchTasks`, `handleSubmit`, `taskId` |
| JS/HTML 컴포넌트 | `PascalCase` | `TaskCard`, `ModalForm` |
| HTML `id`·`data-*` | `kebab-case` | `task-list`, `data-task-id` |
| URL 경로 | `kebab-case` (소문자) | `/tasks`, `/tasks/{task_id}` |
| **식별자** | **영어** | 변수·함수·클래스·파일명 모두 |
| **주석** | **한국어** | `# 마감 지난 태스크 강조 표시` |

---

## 금지 사항

| 금지 | 이유 | 대안 |
|------|------|------|
| `print()` 디버깅 | 운영 코드에 노이즈 유입, 민감 정보 노출 위험 | `logging` 모듈 사용 (`logger.debug`, `logger.info`) |
| `bare except:` | 모든 예외를 삼켜 오류 원인 추적 불가 | `except ValueError:` 등 구체적 예외 명시 |
| 시크릿 하드코딩 | 코드 노출 시 즉각 보안 사고 | `.env` 파일 + `os.getenv("KEY")` 로 주입 |
| TypeScript `any` 타입 | 타입 정보 소멸 — 타입 시스템 무력화 | 명시적 타입 또는 `unknown` 후 타입 가드 사용 |
| CSS `!important` | 우선순위 충돌 누적 → 유지보수 불가 | 셀렉터 구체성 높이거나 Tailwind 유틸리티 클래스 재구성 |

---

## 테스트 규칙

### 도구

| 항목 | 선택 |
|------|------|
| 프레임워크 | `pytest` |
| 위치 | `backend/tests/test_tasks.py` |
| 실행 | `pytest -v` |

### 필수 케이스

각 엔드포인트마다 **정상 케이스 + 에러 케이스**를 함께 작성한다.

| 엔드포인트 | 정상 케이스 | 에러 케이스 |
|------------|-------------|-------------|
| `POST /tasks` | `201` + 반환 필드 확인 | `title` 누락 → `400` |
| `GET /tasks` | `200` + 배열 반환 | — |
| `GET /tasks/{id}` | `200` + `description` 포함 | 없는 id → `404` |
| `PUT /tasks/{id}` | `200` + `updated_at` 갱신 | 없는 id → `404` |
| `DELETE /tasks/{id}` | `204` + 바디 없음 | 없는 id → `404` |

### 원칙

- 테스트 통과 없이 완료 선언 금지 (`04-tasks.md` 진행 규칙과 동일)
- 테스트용 DB는 인메모리 SQLite 별도 사용 (`":memory:"`)
- 픽스처는 `conftest.py`에 모아 재사용

---

## git 커밋 규칙

### 형식

```
<type>: <한국어 요약>
```

### type 목록

| type | 사용 시점 | 예시 |
|------|-----------|------|
| `feat` | 새 기능 추가 | `feat: POST /tasks 엔드포인트 구현` |
| `fix` | 버그 수정 | `fix: due_at 누락 시 500 오류 수정` |
| `docs` | 문서 변경 | `docs: 02-specs API 응답 예시 보완` |
| `refactor` | 동작 변경 없는 코드 정리 | `refactor: crud.py 함수 분리` |
| `test` | 테스트 추가·수정 | `test: DELETE 404 케이스 추가` |
| `chore` | 빌드·설정·의존성 변경 | `chore: requirements.txt 업데이트` |

### 규칙

- 제목 50자 이내
- 현재형으로 작성 (`구현했다` ❌ → `구현` ✅)
- 본문 필요 시 한 줄 공백 후 추가
- `main` 브랜치 직접 커밋 (MVP 단계, PR 불필요)
- `tasks.db` · `.venv/` · `__pycache__/` · `.env` 는 커밋 제외 (`.gitignore` 관리)

---

## 코드 스타일 요약

### Python

```python
# 임포트 순서: 표준 → 서드파티 → 로컬
from datetime import datetime       # 표준
from fastapi import APIRouter       # 서드파티
from crud import get_task           # 로컬

# 타입 힌트 필수
def get_task(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()

# 구체적 예외 처리
try:
    result = do_something()
except ValueError as e:
    logger.error("값 오류: %s", e)
    raise
```

- 들여쓰기: 공백 4칸
- 줄 길이: 최대 100자
- 문자열: 큰따옴표 `"`

### JavaScript

```js
// 상수는 파일 상단에 선언
const API_BASE = "http://localhost:8000";

// async/await 사용 (Promise 체인 금지)
async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) {
    const err = await res.json();
    showError(err.detail ?? "오류가 발생했습니다.");
    return [];
  }
  return res.json();
}
```

- 들여쓰기: 공백 2칸
- `var` 금지 → `const` / `let` 사용
- `console.log` 디버그 코드 커밋 금지
