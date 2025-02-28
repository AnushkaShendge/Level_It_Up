from flask import Flask, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import random

# Load environment variables
load_dotenv()

app = Flask(__name__)

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_default_database()

# Collections
tasks_collection = db.tasks
agents_collection = db.agents
insights_collection = db.insights
notifications_collection = db.notifications

# Helper functions
def random_time():
    hour = random.randint(0, 23)
    minute = random.randint(0, 3) * 15
    return {"hour": hour, "minute": minute}

def random_duration():
    return random.randint(1, 8) * 15 + 15

def generate_task(id):
    task_types = [
        "Email follow-up", "Review document", "Prepare presentation", "Client meeting",
        "Team sync", "Research", "Create report", "Code review"
    ]
    companies = ["Acme Corp", "TechGiant", "Innovatech", "Global Systems"]
    people = ["Alex Morgan", "Jamie Lee", "Sam Williams", "Taylor Chen"]
    
    agent_types = [
        {"id": "email-agent", "name": "Email Manager", "gradient": "from-blue-500 to-cyan-400"},
        {"id": "meeting-agent", "name": "Meeting Organizer", "gradient": "from-indigo-500 to-purple-400"},
        {"id": "research-agent", "name": "Research Assistant", "gradient": "from-purple-500 to-pink-400"}
    ]
    
    task_type = random.choice(task_types)
    company = random.choice(companies)
    person = random.choice(people)
    agent = random.choice(agent_types)
    start_time = random_time()
    duration = random_duration()

    return {
        "id": f"task-{id}",
        "title": f"{task_type} with {person} from {company}",
        "startHour": start_time["hour"],
        "startMinute": start_time["minute"],
        "duration": duration,
        "priority": random.choice(["critical", "high", "medium", "low"]),
        "status": random.choice(["pending", "scheduled", "inProgress", "completed"]),
        "agent": agent["id"],
        "agentName": agent["name"],
        "gradient": agent["gradient"],
        "date": datetime.now().isoformat(),
        "progress": random.uniform(0, 100),
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }

def generate_agent(id):
    agent_types = [
        {"id": "email-agent", "name": "Email Manager", "gradient": "from-blue-500 to-cyan-400"},
        {"id": "meeting-agent", "name": "Meeting Organizer", "gradient": "from-indigo-500 to-purple-400"},
        {"id": "research-agent", "name": "Research Assistant", "gradient": "from-purple-500 to-pink-400"}
    ]
    agent = agent_types[id % len(agent_types)]
    return {
        "id": agent["id"],
        "name": agent["name"],
        "gradient": agent["gradient"],
        "status": "active",
        "tasksCompleted": random.randint(0, 50),
        "efficiency": random.randint(85, 100),
        "load": random.randint(0, 100)
    }

def generate_insight(id):
    insight_types = [
        {"title": "Productivity Peak", "description": "Most productive between 9AM-11AM", "color": "from-green-500 to-emerald-600"},
        {"title": "Email Overload", "description": "Batch process emails at 2PM", "color": "from-blue-500 to-indigo-600"}
    ]
    insight = random.choice(insight_types)
    return {
        "id": f"insight-{id}",
        "title": insight["title"],
        "description": insight["description"],
        "color": insight["color"],
        "value": random.randint(0, 100),
        "change": round(random.uniform(-20, 40), 1)
    }

def generate_task(id):
    task_types = [
        "Email follow-up", "Review document", "Prepare presentation", "Client meeting",
        "Team sync", "Research", "Create report", "Code review"
    ]
    companies = ["Acme Corp", "TechGiant", "Innovatech", "Global Systems"]
    people = ["Alex Morgan", "Jamie Lee", "Sam Williams", "Taylor Chen"]
    
    agent_types = [
        {"id": "email-agent", "name": "Email Manager", "gradient": "from-blue-500 to-cyan-400"},
        {"id": "meeting-agent", "name": "Meeting Organizer", "gradient": "from-indigo-500 to-purple-400"},
        {"id": "research-agent", "name": "Research Assistant", "gradient": "from-purple-500 to-pink-400"}
    ]
    
    task_type = random.choice(task_types)
    company = random.choice(companies)
    person = random.choice(people)
    agent = random.choice(agent_types)
    start_time = random_time()
    duration = random_duration()

    return {
        "id": f"task-{id}",
        "title": f"{task_type} with {person} from {company}",
        "startHour": start_time["hour"],
        "startMinute": start_time["minute"],
        "duration": duration,
        "priority": random.choice(["critical", "high", "medium", "low"]),
        "status": random.choice(["pending", "scheduled", "inProgress", "completed"]),
        "agent": agent["id"],
        "agentName": agent["name"],
        "gradient": agent["gradient"],
        "date": datetime.now().isoformat(),
        "progress": random.uniform(0, 100),
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }


@app.route('/clone-voice', methods=['POST'])
def clone_voice():
    """
    Clone a user's voice by uploading an audio sample.
    Returns a unique `voice_id`.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    user_id = request.form.get("user_id")  # Associate the voice with a user

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    files = {"files": (file.filename, file.stream, file.mimetype)}
    data = {"name": f"Voice_{user_id}"}

    response = requests.post(
        "https://api.elevenlabs.io/v1/voices/add",
        headers=HEADERS,
        data=data,
        files=files
    )

    if response.status_code != 200:
        return jsonify({"error": response.json()}), 500

    voice_id = response.json().get("voice_id")
    voice_database[user_id] = voice_id  # Store in memory (Use DB in production)

    return jsonify({"message": "Voice cloned successfully", "voice_id": voice_id})


@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    """
    Converts input text into speech using a cloned voice.
    Requires `user_id` to retrieve the stored `voice_id`.
    """
    data = request.json
    user_id = data.get("user_id")
    text = data.get("text")

    if not user_id or not text:
        return jsonify({"error": "User ID and text are required"}), 400

    voice_id = voice_database.get(user_id)
    if not voice_id:
        return jsonify({"error": "Voice not found. Clone voice first."}), 404

    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    tts_data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}
    }

    response = requests.post(tts_url, headers={**HEADERS, "Content-Type": "application/json"}, json=tts_data)

    if response.status_code != 200:
        return jsonify({"error": response.json()}), 500

    audio_path = f"static/audio_{user_id}.mp3"
    with open(audio_path, "wb") as f:
        f.write(response.content)

    return jsonify({"message": "Speech generated successfully", "audio_url": f"/{audio_path}"})

# API Routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    date = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    tasks = list(tasks_collection.find({"date": {"$regex": f"^{date}"}}))
    for task in tasks:
        task['_id'] = str(task['_id'])  # Convert ObjectId to string
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    task_data = request.json
    if not task_data:
        task_data = generate_task(str(datetime.now().timestamp()))
    task_id = tasks_collection.insert_one(task_data).inserted_id
    task_data['_id'] = str(task_id)
    return jsonify(task_data), 201

@app.route('/api/agents', methods=['GET'])
def get_agents():
    agents = list(agents_collection.find())
    for agent in agents:
        agent['_id'] = str(agent['_id'])
    return jsonify(agents)

@app.route('/api/agents', methods=['POST'])
def create_agent():
    agent_data = generate_agent(int(datetime.now().timestamp()))
    agent_id = agents_collection.insert_one(agent_data).inserted_id
    agent_data['_id'] = str(agent_id)
    return jsonify(agent_data), 201

@app.route('/api/insights', methods=['GET'])
def get_insights():
    insights = list(insights_collection.find().limit(3))
    for insight in insights:
        insight['_id'] = str(insight['_id'])
    return jsonify(insights)

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    notifications = list(notifications_collection.find().sort("time", -1).limit(5))
    for notification in notifications:
        notification['_id'] = str(notification['_id'])
    return jsonify(notifications)

@app.route('/api/notifications', methods=['POST'])
def create_notification():
    notification = {
        "text": request.json.get("text", "System update"),
        "time": datetime.now().strftime('%H:%M:%S'),
        "type": request.json.get("type", "info")
    }
    notification_id = notifications_collection.insert_one(notification).inserted_id
    notification['_id'] = str(notification_id)
    return jsonify(notification), 201

@app.route('/api/init', methods=['GET'])
def initialize_data():
    # Clear existing data
    tasks_collection.delete_many({})
    agents_collection.delete_many({})
    insights_collection.delete_many({})
    notifications_collection.delete_many({})

    # Initialize tasks
    initial_tasks = [generate_task(i) for i in range(15)]
    tasks_collection.insert_many(initial_tasks)

    # Initialize agents
    initial_agents = [generate_agent(i) for i in range(3)]
    agents_collection.insert_many(initial_agents)

    # Initialize insights
    initial_insights = [generate_insight(i) for i in range(3)]
    insights_collection.insert_many(initial_insights)

    # Initialize notification
    notifications_collection.insert_one({
        "text": "AI Calendar System initialized",
        "time": datetime.now().strftime('%H:%M:%S'),
        "type": "info"
    })

    return jsonify({"message": "Database initialized"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7000)