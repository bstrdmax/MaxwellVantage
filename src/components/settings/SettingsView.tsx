
import React from 'react';
import Card from '../ui/Card';
import { GoogleDriveIcon, AirtableIcon, BrainCircuitIcon, UserIcon, LinkIcon, HeartIcon, InfoIcon } from '../../constants';

const SettingsView = () => {
  const isAirtableConnected = import.meta.env.VITE_AIRTABLE_API_KEY && import.meta.env.VITE_AIRTABLE_BASE_ID;

  return (
    <div className="space-y-6">
      <h1 className="md:text-4xl text-3xl font-bold text-[#6366f1]">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <Card>
            <h3 className="md:text-2xl text-xl font-medium text-[#1e293b] mb-4 flex items-center">
              <LinkIcon className="w-6 h-6 mr-3 text-[#6366f1]" />
              Integrations Hub
            </h3>
            <p className="text-sm text-slate-500 mb-6">Connect your tools to unlock Maxwell Vantage's full automation potential.</p>
            <div className="space-y-4">
              {/* Google Workspace Integration */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <GoogleDriveIcon className="w-8 h-8 mr-4 text-slate-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1e293b]">Google Workspace</p>
                    <div className="flex items-center text-sm text-green-600">
                      <span className="h-2 w-2 bg-[#10b981] rounded-full mr-2"></span>
                      Connected (Mock)
                    </div>
                  </div>
                </div>
                <button className="w-full sm:w-auto text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors">
                  Manage
                </button>
              </div>
              {/* Airtable Integration */}
              <div className="flex flex-col items-start justify-between gap-3 p-4 bg-slate-50 rounded-lg">
                 <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <AirtableIcon className="w-8 h-8 mr-4 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-[#1e293b]">Airtable</p>
                        {isAirtableConnected ? (
                            <div className="flex items-center text-sm text-green-600">
                              <span className="h-2 w-2 bg-[#10b981] rounded-full mr-2"></span>
                              Connected
                            </div>
                        ) : (
                            <div className="flex items-center text-sm text-slate-500">
                              <span className="h-2 w-2 bg-slate-400 rounded-full mr-2"></span>
                              Not Connected
                            </div>
                        )}
                      </div>
                    </div>
                 </div>
                 {!isAirtableConnected && (
                    <div className="w-full flex items-start gap-3 mt-4 pt-4 border-t border-slate-200 p-3 bg-blue-50/50 rounded-lg">
                        <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <p className="text-sm text-slate-600">
                            To connect Airtable, the administrator must set the `VITE_AIRTABLE_API_KEY`, `VITE_AIRTABLE_BASE_ID`, `VITE_PROJECTS_TABLE_NAME`, and `VITE_PROSPECTS_TABLE_NAME` environment variables in the deployment platform.
                        </p>
                    </div>
                 )}
              </div>
            </div>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <Card>
            <h3 className="md:text-2xl text-xl font-medium text-[#1e293b] mb-4 flex items-center">
              <UserIcon className="w-6 h-6 mr-3 text-[#6366f1]" />
              Account & Workspace
            </h3>
            <div className="space-y-6">
              {/* My Profile */}
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">My Profile</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-slate-500">Name</label>
                    <input type="text" value="Admin User" disabled className="w-full bg-slate-100 text-slate-500 text-sm rounded-md p-2 border border-slate-200 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Email</label>
                    <input type="email" value="admin@maxwellrisk.com" disabled className="w-full bg-slate-100 text-slate-500 text-sm rounded-md p-2 border border-slate-200 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
