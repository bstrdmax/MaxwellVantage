
import React from 'react';
import Card from '../ui/Card';
import { GoogleDriveIcon, AirtableIcon, BrainCircuitIcon, UserIcon, LinkIcon, HeartIcon } from '../../constants';

const SettingsView = () => {
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
                      Connected
                    </div>
                  </div>
                </div>
                <button className="w-full sm:w-auto text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors">
                  Manage
                </button>
              </div>
              {/* Airtable Integration */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <AirtableIcon className="w-8 h-8 mr-4 text-slate-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1e293b]">Airtable</p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="h-2 w-2 bg-slate-400 rounded-full mr-2"></span>
                      Not Connected
                    </div>
                  </div>
                </div>
                <button className="w-full sm:w-auto text-sm font-semibold bg-[#6366f1] hover:bg-[#8b5cf6] text-white px-4 py-2 rounded-lg transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="md:text-2xl text-xl font-medium text-[#1e293b] mb-4 flex items-center">
              <BrainCircuitIcon className="w-6 h-6 mr-3 text-[#6366f1]" />
              AI Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-1">
                  <HeartIcon className="w-4 h-4 mr-2" /> Global AI Persona
                </label>
                <textarea
                  defaultValue="You are a strategic, data-driven COO for an innovative risk management firm named Maxwell Risk Group."
                  rows={4}
                  className="w-full bg-slate-50 text-sm rounded-md p-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-1">
                  Master Knowledge Base
                </label>
                <p className="text-sm text-slate-500 mb-2">Upload key company documents that all assistants can reference for context-aware responses.</p>
                <button className="w-full text-center text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 transition-colors">
                  Upload Documents
                </button>
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

              {/* Workspace Settings */}
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Workspace Settings</h4>
                <div>
                  <label className="text-xs text-slate-500">Workspace Name</label>
                  <input type="text" defaultValue="Maxwell Vantage" className="w-full bg-white text-sm rounded-md p-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" />
                </div>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-slate-700">Team Members</h4>
                  <button className="text-sm font-semibold bg-[#6366f1] hover:bg-[#8b5cf6] text-white px-4 py-1.5 rounded-lg transition-colors">
                    Invite Member
                  </button>
                </div>
                <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                            <img src="https://picsum.photos/100/100" alt="Admin User" className="w-8 h-8 rounded-full mr-3" />
                            <div>
                                <p className="text-sm font-medium text-[#1e293b]">Admin User</p>
                                <p className="text-xs text-slate-500">admin@maxwellrisk.com</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Owner</span>
                    </li>
                     <li className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                            <img src="https://picsum.photos/101/101" alt="Jane Doe" className="w-8 h-8 rounded-full mr-3" />
                            <div>
                                <p className="text-sm font-medium text-[#1e293b]">Jane Doe</p>
                                <p className="text-xs text-slate-500">jane.doe@maxwellrisk.com</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Member</span>
                    </li>
                </ul>
              </div>
            </div>
          </Card>
          
           <Card>
                <h3 className="md:text-2xl text-xl font-medium text-[#1e293b] mb-4">
                  Billing & Subscription
                </h3>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-slate-500">Current Plan</p>
                            <p className="text-lg font-bold text-[#6366f1]">Pro Plan</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">$199 / month</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-baseline mb-1">
                            <p className="text-sm font-medium text-slate-700">AI Analyses Used</p>
                            <p className="text-sm text-[#6366f1] font-semibold">78 / 100</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-[#6366f1] h-2.5 rounded-full" style={{ width: `78%` }}></div>
                        </div>
                    </div>
                </div>
                 <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors">
                      Manage Billing
                    </button>
                    <button className="flex-1 text-sm font-semibold bg-[#10b981] hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
            </Card>

        </div>
      </div>

      <footer className="text-center text-xs text-slate-400 mt-8 pt-6 border-t border-slate-200">
        <p>
          Powered by{' '}
          <a href="https://www.maxwellriskgroup.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
            Maxwell Risk Group
          </a>{' '}
          &{' '}
          <a href="https://www.jwmautomation.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 hover:text-[#6366f1] transition-colors">
            JWM Automations
          </a>
        </p>
      </footer>
    </div>
  );
};

export default SettingsView;