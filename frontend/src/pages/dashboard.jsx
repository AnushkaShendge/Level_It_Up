import React, { useState, useEffect } from 'react';
import { Activity, Mail, Calendar, FileText, MessageSquare, Twitter, Phone, Mic, Workflow, DollarSign, Users, Shield, Lock, User, BarChart2, Send, ArrowUpRight, AlertTriangle, Check, Loader, X, Terminal, Globe, ChevronDown, Inbox, Flag, Star, Clock, Paperclip, Maximize2, MessageCircle } from 'lucide-react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
// Dashboard component with animated features
const Dashboard = () => {
  const [activeAgents, setActiveAgents] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const [emails, setEmails] = useState([]);
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Simulate email processing and task generation
  useEffect(() => {
    // Sample emails
    const sampleEmails = [
      { id: 'e1', from: 'Sarah Johnson', subject: 'Urgent: Quarterly Report Deadline', body: 'We need to finalize the Q3 report by Friday.', time: '09:42', priority: 'high', hasAttachment: true, isRead: false },
      { id: 'e2', from: 'Michael Chen', subject: 'Product Launch Timeline', body: 'Here are the updated milestones for our next launch.', time: '08:15', priority: 'medium', hasAttachment: false, isRead: true },
      { id: 'e3', from: 'Alex Rodriguez', subject: 'Client Meeting Notes', body: 'Summary of our discussion with Enterprise client.', time: 'Yesterday', priority: 'medium', hasAttachment: true, isRead: true },
      { id: 'e4', from: 'Taylor Williams', subject: 'Budget Approval Needed', body: 'Please review and approve the marketing budget.', time: 'Yesterday', priority: 'high', hasAttachment: false, isRead: false },
      { id: 'e5', from: 'Jamie Lee', subject: 'New Team Member Introduction', body: 'Welcoming our new UX designer next Monday.', time: 'Yesterday', priority: 'low', hasAttachment: false, isRead: true },
      { id: 'e6', from: 'Robin Martinez', subject: 'Security Alert: Login Attempt', body: 'Unusual login detected from Germany.', time: '2 days ago', priority: 'critical', hasAttachment: false, isRead: true },
      { id: 'e7', from: 'Jordan Patel', subject: 'Social Media Campaign Results', body: 'February campaign metrics exceeded expectations.', time: '2 days ago', priority: 'medium', hasAttachment: true, isRead: true },
    ];
    
    // Prioritized tasks derived from emails and other sources
    const derivedTasks = [
      { id: 't1', title: 'Finalize Q3 report', dueDate: '3 days', source: 'Email from Sarah Johnson', priority: 'high', status: 'pending', type: 'report' },
      { id: 't2', title: 'Review and approve marketing budget', dueDate: '1 day', source: 'Email from Taylor Williams', priority: 'high', status: 'pending', type: 'finance' },
      { id: 't3', title: 'Investigate security alert', dueDate: 'Today', source: 'Security system', priority: 'critical', status: 'in-progress', type: 'security' },
      { id: 't4', title: 'Update product launch timeline', dueDate: '1 week', source: 'Email from Michael Chen', priority: 'medium', status: 'pending', type: 'project' },
      { id: 't5', title: 'Prepare for new team member onboarding', dueDate: '5 days', source: 'Email from Jamie Lee', priority: 'medium', status: 'in-progress', type: 'hr' },
      { id: 't6', title: 'Analyze social media campaign metrics', dueDate: '2 days', source: 'Email from Jordan Patel', priority: 'low', status: 'pending', type: 'marketing' },
    ];
    
    setEmails(sampleEmails);
    setPrioritizedTasks(derivedTasks);
    
    // Simulate an email being processed every few seconds
    const emailInterval = setInterval(() => {
      setEmails(prevEmails => {
        // Mark a random unread email as read
        const unreadEmails = prevEmails.filter(e => !e.isRead);
        if (unreadEmails.length > 0) {
          const randomIndex = Math.floor(Math.random() * unreadEmails.length);
          const emailToProcess = unreadEmails[randomIndex];
          
          // Add a new notification
          setNotifications(prev => [{
            id: `notification-${Date.now()}`,
            message: `Email processed: ${emailToProcess.subject}`,
            icon: <Mail size={16} />,
            priority: emailToProcess.priority === 'high' ? 'high' : 'medium',
            timestamp: new Date().toLocaleTimeString()
          }, ...prev].slice(0, 5));
          
          // Occasionally add a new derived task
          if (Math.random() > 0.5) {
            const newTask = {
              id: `t${Date.now()}`,
              title: `Follow up on ${emailToProcess.subject}`,
              dueDate: '3 days',
              source: `Email from ${emailToProcess.from}`,
              priority: emailToProcess.priority,
              status: 'pending',
              type: Math.random() > 0.5 ? 'communication' : 'follow-up'
            };
            
            setPrioritizedTasks(prevTasks => [newTask, ...prevTasks]);
            
            // Add completed task
            setCompletedTasks(prev => [{
              id: `task-${Date.now()}`,
              name: `Email analyzed and task created: ${emailToProcess.subject}`,
              timestamp: new Date().toLocaleTimeString(),
            }, ...prev].slice(0, 5));
          }
          
          // Return updated emails array with the processed email marked as read
          return prevEmails.map(e => 
            e.id === emailToProcess.id ? {...e, isRead: true} : e
          );
        }
        return prevEmails;
      });
    }, 5000);
    
    return () => clearInterval(emailInterval);
  }, []);
  
  // Simulate agents working with random statuses
  useEffect(() => {
    const agentTypes = [
      { name: "Email Assistant", icon: <Mail size={16} />, color: "bg-blue-500" },
      { name: "Calendar Manager", icon: <Calendar size={16} />, color: "bg-green-500" },
      { name: "Documentation Assistant", icon: <FileText size={16} />, color: "bg-purple-500" },
      { name: "Slack Chatbot", icon: <MessageSquare size={16} />, color: "bg-pink-500" },
      { name: "Social Media Manager", icon: <Twitter size={16} />, color: "bg-sky-500" },
      { name: "WhatsApp Automation", icon: <Phone size={16} />, color: "bg-amber-500" },
      { name: "Meeting Transcriber", icon: <Mic size={16} />, color: "bg-red-500" },
      { name: "Workflow Engine", icon: <Workflow size={16} />, color: "bg-indigo-500" },
      { name: "CRM Enhancer", icon: <Send size={16} />, color: "bg-emerald-500" },
      { name: "Finance Manager", icon: <DollarSign size={16} />, color: "bg-yellow-500" },
      { name: "HR Assistant", icon: <Users size={16} />, color: "bg-cyan-500" },
      { name: "Legal Checker", icon: <Shield size={16} />, color: "bg-orange-500" },
      { name: "Security Monitor", icon: <Lock size={16} />, color: "bg-rose-500" },
      { name: "Personal Assistant", icon: <User size={16} />, color: "bg-teal-500" },
      { name: "Sentiment Analyzer", icon: <BarChart2 size={16} />, color: "bg-violet-500" },
    ];

    const statuses = ["Analyzing data...", "Processing requests...", "Learning patterns...", "Generating content...", "Checking security...", "Optimizing workflow..."];
    const progressValues = [15, 24, 38, 47, 62, 73, 85, 91, 100];

    // Generate random agents
    const generateAgents = () => {
      const agents = [];
      const usedTypes = new Set();
      
      for (let i = 0; i < 8; i++) {
        let typeIndex;
        do {
          typeIndex = Math.floor(Math.random() * agentTypes.length);
        } while (usedTypes.has(typeIndex) && usedTypes.size < agentTypes.length);
        
        usedTypes.add(typeIndex);
        const type = agentTypes[typeIndex];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const progress = progressValues[Math.floor(Math.random() * progressValues.length)];
        
        agents.push({
          id: `agent-${i}`,
          name: type.name,
          icon: type.icon,
          color: type.color,
          status,
          progress,
          isCompleted: progress === 100,
        });
      }
      
      return agents;
    };

    // Initialize data
    setActiveAgents(generateAgents());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveAgents(prev => {
        return prev.map(agent => {
          if (agent.progress < 100) {
            const newProgress = Math.min(agent.progress + Math.floor(Math.random() * 10), 100);
            return {
              ...agent,
              progress: newProgress,
              isCompleted: newProgress === 100,
              status: newProgress === 100 ? "Task completed" : agent.status
            };
          }
          return agent;
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle sending a new chat message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', text: newMessage }]);
    setNewMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'm analyzing your request and will get back to you shortly.",
        "Based on your tasks, I recommend prioritizing the quarterly report.",
        "I've scheduled a meeting with the team for tomorrow at 10AM.",
        "I can help you draft an email response to Sarah. Would you like me to do that?",
        "I've analyzed the security alert. It appears to be a false positive, but I recommend changing your password as a precaution."
      ];
      
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: botResponses[Math.floor(Math.random() * botResponses.length)] 
      }]);
    }, 1000);
  };

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ar', name: 'العربية' },
  ];

  // Translations for UI elements
  const translations = {
    en: {
      dashboard: "AI Management Dashboard",
      overview: "Overview",
      agents: "Active Agents",
      tasks: "Recent Tasks",
      analytics: "Analytics",
      settings: "Settings",
      activeSystems: "Active Systems",
      recentActivity: "Recent Activity",
      suggestions: "AI Suggestions",
      notifications: "Notifications",
      voiceClone: "Voice Clone",
      language: "Language",
      inbox: "Smart Inbox",
      prioritizedTasks: "Prioritized Tasks",
      askMe: "Ask me anything...",
      critical: "Critical",
      high: "High", 
      medium: "Medium",
      low: "Low"
    },
    es: {
      dashboard: "Panel de Control IA",
      overview: "Resumen",
      agents: "Agentes Activos",
      tasks: "Tareas Recientes",
      analytics: "Analítica",
      settings: "Ajustes",
      activeSystems: "Sistemas Activos",
      recentActivity: "Actividad Reciente",
      suggestions: "Sugerencias de IA",
      notifications: "Notificaciones",
      voiceClone: "Clon de Voz",
      language: "Idioma",
      inbox: "Bandeja Inteligente",
      prioritizedTasks: "Tareas Priorizadas",
      askMe: "Pregúntame lo que sea...",
      critical: "Crítico",
      high: "Alto", 
      medium: "Medio",
      low: "Bajo"
    },
    // Other languages omitted for brevity
  };

  // Get translated text
  const t = (key) => translations[language]?.[key] || translations.en[key];

  // AI suggestions based on current activity
  const suggestions = [
    "Optimize email responses for 22% faster client engagement",
    "Schedule team meetings during high-productivity hours",
    "Consolidate duplicate documentation across departments",
    "Implement 2-factor authentication for all team members",
    "Restructure social media campaign for better engagement"
  ];

  // Priority class mapping
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'critical': return t('critical');
      case 'high': return t('high');
      case 'medium': return t('medium');
      case 'low': return t('low');
      default: return t('medium');
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {activeTab === 'overview' && (
            <div className="p-6 grid grid-cols-12 gap-6 animate-fade-in">
              {/* Active Systems */}
              <div className="col-span-12 md:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-gray-800 rounded-xl p-4 h-full animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Active Systems</h2>
                    <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                      {activeAgents.filter(a => !a.isCompleted).length} agents
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {activeAgents.map(agent => (
                      <div 
                        key={agent.id}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700 relative overflow-hidden group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full ${agent.color}`}></div>
                        <div className="flex items-start justify-between">
                          <div className={`${agent.color} p-2 rounded-lg`}>
                            {agent.icon}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${agent.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {agent.isCompleted ? 'Complete' : 'Active'}
                          </span>
                        </div>
                        <div className="mt-3">
                          <h3 className="text-sm font-medium">{agent.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{agent.status}</p>
                        </div>
                        <div className="mt-4">
                          <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${agent.isCompleted ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500 ease-out`}
                              style={{ width: `${agent.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{agent.progress}%</span>
                            {agent.isCompleted ? (
                              <span className="text-xs text-green-400 flex items-center">
                                <Check size={12} className="mr-1" /> Done
                              </span>
                            ) : (
                              <span className="text-xs text-blue-400 flex items-center">
                                <Loader size={12} className="mr-1 animate-spin" /> Processing
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Animated gradient overlay that moves on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                             style={{
                               backgroundSize: '200% 100%',
                               animation: 'gradientMove 8s linear infinite'
                             }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="col-span-12 md:col-span-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-gray-800 rounded-xl p-4 h-full">
                  <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {completedTasks.map(task => (
                      <div key={task.id} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="mr-3 bg-green-500 p-1 rounded-full">
                              <Check size={12} />
                            </div>
                            <div>
                              <p className="text-sm">{task.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{task.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prioritized Tasks */}
              <div className="col-span-12 md:col-span-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="bg-gray-800 rounded-xl p-4 h-full overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Prioritized Tasks</h2>
                    <span className="text-xs text-gray-400">{prioritizedTasks.length} tasks</span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {prioritizedTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                      >
                        <div className="flex items-start">
                          <div className={`${getPriorityClass(task.priority)} p-1 rounded-full mr-3 mt-1`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium">{task.title}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-700">
                                {task.status === 'in-progress' ? (
                                  <span className="flex items-center text-blue-400">
                                    <Loader size={10} className="mr-1 animate-spin" /> In Progress
                                  </span>
                                ) : (
                                  <span>{getPriorityText(task.priority)}</span>
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Source: {task.source}</p>
                            <div className="flex justify-between mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock size={12} className="mr-1" /> Due: {task.dueDate}
                              </span>
                              <div className="flex space-x-2">
                                <button className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                                  Delegate
                                </button>
                                <button className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors">
                                  Begin
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="col-span-12 md:col-span-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-gray-800 rounded-xl p-4 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                      {notifications.filter(n => n.priority === 'high').length} urgent
                    </span>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`bg-gray-900 rounded-lg p-3 border ${
                          notification.priority === 'high' 
                            ? 'border-red-500' 
                            : notification.priority === 'medium'
                              ? 'border-yellow-500'
                              : 'border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className={`p-2 rounded-lg mr-3 ${
                              notification.priority === 'high' 
                                ? 'bg-red-500/20 text-red-400' 
                                : notification.priority === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-gray-700 text-gray-400'
                            }`}>
                              {notification.icon}
                            </div>
                            <div>
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                            </div>
                          </div>
                          <button className="text-gray-500 hover:text-gray-300">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Analytics View */}
      <div className="fixed bottom-6 left-24 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 w-64 animate-scale-in" 
           style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">AI Performance</h3>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Task Completion</span>
              <span>87%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Response Time</span>
              <span>1.2s</span>
            </div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Accuracy</span>
              <span>94%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slide-up {
          from { 
            transform: translateY(50px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes scale-in {
          from { 
            transform: scale(0.8); 
            opacity: 0; 
          }
          to { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          opacity: 0;
          animation: scale-in 0.6s ease-out forwards;
        }
        
        /* Add this to ensure animations play every time component mounts */
        .animate-slide-up, .animate-fade-in, .animate-scale-in {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
