# Task Manager App
 
A simple Task Manager web application that allows users to create, view, update, and delete tasks. The app uses an in-memory data store — no database required.

Live URL: https://cmsc129-lab4-tdd-borces-tambolero.onrender.com 
 
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

## Test Results

### Unit Testing with TDD 

**Local terminal output:**
<img width="1920" height="1020" alt="Screenshot 2026-05-17 025313" src="https://github.com/user-attachments/assets/7db5719f-ff3e-44c4-8bc6-79cc8b33454e" />
<img width="1920" height="371" alt="Screenshot 2026-05-17 025400" src="https://github.com/user-attachments/assets/1e5bbbf7-092b-4f55-8e46-68628bc9276f" />
<img width="1402" height="262" alt="Screenshot 2026-05-17 030105" src="https://github.com/user-attachments/assets/68faaf18-ff03-4a41-9d7d-d0d92c56cd94" />

**GitHub Actions:**
<img width="1920" height="912" alt="Screenshot 2026-05-17 030431" src="https://github.com/user-attachments/assets/d2045508-d4c6-46ce-b515-8260367e97ac" />

### Integration Testing with TDD

**Local terminal output:**
<img width="1918" height="1078" alt="Screenshot 2026-05-17 070907" src="https://github.com/user-attachments/assets/0bc4e5a5-98f0-444e-828c-a546d0cd0261" />
<img width="1918" height="1078" alt="Screenshot 2026-05-17 070919" src="https://github.com/user-attachments/assets/eb8e241f-13d3-467d-a34d-325c44885f1a" />
<img width="1918" height="1078" alt="Screenshot 2026-05-17 071250" src="https://github.com/user-attachments/assets/3e7aa48f-13cd-47b8-9217-8307cc3932e6" />

**GitHub Actions:**
<img width="1292" height="350" alt="image" src="https://github.com/user-attachments/assets/1badebef-a930-4d73-98f7-d7b6ee8907f6" />

### System Testing with TDD

**Local terminal output:**
<img width="1787" height="918" alt="Screenshot 2026-05-18 093805" src="https://github.com/user-attachments/assets/4d585636-0387-4372-aa15-f3abbdc4562d" />
<img width="1918" height="972" alt="Screenshot 2026-05-18 105024" src="https://github.com/user-attachments/assets/68809ff0-88a6-4710-ae10-941a9db79fef" />
<img width="1918" height="1017" alt="Screenshot 2026-05-18 143701" src="https://github.com/user-attachments/assets/b75768b9-72fd-4c7c-ac52-7799bab9ee1a"/>

**GitHub Actions:**
<img width="1207" height="857" alt="image" src="https://github.com/user-attachments/assets/29775644-b932-462a-956f-1601594b6b4e" />

## Reflection 
The hardest part was trying to write tests for something that didn't exist yet. We had to decide what class names and data-testid attributes to use before we even had an HTML file. It felt weird because normally, we just write the code first and figure out the details as you go. We also kept second guessing ourselves like so it was hard to know how specific to be without actually seeing the UI yet.  

That said, writing tests first genuinely changed how we approached the project . Normally, we just start coding and figure out the structure as we go but with TDD we had to think about how everything was going to connect before writing anything. It made us more intentional with our decisions like what to name things and how the features should behave. We also caught problems earlier than we normally would have because the tests would immediately tell us when something wasn't working the way it was supposed to. Overall it made the whole process more organized even if it felt slower at the start. 














