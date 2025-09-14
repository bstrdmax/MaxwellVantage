
import React, { useState } from 'react';
import Card from '../ui/Card';
import { MOCK_PROJECTS, GoogleDriveIcon, MailIcon as MailIconConstant, FileTextIcon as FileTextIconConstant, ZapIcon as ZapIconConstant } from '../../constants';
import type { Project } from '../../types';
import { ProjectStatus } from '../../types';

// Local Icons to avoid conflicts if they were not exported from constants
const MailIcon = MailIconConstant;
const ZapIcon = ZapIconConstant;
const FileTextIcon = FileTextIconConstant;

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

interface OnboardingPlan {
    documents: string[];
    email: {
        subject: string;
        body: string;
    };
}

interface ProjectAssistantViewProps {
    addNotification: (message: string) => void;
}

const ProjectAssistantView: React.FC<ProjectAssistantViewProps> = ({ addNotification }) => {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [onboardingPlan, setOnboardingPlan] = useState<OnboardingPlan | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    const projectsToOnboard = projects.filter(p => p.status === ProjectStatus.Onboarding);

    const handleInitiateOnboarding = (project: Project) => {
        setSelectedProject(project);
        setIsGeneratingPlan(true);
        setOnboardingPlan(null);

        // Simulate AI generating the plan
        setTimeout(() => {
            const plan: OnboardingPlan = {
                documents: [
                    `${project.client} - Project Kick-off Agenda.gdoc`,
                    `${project.client} - Project Timeline.gsheet`,
                    `${project.client} - Shared Resources & Comms Plan.gdoc`,
                ],
                email: {
                    subject: `Welcome to the "${project.name}" Project!`,
                    body: `Hi ${project.client} team,\n\nWe are thrilled to officially kick off the "${project.name}" project with you!\n\nOur team is already setting up your dedicated project environment. Here are the immediate next steps:\n\n1.  **Project Kick-off Call:** Please expect a calendar invitation shortly for our official kick-off meeting next week.\n2.  **Shared Google Drive Folder:** You will receive a separate notification with access to a shared folder containing all project-related documents.\n3.  **Key Contact Person:** Your primary point of contact will be [Your Project Manager Name].\n\nWe are incredibly excited to partner with you and achieve great results together.\n\nBest regards,\nThe Team`,
                },
            };
            setOnboardingPlan(plan);
            setIsGeneratingPlan(false);
        }, 1500);
    };

    const handleExecuteOnboarding = async () => {
        if (!selectedProject || !onboardingPlan) return;

        setIsExecuting(true);
        
        // Simulate executing the plan (creating docs, sending email)
        await new Promise(resolve => setTimeout(resolve, 2000));

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

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Project Onboarding Assistant</h2>
            <Card title="Onboarding Queue">
                {projectsToOnboard.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase">Project Name</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase">Client</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {projectsToOnboard.map(project => (
                                    <tr key={project.id}>
                                        <td className="p-4 font-medium text-gray-200">{project.name}</td>
                                        <td className="p-4 text-gray-300">{project.client}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleInitiateOnboarding(project)}
                                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
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
                    <div className="text-center py-10 text-gray-500">
                        <p>No projects are currently awaiting onboarding.</p>
                    </div>
                )}
            </Card>

            {selectedProject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                    <Card className="w-full max-w-3xl relative border border-gray-700 shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-200">
                                Onboarding Plan: <span className="text-indigo-400">{selectedProject.name}</span>
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white" aria-label="Close">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {isGeneratingPlan && (
                            <div className="flex items-center justify-center py-20">
                                <LoadingSpinner />
                                <span className="text-gray-300">Generating AI Onboarding Plan...</span>
                            </div>
                        )}

                        {onboardingPlan && (
                           <div className="flex-1 overflow-y-auto pt-4 pr-2 -mr-2">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                                            <GoogleDriveIcon className="w-5 h-5 mr-2" />
                                            Documents to be Created
                                        </h4>
                                        <ul className="space-y-2">
                                            {onboardingPlan.documents.map((doc, index) => (
                                                <li key={index} className="flex items-center bg-gray-900/50 p-3 rounded-lg">
                                                    <FileTextIcon className="w-5 h-5 mr-3 text-gray-400" />
                                                    <span className="text-gray-300 text-sm">{doc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                                            <MailIcon className="w-5 h-5 mr-2" />
                                            Welcome Email Preview
                                        </h4>
                                        <div className="bg-gray-900/50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-400 mb-2">
                                                <strong>Subject:</strong> {onboardingPlan.email.subject}
                                            </p>
                                            <textarea
                                                value={onboardingPlan.email.body}
                                                onChange={handleEmailBodyChange}
                                                rows={10}
                                                className="w-full bg-gray-700 text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                           </div>
                        )}
                        {onboardingPlan && (
                             <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                                <button
                                    onClick={handleExecuteOnboarding}
                                    disabled={isExecuting}
                                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
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

export default ProjectAssistantView;