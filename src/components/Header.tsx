import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { BellIcon, UserIcon } from '../constants';
import type { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';

interface HeaderProps {
    notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ notifications }) => {
    const { currentUser } = useAuth();
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = async () => {
        const auth = getAuth(app);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div className="flex items-center">
                {/* Search bar can remain */}
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
                <div className="flex items-center group relative">
                    <div className="flex items-center cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                           <UserIcon className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#1e293b]">{currentUser?.email}</p>
                            <p className="text-xs text-slate-500">Workspace Owner</p>
                        </div>
                    </div>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;