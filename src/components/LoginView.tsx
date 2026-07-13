/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Lock, Mail, ChevronRight, Eye, EyeOff, Loader } from 'lucide-react';
import { User } from '../types';
interface LoginViewProps {
  onLoginSuccess: (user: Partial<User>) => void;
}

const API_BASE = 'http://localhost:8080/api/v1';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ROLES = ['Administrator', 'Sector Official', 'Meeting Secretary'] as const;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your official email address.');
      return;
    }
    if (!selectedRole) {
      setError('Please select your account role before authenticating.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        // Store JWT for subsequent API calls
        localStorage.setItem('inteko_jwt_token', data.accessToken);
        // Map backend user to frontend User shape
        const backendUser = data.user;
        const roleMap: Record<string, string> = {
          ADMINISTRATOR: 'Administrator',
          SECTOR_OFFICIAL: 'Sector Official',
          MEETING_SECRETARY: 'Meeting Secretary',
        };
        const mappedUser: Partial<User> = {
          id: String(backendUser.id),
          name: backendUser.name ?? backendUser.fullName ?? email,
          email: backendUser.email,
          role: (roleMap[backendUser.role] ?? backendUser.role) as User['role'],
          status: 'Active',
          sector: backendUser.sectorName ?? '',
          cell: backendUser.cellName ?? '',
          village: backendUser.villageName ?? '',
          avatar: backendUser.avatar ?? '',
          position: backendUser.position ?? '',
        };
        if (mappedUser.role !== selectedRole) {
          setError('Selected role does not match your account. Please select the correct role for this account.');
          return;
        }
        onLoginSuccess(mappedUser);
        return;
      } else if (res.status === 401) {
        setError('Invalid email or password.');
        return;
      }
      // Non-401 error (e.g. 500) — show generic error
      setError('Login service unavailable. Please try again.');
      return;
    } catch {
      setError('Cannot reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-screen-root" className="min-h-screen bg-[#f6f8f7] flex items-center justify-center p-4 selection:bg-[#1a4231/10] selection:text-[#1a4231]">
      <div className="w-full max-w-5xl bg-white border border-[#1a42311a] rounded-sm shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left Side: National Branding Context (Forest Authority Inspired) */}
        <div className="col-span-12 md:col-span-5 bg-[#1a4231] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle opacity overlay for official textured feel */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="relative z-10">
            {/* Republic Coat of Arms Reference or Seal */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-white/10 rounded-sm border border-white/5">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-emerald-400 font-bold uppercase">Republic of Rwanda</p>
                <p className="text-xs text-emerald-200 font-medium">Local Government Portal</p>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-12 leading-tight">
              Inteko y'Abaturage
            </h1>
            <p className="text-sm font-light text-emerald-100/90 mt-2 leading-relaxed">
              Digitizing planning, attendance tracking, and citizen issue resolution at Sector, Cell, and Village levels.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] tracking-wider text-emerald-400 uppercase font-bold">Standardized ERP compliance</span>
              <p className="text-xs text-white/70">Secure centralized oversight for administrative staff and meeting secretaries.</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-emerald-300/80">
              <span>Version 2.4.0-Stable</span>
              <span>© {new Date().getFullYear()} Republic of Rwanda</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Credentials Inputs */}
        <div className="col-span-12 md:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-white">
          <div className="my-auto w-full max-w-md mx-auto">
            <div className="mb-6">
              <span className="text-[10px] tracking-wider text-[#1a4231] font-bold uppercase bg-[#1a42310d] px-2.5 py-1 rounded-sm">
                Official Single Sign-On
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-3 tracking-tight">Access Management Portal</h2>
              <p className="text-xs text-slate-500 mt-1">Please enter your authorized credentials below to log in.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-[3px] border-red-600 text-red-800 text-xs rounded-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="j.clark@authority.gov.rw"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-[10px] text-[#1a4231] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231] focus:ring-1 focus:ring-[#1a4231] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-slate-300 text-[#1a4231] focus:ring-[#1a4231]/30 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-slate-500">Remember this device</span>
                </label>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-700 uppercase mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setSelectedRole(role); setError(''); }}
                      className={`py-2 px-2 text-[10px] font-bold rounded-sm border transition-colors text-center leading-tight ${
                        selectedRole === role
                          ? 'bg-[#1a4231] text-white border-[#1a4231]'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-[#1a4231] hover:text-[#1a4231]'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#1a4231] text-white hover:bg-[#1a2d21] text-xs font-bold rounded-sm tracking-wide transition-colors flex items-center justify-center gap-1.5 border border-[#1a42310d] shadow-sm hover:cursor-pointer uppercase disabled:opacity-60"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                <span>{loading ? 'Authenticating...' : 'Authorize & Authenticate'}</span>
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};
