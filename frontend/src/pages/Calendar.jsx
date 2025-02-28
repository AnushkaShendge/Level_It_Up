import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Activity, Zap, Upload, Download, ArrowUpRight, BarChart, TrendingUp, Terminal, DollarSign, ArrowDownRight, FileText, MessageCircle, Mail, BellRing, Users, Cpu, Brain, Sparkles, PenTool, Crosshair, Database, Server, BarChart2, GitBranch, Repeat, Layers, Filter, Play, Pause, RefreshCw, Target, Award, Sliders, RotateCw, Hash, ChevronRight, Plus, Minus, AlertTriangle, Inbox, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Search = () => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search tasks, agents, insights..."
      className="bg-gray-900 border border-gray-700 rounded-full w-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="absolute left-3 top-2.5 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  </div>
);

const DynamicCalendar = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [agentStats, setAgentStats] = useState({});
  const [showAgentDetail, setShowAgentDetail] = useState(false);
  const [newTaskCount, setNewTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [calendarScale, setCalendarScale] = useState(100);
  const calendarRef = useRef(null);
  const timelineRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const agentTypes = [
    { 
      id: 'email-agent',
      name: 'Email Manager',
      icon: <Mail />,
      gradient: 'from-blue-500 to-cyan-400',
      highlight: 'rgba(59, 130, 246, 0.3)',
      description: 'Processes emails and extracts actionable tasks'
    },
    { 
      id: 'meeting-agent',
      name: 'Meeting Organizer',
      icon: <Users />,
      gradient: 'from-indigo-500 to-purple-400',
      highlight: 'rgba(99, 102, 241, 0.3)',
      description: 'Schedules and prepares meeting materials'
    },
    { 
      id: 'research-agent',
      name: 'Research Assistant',
      icon: <Search />,
      gradient: 'from-purple-500 to-pink-400',
      highlight: 'rgba(168, 85, 247, 0.3)',
      description: 'Gathers information and summarizes findings'
    },
    { 
      id: 'writing-agent',
      name: 'Content Writer',
      icon: <PenTool />,
      gradient: 'from-rose-500 to-red-400',
      highlight: 'rgba(244, 63, 94, 0.3)',
      description: 'Creates and edits written content'
    },
    { 
      id: 'analytics-agent',
      name: 'Data Analyst',
      icon: <BarChart2 />,
      gradient: 'from-amber-500 to-orange-400',
      highlight: 'rgba(245, 158, 11, 0.3)', 
      description: 'Analyzes data and generates reports'
    },
    { 
      id: 'coding-agent',
      name: 'Code Assistant',
      icon: <Terminal />,
      gradient: 'from-emerald-500 to-green-400',
      highlight: 'rgba(16, 185, 129, 0.3)',
      description: 'Writes and refactors code'
    },
    { 
      id: 'finance-agent',
      name: 'Finance Manager',
      icon: <DollarSign />,
      gradient: 'from-teal-500 to-cyan-400',
      highlight: 'rgba(20, 184, 166, 0.3)',
      description: 'Tracks expenses and financial metrics'
    },
    { 
      id: 'workflow-agent',
      name: 'Workflow Optimizer',
      icon: <GitBranch />,
      gradient: 'from-sky-500 to-blue-400',
      highlight: 'rgba(14, 165, 233, 0.3)',
      description: 'Improves and automates processes'
    },
  ];

  const priorities = {
    critical: { color: 'bg-red-500', label: 'Critical' },
    high: { color: 'bg-orange-500', label: 'High' },
    medium: { color: 'bg-yellow-500', label: 'Medium' },
    low: { color: 'bg-green-500', label: 'Low' }
  };

  const statuses = {
    pending: { color: 'bg-gray-400', label: 'Pending' },
    scheduled: { color: 'bg-blue-400', label: 'Scheduled' },
    inProgress: { color: 'bg-purple-400', label: 'In Progress' },
    completed: { color: 'bg-green-400', label: 'Completed' },
    deferred: { color: 'bg-amber-400', label: 'Deferred' },
    canceled: { color: 'bg-red-400', label: 'Canceled' }
  };

  const randomTime = () => {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 4) * 15;
    return { hour, minute };
  };

  const randomDuration = () => {
    return Math.floor(Math.random() * 8) * 15 + 15;
  };

  const randomOverlap = () => {
    return Math.random() * 0.4; // 0-40% chance of overlap
  };

  const calculateTaskPosition = (startHour, startMinute, durationMinutes) => {
    const startPercentage = (startHour + startMinute / 60) / 24 * 100;
    const heightPercentage = durationMinutes / (24 * 60) * 100;
    return { top: `${startPercentage}%`, height: `${heightPercentage}%` };
  };

  const generateTask = (id, date = new Date()) => {
    const taskTypes = [
      'Email follow-up', 'Review document', 'Prepare presentation', 'Client meeting', 
      'Team sync', 'Research', 'Create report', 'Code review', 'Debug issue',
      'Budget analysis', 'Content writing', 'Design review', 'Strategy planning',
      'Data analysis', 'Product demo', 'Stakeholder update', 'Training session'
    ];
    
    const companies = [
      'Acme Corp', 'TechGiant', 'Innovatech', 'Global Systems', 'NextGen Solutions',
      'Apex Industries', 'Quantum Dynamics', 'Sigma Enterprises', 'Horizon Inc',
      'PrimeSoft', 'Atlas Group', 'Elevate Digital', 'CoreTech', 'Fusion Labs'
    ];
    
    const people = [
      'Alex Morgan', 'Jamie Lee', 'Sam Williams', 'Taylor Chen', 'Jordan Patel',
      'Casey Johnson', 'Riley Martinez', 'Quinn Thompson', 'Avery Garcia', 'Parker Kim',
      'Morgan Davis', 'Reese Wilson', 'Dakota Brown', 'Skyler Nguyen', 'Jesse Robinson'
    ];

    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const person = people[Math.floor(Math.random() * people.length)];
    
    const titleFormats = [
      `${taskType} with ${person}`,
      `${taskType} for ${company} project`,
      `${company}: ${taskType}`,
      `${taskType} - ${person} from ${company}`,
      `${company} ${taskType} session`,
      `${person}'s ${taskType}`
    ];
    
    const taskTitle = titleFormats[Math.floor(Math.random() * titleFormats.length)];
    
    const startTime = randomTime();
    const duration = randomDuration();
    const agentType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
    
    const priorityOptions = Object.keys(priorities);
    const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    
    const statusOptions = Object.keys(statuses);
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    const position = calculateTaskPosition(startTime.hour, startTime.minute, duration);
    
    const overlap = randomOverlap();
    
    return {
      id: `task-${id}`,
      title: taskTitle,
      startHour: startTime.hour,
      startMinute: startTime.minute,
      duration: duration,
      priority: priority,
      status: status,
      agent: agentType.id,
      agentName: agentType.name,
      gradient: agentType.gradient,
      highlight: agentType.highlight,
      position,
      date: new Date(date),
      overlap,
      notes: '',
      isNew: true,
      progress: Math.random() * 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: agentType.icon
    };
  };

  useEffect(() => {
    const initialTasks = Array.from({ length: 15 }, (_, i) => generateTask(i));
    setTasks(initialTasks);
    
    const initialAgents = agentTypes.map(type => ({
      ...type,
      status: 'active',
      tasksCompleted: Math.floor(Math.random() * 50),
      efficiency: 85 + Math.floor(Math.random() * 15),
      load: Math.floor(Math.random() * 100),
      isTraining: Math.random() > 0.7,
    }));
    setAgents(initialAgents);
    
    updateTimeBlocks(initialTasks);
    
    generateInsights();
    
    const initialStats = {};
    agentTypes.forEach(agent => {
      initialStats[agent.id] = {
        completed: Math.floor(Math.random() * 100),
        pending: Math.floor(Math.random() * 30),
        efficiency: 70 + Math.floor(Math.random() * 30),
        responseTime: (Math.random() * 2 + 0.5).toFixed(1)
      };
    });
    setAgentStats(initialStats);

    setNotifications([
      {
        id: 'notification-1',
        text: 'AI Calendar System initialized and ready',
        time: new Date().toLocaleTimeString(),
        type: 'info',
        icon: <Cpu />
      }
    ]);
  }, []);

  const generateInsights = () => {
    const insightTypes = [
      {
        title: 'Productivity Peak',
        description: 'Your most productive hours are between 9AM-11AM',
        icon: <TrendingUp />,
        color: 'from-green-500 to-emerald-600'
      },
      {
        title: 'Email Overload',
        description: 'Consider batch processing emails at 2PM',
        icon: <Mail />,
        color: 'from-blue-500 to-indigo-600'
      },
      {
        title: 'Meeting Consolidation',
        description: 'Consolidate 3 recurring meetings to save 2.5 hours/week',
        icon: <Users />,
        color: 'from-purple-500 to-violet-600'
      },
      {
        title: 'Focus Blocks',
        description: 'Adding 2 more deep work blocks could increase output by 34%',
        icon: <Target />,
        color: 'from-amber-500 to-orange-600'
      },
      {
        title: 'Task Delegation',
        description: '7 low-priority tasks could be delegated to AI agents',
        icon: <Cpu />,
        color: 'from-teal-500 to-cyan-600'
      },
      {
        title: 'Learning Opportunity',
        description: 'Schedule a 30-min learning block to improve key skills',
        icon: <Brain />,
        color: 'from-pink-500 to-rose-600'
      }
    ];
    
    const randomInsights = [];
    const insightCount = 3;
    
    while (randomInsights.length < insightCount) {
      const randomIndex = Math.floor(Math.random() * insightTypes.length);
      const insight = insightTypes[randomIndex];
      
      if (!randomInsights.find(i => i.title === insight.title)) {
        randomInsights.push({
          ...insight,
          id: `insight-${randomInsights.length + 1}`,
          value: Math.floor(Math.random() * 100),
          change: (Math.random() * 40 - 20).toFixed(1)
        });
      }
    }
    
    setInsights(randomInsights);
  };

  const updateTimeBlocks = (taskList) => {
    const blocks = [];
    
    const tasksByHour = {};
    taskList.forEach(task => {
      const hour = task.startHour;
      if (!tasksByHour[hour]) {
        tasksByHour[hour] = [];
      }
      tasksByHour[hour].push(task);
    });
    
    hours.forEach(hour => {
      const tasks = tasksByHour[hour] || [];
      
      blocks.push({
        hour,
        taskCount: tasks.length,
        load: Math.min(tasks.length * 25, 100), // Load percentage based on task count
        highPriorityCount: tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length,
        agents: [...new Set(tasks.map(t => t.agent))],
        color: hour >= 9 && hour <= 17 ? 
          (tasks.length > 2 ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500') :
          'from-gray-500 to-gray-600'
      });
    });
    
    setTimeBlocks(blocks);
  };

  useEffect(() => {
    const intervalDelay = 3000; // 3 seconds interval for updates
    
    const updateInterval = setInterval(() => {
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks];
        
        if (updatedTasks.length > 0) {
          const taskIndex = Math.floor(Math.random() * updatedTasks.length);
          const taskToUpdate = updatedTasks[taskIndex];
          
          const updateType = Math.random();
          
          if (updateType < 0.3 && taskToUpdate.status !== 'completed' && taskToUpdate.status !== 'canceled') {
            taskToUpdate.progress = Math.min(taskToUpdate.progress + Math.random() * 20, 100);
            
            if (taskToUpdate.progress >= 100) {
              taskToUpdate.status = 'completed';
              setCompletedTaskCount(prev => prev + 1);
              
              setNotifications(prev => [{
                id: `notification-${Date.now()}`,
                text: `Task completed: ${taskToUpdate.title}`,
                time: new Date().toLocaleTimeString(),
                type: 'success',
                icon: <CheckCircle />
              }, ...prev.slice(0, 4)]);
              
              setAgentStats(prev => {
                const agentId = taskToUpdate.agent;
                return {
                  ...prev,
                  [agentId]: {
                    ...prev[agentId],
                    completed: prev[agentId].completed + 1,
                    pending: Math.max(0, prev[agentId].pending - 1)
                  }
                };
              });
            } else if (taskToUpdate.status === 'pending') {
              taskToUpdate.status = 'inProgress';
              
              setNotifications(prev => [{
                id: `notification-${Date.now()}`,
                text: `Agent started: ${taskToUpdate.title}`,
                time: new Date().toLocaleTimeString(),
                type: 'info',
                icon: <Play />
              }, ...prev.slice(0, 4)]);
            }
            
            taskToUpdate.updatedAt = new Date().toISOString();
          } else if (updateType < 0.4) {
            const newTime = randomTime();
            taskToUpdate.startHour = newTime.hour;
            taskToUpdate.startMinute = newTime.minute;
            taskToUpdate.position = calculateTaskPosition(
              newTime.hour, 
              newTime.minute, 
              taskToUpdate.duration
            );
            
            setNotifications(prev => [{
              id: `notification-${Date.now()}`,
              text: `Task rescheduled: ${taskToUpdate.title}`,
              time: new Date().toLocaleTimeString(),
              type: 'warning',
              icon: <Clock />
            }, ...prev.slice(0, 4)]);
          }
          
          taskToUpdate.isNew = false;
        }
        
        if (Math.random() < 0.3) {
          const newTask = generateTask(Date.now());
          updatedTasks.push(newTask);
          setNewTaskCount(prev => prev + 1);
          
          setNotifications(prev => [{
            id: `notification-${Date.now()}`,
            text: `New task created: ${newTask.title}`,
            time: new Date().toLocaleTimeString(),
            type: 'new',
            icon: <Plus />
          }, ...prev.slice(0, 4)]);
          
          setAgentStats(prev => {
            const agentId = newTask.agent;
            return {
              ...prev,
              [agentId]: {
                ...prev[agentId],
                pending: prev[agentId].pending + 1
              }
            };
          });
        }
        
        updateTimeBlocks(updatedTasks);
        
        return updatedTasks;
      });
      
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          if (Math.random() < 0.4) {
            return {
              ...agent,
              load: Math.min(100, Math.max(0, agent.load + (Math.random() * 30 - 15))),
              efficiency: Math.min(100, Math.max(70, agent.efficiency + (Math.random() * 4 - 2))),
              isTraining: Math.random() > 0.8 ? !agent.isTraining : agent.isTraining,
              tasksCompleted: agent.isTraining ? agent.tasksCompleted : agent.tasksCompleted + (Math.random() < 0.3 ? 1 : 0)
            };
          }
          return agent;
        });
      });
      
      if (Math.random() < 0.15) {
        generateInsights();
      }
    }, intervalDelay);
    
    return () => clearInterval(updateInterval);
  }, []);

  const formatTimeLabel = (hour) => {
    return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'am' : 'pm'}`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const calculateTaskWidth = (overlap, index) => {
    const baseWidth = 95 - (overlap * 100);
    return `${baseWidth}%`;
  };

  const calculateTaskLeft = (overlap, index) => {
    if (overlap > 0) {
      return `${5 + (index % 3) * (overlap * 100 / 3)}%`;
    }
    return '2.5%';
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const scrollToCurrentTime = () => {
    if (timelineRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentScrollPos = (currentHour / 24) * timelineRef.current.scrollHeight;
      timelineRef.current.scrollTop = currentScrollPos - 200; // Offset to show some context
    }
  };

  useEffect(() => {
    scrollToCurrentTime();
  }, []);

  const getCurrentTasks = () => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === currentDate.toDateString();
    });
  };

  const handleZoom = (zoomIn) => {
    setCalendarScale(prev => {
      const newScale = zoomIn ? prev + 10 : prev - 10;
      return Math.min(Math.max(newScale, 60), 150);
    });
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-3xl rounded-full"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800 bg-gray-950/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  NeuroSync<span className="text-blue-400">AI</span> Calendar
                </h1>
              </div>
              
              <div className="hidden md:flex space-x-1">
                <button className="px-3 py-1.5 rounded-lg bg-gray-800 text-sm hover:bg-gray-700 transition-colors">
                  Day
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-gray-900 text-sm hover:bg-gray-700 transition-colors">
                  Week
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-gray-900 text-sm hover:bg-gray-700 transition-colors">
                  Month
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-64 hidden md:block">
                <Search />
              </div>
              
              <div className="flex items-center">
                <button className="relative p-2 text-gray-400 hover:text-white">
                  <BellRing className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
                </button>
                
                <button className="ml-2 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Actions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden relative z-10 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 bg-gray-950/70 backdrop-blur-md hidden md:block">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-3">ACTIVE AGENTS</h2>
              <div className="space-y-2">
                {agents.map(agent => (
                  <button 
                    key={agent.id}
                    onClick={() => {
                      setActiveAgent(agent);
                      setShowAgentDetail(true);
                    }}
                    className={`w-full rounded-lg p-2.5 text-left transition-all ${
                      agent.status === 'active' 
                        ? 'bg-gray-900 border border-gray-800 hover:border-gray-700' 
                        : 'bg-gray-900/50 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                          {agent.icon}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium">{agent.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            {agent.isTraining ? (
                              <>
                                <Sparkles className="h-3 w-3 mr-1 text-purple-400" />
                                <span className="text-purple-400">Training</span>
                              </>
                            ) : (
                              <>
                                <Activity className="h-3 w-3 mr-1" />
                                <span>Active</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Cpu className="h-3 w-3 mr-1" />
                        <span>{agent.load}% load</span>
                      </div>
                      <div>{agent.tasksCompleted} tasks</div>
                    </div>
                    
                    {/* Agent efficiency bar */}
                    <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${agent.gradient}`}
                        style={{ width: `${agent.efficiency}%` }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-3">AI INSIGHTS</h2>
              <div className="space-y-3">
                {insights.map(insight => (
                  <div 
                    key={insight.id}
                    
                    className="rounded-lg p-3 bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center`}>
                          {insight.icon}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium">{insight.title}</div>
                          <div className="text-xs text-gray-400">{insight.description}</div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    {insight.value && (
                      <div className="mt-2 flex items-center space-x-2 text-xs">
                        <div className="font-medium">{insight.value}%</div>
                        <div className={`flex items-center ${parseFloat(insight.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {parseFloat(insight.change) >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                          )}
                          <span>{Math.abs(parseFloat(insight.change))}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-3">TIMELINE HOTSPOTS</h2>
              <div className="h-40 relative rounded-lg overflow-hidden border border-gray-800">
                <div className="absolute top-0 left-0 w-full h-full">
                  {timeBlocks.map((block, index) => (
                    <div 
                      key={`block-${block.hour}`}
                      className={`absolute w-full bg-gradient-to-r ${block.color} opacity-${Math.min(Math.max(Math.floor(block.load / 10), 2), 10) * 10}`}
                      style={{
                        top: `${(block.hour / 24) * 100}%`,
                        height: `${(1 / 24) * 100}%`,
                      }}
                    >
                      {block.highPriorityCount > 0 && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                          {[...Array(block.highPriorityCount)].map((_, i) => (
                            <div key={i} className="h-1.5 w-1.5 rounded-full bg-red-500 ml-0.5"></div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Current time indicator */}
                  <div 
                    className="absolute w-full h-0.5 bg-blue-500 shadow-lg shadow-blue-500/50 z-10"
                    style={{
                      top: `${(new Date().getHours() + new Date().getMinutes() / 60) / 24 * 100}%`,
                    }}
                  >
                    <div className="absolute -right-1 -top-1.5 h-3 w-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Date navigation and tools */}
          <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => changeDate(-1)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
              
              <button 
                onClick={() => changeDate(1)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  setCurrentDate(new Date());
                  scrollToCurrentTime();
                }}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg flex items-center"
              >
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Today
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleZoom(false)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                disabled={calendarScale <= 60}
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <div className="text-xs font-medium w-12 text-center">{calendarScale}%</div>
              
              <button 
                onClick={() => handleZoom(true)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                disabled={calendarScale >= 150}
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <button className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Sliders className="h-4 w-4" />
              </button>
              
              <button className="ml-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg flex items-center">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div 
            ref={timelineRef}
            className="flex-1 overflow-y-auto relative"
            style={{ 
              backgroundSize: `100% calc(${calendarScale}px * 24)`,
              backgroundImage: 'linear-gradient(to bottom, rgba(31, 41, 55, 0.2) 1px, transparent 1px)',
              backgroundPositionY: '0px' 
            }}
          >
            <div 
              ref={calendarRef}
              className="relative"
              style={{ 
                height: `calc(${calendarScale}px * 24)`,
              }}
            >
              {/* Time labels */}
              <div className="absolute top-0 left-0 w-16 h-full border-r border-gray-800">
                {hours.map(hour => (
                  <div 
                    key={`hour-${hour}`} 
                    className="absolute flex items-center justify-center w-full text-xs text-gray-500 border-t border-gray-800 font-medium"
                    style={{
                      top: `calc(${hour / 24} * 100%)`,
                      height: `calc(100% / 24)`,
                    }}
                  >
                    {formatTimeLabel(hour)}
                  </div>
                ))}
              </div>
              
              {/* Task area */}
              <div className="absolute top-0 left-16 right-0 h-full">
                {/* Current time indicator */}
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-blue-500 z-30 shadow-lg shadow-blue-500/50"
                  style={{
                    top: `${(new Date().getHours() + new Date().getMinutes() / 60) / 24 * 100}%`,
                  }}
                >
                  <div className="absolute left-0 -top-1.5 h-3 w-3 rounded-full bg-blue-500 shadow-md shadow-blue-500/50"></div>
                </div>
                
                {/* Tasks */}
                {getCurrentTasks().map((task, index) => (
                  <div
                    key={task.id}
                    className={`absolute z-10 rounded-lg shadow-md transition-all duration-300 ${
                      task.isNew ? 'animate-pulse' : ''
                    }`}
                    style={{
                      top: task.position.top,
                      height: task.position.height,
                      left: calculateTaskLeft(task.overlap, index),
                      width: calculateTaskWidth(task.overlap, index),
                    }}
                  >
                    <div 
                      className={`h-full w-full rounded-lg border ${
                        task.status === 'completed' 
                          ? 'border-green-700 bg-green-900/20' 
                          : task.status === 'canceled' 
                            ? 'border-red-700 bg-red-900/20'
                            : `border-gray-700 bg-gradient-to-r ${task.highlight}`
                      } p-2 flex flex-col`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className={`h-5 w-5 rounded-md bg-gradient-to-br ${task.gradient} flex items-center justify-center`}>
                            {task.icon}
                          </div>
                          <span className="ml-1.5 text-sm font-medium truncate">{task.title}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <div className={`h-2 w-2 rounded-full ${priorities[task.priority].color}`}></div>
                          {task.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                          {task.status === 'canceled' && (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-400 mt-auto">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {`${task.startHour.toString().padStart(2, '0')}:${task.startMinute.toString().padStart(2, '0')} - ${
                            (task.startHour + Math.floor((task.startMinute + task.duration) / 60)) % 24
                          }:${(task.startMinute + task.duration) % 60}`}
                        </span>
                      </div>
                      
                      {task.status === 'inProgress' && (
                        <div className="mt-1 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${task.gradient}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-72 border-l border-gray-800 bg-gray-950/70 backdrop-blur-md hidden lg:block">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 mb-3">SYSTEM METRICS</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 bg-gray-900 border border-gray-800">
                  <div className="text-xs text-gray-500 mb-1">TASKS</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{tasks.length}</span>
                    <span className="ml-2 text-xs text-green-400 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {newTaskCount}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-lg p-3 bg-gray-900 border border-gray-800">
                  <div className="text-xs text-gray-500 mb-1">COMPLETED</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{completedTaskCount}</span>
                    <span className="ml-2 text-xs text-gray-400">tasks</span>
                  </div>
                </div>
                
                <div className="rounded-lg p-3 bg-gray-900 border border-gray-800">
                  <div className="text-xs text-gray-500 mb-1">AGENT LOAD</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {Math.round(agents.reduce((sum, agent) => sum + agent.load, 0) / agents.length)}%
                    </span>
                    <span className="ml-2 text-xs text-gray-400">avg</span>
                  </div>
                </div>
                
                <div className="rounded-lg p-3 bg-gray-900 border border-gray-800">
                  <div className="text-xs text-gray-500 mb-1">EFFICIENCY</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length)}%
                    </span>
                    <span className="ml-2 text-xs text-gray-400">avg</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-3">NOTIFICATIONS</h2>
              <div className="space-y-2">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`rounded-lg p-3 bg-gray-900 border ${
                      notification.type === 'success' 
                        ? 'border-green-800' 
                        : notification.type === 'warning' 
                          ? 'border-amber-800'
                          : notification.type === 'new'
                            ? 'border-blue-800'
                            : 'border-gray-800'
                    }`}
                  >
                    <div className="flex">
                      <div className={`h-8 w-8 rounded-lg ${
                        notification.type === 'success' 
                          ? 'bg-green-500/20 text-green-400' 
                          : notification.type === 'warning' 
                            ? 'bg-amber-500/20 text-amber-400'
                            : notification.type === 'new'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-800 text-gray-400'
                        } flex items-center justify-center`}>
                        {notification.icon}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm">{notification.text}</div>
                        <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-2 flex items-center justify-between">
        <button className="p-2 text-gray-400">
          <Inbox className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-400">
          <Calendar className="h-5 w-5" />
        </button>
        <button className="p-2 bg-blue-600 rounded-full flex items-center justify-center">
          <Plus className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-400">
          <Users className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-400">
          <Sparkles className="h-5 w-5" />
        </button>
      </div>
      
      {showAgentDetail && activeAgent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${activeAgent.gradient} flex items-center justify-center`}>
                    {activeAgent.icon}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{activeAgent.name}</h2>
                    <p className="text-gray-400">{activeAgent.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAgentDetail(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg p-4 bg-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Tasks Completed</div>
                  <div className="text-2xl font-bold">{agentStats[activeAgent.id].completed}</div>
                </div>
                
                <div className="rounded-lg p-4 bg-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Pending Tasks</div>
                  <div className="text-2xl font-bold">{agentStats[activeAgent.id].pending}</div>
                </div>
                
                <div className="rounded-lg p-4 bg-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Efficiency</div>
                  <div className="text-2xl font-bold">{agentStats[activeAgent.id].efficiency}%</div>
                </div>
                
                <div className="rounded-lg p-4 bg-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold">{agentStats[activeAgent.id].responseTime}s</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Agent Settings</h3>
                  <button className="text-xs text-blue-400">Advanced Settings</button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Autonomy Level</div>
                      <div className="text-sm text-gray-400">Control how independently the agent operates</div>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                      <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Priority Override</div>
                      <div className="text-sm text-gray-400">Allow agent to reprioritize tasks</div>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center relative cursor-pointer">
                      <div className="absolute right-1 h-4 w-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Learning Mode</div>
                      <div className="text-sm text-gray-400">Enable agent to learn from interactions</div>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center relative cursor-pointer">
                      <div className="absolute right-1 h-4 w-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center font-medium">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Agent
                </button>
                <button className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center font-medium">
                  <Cpu className="h-4 w-4 mr-2" />
                  Launch Console
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicCalendar;

