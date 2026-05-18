from flask import Flask, jsonify, request, render_template
from task import create_task

app = Flask(__name__)

tasks = []

@app.route("/")
def home():
    return render_template("index.html", name="Student")

@app.route("/tasks", methods=["GET"])
def get_tasks():
    sort_by = request.args.get("sort", "date_added")

    sorted_tasks = list(tasks)

    if sort_by == "deadline":
        sorted_tasks.sort(key=lambda t: t.get("deadline") or "9999")
    elif sort_by == "priority":
        priority_order = {"important": 0, "mid": 1, "easy": 2}
        sorted_tasks.sort(key=lambda t: priority_order.get(t.get("priority"), 99))

    return jsonify(sorted_tasks), 200

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json(silent=True) or {}
    title    = data.get("title", "")
    deadline = data.get("deadline", "")
    duetime  = data.get("duetime", "")
    status   = data.get("status", "pending")
    priority = data.get("priority", "mid")
    created_at = data.get("created_at", "")

    try:
        task = create_task(title, deadline, duetime, status, priority, created_at)
        tasks.append(task)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify(task), 201

@app.route("/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    data = request.get_json(silent=True) or {}
    for task in tasks:
        if task["id"] == task_id:
            allowed = {"title", "deadline", "duetime", "status", "priority"}
            for k, v in data.items():
                if k in allowed:
                    task[k] = v
            return jsonify(task), 200
    return jsonify({"error": "not found"}), 404

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return jsonify({"message": "deleted"}), 200

@app.route("/tasks/reset", methods=["POST"])
def reset_tasks():
    global tasks
    tasks = []
    return jsonify({"message": "reset"}), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)