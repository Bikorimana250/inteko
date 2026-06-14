/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, CheckCircle, TrendingUp, Download, Search, 
  HelpCircle, ChevronRight, SlidersHorizontal, ArrowUpRight 
} from 'lucide-react';
import { Meeting } from '../types';

interface AttendanceSummaryViewProps {
  meetings: Meeting[];
}

export const AttendanceSummaryView: React.FC<AttendanceSummaryViewProps> = ({ meetings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cellFilter, setCellFilter] = useState('All');

  // Filter assemblies realistically for tabular listings
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meeting.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Statistics grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-3">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Aggregated Attendees</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">24,500 Citizens</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              +5% <TrendingUp className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Male: 12,000 (49%)</span>
              <span>Female: 12,500 (51%)</span>
            </div>
            <div className="w-full h-2 rounded-xs overflow-hidden flex bg-indigo-200">
              <div className="bg-[#1a4231] h-full" style={{ width: '49%' }} title="Male 49%"></div>
              <div className="bg-[#10b981] h-full" style={{ width: '51%' }} title="Female 51%"></div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-3">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Efficiency Ratio</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">88% Target</h3>
            <span className="text-[10px] bg-emerald-50 text-[#1a4231] font-bold px-1.5 py-0.5 rounded-sm">Optimal</span>
          </div>
          <div className="w-full bg-[#1a42310c] h-2 rounded-xs overflow-hidden">
            <div className="bg-[#1a4231] h-full" style={{ width: '88%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400">Total participants validated compared with sector civil registers.</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-3">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">High Performance cell</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#1a4231] tracking-tight">Kacyiru Cell</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              94% Index
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Achieved 12 consecutive community assemblies maintaining over 90% attendance.</p>
        </div>

      </div>

      {/* 2. Side-by-side Layout: Top Cell Rankings vs Detailed table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top participation by Cell */}
        <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="pb-3 border-b border-[#1a42310d]">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Participation ranking</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Rankings based on target achievements</p>
          </div>

          <div className="space-y-4 pt-1">
            
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 w-4 inline-block">#1</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Kacyiru Cell</h4>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">12 Assemblies validated</span>
                </div>
              </div>
              <span className="text-xs font-black text-[#1a4231] bg-[#1a423108] px-2 py-0.5 rounded-sm">94%</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 w-4 inline-block">#2</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Kimihurura Cell</h4>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">8 Assemblies validated</span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-700 bg-slate-50 px-2 py-0.5 rounded-sm">91%</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 w-4 inline-block">#3</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Remera Cell</h4>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">10 Assemblies validated</span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded-sm">85%</span>
            </div>

          </div>
        </div>

        {/* Detailed table of recent meeting attendances */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Attendance Files Registry</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Granular citizen counts logged at specific assemblies</p>
            </div>

            {/* Filters */}
            <div className="relative w-full sm:w-48">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search file title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a42310d] bg-slate-50/50">
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Assembly Identification</th>
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Target Register</th>
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Participation Rate</th>
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase text-right">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeetings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-slate-400 font-medium">
                      No meeting attendance sheets matched the specific parameter constraints.
                    </td>
                  </tr>
                ) : (
                  filteredMeetings.map((meeting) => {
                    const ratio = Math.round((meeting.participants / (meeting.targetCount || 1)) * 100);

                    return (
                      <tr key={meeting.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <p className="text-xs font-bold text-slate-800 truncate leading-snug">{meeting.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-[#1a4231] font-mono font-bold bg-[#1a423108] px-1 rounded-sm uppercase">{meeting.id}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{meeting.sector}</span>
                          </div>
                        </td>

                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 font-bold">
                          {meeting.participants.toLocaleString()} / {meeting.targetCount.toLocaleString()}
                        </td>

                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#1a42310a] h-1.5 rounded-sm overflow-hidden shrink-0">
                              <div 
                                className="bg-[#1a4231] h-full" 
                                style={{ width: `${ratio}%` }}
                              ></div>
                            </div>
                            <span className={`text-[10px] font-bold font-mono ${
                              ratio >= 85 ? 'text-[#1a4231]' : 'text-slate-600'
                            }`}>{ratio}%</span>
                          </div>
                        </td>

                        <td className="py-2 px-3 text-right">
                          <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wider">
                            {meeting.participants > 0 ? 'Verified' : 'Scheduled'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
