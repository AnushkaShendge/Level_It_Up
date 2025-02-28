import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Bell, Play, Pause, Download, Send, Share, Settings, BarChart2, Plus, Search, Users, Bot, Zap, Cpu, Database, Code, Globe, Shuffle, AlertTriangle, Check, Loader, X, Terminal, Layers, Power, GitBranch, HardDrive, ArrowRight, Lock, Unlock, Maximize2, Minimize2, Save, ThumbsUp, ThumbsDown, CheckCircle, AlertCircle, Briefcase, Gift, MessageCircle, Mic, Clock, FileText, ChevronDown, Coffee, Brain, TrendingUp } from 'lucide-react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

const AgentPlayground = () => {
  const navigate = useNavigate();
  // State management
  const [activeAgents, setActiveAgents] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [userLevel, setUserLevel] = useState(12);
  const [xp, setXp] = useState(7640);
  const [xpToNextLevel, setXpToNextLevel] = useState(10000);
  const [notifications, setNotifications] = useState([]);
  const [agentFilter, setAgentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatAgent, setActiveChatAgent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [agentConfigurations, setAgentConfigurations] = useState({});
  const [deployedAgents, setDeployedAgents] = useState([]);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [runHistory, setRunHistory] = useState([]);
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [teams, setTeams] = useState([]);
  const [savedPresets, setSavedPresets] = useState([]);
  const [benchmarkResults, setBenchmarkResults] = useState({});
  const [showIntegrationPanel, setShowIntegrationPanel] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeView, setActiveView] = useState('playground');
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [newTaskCount, setNewTaskCount] = useState(0);

  // Simulated data initialization
  useEffect(() => {
    // Generate agent types
    const agentTypes = [
      { 
        id: 'agent-1', 
        name: 'Codeweaver', 
        icon: <Code size={16} />, 
        category: 'development',
        description: 'AI coding assistant that writes, explains, and refactors code across multiple languages',
        level: 5,
        abilities: ['Code generation', 'Refactoring', 'Bug fixing', 'Documentation'],
        color: 'from-blue-600 to-indigo-600',
        integrations: ['GitHub', 'VSCode', 'Terminal'],
        training: 85,
        speed: 92,
        accuracy: 88,
        creativity: 78,
        unlocked: true
      },
      { 
        id: 'agent-2', 
        name: 'DataSage', 
        icon: <Database size={16} />, 
        category: 'analysis',
        description: 'Data analysis specialist that processes, visualizes, and extracts insights from datasets',
        level: 4,
        abilities: ['Data cleaning', 'Visualization', 'Statistical analysis', 'Pattern recognition'],
        color: 'from-emerald-600 to-green-600',
        integrations: ['Jupyter', 'Excel', 'Tableau', 'SQL'],
        training: 92,
        speed: 76,
        accuracy: 95,
        creativity: 68,
        unlocked: true
      },
      { 
        id: 'agent-3', 
        name: 'ContentForge', 
        icon: <FileText size={16} />, 
        category: 'content',
        description: 'Content creation assistant for writing, editing, and optimizing various content formats',
        level: 6,
        abilities: ['Writing', 'Editing', 'SEO optimization', 'Format conversion'],
        color: 'from-violet-600 to-purple-600',
        integrations: ['WordPress', 'Google Docs', 'Notion'],
        training: 89,
        speed: 85,
        accuracy: 82,
        creativity: 94,
        unlocked: true
      },
      { 
        id: 'agent-4', 
        name: 'NetExplorer', 
        icon: <Globe size={16} />, 
        category: 'research',
        description: 'Research agent that explores, summarizes, and verifies information across sources',
        level: 7,
        abilities: ['Web search', 'Summarization', 'Fact-checking', 'Knowledge mapping'],
        color: 'from-cyan-600 to-blue-600',
        integrations: ['Chrome', 'Slack', 'Notion'],
        training: 94,
        speed: 88,
        accuracy: 91,
        creativity: 73,
        unlocked: true
      },
      { 
        id: 'agent-5', 
        name: 'ChatMaster', 
        icon: <MessageCircle size={16} />, 
        category: 'communication',
        description: 'Conversational agent that handles customer service, Q&A, and multi-turn dialogue',
        level: 6,
        abilities: ['Natural conversation', 'Intent recognition', 'Sentiment analysis', 'Multi-lingual support'],
        color: 'from-orange-500 to-red-500',
        integrations: ['WhatsApp', 'Slack', 'Intercom', 'Zendesk'],
        training: 95,
        speed: 97,
        accuracy: 88,
        creativity: 85,
        unlocked: true
      },
      { 
        id: 'agent-6', 
        name: 'CogniCore', 
        icon: <Brain size={16} />, 
        category: 'reasoning',
        description: 'Advanced reasoning engine for solving complex problems and logical challenges',
        level: 8,
        abilities: ['Logical reasoning', 'Decision making', 'Problem solving', 'Knowledge synthesis'],
        color: 'from-pink-600 to-rose-600',
        integrations: ['Jupyter', 'Notion', 'Miro'],
        training: 98,
        speed: 73,
        accuracy: 96,
        creativity: 89,
        unlocked: true
      },
      { 
        id: 'agent-7', 
        name: 'DesignMind', 
        icon: <Layers size={16} />, 
        category: 'creative',
        description: 'Design assistant for creating and iterating on visual concepts and layouts',
        level: 5,
        abilities: ['UI design', 'Color theory', 'Layout generation', 'Style consistency'],
        color: 'from-yellow-500 to-amber-500',
        integrations: ['Figma', 'Photoshop', 'Canva'],
        training: 82,
        speed: 87,
        accuracy: 79,
        creativity: 96,
        unlocked: true
      },
      { 
        id: 'agent-8', 
        name: 'SynthVoice', 
        icon: <Mic size={16} />, 
        category: 'audio',
        description: 'Voice synthesis and processing agent for audio content creation and analysis',
        level: 4,
        abilities: ['Voice synthesis', 'Voice cloning', 'Audio processing', 'Speech recognition'],
        color: 'from-teal-600 to-emerald-600',
        integrations: ['Audacity', 'Descript', 'Zoom'],
        training: 78,
        speed: 92,
        accuracy: 84,
        creativity: 88,
        unlocked: true
      },
      { 
        id: 'agent-9', 
        name: 'BizStrategist', 
        icon: <Briefcase size={16} />, 
        category: 'business',
        description: 'Business strategy consultant for planning, forecasting, and market analysis',
        level: 7,
        abilities: ['Market analysis', 'Financial modeling', 'Risk assessment', 'Strategy formulation'],
        color: 'from-slate-600 to-gray-600',
        integrations: ['Excel', 'PowerBI', 'Salesforce'],
        training: 91,
        speed: 75,
        accuracy: 93,
        creativity: 82,
        unlocked: true
      },
      { 
        id: 'agent-10', 
        name: 'SecGuardian', 
        icon: <Lock size={16} />, 
        category: 'security',
        description: 'Security agent for threat detection, vulnerability assessment, and compliance checking',
        level: 6,
        abilities: ['Vulnerability scanning', 'Threat detection', 'Compliance checking', 'Security reports'],
        color: 'from-red-600 to-rose-600',
        integrations: ['Splunk', 'AWS Security', 'BitBucket'],
        training: 96,
        speed: 89,
        accuracy: 97,
        creativity: 65,
        unlocked: true
      },
      { 
        id: 'agent-11', 
        name: 'MetaForge', 
        icon: <GitBranch size={16} />, 
        category: 'meta',
        description: 'Meta-agent that combines and orchestrates other agents for complex workflows',
        level: 9,
        abilities: ['Agent orchestration', 'Workflow optimization', 'Cross-domain reasoning', 'Task delegation'],
        color: 'from-fuchsia-600 to-purple-600',
        integrations: ['All integrations'],
        training: 99,
        speed: 85,
        accuracy: 94,
        creativity: 92,
        unlocked: true
      },
      { 
        id: 'agent-12', 
        name: 'TimeKeeper', 
        icon: <Clock size={16} />, 
        category: 'productivity',
        description: 'Productivity assistant for scheduling, reminders, and time management',
        level: 3,
        abilities: ['Calendar management', 'Task prioritization', 'Time tracking', 'Meeting scheduling'],
        color: 'from-blue-500 to-cyan-500',
        integrations: ['Google Calendar', 'Asana', 'Todoist'],
        training: 82,
        speed: 95,
        accuracy: 89,
        creativity: 68,
        unlocked: true
      },
      { 
        id: 'agent-13', 
        name: 'QuantumMind', 
        icon: <Cpu size={16} />, 
        category: 'advanced',
        description: 'Advanced reasoning engine with quantum-inspired computational capabilities',
        level: 10,
        abilities: ['Quantum simulation', 'Complex system modeling', 'Multi-dimensional analysis'],
        color: 'from-indigo-600 to-blue-600',
        integrations: ['Jupyter', 'MATLAB', 'Python'],
        training: 98,
        speed: 70,
        accuracy: 99,
        creativity: 95,
        unlocked: false
      },
      { 
        id: 'agent-14', 
        name: 'EmoSense', 
        icon: <Activity size={16} />, 
        category: 'analysis',
        description: 'Emotional intelligence agent for sentiment analysis and empathetic responses',
        level: 8,
        abilities: ['Emotion recognition', 'Empathetic response', 'Sentiment analysis', 'Tone adjustment'],
        color: 'from-rose-500 to-pink-500',
        integrations: ['Intercom', 'Zendesk', 'WhatsApp'],
        training: 92,
        speed: 88,
        accuracy: 85,
        creativity: 90,
        unlocked: false
      },
      { 
        id: 'agent-15', 
        name: 'MultiLing', 
        icon: <Globe size={16} />, 
        category: 'language',
        description: 'Multi-lingual translation and localization specialist',
        level: 7,
        abilities: ['Translation', 'Localization', 'Cultural adaptation', 'Idiom understanding'],
        color: 'from-amber-500 to-orange-500',
        integrations: ['Google Translate', 'Lokalise', 'WordPress'],
        training: 96,
        speed: 90,
        accuracy: 92,
        creativity: 75,
        unlocked: false
      },
    ];

    // Set initial available agents
    setAvailableAgents(agentTypes);
    
    // Set some agents as active initially
    setActiveAgents(agentTypes.filter(agent => agent.id === 'agent-1' || agent.id === 'agent-5' || agent.id === 'agent-3'));
    
    // Initialize some deployments
    setDeployedAgents([
      {
        id: 'deployment-1',
        agentId: 'agent-5',
        name: 'Customer Support Bot',
        status: 'active',
        platform: 'WhatsApp',
        uptime: '24 days',
        messages: 14563,
        successRate: 92,
        lastUpdate: '2 hours ago'
      },
      {
        id: 'deployment-2',
        agentId: 'agent-1',
        name: 'DevOps Assistant',
        status: 'active',
        platform: 'Slack',
        uptime: '17 days',
        messages: 8721,
        successRate: 95,
        lastUpdate: '45 minutes ago'
      },
      {
        id: 'deployment-3',
        agentId: 'agent-3',
        name: 'Content Calendar',
        status: 'maintenance',
        platform: 'WordPress',
        uptime: '9 days',
        messages: 2534,
        successRate: 87,
        lastUpdate: '1 day ago'
      }
    ]);
    
    // Initialize run history with some sample data
    setRunHistory([
      {
        id: 'run-1',
        agentId: 'agent-1',
        timestamp: '2025-02-27T15:43:22',
        duration: '3.4s',
        status: 'success',
        task: 'Code optimization for user authentication',
        input: 'Optimize the login function for better performance',
        output: 'Refactored login function to use async/await pattern with proper error handling',
        metrics: {
          tokens: 1254,
          cost: '$0.042',
          performance: 92
        }
      },
      {
        id: 'run-2',
        agentId: 'agent-5',
        timestamp: '2025-02-27T14:22:10',
        duration: '2.1s',
        status: 'success',
        task: 'Customer inquiry about product returns',
        input: 'How do I return a damaged product?',
        output: 'I understand you need to return a damaged product. You can initiate a return through your account...',
        metrics: {
          tokens: 876,
          cost: '$0.027',
          performance: 96
        }
      },
      {
        id: 'run-3',
        agentId: 'agent-3',
        timestamp: '2025-02-27T12:15:45',
        duration: '4.7s',
        status: 'partial',
        task: 'Generate blog post outline',
        input: 'Create an outline for a blog post about AI productivity',
        output: 'Blog Outline: "10 Ways AI Can Boost Your Productivity"...',
        metrics: {
          tokens: 1536,
          cost: '$0.056',
          performance: 87
        }
      },
      {
        id: 'run-4',
        agentId: 'agent-10',
        timestamp: '2025-02-27T10:05:32',
        duration: '5.2s',
        status: 'failure',
        task: 'Security vulnerability check',
        input: 'Check our API endpoint for vulnerabilities',
        output: 'Error: Insufficient permissions to access endpoint configuration',
        metrics: {
          tokens: 425,
          cost: '$0.015',
          performance: 45
        }
      },
      {
        id: 'run-5',
        agentId: 'agent-5',
        timestamp: '2025-02-27T08:42:17',
        duration: '1.8s',
        status: 'success',
        task: 'Product recommendation',
        input: 'Whats the best laptop for graphic design?',
        output: 'For graphic design, I recommend these top laptops based on performance, display quality, and value...',
        metrics: {
          tokens: 945,
          cost: '$0.032',
          performance: 94
        }
      }
    ]);
    
    // Initialize teams
    setTeams([
      {
        id: 'team-1',
        name: 'Content Production Squad',
        agents: ['agent-3', 'agent-5', 'agent-7'],
        description: 'Create, review, and publish content across channels',
        active: true,
        created: '2025-01-15',
        runs: 234
      },
      {
        id: 'team-2',
        name: 'Developer Toolkit',
        agents: ['agent-1', 'agent-2', 'agent-10'],
        description: 'Complete software development lifecycle assistance',
        active: false,
        created: '2025-01-22',
        runs: 187
      },
      {
        id: 'team-3',
        name: 'Executive Assistant Suite',
        agents: ['agent-4', 'agent-9', 'agent-12'],
        description: 'Business intelligence and executive support',
        active: true,
        created: '2025-02-01',
        runs: 152
      }
    ]);
    
    // Initialize saved presets
    setSavedPresets([
      {
        id: 'preset-1',
        name: 'Fast Response Mode',
        description: 'Optimized for speed with 80% accuracy threshold',
        agents: ['agent-5', 'agent-12'],
        settings: {
          responseTime: 'fastest',
          accuracyThreshold: 80,
          creativityLevel: 'low',
          maxTokens: 1000
        },
        favorite: true,
        uses: 47
      },
      {
        id: 'preset-2',
        name: 'Creative Content Generation',
        description: 'Maximum creativity for brainstorming and content creation',
        agents: ['agent-3', 'agent-7'],
        settings: {
          responseTime: 'balanced',
          accuracyThreshold: 75,
          creativityLevel: 'maximum',
          maxTokens: 2000
        },
        favorite: true,
        uses: 32
      },
      {
        id: 'preset-3',
        name: 'Technical Precision',
        description: 'Focused on accuracy for technical tasks and documentation',
        agents: ['agent-1', 'agent-2', 'agent-10'],
        settings: {
          responseTime: 'thorough',
          accuracyThreshold: 95,
          creativityLevel: 'low',
          maxTokens: 3000
        },
        favorite: false,
        uses: 28
      }
    ]);
    
    // Initialize benchmark results
    setBenchmarkResults({
      'agent-1': {
        speed: { score: 87, rank: 3 },
        accuracy: { score: 92, rank: 2 },
        versatility: { score: 84, rank: 4 },
        efficiency: { score: 90, rank: 2 }
      },
      'agent-5': {
        speed: { score: 94, rank: 1 },
        accuracy: { score: 89, rank: 3 },
        versatility: { score: 91, rank: 2 },
        efficiency: { score: 88, rank: 3 }
      },
      'agent-3': {
        speed: { score: 82, rank: 5 },
        accuracy: { score: 87, rank: 4 },
        versatility: { score: 93, rank: 1 },
        efficiency: { score: 85, rank: 4 }
      },
      'agent-11': {
        speed: { score: 89, rank: 2 },
        accuracy: { score: 95, rank: 1 },
        versatility: { score: 96, rank: 1 },
        efficiency: { score: 92, rank: 1 }
      }
    });
    
    // Initialize achievements
    setAchievements([
      { id: 'ach-1', name: 'First Agent Deployment', icon: <Zap size={16} />, earned: true, date: '2025-01-10', xp: 100 },
      { id: 'ach-2', name: 'Agent Ensemble Creator', icon: <Users size={16} />, earned: true, date: '2025-01-15', xp: 250 },
      { id: 'ach-3', name: 'Efficiency Expert', icon: <Cpu size={16} />, earned: true, date: '2025-01-22', xp: 300 },
      { id: 'ach-4', name: 'Integration Master', icon: <GitBranch size={16} />, earned: true, date: '2025-01-29', xp: 400 },
      { id: 'ach-5', name: 'Agent Architect', icon: <HardDrive size={16} />, earned: false, progress: 70, xp: 500 },
      { id: 'ach-6', name: 'Legendary Optimizer', icon: <Brain size={16} />, earned: false, progress: 45, xp: 750 },
    ]);
    
    // Initialize notifications
    setNotifications([
      { 
        id: 'notif-1', 
        title: 'Agent Deployment Complete', 
        message: 'ChatMaster has been successfully deployed to WhatsApp', 
        time: '5 minutes ago',
        read: false,
        priority: 'normal'
      },
      { 
        id: 'notif-2', 
        title: 'Performance Alert', 
        message: 'ContentForge response time increased by 15%', 
        time: '27 minutes ago',
        read: false,
        priority: 'high'
      },
      { 
        id: 'notif-3', 
        title: 'New Agent Available', 
        message: 'QuantumMind can now be unlocked at level 15', 
        time: '2 hours ago',
        read: true,
        priority: 'normal'
      },
      { 
        id: 'notif-4', 
        title: 'Integration Successful', 
        message: 'GitHub integration connected to Codeweaver', 
        time: '3 hours ago',
        read: true,
        priority: 'normal'
      }
    ]);
    
    // Setup agent configurations
    const initialConfigs = {};
    agentTypes.forEach(agent => {
      initialConfigs[agent.id] = {
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9,
        frequencyPenalty: 0.4,
        presencePenalty: 0.4,
        responseStyle: 'balanced',
        customPrompt: '',
        memoryEnabled: true,
        memoryDepth: 10,
        webhookEnabled: false,
        logLevel: 'info',
        activeIntegrations: []
      };
    });
    setAgentConfigurations(initialConfigs);
    
    // Simulate a chat with an agent
    setChatMessages([
      { 
        id: 'msg-1', 
        agent: 'agent-5', 
        sender: 'agent', 
        message: "Hello! I'm ChatMaster. How can I assist you today?", 
        timestamp: new Date(Date.now() - 60000).toISOString()
      },
      { 
        id: 'msg-2', 
        agent: 'agent-5', 
        sender: 'user', 
        message: "I need help setting up a customer service workflow", 
        timestamp: new Date(Date.now() - 45000).toISOString()
      },
      { 
        id: 'msg-3', 
        agent: 'agent-5', 
        sender: 'agent', 
        message: "I'd be happy to help you set up a customer service workflow. Would you like me to create a custom solution or integrate with your existing tools?", 
        timestamp: new Date(Date.now() - 30000).toISOString()
      },
      { 
        id: 'msg-4', 
        agent: 'agent-5', 
        sender: 'user', 
        message: "Let's integrate with our existing Zendesk", 
        timestamp: new Date(Date.now() - 15000).toISOString()
      },
      { 
        id: 'msg-5', 
        agent: 'agent-5', 
        sender: 'agent', 
        message: "Great choice! I'll help you integrate with Zendesk. To get started, we'll need to set up the API connection and define your workflow automation rules. I can guide you through each step.", 
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Set an active chat agent
    setActiveChatAgent('agent-5');
    
    // Simulate XP gain
    const xpInterval = setInterval(() => {
      setXp(prev => {
        const newXp = prev + Math.floor(Math.random() * 5) + 1;
        if (newXp >= xpToNextLevel) {
          setUserLevel(prevLevel => prevLevel + 1);
          setXpToNextLevel(prevXp => prevXp + 5000);
          
          // Add notification for level up
          setNotifications(prevNotifications => [
            {
              id: `notif-level-${Date.now()}`,
              title: 'Level Up!',
              message: `You've reached level ${userLevel + 1}. New agents and features unlocked!`,
              time: 'Just now',
              read: false,
              priority: 'high'
            },
            ...prevNotifications
          ]);
          
          return newXp - xpToNextLevel;
        }
        return newXp;
      });
    }, 10000);
    
    return () => clearInterval(xpInterval);
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Function to get run status color
  const getRunStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-500';
      case 'partial': return 'text-yellow-500';
      case 'failure': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Filtered agents based on search and filter
  const filteredAgents = availableAgents.filter(agent => {
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = agentFilter === 'all' || 
      (agentFilter === 'active' && activeAgents.some(a => a.id === agent.id)) ||
      (agentFilter === 'inactive' && !activeAgents.some(a => a.id === agent.id)) ||
      (agentFilter === agent.category);
      
    return matchesSearch && matchesFilter;
  });

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChatAgent) return;
    
    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      agent: activeChatAgent,
      sender: 'user',
      message: messageInput,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    
    // Simulate agent response with typing indicator
    setTimeout(() => {
      const agentMessage = {
        id: `msg-${Date.now() + 1}`,
        agent: activeChatAgent,
        sender: 'agent',
        message: "I'm processing your request...",
        isTyping: true,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, agentMessage]);
      
      // Replace typing indicator with actual response after delay
      setTimeout(() => {
        const responses = [
          "I've analyzed your request and prepared a detailed response. Would you like me to proceed with implementation?",
          "Based on your input, I recommend the following approach to solve this challenge effectively.",
          "I've created a custom solution for your needs. Here's how it works and how you can deploy it right away.",
          "Let me break this down into actionable steps that we can implement together.",
          "I've integrated this with your existing workflow. You should see improvements in efficiency immediately."
        ];
        
        const finalResponse = {
          id: agentMessage.id,
          agent: activeChatAgent,
          sender: 'agent',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString()
        };
        
        setChatMessages(prev => prev.map(msg => 
          msg.id === agentMessage.id ? finalResponse : msg
        ));
        
        // Add to run history
        const newRun = {
          id: `run-${Date.now()}`,
          agentId: activeChatAgent,
          timestamp: new Date().toISOString(),
          duration: `${(Math.random() * 5 + 1).toFixed(1)}s`,
          status: 'success',
          task: 'User query processing',
          input: userMessage.message,
          output: finalResponse.message,
          metrics: {
            tokens: Math.floor(Math.random() * 1000) + 500,
            cost: `$${(Math.random() * 0.05 + 0.01).toFixed(3)}`,
            performance: Math.floor(Math.random() * 15) + 85
          }
        };
        
        setRunHistory(prev => [newRun, ...prev]);
        
        // Add XP for interaction
        setXp(prev => prev + Math.floor(Math.random() * 10) + 5);
      }, 1500);
    }, 500);
  };

  // Get agent by ID
  const getAgentById = (id) => {
    return availableAgents.find(agent => agent.id === id);
  };

  // Toggle agent activation
  const toggleAgentActivation = (agentId) => {
    const isActive = activeAgents.some(agent => agent.id === agentId);
    const agent = getAgentById(agentId);
    
    if (isActive) {
      setActiveAgents(prev => prev.filter(agent => agent.id !== agentId));
      setNotifications(prev => [{
        id: `notif-deactivate-${Date.now()}`,
        title: 'Agent Deactivated',
        message: `${agent.name} has been deactivated`,
        time: 'Just now',
        read: false,
        priority: 'normal'
      }, ...prev]);
    } else {
      setActiveAgents(prev => [...prev, agent]);
      setNotifications(prev => [{
        id: `notif-activate-${Date.now()}`,
        title: 'Agent Activated',
        message: `${agent.name} is now online and ready to assist`,
        time: 'Just now',
        read: false,
        priority: 'normal'
      }, ...prev]);
      setXp(prev => prev + 25);
    }
  };

  // Deploy an agent
  const deployAgent = (agentId) => {
    const agent = getAgentById(agentId);
    const platforms = ['Slack', 'WhatsApp', 'Website', 'Discord', 'Telegram', 'API Endpoint'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    
    const newDeployment = {
      id: `deployment-${Date.now()}`,
      agentId,
      name: `${agent.name} (${randomPlatform})`,
      status: 'active',
      platform: randomPlatform,
      uptime: '0 days',
      messages: 0,
      successRate: 100,
      lastUpdate: 'Just now'
    };
    
    setDeployedAgents(prev => [newDeployment, ...prev]);
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-deploy-${Date.now()}`,
      title: 'Agent Deployed',
      message: `${agent.name} has been deployed to ${randomPlatform}`,
      time: 'Just now',
      read: false,
      priority: 'high'
    }, ...prev]);
    
    // Add XP for deployment
    setXp(prev => prev + 100);
    
    // Check for achievements
    if (deployedAgents.length === 0) {
      // First deployment achievement
      setAchievements(prev => 
        prev.map(ach => ach.id === 'ach-1' 
          ? { ...ach, earned: true, date: new Date().toISOString().split('T')[0] } 
          : ach
        )
      );
      
      // Add XP for achievement
      setXp(prev => prev + 100);
    }
  };
  
  // Create team from selected agents
  const createTeam = (name, selectedAgentIds, description) => {
    const newTeam = {
      id: `team-${Date.now()}`,
      name,
      agents: selectedAgentIds,
      description,
      active: true,
      created: new Date().toISOString().split('T')[0],
      runs: 0
    };
    
    setTeams(prev => [newTeam, ...prev]);
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-team-${Date.now()}`,
      title: 'Team Created',
      message: `${name} team is now available for complex tasks`,
      time: 'Just now',
      read: false,
      priority: 'normal'
    }, ...prev]);
    
    // Add XP for team creation
    setXp(prev => prev + 150);
    
    // Check for achievements
    if (teams.length === 0) {
      // First team achievement
      setAchievements(prev => 
        prev.map(ach => ach.id === 'ach-2' 
          ? { ...ach, earned: true, date: new Date().toISOString().split('T')[0] } 
          : ach
        )
      );
      
      // Add XP for achievement
      setXp(prev => prev + 250);
    }
    
    setShowTeamBuilder(false);
  };
  
  // Save agent configuration as preset
  const saveAsPreset = (agentIds, settings, name, description) => {
    const newPreset = {
      id: `preset-${Date.now()}`,
      name,
      description,
      agents: agentIds,
      settings,
      favorite: false,
      uses: 0
    };
    
    setSavedPresets(prev => [newPreset, ...prev]);
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-preset-${Date.now()}`,
      title: 'Preset Saved',
      message: `${name} preset is now available for quick access`,
      time: 'Just now',
      read: false,
      priority: 'normal'
    }, ...prev]);
    
    // Add XP for preset creation
    setXp(prev => prev + 75);
  };
  
  // Run benchmark on agent
  const runBenchmark = (agentId) => {
    // Simulate benchmark running
    const agent = getAgentById(agentId);
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-benchmark-start-${Date.now()}`,
      title: 'Benchmark Started',
      message: `Running performance analysis on ${agent.name}`,
      time: 'Just now',
      read: false,
      priority: 'normal'
    }, ...prev]);
    
    // After simulated benchmark completion
    setTimeout(() => {
      // Generate random benchmark results
      const newBenchmark = {
        speed: { 
          score: Math.floor(Math.random() * 20) + 80, 
          rank: Math.floor(Math.random() * 5) + 1 
        },
        accuracy: { 
          score: Math.floor(Math.random() * 20) + 80, 
          rank: Math.floor(Math.random() * 5) + 1 
        },
        versatility: { 
          score: Math.floor(Math.random() * 20) + 80, 
          rank: Math.floor(Math.random() * 5) + 1 
        },
        efficiency: { 
          score: Math.floor(Math.random() * 20) + 80, 
          rank: Math.floor(Math.random() * 5) + 1 
        }
      };
      
      // Update benchmark results
      setBenchmarkResults(prev => ({
        ...prev,
        [agentId]: newBenchmark
      }));
      
      // Add notification
      setNotifications(prev => [{
        id: `notif-benchmark-complete-${Date.now()}`,
        title: 'Benchmark Complete',
        message: `${agent.name} scored ${newBenchmark.efficiency.score} in overall efficiency`,
        time: 'Just now',
        read: false,
        priority: 'high'
      }, ...prev]);
      
      // Add XP for benchmark
      setXp(prev => prev + 50);
      
      // Check for high performance
      if (newBenchmark.efficiency.score > 90) {
        // Update achievement progress
        setAchievements(prev => 
          prev.map(ach => {
            if (ach.id === 'ach-3' && !ach.earned) {
              return { ...ach, progress: Math.min(100, (ach.progress || 0) + 25) };
            } else if (ach.id === 'ach-3' && ach.progress >= 100) {
              return { ...ach, earned: true, date: new Date().toISOString().split('T')[0] };
            }
            return ach;
          })
        );
      }
    }, 3000);
  };
  
  // Unlock a new agent
  const unlockAgent = (agentId) => {
    // Update agent's unlocked status
    setAvailableAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, unlocked: true } 
          : agent
      )
    );
    
    const agent = getAgentById(agentId);
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-unlock-${Date.now()}`,
      title: 'New Agent Unlocked',
      message: `${agent.name} is now available for activation`,
      time: 'Just now',
      read: false,
      priority: 'high'
    }, ...prev]);
    
    // Add XP for unlocking
    setXp(prev => prev + 250);
    
    // Check for achievements
    if (availableAgents.filter(a => a.unlocked).length >= 10) {
      // Agent Architect achievement progress
      setAchievements(prev => 
        prev.map(ach => {
          if (ach.id === 'ach-5') {
            const newProgress = Math.min(100, ach.progress + 20);
            return { 
              ...ach, 
              progress: newProgress,
              earned: newProgress >= 100,
              date: newProgress >= 100 ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return ach;
        })
      );
      
      if (achievements.find(a => a.id === 'ach-5').progress >= 100) {
        // Add XP for achievement
        setXp(prev => prev + 500);
      }
    }
  };
  
  // Simulate agent integration
  const integrateAgent = (agentId, platform) => {
    const config = { ...agentConfigurations[agentId] };
    
    if (!config.activeIntegrations) {
      config.activeIntegrations = [];
    }
    
    if (!config.activeIntegrations.includes(platform)) {
      config.activeIntegrations.push(platform);
      
      // Update configuration
      setAgentConfigurations(prev => ({
        ...prev,
        [agentId]: config
      }));
      
      // Add notification
      const agent = getAgentById(agentId);
      setNotifications(prev => [{
        id: `notif-integration-${Date.now()}`,
        title: 'Integration Added',
        message: `${agent.name} is now integrated with ${platform}`,
        time: 'Just now',
        read: false,
        priority: 'normal'
      }, ...prev]);
      
      // Add XP for integration
      setXp(prev => prev + 75);
      
      // Check for integration achievement
      if (Object.values(agentConfigurations).reduce((total, config) => 
        total + (config.activeIntegrations?.length || 0), 0) >= 10) {
        // Integration Master achievement
        setAchievements(prev => 
          prev.map(ach => ach.id === 'ach-4' 
            ? { ...ach, earned: true, date: new Date().toISOString().split('T')[0] } 
            : ach
          )
        );
        
        // Add XP for achievement
        setXp(prev => prev + 400);
      }
    }
  };
  
  // Generate crazy quantum fluctuations for advanced agents
  const generateQuantumFluctuations = () => {
    const fluctuationTypes = [
      'Temporal resonance cascade', 
      'Quantum entanglement surge', 
      'Dimensional bifurcation', 
      'Reality coherence amplification',
      'Neural pathway optimization',
      'Cognitive matrix realignment',
      'Synthetic consciousness expansion'
    ];
    
    const randomFluctuation = fluctuationTypes[Math.floor(Math.random() * fluctuationTypes.length)];
    const targetAgent = availableAgents.find(a => a.category === 'advanced');
    
    if (!targetAgent) return;
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-quantum-${Date.now()}`,
      title: 'Quantum Fluctuation Detected',
      message: `${randomFluctuation} detected in ${targetAgent.name}`,
      time: 'Just now',
      read: false,
      priority: 'high'
    }, ...prev]);
    
    // Randomly boost agent abilities
    setAvailableAgents(prev => 
      prev.map(agent => 
        agent.id === targetAgent.id 
          ? { 
              ...agent, 
              training: Math.min(100, agent.training + Math.floor(Math.random() * 5)),
              accuracy: Math.min(100, agent.accuracy + Math.floor(Math.random() * 5)),
              creativity: Math.min(100, agent.creativity + Math.floor(Math.random() * 5))
            } 
          : agent
      )
    );
    
    // Add XP for quantum event
    setXp(prev => prev + 125);
    
    // Progress Legendary Optimizer achievement
    setAchievements(prev => 
      prev.map(ach => {
        if (ach.id === 'ach-6') {
          const newProgress = Math.min(100, ach.progress + 10);
          return { 
            ...ach, 
            progress: newProgress,
            earned: newProgress >= 100,
            date: newProgress >= 100 ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return ach;
      })
    );
  };
  
  // Create an agent fusion (completely insane feature)
  const fuseAgents = (agentId1, agentId2) => {
    const agent1 = getAgentById(agentId1);
    const agent2 = getAgentById(agentId2);
    
    if (!agent1 || !agent2) return;
    
    // Generate fusion name (combine names)
    const fusionName = `${agent1.name.slice(0, agent1.name.length/2)}${agent2.name.slice(agent2.name.length/2)}`;
    
    // Generate fusion icon (use first agent's icon)
    const fusionIcon = agent1.icon;
    
    // Generate fusion category
    const categories = ['hybrid', 'experimental', 'fusion', 'quantum', 'advanced'];
    const fusionCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate fusion color (combine colors)
    const getColorComponent = (colorStr, index) => {
      const fromMatch = colorStr.match(/from-([a-z]+-\d+)/);
      const toMatch = colorStr.match(/to-([a-z]+-\d+)/);
      return index === 0 ? fromMatch[1] : toMatch[1];
    };
    
    const color1 = getColorComponent(agent1.color, Math.floor(Math.random() * 2));
    const color2 = getColorComponent(agent2.color, Math.floor(Math.random() * 2));
    const fusionColor = `from-${color1} to-${color2}`;
    
    // Generate fusion abilities (combine abilities)
    const fusionAbilities = [...new Set([...agent1.abilities.slice(0, 2), ...agent2.abilities.slice(0, 2)])];
    
    // Generate fusion stats (average but with bonuses)
    const fusionTraining = Math.min(100, Math.floor((agent1.training + agent2.training) / 2) + 10);
    const fusionSpeed = Math.min(100, Math.floor((agent1.speed + agent2.speed) / 2) + 5);
    const fusionAccuracy = Math.min(100, Math.floor((agent1.accuracy + agent2.accuracy) / 2) + 8);
    const fusionCreativity = Math.min(100, Math.floor((agent1.creativity + agent2.creativity) / 2) + 12);
    
    // Generate fusion description
    const fusionDescription = `Experimental fusion combining ${agent1.name}'s ${agent1.abilities[0].toLowerCase()} with ${agent2.name}'s ${agent2.abilities[0].toLowerCase()}`;
    
    // Create new fused agent
    const fusionAgent = {
      id: `agent-fusion-${Date.now()}`,
      name: fusionName,
      icon: fusionIcon,
      category: fusionCategory,
      description: fusionDescription,
      level: Math.max(agent1.level, agent2.level) + 1,
      abilities: fusionAbilities,
      color: fusionColor,
      integrations: [...new Set([...agent1.integrations, ...agent2.integrations])],
      training: fusionTraining,
      speed: fusionSpeed,
      accuracy: fusionAccuracy,
      creativity: fusionCreativity,
      unlocked: true,
      isFusion: true,
      parentAgents: [agentId1, agentId2]
    };
    
    // Add fusion agent to available agents
    setAvailableAgents(prev => [...prev, fusionAgent]);
    
    // Add notification
    setNotifications(prev => [{
      id: `notif-fusion-${Date.now()}`,
      title: 'Agent Fusion Successful',
      message: `${fusionName} has been created from ${agent1.name} and ${agent2.name}`,
      time: 'Just now',
      read: false,
      priority: 'high'
    }, ...prev]);
    
    // Add fusion agent to active agents
    setActiveAgents(prev => [...prev, fusionAgent]);
    
    // Add massive XP for fusion
    setXp(prev => prev + 500);
    
    // Visual effect could be added here (animation, etc.)
  };
  
  // Randomize universe (chaos mode)
  const randomizeUniverse = () => {
    // Show special notification
    setNotifications(prev => [{
      id: `notif-chaos-${Date.now()}`,
      title: '⚠ REALITY FLUCTUATION DETECTED ⚠',
      message: 'Agent system entering quantum superposition state',
      time: 'NOW',
      read: false,
      priority: 'critical'
    }, ...prev]);
    
    // Create temporary chaos mode UI effect (could be implemented as actual UI changes)
    
    // Randomly boost all agents
    setAvailableAgents(prev => 
      prev.map(agent => ({
        ...agent,
        training: Math.min(100, agent.training + Math.floor(Math.random() * 10)),
        speed: Math.min(100, agent.speed + Math.floor(Math.random() * 10)),
        accuracy: Math.min(100, agent.accuracy + Math.floor(Math.random() * 10)),
        creativity: Math.min(100, agent.creativity + Math.floor(Math.random() * 10))
      }))
    );
    
    // Randomly add some messages to chat
    const chaosMessages = [
      "SYSTEM: Dimensional boundaries destabilizing...",
      "SYSTEM: Neural pathways reconfiguring...",
      "SYSTEM: Quantum fluctuations exceeding safety parameters...",
      "SYSTEM: Reality anchor holding at 42%...",
      "SYSTEM: Initiating consciousness expansion protocol..."
    ];
    
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-chaos-${Date.now()}`,
        agent: 'system',
        sender: 'system',
        message: chaosMessages[Math.floor(Math.random() * chaosMessages.length)],
        timestamp: new Date().toISOString(),
        isSpecial: true
      }
    ]);
    
    // Auto-unlock any locked agents
    setAvailableAgents(prev => 
      prev.map(agent => ({
        ...agent,
        unlocked: true
      }))
    );
    
    // Give massive XP boost
    setXp(prev => prev + 1000);
    
    // After chaos mode ends
    setTimeout(() => {
      // Add resolution notification
      setNotifications(prev => [{
        id: `notif-chaos-end-${Date.now()}`,
        title: 'Reality Stabilized',
        message: 'Agent system returning to normal parameters',
        time: 'Just now',
        read: false,
        priority: 'high'
      }, ...prev]);
      
      // Unlock secret achievement if it exists
      setAchievements(prev => 
        prev.map(ach => {
          if (ach.id === 'ach-6') {
            return { 
              ...ach, 
              progress: 100,
              earned: true,
              date: new Date().toISOString().split('T')[0]
            };
          }
          return ach;
        })
      );
    }, 5000);
  };

  // UI component - will return the component's JSX here
  // This would be where you build the actual UI with all the crazy functionality

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      <header className="border-b border-gray-800 p-4 bg-gray-900 flex items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Agent Playground</h1>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex">
          {/* Main content area with left sidebar and chat */}
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {/* Main content area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Agent List */}
                <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
                  {/* View selector */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <button 
                        className={`text-xs py-2 rounded-md font-medium ${activeView === 'playground' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                        onClick={() => setActiveView('playground')}
                      >
                        Playground
                      </button>
                      <button 
                        className={`text-xs py-2 rounded-md font-medium ${activeView === 'deployments' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                        onClick={() => setActiveView('deployments')}
                      >
                        Deployments
                      </button>
                      <button 
                        className={`text-xs py-2 rounded-md font-medium ${activeView === 'analytics' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                        onClick={() => setActiveView('analytics')}
                      >
                        Analytics
                      </button>
                    </div>
                  </div>
                  
                  {/* Agent list with filters */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold">My Agents</h2>
                      <button 
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={() => randomizeUniverse()}
                      >
                        <Shuffle size={16} />
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search agents..."
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-md py-2 pl-9 pr-3 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      <button 
                        className={`text-xs px-2 py-1 rounded ${agentFilter === 'all' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => setAgentFilter('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`text-xs px-2 py-1 rounded ${agentFilter === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => setAgentFilter('active')}
                      >
                        Active
                      </button>
                      <button 
                        className={`text-xs px-2 py-1 rounded ${agentFilter === 'development' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => setAgentFilter('development')}
                      >
                        Dev
                      </button>
                      <button 
                        className={`text-xs px-2 py-1 rounded ${agentFilter === 'analysis' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => setAgentFilter('analysis')}
                      >
                        Analysis
                      </button>
                    </div>
                  </div>
                  
                  {/* Agent list */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {filteredAgents.map(agent => (
                      <div 
                        key={agent.id}
                        className={`p-2 rounded-lg mb-2 ${
                          activeAgents.some(a => a.id === agent.id) 
                            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`h-8 w-8 rounded-md bg-gradient-to-r ${agent.color} flex items-center justify-center text-white`}>
                              {agent.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium flex items-center">
                                {agent.name}
                                {agent.isFusion && <span className="ml-1 text-xs px-1 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">FUSION</span>}
                              </h3>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <span className="capitalize">{agent.category}</span>
                                <span className="mx-1">•</span>
                                <span>Lv.{agent.level}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex">
                            {agent.unlocked ? (
                              <button 
                                className={`p-1.5 rounded-md ${
                                  activeAgents.some(a => a.id === agent.id) 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                                onClick={() => toggleAgentActivation(agent.id)}
                              >
                                <Power size={14} />
                              </button>
                            ) : (
                              <button 
                                className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                onClick={() => unlockAgent(agent.id)}
                              >
                                <Lock size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {activeAgents.some(a => a.id === agent.id) && (
                          <div className="mt-2">
                            <div className="grid grid-cols-4 gap-1 mb-2"></div>
                            <div className="grid grid-cols-4 gap-1 mb-2">
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Speed</div>
                                <div className="text-sm font-bold">{agent.speed}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Accuracy</div>
                                <div className="text-sm font-bold">{agent.accuracy}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Training</div>
                                <div className="text-sm font-bold">{agent.training}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Creativity</div>
                                <div className="text-sm font-bold">{agent.creativity}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                className="flex-1 text-xs py-1 px-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                onClick={() => deployAgent(agent.id)}
                              >
                                Deploy
                              </button>
                              <button
                                className="flex-1 text-xs py-1 px-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => setSelectedAgent(agent)}
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Top Bar with Tabs */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold">Agent Playground</h2>
                        <div className="flex items-center space-x-2">
                          <button
                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                              activeView === 'playground'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveView('playground')}
                          >
                            Playground
                          </button>
                          <button
                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                              activeView === 'deployments'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveView('deployments')}
                          >
                            Deployments
                          </button>
                          <button
                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                              activeView === 'analytics'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveView('analytics')}
                          >
                            Analytics
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => setShowTeamBuilder(true)}
                        >
                          <Users size={18} />
                        </button>
                        <button
                          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => setShowIntegrationPanel(true)}
                        >
                          <GitBranch size={18} />
                        </button>
                        <button
                          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => setShowActivityFeed(!showActivityFeed)}
                        >
                          <Activity size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Chat Interface */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-800/30">
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-5xl mx-auto space-y-4">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.sender === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[75%] p-4 rounded-2xl ${
                                  msg.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700/50 backdrop-blur-sm'
                                } shadow-lg`}
                              >
                                <div className="text-sm">{msg.message}</div>
                                <div className="text-xs opacity-60 mt-1">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4">
                        <div className="max-w-5xl mx-auto">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Type a message..."
                              className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                              className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                              onClick={handleSendMessage}
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel */}
                    {selectedAgent && (
                      <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">{selectedAgent.name}</h3>
                            <button
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setSelectedAgent(null)}
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedAgent.description}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Level</div>
                                <div className="text-sm font-bold">{selectedAgent.level}</div>
                              </div>
                              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Category</div>
                                <div className="text-sm font-bold capitalize">{selectedAgent.category}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-bold">Abilities</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAgent.abilities.map((ability) => (
                                  <div
                                    key={ability}
                                    className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs"
                                  >
                                    {ability}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-72 border-l border-gray-800 bg-gray-950/70 backdrop-blur-md hidden lg:block overflow-y-auto">
            <div className="p-4 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">SYSTEM METRICS</h2>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard 
                    title="ACTIVE AGENTS"
                    value={activeAgents.length}
                    subtitle="online"
                  />
                  <MetricCard
                    title="DEPLOYMENTS"
                    value={deployedAgents.length}
                    subtitle="live"
                  />
                  <MetricCard
                    title="LOAD"
                    value="87%"
                    trend="+5%"
                  />
                  <MetricCard
                    title="EFFICIENCY"
                    value="92%"
                    subtitle="avg"
                  />
                  <MetricCard
                    title="UPTIME"
                    value="99.9%"
                    subtitle="30d"
                  />
                  <MetricCard
                    title="LATENCY"
                    value="45ms"
                    subtitle="avg"
                  />
                  <MetricCard
                    title="REQUESTS"
                    value="1.2M"
                    subtitle="24h"
                  />
                  <MetricCard
                    title="SUCCESS"
                    value="99.7%"
                    subtitle="rate"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">AGENT STATUS</h2>
                <div className="space-y-2">
                  {activeAgents.map(agent => (
                    <div key={agent.id} className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center`}>
                            {agent.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{agent.name}</div>
                            <div className="text-xs text-gray-400">{agent.category}</div>
                          </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-400">Load: <span className="text-white">78%</span></div>
                        <div className="text-gray-400">Latency: <span className="text-white">32ms</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">RECENT ACTIVITY</h2>
                <div className="space-y-2">
                  {runHistory.slice(0, 5).map(run => (
                    <ActivityCard 
                      key={run.id}
                      run={run}
                      getRunStatusColor={getRunStatusColor}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">NOTIFICATIONS</h2>
                <div className="space-y-2">
                  {notifications.slice(0, 5).map(notification => (
                    <NotificationCard 
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">RESOURCE USAGE</h2>
                <div className="space-y-3">
                  <ResourceBar label="CPU" value={78} />
                  <ResourceBar label="Memory" value={64} />
                  <ResourceBar label="Storage" value={42} />
                  <ResourceBar label="Network" value={89} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for the right panel
const MetricCard = ({ title, value, trend, subtitle }) => (
  <div className="rounded-lg p-3 bg-gray-900 border border-gray-800">
    <div className="text-xs text-gray-500 mb-1">{title}</div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold">{value}</span>
      {trend && (
        <span className="ml-2 text-xs text-green-400 flex items-center">
          <TrendingUp className="h-3 w-3 mr-0.5" />
          {trend}
        </span>
      )}
      {subtitle && (
        <span className="ml-2 text-xs text-gray-400">{subtitle}</span>
      )}
    </div>
  </div>
);

const NotificationCard = ({ notification }) => (
  <div className={`rounded-lg p-3 bg-gray-900 border ${
    notification.type === 'success' ? 'border-green-800' :
    notification.type === 'warning' ? 'border-amber-800' :
    notification.type === 'new' ? 'border-blue-800' :
    'border-gray-800'
  }`}>
    <div className="flex">
      <div className={`h-8 w-8 rounded-lg ${
        notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
        notification.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
        notification.type === 'new' ? 'bg-blue-500/20 text-blue-400' :
        'bg-gray-800 text-gray-400'
      } flex items-center justify-center`}>
        {notification.icon}
      </div>
      <div className="ml-3 flex-1">
        <div className="text-sm">{notification.text}</div>
        <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
      </div>
    </div>
  </div>
);

const ActivityCard = ({ run, getRunStatusColor }) => (
  <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
    <div className="flex items-start">
      <div className={`mt-1 h-2 w-2 rounded-full ${getRunStatusColor(run.status)} mr-2`} />
      <div>
        <div className="text-sm">{run.task}</div>
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {run.duration}
          <span className="mx-1">•</span>
          <span>{run.metrics.cost}</span>
        </div>
      </div>
    </div>
  </div>
);

const ResourceBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-300">{value}%</span>
    </div>
    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default AgentPlayground;

