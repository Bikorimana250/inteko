/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import {
  fetchAttendanceSummary,
  AttendanceSummaryData,
  MeetingAttendanceItem,
} from '../api';

export const AttendanceSummaryView: React.FC = () => {
  const [data, setData] = useState<AttendanceSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAttendanceSummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredMeetings: MeetingAttendanceItem[] = (data?.meetingAttendances ?? []).filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.meetingId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-400">
        Loading attendance data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-red-400">
        Failed to load: {error}
      </div>
    );
  }

  const topCell = data?.topCellRankings?.[0];
  const attendanceRate = data?.attendanceRate ?? 0;

  return (
    <div className="space-y-6">

      {/* 1. Statistics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total participants */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-3">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Aggregated Attendees</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {(data?.totalParticipants ?? 0).toLocaleString()} Citizens
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              Live <TrendingUp className="w-2.5 h-2.5" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Total registered attendees across all community assemblies.
          </p>
        </div>

        {/* Efficiency ratio */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-3">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Efficiency Ratio</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {attendanceRate.toFixed(1)}% Target
            </h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${attendanceRate >= 80 ? 'bg-emerald-50 text-[#1a4231]' : 'bg-amber-50 text-amber-700'}`}>
              {attendanceRate >= 80 ? 'Optimal' : 'Below Target'}
            </span>
          </div>
          <div className="w-full bg-[#1a42310c] h-2 rounded-xs overflow-hidden">
            <div className="bg-[#1a4231] h-full transition-all" style={{ width: `${Math.min(attendanceRate, 100)}%` }} />
          </div>
          <p className="text-[10px] text-slate-400">Avg. participation rate across completed assemblies.</p>
        </div>

        {/* Top performing sector */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-3">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">High Performance Sector</span>
          {topCell ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#1a4231] tracking-tight">{topCell.cellName}</h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                  {topCell.attendanceRate.toFixed(1)}% Index
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {topCell.meetingCount} assemblies recorded with highest avg. attendance rate.
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-400">No data available.</p>
          )}
        </div>

      </div>

      {/* 2. Side-by-side: Rankings + Meeting table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Top participation rankings */}
        <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="pb-3 border-b border-[#1a42310d]">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Participation Ranking</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Rankings based on target achievements</p>
          </div>

          <div className="space-y-4 pt-1">
            {data?.topCellRankings && data.topCellRankings.length > 0 ? (
              data.topCellRankings.slice(0, 3).map((cell, idx) => (
                <div
                  key={cell.cellName}
                  className={`flex items-center justify-between p-2 hover:bg-slate-50 transition-colors ${idx < 2 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 w-4 inline-block">#{idx + 1}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{cell.cellName}</h4>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                        {cell.meetingCount} Assemblies validated
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-sm ${
                    idx === 0 ? 'text-[#1a4231] bg-[#1a423108]' : 'text-slate-700 bg-slate-50'
                  }`}>
                    {cell.attendanceRate.toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No ranking data available.</p>
            )}
          </div>
        </div>

        {/* Detailed meeting attendance table */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Attendance Files Registry</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Granular citizen counts logged at specific assemblies</p>
            </div>
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
                  <th className="py-2 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeetings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-slate-400 font-medium">
                      No meeting attendance records matched the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMeetings.map((meeting) => {
                    const ratio = meeting.attendanceRate;
                    return (
                      <tr key={meeting.meetingId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <p className="text-xs font-bold text-slate-800 truncate leading-snug">{meeting.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-[#1a4231] font-mono font-bold bg-[#1a423108] px-1 rounded-sm uppercase">
                              {meeting.meetingId}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              {meeting.sectorName}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 font-bold">
                          {meeting.participants.toLocaleString()} / {meeting.targetCount.toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#1a42310a] h-1.5 rounded-sm overflow-hidden shrink-0">
                              <div className="bg-[#1a4231] h-full" style={{ width: `${Math.min(ratio, 100)}%` }} />
                            </div>
                            <span className={`text-[10px] font-bold font-mono ${ratio >= 85 ? 'text-[#1a4231]' : 'text-slate-600'}`}>
                              {ratio.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wider">
                            {meeting.status === 'COMPLETED' ? 'Verified' :
                             meeting.status === 'ONGOING' ? 'Live' :
                             meeting.status === 'POSTPONED' ? 'Postponed' : 'Scheduled'}
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
