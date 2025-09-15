import React, { useState, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { MOCK_PROSPECTS, MOCK_SYSTEM_CONTEXT, UserIcon, HeartIcon, FlagIcon, SearchIcon, SparklesIcon, BrainCircuitIcon, LightbulbIcon, TargetIcon, MessageSquareQuoteIcon, ZapIcon, AirtableIcon, CheckCircleIcon } from '../../constants';
import type { Prospect, SystemContext } from '../../types';
import { ProspectSource } from '../../types';
import { callGemini, SchemaType } from '../../utils/ai';

const LoadingSpinner = ({ small }: { small?: boolean}) => (
    <svg className={`animate-spin ${small ? 'h-4 w-4' : 'h-5 w-5'} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

interface ProspectsViewProps {
    addNotification: (message: string) => void;
}

const ProspectsView: React.FC<ProspectsViewProps> = ({ addNotification }) => {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
    
    const [systemContext, setSystemContext] = useState<SystemContext>(() => {
        try {
            const savedContext = localStorage.getItem('prospectSystemContext');
            return savedContext ? JSON.parse(savedContext) : MOCK_SYSTEM_CONTEXT;
        } catch (error) {
            return MOCK_SYSTEM_CONTEXT;
        }
    });

    const [prospectingQuery, setProspectingQuery] = useState<string>('Recently funded B2B SaaS startups on TechCrunch');
    const [isFinding, setIsFinding] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [syncingProspects, setSyncingProspects] = useState<Record<string, boolean>>({});
    const [isRecommending, setIsRecommending] = useState(false);
    
    useEffect(() => {
        const fetchProspects = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/.netlify/functions/prospects');
                if (!response.ok) throw new Error('Failed to fetch prospects');

                const records = await response.json();
                const fetchedProspects: Prospect[] = records.map((record: any) => ({
                    id: record.id, companyName: record.fields['Company Name'], contact: record.fields.Contact,
                    leadScore: record.fields['Lead Score'], source: record.fields.Source, lastActivity: record.fields['Last Activity'],
                    nextFollowUp: record.fields['Next Follow Up'], syncedToAirtable: true,
                }));
                setProspects(fetchedProspects);
                if (fetchedProspects.length > 0) {
                    setSelectedProspectId(fetchedProspects[0].id);
                }
            } catch (error) {
                console.warn("Airtable prospects fetch error:", error);
                addNotification("Could not connect to Airtable for prospects. Using local mock data.");
                setProspects(MOCK_PROSPECTS);
                if (MOCK_PROSPECTS.length > 0) {
                    setSelectedProspectId(MOCK_PROSPECTS[0].id);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProspects();
    }, [addNotification]);
    
    useEffect(() => {
        localStorage.setItem('prospectSystemContext', JSON.stringify(systemContext));
    }, [systemContext]);
    
    const selectedProspect = useMemo(() => prospects.find(p => p.id === selectedProspectId), [prospects, selectedProspectId]);

    const handleSystemContextChange = (field: keyof SystemContext, value: string) => {
        setSystemContext(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSyncToAirtable = async (prospectId: string) => {
        const prospectToSync = prospects.find(p => p.id === prospectId);
        if (!prospectToSync) return;

        setSyncingProspects(prev => ({ ...prev, [prospectId]: true }));
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, syncedToAirtable: true } : p));
        addNotification(`Prospect "${prospectToSync.companyName}" synced to Airtable.`);
        
        setSyncingProspects(prev => ({ ...prev, [prospectId]: false }));
    };

    const handleGenerateAnalysis = async (prospectId: string) => {
        const prospectToAnalyze = prospects.find(p => p.id === prospectId);
        if (!prospectToAnalyze) return;

        setIsAnalyzing(true);
        try {
            const prompt = `System Context:\n- Persona: ${systemContext.persona}\n- Strategy: ${systemContext.strategy}\nProspect: ${prospectToAnalyze.companyName}\n\nGenerate a brief analysis, a conversion strategy, 3 talking points (as an array), and a 'whyFit' summary.`;
            const schema = { type: SchemaType.OBJECT, properties: { analysis: { type: SchemaType.STRING }, strategy: { type: SchemaType.STRING }, talkingPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }, whyFit: { type: SchemaType.STRING } } };
            const analysisResult = await callGemini({ prompt, schema });
            setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, ...analysisResult } : p));
        } catch (error) {
            console.error("Error generating prospect analysis:", error);
            addNotification(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGetRecommendation = async () => {
        setIsRecommending(true);
        try {
            const prompt = `System Context:\n- Persona: ${systemContext.persona}\n- Strategy: ${systemContext.strategy}\n\nSuggest a concise, actionable query to find new clients. Format as JSON with a "recommendation" key.`;
            const schema = { type: SchemaType.OBJECT, properties: { recommendation: { type: SchemaType.STRING } }, required: ['recommendation'] };
            const result = await callGemini({ prompt, schema });
            setProspectingQuery(result.recommendation.trim());
        } catch (error) {
            setProspectingQuery("Creative agencies on LinkedIn hiring for 'Head of Operations'");
            addNotification("AI suggestion failed, showing a sample query.");
        } finally {
            setIsRecommending(false);
        }
    };

    const handleFindProspects = async () => {
        setIsFinding(true);
        try {
            const prompt = `System Context:\n- Persona: ${systemContext.persona}\nUser Query: "${prospectingQuery}"\n\nFind 3 new prospects matching the query. For each, provide companyName, contact email, leadScore (1-100), and a nextFollowUp date (YYYY-MM-DD).`;
            const schema = { type: SchemaType.OBJECT, properties: { newProspects: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { companyName: { type: SchemaType.STRING }, contact: { type: SchemaType.STRING }, leadScore: { type: SchemaType.INTEGER }, nextFollowUp: { type: SchemaType.STRING } } } } } };
            const result = await callGemini({ prompt, schema });
            const newProspects: Prospect[] = result.newProspects.map((p: any) => ({ ...p, id: `prosp-${Date.now()}-${Math.random()}`, source: ProspectSource.AI, lastActivity: new Date().toISOString().split('T')[0], syncedToAirtable: false }));
            setProspects(prev => [...newProspects, ...prev]);
        } catch (error) {
            addNotification(`Failed to find prospects: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsFinding(false);
        }
    };

    const sourceColors: Record<ProspectSource, string> = {
        [ProspectSource.LinkedIn]: 'bg-blue-100 text-blue-800', [ProspectSource.WebScraping]: 'bg-purple-100 text-purple-800',
        [ProspectSource.Referral]: 'bg-green-100 text-green-800', [ProspectSource.Manual]: 'bg-slate-100 text-slate-800',
        [ProspectSource.AI]: 'bg-indigo-100 text-indigo-800',
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center py-20">
                <div className="flex flex-col items-center">
                    <BrainCircuitIcon className="h-10 w-10 text-[#6366f1] animate-pulse" />
                    <p className="mt-3 text-slate-500">Loading Prospect Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Prospect Intelligence Hub</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="md:text-2xl text-xl font-medium text-[#1e293b] mb-4 flex items-center"><BrainCircuitIcon className="w-6 h-6 mr-3 text-[#6366f1]"/>System Context</h3>
                    <div className="space-y-4">
                        <div><label className="flex items-center text-sm font-semibold mb-1"><UserIcon className="w-4 h-4 mr-2"/>Ideal Client Persona</label><textarea value={systemContext.persona} onChange={(e) => handleSystemContextChange('persona', e.target.value)} rows={4} className="w-full bg-slate-50 text-sm rounded-md p-2 border"/></div>
                        <div><label className="flex items-center text-sm font-semibold mb-1"><HeartIcon className="w-4 h-4 mr-2"/>Mission & Values</label><textarea value={systemContext.missionValues} onChange={(e) => handleSystemContextChange('missionValues', e.target.value)} rows={3} className="w-full bg-slate-50 text-sm rounded-md p-2 border"/></div>
                        <div><label className="flex items-center text-sm font-semibold mb-1"><FlagIcon className="w-4 h-4 mr-2"/>Sales Strategy</label><textarea value={systemContext.strategy} onChange={(e) => handleSystemContextChange('strategy', e.target.value)} rows={3} className="w-full bg-slate-50 text-sm rounded-md p-2 border"/></div>
                    </div>
                </Card>
                 <Card>
                    <h3 className="md:text-2xl text-xl font-medium text-[#1e293b] mb-4 flex items-center"><SearchIcon className="w-6 h-6 mr-3 text-[#6366f1]"/>AI Prospector</h3>
                     <textarea value={prospectingQuery} onChange={(e) => setProspectingQuery(e.target.value)} rows={3} className="w-full bg-slate-50 text-sm rounded-md p-2 border" placeholder="e.g., 'Creative agencies on LinkedIn hiring for 'Head of Operations'"/>
                    <div className="mt-4 flex flex-col sm:flex-row-reverse gap-2">
                        <button onClick={handleFindProspects} disabled={isFinding || isRecommending} className="flex-1 flex items-center justify-center space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                            {isFinding ? <LoadingSpinner /> : <SparklesIcon className="w-5 h-5" />}<span>{isFinding ? 'Searching...' : 'Find New Prospects'}</span>
                        </button>
                        <button onClick={handleGetRecommendation} disabled={isRecommending || isFinding} className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                            {isRecommending ? <LoadingSpinner small /> : <LightbulbIcon className="w-5 h-5" />}<span>{isRecommending ? 'Thinking...' : 'Get Suggestion'}</span>
                        </button>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
                <Card className="md:col-span-1 flex flex-col"><h3 className="text-xl font-semibold mb-4 flex-shrink-0">Prospect List</h3>
                    <div className="flex-grow overflow-y-auto -mr-3 pr-3">
                        <ul className="space-y-2">
                            {prospects.map(prospect => (<li key={prospect.id} onClick={() => setSelectedProspectId(prospect.id)} className={`p-3 rounded-lg cursor-pointer border-l-4 ${selectedProspectId === prospect.id ? 'bg-[#6366f1]/10 border-[#6366f1]' : 'border-transparent hover:bg-slate-50'}`}><div className="flex justify-between items-start"><p className="font-semibold">{prospect.companyName}</p><span className="font-bold text-lg text-[#6366f1]">{prospect.leadScore}</span></div><p className="text-sm text-slate-500 truncate">{prospect.contact}</p><div className="flex items-center justify-between mt-2"><span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${sourceColors[prospect.source]}`}>{prospect.source}</span>{prospect.syncedToAirtable && <span className="flex items-center text-xs text-[#6366f1] font-medium"><AirtableIcon className="w-3.5 h-3.5 mr-1"/> Synced</span>}</div></li>))}
                        </ul>
                    </div>
                </Card>
                <Card className="md:col-span-2 overflow-y-auto">
                    {selectedProspect ? (<div className="space-y-6">
                        <div className="pb-4 border-b">
                            <div className="flex justify-between items-start"><div><h3 className="text-2xl font-bold">{selectedProspect.companyName}</h3><p className="text-[#6366f1]">{selectedProspect.contact}</p></div><div className="text-right"><p className="text-sm text-slate-500">Lead Score</p><p className="text-4xl font-bold text-[#6366f1]">{selectedProspect.leadScore}</p></div></div>
                            <div className="mt-4">{selectedProspect.syncedToAirtable ? (<div className="flex items-center px-4 py-2 text-sm font-semibold text-green-700 bg-[#10b981]/10 rounded-lg"><CheckCircleIcon className="w-5 h-5 mr-3 text-[#10b981]"/><span>Synced with Airtable.</span></div>) : (<button onClick={() => handleSyncToAirtable(selectedProspect.id)} disabled={syncingProspects[selectedProspect.id]} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-[#6366f1] hover:bg-[#8b5cf6] rounded-lg disabled:opacity-60">{syncingProspects[selectedProspect.id] ? <><LoadingSpinner small /> Syncing...</> : <><AirtableIcon className="w-5 h-5 mr-3"/> Sync to Airtable</>}</button>)}</div>
                        </div>
                        {selectedProspect.analysis ? (<div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-lg"><h4 className="font-semibold flex items-center mb-2"><BrainCircuitIcon className="w-5 h-5 mr-2 text-[#6366f1]"/>Company Analysis</h4><p className="text-sm text-slate-600">{selectedProspect.analysis}</p></div>
                            <div className="p-4 bg-slate-50 rounded-lg"><h4 className="font-semibold flex items-center mb-2"><TargetIcon className="w-5 h-5 mr-2 text-[#6366f1]"/>Conversion Strategy</h4><p className="text-sm text-slate-600">{selectedProspect.strategy}</p></div>
                            <div className="p-4 bg-slate-50 rounded-lg"><h4 className="font-semibold flex items-center mb-2"><MessageSquareQuoteIcon className="w-5 h-5 mr-2 text-[#6366f1]"/>Key Talking Points</h4><ul className="space-y-2 list-disc list-inside text-sm">{selectedProspect.talkingPoints?.map((point, i) => <li key={i}>{point}</li>)}</ul></div>
                            <div className="p-4 bg-[#10b981]/10 rounded-lg"><h4 className="font-semibold flex items-center mb-2"><LightbulbIcon className="w-5 h-5 mr-2 text-[#10b981]"/>Why They're a Fit</h4><p className="text-sm text-green-700">{selectedProspect.whyFit}</p></div>
                        </div>) : (<div className="text-center py-20"><p className="text-slate-500 mb-4">No strategic analysis available.</p><button onClick={() => handleGenerateAnalysis(selectedProspect.id)} disabled={isAnalyzing} className="flex items-center justify-center mx-auto space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50">{isAnalyzing ? <LoadingSpinner /> : <ZapIcon className="w-5 h-5"/>}<span>{isAnalyzing ? 'Analyzing...' : 'Generate AI Analysis'}</span></button></div>)}
                    </div>) : (<div className="flex items-center justify-center h-full"><p className="text-slate-500">Select a prospect to see their details.</p></div>)}
                </Card>
            </div>
        </div>
    );
};

export default ProspectsView;