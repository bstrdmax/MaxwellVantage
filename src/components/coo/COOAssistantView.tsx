import React, { useState } from 'react';
import Card from '../ui/Card';
import { MOCK_COO_INSIGHTS, MOCK_STRATEGIC_GOALS, MOCK_TOP_PRIORITY, MOCK_PROJECTS, MOCK_STRATEGIC_ADVICE, AirtableIcon, GlobeIcon, LayoutIcon, SearchIcon, MOCK_COO_KNOWLEDGE, FileTextIcon, MicIcon, InfoIcon, PlusCircleIcon, Trash2Icon, AlertTriangleIcon, TargetIcon } from '../../constants';
import type { COOInsight, StrategicAdvice, UXAnalysisResult, KnowledgeItem } from '../../types';
import { ProjectStatus, KnowledgeType } from '../../types';
import { callGemini, SchemaType } from '../../utils/ai';

// Icon mapping for different strategic advice sources.
const sourceIcons: Record<StrategicAdvice['source'], React.FC<{className?: string}>> = {
    Airtable: AirtableIcon,
    Website: GlobeIcon,
    'Landing Page': LayoutIcon,
};

const COOAssistantView: React.FC = () => {
    // Color mapping for insight priorities.
    const priorityColors: Record<COOInsight['priority'], string> = {
        High: 'border-red-500 bg-red-50',
        Medium: 'border-yellow-500 bg-yellow-50',
        Low: 'border-blue-500 bg-blue-50',
    };

    // Filter projects to find those at risk.
    const atRiskProjects = MOCK_PROJECTS.filter(p => p.status === ProjectStatus.AtRisk || p.status === ProjectStatus.OffTrack);

    // State for the Website Conversion Analysis feature.
    const [analysisUrl, setAnalysisUrl] = useState<string>('https://www.example.com');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisResults, setAnalysisResults] = useState<UXAnalysisResult[]>([]);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    
    // State for the AI's knowledge base.
    const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(MOCK_COO_KNOWLEDGE);
    const [newKnowledgeContent, setNewKnowledgeContent] = useState('');

    // Icon mapping for different knowledge types.
    const knowledgeIcons: Record<KnowledgeType, React.FC<{className?: string}>> = {
        [KnowledgeType.Document]: FileTextIcon,
        [KnowledgeType.Voice]: MicIcon,
        [KnowledgeType.Context]: InfoIcon,
    };

    // Handlers for managing the knowledge base.
    const handleDeleteKnowledge = (id: string) => {
        setKnowledge(prev => prev.filter(item => item.id !== id));
    };

    const handleAddKnowledge = () => {
        if (!newKnowledgeContent.trim()) return;
        const newKnowledge: KnowledgeItem = {
            id: `coo-k${Date.now()}`,
            // Simple logic to determine if the new item is a document or context.
            type: newKnowledgeContent.toLowerCase().match(/\.(pdf|docx|txt)$/) ? KnowledgeType.Document : KnowledgeType.Context,
            content: newKnowledgeContent,
        };
        setKnowledge(prev => [newKnowledge, ...prev]);
        setNewKnowledgeContent('');
    };

    /**
     * Handles the AI-powered website analysis.
     * Constructs a prompt and schema, calls the secure backend function,
     * and updates the state with the results or an error message.
     */
    const handleAnalyzeWebsite = async () => {
        if (!analysisUrl.trim()) {
            setAnalysisError("Please enter a valid URL.");
            return;
        }
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResults([]);

        try {
            const prompt = `As a world-class UX/UI and conversion rate optimization expert, analyze the website at the URL "${analysisUrl}". Identify three critical areas for improvement to enhance client appeal and streamline the user journey towards the main offer. For each area, describe the specific finding and provide a concrete, actionable recommendation.`;
            
            const schema = {
                type: SchemaType.OBJECT,
                properties: {
                    improvements: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                area: { type: SchemaType.STRING, description: "The specific area of the website being analyzed (e.g., 'Homepage Hero Section', 'Navigation Menu')." },
                                finding: { type: SchemaType.STRING, description: "A concise description of the UX issue or opportunity identified." },
                                recommendation: { type: SchemaType.STRING, description: "A concrete, actionable recommendation to address the finding." }
                            },
                            required: ["area", "finding", "recommendation"]
                        }
                    }
                },
                required: ["improvements"]
            };

            const jsonResponse = await callGemini({ prompt, schema });
            
            if (jsonResponse.improvements && Array.isArray(jsonResponse.improvements)) {
                 setAnalysisResults(jsonResponse.improvements);
            } else {
                 throw new Error("Invalid response format from AI.");
            }
        } catch (error) {
            console.error("Error analyzing website:", error);
            setAnalysisError("Failed to analyze the website. The AI may be experiencing issues. Using mock data for demonstration.");
            // Fallback to mock data on error to ensure a good demo experience.
            setAnalysisResults([
                 { area: "Homepage Call-to-Action", finding: "The primary CTA button ('Learn More') is generic and lacks a compelling value proposition, leading to low click-through rates.", recommendation: "Change the button text to be more action-oriented and benefit-driven, such as 'Get Your Free Demo' or 'Start Automating Now'."},
                 { area: "Pricing Page", finding: "The pricing tiers are confusing and it's difficult for users to quickly determine the best plan for their needs.", recommendation: "Simplify the layout by using a comparison table with clear feature checkmarks. Add a 'Most Popular' tag to guide users and include a short quiz to recommend a plan."},
                 { area: "Mobile Navigation", finding: "The navigation menu on mobile devices is cluttered and requires multiple taps to reach key pages.", recommendation: "Implement a sticky bottom navigation bar with icons for the top 4-5 most important sections (e.g., Home, Features, Pricing, Contact)."}
            ]);
        } finally {
            setIsAnalyzing(false);
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Strategic COO Assistant</h1>
            
             <Card className="bg-[#6366f1]/10 border border-[#6366f1]/20">
                <div className="flex items-start">
                    <div className="bg-[#6366f1] p-3 rounded-full mr-4 text-white">
                        <TargetIcon className="h-6 w-6"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#6366f1] mb-2">Top Priority Focus</h3>
                        <p className="text-lg font-bold text-[#1e293b] mb-2">{MOCK_TOP_PRIORITY.title}</p>
                        <p className="text-slate-600 mb-4">{MOCK_TOP_PRIORITY.description}</p>
                        <button className="bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#8b5cf6] transition-colors">
                            {MOCK_TOP_PRIORITY.action}
                        </button>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Website Conversion Analysis</h3>
                <p className="text-slate-500 mb-4 text-sm">Enter a website URL to get AI-powered recommendations for improving user experience and client conversion flow.</p>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                        type="url"
                        value={analysisUrl}
                        onChange={(e) => setAnalysisUrl(e.target.value)}
                        placeholder="https://www.yourwebsite.com"
                        className="flex-grow w-full bg-white border border-slate-300 text-[#1e293b] placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
                    />
                    <button
                        onClick={handleAnalyzeWebsite}
                        disabled={isAnalyzing}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <SearchIcon className="w-5 h-5" />
                                <span>Analyze Website</span>
                            </>
                        )}
                    </button>
                </div>

                {analysisError && <p className="mt-4 text-red-500 text-sm">{analysisError}</p>}

                <div className="mt-6">
                    {analysisResults.length > 0 && (
                            <div className="space-y-6">
                            {analysisResults.map((result, index) => (
                                <div key={index} className="flex items-start p-4 bg-slate-50 rounded-lg">
                                    <div className="bg-slate-100 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full mr-4 mt-1">
                                        <span className="font-bold text-[#6366f1] text-lg">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#6366f1]">{result.area}</h4>
                                        <p className="text-slate-600 text-sm mt-1">
                                            <span className="font-medium text-slate-500">Finding:</span> {result.finding}
                                        </p>
                                        <p className="text-green-700 text-sm mt-2 font-medium">
                                            Recommendation: <span className="text-slate-600 font-normal">{result.recommendation}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                            </div>
                    )}
                    {!isAnalyzing && analysisResults.length === 0 && !analysisError && (
                        <div className="text-center py-8 text-slate-400">
                            <SearchIcon className="w-10 h-10 mx-auto mb-2" />
                            <p>Analysis results will appear here.</p>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Key Insights & Recommendations">
                    <div className="space-y-4">
                        {MOCK_COO_INSIGHTS.map(insight => (
                            <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${priorityColors[insight.priority]}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-[#1e293b]">{insight.category}</h4>
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${priorityColors[insight.priority].replace('border-l-4', '').replace('/20', '/50')}`}>{insight.priority} Priority</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-2">{insight.insight}</p>
                                <p className="text-[#6366f1] text-sm font-medium">Next Step: <span className="text-slate-600 font-normal">{insight.action}</span></p>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                     <Card>
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">System Knowledge Base</h3>
                        <p className="text-sm text-slate-500 mb-4">Provide the AI with documents, voice notes, and context to improve its strategic analysis.</p>
                        <div className="space-y-3">
                            {knowledge.map(item => {
                                const Icon = knowledgeIcons[item.type];
                                return (
                                    <div key={item.id} className="group flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center min-w-0">
                                            <Icon className="w-5 h-5 mr-3 text-slate-400 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 truncate">{item.content}</span>
                                        </div>
                                        <button onClick={() => handleDeleteKnowledge(item.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete knowledge item">
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                             <input
                                type="text"
                                value={newKnowledgeContent}
                                onChange={(e) => setNewKnowledgeContent(e.target.value)}
                                placeholder="Add document name or context..."
                                className="flex-grow w-full bg-white border border-slate-300 text-[#1e293b] placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddKnowledge(); }}
                            />
                            <button onClick={handleAddKnowledge} className="flex-shrink-0 flex items-center justify-center space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                                <PlusCircleIcon className="w-5 h-5" />
                                <span>Add</span>
                            </button>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Strategic Growth Opportunities</h3>
                        <div className="space-y-6">
                            {MOCK_STRATEGIC_ADVICE.map(advice => {
                                const Icon = sourceIcons[advice.source];
                                return (
                                    <div key={advice.id} className="flex items-start">
                                        <div className="bg-slate-100 p-3 rounded-full mr-4 mt-1">
                                            <Icon className="w-6 h-6 text-[#6366f1]" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1e293b]">Analysis of {advice.source}</h4>
                                            <p className="text-slate-600 text-sm mt-1">
                                                <span className="font-medium text-slate-500">Finding:</span> {advice.finding}
                                            </p>
                                            <p className="text-[#6366f1] text-sm mt-2 font-medium">
                                                Recommendation: <span className="text-slate-600 font-normal">{advice.recommendation}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center mb-4">
                           <AlertTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
                           <h3 className="text-xl font-semibold text-[#1e293b]">Risk Assessment</h3>
                        </div>
                        <ul className="space-y-3">
                            {atRiskProjects.map(p => (
                                <li key={p.id} className="text-sm">
                                    <span className={`font-bold ${p.status === ProjectStatus.OffTrack ? 'text-red-500' : 'text-yellow-500'}`}>{p.status}:</span>
                                    <span className="text-slate-600"> "{p.name}" project is at {p.healthScore}% health.</span>
                                </li>
                            ))}
                            <li className="text-sm text-slate-600">Follow-up for prospect "NextGen Solutions" is overdue.</li>
                        </ul>
                    </Card>

                    <Card title="Weekly Goal Tracker">
                        <div className="space-y-4">
                            {MOCK_STRATEGIC_GOALS.map(goal => (
                                <div key={goal.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="font-medium text-slate-700">{goal.title}</p>
                                        <p className="text-sm text-[#6366f1] font-semibold">{goal.progress}%</p>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className="bg-[#6366f1] h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                                    </div>
                                     <p className="text-xs text-slate-400 mt-1 text-right">Target: {goal.target}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default COOAssistantView;
