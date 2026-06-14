/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface CreateUserViewProps {
  onCancel: () => void;
  onSaveUser: (userData: Omit<User, 'id' | 'avatar' | 'lastActive'>) => void;
}

export const CreateUserView: React.FC<CreateUserViewProps> = ({ onCancel, onSaveUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [role, setRole] = useState<UserRole>('Meeting Secretary');
  const [position, setPosition] = useState('');
  const [sector, setSector] = useState('Gasabo');
  const [cell, setCell] = useState('Kacyiru');
  const [village, setVillage] = useState('Amahoro');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [permissions, setPermissions] = useState('Level 1 (Staff)');
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!name || !email || !phone || !idNumber || !position) {
      setError('Please complete all standard required fields.');
      return;
    }

    if (idNumber.length !== 16 || !/^\d+$/.test(idNumber)) {
      setError('National Identity card number (NID) must represent exactly 16 digit characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Security credentials confirmation password mismatch.');
      return;
    }

    // Trigger save
    onSaveUser({
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
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Create New Administrative Staff Account</h2>
          </div>
          <p className="text-[10px] text-slate-400 ml-7">Introduce verified personnel into the localized community directory system.</p>
        </div>

        <button 
          onClick={onCancel}
          className="text-xs text-[#1a4231] font-bold hover:underline"
        >
          Cancel with exit
        </button>
      </div>

      <div className="bg-white p-6 rounded-sm border border-[#1a42310d] max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-[3px] border-red-600 text-red-800 text-xs rounded-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section A: Identification */}
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
                  placeholder="e.g., Emmanuel Gasana"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  National ID (16 Digits) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="1 1985 8 0045231 0 52"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] font-mono"
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
                  placeholder="e.gasana@authority.gov.rw"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 788 123 456"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231]"
                />
              </div>
            </div>
          </div>

          {/* Section B: Administrative Assignment */}
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
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm bg-slate-50/50 focus:outline-none focus:border-[#1a4231]"
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
                  placeholder="e.g., Cell Executive Secretary"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Level 1 Audit Authority
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
                  District / Sector Unit
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 bg-slate-50/50 rounded-sm focus:outline-none focus:border-[#1a4231]"
                >
                  <option value="Gasabo">Gasabo Sector</option>
                  <option value="Kicukiro">Kicukiro Sector</option>
                  <option value="Nyarugenge">Nyarugenge Sector</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Administrative Cell
                </label>
                <select
                  value={cell}
                  onChange={(e) => setCell(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 bg-slate-50/50 rounded-sm focus:outline-none focus:border-[#1a4231]"
                >
                  <option value="Kacyiru">Kacyiru Cell</option>
                  <option value="Niboye">Niboye Cell</option>
                  <option value="Kiyovu">Kiyovu Cell</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Assigned Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Amahoro Village"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>
          </div>

          {/* Section C: Security Access Passwords */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Portal Access Secrets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Temporary password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1">
                  Confirm Password Secret <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#1a423111]">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded-sm transition-colors cursor-pointer"
            >
              Abort Actions
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1a4231] text-white hover:bg-[#1a2d21] text-xs font-bold uppercase rounded-sm tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#1a42310d]"
            >
              <Save className="w-4 h-4" />
              <span>Persist Record File</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
