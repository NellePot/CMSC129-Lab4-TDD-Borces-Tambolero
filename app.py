from flask import Flask, jsonify, request
from task import create_task

app = Flask(__name__)

tasks = []

def save_task(title):
    task = create_task(title)
    tasks.append(task)
    return task


@app.route("/")
def home():
    return "Task Manager running"

@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks), 200

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "")

    try:
        task = save_task(title)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    
    return jsonify(task), 201