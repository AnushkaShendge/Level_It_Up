from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB Connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_default_database()

# Collections
employees_collection = db["employees"]
departments_collection = db["departments"]
tasks_collection = db["tasks"]
meetings_collection = db["meetings"]
notifications_collection = db["notifications"]
chat_messages_collection = db["chat_messages"]

# Helper function to convert MongoDB ObjectId to string
def serialize_document(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc