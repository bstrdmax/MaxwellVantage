import React from 'react';
import { DashboardIcon, ProjectsIcon, ProspectsIcon, ContentIcon, SettingsIcon, FolderIcon, MailIcon, BrainCircuitIcon } from '../constants';

type ViewType = 'Dashboard' | 'Projects Assistant' | 'Prospects Assistant' | 'Content Assistant' | 'Email VA Assistant' | 'COO Assistant' | 'Settings';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { name: 'Dashboard' as ViewType, icon: DashboardIcon },
    { name: 'Projects Assistant' as ViewType, icon: ProjectsIcon },
    { name: 'Prospects Assistant' as ViewType, icon: ProspectsIcon },
    { name: 'Content Assistant' as ViewType, icon: ContentIcon },
    { name: 'Email VA Assistant' as ViewType, icon: MailIcon },
    { name: 'COO Assistant' as ViewType, icon: BrainCircuitIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-slate-200">
        <FolderIcon className="h-8 w-8 text-[#6366f1]" />
        <h1 className="text-xl font-bold ml-3 text-[#1e293b]">Maxwell Vantage</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
              activeView === item.name
                ? 'bg-[#6366f1] text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#1e293b]'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-slate-200">
        <button
          onClick={() => setActiveView('Settings')}
          className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
            activeView === 'Settings'
              ? 'bg-[#6366f1] text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-[#1e293b]'
          }`}
        >
          <SettingsIcon className="h-5 w-5 mr-3" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
