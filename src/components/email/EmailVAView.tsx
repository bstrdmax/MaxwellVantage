

import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { MOCK_EMAILS, MOCK_MORNING_SUMMARY, MOCK_AFTERNOON_SUMMARY, MOCK_SUGGESTED_RESPONSES } from '../../constants';

// Icons for the view
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const ArchiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M10 12h4"/><path d="M22 3H2v5h20z"/></svg>
);

const EmailVAView: React.FC = () => {
    const [activeBatch, setActiveBatch] = useState<'morning' | 'afternoon'>('morning');
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(MOCK_EMAILS[0].id);

    const currentEmails = useMemo(() => {
        // In a real app, this would filter based on batch
        return MOCK_EMAILS;
    }, [activeBatch]);
    
    const currentSummary = activeBatch === 'morning' ? MOCK_MORNING_SUMMARY : MOCK_AFTERNOON_SUMMARY;
    
    const selectedEmail = currentEmails.find(e => e.id === selectedEmailId);
    const suggestedResponse = MOCK_SUGGESTED_RESPONSES.find(r => r.emailId === selectedEmailId);

    return (
        <div className="space-y-6">
            <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Email Virtual Assistant</h1>
            
            <div className="flex space-x-2 rounded-lg bg-slate-100 p-1">
                <button
                    onClick={() => setActiveBatch('morning')}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeBatch === 'morning' ? 'bg-[#6366f1] text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    Morning Digest (8:00 AM)
                </button>
                <button
                    onClick={() => setActiveBatch('afternoon')}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeBatch === 'afternoon' ? 'bg-[#6366f1] text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    Afternoon Digest (3:00 PM)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Review Queue" className="max-h-[70vh] overflow-y-auto">
                        <ul className="space-y-2">
                            {currentEmails.map(email => (
                                <li key={email.id}
                                    onClick={() => setSelectedEmailId(email.id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedEmailId === email.id ? 'bg-[#6366f1]/10' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-[#1e293b]">{email.from}</p>
                                        {email.priority === 'high' && <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">Quick Response</span>}
                                    </div>
                                    <p className="text-sm text-slate-600 truncate">{email.subject}</p>
                                    <p className="text-xs text-slate-400 mt-1">{email.snippet}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card title={`${activeBatch === 'morning' ? 'Morning' : 'Afternoon'} Digest Summary`}>
                         <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-4xl font-bold text-[#1e293b]">{currentSummary.totalEmails}</p>
                                <p className="text-sm text-slate-500">Total Emails</p>
                            </div>
                             <div>
                                <p className="text-4xl font-bold text-[#6366f1]">{currentSummary.needsResponse}</p>
                                <p className="text-sm text-slate-500">Need Responses</p>
                            </div>
                        </div>
                        <div className="mt-6">
                             <h4 className="font-semibold text-slate-700 mb-2">Key Insights:</h4>
                             <ul className="space-y-2 list-disc list-inside text-slate-500 text-sm">
                                 {currentSummary.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                             </ul>
                        </div>
                    </Card>

                    <Card title="Suggested Response">
                        {selectedEmail && suggestedResponse ? (
                            <div>
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500">To: {selectedEmail.from}</p>
                                    <p className="text-sm text-slate-500">Subject: Re: {selectedEmail.subject}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm h-48 overflow-y-auto whitespace-pre-wrap border border-slate-200">
                                    {suggestedResponse.response}
                                </div>
                                <div className="mt-4 flex space-x-3">
                                    <button className="flex items-center space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                                        <SendIcon />
                                        <span>Send</span>
                                    </button>
                                     <button className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg transition-colors">
                                        <EditIcon />
                                        <span>Edit</span>
                                    </button>
                                     <button className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg transition-colors">
                                        <ArchiveIcon />
                                        <span>Archive</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                {selectedEmail ? <p>No response suggestion available for this email.</p> : <p>Select an email from the queue to see a suggested response.</p>}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmailVAView;