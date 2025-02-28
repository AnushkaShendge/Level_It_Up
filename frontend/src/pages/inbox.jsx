import { Maximize2, Flag, Star, X, Paperclip, ArrowUpRight, Mail } from 'lucide-react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useEffect, useState } from 'react';

function Inbox() {
    const [emails, setEmails] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Sample emails data
        const sampleEmails = [
            { id: 'e1', from: 'Sarah Johnson', subject: 'Urgent: Quarterly Report Deadline', body: 'We need to finalize the Q3 report by Friday.', time: '09:42', priority: 'high', hasAttachment: true, isRead: false },
            { id: 'e2', from: 'Michael Chen', subject: 'Product Launch Timeline', body: 'Here are the updated milestones for our next launch.', time: '08:15', priority: 'medium', hasAttachment: false, isRead: true },
            { id: 'e3', from: 'Alex Rodriguez', subject: 'Client Meeting Notes', body: 'Summary of our discussion with Enterprise client.', time: 'Yesterday', priority: 'medium', hasAttachment: true, isRead: true },
            { id: 'e4', from: 'Taylor Williams', subject: 'Budget Approval Needed', body: 'Please review and approve the marketing budget.', time: 'Yesterday', priority: 'high', hasAttachment: false, isRead: false },
            { id: 'e5', from: 'Jamie Lee', subject: 'New Team Member Introduction', body: 'Welcoming our new UX designer next Monday.', time: 'Yesterday', priority: 'low', hasAttachment: false, isRead: true },
            { id: 'e6', from: 'Robin Martinez', subject: 'Security Alert: Login Attempt', body: 'Unusual login detected from Germany.', time: '2 days ago', priority: 'critical', hasAttachment: false, isRead: true },
            { id: 'e7', from: 'Jordan Patel', subject: 'Social Media Campaign Results', body: 'February campaign metrics exceeded expectations.', time: '2 days ago', priority: 'medium', hasAttachment: true, isRead: true },
        ];

        setEmails(sampleEmails);

        // Email processing simulation
        const emailInterval = setInterval(() => {
            setEmails(prevEmails => {
                const unreadEmails = prevEmails.filter(e => !e.isRead);
                if (unreadEmails.length > 0) {
                    const randomIndex = Math.floor(Math.random() * unreadEmails.length);
                    const emailToProcess = unreadEmails[randomIndex];
                    
                    // Add notification
                    setNotifications(prev => [{
                        id: `notification-${Date.now()}`,
                        message: `Email processed: ${emailToProcess.subject}`,
                        icon: <Mail size={16} />,
                        priority: emailToProcess.priority === 'high' ? 'high' : 'medium',
                        timestamp: new Date().toLocaleTimeString()
                    }, ...prev].slice(0, 5));
                    
                    // Update email read status
                    return prevEmails.map(e => 
                        e.id === emailToProcess.id ? {...e, isRead: true} : e
                    );
                }
                return prevEmails;
            });
        }, 5000);
        
        return () => clearInterval(emailInterval);
    }, []);

    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <div className="bg-gray-800 rounded-xl p-4">
                            {/* Inbox Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Smart Inbox</h2>
                                <div className="flex items-center space-x-2">
                                    <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg">
                                        <Maximize2 size={16} />
                                    </button>
                                    <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                                        {emails.filter(e => !e.isRead).length} unread
                                    </span>
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="mb-4">
                                <div className="flex space-x-2">
                                    <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-1 rounded-md text-sm">All</button>
                                    <button className="bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded-md text-sm">Unread</button>
                                    <button className="bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded-md text-sm">Important</button>
                                    <button className="bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded-md text-sm">Flagged</button>
                                    <button className="bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded-md text-sm">With Attachments</button>
                                </div>
                            </div>

                            {/* Email List */}
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                                {emails.map(email => (
                                    <div 
                                        key={email.id} 
                                        className={`bg-gray-900 rounded-lg p-3 border ${
                                            !email.isRead ? 'border-blue-500' : 'border-gray-700'
                                        } hover:border-blue-400 transition-colors duration-200 cursor-pointer`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    email.priority === 'high' ? 'bg-red-500/20' :
                                                    email.priority === 'critical' ? 'bg-purple-500/20' :
                                                    email.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                                                } text-white font-medium`}>
                                                    {email.from.split(' ').map(name => name[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="flex items-center">
                                                        <h3 className={`text-sm font-medium ${!email.isRead ? 'text-white' : 'text-gray-300'}`}>
                                                            {email.from}
                                                        </h3>
                                                        {email.priority === 'high' && (
                                                            <span className="ml-2 bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
                                                                Urgent
                                                            </span>
                                                        )}
                                                        {email.priority === 'critical' && (
                                                            <span className="ml-2 bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                                                                Critical
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm ${!email.isRead ? 'font-medium' : 'text-gray-300'}`}>
                                                        {email.subject}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{email.body}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                                    {email.time}
                                                </div>
                                                <div className="flex mt-2 space-x-1">
                                                    {email.hasAttachment && (
                                                        <Paperclip size={14} className="text-gray-500" />
                                                    )}
                                                    {!email.isRead && (
                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 mt-2">
                                                    <button className="text-gray-500 hover:text-white">
                                                        <Flag size={14} />
                                                    </button>
                                                    <button className="text-gray-500 hover:text-white">
                                                        <Star size={14} />
                                                    </button>
                                                    <button className="text-gray-500 hover:text-white">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-2 space-x-2">
                                            <button className="bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1 rounded-md transition-colors">
                                                Archive
                                            </button>
                                            <button className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-1 rounded-md transition-colors flex items-center">
                                                <span>Smart Reply</span>
                                                <ArrowUpRight size={12} className="ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inbox;