import { Activity, Inbox, Users, FileText, BarChart2, Terminal, MessageCircle, X, Send, Menu, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function Sidebar() {
    const navigate = useNavigate();
    const [expandedSidebar, setExpandedSidebar] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, type: 'bot', text: "Hello! I'm your AI assistant. How can I help you today?" }
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Handle chatbot visibility with animation
    useEffect(() => {
        if (showChatbot) {
            setChatbotVisible(true);
        } else {
            // Delay hiding the element until after animation completes
            const timer = setTimeout(() => {
                setChatbotVisible(false);
            }, 300); // Match this with animation duration
            return () => clearTimeout(timer);
        }
    }, [showChatbot]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        
        setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', text: newMessage }]);
        setNewMessage('');
        
        // Simulate bot response
        setTimeout(() => {
            const botResponses = [
                "I'm analyzing your request and will get back to you shortly.",
                "Based on your tasks, I recommend prioritizing the quarterly report.",
                "I've scheduled a meeting with the team for tomorrow at 10AM.",
                "I can help you draft an email response. Would you like me to do that?",
                "I've analyzed the request. How would you like to proceed?"
            ];
            
            setChatMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                type: 'bot', 
                text: botResponses[Math.floor(Math.random() * botResponses.length)] 
            }]);
        }, 1000);
    };

    const toggleSidebar = () => {
        setExpandedSidebar(!expandedSidebar);
    };

    // Navigation options with labels for expanded view
    const navItems = [
        { icon: <Activity size={20} />, label: "Dashboard", path: "/dashboard" },
        { icon: <Inbox size={20} />, label: "Inbox", path: "/inbox" },
        { icon: <Users size={20} />, label: "Employees", path: "/employee" },
        { icon: <FileText size={20} />, label: "Documents", path: "/playground" },
        { icon: <BarChart2 size={20} />, label: "Analytics", path: "/agents" },
        { icon: <Terminal size={20} />, label: "Console", path: "/calendar" },
    ];

    return (
        <div className={`flex flex-col  bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out ${
            expandedSidebar ? 'w-48' : 'w-16'
        }`}>
            {/* Sidebar Header with Toggle Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                {expandedSidebar && (
                    <h2 className="text-white font-semibold">Dashboard</h2>
                )}
                <button 
                    className={`p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 ${
                        expandedSidebar ? 'ml-auto' : 'mx-auto'
                    }`}
                    onClick={toggleSidebar}
                >
                    {expandedSidebar ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-4">
                <div className="space-y-4">
                    {navItems.map((item, index) => (
                        <button 
                            key={index}
                            className={`flex items-center text-gray-300 hover:bg-gray-800 transition-colors w-full ${
                                expandedSidebar ? 'px-4 py-2' : 'justify-center p-2 mx-auto'
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className={`p-1 rounded-lg ${expandedSidebar ? 'mr-3' : ''}`}>
                                {item.icon}
                            </div>
                            {expandedSidebar && (
                                <span className="text-sm">{item.label}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chatbot Button */}
            <div className="p-4 border-t border-gray-800">
                <button 
                    className={`p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all relative ${
                        expandedSidebar ? 'flex items-center w-full' : 'w-10 h-10 mx-auto'
                    }`}
                    onClick={() => setShowChatbot(!showChatbot)}
                >
                    <MessageCircle size={20} className="text-white" />
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
                    {expandedSidebar && (
                        <span className="text-white text-sm ml-3">AI Assistant</span>
                    )}
                </button>
            </div>

            {/* Chatbot with improved animations */}
            {chatbotVisible && (
                <div 
                    className={`fixed bottom-20 right-6 w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out ${
                        showChatbot ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'
                    }`}
                >
                    <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <MessageCircle size={16} className="text-white" />
                            </div>
                            <h3 className="font-medium text-white">AI Assistant</h3>
                        </div>
                        <button 
                            onClick={() => setShowChatbot(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map(message => (
                            <div 
                                key={message.id} 
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.type === 'user' 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-gray-700 flex items-center space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-colors"
                        >
                            <Send size={18} className="text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar