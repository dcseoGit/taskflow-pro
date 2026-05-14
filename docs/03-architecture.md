# 03. 아키텍처 및 폴더 구조

## 전체 구조

```
taskflow-pro/
├── frontend/          # React + Vite
├── backend/           # FastAPI
├── docs/              # 프로젝트 문서
├── docker-compose.yml
└── CLAUDE.md
```

## Frontend 폴더 구조

```
frontend/
├── public/
├── src/
│   ├── assets/          # 이미지, 폰트 등 정적 파일
│   ├── components/      # 재사용 UI 컴포넌트
│   │   └── ui/          # 버튼, 인풋 등 기본 컴포넌트
│   ├── features/        # 도메인별 기능 묶음
│   │   ├── auth/
│   │   ├── tasks/
│   │   └── projects/
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # axios 인스턴스, 유틸 함수
│   ├── pages/           # 라우트 단위 페이지 컴포넌트
│   ├── store/           # Zustand 스토어
│   ├── types/           # 전역 TypeScript 타입
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Backend 폴더 구조

```
backend/
├── app/
│   ├── api/             # 라우터 (엔드포인트)
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── tasks.py
│   │       └── projects.py
│   ├── core/            # 설정, 보안, 의존성 주입
│   │   ├── config.py
│   │   ├── security.py
│   │   └── deps.py
│   ├── models/          # Beanie Document 모델
│   ├── schemas/         # Pydantic 요청/응답 스키마
│   ├── services/        # 비즈니스 로직
│   └── main.py
├── tests/
├── requirements.txt
└── .env.example
```

## 레이어 역할

| 레이어 | 역할 |
|--------|------|
| `api/` | HTTP 요청 수신, 응답 반환. 로직 없음 |
| `services/` | 비즈니스 로직. DB 직접 접근 없음 |
| `models/` | DB 스키마 정의 |
| `schemas/` | 요청/응답 직렬화·검증 |
| `core/` | 전역 설정, 인증, 공통 의존성 |

## 폴더 구조 변경 규칙

- 폴더 구조는 사전 협의 없이 변경하지 않는다.
- 새 도메인 추가 시 `features/` (FE) 또는 `api/v1/` (BE) 하위에 추가한다.
