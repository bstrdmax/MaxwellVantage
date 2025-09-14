import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { MOCK_PROJECTS, GoogleDriveIcon, MailIcon, FileTextIcon, ZapIcon, AirtableIcon, SparklesIcon, Trash2Icon, PlusCircleIcon, ClipboardListIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon } from '../../constants';
import type { Project } from '../../types';
import { ProjectStatus } from '../../types';

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const LoadingSpinner = ({ small }: { small?: boolean}) => (
    <svg className={`animate-spin ${small ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);
const FolderIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
    </svg>
);

interface OnboardingPlan {
    documents: string[];
    email: {
        subject: string;
        body: string;
    };
}

interface ProjectsViewProps {
    addNotification: (message: string) => void;
}

const getDeadlineStatus = (deadline: string, status: ProjectStatus) => {
    if (status === ProjectStatus.Completed) {
        return { text: deadline, color: 'text-slate-500', icon: null, diffDays: null, statusLabel: 'Completed' as const };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: deadline, color: 'text-red-500', icon: AlertTriangleIcon, diffDays, statusLabel: 'Overdue' as const };
    }
    if (diffDays <= 7) {
        return { text: deadline, color: 'text-yellow-500', icon: ClockIcon, diffDays, statusLabel: 'Due Soon' as const };
    }

    return { text: deadline, color: 'text-slate-600', icon: null, diffDays, statusLabel: 'On Track' as const };
};

const DEFAULT_DOC_TEMPLATES = [
  '{client_name} - Project Kick-off Agenda.gdoc',
  '{client_name} - Project Timeline.gsheet',
  '{client_name} - Shared Resources & Comms Plan.gdoc',
];

const DEFAULT_EMAIL_TEMPLATE = `Hi {client_name} team,\n\nWe are thrilled to officially kick off the "{project_name}" project with you!\n\nOur team is already setting up your dedicated project environment. Here are the immediate next steps:\n\n1.  **Project Kick-off Call:** Please expect a calendar invitation shortly for our official kick-off meeting next week.\n2.  **Shared Google Drive Folder:** You will receive a separate notification with access to a shared folder containing all project-related documents.\n3.  **Key Contact Person:** Your primary point of contact will be [Your Project Manager Name].\n\nWe are incredibly excited to partner with you and achieve great results together.\n\nBest regards,\nThe Team`;


const ProjectsView: React.FC<ProjectsViewProps> = ({ addNotification }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [onboardingPlan, setOnboardingPlan] = useState<OnboardingPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
    const [documentTemplates, setDocumentTemplates] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('onboardingDocumentTemplates');
            return saved ? JSON.parse(saved) : DEFAULT_DOC_TEMPLATES;
        } catch (error) {
            console.error("Failed to parse document templates from localStorage", error);
            return DEFAULT_DOC_TEMPLATES;
        }
    });
    const [emailTemplate, setEmailTemplate] = useState<string>(() => {
        return localStorage.getItem('onboardingEmailTemplate') || DEFAULT_EMAIL_TEMPLATE;
    });

  const [newDocTemplate, setNewDocTemplate] = useState('');
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isAirtableLive, setIsAirtableLive] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/.netlify/functions/airtable');

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            if (response.status >= 500 && errorData.error?.includes("Server configuration error")) {
                throw new Error('Server not configured for Airtable');
            }
            throw new Error(`Failed to fetch projects: ${errorData.error || response.statusText}`);
        }
        
        const records = await response.json();
        const fetchedProjects: Project[] = records.map((record: any) => ({
            id: record.id,
            name: record.fields.Name,
            client: record.fields.Client,
            status: record.fields.Status,
            healthScore: record.fields['Health Score'],
            deadline: record.fields.Deadline,
            driveFolderUrl: record.fields['Drive Folder URL'] || '#',
            origin: 'Airtable'
        }));
        setProjects(fetchedProjects);
        setIsAirtableLive(true);
      } catch (error) {
        console.warn("Airtable fetch error:", error);
        addNotification("Could not connect to Airtable. Using local mock data.");
        setIsAirtableLive(false);
        setProjects(MOCK_PROJECTS);
      }
    };
    fetchProjects();
  }, [addNotification]);
  
  useEffect(() => {
    try {
        localStorage.setItem('onboardingDocumentTemplates', JSON.stringify(documentTemplates));
    } catch (error) {
        console.error("Failed to save document templates to localStorage", error);
    }
  }, [documentTemplates]);

  useEffect(() => {
    try {
        localStorage.setItem('onboardingEmailTemplate', emailTemplate);
    } catch (error) {
        console.error("Failed to save email template to localStorage", error);
    }
  }, [emailTemplate]);

  const projectsToOnboard = projects.filter(p => p.status === ProjectStatus.Onboarding);
  const regularProjects = projects.filter(p => p.status !== ProjectStatus.Onboarding);

  const statusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.Onboarding]: 'bg-orange-100 text-orange-800',
    [ProjectStatus.OnTrack]: 'bg-green-100 text-green-800',
    [ProjectStatus.AtRisk]: 'bg-yellow-100 text-yellow-800',
    [ProjectStatus.OffTrack]: 'bg-red-100 text-red-800',
    [ProjectStatus.OnHold]: 'bg-slate-100 text-slate-800',
    [ProjectStatus.Completed]: 'bg-blue-100 text-blue-800',
  };

  const handleAddDocTemplate = () => {
      if (newDocTemplate.trim()) {
          setDocumentTemplates(prev => [...prev, newDocTemplate.trim()]);
          setNewDocTemplate('');
      }
  };

  const handleDeleteDocTemplate = (index: number) => {
      setDocumentTemplates(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleGenerateDocTemplatesWithAI = async () => {
    setIsGeneratingDocs(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDocumentTemplates([
        '{client_name} - Kick-off & Scope Finalization.gdoc',
        '{client_name} - Detailed Project Roadmap.gsheet',
        '{client_name} - Communication Plan & Key Contacts.gdoc',
        '{client_name} - Access & Credentials.1password',
    ]);
    addNotification("AI has suggested new document templates.");
    setIsGeneratingDocs(false);
  };

  const handleGenerateEmailTemplateWithAI = async () => {
    setIsGeneratingEmail(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEmailTemplate(
`Subject: Welcome Aboard! Kicking off the "{project_name}" Project

Hi {client_name} Team,

On behalf of our entire team, I want to extend a very warm welcome! We are absolutely thrilled to begin our partnership on the "{project_name}" project.

To ensure a smooth and successful start, we're already preparing your dedicated project workspace. Here’s what you can expect in the coming days:

1.  **Kick-Off Meeting:** We’ll be sending a calendar invitation for our official kick-off call. This will be a great opportunity to align on goals, timelines, and next steps.
2.  **Shared Resources:** You'll receive access to a shared Google Drive folder which will be our central hub for all project documentation.
3.  **Introductions:** Your dedicated Project Manager, [Your Project Manager Name], will be reaching out personally to introduce themselves.

We are confident that together, we will achieve outstanding results. Please don't hesitate to reach out if you have any immediate questions.

Looking forward to a fantastic collaboration!

Best regards,
The Team`
    );
    addNotification("AI has drafted a new welcome email template.");
    setIsGeneratingEmail(false);
  };

  const handleInitiateOnboarding = (project: Project) => {
    setSelectedProject(project);
    setIsGeneratingPlan(true);
    setOnboardingPlan(null);

    setTimeout(() => {
        const plan: OnboardingPlan = {
            documents: documentTemplates.map(template =>
                template.replace(/{client_name}/g, project.client)
                       .replace(/{project_name}/g, project.name)
            ),
            email: {
                subject: `Welcome to the "${project.name}" Project!`,
                body: emailTemplate.replace(/{client_name}/g, project.client)
                                  .replace(/{project_name}/g, project.name),
            },
        };
        setOnboardingPlan(plan);
        setIsGeneratingPlan(false);
    }, 1500);
  };

  const handleExecuteOnboarding = async () => {
    if (!selectedProject) return;
    setIsExecuting(true);

    // This is a simulation. A real implementation would make a secure call
    // to a serverless function to update Airtable.
    await new Promise(resolve => setTimeout(resolve, 1500));

    setProjects(prevProjects =>
        prevProjects.map(p =>
            p.id === selectedProject.id ? { ...p, status: ProjectStatus.OnTrack } : p
        )
    );
    addNotification(`Onboarding for "${selectedProject.name}" completed successfully.`);

    setIsExecuting(false);
    setSelectedProject(null);
    setOnboardingPlan(null);
};

  const handleCloseModal = () => {
      setSelectedProject(null);
      setOnboardingPlan(null);
  };
  
  const handleEmailBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onboardingPlan) {
          setOnboardingPlan({
              ...onboardingPlan,
              email: { ...onboardingPlan.email, body: e.target.value }
          });
      }
  }

  const projectsWithDeadlineStatus = regularProjects.map(p => ({
    ...p,
    deadlineInfo: getDeadlineStatus(p.deadline, p.status)
  }));

  const overdueProjects = projectsWithDeadlineStatus.filter(p => p.deadlineInfo.statusLabel === 'Overdue');
  const dueSoonProjects = projectsWithDeadlineStatus.filter(p => p.deadlineInfo.statusLabel === 'Due Soon');


  return (
    <div className="space-y-6">
        <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Projects Assistant</h1>
       <Card>
            <h3 className="md:text-2xl text-xl font-medium text-[#6366f1]">Onboarding Playbook</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">Define the automated steps for new projects. Use AI to generate best-practice templates.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-700 flex items-center"><ClipboardListIcon className="w-5 h-5 mr-2" />Document Templates</h4>
                        <button onClick={handleGenerateDocTemplatesWithAI} disabled={isGeneratingDocs} className="flex items-center text-xs bg-[#8b5cf6] hover:bg-[#6366f1] text-white font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                           {isGeneratingDocs ? <LoadingSpinner small /> : <SparklesIcon className="w-4 h-4 mr-1.5" />}
                           <span>{isGeneratingDocs ? 'Generating...' : 'Suggest with AI'}</span>
                        </button>
                    </div>
                    <ul className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-2">
                        {documentTemplates.map((template, index) => (
                           <li key={index} className="group flex items-center justify-between bg-slate-100 p-2.5 rounded-md">
                                <span className="text-sm text-slate-700">{template}</span>
                                <button onClick={() => handleDeleteDocTemplate(index)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete template">
                                    <Trash2Icon className="w-4 h-4" />
                                </button>
                           </li>
                        ))}
                    </ul>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDocTemplate}
                            onChange={(e) => setNewDocTemplate(e.target.value)}
                            placeholder="Add new template, e.g., {client_name} - Access.gdoc"
                            className="flex-grow w-full bg-white border border-slate-300 text-[#1e293b] placeholder-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddDocTemplate(); }}
                        />
                        <button onClick={handleAddDocTemplate} className="flex-shrink-0 flex items-center justify-center bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                            <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div>
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-700 flex items-center"><MailIcon className="w-5 h-5 mr-2" />Welcome Email Template</h4>
                        <button onClick={handleGenerateEmailTemplateWithAI} disabled={isGeneratingEmail} className="flex items-center text-xs bg-[#8b5cf6] hover:bg-[#6366f1] text-white font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                            {isGeneratingEmail ? <LoadingSpinner small /> : <SparklesIcon className="w-4 h-4 mr-1.5" />}
                            <span>{isGeneratingEmail ? 'Generating...' : 'Draft with AI'}</span>
                        </button>
                    </div>
                    <textarea
                        value={emailTemplate}
                        onChange={(e) => setEmailTemplate(e.target.value)}
                        rows={10}
                        className="w-full bg-white border border-slate-300 text-[#1e293b] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm"
                        placeholder="Enter the welcome email template. Use {client_name} and {project_name} as placeholders."
                    />
                     <p className="text-xs text-slate-500 mt-1">Placeholders available: <code className="bg-slate-100 text-slate-600 p-1 rounded-sm">{'{client_name}'}</code>, <code className="bg-slate-100 text-slate-600 p-1 rounded-sm">{'{project_name}'}</code></p>
                </div>
            </div>
       </Card>

       <Card title="Onboarding Assistant Queue">
          {projectsToOnboard.length > 0 ? (
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="border-b border-slate-200">
                          <tr>
                              <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Project Name</th>
                              <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Client</th>
                              <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                          {projectsToOnboard.map(project => (
                              <tr key={project.id}>
                                  <td className="p-4 font-medium text-[#1e293b]">{project.name}</td>
                                  <td className="p-4 text-slate-600">{project.client}</td>
                                  <td className="p-4">
                                      <button
                                          onClick={() => handleInitiateOnboarding(project)}
                                          className="flex items-center space-x-2 bg-[#6366f1] hover:bg-[#8b5cf6] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                      >
                                          <ZapIcon className="w-5 h-5" />
                                          <span>Initiate Onboarding</span>
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          ) : (
              <div className="text-center py-10 text-slate-500">
                  <p>No projects are currently awaiting onboarding.</p>
              </div>
          )}
      </Card>

      <Card>
            <div className="flex items-center mb-4">
                <ClockIcon className="w-6 h-6 mr-3 text-yellow-500" />
                <h3 className="md:text-2xl text-xl font-medium text-[#1e293b]">Deadline Alerts</h3>
            </div>
            {overdueProjects.length === 0 && dueSoonProjects.length === 0 ? (
                <div className="text-center py-4 text-slate-500">
                    <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-[#10b981]" />
                    <p>No pressing deadlines. All projects are on schedule.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {overdueProjects.map(project => (
                        <li key={project.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                                <p className="font-medium text-[#1e293b]">{project.name} <span className="text-xs text-slate-500">- {project.client}</span></p>
                                <p className="text-sm text-red-600 font-semibold">Overdue by {-project.deadlineInfo.diffDays!} day(s)</p>
                            </div>
                            <span className="text-sm text-slate-600">{project.deadlineInfo.text}</span>
                        </li>
                    ))}
                    {dueSoonProjects.map(project => (
                        <li key={project.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                                <p className="font-medium text-[#1e293b]">{project.name} <span className="text-xs text-slate-500">- {project.client}</span></p>
                                <p className="text-sm text-yellow-600 font-semibold">
                                    {project.deadlineInfo.diffDays === 0 ? 'Due today' : `Due in ${project.deadlineInfo.diffDays} day(s)`}
                                </p>
                            </div>
                            <span className="text-sm text-slate-600">{project.deadlineInfo.text}</span>
                        </li>
                    ))}
                </ul>
            )}
        </Card>

      <Card>
        <div className="flex items-center mb-4">
          <h3 className="md:text-2xl text-xl font-medium text-[#1e293b]">All Projects</h3>
          <div className={`flex items-center ml-4 px-3 py-1 text-xs rounded-full ${isAirtableLive ? 'text-green-700 bg-green-100' : 'text-slate-700 bg-slate-100'}`}>
              <AirtableIcon className="w-4 h-4 mr-2" />
              <span>{isAirtableLive ? 'Live from Airtable' : 'Using Mock Data'}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Project Name</th>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Client</th>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Health</th>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Deadline</th>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Origin</th>
                <th className="p-4 text-sm font-semibold text-slate-500 uppercase">Drive Folder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projectsWithDeadlineStatus.map((project) => {
                const { deadlineInfo } = project;
                const Icon = deadlineInfo.icon;
                return (
                    <tr key={project.id}>
                      <td className="p-4 font-medium text-[#1e293b]">{project.name}</td>
                      <td className="p-4 text-slate-600">{project.client}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[project.status]}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                          <div className="flex items-center">
                              <div className="w-20 h-2 bg-slate-200 rounded-full mr-2">
                                  <div className={`h-2 rounded-full ${project.healthScore > 80 ? 'bg-[#10b981]' : project.healthScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${project.healthScore}%` }}></div>
                              </div>
                              <span>{project.healthScore}%</span>
                          </div>
                      </td>
                      <td className={`p-4 font-medium ${deadlineInfo.color}`}>
                          <div className="flex items-center">
                              {Icon && <Icon className="w-4 h-4 mr-2" />}
                              <span>{deadlineInfo.text}</span>
                          </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {project.origin === 'Airtable' ? (
                              <div className="flex items-center text-[#6366f1]">
                                <AirtableIcon className="w-5 h-5 mr-2" />
                                <span className="text-sm font-semibold">Airtable</span>
                              </div>
                        ) : (
                              <span className="text-sm">Manual</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-600">
                        <a href={project.driveFolderUrl} target="_blank" rel="noopener noreferrer" className="text-[#6366f1] hover:text-[#8b5cf6]">
                          <FolderIcon className="w-6 h-6"/>
                        </a>
                      </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedProject && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
              <Card className="w-full max-w-3xl relative border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <h3 className="text-xl font-semibold text-[#1e293b]">
                          Onboarding Plan: <span className="text-[#6366f1]">{selectedProject.name}</span>
                      </h3>
                      <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-800" aria-label="Close">
                          <XIcon className="w-6 h-6" />
                      </button>
                  </div>
                  
                  {isGeneratingPlan && (
                      <div className="flex items-center justify-center py-20">
                          <LoadingSpinner />
                          <span className="text-slate-600">Generating AI Onboarding Plan...</span>
                      </div>
                  )}

                  {onboardingPlan && (
                      <div className="flex-1 overflow-y-auto pt-4 pr-2 -mr-2">
                          <div className="space-y-6">
                              <div>
                                  <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                                      <GoogleDriveIcon className="w-5 h-5 mr-2" />
                                      Documents to be Created
                                  </h4>
                                  <ul className="space-y-2">
                                      {onboardingPlan.documents.map((doc, index) => (
                                          <li key={index} className="flex items-center bg-slate-50 p-3 rounded-lg">
                                              <FileTextIcon className="w-5 h-5 mr-3 text-slate-400" />
                                              <span className="text-slate-700 text-sm">{doc}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                              <div>
                                  <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                                      <MailIcon className="w-5 h-5 mr-2" />
                                      Welcome Email Preview
                                  </h4>
                                  <div className="bg-slate-50 p-3 rounded-lg">
                                      <p className="text-sm text-slate-500 mb-2">
                                          <strong>Subject:</strong> {onboardingPlan.email.subject}
                                      </p>
                                      <textarea
                                          value={onboardingPlan.email.body}
                                          onChange={handleEmailBodyChange}
                                          rows={10}
                                          className="w-full bg-white border border-slate-300 text-[#1e293b] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm"
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
                  {onboardingPlan && (
                        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                          <button
                              onClick={handleExecuteOnboarding}
                              disabled={isExecuting}
                              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#10b981] hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                              {isExecuting ? <LoadingSpinner /> : <ZapIcon className="w-5 h-5" />}
                              <span>{isExecuting ? 'Executing...' : 'Confirm & Execute'}</span>
                          </button>
                      </div>
                  )}
              </Card>
          </div>
      )}
    </div>
  );
};

export default ProjectsView;