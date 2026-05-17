from playwright.sync_api import expect

BASE_URL = "http://127.0.0.1:5000"


# User Story 1: As a student, I want to add a task,
# so that I can keep track of my school requirements.
def test_add_task(page):
    page.goto(BASE_URL)

    page.fill('[data-testid="task-title-input"]', "Submit assignment")
    page.click('[data-testid="add-task-button"]')

    expect(page.get_by_text("Submit assignment")).to_be_visible()


# User Story 2: As a student, I want to view my task list,
# so that I can see what I need to accomplish.
def test_view_task_list(page):
    page.goto(BASE_URL)

    page.fill('[data-testid="task-title-input"]', "Review for exam")
    page.click('[data-testid="add-task-button"]')

    expect(page.locator('[data-testid="task-list"]')).to_contain_text("Review for exam")


# User Story 3: As a student, I want to update or delete a task,
# so that I can manage changes in my workload.
def test_update_and_delete_task(page):
    page.goto(BASE_URL)

    page.fill('[data-testid="task-title-input"]', "Clean notes")
    page.click('[data-testid="add-task-button"]')

    page.click('[data-testid="mark-done-button"]')
    expect(page.locator('[data-testid="task-list"]')).to_contain_text("done")

    page.click('[data-testid="delete-task-button"]')
    expect(page.get_by_text("Clean notes")).not_to_be_visible()