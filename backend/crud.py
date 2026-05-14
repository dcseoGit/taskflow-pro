from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from models import Task, TaskCreate, TaskUpdate


def create_task(db: Session, task_in: TaskCreate) -> Task:
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        due_at=task_in.due_at,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task_list(db: Session) -> list[Task]:
    return db.query(Task).order_by(Task.created_at.desc()).all()


def get_task(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def update_task(db: Session, task: Task, task_in: TaskUpdate) -> Task:
    # 전달된 필드만 덮어쓴다 (None이면 기존 값 유지)
    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.status is not None:
        task.status = task_in.status
    if task_in.due_at is not None:
        task.due_at = task_in.due_at

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
