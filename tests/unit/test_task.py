import pytest
from src.task import validate_task, create_task, update_task_status

# User Story 1: As a student, I want to add a task
def test_reject_empty_title():
    assert validate_task("") == False

# User Story 2: As a student, I want to view my task list
def test_create_task_with_default_status():
    task = create_task("Submit assignment")
    assert task["status"] == "pending"

# User Story 3: As a student, I want to update or delete a task
def test_update_task_status():
    task = create_task("Submit assignment")
    updated = update_task_status(task, "done")
    assert updated["status"] == "done"