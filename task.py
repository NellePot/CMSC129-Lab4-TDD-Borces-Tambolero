_counter = 0

def validate_task(title):
    return bool(title and title.strip())

def create_task(title, deadline=None, duetime=None, status="pending", priority="mid", created_at=None):
    global _counter
    if not validate_task(title):
        raise ValueError("Task title cannot be empty")
    _counter += 1
    return {
        "id": _counter,
        "title": title.strip(),
        "deadline": deadline,
        "duetime": duetime,
        "status": status,
        "priority": priority,
        "created_at": created_at or "",
    }

def update_task_status(task, new_status):
    task["status"] = new_status
    return task