/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, ShieldAlert } from 'lucide-react';
import { User, UserRole } from '../types';

interface EditUserViewProps {
  userToEdit?: User;
  onCancel: () => void;
  onUpdateUser: (userId: string, updatedData: Partial<User>) => void;
}

export const EditUserView: React.FC<EditUserViewProps> = ({
  userToEdit,
  onCancel,
  onUpdateUser
}) => {
  // Use either the selected user, or default to standard required "Emmanuel Gasana" if none provided!
  const defaultUser: User = {
    id: 'U-005',
    name: 'Emmanuel Gasana',
    email: 'e.gasana@authority.gov.rw',
    role: 'Meeting Secretary',
    status: 'Active',
    sector: 'Kicukiro',
    cell: 'Kagarama',
    village: 'Urumuri',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    idNumber: '1198580045231052',
    phone: '+250 788 123 456',
    position: 'Cell Executive Secretary',
    lastActive: '3 hours ago',
    permissions: 'Level 1 (Staff)'
  };

  const activeUser = userToEdit || defaultUser;

  const [name, setName] = useState(activeUser.name);
  const [email, setEmail] = useState(activeUser.email);
  const [phone, setPhone] = useState(activeUser.phone);
  const [idNumber, setIdNumber] = useState(activeUser.idNumber);
  const [role, setRole] = useState<UserRole>(activeUser.role);
  const [position, setPosition] = useState(activeUser.position);
  const [sector, setSector] = useState(activeUser.sector);
  const [cell, setCell] = useState(activeUser.cell);
  const [village, setVillage] = useState(activeUser.village);
  const [status, setStatus] = useState<'Active' | 'Inactive'>(activeUser.status);
  const [password, setPassword] = useState('••••••••');
  const [permissions, setPermissions] = useState(activeUser.permissions);
  const [error, setError] = useState('');

  // Sync state if userToEdit changes
  useEffect(() => {
    setName(activeUser.name);
    setEmail(activeUser.email);
    setPhone(activeUser.phone);
    setIdNumber(activeUser.idNumber);
    setRole(activeUser.role);
    setPosition(activeUser.position);
    setSector(activeUser.sector);
    setCell(activeUser.cell);
    setVillage(activeUser.village);
    setStatus(activeUser.status);
    setPermissions(activeUser.permissions);
  }, [userToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !idNumber || !position) {
      setError('Please complete all standard required fields.');
      return;
    }

    if (idNumber.replace(/\s/g, '').length !== 16) {
      setError('National ID number must contain exactly 16 characters.');
      return;
    }

    onUpdateUser(activeUser.id, {
      name,
      email,
      phone,
      idNumber,
      role,
      position,
      sector,
      cell,
      village,
      status,
      permissions
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Detail header tracking */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1a42310d]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <button 
              onClick={onCancel}
              className="p-1 hover:bg-slate-100 rounded-sm text-slate-500 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Modify Administrative Staff File: <span className="text-[#1a4231]">{activeUser.name}</span>
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 ml-7">System ID ID: <span className="font-mono text-xs text-slate-600 font-bold bg-slate-100 p-0.5 rounded-sm">{activeUser.id}</span> • Update active parameters securely.</p>
        </div>

        <button 
          onClick={onCancel}
          className="text-xs text-[#1a4231] font-bold hover:underline"
        >
          Back to Directory
        </button>
      </div>

      <div className="bg-white p-6 rounded-sm border border-[#1a42310d] max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-[3px] border-red-600 text-red-800 text-xs rounded-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Informational Warning about access security logs */}
        <div className="mb-6 p-3 bg-[#1a423108] border border-[#1a42311a] text-slate-700 text-xs rounded-sm flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[#1a4231] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Security Access Compliance Monitor</h4>
            <p className="text-[11px] text-slate-500">Every modification is signed by your system key and logged within the security audit. Ensure all inputs match officially submitted civil service registration records.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section A: Identity */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Personal Identity Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  National ID Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Official Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Mobile Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>
          </div>

          {/* Section B: Admin assignments */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Administrative Unit Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  System Role Access <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const selectedRole = e.target.value as UserRole;
                    setRole(selectedRole);
                    if (selectedRole === 'Administrator') {
                      setPermissions('Level 3 (Full Control)');
                    } else if (selectedRole === 'Sector Official') {
                      setPermissions('Level 2 (Authorized)');
                    } else {
                      setPermissions('Level 1 (Staff)');
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 bg-slate-50/50 rounded-sm focus:outline-none focus:border-[#1a4231]"
                >
                  <option value="Meeting Secretary">Meeting Secretary</option>
                  <option value="Sector Official">Sector Official</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Title or Official Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Level Security Level
                </label>
                <input
                  type="text"
                  disabled
                  value={permissions}
                  className="w-full px-3 py-1.5 text-xs border border-slate-100 bg-slate-100 rounded-sm text-slate-500 font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Sector unit
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Cell Unit
                </label>
                <input
                  type="text"
                  value={cell}
                  onChange={(e) => setCell(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Assigned Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>
          </div>

          {/* Status Settings Row */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Account Status Configurations
            </h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="userStatus"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="text-[#1a4231] focus:ring-[#1a4231]/30 w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">Active (Granted Access)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="userStatus"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                  className="text-red-600 focus:ring-red-600/30 w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">Inactive (Lock Signatures)</span>
              </label>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#1a423111]">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded-sm transition-colors cursor-pointer"
            >
              Abort Modifications
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1a4231] text-white hover:bg-[#1a2d21] text-xs font-bold uppercase rounded-sm tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#1a42310d]"
            >
              <Save className="w-4 h-4" />
              <span>Persist Modified Records</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
