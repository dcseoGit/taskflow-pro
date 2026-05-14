# TaskFlow Pro

> 팀 업무 관리 풀스택 웹 앱 — "지금 누가 뭐 해?"라는 질문이 사라지게 한다.

---

## 주요 기능

- 태스크 **추가 / 목록 / 수정 / 삭제** (CRUD 4종 화면 동작)
- **상태 분류**: 할 일 · 진행 중 · 완료
- **마감 시각**: 날짜 + 시간 지정 (D-N HH:MM 형식 표시, 경고 색상)
- **라이트 / 다크 테마** 토글 — `localStorage` 유지
- **모바일 반응형** — 360px 기준

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 백엔드 | Python 3.11+ · FastAPI · Uvicorn · SQLAlchemy 2.0 |
| DB | SQLite (개발) → PostgreSQL (운영) |
| 프론트엔드 | Vanilla JS · Tailwind CSS CDN |
| 테스트 | pytest · httpx · TestClient |

---

## 프로젝트 구조

```
taskflow-pro/
├── docs/                  # 설계 문서 6종
│   ├── 00-overview.md
│   ├── 01-product.md
│   ├── 02-specs.md
│   ├── 03-design.md
│   ├── 04-tasks.md
│   └── 05-conventions.md
├── backend/
│   ├── main.py            # FastAPI 진입점
│   ├── database.py        # SQLite 연결
│   ├── models.py          # SQLAlchemy 모델 + Pydantic 스키마
│   ├── crud.py            # DB 접근 함수
│   ├── routers/tasks.py   # /tasks 엔드포인트
│   ├── tests/             # pytest 테스트
│   └── requirements.txt
└── frontend/
    ├── index.html         # 단일 페이지
    └── app.js             # Fetch API · DOM 조작
```

---

## 로컬 실행

### 백엔드

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --reload
```

- API 서버: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

### 프론트엔드

```bash
cd frontend
python -m http.server 3000
```

브라우저에서 `http://localhost:3000` 열기

### 테스트

```bash
cd backend
pytest tests/ -v
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 | 응답 |
|--------|------|------|------|
| `POST` | `/tasks` | 태스크 생성 | 201 |
| `GET` | `/tasks` | 목록 조회 | 200 |
| `GET` | `/tasks/{id}` | 단건 조회 | 200 |
| `PUT` | `/tasks/{id}` | 부분 수정 | 200 |
| `DELETE` | `/tasks/{id}` | 삭제 | 204 |

---

## 성공 기준 (MVP)

| # | 기준 | 확인 방법 |
|---|------|-----------|
| 1 | 새로고침 후 데이터 유지 | 태스크 생성 → F5 → 목록에 존재 |
| 2 | 360px 레이아웃 | DevTools → 너비 360px |
| 3 | API 응답 200ms 이하 | Network 탭 |
| 4 | CRUD 4종 화면 동작 | 생성 → 조회 → 수정 → 삭제 |
| 5 | 테마 토글 | 🌙 클릭 → F5 → 유지 |
