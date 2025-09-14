import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { MOCK_CONTENT_IDEAS, MOCK_GENERATED_CONTENT, MOCK_DRIVE_IDEAS, GoogleDriveIcon, AirtableIcon, MOCK_CONTENT_CALENDAR, MOCK_CONTENT_CONTEXT, PlusCircleIcon, Trash2Icon, CheckCircleIcon, BrainCircuitIcon, PenToolIcon, BookOpenIcon, ClipboardCopyIcon } from '../../constants';
import type { GeneratedContent, ContentIdea, Content, ContentContext } from '../../types';
import { ContentType, GeneratedContentStatus } from '../../types';
import { callGemini, SchemaType } from '../../src/utils/ai';

// Icons
const SparklesIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.9 1.9-1.4-1.4-1.9 1.9-1.4-1.4L3 6l1.4 1.4L2.5 9l1.9 1.9 1.4 1.4L6 15l1.4 1.4L9 18.3l1.9 1.9 1.4-1.4 1.9 1.9 1.4-1.4L21 18l-1.4-1.4L21.5 15l-1.9-1.9-1.4-1.4L18 9l-1.4-1.4L15 5.7l-1.9-1.9Z"/></svg>;
const SendIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;
const EditIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const XIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const ChevronLeftIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;


// A simple spinner for loading state
const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 1)); // Start with Aug 2024
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = firstDayOfMonth.getDay();

  const calendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) => {
    if (i < firstDayOffset) return null;
    const day = i - firstDayOffset + 1;
    return {
      day,
      date: new Date(year, month, day),
      content: MOCK_CONTENT_CALENDAR.filter(c => {
        const publishDate = new Date(c.publishDate);
        return publishDate.getFullYear() === year &&
               publishDate.getMonth() === month &&
               publishDate.getDate() === day;
      }),
    };
  });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const contentTypeClasses: Record<ContentType, string> = {
    [ContentType.BlogPost]: 'bg-blue-500 hover:bg-blue-400',
    [ContentType.SocialMedia]: 'bg-teal-500 hover:bg-teal-400',
    [ContentType.Newsletter]: 'bg-indigo-500 hover:bg-indigo-400',
    [ContentType.Video]: 'bg-red-500 hover:bg-red-400',
  };

  const contentStatusClasses: Record<Content['status'], string> = {
    'Draft': 'bg-slate-100 text-slate-800',
    'Review': 'bg-yellow-100 text-yellow-800',
    'Scheduled': 'bg-teal-100 text-teal-800',
    'Published': 'bg-green-100 text-green-800',
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="md:text-2xl text-xl font-medium text-[#1e293b]">
            Content Calendar - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors" aria-label="Previous month">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors" aria-label="Next month">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          {weekdays.map(day => (
            <div key={day} className="bg-white text-center font-semibold text-slate-500 py-3 text-sm">{day}</div>
          ))}
          {calendarDays.map((dayInfo, index) => (
            <div key={index} className="h-40 bg-white p-2 overflow-y-auto relative border-t border-slate-200">
              {dayInfo && (
                <>
                  <span className={`font-medium ${new Date().toDateString() === dayInfo.date.toDateString() ? 'text-[#6366f1] bg-[#6366f1]/10 rounded-full px-2' : 'text-slate-700'}`}>{dayInfo.day}</span>
                  <div className="mt-2 space-y-1">
                    {dayInfo.content.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => setSelectedContent(item)}
                        className={`w-full text-left p-1.5 rounded-md text-white text-xs cursor-pointer ${contentTypeClasses[item.type]}`}>
                        {item.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {selectedContent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50" aria-modal="true" role="dialog">
          <Card className="w-full max-w-lg relative border border-slate-200 shadow-2xl">
            <button onClick={() => setSelectedContent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700" aria-label="Close">
              <XIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4 pr-8">{selectedContent.title}</h3>
            <div className="space-y-3 text-slate-700">
              <div>
                <span className="font-semibold text-slate-500">Status: </span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${contentStatusClasses[selectedContent.status]}`}>{selectedContent.status}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Type: </span>
                <span>{selectedContent.type}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Publish Date: </span>
                <span>{new Date(selectedContent.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};


interface ContentAssistantViewProps {
    addNotification: (message: string) => void;
}

const ContentAssistantView: React.FC<ContentAssistantViewProps> = ({ addNotification }) => {
    const [ideas, setIdeas] = useState<ContentIdea[]>(MOCK_CONTENT_IDEAS);
    const [selectedIdeaId, setSelectedIdeaId] = useState<string>(ideas[0]?.id || '');
    const [topic, setTopic] = useState<string>(ideas[0]?.topic || '');
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>(MOCK_GENERATED_CONTENT);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [contentContext, setContentContext] = useState<ContentContext>(() => {
        try {
            const saved = localStorage.getItem('contentAIContext');
            return saved ? JSON.parse(saved) : MOCK_CONTENT_CONTEXT;
        } catch (error) {
            return MOCK_CONTENT_CONTEXT;
        }
    });
    const [newExample, setNewExample] = useState('');

    useEffect(() => {
        try {
            localStorage.setItem('contentAIContext', JSON.stringify(contentContext));
        } catch (error) {
            console.error("Failed to save content context", error);
        }
    }, [contentContext]);

    const handleContextChange = (field: keyof Omit<ContentContext, 'examples'>, value: string) => {
        setContentContext(prev => ({ ...prev, [field]: value }));
    };

    const handleAddExample = () => {
        if (newExample.trim()) {
            setContentContext(prev => ({ ...prev, examples: [...prev.examples, newExample.trim()] }));
            setNewExample('');
        }
    };

    const handleDeleteExample = (index: number) => {
        setContentContext(prev => ({ ...prev, examples: prev.examples.filter((_, i) => i !== index) }));
    };

    const handleSelectIdea = (idea: ContentIdea) => {
        setSelectedIdeaId(idea.id);
        setTopic(idea.topic);
    };

    const handleGenerateContent = async () => {
        if (!topic.trim()) return;
        
        setIsGenerating(true);
        
        try {
            const prompt = `
                Based on the following context, generate 3 pieces of content (a blog post, a LinkedIn post, and a newsletter snippet) for the given topic.

                CONTEXT:
                - WRITING VOICE & TONE: ${contentContext.writingVoice}
                - SPECIFIC GUIDANCE: ${contentContext.guidance}
                - EXAMPLES OF OUR WORK:
                  ${contentContext.examples.map(ex => `- "${ex}"`).join('\n')}

                TOPIC TO WRITE ABOUT:
                "${topic}"
            `;

            const schema = {
                type: SchemaType.OBJECT,
                properties: {
                    blogPost: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING },
                            body: { type: SchemaType.STRING }
                        },
                        required: ["title", "body"]
                    },
                    linkedInPost: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING },
                            body: { type: SchemaType.STRING }
                        },
                        required: ["title", "body"]
                    },
                    newsletter: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING },
                            body: { type: SchemaType.STRING }
                        },
                        required: ["title", "body"]
                    }
                },
                required: ["blogPost", "linkedInPost", "newsletter"]
            };

            const result = await callGemini({ prompt, schema });

            const newIdea: ContentIdea = {
                id: `idea-${Date.now()}`,
                topic: topic,
                timestamp: new Date().toISOString(),
            };

            const newGeneratedContent: GeneratedContent[] = [
                {
                    id: `gen-blog-${newIdea.id}`,
                    ideaId: newIdea.id,
                    type: ContentType.BlogPost,
                    title: result.blogPost.title,
                    body: result.blogPost.body,
                    status: GeneratedContentStatus.Draft,
                    syncedToAirtable: false,
                },
                {
                    id: `gen-social-${newIdea.id}`,
                    ideaId: newIdea.id,
                    type: ContentType.SocialMedia,
                    title: result.linkedInPost.title,
                    body: result.linkedInPost.body,
                    status: GeneratedContentStatus.Draft,
                    syncedToAirtable: false,
                },
                {
                    id: `gen-newsletter-${newIdea.id}`,
                    ideaId: newIdea.id,
                    type: ContentType.Newsletter,
                    title: result.newsletter.title,
                    body: result.newsletter.body,
                    status: GeneratedContentStatus.Draft,
                    syncedToAirtable: false,
                },
            ];

            setIdeas(prev => [newIdea, ...prev]);
            setGeneratedContent(prev => [...newGeneratedContent, ...prev]);
            setSelectedIdeaId(newIdea.id);
            addNotification(`New content generated for "${topic.substring(0, 20)}..."`);

        } catch (error) {
            console.error("Error generating content with AI:", error);
            addNotification("Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const updateContentStatus = (id: string, status: GeneratedContentStatus, title: string) => {
        setGeneratedContent(prevContent =>
            prevContent.map(content => {
                if (content.id === id) {
                    const updatedContent = { ...content, status };
                    if (status === GeneratedContentStatus.InDrive) {
                        addNotification(`Content "${title}" successfully saved to Google Drive.`);
                    }
                    if (status === GeneratedContentStatus.Approved) {
                        updatedContent.syncedToAirtable = true;
                        addNotification(`Content "${title}" was approved and synced to Airtable.`);
                    }
                    return updatedContent;
                }
                return content;
            })
        );
    };
    
    const removeContent = (id: string) => {
        setGeneratedContent(prevContent => prevContent.filter(content => content.id !== id));
    };

    const statusClasses: Record<GeneratedContentStatus, string> = {
        [GeneratedContentStatus.Draft]: 'bg-slate-100 text-slate-800',
        [GeneratedContentStatus.InDrive]: 'bg-blue-100 text-blue-800',
        [GeneratedContentStatus.Approved]: 'bg-yellow-100 text-yellow-800',
        [GeneratedContentStatus.Scheduled]: 'bg-green-100 text-green-800',
    };
    
    return (
        <div className="space-y-6">
            <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Content Workspace</h1>

            <ContentCalendar />

            <div className="mt-8 pt-8 border-t border-slate-200">
                <h2 className="md:text-3xl text-2xl font-medium text-[#1e293b] mb-4">Content Creation Assistant</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Recent Content Ideas</h3>
                        <ul className="space-y-2 max-h-96 overflow-y-auto">
                            {ideas.map(idea => (
                            <li 
                                key={idea.id} 
                                onClick={() => handleSelectIdea(idea)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedIdeaId === idea.id ? 'bg-[#6366f1]/10' : 'hover:bg-slate-50'}`}
                            >
                                <p className="font-medium text-slate-700 text-sm">{idea.topic}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(idea.timestamp).toLocaleString()}</p>
                            </li>
                            ))}
                        </ul>
                    </Card>
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Generate from Topic or Idea</h3>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                rows={4}
                                className="w-full bg-white border border-slate-300 text-[#1e293b] placeholder-slate-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                                placeholder="e.g., 'Our Q3 report shows a 25% increase in user engagement...'"
                            />
                            <button
                                onClick={handleGenerateContent}
                                disabled={isGenerating || !topic.trim()}
                                className="mt-4 w-full md:w-auto flex items-center justify-center space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        <span>Generate Content</span>
                                    </>
                                )}
                            </button>
                        </Card>
                        <Card>
                            <div className="flex items-center mb-4">
                                <GoogleDriveIcon className="w-6 h-6 mr-3 text-[#6366f1]" />
                                <h3 className="text-xl font-semibold text-[#1e293b]">Ideas from Google Drive</h3>
                            </div>
                            <ul className="space-y-3">
                                {MOCK_DRIVE_IDEAS.map(idea => (
                                    <li key={idea.id} className="bg-slate-50 p-3 rounded-lg">
                                        <p className="font-semibold text-slate-700 text-sm">{idea.fileName}</p>
                                        <p className="text-xs text-slate-500 my-1">"{idea.snippet}"</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-slate-400">Detected: {idea.detectedAt}</span>
                                            <button onClick={() => setTopic(idea.snippet)} className="text-xs bg-[#6366f1]/20 hover:bg-[#6366f1]/30 text-[#6366f1] font-semibold px-2 py-1 rounded-md transition-colors">
                                                Import & Generate
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                         <Card>
                            <h3 className="text-xl font-semibold text-[#1e293b] mb-2 flex items-center"><BrainCircuitIcon className="w-6 h-6 mr-3 text-[#6366f1]"/>AI Content Brain</h3>
                            <p className="text-sm text-slate-500 mb-4">Guide the AI's writing style, tone, and knowledge with these core inputs.</p>
                             <div className="space-y-4">
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-1.5"><PenToolIcon className="w-4 h-4 mr-2"/>Writing Voice & Tone</label>
                                    <textarea value={contentContext.writingVoice} onChange={(e) => handleContextChange('writingVoice', e.target.value)} rows={4} className="w-full bg-slate-50 text-sm rounded-md p-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"/>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-1.5"><BookOpenIcon className="w-4 h-4 mr-2"/>Specific Guidance</label>
                                    <textarea value={contentContext.guidance} onChange={(e) => handleContextChange('guidance', e.target.value)} rows={3} className="w-full bg-slate-50 text-sm rounded-md p-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"/>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-1.5"><ClipboardCopyIcon className="w-4 h-4 mr-2"/>Recent Work Examples</label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {contentContext.examples.map((example, index) => (
                                        <div key={index} className="group flex items-center justify-between bg-slate-50 p-2.5 rounded-md">
                                            <span className="text-sm text-slate-600 italic">"{example}"</span>
                                            <button onClick={() => handleDeleteExample(index)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" aria-label="Delete example">
                                                <Trash2Icon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            type="text"
                                            value={newExample}
                                            onChange={(e) => setNewExample(e.target.value)}
                                            placeholder="Add a new example snippet..."
                                            className="flex-grow w-full bg-white border border-slate-300 text-[#1e293b] placeholder-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm"
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddExample(); }}
                                        />
                                        <button onClick={handleAddExample} className="flex-shrink-0 flex items-center justify-center bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                                            <PlusCircleIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-4">
                        Generated Content for: <span className="text-[#6366f1]">"{ideas.find(i => i.id === selectedIdeaId)?.topic || topic}"</span>
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {generatedContent.filter(c => c.ideaId === selectedIdeaId).length > 0 ? (
                            generatedContent.filter(c => c.ideaId === selectedIdeaId).map(content => (
                                <Card key={content.id} className="flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold text-lg text-[#1e293b]">{content.title}</h4>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusClasses[content.status]}`}>
                                                {content.status}
                                            </span>
                                            {content.status === GeneratedContentStatus.Approved && content.syncedToAirtable && (
                                                <div className="flex items-center text-xs text-[#6366f1] font-medium">
                                                    <AirtableIcon className="w-3 h-3 mr-1.5"/>
                                                    <span>Synced</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-slate-600 text-sm mb-4 whitespace-pre-wrap overflow-y-auto max-h-48 bg-slate-50 p-3 rounded-md">
                                        {content.body}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => updateContentStatus(content.id, GeneratedContentStatus.InDrive, content.title)} className="flex items-center space-x-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors">
                                            <SendIcon className="w-4 h-4" />
                                            <span>Send to Drive</span>
                                        </button>
                                        <button onClick={() => updateContentStatus(content.id, GeneratedContentStatus.Approved, content.title)} className="flex items-center space-x-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span>Approve</span>
                                        </button>
                                        <button className="flex items-center space-x-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors">
                                            <EditIcon className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                        <button onClick={() => removeContent(content.id)} className="flex items-center space-x-2 text-sm bg-red-100/50 hover:bg-red-100 text-red-700 font-medium px-3 py-1.5 rounded-lg transition-colors">
                                            <Trash2Icon className="w-4 h-4" />
                                            <span>Discard</span>
                                        </button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="lg:col-span-3 text-center py-10 text-slate-500">
                               <p>No content has been generated for this idea yet.</p>
                               <p>Use the generator above to create new content.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentAssistantView;