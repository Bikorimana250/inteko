/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, CheckSquare, Calendar, MapPin, CheckCircle2, AlertTriangle, 
  Send, FileText, Download, ShieldAlert, BadgeCheck, Clock, User
} from 'lucide-react';
import { User as AuthUser } from '../types';

interface ResolutionDetailsViewProps {
  currentUser: Partial<AuthUser>;
  resolution: any;
  onBackToGrid: () => void;
  onApproveAndClose: (resolutionId: string) => void;
  onAddComment: (resolutionId: string, comment: any) => void;
  onToggleActionItem: (resolutionId: string, itemIdx: number) => void;
}

export const ResolutionDetailsView: React.FC<ResolutionDetailsViewProps> = ({
  currentUser,
  resolution,
  onBackToGrid,
  onApproveAndClose,
  onAddComment,
  onToggleActionItem
}) => {
  if (!resolution) return null;

  const [newComment, setNewComment] = useState('');
  const isSectorOfficial = currentUser.role === 'Sector Official';
  const isSecretary = currentUser.role === 'Meeting Secretary';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const formattedComment = {
      author: currentUser.name || 'Anonymous Administrative Official',
      role: currentUser.role || 'Staff Representative',
      text: newComment.trim(),
      time: 'Just now'
    };

    onAddComment(resolution.id, formattedComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      
      {/* Back button and breadcrumbs */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackToGrid}
          className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase rounded-sm flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registry</span>
        </button>
        <span className="text-slate-400 text-xs">/</span>
        <span className="text-slate-500 text-xs font-mono font-bold uppercase">{resolution.id}</span>
      </div>

      {/* Main Grid: Details Left, Timeline/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Resolution summary, Linked issue, Action items */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Resolution Card */}
          <div className="bg-white rounded-sm border border-[#1a42310d] p-5 space-y-4 shadow-xs">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[9px] tracking-widest text-[#1a4231] font-bold uppercase bg-[#1a42310b] px-2 py-0.5 rounded-xs">
                  Central Audit File
                </span>
                <h2 className="text-md md:text-lg font-black text-slate-800 tracking-tight mt-1">
                  {resolution.title}
                </h2>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-wide border ${
                  resolution.status === 'Concluded' || resolution.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                  resolution.status === 'Escalated' || resolution.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-indigo-50 text-indigo-800 border-indigo-100'
                }`}>{resolution.status}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase tracking-widest text-[9px]">Administrative Resolution Objectives</h4>
              <p className="text-slate-650 font-light leading-relaxed">
                {resolution.summary}
              </p>
            </div>

            {/* Jurisdiction Details Info Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-sm text-xs mt-2">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Responsible Authority Agency</span>
                <p className="font-bold text-[#1a4231]">{resolution.assignedUnit}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Assigned Lead Officer</span>
                <p className="font-bold text-slate-700">{resolution.responsibleOfficer}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Due Audit Deadline</span>
                <p className="font-bold font-mono text-red-700">{resolution.dueDate}</p>
              </div>
            </div>

            {/* Support documents block */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-700 uppercase tracking-widest text-[9px] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Administrative Supporting Evidences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(resolution.supportingDocuments || ['Central Assembly Directive Sheet.pdf']).map((doc: string, idx: number) => (
                  <div key={idx} className="p-2 border border-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-50 transition-all select-none">
                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">{doc}</span>
                    <button 
                      onClick={() => alert(`Initiating file transfer protocol for: ${doc}`)}
                      className="p-1 text-[#1a4231] hover:bg-[#1a42310c] rounded-sm cursor-pointer transition-all"
                      title="Download supporting pdf"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Items Checklist Card */}
          <div className="bg-white rounded-sm border border-[#1a42310d] p-5 space-y-4 shadow-xs">
            <div className="pb-2 border-b border-light">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Operational Directives & Action items</h3>
              <p className="text-[10px] text-slate-400">Checkbox targets representing specific milestones assigned during assembly debates.</p>
            </div>

            <div className="space-y-2 text-xs">
              {(resolution.actionItems && resolution.actionItems.length > 0 ? resolution.actionItems : [
                { label: 'Confirm logistics with local cell coordinators', checked: true },
                { label: 'Reforest regional zone according to environmental code parameters', checked: false },
                { label: 'Publish local resident ledger to the Sector database', checked: false }
              ]).map((item: any, idx: number) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 border border-transparent hover:border-slate-150 rounded-xs select-none"
                >
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => isSecretary ? onToggleActionItem(resolution.id, idx) : alert('Privilege restricted. Changing check targets is allowed for secretaries only.')}
                    className="rounded-xs text-[#1a4231] focus:ring-[#1a4231]/30 w-4 h-4 cursor-pointer" 
                  />
                  <span className={`font-semibold text-slate-700 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Comments, Timeline & Executive approval panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Executive Approvals Block */}
          <div className="bg-white rounded-sm border border-[#1a42310d] p-5 space-y-4 shadow-sm">
            
            <div className="pb-2 border-b border-light">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Executive Authority Actions</h3>
            </div>

            {/* Resolution Progress circle */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1a4231" strokeWidth="3" 
                    strokeDasharray={`${resolution.progress} ${100 - resolution.progress}`} 
                    strokeDashoffset="0" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-slate-800">
                  {resolution.progress}%
                </div>
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="text-[9px] uppercase text-slate-400 font-bold block">Milestone Status</span>
                <p className="font-bold text-slate-800">{resolution.progress === 100 ? 'Fully Concluded' : 'Under active validation'}</p>
                <p className="text-[10px] text-slate-400 leading-none">Passed on {resolution.dateCreated || 'Oct 24, 2023'}</p>
              </div>
            </div>

            {/* Sector Official Actions: Can Approve & close card */}
            {isSectorOfficial && (resolution.status !== 'Concluded' && resolution.status !== 'Completed') ? (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onApproveAndClose(resolution.id);
                    alert(`Resolution successfully APPROVED and CLOSE protocols dispatched! Status set to Concluded.`);
                  }}
                  className="w-full py-2 bg-[#1a4231] hover:bg-[#112c20] text-white font-bold text-[11px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Approve & Close Resolution</span>
                </button>
              </div>
            ) : isSectorOfficial ? (
              <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-sm text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Passed / Concluded by Executive Official Cabinet.</span>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-sm text-[10px] text-slate-500 font-light leading-normal">
                🔒 You are viewing representing <strong>{currentUser.role}</strong>. Only <strong>Sector Officials</strong> have the security privilege to formally approve and conclude resolutions.
              </div>
            )}

            {/* Connected Issue Section */}
            {resolution.linkedIssueId && (
              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Linked Assembly Issue Ticket</span>
                <p className="font-bold text-slate-800">{resolution.linkedIssueTitle || 'Regional Water / Trail Boundary Overlap'}</p>
                <span className="font-mono font-bold text-[#1a4231] bg-[#1a423107] px-1 py-0.5 rounded-xs mt-0.5 inline-block text-[9px]">{resolution.linkedIssueId}</span>
              </div>
            )}

          </div>

          {/* Comments and Progress Updates Timeline Card */}
          <div className="bg-white rounded-sm border border-[#1a42310d] p-5 space-y-4 shadow-sm">
            <div className="pb-2 border-b border-light">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Progress Ledger Notes</h3>
              <p className="text-[10px] text-slate-400">Physical history logs of comments and updates regarding delivery progress.</p>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {(resolution.comments && resolution.comments.length > 0 ? resolution.comments : [
                { author: 'Marie-Rose Mutoni', role: 'Meeting Secretary', text: 'Initialized environmental resource checklist with Kacyiru field operators.', time: '2 hours ago' },
                { author: 'Jean-Claude Kabera', role: 'Sector Official', text: 'Allocated 2.1M RWF from community development reserves.', time: '1 day ago' }
              ]).map((comment: any, idx: number) => (
                <div key={idx} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-sm border border-slate-100/50 space-y-1 text-xs transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[#1a4231] text-[10px]">{comment.author}</span>
                    <span className="text-[8px] text-slate-400 font-mono">{comment.time}</span>
                  </div>
                  <span className="text-[8px] tracking-wide text-slate-400 uppercase font-semibold block leading-none">{comment.role}</span>
                  <p className="text-slate-600 font-light mt-1 text-[11px] leading-snug">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment Form (Allowed for Secretary & others too) */}
            <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-slate-100 space-y-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Submit Progress Comment</span>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-sm p-1.5 focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] bg-slate-50/20"
                  placeholder="Record physical state update parameters..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-[#1a42310e] hover:bg-[#1a4231] hover:text-white text-[#1a4231] font-bold text-[10px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Commit Comment</span>
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
