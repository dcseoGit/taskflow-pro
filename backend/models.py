from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field, model_validator
from sqlalchemy import Column, DateTime, Integer, String, Text

from database import Base


# ── SQLAlchemy 모델 ──────────────────────────────────────────────────────────

class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    title       = Column(String(200), nullable=False)
    description = Column(Text, nullable=False, default="")
    status      = Column(String(20), nullable=False, default="todo")
    due_at      = Column(DateTime(timezone=True), nullable=True)
    created_at  = Column(DateTime(timezone=True), nullable=False,
                         default=lambda: datetime.now(timezone.utc))
    updated_at  = Column(DateTime(timezone=True), nullable=False,
                         default=lambda: datetime.now(timezone.utc),
                         onupdate=lambda: datetime.now(timezone.utc))


# ── Pydantic 스키마 ──────────────────────────────────────────────────────────

STATUS_VALUES = {"todo", "in_progress", "done"}


class TaskCreate(BaseModel):
    title:       str           = Field(..., min_length=1, max_length=200)
    description: str           = Field(default="")
    status:      str           = Field(default="todo")
    due_at:      Optional[datetime] = None

    model_config = {"str_strip_whitespace": True}

    @model_validator(mode="after")
    def validate_status(self):
        if self.status not in STATUS_VALUES:
            raise ValueError(f"status는 {STATUS_VALUES} 중 하나여야 합니다")
        return self


class TaskUpdate(BaseModel):
    title:       Optional[str]      = Field(default=None, min_length=1, max_length=200)
    description: Optional[str]      = None
    status:      Optional[str]      = None
    due_at:      Optional[datetime] = None

    model_config = {"str_strip_whitespace": True}

    @model_validator(mode="after")
    def validate_status(self):
        if self.status is not None and self.status not in STATUS_VALUES:
            raise ValueError(f"status는 {STATUS_VALUES} 중 하나여야 합니다")
        return self


class TaskListItem(BaseModel):
    """목록 응답 — description 제외"""
    id:         int
    title:      str
    status:     str
    due_at:     Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskResponse(BaseModel):
    """단건 응답 — description 포함"""
    id:          int
    title:       str
    description: str
    status:      str
    due_at:      Optional[datetime]
    created_at:  datetime
    updated_at:  datetime

    model_config = {"from_attributes": True}
