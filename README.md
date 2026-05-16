# Task Manager App
 
A simple Task Manager web application that allows users to create, view, update, and delete tasks. The app uses an in-memory data store — no database required.
 
---
 
## User Stories
 
1. As a student, I want to add a task, so that I can keep track of my school requirements.
2. As a student, I want to view my task list, so that I can see what I need to accomplish.
3. As a student, I want to update or delete a task, so that I can manage changes in my workload.
---
 
## Tech Stack
 
- **Backend:** Flask
- **Frontend:** HTML, CSS
- **Unit Testing:** pytest
- **Integration Testing:** pytest with Flask test client
- **System Testing:** Playwright for Python
- **Data Storage:** In-memory Python list
---
 
## Setup Instructions
 
### Prerequisites
 
Make sure you have the following installed before getting started:
 
- Python 3.8 or higher
- pip (Python package manager)
- Git
### 1. Clone the repository
 
```bash
git clone <repository-url>
cd <repository-folder>
```
 
### 2. Create and activate a virtual environment
 
**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```
 
**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```
 
### 3. Install dependencies
 
```bash
pip install -r requirements.txt
```
 
If there is no `requirements.txt` yet, install the packages manually:
 
```bash
pip install flask pytest playwright
playwright install
```
 
### 4. Run the application
 
```bash
flask run
```
 
The app will be available at `http://127.0.0.1:5000`.
 
### 5. Run the tests
 
**Unit and integration tests:**
```bash
pytest
```
 
**System tests (Playwright):**
```bash
pytest tests/system/
```
 
---
 
## Testing Strategy
 
This project follows the **Red-Green-Refactor** cycle of Test-Driven Development (TDD). Tests are written before the implementation code.
 
- **Red** — commit contains failing tests (no implementation yet)
- **Green** — commit contains the minimum code needed to make the tests pass
- **Refactor** — commit improves code structure without changing behavior
### Unit Testing
 
Unit tests focus on isolated task-related logic. They do not use HTTP requests, a browser, or a database. They verify that:
 
- An empty task title is rejected.
- A task is created with a default status of `pending`.
- A task status can be updated from `pending` to `done`.
### Integration Testing
 
Integration tests check whether the application routes work correctly with the task logic and in-memory data store. They make real HTTP requests using the Flask test client and verify the returned status codes and response data.
 
Planned tests:
- `POST /tasks` should create a new task and return the created task.
- `GET /tasks` should return the current list of tasks.
### System Testing
 
System tests simulate real user actions in a browser using Playwright. Each test corresponds to one user story and checks whether users can complete the main task management flows through the web interface.
 
Planned tests:
- A user can add a task using the task form.
- A user can view the added task in the task list.
- A user can update or delete a task from the page.
