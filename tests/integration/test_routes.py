import pytest
from src.app import app, tasks


@pytest.fixture(autouse=True)
def clear_tasks():
    tasks.clear()
    yield
    tasks.clear()


def test_get_tasks_returns_empty_list():
    client = app.test_client()

    response = client.get("/tasks")

    assert response.status_code == 200
    assert response.get_json() == []


def test_post_tasks_creates_task():
    client = app.test_client()

    response = client.post("/tasks", json={
        "title": "Submit assignment"
    })

    assert response.status_code == 201

    data = response.get_json()
    assert data["title"] == "Submit assignment"
    assert data["status"] == "pending"