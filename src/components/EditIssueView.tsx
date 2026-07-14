/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, X, Calendar, User, Save, Upload, MapPin } from 'lucide-react';

interface EditIssueViewProps {
  issueToEdit: any;
  onCancel: () => void;
  onUpdateIssueToState: (issueId: string, updatedFields: any) => void;
}

export const EditIssueView: React.FC<EditIssueViewProps> = ({
  issueToEdit,
  onCancel,
  onUpdateIssueToState
}) => {
  if (!issueToEdit) return null;

  const [title, setTitle] = useState(issueToEdit.title || '');
  const [category, setCategory] = useState(issueToEdit.category || 'Infrastructure');
  const [status, setStatus] = useState(issueToEdit.status || 'Active');
  const [priority, setPriority] = useState(issueToEdit.priority || 'Medium');
  const [description, setDescription] = useState(
    issueToEdit.description || `Community reported request for ${issueToEdit.title || 'the issue'}. Requires formal administrative validation.`
  );
  const [location, setLocation] = useState(issueToEdit.location || 'Kacyiru Cell, Amahoro Village');
  const [assignedOffice, setAssignedOffice] = useState(issueToEdit.assignedOffice || 'Cell Executive Office');
  const [reporter, setReporter] = useState(issueToEdit.reporter || '');
  const [uploadedDocName, setUploadedDocName] = useState<string>('');

  const handleSimulateDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedDocName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Issue title cannot be blank.');
      return;
    }
    const updatedData = {
      title,
      category,
      status,
      priority,
      description,
      location,
      assignedOffice,
      reporter,
      supportingDocument: uploadedDocName || 'Standard Assembly Report.pdf'
    };
    onUpdateIssueToState(issueToEdit.id, updatedData);
  };

  return (
    <div className="bg-white rounded-sm border border-[#1a42310d] overflow-hidden max-w-4xl mx-auto shadow-sm">
      
      {/* Banner / Header Bar */}
      <div className="bg-[#1a4231] text-white p-5 flex justify-between items-center">
        <div>
          <span className="text-[10px] tracking-widest text-[#a7f3d0] font-bold uppercase bg-white/10 px-2 py-0.5 rounded-sm">
            Staff Directory Action - Edit
          </span>
          <h2 className="text-md md:text-lg font-extrabold tracking-tight mt-1 flex items-center gap-2">
            Update Citizen Issue administrative file
          </h2>
        </div>
        <button 
          onClick={onCancel}
          className="p-1 text-emerald-250 hover:text-white rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
        
        {/* Subtitle / Verification Area */}
        <div className="p-3 bg-indigo-50/50 border border-indigo-150 rounded-sm flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Active Audit Reference ID: {issueToEdit.id}</h4>
            <p className="text-[11px] text-slate-500 font-light">
              You are updating high importance citizen logs representing local community disputes. All edits will be physically tracked and timestamped in the civil audit ledger.
            </p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Issue Subject */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Issue Subject Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] font-bold text-slate-800 bg-slate-50/10 placeholder-slate-300"
              placeholder="e.g. Water station breakdown or local road repair request"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Subject Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Land">Land Disputes</option>
              <option value="Governance">Governance Oversight</option>
              <option value="Social">Social Welfare</option>
              <option value="Economic">Economic & Trade</option>
            </select>
          </div>

          {/* Severity/Priority */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Escalation Severity Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>
          </div>

          {/* Reporter / Submitter */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Submitting Citizen Name
            </label>
            <input
              type="text"
              required
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] text-slate-800 bg-white"
            />
          </div>

          {/* Current Status */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Current Resolution Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="Active">Active / Logged</option>
              <option value="Processing">Processing / Auditing</option>
              <option value="Resolved">Resolved</option>
              <option value="Success">Success / Confirmed Closed</option>
            </select>
          </div>

          {/* Jurisdiction / Location */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Geographic Jurisdiction Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] text-slate-800"
            />
          </div>

          {/* Assigned Office / Unit */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Assigned Regional Office / Unit
            </label>
            <input
              type="text"
              required
              value={assignedOffice}
              onChange={(e) => setAssignedOffice(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] text-slate-800"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Detailed Case Description & Meeting Context
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] text-slate-800 bg-white"
              placeholder="Provide a thorough, professional background of the citizen's request..."
            />
          </div>

          {/* File attachment / Supporting documents */}
          <div className="sm:col-span-2">
            <div className="border border-dashed border-slate-200 rounded-sm p-4 text-center hover:bg-slate-50 transition-colors">
              <Upload className="w-6 h-6 text-slate-450 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700">Attach supporting local evidence files</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, or Excel report spreadsheet maps (Max 8MB)</p>
              
              <div className="mt-3">
                <label className="inline-block py-1.5 px-3 bg-[#1a42310f] hover:bg-[#1a423120] text-[#1a4231] font-bold text-[10px] uppercase tracking-wider rounded-sm cursor-pointer border border-[#1a423122]">
                  Choose Document File
                  <input 
                    type="file" 
                    onChange={handleSimulateDocumentUpload}
                    className="hidden" 
                  />
                </label>
              </div>

              {uploadedDocName && (
                <div className="mt-2 text-[10px] text-[#1a4231] font-bold">
                  Attached File: <span className="underline">{uploadedDocName}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-slate-200 rounded-sm text-slate-650 hover:bg-slate-50 text-xs font-bold uppercase cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="py-2 px-4 bg-[#1a4231] hover:bg-[#1a2d21] text-white rounded-sm text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Commit File changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
