/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, Search, ShieldCheck, Mail, Phone, SlidersHorizontal, 
  Trash2, Edit2, Upload, HelpCircle, UserX, FileDown 
} from 'lucide-react';
import { User, UserRole } from '../types';

interface ManageUsersViewProps {
  users: User[];
  onToggleStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onTriggerEdit: (userId: string) => void;
  onTriggerCreate: () => void;
}

export const ManageUsersView: React.FC<ManageUsersViewProps> = ({
  users,
  onToggleStatus,
  onDeleteUser,
  onTriggerEdit,
  onTriggerCreate
}) => {
  const [searchParam, setSearchParam] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkLog, setBulkLog] = useState('');

  // Filtering users realistically
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchParam.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchParam.toLowerCase()) ||
                          user.phone.includes(searchParam) ||
                          user.id.toLowerCase().includes(searchParam.toLowerCase());
    
    const matchesRole = roleFilter === 'All' ? true : user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' ? true : user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBulkSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkLog('Analyzing CSV schema... Detected columns (Name, Email, Role, Phone, Sector, Cell, Village). Validating 12 candidate records... Success! Bulk import completed.');
    setTimeout(() => {
      setBulkLog('');
      setShowBulkUpload(false);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Cards Panel resembling references */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Active Staff Directory</span>
            <p className="text-xl font-extrabold text-slate-800 font-sans tracking-tight">152 Officials</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">8 Sectors represented</p>
          </div>
          <div className="flex -space-x-1.5 overflow-hidden">
            <span className="inline-block w-6 h-6 rounded-full bg-slate-300 ring-2 ring-white text-[9px] flex items-center justify-center font-bold text-slate-700">UA</span>
            <span className="inline-block w-6 h-6 rounded-full bg-slate-400 ring-2 ring-white text-[9px] flex items-center justify-center font-bold text-white">MK</span>
            <span className="inline-block w-6 h-6 rounded-full bg-slate-500 ring-2 ring-white text-[9px] flex items-center justify-center font-bold text-emerald-100">+12</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pending Invitations</span>
            <p className="text-xl font-extrabold text-slate-800 font-sans tracking-tight">12 Pending</p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Expiring in 7 days</p>
          </div>
          <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-2 py-1 rounded-sm">Remind All</span>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">System Privileges</span>
            <p className="text-xl font-extrabold text-[#1a4231] font-sans tracking-tight">ERP Security V2</p>
            <p className="text-[10px] text-slate-500 mt-0.5">SHA-256 Key Audit active</p>
          </div>
          <div className="p-2 bg-[#1a423108] text-[#1a4231] rounded-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Directory Filter Drawer */}
      <div className="bg-white p-4 rounded-sm border border-[#1a42310d] space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, cell or system ID..."
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Filter Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-[10px] uppercase font-mono">Role:</span>
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1 px-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] text-xs bg-slate-50/50"
              >
                <option value="All">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Sector Official">Sector Official</option>
                <option value="Meeting Secretary">Meeting Secretary</option>
              </select>
            </div>

            {/* Status Filter Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-[10px] uppercase font-mono">Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1 px-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] text-xs bg-slate-50/50"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Bulk Import Trigger toggle */}
            <button
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="py-1 px-2.5 bg-[#1a42310d] text-[#1a4231] hover:bg-[#1a423114] text-xs font-bold rounded-sm tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer border border-[#1a423105]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk Action</span>
            </button>

            {/* Create User main trigger */}
            <button
              onClick={onTriggerCreate}
              className="py-1 px-3 bg-[#1a4231] text-white hover:bg-[#1a2d21] text-xs font-bold rounded-sm tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Bulk Upload simulation drawers */}
        {showBulkUpload && (
          <div className="bg-slate-50/75 p-3.5 border border-dashed border-[#1a423133] rounded-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Simulate Bulk Attendance / User Import</h4>
                <p className="text-[10px] text-slate-500">Upload a single spreadsheet CSV incorporating multiple administrative personnel files.</p>
              </div>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>

            <form onSubmit={handleBulkSimulate} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="file" 
                accept=".csv"
                required
                className="text-xs bg-white border border-slate-200 rounded-sm p-1 flex-1 focus:outline-none" 
              />
              <button 
                type="submit"
                className="px-4 py-1.5 bg-[#1a4231] text-white hover:bg-slate-800 text-xs font-bold uppercase rounded-sm cursor-pointer whitespace-nowrap"
              >
                Start Verification Flow
              </button>
            </form>

            {bulkLog && (
              <div className="text-[10px] font-mono p-2.5 bg-slate-900 text-emerald-400 rounded-xs border border-slate-800 leading-normal">
                {bulkLog}
              </div>
            )}
          </div>
        )}

        {/* Directory Output Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1a42310d] bg-slate-50/50">
                <th className="py-2.5 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">System Identity & Unit</th>
                <th className="py-2.5 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Contact Credentials</th>
                <th className="py-2.5 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">System Role Mode</th>
                <th className="py-2.5 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase">Last Active</th>
                <th className="py-2.5 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase text-center">Status</th>
                <th className="py-2.5 px-3 text-[9px] font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400 font-medium">
                    No active administrative accounts matched your specific criteria parameters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full border border-slate-200 shrink-0 object-cover" 
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-[#1a4231] transition-colors">{user.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] text-[#1a4231] font-bold bg-[#1a42310d] px-1 rounded-sm uppercase tracking-tight">{user.id}</span>
                            <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">{user.position}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" /> {user.email}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {user.phone}
                        </span>
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-700 font-bold block">{user.role}</span>
                        <span className="text-[9px] text-slate-400 block tracking-tight">Units: {user.sector} Sector / {user.cell} Cell</span>
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{user.lastActive}</span>
                    </td>

                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onToggleStatus(user.id)}
                        className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-sm tracking-wide cursor-pointer transition-colors ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>

                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onTriggerEdit(user.id)}
                          className="p-1 text-slate-500 hover:text-[#1a4231] hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
                          title="Edit administrative metadata"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                          title="Revoke user permissions completely"
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
  );
};
