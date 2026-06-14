/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, Search, AlertTriangle, CheckCircle2, RotateCw, Filter, 
  ChevronDown, ArrowUpRight, ShieldAlert, Edit2, Eye, MapPin, 
  Calendar, Check, FileDown, MoreVertical, Bookmark, Archive, PlayCircle
} from 'lucide-react';
import { User } from '../types';

interface ResolutionTrackingViewProps {
  currentUser: Partial<User>;
  resolutions: any[];
  onTriggerViewDetails: (resolutionId: string) => void;
  onNavigateToView: (view: string) => void;
}

export const ResolutionTrackingView: React.FC<ResolutionTrackingViewProps> = ({
  currentUser,
  resolutions,
  onTriggerViewDetails,
  onNavigateToView
}) => {
  const [searchParam, setSearchParam] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [progressFilter, setProgressFilter] = useState('All');

  // Statistics
  const totalCount = resolutions.length;
  const activeCount = resolutions.filter(r => r.status === 'Active' || r.status === 'Ongoing').length;
  const concludedCount = resolutions.filter(r => r.status === 'Concluded' || r.status === 'Completed').length;
  const escalatedCount = resolutions.filter(r => r.status === 'Escalated' || r.status === 'Overdue').length;

  const filteredResolutions = resolutions.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchParam.toLowerCase()) ||
      res.id.toLowerCase().includes(searchParam.toLowerCase()) ||
      res.assignedUnit.toLowerCase().includes(searchParam.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : res.status === statusFilter;
    
    let matchesProgress = true;
    if (progressFilter === 'Low') {
      matchesProgress = res.progress < 40;
    } else if (progressFilter === 'Mid') {
      matchesProgress = res.progress >= 40 && res.progress < 80;
    } else if (progressFilter === 'High') {
      matchesProgress = res.progress >= 80;
    }

    return matchesSearch && matchesStatus && matchesProgress;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-[#1a4231] font-bold uppercase bg-[#1a42310d] px-2 py-0.5 rounded-sm">
            Government Assembly Audit
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800">
            Resolution Tracking System
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Monitor and audit all binding directives, plans, and administrative actions formally resolved during community assembly sessions.
          </p>
        </div>
      </div>

      {/* KPI Cards Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Total Resolutions Passed</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{totalCount}</p>
            </div>
            <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/70 text-[10px] text-slate-500 flex justify-between font-medium">
            <span>Overall Ledger entries</span>
            <span className="font-bold text-slate-700">100% Volume</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Active Implementations</span>
              <p className="text-2xl font-extrabold tracking-tight text-indigo-700">{activeCount}</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-sm">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/70 text-[10px] text-slate-500 flex justify-between font-medium">
            <span>In process of delivery</span>
            <span className="font-bold text-indigo-700">{Math.round((activeCount / (totalCount || 1)) * 100)}% load</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Concluded & Verified</span>
              <p className="text-2xl font-extrabold tracking-tight text-emerald-700">{concludedCount}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/70 text-[10px] text-slate-500 flex justify-between font-medium">
            <span>Formally closed in records</span>
            <span className="font-bold text-emerald-700">{Math.round((concludedCount / (totalCount || 1)) * 100)}% rate</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Escalated & Overdue</span>
              <p className="text-2xl font-extrabold tracking-tight text-red-700">{escalatedCount}</p>
            </div>
            <div className="p-2 bg-red-50 text-red-750 rounded-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/70 text-[10px] text-slate-500 flex justify-between font-medium">
            <span>Requiring priority review</span>
            <span className="font-bold text-red-700">{escalatedCount} outstanding</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#1a42310d] space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Resolution details, Assigned Unit, or System ID Code..."
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] transition-colors bg-slate-50/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded-sm p-1 bg-white focus:outline-none focus:border-[#1a4231] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Concluded">Concluded</option>
              <option value="Completed">Completed</option>
              <option value="Escalated">Escalated</option>
              <option value="Overdue">Overdue</option>
            </select>

            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded-sm p-1 bg-white focus:outline-none focus:border-[#1a4231] cursor-pointer"
            >
              <option value="All">All Progress Ranges</option>
              <option value="Low">Initiated (&lt; 40%)</option>
              <option value="Mid">Moderate (40% - 80%)</option>
              <option value="High">In Final Review (&gt; 80%)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Resolutions List Directory Board */}
      <div className="bg-white rounded-sm border border-[#1a42310d] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                <th className="py-3 px-4">Resolution ID</th>
                <th className="py-3 px-4">Resolution Summary & Objectives</th>
                <th className="py-3 px-4">Completion Status & Milestone</th>
                <th className="py-3 px-4">Assigned Department / Officer</th>
                <th className="py-3 px-4">Due Target Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredResolutions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <AlertTriangle className="w-6 h-6 text-slate-300 mx-auto mb-2 animate-pulse" />
                    <span>No administrative resolutions matching active criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredResolutions.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1a4231]">{res.id}</td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="font-bold text-slate-800 leading-snug">{res.title}</p>
                      <p className="text-[10px] text-slate-400 block mt-0.5 font-light">
                        {res.summary}
                      </p>
                      {res.linkedIssueTitle && (
                        <span className="text-[8px] tracking-wider text-slate-550 border border-slate-200 bg-slate-50/50 px-1 py-0.5 ml-2 mt-1 inline-block rounded-xs font-semibold uppercase">
                          🔗 LINKED: {res.linkedIssueTitle}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1.5 w-36">
                        <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-600">
                          <span>Progress Rate</span>
                          <span>{res.progress}%</span>
                        </div>
                        <div className="w-full bg-[#1a42310b] h-1.5 rounded-sm overflow-hidden">
                          <div 
                            className={`h-full rounded-sm ${
                              res.status === 'Concluded' || res.status === 'Completed' ? 'bg-[#1a4231]' :
                              res.status === 'Escalated' || res.status === 'Overdue' ? 'bg-red-600' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${res.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-700">{res.assignedUnit}</p>
                      <span className="text-[9px] text-slate-400 block font-light">Lead: {res.responsibleOfficer}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono font-bold">
                      {res.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onTriggerViewDetails(res.id)}
                        className="py-1 px-2.5 bg-[#1a42310e] text-[#1a4231] hover:bg-[#1a4231] hover:text-white transition-all text-[10px] font-extrabold uppercase rounded-sm cursor-pointer"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Custom footer standard */}
        <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Displaying <strong>{filteredResolutions.length}</strong> of <strong>{totalCount}</strong> active binding directives
          </span>
          <div className="flex gap-1">
            <button disabled className="px-2 py-1 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 cursor-not-allowed opacity-50">Previous</button>
            <button disabled className="px-2 py-1 bg-white border border-[#1a423150] text-[#1a4231] font-bold rounded-sm hover:bg-slate-50 cursor-pointer">1</button>
            <button disabled className="px-2 py-1 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 cursor-not-allowed opacity-50">Next</button>
          </div>
        </div>

      </div>

    </div>
  );
};
