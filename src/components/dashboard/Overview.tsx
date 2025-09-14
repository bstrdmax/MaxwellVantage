
import React from 'react';
import Card from '../ui/Card';
import StatCard from './StatCard';
import RevenueChart from '../charts/RevenueChart';
import { MOCK_PROJECTS, MOCK_RECENT_ACTIVITY } from '../../constants';
import type { RecentActivity } from '../../types';
import { ProjectStatus } from '../../types';

const ProjectHealth: React.FC = () => {
    const getStatusColor = (score: number) => {
        if (score >= 85) return 'bg-[#10b981]';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card title="Project Health">
            <ul className="space-y-4">
                {MOCK_PROJECTS.slice(0, 5).map(project => (
                    <li key={project.id} className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-[#1e293b]">{project.name}</p>
                            <p className="text-sm text-slate-500">{project.client}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-slate-700 font-semibold">{project.healthScore}%</span>
                            <div className="w-20 h-2 bg-slate-200 rounded-full">
                                <div className={`h-2 rounded-full ${getStatusColor(project.healthScore)}`} style={{ width: `${project.healthScore}%` }}></div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const ActivityFeed: React.FC = () => {
    const typeClasses = {
        alert: 'border-yellow-500',
        info: 'border-blue-500',
        success: 'border-green-500',
    };

    return (
        <Card title="Recent Activity">
            <ul className="space-y-4">
                {MOCK_RECENT_ACTIVITY.map((activity: RecentActivity) => (
                    <li key={activity.id} className={`flex border-l-4 ${typeClasses[activity.type]} pl-4`}>
                        <div>
                            <p className="text-sm text-slate-700">{activity.description}</p>
                            <p className="text-xs text-slate-400">{activity.timestamp}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const Overview: React.FC = () => {
    const activeProjects = MOCK_PROJECTS.filter(p => p.status !== ProjectStatus.Completed).length;
    const atRiskProjects = MOCK_PROJECTS.filter(p => p.status === ProjectStatus.AtRisk || p.status === ProjectStatus.OffTrack).length;
    const avgHealth = Math.round(MOCK_PROJECTS.reduce((acc, p) => acc + p.healthScore, 0) / MOCK_PROJECTS.length);
    
    return (
        <div className="space-y-6">
            <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Projects" value={activeProjects.toString()} change="+2 this week" positive={true} />
                <StatCard title="Projects at Risk" value={atRiskProjects.toString()} change="+1 this week" positive={false} />
                <StatCard title="Avg. Project Health" value={`${avgHealth}%`} change="-3% this month" positive={false} />
                <StatCard title="New Prospects" value="8" change="+12% this month" positive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div>
                    <ProjectHealth />
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <ActivityFeed />
                 </div>
                 <Card title="Client Intelligence Quickview">
                    <p className="text-slate-500">Lead generation is active. 50+ qualified prospects added to Airtable this week.</p>
                    <button className="mt-4 bg-[#6366f1] text-white px-4 py-2 rounded-lg hover:bg-[#8b5cf6] transition-colors">
                        View Prospect Pipeline
                    </button>
                 </Card>
            </div>
        </div>
    );
};

export default Overview;
