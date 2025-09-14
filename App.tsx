
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/dashboard/Overview';
import ProjectsView from './components/projects/ProjectsView';
import ProspectsView from './components/prospects/ProspectsView';
import ContentAssistantView from './components/content/ContentAssistantView';
import EmailVAView from './components/email/EmailVAView';
import COOAssistantView from './components/coo/COOAssistantView';
import SettingsView from './components/settings/SettingsView';
import { MOCK_NOTIFICATIONS, MOCK_PROJECTS } from './constants';
import type { Notification, Project } from './types';
import { ProjectStatus } from './types';

type ViewType = 'Dashboard' | 'Projects Assistant' | 'Prospects Assistant' | 'Content Assistant' | 'Email VA Assistant' | 'COO Assistant' | 'Settings';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewType>('Dashboard');
    
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const initialNotifications = [...MOCK_NOTIFICATIONS];
        
        const deadlineNotifications: Notification[] = MOCK_PROJECTS
            .map((project: Project) => {
                if (project.status === ProjectStatus.Completed) {
                    return null;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const deadlineDate = new Date(project.deadline);
                deadlineDate.setHours(0, 0, 0, 0);

                const diffTime = deadlineDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let message = '';
                if (diffDays < 0) {
                    message = `Project "${project.name}" is overdue by ${Math.abs(diffDays)} day(s).`;
                } else if (diffDays >= 0 && diffDays <= 3) {
                     message = `Project "${project.name}" is due in ${diffDays} day(s).`;
                }

                if (message) {
                    return {
                        id: `notif-deadline-${project.id}`,
                        message,
                        timestamp: 'Just now',
                        read: false,
                    };
                }
                return null;
            })
            .filter((n): n is Notification => n !== null);

        // Prepend deadline notifications to the existing ones so they are most visible
        return [...deadlineNotifications, ...initialNotifications];
    });


    const addNotification = (message: string) => {
        const newNotification: Notification = {
            id: `notif${Date.now()}`,
            message,
            timestamp: 'Just now',
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard':
                return <Overview />;
            case 'Projects Assistant':
                return <ProjectsView addNotification={addNotification} />;
            case 'Prospects Assistant':
                return <ProspectsView addNotification={addNotification} />;
            case 'Content Assistant':
                return <ContentAssistantView addNotification={addNotification} />;
            case 'Email VA Assistant':
                return <EmailVAView />;
            case 'COO Assistant':
                return <COOAssistantView />;
            case 'Settings':
                return <SettingsView />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header notifications={notifications} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
