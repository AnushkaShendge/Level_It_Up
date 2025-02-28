from flask import jsonify, request
from models import (
    employees_collection, departments_collection, tasks_collection, 
    meetings_collection, notifications_collection, chat_messages_collection, 
    serialize_document
)
from openai import OpenAI
from bson.objectid import ObjectId
import datetime
import random

def init_routes(app):
    # OpenAI Client
    openai_client = OpenAI(api_key=app.config["OPENAI_API_KEY"])

    # Helper function to get employee by ID
    def get_employee(employee_id):
        emp = employees_collection.find_one({"id": employee_id})
        return serialize_document(emp) if emp else {"name": "Unknown Employee"}

    # Helper function to get department by ID
    def get_department(dept_id):
        dept = departments_collection.find_one({"id": dept_id})
        return serialize_document(dept) if dept else {"name": "Unknown", "color": "bg-gray-500"}

    # Seed initial data (runs once if collections are empty)
    @app.route("/api/seed", methods=["POST"])
    def seed_data():
        if departments_collection.count_documents({}) == 0:
            sample_departments = [
                {"id": "dept-1", "name": "Marketing", "color": "bg-pink-500", "icon": "Target"},
                {"id": "dept-2", "name": "Technology", "color": "bg-blue-500", "icon": "Zap"},
                {"id": "dept-3", "name": "Operations", "color": "bg-amber-500", "icon": "Settings"},
                {"id": "dept-4", "name": "Finance", "color": "bg-green-500", "icon": "BarChart2"},
                {"id": "dept-5", "name": "HR", "color": "bg-purple-500", "icon": "Users"},
                {"id": "dept-6", "name": "Public Relations", "color": "bg-red-500", "icon": "MessageSquare"},
                {"id": "dept-7", "name": "Customer Support", "color": "bg-cyan-500", "icon": "Phone"},
                {"id": "dept-8", "name": "Research", "color": "bg-indigo-500", "icon": "Clipboard"},
            ]
            departments_collection.insert_many(sample_departments)

        if employees_collection.count_documents({}) == 0:
            sample_employees = [
                {"id": "emp-1", "name": "Emma Thompson", "role": "Marketing Director", "department": "dept-1", "email": "emma@company.com", "phone": "+1 (234) 567-8901", "location": "New York", "avatar": "images.jpeg", "status": "active", "skills": ["Campaign Management", "Content Strategy", "SEO"], "performance": 92, "availableSlots": ["10:00", "13:00", "16:00"]},
                {"id": "emp-2", "name": "Michael Chen", "role": "Marketing Specialist", "department": "dept-1", "email": "michael@company.com", "phone": "+1 (234) 567-8902", "location": "New York", "avatar": "images.jpeg", "status": "active", "skills": ["Social Media", "Email Marketing", "Analytics"], "performance": 88, "availableSlots": ["09:00", "14:00", "15:00"]},
                # Add more employees as per your sample data...
            ]
            employees_collection.insert_many(sample_employees)

        if tasks_collection.count_documents({}) == 0:
            sample_tasks = [
                {"id": "task-1", "title": "Q4 Marketing Campaign Planning", "assignedTo": "emp-1", "department": "dept-1", "dueDate": "2025-03-15", "priority": "high", "status": "in progress", "completion": 65},
                # Add more tasks...
            ]
            tasks_collection.insert_many(sample_tasks)

        if meetings_collection.count_documents({}) == 0:
            sample_meetings = [
                {"id": "meeting-1", "title": "Marketing Strategy Review", "participants": ["emp-1", "emp-2"], "date": "2025-03-05", "time": "10:00", "duration": 60, "location": "Conference Room A"},
                # Add more meetings...
            ]
            meetings_collection.insert_many(sample_meetings)

        if notifications_collection.count_documents({}) == 0:
            sample_notifications = [
                {"id": "notif-1", "type": "task", "message": "Task 'Email Newsletter Campaign' completed", "time": "2 hours ago", "read": False},
                # Add more notifications...
            ]
            notifications_collection.insert_many(sample_notifications)

        return jsonify({"message": "Database seeded successfully"}), 201

    # Departments Endpoints
    @app.route("/api/departments", methods=["GET"])
    def get_departments():
        departments = [serialize_document(dept) for dept in departments_collection.find()]
        return jsonify(departments), 200

    # Employees Endpoints
    @app.route("/api/employees", methods=["GET"])
    def get_employees():
        active_dept = request.args.get("department", "all")
        search_query = request.args.get("search", "")
        
        query = {}
        if active_dept != "all":
            query["department"] = active_dept
        if search_query:
            query["$or"] = [
                {"name": {"$regex": search_query, "$options": "i"}},
                {"role": {"$regex": search_query, "$options": "i"}}
            ]
        
        employees = [serialize_document(emp) for emp in employees_collection.find(query)]
        return jsonify(employees), 200

    @app.route("/api/employees", methods=["POST"])
    def add_employee():
        data = request.json
        data["id"] = f"emp-{datetime.datetime.now().timestamp()}"
        employees_collection.insert_one(data)
        return jsonify(serialize_document(data)), 201

    # Tasks Endpoints
    @app.route("/api/tasks", methods=["GET"])
    def get_tasks():
        active_dept = request.args.get("department", "all")
        query = {}
        if active_dept != "all":
            query["department"] = active_dept
        
        tasks = [serialize_document(task) for task in tasks_collection.find(query)]
        return jsonify(tasks), 200

    @app.route("/api/tasks", methods=["POST"])
    def add_task():
        data = request.json
        data["id"] = f"task-{datetime.datetime.now().timestamp()}"
        tasks_collection.insert_one(data)
        return jsonify(serialize_document(data)), 201

    # Meetings Endpoints
    @app.route("/api/meetings", methods=["GET"])
    def get_meetings():
        meetings = [serialize_document(meeting) for meeting in meetings_collection.find()]
        return jsonify(meetings), 200

    @app.route("/api/meetings", methods=["POST"])
    def add_meeting():
        data = request.json
        data["id"] = f"meeting-{datetime.datetime.now().timestamp()}"
        meetings_collection.insert_one(data)
        
        # Add notification
        notification = {
            "id": f"notif-{datetime.datetime.now().timestamp()}",
            "type": "meeting",
            "message": f"New meeting scheduled: {data['title']}",
            "time": "Just now",
            "read": False
        }
        notifications_collection.insert_one(notification)
        
        return jsonify(serialize_document(data)), 201

    # Notifications Endpoints
    @app.route("/api/notifications", methods=["GET"])
    def get_notifications():
        notifications = [serialize_document(notif) for notif in notifications_collection.find()]
        return jsonify(notifications), 200

    @app.route("/api/notifications/mark-all-read", methods=["POST"])
    def mark_all_notifications_read():
        notifications_collection.update_many({"read": False}, {"$set": {"read": True}})
        return jsonify({"message": "All notifications marked as read"}), 200

    # Chatbot Endpoints
    @app.route("/api/chat", methods=["POST"])
    def chat():
        data = request.json
        message = data.get("message", "")
        user_id = data.get("user_id", "manager")  # Default user_id for demo
        
        # Save user message
        user_message = {
            "id": str(datetime.datetime.now().timestamp()),
            "type": "user",
            "text": message,
            "user_id": user_id,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        chat_messages_collection.insert_one(user_message)

        # Check for scheduling request
        if "schedule" in message.lower() and ("meeting" in message.lower() or "meet" in message.lower()):
            target_dept = None
            for dept in departments_collection.find():
                if dept["name"].lower() in message.lower():
                    target_dept = serialize_document(dept)
                    break
            
            if target_dept:
                # Simulate scheduling logic with OpenAI
                dept_employees = [serialize_document(emp) for emp in employees_collection.find({"department": target_dept["id"]})]
                available_slots = set.intersection(*[set(emp["availableSlots"]) for emp in dept_employees])
                suggested_time = random.choice(list(available_slots)) if available_slots else "14:00"
                
                bot_response = {
                    "id": str(datetime.datetime.now().timestamp()),
                    "type": "bot",
                    "text": f"Based on availability, I recommend scheduling a meeting with the {target_dept['name']} team tomorrow at {suggested_time}. Shall I proceed?",
                    "user_id": user_id,
                    "timestamp": datetime.datetime.utcnow().isoformat(),
                    "scheduling": {
                        "department": target_dept,
                        "suggestedTime": suggested_time,
                        "participants": [emp["id"] for emp in dept_employees]
                    }
                }
            else:
                bot_response = {
                    "id": str(datetime.datetime.now().timestamp()),
                    "type": "bot",
                    "text": "I'll help you schedule a meeting. Which team would you like to meet with?",
                    "user_id": user_id,
                    "timestamp": datetime.datetime.utcnow().isoformat()
                }
        else:
            # General OpenAI response
            response = openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an AI assistant for an employee management system. Help with scheduling, tasks, and team updates."},
                    {"role": "user", "content": message}
                ]
            )
            bot_response = {
                "id": str(datetime.datetime.now().timestamp()),
                "type": "bot",
                "text": response.choices[0].message.content,
                "user_id": user_id,
                "timestamp": datetime.datetime.utcnow().isoformat()
            }
        
        chat_messages_collection.insert_one(bot_response)
        return jsonify(serialize_document(bot_response)), 200

    @app.route("/api/chat/history", methods=["GET"])
    def get_chat_history():
        user_id = request.args.get("user_id", "manager")
        messages = [serialize_document(msg) for msg in chat_messages_collection.find({"user_id": user_id}).sort("timestamp", 1)]
        return jsonify(messages), 200

    @app.route("/api/schedule-meeting", methods=["POST"])
    def schedule_meeting():
        data = request.json
        meeting = {
            "id": f"meeting-{datetime.datetime.now().timestamp()}",
            "title": f"{data['department']['name']} Team Meeting",
            "participants": data["participants"],
            "date": "2025-03-01",  # Tomorrow's date, adjust as needed
            "time": data["suggestedTime"],
            "duration": 60,
            "location": "Conference Room B"
        }
        meetings_collection.insert_one(meeting)

        # Add notification
        notification = {
            "id": f"notif-{datetime.datetime.now().timestamp()}",
            "type": "confirmation",
            "message": f"Meeting with {data['department']['name']} team scheduled for tomorrow at {data['suggestedTime']}",
            "time": "Just now",
            "read": False
        }
        notifications_collection.insert_one(notification)

        return jsonify(serialize_document(meeting)), 201