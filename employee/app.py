from flask import jsonify, request, Response, abort, make_response, current_app, g
from models import (
    employees_collection, departments_collection, tasks_collection, 
    meetings_collection, notifications_collection, chat_messages_collection, 
    serialize_document, performance_metrics_collection, feedback_collection,
    projects_collection, timesheet_collection, expenses_collection,
    training_collection, equipment_collection, documents_collection
)
from openai import OpenAI
from bson.objectid import ObjectId
import datetime
import random
import time
import json
import logging
import uuid
import hashlib
import base64
import re
import os
import sys
import math
import statistics
import calendar
import pytz
from typing import List, Dict, Any, Optional, Union, Tuple
from functools import wraps
from dateutil.relativedelta import relativedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import threading
import queue
import requests

# Set up logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app_routes.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Global variables for caching
CACHE = {}
CACHE_TIMEOUT = 300  # 5 minutes
LAST_CACHE_CLEANUP = time.time()

def init_routes(app):
    """
    Initialize all routes for the application.
    This function sets up all API endpoints, helper functions,
    middleware, and other route-related functionality.
    
    Args:
        app (Flask): The Flask application instance to configure routes for.
        
    Returns:
        None
    
    Note:
        This is a comprehensive initialization that covers all aspects
        of the application's API surface.
    """
    # Initialize performance monitoring
    init_performance_monitoring(app)
    
    # OpenAI Client initialization with error handling and retries
    openai_api_key = app.config.get("OPENAI_API_KEY")
    if not openai_api_key:
        logger.critical("OpenAI API key not found in configuration!")
        openai_api_key = os.environ.get("OPENAI_API_KEY", "")
        if not openai_api_key:
            logger.critical("OpenAI API key not found in environment variables!")
            raise ValueError("OpenAI API key must be provided")
    
    try:
        openai_client = OpenAI(
            api_key=openai_api_key,
            timeout=30.0,
            max_retries=3
        )
        logger.info("OpenAI client initialized successfully")
    except Exception as e:
        logger.critical(f"Failed to initialize OpenAI client: {str(e)}")
        raise

    # Register middleware for request processing
    register_middleware(app)
    
    # Configure CORS settings
    configure_cors(app)
    
    # Setup error handlers
    setup_error_handlers(app)
    
    # ======================================================================
    # Helper Functions Section
    # ======================================================================
    
    def get_cache_key(prefix, *args):
        """
        Generate a cache key based on prefix and arguments.
        
        Args:
            prefix (str): Prefix for the cache key
            *args: Variable arguments to include in the key
            
        Returns:
            str: Generated cache key
        """
        key_parts = [prefix] + [str(arg) for arg in args]
        return "_".join(key_parts)
    
    def set_cache(key, value, timeout=CACHE_TIMEOUT):
        """
        Set a value in the cache with expiration.
        
        Args:
            key (str): Cache key
            value (Any): Value to cache
            timeout (int): Cache timeout in seconds
            
        Returns:
            None
        """
        CACHE[key] = {
            "value": value,
            "expires": time.time() + timeout
        }
    
    def get_cache(key):
        """
        Get a value from the cache if it exists and hasn't expired.
        
        Args:
            key (str): Cache key
            
        Returns:
            Any: Cached value or None if not found/expired
        """
        global LAST_CACHE_CLEANUP
        
        # Periodically clean up expired cache entries
        if time.time() - LAST_CACHE_CLEANUP > 60:  # Clean up every minute
            cleanup_cache()
            LAST_CACHE_CLEANUP = time.time()
            
        if key in CACHE and CACHE[key]["expires"] > time.time():
            return CACHE[key]["value"]
        return None
    
    def cleanup_cache():
        """
        Remove expired items from the cache.
        
        Returns:
            int: Number of items removed
        """
        current_time = time.time()
        expired_keys = [k for k, v in CACHE.items() if v["expires"] <= current_time]
        for key in expired_keys:
            del CACHE[key]
        return len(expired_keys)
    
    def requires_auth(f):
        """
        Decorator for routes that require authentication.
        
        Args:
            f (function): The function to decorate
            
        Returns:
            function: Decorated function
        """
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                return jsonify({"error": "Authorization header is missing"}), 401
            
            try:
                # This is just a placeholder - in a real app, you'd verify the token
                token = auth_header.split(" ")[1]
                # Validate token logic would go here
                g.user_id = "user-123"  # Set user ID for the request
            except Exception as e:
                logger.error(f"Authentication error: {str(e)}")
                return jsonify({"error": "Invalid authentication token"}), 401
                
            return f(*args, **kwargs)
        return decorated
    
    def validate_request_data(required_fields):
        """
        Decorator to validate request data.
        
        Args:
            required_fields (List[str]): List of required fields
            
        Returns:
            function: Decorator function
        """
        def decorator(f):
            @wraps(f)
            def decorated(*args, **kwargs):
                data = request.json
                if not data:
                    return jsonify({"error": "Request body is required"}), 400
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    return jsonify({
                        "error": "Missing required fields",
                        "fields": missing_fields
                    }), 400
                    
                return f(*args, **kwargs)
            return decorated
        return decorator
    
    def log_api_call(f):
        """
        Decorator to log API calls.
        
        Args:
            f (function): The function to decorate
            
        Returns:
            function: Decorated function
        """
        @wraps(f)
        def decorated(*args, **kwargs):
            start_time = time.time()
            response = f(*args, **kwargs)
            end_time = time.time()
            
            logger.info(f"API call to {request.path} from {request.remote_addr} "
                      f"took {(end_time - start_time) * 1000:.2f}ms")
            
            return response
        return decorated
        
    # Helper function to get employee by ID with caching
    def get_employee(employee_id):
        """
        Get employee data by ID with caching.
        
        Args:
            employee_id (str): Employee ID
            
        Returns:
            dict: Employee data or default if not found
        """
        cache_key = get_cache_key("employee", employee_id)
        cached_data = get_cache(cache_key)
        if cached_data:
            logger.debug(f"Cache hit for employee {employee_id}")
            return cached_data
        
        start_time = time.time()
        emp = employees_collection.find_one({"id": employee_id})
        query_time = time.time() - start_time
        
        if query_time > 0.1:
            logger.warning(f"Slow query for employee {employee_id}: {query_time:.2f}s")
        
        result = serialize_document(emp) if emp else {"name": "Unknown Employee"}
        set_cache(cache_key, result)
        return result

    # Helper function to get department by ID with caching
    def get_department(dept_id):
        """
        Get department data by ID with caching.
        
        Args:
            dept_id (str): Department ID
            
        Returns:
            dict: Department data or default if not found
        """
        cache_key = get_cache_key("department", dept_id)
        cached_data = get_cache(cache_key)
        if cached_data:
            return cached_data
            
        dept = departments_collection.find_one({"id": dept_id})
        result = serialize_document(dept) if dept else {"name": "Unknown", "color": "bg-gray-500"}
        set_cache(cache_key, result)
        return result

    # Helper function to enrich employee data with department info
    def enrich_employee_data(employee):
        """
        Enrich employee data with department information.
        
        Args:
            employee (dict): Employee data
            
        Returns:
            dict: Enriched employee data
        """
        if "department" in employee:
            dept = get_department(employee["department"])
            employee["departmentInfo"] = dept
            
        if "manager" in employee:
            manager = get_employee(employee["manager"])
            employee["managerInfo"] = manager
            
        # Calculate additional metrics
        employee["yearsOfService"] = calculate_years_of_service(employee)
        employee["performanceRating"] = calculate_performance_rating(employee)
        
        return employee
        
    def calculate_years_of_service(employee):
        """
        Calculate years of service for an employee.
        
        Args:
            employee (dict): Employee data
            
        Returns:
            float: Years of service
        """
        if "joinDate" not in employee:
            return 0.0
            
        try:
            join_date = datetime.datetime.fromisoformat(employee["joinDate"])
            today = datetime.datetime.now()
            delta = relativedelta(today, join_date)
            return delta.years + (delta.months / 12.0)
        except (ValueError, TypeError):
            logger.error(f"Invalid join date format for employee {employee['id']}")
            return 0.0
            
    def calculate_performance_rating(employee):
        """
        Calculate performance rating for an employee.
        
        Args:
            employee (dict): Employee data
            
        Returns:
            dict: Performance rating information
        """
        # This is just a placeholder for a more complex performance calculation
        performance = employee.get("performance", 75)
        
        rating_levels = [
            {"min": 90, "label": "Outstanding", "color": "green"},
            {"min": 80, "label": "Exceeds Expectations", "color": "blue"},
            {"min": 70, "label": "Meets Expectations", "color": "teal"},
            {"min": 60, "label": "Needs Improvement", "color": "yellow"},
            {"min": 0, "label": "Unsatisfactory", "color": "red"}
        ]
        
        for level in rating_levels:
            if performance >= level["min"]:
                return {
                    "score": performance,
                    "label": level["label"],
                    "color": level["color"]
                }
                
        return {"score": performance, "label": "Unknown", "color": "gray"}
        
    def generate_unique_id(prefix):
        """
        Generate a unique ID with the given prefix.
        
        Args:
            prefix (str): ID prefix
            
        Returns:
            str: Generated unique ID
        """
        timestamp = datetime.datetime.now().timestamp()
        random_component = random.randint(1000, 9999)
        return f"{prefix}-{timestamp}-{random_component}"

    # Function to send email notifications (placeholder)
    def send_email_notification(recipient, subject, body):
        """
        Send an email notification.
        
        Args:
            recipient (str): Recipient email address
            subject (str): Email subject
            body (str): Email body
            
        Returns:
            bool: Success status
        """
        # This is a placeholder - in a real app, you'd implement actual email sending
        logger.info(f"Email notification to {recipient}: {subject}")
        return True
        
    # Function to send real-time notifications (placeholder)
    def send_realtime_notification(user_id, notification_data):
        """
        Send a real-time notification.
        
        Args:
            user_id (str): User ID
            notification_data (dict): Notification data
            
        Returns:
            bool: Success status
        """
        # This is a placeholder - in a real app, you'd implement WebSockets or similar
        logger.info(f"Real-time notification to {user_id}: {notification_data['message']}")
        return True
        
    # Function to calculate task statistics
    def calculate_task_statistics(department_id=None):
        """
        Calculate task statistics, optionally filtered by department.
        
        Args:
            department_id (str, optional): Department ID to filter by
            
        Returns:
            dict: Task statistics
        """
        query = {}
        if department_id:
            query["department"] = department_id
            
        all_tasks = list(tasks_collection.find(query))
        
        if not all_tasks:
            return {
                "total": 0,
                "completed": 0,
                "in_progress": 0,
                "not_started": 0,
                "overdue": 0,
                "completion_rate": 0.0,
                "average_completion_time": 0.0
            }
            
        # Count tasks by status
        completed = sum(1 for task in all_tasks if task.get("status") == "completed")
        in_progress = sum(1 for task in all_tasks if task.get("status") == "in progress")
        not_started = sum(1 for task in all_tasks if task.get("status") == "not started")
        
        # Count overdue tasks
        today = datetime.datetime.now().date()
        overdue = sum(1 for task in all_tasks 
                     if task.get("status") != "completed" 
                     and "dueDate" in task 
                     and datetime.datetime.fromisoformat(task["dueDate"]).date() < today)
        
        # Calculate average completion time (if data available)
        completion_times = []
        for task in all_tasks:
            if task.get("status") == "completed" and "startDate" in task and "completionDate" in task:
                try:
                    start = datetime.datetime.fromisoformat(task["startDate"])
                    end = datetime.datetime.fromisoformat(task["completionDate"])
                    completion_times.append((end - start).days)
                except (ValueError, TypeError):
                    pass
        
        avg_completion_time = statistics.mean(completion_times) if completion_times else 0.0
        
        return {
            "total": len(all_tasks),
            "completed": completed,
            "in_progress": in_progress,
            "not_started": not_started,
            "overdue": overdue,
            "completion_rate": (completed / len(all_tasks)) * 100 if all_tasks else 0.0,
            "average_completion_time": avg_completion_time
        }
        
    # Function to analyze employee performance
    def analyze_employee_performance(employee_id):
        """
        Analyze performance data for an employee.
        
        Args:
            employee_id (str): Employee ID
            
        Returns:
            dict: Performance analysis data
        """
        employee = get_employee(employee_id)
        tasks = list(tasks_collection.find({"assignedTo": employee_id}))
        
        # Task-based metrics
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task.get("status") == "completed")
        completed_on_time = sum(1 for task in tasks 
                              if task.get("status") == "completed" 
                              and "dueDate" in task 
                              and "completionDate" in task
                              and datetime.datetime.fromisoformat(task["completionDate"]).date() 
                              <= datetime.datetime.fromisoformat(task["dueDate"]).date())
                              
        # Get performance metrics from dedicated collection
        metrics = list(performance_metrics_collection.find({"employeeId": employee_id}))
        
        # Calculate trend
        if len(metrics) >= 2:
            metrics.sort(key=lambda x: x.get("date", ""))
            first_score = metrics[0].get("overallScore", 0)
            last_score = metrics[-1].get("overallScore", 0)
            trend = last_score - first_score
        else:
            trend = 0
            
        return {
            "employee": employee,
            "taskMetrics": {
                "total": total_tasks,
                "completed": completed_tasks,
                "completionRate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                "onTimeCompletionRate": (completed_on_time / completed_tasks * 100) if completed_tasks > 0 else 0
            },
            "performanceMetrics": {
                "current": employee.get("performance", 0),
                "trend": trend,
                "ratingLabel": calculate_performance_rating(employee)["label"]
            },
            "developmentAreas": analyze_development_areas(employee_id)
        }
        
    def analyze_development_areas(employee_id):
        """
        Analyze development areas for an employee.
        
        Args:
            employee_id (str): Employee ID
            
        Returns:
            List[dict]: Development areas with recommendations
        """
        # This is a placeholder for a more complex analysis
        employee = get_employee(employee_id)
        
        # Get employee skills
        skills = employee.get("skills", [])
        
        # Simple mapping of skills to development recommendations
        skill_recommendations = {
            "Campaign Management": {"area": "Strategic Planning", "recommendation": "Advanced campaign strategy workshop"},
            "Content Strategy": {"area": "Content Development", "recommendation": "Content optimization masterclass"},
            "SEO": {"area": "Technical SEO", "recommendation": "SEO analytics certification"},
            "Social Media": {"area": "Platform Specialization", "recommendation": "Platform-specific advanced training"},
            "Email Marketing": {"area": "Automation", "recommendation": "Marketing automation tools training"},
            "Analytics": {"area": "Data Visualization", "recommendation": "Advanced data visualization workshop"}
        }
        
        result = []
        for skill in skills:
            if skill in skill_recommendations:
                result.append(skill_recommendations[skill])
                
        # Add a generic recommendation if none found
        if not result:
            result.append({
                "area": "Professional Development",
                "recommendation": "General skills assessment recommended"
            })
            
        return result
        
    # Function to schedule with optimal slot selection
    def find_optimal_meeting_slot(participants, duration=60, start_date=None):
        """
        Find the optimal meeting slot for a set of participants.
        
        Args:
            participants (List[str]): List of participant IDs
            duration (int): Meeting duration in minutes
            start_date (str, optional): Start date to search from
            
        Returns:
            dict: Optimal meeting slot information
        """
        if not start_date:
            start_date = datetime.datetime.now().date().isoformat()
            
        # Get all participants' data
        participant_data = [get_employee(p_id) for p_id in participants]
        
        # Extract available slots
        all_available_slots = []
        for participant in participant_data:
            if "availableSlots" in participant:
                all_available_slots.append(set(participant["availableSlots"]))
                
        # Find common slots
        if not all_available_slots:
            # Default slots if none available
            common_slots = ["09:00", "14:00", "16:00"]
        else:
            common_slots = list(set.intersection(*all_available_slots))
            
        if not common_slots:
            # No common slots, find the slot with the most participants available
            slot_availability = {}
            for participant in participant_data:
                for slot in participant.get("availableSlots", []):
                    slot_availability[slot] = slot_availability.get(slot, 0) + 1
                    
            max_available = max(slot_availability.values()) if slot_availability else 0
            best_slots = [slot for slot, count in slot_availability.items() if count == max_available]
            
            common_slots = best_slots if best_slots else ["14:00"]  # Default if no best slot
            
        # Get the next viable date
        return {
            "date": start_date,
            "time": random.choice(common_slots),
            "duration": duration,
            "participantCount": len(participants),
            "fullyAvailable": len(common_slots) > 0
        }
        
    # Function to check schedule conflicts
    def check_schedule_conflicts(employee_id, date, time):
        """
        Check for scheduling conflicts for an employee.
        
        Args:
            employee_id (str): Employee ID
            date (str): Date string
            time (str): Time string
            
        Returns:
            List[dict]: Conflicts found
        """
        # Find meetings on the same date and time
        meetings = list(meetings_collection.find({
            "date": date,
            "participants": employee_id
        }))
        
        conflicts = []
        for meeting in meetings:
            meeting_time = meeting.get("time", "")
            meeting_duration = int(meeting.get("duration", 60))
            
            # Simple time comparison - could be more sophisticated
            if meeting_time == time:
                conflicts.append({
                    "meetingId": meeting.get("id"),
                    "title": meeting.get("title"),
                    "time": meeting_time,
                    "duration": meeting_duration
                })
                
        return conflicts
        
    # ======================================================================
    # Database Backup Utilities
    # ======================================================================
    
    def backup_database():
        """
        Create a backup of all collections.
        
        Returns:
            dict: Backup summary
        """
        backup_time = datetime.datetime.now().isoformat()
        backup_id = f"backup-{int(time.time())}"
        
        collections = [
            employees_collection,
            departments_collection,
            tasks_collection,
            meetings_collection,
            notifications_collection,
            chat_messages_collection
        ]
        
        backup_summary = {
            "id": backup_id,
            "timestamp": backup_time,
            "collections": {}
        }
        
        for collection in collections:
            collection_name = collection.name
            documents = list(collection.find({}))
            document_count = len(documents)
            
            # In a real system, you'd save these documents to a backup location
            backup_summary["collections"][collection_name] = {
                "count": document_count,
                "size": sys.getsizeof(str(documents))
            }
            
        logger.info(f"Database backup completed: {backup_id}")
        return backup_summary
        
    def restore_database_from_backup(backup_id):
        """
        Restore database from a backup.
        
        Args:
            backup_id (str): Backup ID to restore from
            
        Returns:
            dict: Restore summary
        """
        # This is a placeholder - in a real system, you'd implement actual restore logic
        logger.info(f"Database restore requested for backup: {backup_id}")
        
        return {
            "success": True,
            "backupId": backup_id,
            "timestamp": datetime.datetime.now().isoformat(),
            "message": "Database restore completed successfully"
        }
        
    # ======================================================================
    # Analytics and Reporting Functions
    # ======================================================================
    
    def generate_department_report(department_id):
        """
        Generate a comprehensive report for a department.
        
        Args:
            department_id (str): Department ID
            
        Returns:
            dict: Department report data
        """
        department = get_department(department_id)
        employees = list(employees_collection.find({"department": department_id}))
        tasks = list(tasks_collection.find({"department": department_id}))
        
        # Calculate various metrics
        task_completion_rate = sum(1 for task in tasks if task.get("status") == "completed") / len(tasks) if tasks else 0
        avg_performance = statistics.mean([emp.get("performance", 0) for emp in employees]) if employees else 0
        
        # Employee statistics
        employee_stats = {
            "count": len(employees),
            "averagePerformance": avg_performance,
            "seniorityDistribution": calculate_seniority_distribution(employees),
            "skillsDistribution": calculate_skills_distribution(employees)
        }
        
        # Task statistics
        task_stats = {
            "count": len(tasks),
            "completionRate": task_completion_rate * 100,
            "priorityDistribution": calculate_task_priority_distribution(tasks),
            "statusDistribution": calculate_task_status_distribution(tasks)
        }
        
        return {
            "department": department,
            "generatedAt": datetime.datetime.now().isoformat(),
            "employeeStats": employee_stats,
            "taskStats": task_stats,
            "recommendations": generate_department_recommendations(department_id)
        }
        
    def calculate_seniority_distribution(employees):
        """
        Calculate seniority distribution for employees.
        
        Args:
            employees (List[dict]): List of employee data
            
        Returns:
            dict: Seniority distribution data
        """
        # This is a simplified implementation
        junior = sum(1 for emp in employees if "role" in emp and "junior" in emp["role"].lower())
        senior = sum(1 for emp in employees if "role" in emp and "senior" in emp["role"].lower())
        manager = sum(1 for emp in employees if "role" in emp and "manager" in emp["role"].lower())
        director = sum(1 for emp in employees if "role" in emp and "director" in emp["role"].lower())
        
        # Count remaining as "other"
        other = len(employees) - (junior + senior + manager + director)
        
        return {
            "junior": junior,
            "senior": senior,
            "manager": manager,
            "director": director,
            "other": other
        }
        
    def calculate_skills_distribution(employees):
        """
        Calculate skills distribution for employees.
        
        Args:
            employees (List[dict]): List of employee data
            
        Returns:
            dict: Skills distribution data
        """
        skills_count = {}
        
        for employee in employees:
            for skill in employee.get("skills", []):
                skills_count[skill] = skills_count.get(skill, 0) + 1
                
        # Sort by frequency
        sorted_skills = sorted(skills_count.items(), key=lambda x: x[1], reverse=True)
        
        return {skill: count for skill, count in sorted_skills}
        
    def calculate_task_priority_distribution(tasks):
        """
        Calculate priority distribution for tasks.
        
        Args:
            tasks (List[dict]): List of task data
            
        Returns:
            dict: Priority distribution data
        """
        priorities = {"high": 0, "medium": 0, "low": 0}
        
        for task in tasks:
            priority = task.get("priority", "").lower()
            if priority in priorities:
                priorities[priority] += 1
                
        return priorities
        
    def calculate_task_status_distribution(tasks):
        """
        Calculate status distribution for tasks.
        
        Args:
            tasks (List[dict]): List of task data
            
        Returns:
            dict: Status distribution data
        """
        statuses = {"not started": 0, "in progress": 0, "completed": 0}
        
        for task in tasks:
            status = task.get("status", "").lower()
            if status in statuses:
                statuses[status] += 1
                
        return statuses
        
    def generate_department_recommendations(department_id):
        """
        Generate recommendations for a department.
        
        Args:
            department_id (str): Department ID
            
        Returns:
            List[dict]: Recommendations for the department
        """
        # This is a placeholder - in a real system, this would be more sophisticated
        department = get_department(department_id)
        
        # Generate some basic recommendations based on department
        if department["name"] == "Marketing":
            return [
                {"type": "training", "title": "Digital Marketing Masterclass", "priority": "high"},
                {"type": "process", "title": "Implement A/B testing for all campaigns", "priority": "medium"},
                {"type": "resource", "title": "Hire additional content specialist", "priority": "medium"}
            ]
        elif department["name"] == "Technology":
            return [
                {"type": "training", "title": "Cloud Architecture Workshop", "priority": "high"},
                {"type": "process", "title": "Adopt automated testing framework", "priority": "high"},
                {"type": "resource", "title": "Upgrade development workstations", "priority": "medium"}
            ]
        else:
            return [
                {"type": "training", "title": "Team collaboration workshop", "priority": "medium"},
                {"type": "process", "title": "Implement regular feedback sessions", "priority": "medium"},
                {"type": "resource", "title": "Review resource allocation", "priority": "medium"}
            ]
    
    # ======================================================================
    # Route Definitions
    # ======================================================================

    # Seed initial data (runs once if collections are empty)
    @app.route("/api/seed", methods=["POST"])
    @log_api_call
    def seed_data():
        """
        Seed the database with initial data.
        This is a one-time operation that populates empty collections.
        
        Returns:
            tuple: JSON response and status code
        """
        logger.info("Database seeding requested")
        
        # Check if departments already exist
        if departments_collection.count_documents({}) > 0:
            logger.info("Departments collection already populated, skipping seed for departments")
        else:
            logger.info("Seeding departments collection")
            sample_departments = [
                {"id": "dept-1", "name": "Marketing", "color": "bg-pink-500", "icon": "Target", "description": "Responsible for brand management, advertising, and market research", "headCount": 12, "budget": 750000, "location": "Floor 3, West Wing"},
                {"id": "dept-2", "name": "Technology", "color": "bg-blue-500", "icon": "Zap", "description": "Handles software development, IT infrastructure, and technical support", "headCount": 24, "budget": 1200000, "location": "Floor 4, North Wing"},
                {"id": "dept-3", "name": "Operations", "color": "bg-amber-500", "icon": "Settings", "description": "Manages day-to-day business activities and logistics", "headCount": 18, "budget": 900000, "location": "Floor 2, East Wing"},
                {"id": "dept-4", "name": "Finance", "color": "bg-green-500", "icon": "BarChart2", "description": "Oversees financial planning, accounting, and budget management", "headCount": 10, "budget": 650000,"location": "Floor 1, South Wing"}
            ]
            departments_collection.insert_many(sample_departments)
            logger.info("Departments collection seeded successfully")

        # Check if employees already exist
        if employees_collection.count_documents({}) > 0:
            logger.info("Employees collection already populated, skipping seed for employees")
        else:
            logger.info("Seeding employees collection")
            sample_employees = [
                {
                    "id": "emp-1",
                    "name": "John Doe",
                    "department": "dept-1",
                    "role": "Marketing Manager",
                    "email": "john.doe@example.com",
                    "phone": "+1-555-1234",
                    "skills": ["Campaign Management", "Content Strategy", "SEO"],
                    "performance": 85,
                    "joinDate": "2018-06-15",
                    "manager": None,
                    "availableSlots": ["09:00", "14:00", "16:00"]
                },
                {
                    "id": "emp-2",
                    "name": "Jane Smith",
                    "department": "dept-2",
                    "role": "Senior Software Engineer",
                    "email": "jane.smith@example.com",
                    "phone": "+1-555-5678",
                    "skills": ["Python", "JavaScript", "Cloud Architecture"],
                    "performance": 92,
                    "joinDate": "2019-03-10",
                    "manager": None,
                    "availableSlots": ["10:00", "15:00"]
                },
                {
                    "id": "emp-3",
                    "name": "Alice Johnson",
                    "department": "dept-3",
                    "role": "Operations Director",
                    "email": "alice.johnson@example.com",
                    "phone": "+1-555-9101",
                    "skills": ["Process Optimization", "Logistics", "Project Management"],
                    "performance": 88,
                    "joinDate": "2017-11-22",
                    "manager": None,
                    "availableSlots": ["11:00", "13:00", "17:00"]
                }
            ]
            employees_collection.insert_many(sample_employees)
            logger.info("Employees collection seeded successfully")

        # Check if tasks already exist
        if tasks_collection.count_documents({}) > 0:
            logger.info("Tasks collection already populated, skipping seed for tasks")
        else:
            logger.info("Seeding tasks collection")
            sample_tasks = [
                {
                    "id": "task-1",
                    "title": "Launch Q4 Marketing Campaign",
                    "description": "Plan and execute the Q4 marketing campaign",
                    "department": "dept-1",
                    "assignedTo": "emp-1",
                    "priority": "high",
                    "status": "in progress",
                    "startDate": "2023-10-01",
                    "dueDate": "2023-12-15"
                },
                {
                    "id": "task-2",
                    "title": "Develop New API Endpoints",
                    "description": "Create new API endpoints for the mobile app",
                    "department": "dept-2",
                    "assignedTo": "emp-2",
                    "priority": "medium",
                    "status": "not started",
                    "startDate": "2023-11-01",
                    "dueDate": "2023-12-01"
                },
                {
                    "id": "task-3",
                    "title": "Optimize Supply Chain Process",
                    "description": "Review and optimize the supply chain process",
                    "department": "dept-3",
                    "assignedTo": "emp-3",
                    "priority": "high",
                    "status": "completed",
                    "startDate": "2023-09-01",
                    "dueDate": "2023-10-15",
                    "completionDate": "2023-10-10"
                }
            ]
            tasks_collection.insert_many(sample_tasks)
            logger.info("Tasks collection seeded successfully")

        return jsonify({"message": "Database seeding completed successfully"}), 200

    # Get all employees
    @app.route("/api/employees", methods=["GET"])
    @log_api_call
    def get_all_employees():
        """
        Get a list of all employees with enriched data.
        
        Returns:
            tuple: JSON response and status code
        """
        employees = list(employees_collection.find({}))
        enriched_employees = [enrich_employee_data(serialize_document(emp)) for emp in employees]
        return jsonify(enriched_employees), 200

    # Get employee by ID
    @app.route("/api/employees/<employee_id>", methods=["GET"])
    @log_api_call
    def get_employee_by_id(employee_id):
        """
        Get detailed information about a specific employee.
        
        Args:
            employee_id (str): Employee ID
            
        Returns:
            tuple: JSON response and status code
        """
        employee = get_employee(employee_id)
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
            
        enriched_employee = enrich_employee_data(employee)
        return jsonify(enriched_employee), 200

    # Create a new employee
    @app.route("/api/employees", methods=["POST"])
    @validate_request_data(["name", "department", "role", "email"])
    @log_api_call
    def create_employee():
        """
        Create a new employee record.
        
        Returns:
            tuple: JSON response and status code
        """
        data = request.json
        employee_id = generate_unique_id("emp")
        
        new_employee = {
            "id": employee_id,
            "name": data["name"],
            "department": data["department"],
            "role": data["role"],
            "email": data["email"],
            "phone": data.get("phone", ""),
            "skills": data.get("skills", []),
            "performance": data.get("performance", 0),
            "joinDate": datetime.datetime.now().isoformat(),
            "manager": data.get("manager", None),
            "availableSlots": data.get("availableSlots", [])
        }
        
        employees_collection.insert_one(new_employee)
        logger.info(f"Created new employee: {employee_id}")
        
        return jsonify({"id": employee_id, "message": "Employee created successfully"}), 201

    # Update employee details
    @app.route("/api/employees/<employee_id>", methods=["PUT"])
    @validate_request_data(["name", "department", "role", "email"])
    @log_api_call
    def update_employee(employee_id):
        """
        Update an existing employee's details.
        
        Args:
            employee_id (str): Employee ID
            
        Returns:
            tuple: JSON response and status code
        """
        data = request.json
        update_result = employees_collection.update_one(
            {"id": employee_id},
            {"$set": {
                "name": data["name"],
                "department": data["department"],
                "role": data["role"],
                "email": data["email"],
                "phone": data.get("phone", ""),
                "skills": data.get("skills", []),
                "performance": data.get("performance", 0),
                "manager": data.get("manager", None),
                "availableSlots": data.get("availableSlots", [])
            }}
        )
        
        if update_result.matched_count == 0:
            return jsonify({"error": "Employee not found"}), 404
            
        logger.info(f"Updated employee: {employee_id}")
        return jsonify({"message": "Employee updated successfully"}), 200

    # Delete an employee
    @app.route("/api/employees/<employee_id>", methods=["DELETE"])
    @log_api_call
    def delete_employee(employee_id):
        """
        Delete an employee record.
        
        Args:
            employee_id (str): Employee ID
            
        Returns:
            tuple: JSON response and status code
        """
        delete_result = employees_collection.delete_one({"id": employee_id})
        if delete_result.deleted_count == 0:
            return jsonify({"error": "Employee not found"}), 404
            
        logger.info(f"Deleted employee: {employee_id}")
        return jsonify({"message": "Employee deleted successfully"}), 200

    # Get all departments
    @app.route("/api/departments", methods=["GET"])
    @log_api_call
    def get_all_departments():
        """
        Get a list of all departments.
        
        Returns:
            tuple: JSON response and status code
        """
        departments = list(departments_collection.find({}))
        return jsonify([serialize_document(dept) for dept in departments]), 200

    # Get department by ID
    @app.route("/api/departments/<department_id>", methods=["GET"])
    @log_api_call
    def get_department_by_id(department_id):
        """
        Get detailed information about a specific department.
        
        Args:
            department_id (str): Department ID
            
        Returns:
            tuple: JSON response and status code
        """
        department = get_department(department_id)
        if not department:
            return jsonify({"error": "Department not found"}), 404
            
        return jsonify(department), 200

    # Create a new department
    @app.route("/api/departments", methods=["POST"])
    @validate_request_data(["name", "description"])
    @log_api_call
    def create_department():
        """
        Create a new department record.
        
        Returns:
            tuple: JSON response and status code
        """
        data = request.json
        department_id = generate_unique_id("dept")
        
        new_department = {
            "id": department_id,
            "name": data["name"],
            "description": data["description"],
            "color": data.get("color", "bg-gray-500"),
            "icon": data.get("icon", "Folder"),
            "headCount": data.get("headCount", 0),
            "budget": data.get("budget", 0),
            "location": data.get("location", "")
        }
        
        departments_collection.insert_one(new_department)
        logger.info(f"Created new department: {department_id}")
        
        return jsonify({"id": department_id, "message": "Department created successfully"}), 201

    # Update department details
    @app.route("/api/departments/<department_id>", methods=["PUT"])
    @validate_request_data(["name", "description"])
    @log_api_call
    def update_department(department_id):
        """
        Update an existing department's details.
        
        Args:
            department_id (str): Department ID
            
        Returns:
            tuple: JSON response and status code
        """
        data = request.json
        update_result = departments_collection.update_one(
            {"id": department_id},
            {"$set": {
                "name": data["name"],
                "description": data["description"],
                "color": data.get("color", "bg-gray-500"),
                "icon": data.get("icon", "Folder"),
                "headCount": data.get("headCount", 0),
                "budget": data.get("budget", 0),
                "location": data.get("location", "")
            }}
        )
        
        if update_result.matched_count == 0:
            return jsonify({"error": "Department not found"}), 404
            
        logger.info(f"Updated department: {department_id}")
        return jsonify({"message": "Department updated successfully"}), 200

    # Delete a department
    @app.route("/api/departments/<department_id>", methods=["DELETE"])
    @log_api_call
    def delete_department(department_id):
        """
        Delete a department record.
        
        Args:
            department_id (str): Department ID
            
        Returns:
            tuple: JSON response and status code
        """
        delete_result = departments_collection.delete_one({"id": department_id})
        if delete_result.deleted_count == 0:
            return jsonify({"error": "Department not found"}), 404
            
        logger.info(f"Deleted department: {department_id}")
        return jsonify({"message": "Department deleted successfully"}), 200

    # Get all tasks
    @app.route("/api/tasks", methods=["GET"])
    @log_api_call
    def get_all_tasks():
        """
        Get a list of all tasks.
        
        Returns:
            tuple: JSON response and status code
        """
        tasks = list(tasks_collection.find({}))
        return jsonify([serialize_document(task) for task in tasks]), 200

    # Get task by ID
    @app.route("/api/tasks/<task_id>", methods=["GET"])
    @log_api_call
    def get_task_by_id(task_id):
        """
        Get detailed information about a specific task.
        
        Args:
            task_id (str): Task ID
            
        Returns:
            tuple: JSON response and status code
        """
        task = tasks_collection.find_one({"id": task_id})
        if not task:
            return jsonify({"error": "Task not found"}), 404
            
        return jsonify(serialize_document(task)), 200

    # Create a new task
    @app.route("/api/tasks", methods=["POST"])
    @validate_request_data(["title", "description", "department", "assignedTo", "priority"])
    @log_api_call
    def create_task():
        """
        Create a new task record.
        
        Returns:
            tuple: JSON response and status code
        """
        data = request.json
        task_id = generate_unique_id("task")
        
        new_task = {
            "id": task_id,
            "title": data["title"],
            "description": data["description"],
            "department": data["department"],
            "assignedTo": data["assignedTo"],
            "priority": data["priority"],
            "status": "not started",
            "startDate": data.get("startDate", datetime.datetime.now().isoformat()),
            "dueDate": data.get("dueDate", ""),
            "completionDate": None
        }
        
        tasks_collection.insert_one(new_task)
        logger.info(f"Created new task: {task_id}")
        
        return jsonify({"id": task_id, "message": "Task created successfully"}), 201

    # Update task details
    