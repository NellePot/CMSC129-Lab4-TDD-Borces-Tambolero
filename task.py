def validate_task(title):
    return bool(title.strip())

def create_task(title):
    if not validate_task(title):
        raise ValueError("Task title cannot be empty")
    return {"title": title.strip(), "status": "pending"}

def update_task_status(task, new_status):
    task["status"] = new_status
    return task