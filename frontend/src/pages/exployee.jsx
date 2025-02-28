import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, Calendar, FileText, MessageSquare, Briefcase, BarChart2, 
  User, Settings, Send, X, Search, Clock, Check, AlertTriangle, 
  Loader, ChevronDown, Filter, Plus, Clipboard, Zap, Coffee,
  Paperclip, Mic, Video, Award, Target, Bookmark, Mail,Bell,Edit,Trash, 
  Phone, MapPin, PieChart, Star, Lock, ArrowRight, MoreHorizontal, ArrowLeft
} from 'lucide-react';
import img1 from './images.jpeg';
// Main Dashboard Component
const EmployeeManagementDashboard = () => {
  const navigate = useNavigate();
  // State for employees, departments, and tasks
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: "Hello Manager! How can I assist you today?" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [schedulingProcess, setSchedulingProcess] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const chatEndRef = useRef(null);

  // Initialize with sample data
  useEffect(() => {
    // Sample departments
    const sampleDepartments = [
      { id: 'dept-1', name: 'Marketing', color: 'bg-pink-500', icon: <Target size={20} /> },
      { id: 'dept-2', name: 'Technology', color: 'bg-blue-500', icon: <Zap size={20} /> },
      { id: 'dept-3', name: 'Operations', color: 'bg-amber-500', icon: <Settings size={20} /> },
      { id: 'dept-4', name: 'Finance', color: 'bg-green-500', icon: <BarChart2 size={20} /> },
      { id: 'dept-5', name: 'HR', color: 'bg-purple-500', icon: <Users size={20} /> },
      { id: 'dept-6', name: 'Public Relations', color: 'bg-red-500', icon: <MessageSquare size={20} /> },
      { id: 'dept-7', name: 'Customer Support', color: 'bg-cyan-500', icon: <Phone size={20} /> },
      { id: 'dept-8', name: 'Research', color: 'bg-indigo-500', icon: <Clipboard size={20} /> },
    ];
    
    // Sample employees
    const sampleEmployees = [
      { id: 'emp-1', name: 'Emma Thompson', role: 'Marketing Director', department: 'dept-1', email: 'emma@company.com', phone: '+1 (234) 567-8901', location: 'New York', avatar: img1, status: 'active', skills: ['Campaign Management', 'Content Strategy', 'SEO'], performance: 92, availableSlots: ['10:00', '13:00', '16:00'] },
      { id: 'emp-2', name: 'Michael Chen', role: 'Marketing Specialist', department: 'dept-1', email: 'michael@company.com', phone: '+1 (234) 567-8902', location: 'New York', avatar: img1, status: 'active', skills: ['Social Media', 'Email Marketing', 'Analytics'], performance: 88, availableSlots: ['09:00', '14:00', '15:00'] },
      { id: 'emp-3', name: 'David Kim', role: 'Senior Developer', department: 'dept-2', email: 'david@company.com', phone: '+1 (234) 567-8903', location: 'San Francisco', avatar: img1, status: 'away', skills: ['JavaScript', 'React', 'Node.js'], performance: 95, availableSlots: ['11:00', '15:00', '16:00'] },
      { id: 'emp-4', name: 'Sarah Johnson', role: 'Frontend Developer', department: 'dept-2', email: 'sarah@company.com', phone: '+1 (234) 567-8904', location: 'San Francisco', avatar: img1, status: 'active', skills: ['CSS', 'UI/UX', 'React'], performance: 87, availableSlots: ['10:00', '13:00', '16:00'] },
      { id: 'emp-5', name: 'Robert Davis', role: 'Operations Manager', department: 'dept-3', email: 'robert@company.com', phone: '+1 (234) 567-8905', location: 'Chicago', avatar: img1, status: 'active', skills: ['Process Optimization', 'Team Management', 'Strategic Planning'], performance: 91, availableSlots: ['09:00', '11:00', '14:00'] },
      { id: 'emp-6', name: 'Jennifer Wilson', role: 'Financial Analyst', department: 'dept-4', email: 'jennifer@company.com', phone: '+1 (234) 567-8906', location: 'Chicago', avatar: img1, status: 'busy', skills: ['Financial Modeling', 'Budgeting', 'Reporting'], performance: 89, availableSlots: ['13:00', '15:00', '16:00'] },
      { id: 'emp-7', name: 'James Brown', role: 'HR Manager', department: 'dept-5', email: 'james@company.com', phone: '+1 (234) 567-8907', location: 'Boston', avatar: img1, status: 'active', skills: ['Recruitment', 'Employee Relations', 'Training'], performance: 90, availableSlots: ['10:00', '11:00', '14:00'] },
      { id: 'emp-8', name: 'Patricia Martinez', role: 'PR Specialist', department: 'dept-6', email: 'patricia@company.com', phone: '+1 (234) 567-8908', location: 'Miami', avatar: img1, status: 'active', skills: ['Media Relations', 'Crisis Management', 'Communication'], performance: 86, availableSlots: ['09:00', '13:00', '15:00'] },
      { id: 'emp-9', name: 'Thomas Garcia', role: 'Customer Support Lead', department: 'dept-7', email: 'thomas@company.com', phone: '+1 (234) 567-8909', location: 'Austin', avatar: img1, status: 'away', skills: ['Problem Solving', 'Customer Experience', 'Support Systems'], performance: 93, availableSlots: ['10:00', '14:00', '16:00'] },
      { id: 'emp-10', name: 'Elizabeth Taylor', role: 'Research Scientist', department: 'dept-8', email: 'elizabeth@company.com', phone: '+1 (234) 567-8910', location: 'Seattle', avatar: img1, status: 'active', skills: ['Data Analysis', 'Machine Learning', 'Experimentation'], performance: 94, availableSlots: ['09:00', '11:00', '15:00'] },
      { id: 'emp-11', name: 'Alex Rivera', role: 'Marketing Coordinator', department: 'dept-1', email: 'alex@company.com', phone: '+1 (234) 567-8911', location: 'New York', avatar: img1, status: 'active', skills: ['Event Planning', 'Digital Marketing', 'Copywriting'], performance: 85, availableSlots: ['11:00', '13:00', '16:00'] },
      { id: 'emp-12', name: 'Sophia Lee', role: 'Full Stack Developer', department: 'dept-2', email: 'sophia@company.com', phone: '+1 (234) 567-8912', location: 'San Francisco', avatar: img1, status: 'busy', skills: ['Python', 'AWS', 'Docker'], performance: 92, availableSlots: ['10:00', '14:00', '15:00'] },
    ];
    
    // Sample tasks
    const sampleTasks = [
      { id: 'task-1', title: 'Q4 Marketing Campaign Planning', assignedTo: 'emp-1', department: 'dept-1', dueDate: '2025-03-15', priority: 'high', status: 'in progress', completion: 65 },
      { id: 'task-2', title: 'Social Media Content Calendar', assignedTo: 'emp-2', department: 'dept-1', dueDate: '2025-03-10', priority: 'medium', status: 'in progress', completion: 40 },
      { id: 'task-3', title: 'Platform API Integration', assignedTo: 'emp-3', department: 'dept-2', dueDate: '2025-03-20', priority: 'high', status: 'in progress', completion: 75 },
      { id: 'task-4', title: 'UI Update for Mobile App', assignedTo: 'emp-4', department: 'dept-2', dueDate: '2025-03-08', priority: 'medium', status: 'in progress', completion: 30 },
      { id: 'task-5', title: 'Warehouse Efficiency Audit', assignedTo: 'emp-5', department: 'dept-3', dueDate: '2025-03-25', priority: 'medium', status: 'not started', completion: 0 },
      { id: 'task-6', title: 'Q1 Financial Report', assignedTo: 'emp-6', department: 'dept-4', dueDate: '2025-04-05', priority: 'high', status: 'in progress', completion: 50 },
      { id: 'task-7', title: 'New Employee Onboarding Program', assignedTo: 'emp-7', department: 'dept-5', dueDate: '2025-03-18', priority: 'medium', status: 'in progress', completion: 60 },
      { id: 'task-8', title: 'Press Release for Product Launch', assignedTo: 'emp-8', department: 'dept-6', dueDate: '2025-03-12', priority: 'high', status: 'in progress', completion: 35 },
      { id: 'task-9', title: 'Customer Satisfaction Survey Analysis', assignedTo: 'emp-9', department: 'dept-7', dueDate: '2025-03-22', priority: 'medium', status: 'not started', completion: 0 },
      { id: 'task-10', title: 'Market Research for New Product', assignedTo: 'emp-10', department: 'dept-8', dueDate: '2025-04-10', priority: 'high', status: 'in progress', completion: 25 },
      { id: 'task-11', title: 'Email Newsletter Campaign', assignedTo: 'emp-11', department: 'dept-1', dueDate: '2025-03-05', priority: 'medium', status: 'completed', completion: 100 },
      { id: 'task-12', title: 'Backend Performance Optimization', assignedTo: 'emp-12', department: 'dept-2', dueDate: '2025-03-17', priority: 'high', status: 'in progress', completion: 80 },
    ];
    
    // Sample meetings
    const sampleMeetings = [
      { id: 'meeting-1', title: 'Marketing Strategy Review', participants: ['emp-1', 'emp-2', 'emp-11'], date: '2025-03-05', time: '10:00', duration: 60, location: 'Conference Room A' },
      { id: 'meeting-2', title: 'Tech Team Sprint Planning', participants: ['emp-3', 'emp-4', 'emp-12'], date: '2025-03-06', time: '14:00', duration: 90, location: 'Virtual' },
      { id: 'meeting-3', title: 'Executive Board Update', participants: ['emp-1', 'emp-5', 'emp-6', 'emp-7'], date: '2025-03-07', time: '11:00', duration: 120, location: 'Boardroom' },
    ];
    
    // Sample notifications
    const sampleNotifications = [
      { id: 'notif-1', type: 'task', message: 'Task "Email Newsletter Campaign" completed by Alex Rivera', time: '2 hours ago', read: false },
      { id: 'notif-2', type: 'meeting', message: 'New meeting scheduled: "Tech Team Sprint Planning"', time: '4 hours ago', read: false },
      { id: 'notif-3', type: 'performance', message: 'Performance review for Michael Chen is due next week', time: '1 day ago', read: true },
      { id: 'notif-4', type: 'system', message: 'System update scheduled for Sunday, March 2nd at 02:00 GMT', time: '2 days ago', read: true },
    ];
    
    setDepartments(sampleDepartments);
    setEmployees(sampleEmployees);
    setTasks(sampleTasks);
    setMeetings(sampleMeetings);
    setNotifications(sampleNotifications);
  }, []);
  
  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Filter employees based on active department and search query
  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = activeDepartment === 'all' || employee.department === activeDepartment;
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });
  
  // Get department by ID
  const getDepartment = (departmentId) => {
    return departments.find(dept => dept.id === departmentId) || { name: 'Unknown', color: 'bg-gray-500' };
  };
  
  // Get employee by ID
  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId) || { name: 'Unknown Employee' };
  };
  
  // Handle sending a new chat message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const userMessage = { id: Date.now(), type: 'user', text: newMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Check for scheduling commands
    if (newMessage.toLowerCase().includes('schedule') && 
        (newMessage.toLowerCase().includes('meeting') || newMessage.toLowerCase().includes('meet'))) {
      
      // Get the department from the message
      let targetDept = null;
      for (const dept of departments) {
        if (newMessage.toLowerCase().includes(dept.name.toLowerCase())) {
          targetDept = dept;
          break;
        }
      }
      
      if (targetDept) {
        handleSchedulingRequest(targetDept);
      } else {
        // Generic response if department not recognized
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            id: Date.now(), 
            type: 'bot', 
            text: "I'll help you schedule a meeting. Which team would you like to meet with?" 
          }]);
        }, 1000);
      }
    } else {
      // Generic assistant response
      setTimeout(() => {
        const assistantResponses = [
          "I'm here to help you manage your team. Would you like to schedule a meeting, assign tasks, or see employee reports?",
          "I can help you coordinate with your team. Need to schedule a meeting with a specific department?",
          "I'll assist with your team management needs. What would you like to do today?",
          "I'm your administrative AI assistant. I can help schedule meetings, track tasks, or provide team updates."
        ];
        
        setChatMessages(prev => [...prev, { 
          id: Date.now(), 
          type: 'bot', 
          text: assistantResponses[Math.floor(Math.random() * assistantResponses.length)] 
        }]);
      }, 800);
    }
  };
  
  // Handle scheduling request with animations and AI agent simulation
  const handleSchedulingRequest = (department) => {
    // Start scheduling process
    setSchedulingProcess({
      step: 'finding-employees',
      department: department,
      progress: 0
    });
    
    // Reset any previously selected employees
    setSelectedEmployees([]);
    
    // AI response acknowledging request
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'bot', 
        text: `I'll help you schedule a meeting with the ${department.name} team. Let me gather the team members and check their availability.` 
      }]);
      
      // Activate the first agent (Employee Search)
      setActiveAgent('employee-search');
    }, 1000);
    
    // Simulate progress for finding employees
    const employeeSearchInterval = setInterval(() => {
      setSchedulingProcess(prev => {
        if (prev.step === 'finding-employees') {
          const newProgress = prev.progress + 10;
          if (newProgress >= 100) {
            clearInterval(employeeSearchInterval);
            
            // Get employees in the target department
            const deptEmployees = employees.filter(emp => emp.department === department.id);
            setSelectedEmployees(deptEmployees);
            
            // Message about found employees
            setChatMessages(prev => [...prev, { 
              id: Date.now(), 
              type: 'bot', 
              text: `I've located ${deptEmployees.length} team members in the ${department.name} department.` 
            }]);
            
            // Move to the next step
            setTimeout(() => {
              setSchedulingProcess({
                step: 'checking-calendar',
                department: department,
                progress: 0
              });
              
              // Switch to the Calendar agent
              setActiveAgent('calendar');
            }, 1000);
            
            return {
              ...prev,
              step: 'complete-finding',
              progress: 100
            };
          }
          return {
            ...prev,
            progress: newProgress
          };
        }
        return prev;
      });
    }, 300);
    
    // After employee search is complete, simulate checking calendars
    setTimeout(() => {
      const calendarCheckInterval = setInterval(() => {
        setSchedulingProcess(prev => {
          if (prev.step === 'checking-calendar') {
            const newProgress = prev.progress + 8;
            if (newProgress >= 100) {
              clearInterval(calendarCheckInterval);
              
              // Move to the analysis step
              setChatMessages(prev => [...prev, { 
                id: Date.now(), 
                type: 'bot', 
                text: `I've analyzed everyone's calendars and availability patterns.` 
              }]);
              
              setTimeout(() => {
                setSchedulingProcess({
                  step: 'analyzing-slots',
                  department: department,
                  progress: 0
                });
                
                // Switch to the Decision agent
                setActiveAgent('decision');
              }, 1000);
              
              return {
                ...prev,
                step: 'complete-calendar',
                progress: 100
              };
            }
            return {
              ...prev,
              progress: newProgress
            };
          }
          return prev;
        });
      }, 250);
    }, 4000);
    
    // Final step - analyze and suggest meeting times
    setTimeout(() => {
      const analysisInterval = setInterval(() => {
        setSchedulingProcess(prev => {
          if (prev.step === 'analyzing-slots') {
            const newProgress = prev.progress + 12;
            if (newProgress >= 100) {
              clearInterval(analysisInterval);
              
              // Present meeting suggestion
              setTimeout(() => {
                const optimalTime = getSuggestedMeetingTime(selectedEmployees);
                
                setChatMessages(prev => [...prev, { 
                  id: Date.now(), 
                  type: 'bot', 
                  text: `Based on everyone's availability, I recommend scheduling your meeting with the ${department.name} team tomorrow at ${optimalTime}. All team members are available at this time. Would you like me to schedule this meeting?` 
                }]);
                
                setSchedulingProcess({
                  step: 'suggestion-ready',
                  department: department,
                  progress: 100,
                  suggestedTime: optimalTime
                });
                
                // Reset active agent
                setActiveAgent(null);
                
                // Add a new notification
                const newNotification = {
                  id: `notif-${Date.now()}`,
                  type: 'meeting',
                  message: `Meeting suggestion ready for ${department.name} team`,
                  time: 'Just now',
                  read: false
                };
                
                setNotifications(prev => [newNotification, ...prev]);
              }, 800);
              
              return {
                ...prev,
                step: 'complete-analysis',
                progress: 100
              };
            }
            return {
              ...prev,
              progress: newProgress
            };
          }
          return prev;
        });
      }, 220);
    }, 7000);
  };
  
  // Determine the best meeting time based on employee availability
  const getSuggestedMeetingTime = (teamMembers) => {
    // This would usually involve complex logic analyzing everyone's calendar
    // For demo purposes, this is simplified
    const availableSlots = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    return availableSlots[Math.floor(Math.random() * availableSlots.length)];
  };
  
  // Function to confirm the meeting scheduling
  const confirmScheduleMeeting = () => {
    if (schedulingProcess?.step === 'suggestion-ready') {
      const { department, suggestedTime } = schedulingProcess;
      
      // Create a new meeting
      const newMeeting = {
        id: `meeting-${Date.now()}`,
        title: `${department.name} Team Meeting`,
        participants: selectedEmployees.map(emp => emp.id),
        date: '2025-03-01', // tomorrow's date
        time: suggestedTime,
        duration: 60,
        location: 'Conference Room B'
      };
      
      setMeetings(prev => [...prev, newMeeting]);
      
      // Send confirmation message
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'bot', 
        text: `✅ Great! I've scheduled the ${department.name} team meeting for tomorrow at ${suggestedTime}. I've sent calendar invites to all ${selectedEmployees.length} team members. Would you like me to prepare an agenda as well?` 
      }]);
      
      // Reset scheduling process
      setSchedulingProcess(null);
      
      // Notification
      const newNotification = {
        id: `notif-${Date.now()}`,
        type: 'confirmation',
        message: `Meeting with ${department.name} team scheduled for tomorrow at ${suggestedTime}`,
        time: 'Just now',
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  };
  
  // Get appropriate status indicator styling
  const getStatusIndicator = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get appropriate priority styling
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  // Get appropriate status styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'not started':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 bg-gray-900 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex items-center justify-between">
          <h1 className="text-xl font-bold">Employee Management Hub</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden animate-slide-down">
                  <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    <button className="text-xs text-blue-400 hover:text-blue-300">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-gray-400 text-center">No notifications</p>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className={`p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors ${!notification.read ? 'bg-gray-800/50' : ''}`}>
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">
                              {notification.type === 'task' && <Clipboard size={16} className="text-blue-400" />}
                              {notification.type === 'meeting' && <Calendar size={16} className="text-purple-400" />}
                              {notification.type === 'performance' && <BarChart2 size={16} className="text-green-400" />}
                              {notification.type === 'system' && <Settings size={16} className="text-yellow-400" />}
                              {notification.type === 'confirmation' && <Check size={16} className="text-green-400" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowChatbot(!showChatbot)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-md flex items-center space-x-2 transition-all"
            >
              <MessageSquare size={18} />
              <span>AI Assistant</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">John Anderson</p>
                <p className="text-xs text-gray-400">Team Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-semibold">
                JA
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-60 border-r border-gray-800 bg-gray-900 flex flex-col transition-all animate-slide-right overflow-hidden">
            {/* Department filters */}
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold mb-3">Departments</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveDepartment('all')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeDepartment === 'all' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Users size={18} />
                  <span>All Departments</span>
                </button>
                
                {departments.map(dept => (
                  <button 
                    key={dept.id}
                    onClick={() => setActiveDepartment(dept.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                      activeDepartment === dept.id ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md ${dept.color} flex items-center justify-center`}>
                      {dept.icon}
                    </div>
                    <span>{dept.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold mb-3">Navigation</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('employees')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === 'employees' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Users size={18} />
                  <span>Employees</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === 'tasks' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Clipboard size={18} />
                  <span>Tasks</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('meetings')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === 'meetings' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Calendar size={18} />
                  <span>Meetings</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('performance')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === 'performance' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <BarChart2 size={18} />
                  <span>Performance</span>
                </button>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="p-4 mt-auto border-t border-gray-800">
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 py-2 rounded-md flex items-center space-x-2 transition-all">
                  <Plus size={18} />
                  <span>Add Employee</span>
                </button>
                
                <button className="w-full bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md flex items-center space-x-2 transition-colors">
                  <Clipboard size={18} />
                  <span>Create Task</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowChatbot(true);
                    setNewMessage("Schedule a meeting");
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md flex items-center space-x-2 transition-colors"
                >
                  <Calendar size={18} />
                  <span>Schedule Meeting</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-950 p-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-96">
              <input 
                type="text" 
                placeholder="Search employees, tasks, or meetings..." 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="flex space-x-3 w-full sm:w-auto">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Filter size={16} />
                <span>Filters</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <ChevronDown size={16} />
                <span>Sort by</span>
              </button>
            </div>
          </div>
          
          {/* Conditional rendering based on active tab */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Users size={24} className="mr-2" />
                {activeDepartment === 'all' 
                  ? 'All Employees' 
                  : `${getDepartment(activeDepartment).name} Employees`}
                <span className="ml-2 text-lg font-normal text-gray-400">({filteredEmployees.length})</span>
              </h2>
              
              {/* Employee grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map(employee => (
                  <div key={employee.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all">
                    <div className="p-5">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden relative">
                            <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-800 ${getStatusIndicator(employee.status)}`}></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{employee.name}</h3>
                          <p className="text-gray-400 text-sm">{employee.role}</p>
                          <div className="flex items-center mt-1">
                            <div className={`w-3 h-3 rounded-md ${getDepartment(employee.department).color} mr-2`}></div>
                            <span className="text-sm">{getDepartment(employee.department).name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          <span className="text-gray-300">{employee.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          <span className="text-gray-300">{employee.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          <span className="text-gray-300">{employee.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Performance</p>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              employee.performance >= 90 ? 'bg-green-500' : 
                              employee.performance >= 75 ? 'bg-blue-500' : 
                              employee.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${employee.performance}%` }}
                          ></div>
                        </div>
                        <p className="text-right text-xs mt-1 text-gray-400">{employee.performance}%</p>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {employee.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 p-3 flex justify-between">
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Schedule
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                        <Clipboard size={14} className="mr-1" />
                        Assign Task
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                        <MoreHorizontal size={14} className="mr-1" />
                        More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Clipboard size={24} className="mr-2" />
                Tasks Overview
              </h2>
              
              {/* Task Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">Completed</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {tasks.filter(task => task.status === 'completed').length}
                      </h3>
                    </div>
                    <div className="bg-green-500/20 rounded-full p-2 text-green-400">
                      <Check size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    {Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100)}% of all tasks
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">In Progress</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {tasks.filter(task => task.status === 'in progress').length}
                      </h3>
                    </div>
                    <div className="bg-blue-500/20 rounded-full p-2 text-blue-400">
                      <Activity size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    {Math.round((tasks.filter(task => task.status === 'in progress').length / tasks.length) * 100)}% of all tasks
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">Not Started</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {tasks.filter(task => task.status === 'not started').length}
                      </h3>
                    </div>
                    <div className="bg-yellow-500/20 rounded-full p-2 text-yellow-400">
                      <Clock size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    {Math.round((tasks.filter(task => task.status === 'not started').length / tasks.length) * 100)}% of all tasks
                  </p>
                </div>
              </div>
              
              {/* Tasks Table */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-850 border-b border-gray-700">
                        <th className="text-left py-3 px-4">Task</th>
                        <th className="text-left py-3 px-4">Assigned To</th>
                        <th className="text-left py-3 px-4">Department</th>
                        <th className="text-left py-3 px-4">Due Date</th>
                        <th className="text-left py-3 px-4">Priority</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Progress</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks
                        .filter(task => activeDepartment === 'all' || task.department === activeDepartment)
                        .map(task => (
                        <tr key={task.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium">{task.title}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
                                <img 
                                  src={getEmployee(task.assignedTo).avatar} 
                                  alt={getEmployee(task.assignedTo).name}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <span>{getEmployee(task.assignedTo).name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-md ${getDepartment(task.department).color} mr-2`}></div>
                              <span>{getDepartment(task.department).name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2 text-gray-400" />
                              <span>{task.dueDate}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityClass(task.priority)} bg-opacity-20`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(task.status)} bg-opacity-20`}>
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 w-40">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-700 h-2 rounded-full mr-2">
                                <div 
                                  className={`h-full rounded-full ${
                                    task.completion === 100 ? 'bg-green-500' : 
                                    task.completion >= 70 ? 'bg-blue-500' : 
                                    task.completion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${task.completion}%` }}
                                ></div>
                              </div>
                              <span className="text-xs whitespace-nowrap">{task.completion}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <Edit size={16} />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'meetings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Calendar size={24} className="mr-2" />
                Scheduled Meetings
              </h2>
              
              {/* Meetings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{meeting.title}</h3>
                        <div className="bg-purple-500/20 rounded-full p-1.5 text-purple-400">
                          <Calendar size={16} />
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          <span>{meeting.time} ({meeting.duration} min)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Participants</p>
                        <div className="flex -space-x-2 overflow-hidden">
                          {meeting.participants.slice(0, 5).map((participantId, index) => (
                            <div key={index} className="w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden">
                              <img 
                                src={getEmployee(participantId).avatar} 
                                alt={getEmployee(participantId).name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {meeting.participants.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs">
                              +{meeting.participants.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 p-3 flex justify-between">
                      <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                        <Video size={14} className="mr-1" />
                        Join
                      </button>
                      <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                        <Users size={14} className="mr-1" />
                        Invite
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Meeting Card */}
                <div 
                  className="bg-gray-800/50 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-800 transition-all"
                  onClick={() => {
                    setShowChatbot(true);
                    setNewMessage("Schedule a meeting");
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                    <Plus size={24} className="text-blue-500" />
                  </div>
                  <p className="font-medium text-center">Schedule New Meeting</p>
                  <p className="text-sm text-gray-400 text-center mt-1">Use AI Assistant to find the best time slot</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center">
                <BarChart2 size={24} className="mr-2" />
                Team Performance
              </h2>
              
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">Average Performance</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {Math.round(employees.reduce((sum, emp) => sum + emp.performance, 0) / employees.length)}%
                      </h3>
                    </div>
                    <div className="bg-blue-500/20 rounded-full p-2 text-blue-400">
                      <PieChart size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">Top Performer</p>
                      <h3 className="text-xl font-bold mt-2">
                        {employees.sort((a, b) => b.performance - a.performance)[0].name}
                      </h3>
                    </div>
                    <div className="bg-green-500/20 rounded-full p-2 text-green-400">
                      <Award size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">Task Completion</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100)}%
                      </h3>
                    </div>
                    <div className="bg-purple-500/20 rounded-full p-2 text-purple-400">
                      <Check size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400">High Priority Tasks</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {tasks.filter(task => task.priority === 'high').length}
                      </h3>
                    </div>
                    <div className="bg-red-500/20 rounded-full p-2 text-red-400">
                      <AlertTriangle size={20} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Top Performers Table */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold flex items-center">
                    <Star size={18} className="mr-2 text-yellow-400" />
                    Top Performers
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-850 border-b border-gray-700">
                        <th className="text-left py-3 px-4">Rank</th>
                        <th className="text-left py-3 px-4">Employee</th>
                        <th className="text-left py-3 px-4">Department</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Tasks Completed</th>
                        <th className="text-left py-3 px-4">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees
                        .sort((a, b) => b.performance - a.performance)
                        .slice(0, 5)
                        .map((employee, index) => (
                          <tr key={employee.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                            <td className="py-3 px-4">
                              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center font-medium">
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
                                  <img 
                                    src={employee.avatar} 
                                    alt={employee.name}
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <span>{employee.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-md ${getDepartment(employee.department).color} mr-2`}></div>
                                <span>{getDepartment(employee.department).name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{employee.role}</td>
                            <td className="py-3 px-4">
                              {tasks.filter(task => 
                                task.assignedTo === employee.id && task.status === 'completed'
                              ).length}
                            </td>
                            <td className="py-3 px-4 w-48">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-700 h-2 rounded-full mr-2">
                                  <div 
                                    className={`h-full rounded-full ${
                                      employee.performance >= 90 ? 'bg-green-500' : 
                                      employee.performance >= 75 ? 'bg-blue-500' : 
                                      employee.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${employee.performance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm whitespace-nowrap">{employee.performance}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            
          )}
        </div>
        
        {/* Chatbot */}
        {showChatbot && (
          <div className="fixed bottom-4 right-4 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl flex flex-col animate-slide-up">
            {/* Chatbot Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold">AI Assistant</h3>
                  <p className="text-xs text-gray-400">How can I help you today?</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatbot(false)}
                className="p-1 rounded-md hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.type === 'bot' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'bot' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagementDashboard;



