
import React from 'react';
import { BellIcon } from '../constants';
import type { Notification } from '../types';

interface HeaderProps {
    notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ notifications }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Search for projects, clients..."
                    className="bg-slate-100 text-[#1e293b] placeholder-slate-400 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
            </div>
            <div className="flex items-center space-x-6">
                <button className="relative text-slate-500 hover:text-[#1e293b]">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
                <div className="flex items-center">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src="https://picsum.photos/100/100"
                        alt="User Avatar"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-[#1e293b]">Admin User</p>
                        <p className="text-xs text-slate-500">Workspace Owner</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;