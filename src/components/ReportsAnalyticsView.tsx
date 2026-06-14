/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileDown, Download, BarChart3, TrendingUp, CheckSquare, 
  RefreshCw, Users, HelpCircle, Calendar, ShieldCheck 
} from 'lucide-react';
import { User } from '../types';

interface ReportsAnalyticsViewProps {
  currentUser: Partial<User>;
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({ currentUser }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadLog, setDownloadLog] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Gasabo' | 'Kicukiro'>('All');

  const triggerDownloadSimulate = (type: 'pdf' | 'csv') => {
    setDownloading(true);
    setDownloadLog(`Compiling executive statistics registry for Gasabo, Kicukiro and Nyarugenge Sectors...`);
    setTimeout(() => {
      setDownloadLog(`Signing digital security hashes via Sha-256 certificate...`);
    }, 1500);
    setTimeout(() => {
      setDownloadLog(`Success! PDF National Report file generated: 'INTEKO_REPORT_Q4_${new Date().getFullYear()}.pdf' saved.`);
      setDownloading(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Export triggers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1a42310d]">
        <div className="space-y-0.5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">National Performance Reports & Analytics</h2>
          <p className="text-[10px] text-slate-400">Centrally validated citizen assembly statistics and resolution metrics.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerDownloadSimulate('csv')}
            disabled={downloading}
            className="py-1 px-2.5 bg-white border border-slate-200 hover:border-[#1a423133] hover:bg-[#1a423105] text-[#1a4231] text-[11px] font-bold rounded-sm tracking-wide uppercase cursor-pointer flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={() => triggerDownloadSimulate('pdf')}
            disabled={downloading}
            className="py-1 px-3 bg-[#1a4231] text-white hover:bg-slate-800 text-[11px] font-bold rounded-sm tracking-wider uppercase cursor-pointer flex items-center gap-1 shadow-sm border border-[#1a42310d]"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-300" />
            <span>Download Executive Summary</span>
          </button>
        </div>
      </div>

      {/* Simulator logs */}
      {downloadLog && (
        <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-sm flex items-center gap-3 justify-between animate-fade-in border border-slate-800">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${downloading ? 'animate-spin' : ''}`} />
            <span>{downloadLog}</span>
          </div>
          <button onClick={() => setDownloadLog('')} className="text-slate-400 hover:text-white font-bold text-[10px] uppercase">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Key Analytics KPI Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Consolidated Assemblies</span>
              <p className="text-2xl font-black text-slate-800 tracking-tight">1,284 Meetings</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              +12.4% <TrendingUp className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="w-full bg-[#1a42310a] h-1.5 rounded-xs overflow-hidden">
            <div className="bg-[#1a4231] h-full" style={{ width: '82%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400">Total assemblies compiled representing 360 Cells since year start.</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Average Citizen Attendance</span>
              <p className="text-2xl font-black text-slate-800 tracking-tight">85.4% Rate</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              +5.2% <TrendingUp className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="w-full bg-[#1a42310a] h-1.5 rounded-xs overflow-hidden">
            <div className="bg-[#10b981] h-full" style={{ width: '85.4%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400">Calculated as attendance over targeted civil registrations.</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Issue Resolution rate</span>
              <p className="text-2xl font-black text-slate-800 tracking-tight">92.0% Index</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              +3.1% <TrendingUp className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="w-full bg-[#1a42310a] h-1.5 rounded-xs overflow-hidden">
            <div className="bg-[#1a4231] h-full" style={{ width: '92%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400">Measures percentage of citizen claims formally closed in 30 days.</p>
        </div>

      </div>

      {/* 3. Splitting Graph row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Participation Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Monthly Assembly Participation Index</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Average attendees in thousands (Jan - Oct)</p>
            </div>

            <div className="flex bg-slate-100 p-0.5 rounded-xs">
              {['All', 'Gasabo', 'Kicukiro'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setActiveTab(reg as any)}
                  className={`px-2.5 py-0.5 text-[9px] font-bold tracking-wider rounded-xs cursor-pointer ${
                    activeTab === reg ? 'bg-[#1a4231] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Elegant responsive vector chart */}
          <div className="w-full h-64 relative min-h-[250px] pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Shaded Area Accent */}
              <path 
                d="M 10,180 L 60,150 L 120,165 L 180,120 L 240,140 L 300,90 L 360,70 L 420,110 L 485,45 L 485,180 Z" 
                fill="url(#green_gradient)" 
                opacity="0.12" 
              />
              
              {/* Connecting Vector Line */}
              <path 
                d="M 10,180 L 60,150 L 120,165 L 180,120 L 240,140 L 300,90 L 360,70 L 420,110 L 485,45" 
                fill="none" 
                stroke="#1a4231" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              <circle cx="10" cy="180" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="60" cy="150" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="120" cy="165" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="180" cy="120" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="240" cy="140" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="300" cy="90" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="360" cy="70" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="420" cy="110" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="485" cy="45" r="3.5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />

              {/* Gradients Definitions */}
              <defs>
                <linearGradient id="green_gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a4231" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Label axes */}
            <div className="flex justify-between text-[9px] font-bold text-slate-400 font-mono pt-2 px-1">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span>OCT</span>
            </div>
          </div>
        </div>

        {/* Right card: Sector breakdown Index summaries */}
        <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          <div className="pb-3 border-b border-[#1a42310d]">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Resolution Index by Sector</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">District governance resolution tracking metrics</p>
          </div>

          <div className="space-y-4 pt-1">
            
            {/* Gasabo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-bold">Gasabo Sector Index</span>
                <span className="font-extrabold text-[#1a4231]">94.2%</span>
              </div>
              <div className="w-full bg-[#1a423107] h-1.5 rounded-sm overflow-hidden">
                <div className="bg-[#1a4231] h-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>

            {/* Kicukiro */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-bold">Kicukiro Sector Index</span>
                <span className="font-extrabold text-[#1a4231]">88.0%</span>
              </div>
              <div className="w-full bg-[#1a423107] h-1.5 rounded-sm overflow-hidden">
                <div className="bg-[#1a4231] h-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            {/* Nyarugenge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-bold">Nyarugenge Sector Index</span>
                <span className="font-extrabold text-amber-600">75.1%</span>
              </div>
              <div className="w-full bg-[#1a423107] h-1.5 rounded-sm overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '75.1%' }}></div>
              </div>
            </div>

            {/* Remera */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-bold">Remera Sector Index</span>
                <span className="font-extrabold text-[#1a4231]">92.0%</span>
              </div>
              <div className="w-full bg-[#1a423107] h-1.5 rounded-sm overflow-hidden">
                <div className="bg-[#1a4231] h-full" style={{ width: '92%' }}></div>
              </div>
            </div>

          </div>

          {/* Explanatory footer and security validation block */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[9px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#1a4231]" />
            <span>Figures auto-certified by the localized administrative authority ERP module.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
