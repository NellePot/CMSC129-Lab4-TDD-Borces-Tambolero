def validate_task(title):
    return len(title.strip()) > 0

def create_task(title):
    return {"title": title, "status": "pending"}

def update_task_status(task, new_status):
    task["status"] = new_status
    return task