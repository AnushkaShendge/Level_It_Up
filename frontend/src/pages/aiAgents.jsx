import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Network, ArrowRight, Target, Code, Database, Plus, Eye, Maximize2, Activity, GitBranch, GitCommit, Play, AlertTriangle, CheckCircle, HelpCircle, AlertCircle, Users, RefreshCw, TrendingUp, BarChart2, Save, RotateCw, Layers, Mail, Mic, Calendar, FileText, Check, Loader, Clock, Pause, ArrowUpRight, ArrowDownRight, Cpu, Hexagon } from 'lucide-react';
import * as d3 from 'd3';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

const AIAgentsPage = () => {
  const [activeView, setActiveView] = useState('neural');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [agents, setAgents] = useState([]);
  const [nodesToHighlight, setNodesToHighlight] = useState([]);
  const [activeConnections, setActiveConnections] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const networkRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Generate sample agents
  useEffect(() => {
    const sampleAgents = [
      { 
        id: 'agent-1', 
        name: 'Email Classifier', 
        type: 'NLP',
        icon: <Mail size={16} />,
        color: 'bg-blue-500',
        accuracy: 92.4,
        learningRate: 0.015,
        epochs: 342,
        layers: 4,
        lastActive: '2 minutes ago',
        training: { status: 'complete', progress: 100 },
        metrics: [
          { name: 'Accuracy', value: 92.4, trend: 'up', change: 2.1 },
          { name: 'F1 Score', value: 0.89, trend: 'up', change: 0.05 },
          { name: 'Latency', value: '24ms', trend: 'down', change: '15%' }
        ],
        recentActions: [
          { action: 'Classified priority email', time: '2m ago', success: true },
          { action: 'Updated sentiment model', time: '17m ago', success: true },
          { action: 'Detected anomaly in spam pattern', time: '52m ago', success: true }
        ]
      },
      { 
        id: 'agent-2', 
        name: 'Meeting Transcriber', 
        type: 'Speech Recognition',
        icon: <Mic size={16} />,
        color: 'bg-green-500',
        accuracy: 87.8,
        learningRate: 0.008,
        epochs: 215,
        layers: 5,
        lastActive: 'Just now',
        training: { status: 'in-progress', progress: 68 },
        metrics: [
          { name: 'Word Error Rate', value: 5.2, trend: 'down', change: 0.7 },
          { name: 'Real-time Factor', value: 0.76, trend: 'down', change: 0.12 },
          { name: 'Speaker Accuracy', value: 91.3, trend: 'up', change: 1.8 }
        ],
        recentActions: [
          { action: 'Active transcription in progress', time: 'Now', success: true },
          { action: 'Identified 3 speakers', time: '1m ago', success: true },
          { action: 'Improved noise reduction model', time: '43m ago', success: true }
        ]
      },
      { 
        id: 'agent-3', 
        name: 'Calendar Optimizer', 
        type: 'Decision Optimization',
        icon: <Calendar size={16} />,
        color: 'bg-purple-500',
        accuracy: 89.5,
        learningRate: 0.012,
        epochs: 178,
        layers: 3,
        lastActive: '5 minutes ago',
        training: { status: 'scheduled', progress: 0 },
        metrics: [
          { name: 'Schedule Efficiency', value: 82.1, trend: 'up', change: 4.2 },
          { name: 'Conflict Resolution', value: 93.7, trend: 'up', change: 1.5 },
          { name: 'User Satisfaction', value: 88.2, trend: 'up', change: 6.1 }
        ],
        recentActions: [
          { action: 'Rescheduled overlapping meetings', time: '5m ago', success: true },
          { action: 'Detected scheduling pattern', time: '27m ago', success: true },
          { action: 'Optimized meeting times for productivity', time: '1h ago', success: true }
        ]
      },
      { 
        id: 'agent-4', 
        name: 'Sentiment Analyzer', 
        type: 'Emotion AI',
        icon: <BarChart2 size={16} />,
        color: 'bg-red-500',
        accuracy: 84.3,
        learningRate: 0.02,
        epochs: 267,
        layers: 4,
        lastActive: '8 minutes ago',
        training: { status: 'paused', progress: 43 },
        metrics: [
          { name: 'Sentiment Accuracy', value: 84.3, trend: 'up', change: 1.2 },
          { name: 'Emotion Detection', value: 78.9, trend: 'up', change: 2.8 },
          { name: 'Context Awareness', value: 72.1, trend: 'up', change: 5.6 }
        ],
        recentActions: [
          { action: 'Analyzed customer feedback', time: '8m ago', success: true },
          { action: 'Detected sarcasm in message', time: '22m ago', success: false },
          { action: 'Updated emotional state model', time: '1h ago', success: true }
        ]
      },
      { 
        id: 'agent-5', 
        name: 'Document Processor', 
        type: 'Document AI',
        icon: <FileText size={16} />,
        color: 'bg-yellow-500',
        accuracy: 90.7,
        learningRate: 0.01,
        epochs: 394,
        layers: 6,
        lastActive: '3 minutes ago',
        training: { status: 'complete', progress: 100 },
        metrics: [
          { name: 'Text Extraction', value: 93.2, trend: 'up', change: 0.7 },
          { name: 'Classification', value: 90.7, trend: 'up', change: 1.3 },
          { name: 'Processing Speed', value: '450ms', trend: 'down', change: '25%' }
        ],
        recentActions: [
          { action: 'Processed legal contract', time: '3m ago', success: true },
          { action: 'Extracted key clauses', time: '11m ago', success: true },
          { action: 'Generated document summary', time: '37m ago', success: true }
        ]
      }
    ];
    
    setAgents(sampleAgents);
    
    if (sampleAgents.length > 0) {
      setSelectedAgent(sampleAgents[0]);
    }
    
    // Generate random logs
    const logTypes = ['info', 'warning', 'error', 'success'];
    const logMessages = [
      "Neural pathway strengthened between nodes 127 and 342",
      "Attention mechanism activated for document processing",
      "New pattern detected in user scheduling behavior",
      "Weight optimization complete for sentiment analysis layer",
      "Self-correction applied to transcription error pattern",
      "Context window expanded for improved comprehension",
      "Memory consolidation process initiated",
      "Detected and eliminated bias in classification output",
      "Cross-agent knowledge transfer complete",
      "Reinforcement learning cycle completed successfully",
      "Gradient explosion prevented in deep layers",
      "Embedding vectors recalibrated for improved accuracy",
      "Anomaly detected in training data distribution",
      "Backpropagation optimization reached local minimum",
      "Tensor operations optimized for GPU acceleration",
      "Feature extraction layer self-modified for efficiency"
    ];
    
    const generateRandomLogs = () => {
      const newLogs = [];
      for (let i = 0; i < 20; i++) {
        const type = logTypes[Math.floor(Math.random() * logTypes.length)];
        const message = logMessages[Math.floor(Math.random() * logMessages.length)];
        newLogs.push({
          id: `log-${Date.now()}-${i}`,
          type,
          message,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString()
        });
      }
      return newLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };
    
    setLogs(generateRandomLogs());
  }, []);
  
  // Simulate training process
  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsTraining(false);
            return 100;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isTraining]);
  
  // Simulate neural network activity
  useEffect(() => {
    if (networkRef.current && activeView === 'neural') {
      const width = networkRef.current.clientWidth;
      const height = 480;
      
      // Clear previous SVG
      d3.select(networkRef.current).selectAll("*").remove();
      
      // Create SVG
      const svg = d3.select(networkRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);
      
      // Create gradient for connections
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "connection-gradient")
        .attr("gradientUnits", "userSpaceOnUse");
        
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#3B82F6");
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#A855F7");
      
      // Define layers structure
      const layers = [
        { name: "Input", nodes: 12 },
        { name: "Hidden 1", nodes: 24 },
        { name: "Hidden 2", nodes: 16 },
        { name: "Hidden 3", nodes: 8 },
        { name: "Output", nodes: 5 }
      ];
      
      // Calculate positions
      const layerWidth = width / (layers.length + 1);
      const nodes = [];
      const links = [];
      
      // Generate nodes
      layers.forEach((layer, layerIndex) => {
        const x = layerWidth * (layerIndex + 1);
        const nodeHeight = height / (layer.nodes + 1);
        
        for (let i = 0; i < layer.nodes; i++) {
          const y = nodeHeight * (i + 1);
          nodes.push({
            id: `${layerIndex}-${i}`,
            x,
            y,
            layerIndex,
            nodeIndex: i
          });
        }
      });
      
      // Generate connections between layers
      for (let l = 0; l < layers.length - 1; l++) {
        const fromNodes = nodes.filter(n => n.layerIndex === l);
        const toNodes = nodes.filter(n => n.layerIndex === l + 1);
        
        fromNodes.forEach(source => {
          toNodes.forEach(target => {
            links.push({
              source,
              target,
              value: Math.random(),
              id: `link-${source.id}-${target.id}`
            });
          });
        });
      }
      
      // Draw connections
      const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", "url(#connection-gradient)")
        .attr("stroke-width", d => Math.max(0.5, d.value * 2))
        .attr("opacity", d => Math.max(0.05, d.value * 0.3));
      
      // Draw nodes
      const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 4)
        .attr("fill", "#3B82F6")
        .attr("stroke", "#1E40AF")
        .attr("stroke-width", 1);
      
      // Add layer labels
      svg.append("g")
        .selectAll("text")
        .data(layers)
        .enter()
        .append("text")
        .attr("x", (d, i) => layerWidth * (i + 1))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#9CA3AF")
        .attr("font-size", "12px")
        .text(d => d.name);
      
      // Animation loop for neural activity simulation
      let frame = 0;
      
      const animate = () => {
        frame++;
        
        // Randomly highlight nodes
        if (frame % 15 === 0) {
          const numToHighlight = Math.floor(Math.random() * 5) + 1;
          const highlightedNodes = [];
          
          for (let i = 0; i < numToHighlight; i++) {
            const randomNodeIndex = Math.floor(Math.random() * nodes.length);
            highlightedNodes.push(nodes[randomNodeIndex].id);
          }
          
          setNodesToHighlight(highlightedNodes);
          
          // Highlight connections between activated nodes
          const activeLinks = [];
          for (let i = 0; i < Math.min(10, links.length / 20); i++) {
            const randomLinkIndex = Math.floor(Math.random() * links.length);
            activeLinks.push(links[randomLinkIndex].id);
          }
          
          setActiveConnections(activeLinks);
        }
        
        // Update node colors based on activation
        node.attr("fill", d => nodesToHighlight.includes(d.id) ? "#10B981" : "#3B82F6")
            .attr("r", d => nodesToHighlight.includes(d.id) ? 6 : 4)
            .attr("opacity", d => nodesToHighlight.includes(d.id) ? 1 : 0.7);
        
        // Update connection colors based on activation
        link.attr("stroke", d => activeConnections.includes(d.id) ? "url(#connection-gradient)" : "#3B82F6")
            .attr("stroke-width", d => activeConnections.includes(d.id) ? 2 : Math.max(0.2, d.value))
            .attr("opacity", d => activeConnections.includes(d.id) ? 0.8 : Math.max(0.05, d.value * 0.2));
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [activeView, nodesToHighlight, activeConnections]);
  
  // Add a new random log entry periodically
  useEffect(() => {
    const logTypes = ['info', 'warning', 'error', 'success'];
    const logMessages = [
      "Neural pathway strengthened between nodes 127 and 342",
      "Attention mechanism activated for document processing",
      "New pattern detected in user scheduling behavior",
      "Weight optimization complete for sentiment analysis layer",
      "Self-correction applied to transcription error pattern",
      "Context window expanded for improved comprehension",
      "Memory consolidation process initiated",
      "Detected and eliminated bias in classification output",
      "Cross-agent knowledge transfer complete",
      "Reinforcement learning cycle completed successfully",
      "Gradient explosion prevented in deep layers",
      "Embedding vectors recalibrated for improved accuracy",
      "Anomaly detected in training data distribution",
      "Backpropagation optimization reached local minimum",
      "Tensor operations optimized for GPU acceleration",
      "Feature extraction layer self-modified for efficiency"
    ];
    
    const logInterval = setInterval(() => {
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const message = logMessages[Math.floor(Math.random() * logMessages.length)];
      
      setLogs(prevLogs => [{
        id: `log-${Date.now()}`,
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }, ...prevLogs.slice(0, 49)]);
    }, 3000);
    
    return () => clearInterval(logInterval);
  }, []);
  
  // Helper for log icon
  const getLogIcon = (type) => {
    switch(type) {
      case 'info': return <HelpCircle size={14} className="text-blue-400" />;
      case 'warning': return <AlertCircle size={14} className="text-yellow-400" />;
      case 'error': return <AlertTriangle size={14} className="text-red-400" />;
      case 'success': return <CheckCircle size={14} className="text-green-400" />;
      default: return <HelpCircle size={14} className="text-blue-400" />;
    }
  };
  
  // Start training for selected agent
  const handleStartTraining = () => {
    if (selectedAgent) {
      setIsTraining(true);
      setTrainingProgress(0);
      
      // Add a log entry for training start
      setLogs(prevLogs => [{
        id: `log-${Date.now()}`,
        type: 'info',
        message: `Training started for ${selectedAgent.name}`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prevLogs.slice(0, 49)]);
    }
  };
  
  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6 bg-gray-900 text-white">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">AI Agents & Neural Learning</h1>
                  <p className="text-sm text-gray-400">Visualize agent learning and neural network dynamics</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-800 hover:bg-gray-700 transition-colors px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2">
                  <Plus size={16} />
                  <span>New Agent</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 transition-colors px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2">
                  <Play size={16} />
                  <span>Run Simulation</span>
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
              {/* Left Column - Agents List */}
              <div className="col-span-3 flex flex-col overflow-hidden">
                <div className="bg-gray-800 rounded-xl p-4 flex-1 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Active Agents</h2>
                    <span className="bg-blue-500 text-xs px-2 py-0.5 rounded-full">
                      {agents.length} agents
                    </span>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {agents.map(agent => (
                      <div 
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        className={`bg-gray-900 rounded-lg p-3 border ${
                          selectedAgent?.id === agent.id ? 'border-blue-500' : 'border-gray-700'
                        } hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden group`}
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full ${agent.color}`}></div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`${agent.color} p-2 rounded-lg mr-3`}>
                              {agent.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">{agent.name}</h3>
                              <p className="text-xs text-gray-400">{agent.type}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Activity size={10} className="mr-1" /> 
                                  {agent.accuracy}% accuracy
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {agent.training.status === 'in-progress' && (
                            <span className="text-xs text-blue-400 flex items-center whitespace-nowrap">
                              <Loader size={10} className="mr-1 animate-spin" /> Training
                            </span>
                          )}
                          
                          {agent.training.status === 'complete' && (
                            <span className="text-xs text-green-400 flex items-center whitespace-nowrap">
                              <Check size={10} className="mr-1" /> Trained
                            </span>
                          )}
                          
                          {agent.training.status === 'scheduled' && (
                            <span className="text-xs text-yellow-400 flex items-center whitespace-nowrap">
                              <Clock size={10} className="mr-1" /> Scheduled
                            </span>
                          )}
                          
                          {agent.training.status === 'paused' && (
                            <span className="text-xs text-gray-400 flex items-center whitespace-nowrap">
                              <Pause size={10} className="mr-1" /> Paused
                            </span>
                          )}
                        </div>
                        
                        {agent.training.status === 'in-progress' && (
                          <div className="mt-2">
                            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                                style={{ width: `${agent.training.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">{agent.training.progress}%</span>
                            </div>
                          </div>
                        )}
                        
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
              
              {/* Middle Column - Neural Network Visualization */}
              <div className="col-span-6 flex flex-col overflow-hidden">
                <div className="flex space-x-2 mb-4">
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeView === 'neural' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveView('neural')}
                  >
                    Neural Network
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeView === 'knowledge' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveView('knowledge')}
                  >
                    Knowledge Graph
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeView === 'learning' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveView('learning')}
                  >
                    Learning Progress
                  </button>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-4 flex-1 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      {activeView === 'neural' && 'Neural Network Visualization'}
                      {activeView === 'knowledge' && 'Knowledge Graph'}
                      {activeView === 'learning' && 'Learning Progress'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full flex items-center">
                        <Zap size={10} className="mr-1" />
                        <span>Live Activity</span>
                      </span>
                      <button className="bg-gray-700 hover:bg-gray-600 p-1.5 rounded-lg">
                        <Maximize2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {activeView === 'neural' && (
                    <div className="flex-1 overflow-hidden" ref={networkRef}>
                      {/* D3 will render here */}
                    </div>
                  )}
                  
                  {/* Knowledge Graph placeholder - in a real implementation, use a graph visualization library */}
                  {activeView === 'knowledge' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center p-8 rounded-lg border border-dashed border-gray-600 bg-gray-900/50">
                        <Network size={40} className="mx-auto text-gray-500 mb-3" />
                        <p className="text-gray-400">Knowledge graph visualization would appear here</p>
                        <p className="text-xs text-gray-500 mt-2">Showing interconnected concepts and learnings</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Learning Progress placeholder */}
                  {activeView === 'learning' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center p-8 rounded-lg border border-dashed border-gray-600 bg-gray-900/50">
                        <TrendingUp size={40} className="mx-auto text-gray-500 mb-3" />
                        <p className="text-gray-400">Learning curves and progress metrics would appear here</p>
                        <p className="text-xs text-gray-500 mt-2">Showing accuracy, loss, and other training metrics over time</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* System Activity Logs */}
                <div className="mt-4 bg-gray-800 rounded-xl p-4 h-48 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-semibold">Neural System Logs</h2>
                    <span className="text-xs text-gray-400">Real-time activity</span>
                  </div>
                  <div className="flex-1 overflow-y-auto font-mono text-xs">
                    {logs.map(log => (
                      <div key={log.id} className="flex items-start py-1 border-b border-gray-700 last:border-0">
                        <div className="mr-2 mt-0.5">
                          {getLogIcon(log.type)}
                        </div>
                        <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                        <span className={`
                          ${log.type === 'info' ? 'text-blue-400' : ''}
                          ${log.type === 'warning' ? 'text-yellow-400' : ''}
                          ${log.type === 'error' ? 'text-red-400' : ''}
                          ${log.type === 'success' ? 'text-green-400' : ''}
                        `}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Agent Details */}
              <div className="col-span-3 flex flex-col overflow-hidden">
                {selectedAgent && (
                  <div className="bg-gray-800 rounded-xl p-4 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Agent Details</h2>
                      <div className="flex space-x-1">
                        <button 
                          onClick={handleStartTraining}
                          disabled={isTraining}
                          
                          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-lg text-xs flex items-center space-x-1"
                        >
                          {isTraining ? (
                            <>
                              <RotateCw size={12} className="animate-spin" />
                              <span>Training...</span>
                            </>
                          ) : (
                            <>
                              <Zap size={12} />
                              <span>Train</span>
                            </>
                          )}
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 transition-colors px-2 py-1 rounded-lg">
                          <GitBranch size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`${selectedAgent.color} p-3 rounded-lg`}>
                        {selectedAgent.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedAgent.name}</h3>
                        <p className="text-sm text-gray-400">{selectedAgent.type}</p>
                      </div>
                    </div>
                    
                    {isTraining && (
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Training Progress</span>
                          <span className="text-sm text-blue-400">{trainingProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden mb-4">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${trainingProgress}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-gray-800 p-2 rounded-lg">
                            <div className="text-gray-400">Epoch</div>
                            <div className="font-medium">{Math.floor(trainingProgress / 4)}/25</div>
                          </div>
                          <div className="bg-gray-800 p-2 rounded-lg">
                            <div className="text-gray-400">Loss</div>
                            <div className="font-medium text-green-400">{(1 - trainingProgress/100 * 0.7).toFixed(3)}</div>
                          </div>
                          <div className="bg-gray-800 p-2 rounded-lg">
                            <div className="text-gray-400">Accuracy</div>
                            <div className="font-medium text-blue-400">{Math.min(99.9, selectedAgent.accuracy + trainingProgress/10).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Performance Metrics</h3>
                      <div className="space-y-3">
                        {selectedAgent.metrics.map((metric, index) => (
                          <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{metric.name}</span>
                              <div className="flex items-center">
                                <span className={`text-sm ${
                                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                                </span>
                                <span className={`ml-2 text-xs flex items-center ${
                                  (metric.trend === 'up' && metric.name !== 'Latency' && metric.name !== 'Word Error Rate') || 
                                  (metric.trend === 'down' && (metric.name === 'Latency' || metric.name === 'Word Error Rate')) 
                                    ? 'text-green-400' 
                                    : 'text-red-400'
                                }`}>
                                  {(metric.trend === 'up') ? (
                                    <ArrowUpRight size={10} className="mr-1" />
                                  ) : (
                                    <ArrowDownRight size={10} className="mr-1" />
                                  )}
                                  {typeof metric.change === 'number' ? metric.change.toFixed(1) : metric.change}
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  (metric.trend === 'up' && metric.name !== 'Latency' && metric.name !== 'Word Error Rate') || 
                                  (metric.trend === 'down' && (metric.name === 'Latency' || metric.name === 'Word Error Rate'))
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                                }`}
                                style={{ 
                                  width: typeof metric.value === 'number' 
                                    ? `${Math.min(100, metric.value)}%` 
                                    : '70%' 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Agent Configuration</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Learning Rate</span>
                          <div className="flex items-center">
                            <span className="font-medium">{selectedAgent.learningRate}</span>
                          </div>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Epochs</span>
                          <div className="flex items-center">
                            <RefreshCw size={14} className="text-purple-400 mr-2" />
                            <span className="font-medium">{selectedAgent.epochs}</span>
                          </div>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Neural Layers</span>
                          <div className="flex items-center">
                            <Layers size={14} className="text-green-400 mr-2" />
                            <span className="font-medium">{selectedAgent.layers}</span>
                          </div>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Last Active</span>
                          <div className="flex items-center">
                            <Clock size={14} className="text-yellow-400 mr-2" />
                            <span className="font-medium">{selectedAgent.lastActive}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Recent Actions</h3>
                      <div className="space-y-2">
                        {selectedAgent.recentActions.map((action, index) => (
                          <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-2.5 flex items-start">
                            {action.success ? (
                              <CheckCircle size={14} className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertCircle size={14} className="text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{action.action}</p>
                              <p className="text-xs text-gray-500">{action.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => setShowAgentDetails(!showAgentDetails)}
                        className="w-full bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-2 rounded-lg text-sm flex items-center justify-center"
                      >
                        {showAgentDetails ? (
                          <>
                            <Eye size={14} className="mr-2" />
                            <span>Hide Technical Details</span>
                          </>
                        ) : (
                          <>
                            <Code size={14} className="mr-2" />
                            <span>Show Technical Details</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    {showAgentDetails && (
                      <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-3">Technical Specifications</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Architecture</span>
                            <span>Transformer with {selectedAgent.layers} layers</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Attention Heads</span>
                            <span>{selectedAgent.layers * 2}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Hidden Size</span>
                            <span>{selectedAgent.layers * 64}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Parameters</span>
                            <span>{(selectedAgent.layers * 0.8).toFixed(1)}M</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Activation</span>
                            <span>GELU</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Optimizer</span>
                            <span>AdamW (β₁=0.9, β₂=0.98)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Dropout</span>
                            <span>0.1</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Training Device</span>
                            <span className="flex items-center">
                              <Cpu size={12} className="text-purple-400 mr-1" /> 
                              GPU Cluster (8×A100)
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 font-mono text-xs bg-gray-800 p-3 rounded-lg overflow-x-auto">
                          <div className="text-blue-400">// Agent Configuration</div>
                          <div className="text-gray-300">{'{'}</div>
                          <div className="pl-4">
                            <div><span className="text-purple-400">"id"</span>: <span className="text-green-400">"{selectedAgent.id}"</span>,</div>
                            <div><span className="text-purple-400">"name"</span>: <span className="text-green-400">"{selectedAgent.name}"</span>,</div>
                            <div><span className="text-purple-400">"type"</span>: <span className="text-green-400">"{selectedAgent.type}"</span>,</div>
                            <div><span className="text-purple-400">"learning_rate"</span>: <span className="text-yellow-400">{selectedAgent.learningRate}</span>,</div>
                            <div><span className="text-purple-400">"optimizer"</span>: <span className="text-green-400">"adamw"</span>,</div>
                            <div><span className="text-purple-400">"model_architecture"</span>: <span className="text-green-400">"transformer"</span>,</div>
                            <div><span className="text-purple-400">"attention_type"</span>: <span className="text-green-400">"multi_head"</span>,</div>
                            <div><span className="text-purple-400">"layers"</span>: <span className="text-yellow-400">{selectedAgent.layers}</span>,</div>
                            <div><span className="text-purple-400">"hidden_size"</span>: <span className="text-yellow-400">{selectedAgent.layers * 64}</span>,</div>
                            <div><span className="text-purple-400">"attention_heads"</span>: <span className="text-yellow-400">{selectedAgent.layers * 2}</span>,</div>
                            <div><span className="text-purple-400">"parameters"</span>: <span className="text-yellow-400">{(selectedAgent.layers * 0.8).toFixed(1)}e6</span>,</div>
                            <div><span className="text-purple-400">"activation"</span>: <span className="text-green-400">"gelu"</span>,</div>
                            <div><span className="text-purple-400">"dropout"</span>: <span className="text-yellow-400">0.1</span>,</div>
                            <div><span className="text-purple-400">"weight_decay"</span>: <span className="text-yellow-400">0.01</span>,</div>
                            <div><span className="text-purple-400">"device"</span>: <span className="text-green-400">"gpu"</span></div>
                          </div>
                          <div className="text-gray-300">{'}'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Add a custom CSS block for animations */}
            <style jsx>{`
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsPage;
