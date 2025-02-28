import { Activity, Mic, X, Github, MessageCircle, Bell, Send, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
// Import SweetAlert2
import Swal from 'sweetalert2';

function Header() {
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [connections, setConnections] = useState({
        whatsapp: false,
        github: false,
        notifications: false
    });
    
    // Import SweetAlert2 CSS
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.12/sweetalert2.min.css';
        document.head.appendChild(link);
        
        return () => {
            document.head.removeChild(link);
        };
    }, []);
    
    const handleSendReport = () => {
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            setIsLoading(false);
            
            // Show SweetAlert2 success message for report
            Swal.fire({
                title: 'Success!',
                text: 'Report has been sent successfully',
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                iconColor: '#22c55e',
                confirmButtonColor: '#3b82f6',
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster'
                }
            });
        }, 2000);
    };
    
    const handleConnect = (service) => {
        // Show connecting animation for the specific service
        setConnections(prev => ({
            ...prev,
            [service]: 'connecting'
        }));
        
        // Simulate connection process
        setTimeout(() => {
            setConnections(prev => ({
                ...prev,
                [service]: true
            }));
            
            // Show connection alert
            showConnectionAlert(service);
        }, 1500);
    };
    
    const showConnectionAlert = (service) => {
        const serviceNames = {
            whatsapp: 'WhatsApp',
            github: 'GitHub',
            notifications: 'Notifications'
        };
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = 'fixed flex items-center space-x-3 p-3 rounded-lg shadow-lg animate-slide-in-right z-50 transition-all';
        alert.style.top = '4rem';
        alert.style.right = '1rem';
        alert.style.background = service === 'whatsapp' ? 'linear-gradient(to right, #25D366, #128C7E)' : 
                                service === 'github' ? 'linear-gradient(to right, #6e5494, #4078c0)' : 
                                'linear-gradient(to right, #f59e0b, #d97706)';
        alert.style.color = 'white';
        
        // Create alert content
        alert.innerHTML = `
            <div class="bg-white bg-opacity-30 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <div>
                <h4 class="font-medium">${serviceNames[service]} Connected</h4>
                <p class="text-sm opacity-90">Successfully connected to ${serviceNames[service]}</p>
            </div>
            <button class="text-white opacity-70 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        // Add click handler to close button
        const closeBtn = alert.querySelector('button');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(alert);
        });
        
        // Add to DOM
        document.body.appendChild(alert);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(alert)) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    if (document.body.contains(alert)) {
                        document.body.removeChild(alert);
                    }
                }, 300);
            }
        }, 3000);
    };
    
    return(
        <>
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Activity size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold">AI Management Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                {/* Social and notification icons */}
                <div className="flex items-center space-x-3 mr-4">
                    <button 
                        onClick={() => handleConnect('whatsapp')}
                        className="relative text-gray-400 hover:text-green-500 transition-colors"
                    >
                        <MessageCircle size={20} />
                        {connections.whatsapp === 'connecting' && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center">
                                <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        )}
                        {connections.whatsapp === true && (
                            <span className="absolute -top-1 -right-1 text-green-500">
                                <CheckCircle size={10} className="fill-green-500" />
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => handleConnect('github')}
                        className="relative text-gray-400 hover:text-purple-500 transition-colors"
                    >
                        <Github size={20} />
                        {connections.github === 'connecting' && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center">
                                <span className="animate-ping absolute h-3 w-3 rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                        )}
                        {connections.github === true && (
                            <span className="absolute -top-1 -right-1 text-purple-500">
                                <CheckCircle size={10} className="fill-purple-500" />
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => handleConnect('notifications')}
                        className="relative text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                        {connections.notifications === 'connecting' && (
                            <span className="absolute -bottom-1 -right-1 h-4 w-4 flex items-center justify-center">
                                <span className="animate-ping absolute h-3 w-3 rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                        )}
                        {connections.notifications === true && (
                            <span className="absolute -bottom-1 -right-1 text-yellow-500">
                                <CheckCircle size={10} className="fill-yellow-500" />
                            </span>
                        )}
                    </button>
                </div>
                
                {/* Send Report Button */}
                <button 
                    onClick={handleSendReport}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 hover:from-indigo-700 hover:to-cyan-600 transition-all disabled:opacity-70"
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-1">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Sending...</span>
                        </div>
                    ) : (
                        <>
                            <Send size={14} />
                            <span>Send Report</span>
                        </>
                    )}
                </button>
                
                {/* Voice Clone button (existing) */}
                <button 
                    onClick={() => setShowVoiceModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 hover:from-purple-700 hover:to-blue-600 transition-all"
                >
                    <Mic size={14} />
                    <span>Voice Clone</span>
                </button>
            </div>
        </div>
        
        {/* Voice Modal (existing) */}
        {showVoiceModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 animate-scale-in">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold">Voice Clone Generator</h2>
                        <button 
                            onClick={() => setShowVoiceModal(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <p className="text-sm mb-4">Upload a 30-second audio sample to create your AI voice clone.</p>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <Mic size={32} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-400">Drop audio file or click to record</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-sm font-medium mb-3">Voice Customization</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-400">Pitch</label>
                                    <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Speed</label>
                                    <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Clarity</label>
                                    <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-3">
                            <button 
                                onClick={() => setShowVoiceModal(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 rounded-lg transition-all flex items-center justify-center space-x-2">
                                <Mic size={16} />
                                <span>Generate Voice</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default Header;