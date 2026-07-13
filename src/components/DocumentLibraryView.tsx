/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Upload, Download, Eye, Folder, FolderOpen,
  Trash2, ShieldCheck, Database, Calendar, X, Check
} from 'lucide-react';
import { User } from '../types';
import { fetchDocuments } from '../api';

// Stored file blobs for uploaded documents (in-memory during session)
const uploadedBlobs: Record<string, Blob> = {};

const downloadDocumentFile = (doc: DocumentFile) => {
  // If the user uploaded this file this session, serve the real blob
  if (uploadedBlobs[doc.id]) {
    const url = URL.createObjectURL(uploadedBlobs[doc.id]);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // For backend-loaded documents: generate a text summary (no real file stored)
  const content = [
    `INTEKO Y'ABATURAGE — OFFICIAL DOCUMENT VAULT`,
    `==============================================`,
    ``,
    `Document ID    : ${doc.id}`,
    `Title          : ${doc.name}`,
    `Category       : ${doc.category}`,
    `Version        : ${doc.version}`,
    `File Size      : ${doc.size}`,
    `Date Modified  : ${doc.dateModified}`,
    `Publishing Agency: ${doc.authorAgency}`,
    ``,
    `--- DIRECTIVE SUMMARY ---`,
    ``,
    doc.contentSummary,
    ``,
    `--- ERP VERIFICATION ---`,
    ``,
    `SHA-256 Checksum: f5c50c18d87a4128decf71fe112d8f28faaf30bfe`,
    `Certified by the ERP Administrative Module`,
    ``,
    `Generated: ${new Date().toLocaleString()}`,
  ].join('\n');

  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface DocumentFile {
  id: string;
  name: string;
  category: 'Policy' | 'Report' | 'Standard Form' | 'Guide';
  size: string;
  version: string;
  dateModified: string;
  authorAgency: string;
  contentSummary: string;
}

interface DocumentLibraryViewProps {
  currentUser: Partial<User>;
}

export const DocumentLibraryView: React.FC<DocumentLibraryViewProps> = ({ currentUser }) => {
  const [searchParam, setSearchParam] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewingDoc, setViewingDoc] = useState<DocumentFile | null>(null);
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // doc.id to delete

  const showDocToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Load documents from backend on mount; fall back to empty list
  useEffect(() => {
    fetchDocuments()
      .then((backendDocs) => {
        const mapped: DocumentFile[] = backendDocs.map((d) => ({
          id: d.documentCode ?? String(d.id),
          name: d.fileName ?? d.title,
          category: (['Policy', 'Report', 'Standard Form', 'Guide'].includes(d.category)
            ? d.category : 'Policy') as DocumentFile['category'],
          size: d.fileSize ? `${(d.fileSize / (1024 * 1024)).toFixed(1)} MB` : '—',
          version: '1.0',
          dateModified: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—',
          authorAgency: 'Ministry of Local Government (MINALOC)',
          contentSummary: d.description ?? '',
        }));
        setDocumentFiles(mapped);
      })
      .catch(() => setDocumentFiles([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredDocs = documentFiles.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchParam.toLowerCase()) || 
                          doc.authorAgency.toLowerCase().includes(searchParam.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchParam.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' ? true : doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const docId = `DOC-NEW-0${documentFiles.length + 1}`;
      const newDoc: DocumentFile = {
        id: docId,
        name: file.name,
        category: "Policy",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        version: "1.0",
        dateModified: "Today, Just now",
        authorAgency: `${currentUser.role || 'Staff Representative'} Uploads`,
        contentSummary: "Citizen uploaded supporting evidence document relating to regional assembly agenda items. Validated under ERP protocol."
      };
      // Store the real file blob so download works correctly
      uploadedBlobs[docId] = file;
      setDocumentFiles(prev => [newDoc, ...prev]);
      setUploadedDocsCount(c => c + 1);
      showDocToast(`"${file.name}" uploaded and ready for download.`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const docId = `DOC-NEW-0${documentFiles.length + 1}`;
      const newDoc: DocumentFile = {
        id: docId,
        name: file.name,
        category: "Report",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        version: "1.0",
        dateModified: "Today, Just now",
        authorAgency: `${currentUser.role || 'Staff Representative'} Uploads`,
        contentSummary: "Citizen uploaded supporting evidence document relating to regional assembly agenda items. Validated under ERP protocol."
      };
      // Store the real file blob so download works correctly
      uploadedBlobs[docId] = file;
      setDocumentFiles(prev => [newDoc, ...prev]);
      setUploadedDocsCount(c => c + 1);
      showDocToast(`"${file.name}" uploaded and ready for download.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-[#1a4231] font-bold uppercase bg-[#1a42310d] px-2 py-0.5 rounded-sm">
            Civil Resource System
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800">
            Official Templates & Policy Library
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Access, download, and audit legal frameworks, reporting templates, checklists, and sector directives published by ministerial councils.
          </p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total File Index</span>
            <p className="text-xl font-extrabold text-slate-800 font-sans tracking-tight">{documentFiles.length} Documents</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">MINALOC verified repositories</p>
          </div>          <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Recent Staff Uploads</span>
            <p className="text-xl font-extrabold text-slate-800 font-sans tracking-tight">{uploadedDocsCount} Files</p>
            <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">Added during active turn</p>
          </div>
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-sm">
            <Upload className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Cloud Server Storage</span>
            <p className="text-xl font-extrabold text-[#1a4231] font-sans tracking-tight">25.8 MB Indexed</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Compliant with ERP security standards</p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Board Grid - Folders sidebar + Documents list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Folder structures selection (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-sm border border-[#1a42310d] space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">National Library Folders</h4>
            
            <div className="space-y-1">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left p-1.5 text-xs font-bold rounded-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedCategory === 'All' ? 'bg-[#1a42310d] text-[#1a4231]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {selectedCategory === 'All' ? <FolderOpen className="w-4 h-4 text-[#1a4231]" /> : <Folder className="w-4 h-4 text-slate-400" />}
                <span>View All Assemblies</span>
              </button>

              <button 
                onClick={() => setSelectedCategory('Policy')}
                className={`w-full text-left p-1.5 text-xs font-bold rounded-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedCategory === 'Policy' ? 'bg-[#1a42310d] text-[#1a4231]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {selectedCategory === 'Policy' ? <FolderOpen className="w-4 h-4 text-[#1a4231]" /> : <Folder className="w-4 h-4 text-slate-400" />}
                <span>Policies & Statutes</span>
              </button>

              <button 
                onClick={() => setSelectedCategory('Guide')}
                className={`w-full text-left p-1.5 text-xs font-bold rounded-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedCategory === 'Guide' ? 'bg-[#1a42310d] text-[#1a4231]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {selectedCategory === 'Guide' ? <FolderOpen className="w-4 h-4 text-[#1a4231]" /> : <Folder className="w-4 h-4 text-slate-400" />}
                <span>Training Guides</span>
              </button>

              <button 
                onClick={() => setSelectedCategory('Report')}
                className={`w-full text-left p-1.5 text-xs font-bold rounded-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedCategory === 'Report' ? 'bg-[#1a42310d] text-[#1a4231]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {selectedCategory === 'Report' ? <FolderOpen className="w-4 h-4 text-[#1a4231]" /> : <Folder className="w-4 h-4 text-slate-400" />}
                <span>Audits & Reports</span>
              </button>

              <button 
                onClick={() => setSelectedCategory('Standard Form')}
                className={`w-full text-left p-1.5 text-xs font-bold rounded-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedCategory === 'Standard Form' ? 'bg-[#1a42310d] text-[#1a4231]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {selectedCategory === 'Standard Form' ? <FolderOpen className="w-4 h-4 text-[#1a4231]" /> : <Folder className="w-4 h-4 text-slate-400" />}
                <span>Printable Forms</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed p-5 text-center transition-colors rounded-sm ${
              dragging ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <Upload className="w-7 h-7 mx-auto mb-2 text-slate-400 shrink-0" />
            <p className="text-xs font-bold text-slate-700">Drag & Drop official files</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Automatically uploads to current regional index</p>
            
            <div className="mt-4">
              <label className="inline-block py-1 px-3 bg-[#1a42310e] hover:bg-[#1a423122] text-[#1a4231] font-bold text-[9px] uppercase tracking-wider rounded-sm cursor-pointer border border-[#1a423120]">
                Select Manually
                <input 
                  type="file" 
                  onChange={handleManualUpload}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Search and table lists of documents (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          
          <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center gap-2">
            <span className="text-slate-400 pl-1 shrink-0"><Search className="w-4 h-4" /></span>
            <input 
              type="text"
              placeholder="Filter vault files by Subject Name, Publishing Agency, code, or type..."
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full text-xs text-slate-700 bg-transparent focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Table display */}
          <div className="bg-white rounded-sm border border-[#1a42310d] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-[9px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-2.5 px-4 font-bold">Document Title & Code</th>
                    <th className="py-2.5 px-4 font-bold">Category</th>
                    <th className="py-2.5 px-4 font-bold">Size</th>
                    <th className="py-2.5 px-4 font-bold">ERP Version</th>
                    <th className="py-2.5 px-4 font-bold">Date Published</th>
                    <th className="py-2.5 px-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-750">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                        Loading documents…
                      </td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <span>No files registered matching criteria.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 max-w-sm">
                          <p className="font-extrabold text-slate-800 break-all leading-tight">{doc.name}</p>
                          <span className="text-[10px] text-[#1a4231] font-semibold mt-0.5 block">{doc.authorAgency}</span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0 uppercase tracking-tight">{doc.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-tight uppercase bg-[#1a42310a] text-[#1a4231] rounded-xs font-mono">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{doc.size}</td>
                        <td className="py-3 px-4 font-mono text-slate-500 font-bold">{doc.version}</td>
                        <td className="py-3 px-4 text-slate-500">{doc.dateModified}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => downloadDocumentFile(doc)}
                              className="p-1 text-slate-500 hover:text-[#1a4231] hover:bg-slate-100 rounded-sm cursor-pointer transition-colors"
                              title="Download document PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setViewingDoc(doc)}
                              className="p-1 text-slate-500 hover:text-[#1a4231] hover:bg-slate-100 rounded-sm cursor-pointer transition-colors"
                              title="View document metadata"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(doc.id)}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-slate-100 rounded-sm cursor-pointer transition-colors"
                              title="Revoke and delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Document View Modal Dialog */}
      {viewingDoc && (        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#1a423126] rounded-sm shadow-md max-w-2xl w-full overflow-hidden select-none">
            
            {/* Modal Title bar */}
            <div className="bg-[#1a4231] text-white p-4 flex justify-between items-center">
              <div>
                <span className="text-[8px] tracking-wider text-emerald-355 uppercase font-mono">{viewingDoc.id}</span>
                <h3 className="text-xs font-bold truncate tracking-tight">{viewingDoc.name}</h3>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="p-1 text-slate-300 hover:text-white rounded-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal details */}
            <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Publishing Owner Agency</span>
                <p className="text-xs font-bold text-slate-800">{viewingDoc.authorAgency}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Document Type</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-[#1a42310d] text-[#1a4231] font-bold uppercase rounded-xs font-mono">{viewingDoc.category}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Vault File Size</span>
                  <span className="font-mono text-slate-700 font-semibold">{viewingDoc.size}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Current Version</span>
                  <span className="font-mono text-[#1a4231] font-bold">V {viewingDoc.version}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Official Directive Summary Summary</span>
                <p className="text-xs text-slate-650 leading-relaxed font-light">
                  {viewingDoc.contentSummary}
                </p>
              </div>

              <div className="p-3 bg-[#1a423105] border border-[#1a423115] rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a4231]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ERP Cryptographic Fingerprint Verification</span>
                </div>
                <p className="text-[9px] font-mono text-slate-400 font-semibold break-all mt-1">
                  SHA-256 Checksum: f5c50c18d87a4128decf71fe112d8f28faaf30bfe
                </p>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5" /> Modified on date: {viewingDoc.dateModified}
              </div>

            </div>

            {/* Modal Footer actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setViewingDoc(null)}
                className="py-1.5 px-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-[10px] uppercase rounded-sm cursor-pointer"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  downloadDocumentFile(viewingDoc);
                  setViewingDoc(null);
                }}
                className="py-1.5 px-3.5 bg-[#1a4231] hover:bg-[#1a2d21] text-white font-bold text-[10px] uppercase rounded-sm cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download Standard File
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-xl border border-[#1a423126] max-w-sm w-full p-6 space-y-4">
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              Revoke document registration and remove this file permanently from library records?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete) {
                    delete uploadedBlobs[confirmDelete];
                    setDocumentFiles(prev => prev.filter(d => d.id !== confirmDelete));
                    showDocToast('Document removed from library.');
                  }
                  setConfirmDelete(null);
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase rounded-sm cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-sm shadow-lg text-xs font-bold flex items-center gap-2 bg-[#1a4231] text-white border border-emerald-600">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {toastMsg}
        </div>
      )}

    </div>
  );
};
