
import React, { useState, lazy, Suspense, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './src/components/Footer';
import LoginView from './src/components/auth/LoginView';
import { useAuth } from './src/contexts/AuthContext';
import { MOCK_NOTIFICATIONS, MOCK_PROJECTS, BrainCircuitIcon } from './constants';
import type { Notification, Project } from './types';
import { ProjectStatus } from './types';

// Lazily load the main view components to enable code-splitting.
// This creates separate JavaScript chunks for each view, which are loaded on demand.
const Overview = lazy(() => import('./components/dashboard/Overview'));
const ProjectsView = lazy(() => import('./components/projects/ProjectsView'));
const ProspectsView = lazy(() => import('./components/prospects/ProspectsView'));
const ContentAssistantView = lazy(() => import('./components/content/ContentAssistantView'));
const EmailVAView = lazy(() => import('./components/email/EmailVAView'));
const COOAssistantView = lazy(() => import('./components/coo/COOAssistantView'));
const SettingsView = lazy(() => import('./components/settings/SettingsView'));


type ViewType = 'Dashboard' | 'Projects Assistant' | 'Prospects Assistant' | 'Content Assistant' | 'Email VA Assistant' | 'COO Assistant' | 'Settings';

/**
 * A full-page loading indicator shown while the authentication state is being determined.
 */
const FullPageLoader: React.FC = () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
            <BrainCircuitIcon className="h-12 w-12 text-[#6366f1] animate-pulse" />
            <p className="mt-4 text-slate-500">Initializing Maxwell Vantage...</p>
        </div>
    </div>
);

/**
 * A loading indicator for the main content area, used as a fallback for React.Suspense.
 */
const ViewLoader: React.FC = () => (
    <div className="flex h-full w-full items-center justify-center py-20">
        <div className="flex flex-col items-center">
            <BrainCircuitIcon className="h-10 w-10 text-[#6366f1] animate-pulse" />
            <p className="mt-3 text-slate-500">Loading Assistant...</p>
        </div>
    </div>
);

/**
 * The root component of the application. It handles authentication state,
 * main view routing, and manages global state like notifications.
 */
const App: React.FC = () => {
    // useAuth hook provides the current user and loading status from Firebase.
    const { currentUser, loading } = useAuth();
    // Manages which main view is currently displayed (e.g., 'Dashboard', 'Projects Assistant').
    const [activeView, setActiveView] = useState<ViewType>('Dashboard');
    
    // State for notifications, initialized with mock data and dynamically generated deadline alerts.
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const initialNotifications = [...MOCK_NOTIFICATIONS];
        
        // Logic to create notifications for projects with approaching or past deadlines.
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
        
        // Prepend deadline notifications so they are most visible.
        return [...deadlineNotifications, ...initialNotifications];
    });

    /**
     * A function passed down to child components to allow them to add new notifications.
     * @param message - The content of the notification to be displayed.
     */
    // FIX: Use functional update for setNotifications to avoid stale state and remove 'notifications' from dependency array.
    const addNotification = useCallback((message: string) => {
        const newNotification: Notification = {
            id: `notif${Date.now()}`,
            message,
            timestamp: 'Just now',
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    /**
     * Renders the main content view based on the `activeView` state.
     */
    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard':
                return <Overview addNotification={addNotification} />;
            case 'Projects Assistant':
                return <ProjectsView addNotification={addNotification} />;
            case 'Prospects Assistant':
                return <ProspectsView addNotification={addNotification} />;
            case 'Content Assistant':
                return <ContentAssistantView addNotification={addNotification} />;
            case 'Email VA Assistant':
                return <EmailVAView />;
            case 'COO Assistant':
                return <COOAssistantView addNotification={addNotification} />;
            case 'Settings':
                return <SettingsView />;
            default:
                return <Overview addNotification={addNotification} />;
        }
    };

    // While Firebase is checking the auth state, show a loader.
    if (loading) {
        return <FullPageLoader />;
    }

    // If not loading and there's no user, show the login view.
    if (!currentUser) {
        return <LoginView />;
    }

    // If a user is logged in, render the main application layout.
    return (
        <div className="flex h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header notifications={notifications} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-6 flex flex-col">
                    <div className="flex-grow">
                        <Suspense fallback={<ViewLoader />}>
                            {renderContent()}
                        </Suspense>
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default App;