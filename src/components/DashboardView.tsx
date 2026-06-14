/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, Calendar, AlertTriangle, CheckCircle2, ArrowUpRight, 
  Clock, ShieldAlert, Sparkles, Plus, FileSpreadsheet, LayoutList, Check, RotateCw 
} from 'lucide-react';
import { User, Meeting, CitizenIssue } from '../types';

interface DashboardViewProps {
  currentUser: Partial<User>;
  users: User[];
  meetings: Meeting[];
  issues: CitizenIssue[];
  onCreateMeetingTrigger: () => void;
  onCreateUserTrigger: () => void;
  onNavigateToView: (view: string) => void;
  onAddSimulatedIssue: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  users,
  meetings,
  issues,
  onCreateMeetingTrigger,
  onCreateUserTrigger,
  onNavigateToView,
  onAddSimulatedIssue
}) => {
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const scheduledMeetingsCount = meetings.filter(m => m.status === 'Scheduled' || m.status === 'Ongoing').length;
  
  // Custom styled SVG for the Role Distribution (Donut style)
  const adminCount = users.filter(u => u.role === 'Administrator').length;
  const officialCount = users.filter(u => u.role === 'Sector Official').length;
  const secretaryCount = users.filter(u => u.role === 'Meeting Secretary').length;

  const getRolePercentage = (count: number) => {
    return Math.round((count / (users.length || 1)) * 100);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Official Banner */}
      <div className="bg-[#1a4231] text-white p-6 rounded-sm shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center border border-[#1a42310d]">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-[#a7f3d0] font-bold uppercase bg-white/10 px-2 py-0.5 rounded-sm">
              Rwanda Dev Portal Live
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Muraho, {currentUser.name || 'Official User'}
          </h1>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Welcome back to the centralized Inteko y'Abaturage assembly dashboard. Authorized access is granted representing the <strong className="text-emerald-300 font-semibold">{currentUser.role || 'Sector Representative'}</strong> role of <strong className="text-emerald-300 font-semibold">{currentUser.cell || 'Kacyiru'}</strong> jurisdiction.
          </p>
        </div>

        <div className="relative z-10 mt-4 md:mt-0 flex gap-2 w-full md:w-auto shrink-0">
          <button 
            onClick={onAddSimulatedIssue}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold tracking-wider rounded-sm uppercase transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Issue</span>
          </button>
          <button 
            onClick={onCreateMeetingTrigger}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-[#1a4231] hover:bg-emerald-50 text-[11px] font-bold tracking-wider rounded-sm uppercase transition-colors shadow-md cursor-pointer border border-[#1a42311a]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Assembly</span>
          </button>
        </div>
      </div>

      {/* 2. Top-tier key ERP KPI grid matching spec colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Users */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Total Registered Users</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{totalUsersCount}</p>
            </div>
            <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1a423105] flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
              +12% <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
            <span className="text-slate-500 font-medium">{activeUsersCount} Active right now</span>
          </div>
        </div>

        {/* KPI 2: Assembly Target Status */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Planned Assemblies</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{meetings.length}</p>
            </div>
            <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1a423105] flex items-center justify-between text-[11px]">
            <span className="text-[#10b981] bg-emerald-50 px-1.5 py-0.5 rounded-sm font-bold">
              Next: 2:00 PM
            </span>
            <span className="text-slate-500 font-medium">{scheduledMeetingsCount} Upcoming pending</span>
          </div>
        </div>

        {/* KPI 3: Citizen Issues Filed */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Citizen Issues Logged</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{issues.length + 214}</p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1a423105] flex items-center justify-between text-[11px]">
            <span className="text-amber-800 bg-amber-50/80 px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-1 text-[10px]">
              <ShieldAlert className="w-3 h-3 text-amber-600" /> 4 Critical Escalations
            </span>
            <span className="text-slate-500 text-[10px]">Real-time queue</span>
          </div>
        </div>

        {/* KPI 4: Issue Resolution Ratio */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Issue Resolution Rate</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">
                {Math.round(((issues.filter(i => i.status === 'Resolved' || i.status === 'Success').length + 85) / (issues.length + 214)) * 100)}%
              </p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1a423105] space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>85 Resolved</span>
              <span>133 Processing</span>
            </div>
            <div className="w-full bg-[#1a42310d] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1a4231] h-full" style={{ width: '64%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Middle Section: Dynamic Charts / Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Grid Card: Categorized breakdown of issues */}
        <div className="col-span-12 lg:col-span-5 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Citizen Issues by Sector Sector</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Summary breakdown of local constituent request tickets</p>
            </div>
            <span className="text-[10px] bg-[#1a42310a] text-[#1a4231] px-2 py-0.5 rounded-sm font-semibold">Active</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Category Items */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#1a4231] rounded-xs inline-block"></span> Infrastructure
                </span>
                <span className="font-bold text-slate-800">78 Issues <span className="text-slate-400 font-normal text-[10px]">(35%)</span></span>
              </div>
              <div className="w-full bg-[#1a423108] h-2 rounded-xs overflow-hidden">
                <div className="bg-[#1a4231] h-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#10b981] rounded-xs inline-block"></span> Governance Oversight
                </span>
                <span className="font-bold text-slate-800">54 Issues <span className="text-slate-400 font-normal text-[10px]">(25%)</span></span>
              </div>
              <div className="w-full bg-[#1a423108] h-2 rounded-xs overflow-hidden">
                <div className="bg-[#10b981] h-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs inline-block"></span> Social Welfare
                </span>
                <span className="font-bold text-slate-800">42 Issues <span className="text-slate-400 font-normal text-[10px]">(19%)</span></span>
              </div>
              <div className="w-full bg-[#1a423108] h-2 rounded-xs overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '19%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs inline-block"></span> Economic & Trade
                </span>
                <span className="font-bold text-slate-800">31 Issues <span className="text-slate-400 font-normal text-[10px]">(14%)</span></span>
              </div>
              <div className="w-full bg-[#1a423108] h-2 rounded-xs overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-xs inline-block"></span> Land Disputes
                </span>
                <span className="font-bold text-slate-800">13 Issues <span className="text-slate-400 font-normal text-[10px]">(7%)</span></span>
              </div>
              <div className="w-full bg-[#1a423108] h-2 rounded-xs overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: '7%' }}></div>
              </div>
            </div>
          </div>

          {/* Quick-toggle action to explore full analytical graphs */}
          <div className="pt-2">
            <button 
              onClick={() => onNavigateToView('Reports & Analytics')}
              className="w-full py-1.5 bg-[#1a42310d] hover:bg-[#1a423114] text-[#1a4231] font-bold text-[10px] uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer block"
            >
              Analyze Complete Report & Analytics
            </button>
          </div>
        </div>

        {/* Right Grid Card: User Distribution & Overview */}
        <div className="col-span-12 lg:col-span-7 bg-white p-5 rounded-sm border border-[#1a42310d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">User Distribution by Role</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Security group memberships within active directory</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-sm">Active: {activeUsersCount}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center">
              {/* Minimal SVG Donut Chart */}
              <div className="sm:col-span-5 flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    
                    {/* Administrator segment: strokeDasharray="A B" where A is thickness, B is 100-A */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1a4231" strokeWidth="3.2" 
                      strokeDasharray={`${getRolePercentage(adminCount)} ${100 - getRolePercentage(adminCount)}`} 
                      strokeDashoffset="0" 
                    />
                    
                    {/* Sector Official segment */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" 
                      strokeDasharray={`${getRolePercentage(officialCount)} ${100 - getRolePercentage(officialCount)}`} 
                      strokeDashoffset={`-${getRolePercentage(adminCount)}`} 
                    />

                    {/* Meeting Secretary segment */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.2" 
                      strokeDasharray={`${getRolePercentage(secretaryCount)} ${100 - getRolePercentage(secretaryCount)}`} 
                      strokeDashoffset={`-${getRolePercentage(adminCount) + getRolePercentage(officialCount)}`} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-slate-800 leading-none">{users.length}</span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-tight">Accounts</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between text-xs p-1.5 hover:bg-slate-50 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1a4231]"></span>
                    <span className="text-slate-600 font-medium">Administrator</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{adminCount} accounts</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{getRolePercentage(adminCount)}% weight</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-1.5 hover:bg-slate-50 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    <span className="text-slate-600 font-medium">Sector Official</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{officialCount} accounts</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{getRolePercentage(officialCount)}% weight</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-1.5 hover:bg-slate-50 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-slate-600 font-medium">Meeting Secretary</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{secretaryCount} accounts</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{getRolePercentage(secretaryCount)}% weight</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-[#1a42310d] pt-3">
            <button 
              onClick={onCreateUserTrigger}
              className="flex-1 py-1.5 bg-[#1a4231] hover:bg-[#1a2d21] text-white font-bold text-[10px] uppercase tracking-widest rounded-sm transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Staff</span>
            </button>
            <button 
              onClick={() => onNavigateToView('User Management')}
              className="flex-1 py-1.5 bg-[#1a42310d] hover:bg-[#1a423114] text-[#1a4231] font-bold text-[10px] uppercase tracking-widest rounded-sm transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Manage Directory</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Bottom Section: Assembly Table & System Real-Time Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming assemblies */}
        <div className="col-span-12 lg:col-span-7 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Scheduled Community Assemblies</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Upcoming citizen assemblies needing active monitoring</p>
            </div>
            <button 
              onClick={() => onNavigateToView('Meeting Management')}
              className="text-[10px] text-[#1a4231] font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a42310d] bg-slate-50/50">
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Assembly Identification</th>
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Target Range</th>
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meetings.slice(0, 3).map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-2 px-3">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{meeting.title}</p>
                      <span className="text-[9px] font-mono text-slate-400 font-semibold">{meeting.id}</span>
                      <span className="text-[9px] text-[#1a4231] font-bold bg-[#1a423107] px-1 ml-2 rounded-xs">{meeting.location}</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#1a42310a] h-1.5 rounded-sm overflow-hidden shrink-0">
                          <div 
                            className="bg-[#1a4231] h-full" 
                            style={{ width: `${Math.round((meeting.participants / (meeting.targetCount || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold font-mono text-slate-600">
                          {meeting.participants}/{meeting.targetCount}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-sm tracking-wide ${
                        meeting.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-800' :
                        meeting.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-800' :
                        meeting.status === 'Completed' ? 'bg-slate-50 text-slate-600' : 'bg-red-50 text-red-800'
                      }`}>
                        {meeting.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time activity audit logs */}
        <div className="col-span-12 lg:col-span-5 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Activity Logs</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time state transitions and staff action tracking</p>
            </div>
            <span className="flex items-center gap-1 text-[9px] text-emerald-700 bg-emerald-50 font-bold px-1.5 rounded-xs animate-pulse">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Live Monitoring
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {issues.slice(0, 4).map((issue, idx) => {
              // Map dynamic activities realistically based on dataset state
              return (
                <div key={issue.id || idx} className="flex items-start gap-2.5 text-xs p-1.5 rounded-sm hover:bg-slate-50/75 border border-transparent hover:border-[#1a42310d] transition-all">
                  <div className="p-1 px-1.5 bg-[#1a423107] text-[#1a4231] rounded-sm shrink-0 font-bold font-mono text-[9px]">
                    {issue.status === 'Resolved' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <RotateCw className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">
                      <span className="text-[#1a4231]">{issue.reporter}</span> {issue.status === 'Resolved' ? 'resolved ticket' : 'reported ticket'}: "{issue.title}"
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                      <span className="font-medium bg-slate-100 px-1 rounded-sm text-slate-500 tracking-tight font-mono">{issue.category}</span>
                      <span className="flex items-center gap-1 font-mono text-[8px] font-semibold">
                        <Clock className="w-2.5 h-2.5 text-slate-400" /> {issue.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
