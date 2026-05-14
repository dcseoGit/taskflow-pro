# 05. API 명세

## 기본 정보

- Base URL: `http://localhost:8000/api/v1`
- 인증: Bearer Token (JWT)
- 응답 형식: JSON

## 인증

### POST /auth/register
회원가입

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "string"
}
```

**Response 201**
```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

---

### POST /auth/login
로그인

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response 200**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

---

## 태스크

### GET /tasks
태스크 목록 조회

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| project_id | string | 프로젝트 필터 (선택) |
| status | string | 상태 필터: `todo` / `in_progress` / `done` (선택) |
| page | int | 페이지 번호 (기본값: 1) |
| size | int | 페이지 크기 (기본값: 20) |

**Response 200**
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 20
}
```

---

### POST /tasks
태스크 생성

**Request Body**
```json
{
  "title": "string",
  "description": "string",
  "project_id": "string",
  "assignee_id": "string",
  "due_date": "2024-12-31T00:00:00Z",
  "status": "todo"
}
```

**Response 201**: 생성된 태스크 객체

---

### GET /tasks/{task_id}
태스크 단건 조회

**Response 200**: 태스크 객체

---

### PATCH /tasks/{task_id}
태스크 수정 (부분 업데이트)

**Request Body**: 수정할 필드만 포함

**Response 200**: 수정된 태스크 객체

---

### DELETE /tasks/{task_id}
태스크 삭제

**Response 204**: No Content

---

## 프로젝트

### GET /projects
프로젝트 목록 조회

### POST /projects
프로젝트 생성

### GET /projects/{project_id}
프로젝트 단건 조회

### PATCH /projects/{project_id}
프로젝트 수정

### DELETE /projects/{project_id}
프로젝트 삭제

---

## 공통 에러 응답

```json
{
  "detail": "에러 메시지"
}
```

| 상태 코드 | 의미 |
|-----------|------|
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 422 | 유효성 검사 실패 |
| 500 | 서버 오류 |
