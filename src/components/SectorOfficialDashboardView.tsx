/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Calendar, AlertTriangle, CheckCircle2, ArrowUpRight, Clock, 
  MapPin, Archive, Activity, Plus, FileSpreadsheet, LayoutList, Check, 
  RotateCw, ShieldAlert, Sparkles, FolderOpen, Send, TrendingUp, Compass, CalendarRange
} from 'lucide-react';
import { User, Meeting, CitizenIssue } from '../types';

interface SectorOfficialDashboardViewProps {
  currentUser: Partial<User>;
  users: User[];
  meetings: Meeting[];
  issues: CitizenIssue[];
  resolutions: any[];
  onNavigateToView: (view: string) => void;
  onApproveQuickResolution: (resolutionId: string) => void;
}

export const SectorOfficialDashboardView: React.FC<SectorOfficialDashboardViewProps> = ({
  currentUser,
  users,
  meetings,
  issues,
  resolutions,
  onNavigateToView,
  onApproveQuickResolution
}) => {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('Oct 24, 2023');

  // Sector Official analytics calculations
  const totalMeetings = meetings.length;
  const upcomingMeetingsCount = meetings.filter(m => m.status === 'Scheduled' || m.status === 'Ongoing').length;
  
  // Custom styled metrics matching Rwanda Sector levels
  const openIssuesCount = issues.filter(i => i.status === 'Active' || i.status === 'Processing').length;
  const activeResolutionsCount = resolutions.filter(r => r.status === 'Active' || r.status === 'Ongoing').length;
  const completedResolutionsCount = resolutions.filter(r => r.status === 'Concluded' || r.status === 'Completed').length;

  const getAttendanceRate = () => {
    const completed = meetings.filter(m => m.status === 'Completed');
    if (completed.length === 0) return 84; // standard default
    const avg = completed.reduce((acc, current) => acc + (current.participants / (current.targetCount || 1)), 0) / completed.length;
    return Math.round(avg * 100);
  };

  const attendanceAvg = getAttendanceRate();

  return (
    <div className="space-y-6">
      
      {/* 1. Official Executive Banner */}
      <div className="bg-[#1a4231] text-white p-6 rounded-sm shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center border border-[#1a42310d]">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-[#a7f3d0] font-bold uppercase bg-white/10 px-2 py-0.5 rounded-sm">
              Executive Cabinet Monitor
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Muraho, Official {currentUser.name || 'Representative'}
          </h1>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Centralized Executive Dashboard. You have full clearance to approve assembly resolutions, oversee cell progress, and track citizen issues for <strong className="text-emerald-300 font-semibold">{currentUser.sector || 'Gasabo'} Sector</strong>.
          </p>
        </div>

        <div className="relative z-10 mt-4 md:mt-0 flex gap-2 w-full md:w-auto shrink-0">
          <button 
            onClick={() => onNavigateToView('Resolutions')}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold tracking-wider rounded-sm uppercase transition-colors shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Resolutions</span>
          </button>
          <button 
            onClick={() => onNavigateToView('Meeting List')}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-[#1a4231] hover:bg-emerald-50 text-[11px] font-bold tracking-wider rounded-sm uppercase transition-colors shadow-md cursor-pointer border border-[#1a42311a]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Review Assemblies</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Grid for Sector Officials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Meetings */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Planned Assemblies</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{totalMeetings}</p>
            </div>
            <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
              +1 Upcoming
            </span>
            <span className="text-slate-500 font-medium">{upcomingMeetingsCount} Pending active</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Citizen Attendance Rate</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{attendanceAvg}%</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="w-full bg-[#1a42310a] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1a4231] h-full" style={{ width: `${attendanceAvg}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 block font-light">Target rate check: 80% Min</span>
          </div>
        </div>

        {/* Open Citizen Issues */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Open Citizen Issues</span>
              <p className="text-2xl font-extrabold tracking-tight text-amber-700">{openIssuesCount}</p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm font-bold">Priority Status</span>
            <span className="text-slate-500 font-medium">Under active review</span>
          </div>
        </div>

        {/* Resolutions Passed ratio */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Cabinet Resolutions Status</span>
              <p className="text-2xl font-extrabold tracking-tight text-[#1a4231]">{completedResolutionsCount}/{resolutions.length}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-[#1a4231] rounded-sm">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[#10b981] bg-emerald-50 font-bold px-1.5 rounded-xs">
              Concluded {completedResolutionsCount}
            </span>
            <span className="text-slate-500 font-medium">{activeResolutionsCount} Active Ongoing</span>
          </div>
        </div>

      </div>

      {/* 3. Graphical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Issue Status Chart (SVG) */}
        <div className="col-span-12 lg:col-span-6 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Citizen Issues Status Distribution</h3>
              <p className="text-[10px] text-slate-400">Escalation volume tracking across subject divisions</p>
            </div>
            <span className="text-[9px] font-bold text-[#1a4231] font-mono bg-[#1a42310d] px-2 rounded-xs">Live Database</span>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-650">Active / Newly Logged</span>
                <span>{issues.filter(i => i.status === 'Active').length} Issues</span>
              </div>
              <div className="w-full bg-[#1a42310a] h-2.5 rounded-xs overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-650">Processing / Investigative Audit</span>
                <span>{issues.filter(i => i.status === 'Processing').length} Issues</span>
              </div>
              <div className="w-full bg-[#1a42310a] h-2.5 rounded-xs overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-650">Concluded / Resolved</span>
                <span>{issues.filter(i => i.status === 'Resolved' || i.status === 'Success').length} Issues</span>
              </div>
              <div className="w-full bg-[#1a42310a] h-2.5 rounded-xs overflow-hidden">
                <div className="bg-[#1a4231] h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button 
              onClick={() => onNavigateToView('Citizen Issues')}
              className="text-[10px] text-[#1a4231] font-extrabold hover:underline select-none uppercase"
            >
              Analyze Complete claims queue
            </button>
          </div>
        </div>

        {/* Resolution Progress Chart (SVG Circle) */}
        <div className="col-span-12 lg:col-span-6 bg-white p-5 rounded-sm border border-[#1a42310d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cabinet Resolution Implementation Rate</h3>
                <p className="text-[10px] text-slate-400">Completion audit of passed binding directives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center">
              <div className="sm:col-span-5 flex justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" 
                      strokeDasharray={`${Math.round((completedResolutionsCount / (resolutions.length || 1)) * 100)} ${100 - Math.round((completedResolutionsCount / (resolutions.length || 1)) * 100)}`} 
                      strokeDashoffset="0" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-slate-800 leading-none">
                      {Math.round((completedResolutionsCount / (resolutions.length || 1)) * 100)}%
                    </span>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-tight">Completed</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold p-1 bg-slate-50 border border-slate-100/50 rounded-xs">
                  <span className="text-[#1a4231]">Concluded (Completed)</span>
                  <span>{completedResolutionsCount} resolutions</span>
                </div>
                <div className="flex items-center justify-between font-semibold p-1 bg-indigo-50/50 border border-indigo-100 rounded-xs">
                  <span className="text-indigo-800">Active (Ongoing)</span>
                  <span>{activeResolutionsCount} resolutions</span>
                </div>
                <div className="flex items-center justify-between font-semibold p-1 bg-red-50/50 border border-red-100 rounded-xs">
                  <span className="text-red-850">Overdue / Escalated</span>
                  <span>{resolutions.filter(r => r.status === 'Escalated' || r.status === 'Overdue').length} resolutions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <button 
              onClick={() => onNavigateToView('Resolutions')}
              className="w-full py-1.5 bg-[#1a42310d] hover:bg-[#1a423115] text-[#1a4231] font-bold text-[10px] uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer block"
            >
              Configure Cabinet Solutions Registry
            </button>
          </div>
        </div>

      </div>

      {/* 4. Bottom Section: Quick-Actions & Calendar Widget Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Widget Card */}
        <div className="col-span-12 lg:col-span-6 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarRange className="w-4 h-4 text-emerald-800" /> Sector Assembly Agenda Calendar
              </h3>
              <p className="text-[10px] text-slate-400">Active community schedule agenda logs</p>
            </div>
            <span className="text-[9px] bg-indigo-50 text-indigo-800 font-bold px-1.5 rounded-sm">Monthly overview</span>
          </div>

          {/* Simple Clean Grid Representation of a Calendar */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-slate-700 select-none">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dw, idx) => (
              <span key={idx} className="font-extrabold text-[#1a4231] text-[9px] uppercase">{dw}</span>
            ))}
            {Array.from({ length: 28 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `Oct ${dayNum}, 2023`;
              const isToday = dayNum === 24;
              const hasMeeting = dayNum === 23 || dayNum === 24 || dayNum === 20;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCalendarDate(dateStr)}
                  className={`py-1.5 font-bold rounded-xs transition-all relative ${
                    isToday ? 'bg-[#1a4231] text-white shadow-xs' :
                    selectedCalendarDate === dateStr ? 'bg-indigo-50 border border-[#1a423150] text-[#1a4231]' :
                    'hover:bg-slate-50'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasMeeting && (
                    <span className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isToday ? 'bg-white' : 'bg-[#10b981]'
                    }`}></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Selected Date Agenda Detail panel */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm text-xs space-y-1.5 text-slate-700">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Agenda details for {selectedCalendarDate}</span>
            {selectedCalendarDate === 'Oct 24, 2023' ? (
              <div className="space-y-0.5">
                <p className="font-bold text-[#1a4231] truncate">UMUGANDA PLANNING WORKSHOP (Planned: 1,500 Citizens)</p>
                <div className="flex gap-2 text-[10px] text-slate-400 items-center font-mono">
                  <span>09:00 AM CAT</span>
                  <span>• Sector Hall A</span>
                </div>
              </div>
            ) : selectedCalendarDate === 'Oct 23, 2023' ? (
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800 truncate">LOCAL INFRASTRUCTURE REVIEW (Ongoing)</p>
                <div className="flex gap-2 text-[10px] text-slate-400 items-center font-mono">
                  <span>Now Active</span>
                  <span>• Gasabo District Hall</span>
                </div>
              </div>
            ) : selectedCalendarDate === 'Oct 20, 2023' ? (
              <div className="space-y-0.5">
                <p className="font-bold text-slate-500 line-through truncate">EDUCATION REFORM CONSULTATION (Completed)</p>
                <div className="text-[10px] text-[#1a4231] font-bold">420 Citizens attended registry.</div>
              </div>
            ) : (
              <p className="text-slate-400 font-light italic">No public civil assembly sessions registered on this date.</p>
            )}
          </div>

        </div>

        {/* Quick Actions Panel */}
        <div className="col-span-12 lg:col-span-6 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="pb-2 border-b border-light">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Executive Cabinet Quick Actions</h3>
            <p className="text-[10px] text-slate-400">Direct shortcuts to perform essential director-level administrative workflows</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <button 
              onClick={() => onNavigateToView('Resolutions')}
              className="p-3 border border-slate-100 hover:border-[#1a423133] hover:bg-[#1a423105] text-left rounded-sm font-semibold text-slate-705 group cursor-pointer transition-all"
            >
              <h5 className="font-bold text-slate-800 group-hover:text-[#1a4231] flex items-center justify-between">
                Approve Active Resolutions <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1a4231]" />
              </h5>
              <p className="text-[10px] text-slate-450 mt-1 font-light leading-snug">Formally conclude and archive passed assembly mandates.</p>
            </button>

            <button 
              onClick={() => onNavigateToView('Citizen Issues')}
              className="p-3 border border-slate-100 hover:border-[#1a423133] hover:bg-[#1a423105] text-left rounded-sm font-semibold text-slate-705 group cursor-pointer transition-all"
            >
              <h5 className="font-bold text-slate-800 group-hover:text-[#1a4231] flex items-center justify-between">
                Review Citizen Issues <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1a4231]" />
              </h5>
              <p className="text-[10px] text-slate-450 mt-1 font-light leading-snug">Track local cell complaints regarding land disputes and pipes.</p>
            </button>

            <button 
              onClick={() => onNavigateToView('Attendance Summary')}
              className="p-3 border border-slate-100 hover:border-[#1a423133] hover:bg-[#1a423105] text-left rounded-sm font-semibold text-slate-705 group cursor-pointer transition-all"
            >
              <h5 className="font-bold text-slate-800 group-hover:text-[#1a4231] flex items-center justify-between">
                Verify Attendance Rates <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1a4231]" />
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 font-light leading-snug">Audit meeting attendance ratios against planned targets.</p>
            </button>

            <button 
              onClick={() => onNavigateToView('Documents')}
              className="p-3 border border-slate-100 hover:border-[#1a423133] hover:bg-[#1a423105] text-left rounded-sm font-semibold text-slate-705 group cursor-pointer transition-all"
            >
              <h5 className="font-bold text-slate-800 group-hover:text-[#1a4231] flex items-center justify-between">
                Policy Document Library <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1a4231]" />
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 font-light leading-snug">Access and download standard templates and regional directives.</p>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
