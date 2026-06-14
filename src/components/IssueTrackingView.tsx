/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, Search, AlertTriangle, CheckCircle2, RotateCw, Filter, 
  ChevronDown, ArrowUpRight, ShieldAlert, Edit2, Eye, MapPin, 
  Calendar, Check, FileDown, MoreVertical, Bookmark
} from 'lucide-react';
import { User, CitizenIssue } from '../types';

interface IssueTrackingViewProps {
  currentUser: Partial<User>;
  issues: any[];
  onTriggerEditIssue: (issueId: string) => void;
  onTriggerViewIssue?: (issueId: string) => void;
  onNavigateToView: (view: string) => void;
}

export const IssueTrackingView: React.FC<IssueTrackingViewProps> = ({
  currentUser,
  issues,
  onTriggerEditIssue,
  onTriggerViewIssue,
  onNavigateToView
}) => {
  const [searchParam, setSearchParam] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const isSecretary = currentUser.role === 'Meeting Secretary';

  // Statistics
  const totalIssues = issues.length;
  const activeCount = issues.filter(i => i.status === 'Active' || i.status === 'Processing').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved' || i.status === 'Success').length;
  const landCount = issues.filter(i => i.category === 'Land').length;
  const infraCount = issues.filter(i => i.category === 'Infrastructure').length;

  // Add rich priority & other attributes if missing in mock data dynamically for display
  const getEnrichedIssue = (issue: any) => {
    return {
      priority: issue.priority || (issue.id === 'I-01' ? 'High' : issue.id === 'I-02' ? 'High' : 'Medium'),
      location: issue.location || `${currentUser.cell || 'Kacyiru'} Cell, Amahoro Village`,
      assignedOffice: issue.assignedOffice || 'Cell Executive Office',
      dateReported: issue.dateReported || issue.time || 'Oct 24, 2023',
      description: issue.description || `Community reported request for ${issue.title}. Follow physical audit rules to confirm scope.`,
      ...issue
    };
  };

  const enrichedIssues = issues.map(getEnrichedIssue);

  // Filtering
  const filteredIssues = enrichedIssues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchParam.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchParam.toLowerCase()) ||
      issue.reporter.toLowerCase().includes(searchParam.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' ? true : issue.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' ? true : issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' ? true : issue.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-[#1a4231] font-bold uppercase bg-[#1a42310d] px-2 py-0.5 rounded-sm">
            Citizen Assemblies Platform
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800">
            Citizen Issues Tracking
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Centralized register of citizen queries, appeals, and complaints logged during assembly sessions at sector, cell, and village levels.
          </p>
        </div>
        <div className="flex gap-2">
          {isSecretary && (
            <button 
              onClick={() => onNavigateToView('Meeting List')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a4231] hover:bg-[#10b981] text-white text-[11px] font-bold tracking-wider rounded-sm uppercase transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Issue via Meeting</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Total Logged Issues</span>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800">{totalIssues}</p>
            </div>
            <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Across all regional cells</span>
            <span className="font-semibold text-slate-700">100% Volume</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Processing & Active</span>
              <p className="text-2xl font-extrabold tracking-tight text-amber-700">{activeCount}</p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-sm">
              <RotateCw className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Requiring action notes</span>
            <span className="font-semibold text-amber-700">{Math.round((activeCount / (totalIssues || 1)) * 100)}% active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Resolved & Success</span>
              <p className="text-2xl font-extrabold tracking-tight text-emerald-700">{resolvedCount}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Verified assemblies resolution</span>
            <span className="font-semibold text-emerald-700">{Math.round((resolvedCount / (totalIssues || 1)) * 100)}% rate</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">Land & Resource Disputes</span>
              <p className="text-2xl font-extrabold tracking-tight text-[#1a4231]">{landCount}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-[#1a4231] rounded-sm">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>High-priority category</span>
            <span className="font-semibold text-[#1a4231]">{landCount} registered</span>
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
              placeholder="Search by Issue Title, Submitter, or Ticket Reference ID..."
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] transition-colors bg-slate-50/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded-sm p-1 bg-white focus:outline-none focus:border-[#1a4231] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Land">Land Disputes</option>
              <option value="Governance">Governance</option>
              <option value="Social">Social Welfare</option>
              <option value="Economic">Economic & Trade</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded-sm p-1 bg-white focus:outline-none focus:border-[#1a4231] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Processing">Processing</option>
              <option value="Resolved">Resolved</option>
              <option value="Success">Success</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded-sm p-1 bg-white focus:outline-none focus:border-[#1a4231] cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Table Screen */}
      <div className="bg-white rounded-sm border border-[#1a42310d] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Issue Details & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Registered By</th>
                <th className="py-3 px-4">Assigned Unit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <AlertTriangle className="w-6 h-6 text-slate-300 mx-auto mb-2 animate-pulse" />
                    <span>No citizen claim records matching active filters.</span>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1a4231]">{issue.id}</td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-bold text-slate-800 leading-snug">{issue.title}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-light truncate">
                        {issue.description}
                      </span>
                      <span className="text-[9px] text-[#1a4231] bg-[#1a423107] px-1 py-0.5 rounded-xs mt-1 inline-flex items-center gap-1 font-sans font-medium">
                        <MapPin className="w-2.5 h-2.5 text-emerald-800" /> {issue.location}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-100 text-slate-500 rounded-xs uppercase">
                        {issue.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                        issue.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-100' :
                        issue.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        {issue.priority === 'High' && <span className="w-1 h-1 rounded-full bg-red-600"></span>}
                        {issue.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-700">{issue.reporter}</p>
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> {issue.dateReported}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {issue.assignedOffice}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                        issue.status === 'Resolved' || issue.status === 'Success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                        issue.status === 'Processing' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                        'bg-amber-50 text-amber-800 border border-amber-100'
                      }`}>{issue.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {isSecretary && (
                          <button
                            onClick={() => onTriggerEditIssue(issue.id)}
                            className="p-1 text-slate-500 hover:text-[#1a4231] hover:bg-slate-100 rounded-sm cursor-pointer transition-colors"
                            title="Update Issue Administrative File"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onTriggerViewIssue && (
                          <button
                            onClick={() => onTriggerViewIssue(issue.id)}
                            className="p-1 text-slate-500 hover:text-[#1a4231] hover:bg-slate-100 rounded-sm cursor-pointer transition-colors"
                            title="Inspect Linked Information"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Custom ERP Pagination footer */}
        <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Showing <strong>{filteredIssues.length}</strong> of <strong>{totalIssues}</strong> registered citizen issues
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
