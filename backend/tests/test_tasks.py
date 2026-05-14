"""
05-conventions.md 테스트 매트릭스 검증
엔드포인트별 정상 케이스 + 에러 케이스
"""


def create_sample(client, **kwargs):
    """테스트용 태스크 생성 헬퍼"""
    payload = {"title": "샘플 태스크", **kwargs}
    res = client.post("/tasks", json=payload)
    assert res.status_code == 201
    return res.json()


# ── POST /tasks ────────────────────────────────────────────────────────────

class TestCreateTask:
    def test_201_returns_all_fields(self, client):
        """정상: 201 + 반환 필드 확인"""
        res = client.post("/tasks", json={
            "title": "신규 태스크",
            "description": "설명",
            "status": "todo",
            "due_at": "2026-06-01T18:00:00",
        })
        assert res.status_code == 201
        body = res.json()
        assert body["title"] == "신규 태스크"
        assert body["description"] == "설명"
        assert body["status"] == "todo"
        assert body["due_at"] is not None
        assert "id" in body
        assert "created_at" in body
        assert "updated_at" in body

    def test_201_without_optional_fields(self, client):
        """정상: 선택 필드 없이 title만으로 생성"""
        res = client.post("/tasks", json={"title": "최소 태스크"})
        assert res.status_code == 201
        body = res.json()
        assert body["status"] == "todo"
        assert body["description"] == ""
        assert body["due_at"] is None

    def test_400_missing_title(self, client):
        """에러: title 누락 → 400"""
        res = client.post("/tasks", json={"status": "todo"})
        assert res.status_code == 422  # Pydantic 필수값 누락은 422

    def test_400_empty_title(self, client):
        """에러: title 빈 문자열 → 422"""
        res = client.post("/tasks", json={"title": ""})
        assert res.status_code == 422

    def test_400_invalid_status(self, client):
        """에러: 허용되지 않는 status 값 → 422"""
        res = client.post("/tasks", json={"title": "태스크", "status": "invalid"})
        assert res.status_code == 422


# ── GET /tasks ─────────────────────────────────────────────────────────────

class TestListTasks:
    def test_200_returns_array(self, client):
        """정상: 200 + 배열 반환"""
        res = client.get("/tasks")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_200_empty_array_when_no_tasks(self, client):
        """정상: 태스크 없을 때 빈 배열"""
        res = client.get("/tasks")
        assert res.status_code == 200
        assert res.json() == []

    def test_200_excludes_description(self, client):
        """정상: 목록 응답에 description 미포함"""
        create_sample(client, description="숨겨야 할 설명")
        res = client.get("/tasks")
        assert res.status_code == 200
        for task in res.json():
            assert "description" not in task

    def test_200_ordered_by_created_at_desc(self, client):
        """정상: created_at 내림차순 정렬"""
        create_sample(client, title="첫 번째")
        create_sample(client, title="두 번째")
        res = client.get("/tasks")
        tasks = res.json()
        assert tasks[0]["title"] == "두 번째"
        assert tasks[1]["title"] == "첫 번째"


# ── GET /tasks/{id} ────────────────────────────────────────────────────────

class TestGetTask:
    def test_200_includes_description(self, client):
        """정상: 200 + description 포함"""
        task = create_sample(client, description="상세 설명")
        res = client.get(f"/tasks/{task['id']}")
        assert res.status_code == 200
        body = res.json()
        assert "description" in body
        assert body["description"] == "상세 설명"

    def test_200_returns_all_fields(self, client):
        """정상: 전체 필드 반환"""
        task = create_sample(client)
        res = client.get(f"/tasks/{task['id']}")
        body = res.json()
        for field in ("id", "title", "description", "status", "due_at", "created_at", "updated_at"):
            assert field in body

    def test_404_nonexistent_id(self, client):
        """에러: 없는 id → 404"""
        res = client.get("/tasks/99999")
        assert res.status_code == 404
        assert res.json()["detail"] == "Task not found"


# ── PUT /tasks/{id} ────────────────────────────────────────────────────────

class TestUpdateTask:
    def test_200_partial_update(self, client):
        """정상: 200 + 전달한 필드만 변경"""
        task = create_sample(client, title="원본 제목", status="todo")
        res = client.put(f"/tasks/{task['id']}", json={"status": "in_progress"})
        assert res.status_code == 200
        body = res.json()
        assert body["status"] == "in_progress"
        assert body["title"] == "원본 제목"  # 변경하지 않은 필드 유지

    def test_200_updated_at_changes(self, client):
        """정상: updated_at 갱신"""
        task = create_sample(client)
        res = client.put(f"/tasks/{task['id']}", json={"title": "수정된 제목"})
        assert res.status_code == 200
        body = res.json()
        assert body["updated_at"] >= task["updated_at"]

    def test_404_nonexistent_id(self, client):
        """에러: 없는 id → 404"""
        res = client.put("/tasks/99999", json={"title": "없는 태스크"})
        assert res.status_code == 404
        assert res.json()["detail"] == "Task not found"


# ── DELETE /tasks/{id} ─────────────────────────────────────────────────────

class TestDeleteTask:
    def test_204_no_body(self, client):
        """정상: 204 + 바디 없음"""
        task = create_sample(client)
        res = client.delete(f"/tasks/{task['id']}")
        assert res.status_code == 204
        assert res.content == b""

    def test_204_removed_from_list(self, client):
        """정상: 삭제 후 목록에서 제거"""
        task = create_sample(client)
        client.delete(f"/tasks/{task['id']}")
        res = client.get("/tasks")
        assert all(t["id"] != task["id"] for t in res.json())

    def test_404_nonexistent_id(self, client):
        """에러: 없는 id → 404"""
        res = client.delete("/tasks/99999")
        assert res.status_code == 404
        assert res.json()["detail"] == "Task not found"
