/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, Check, Trash2, Calendar, AlertCircle, FileText, 
  Settings, SlidersHorizontal, CheckSquare, Sparkles 
} from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationCenterViewProps {
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  onClearNotification: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  notifications,
  onMarkRead,
  onClearNotification,
  onMarkAllRead
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Meeting' | 'Issue' | 'Resolution' | 'System'>('All');

  const filteredNotifications = notifications.filter(notif => 
    activeFilter === 'All' ? true : notif.category === activeFilter
  );

  const unreadCount = notifications.filter(n => n.unread).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Meeting':
        return <Calendar className="w-4 h-4 text-emerald-700 font-bold" />;
      case 'Issue':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'Resolution':
        return <CheckSquare className="w-4 h-4 text-indigo-700" />;
      default:
        return <FileText className="w-4 h-4 text-blue-700" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Meeting':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Issue':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'Resolution':
        return 'bg-indigo-50 text-indigo-800 border-indigo-100';
      default:
        return 'bg-blue-50 text-blue-850 border-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Global actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1a42310d]">
        <div className="space-y-0.5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Government Notification Center</h2>
          <p className="text-[10px] text-slate-400">Security warnings, coordination updates, and citizen issue alerts.</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="py-1 px-2.5 bg-white border border-slate-200 hover:bg-[#1a423105] text-[#1a4231] text-[11px] font-bold rounded-sm tracking-wide uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
          <span className="text-[10px] bg-[#1a4231] text-white font-bold px-2.5 py-1 rounded-sm">
            {unreadCount} UNREAD ALERTS
          </span>
        </div>
      </div>

      {/* 2. Unified Category Filters Panel */}
      <div className="bg-white p-4 rounded-sm border border-[#1a42310d] space-y-4">
        <div className="flex items-center gap-1.5 flex-wrap border-b border-slate-100 pb-3">
          {(['All', 'Meeting', 'Issue', 'Resolution', 'System'] as const).map((filter) => {
            const count = filter === 'All' 
              ? notifications.length 
              : notifications.filter(n => n.category === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-1 px-3 text-xs font-bold rounded-sm border transition-all cursor-pointer ${
                  activeFilter === filter 
                    ? 'bg-[#1a4231] border-[#1a4231] text-white shadow-xs' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                <span>{filter}</span>
                <span className={`ml-1.5 text-[9px] font-mono font-bold px-1 rounded-xs ${
                  activeFilter === filter ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Notification List Output */}
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium select-none">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <span>No notifications logged under the selected '{activeFilter}' category.</span>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`py-3.5 flex gap-4 transition-all ${
                  notif.unread ? 'bg-[#1a423105] px-3.5 -mx-3.5 rounded-sm' : ''
                }`}
              >
                {/* Category symbol container */}
                <div className={`w-8 h-8 rounded-sm border flex items-center justify-center shrink-0 ${
                  notif.unread ? 'bg-white border-[#1a423126]' : 'bg-slate-50 border-slate-100'
                }`}>
                  {getCategoryIcon(notif.category)}
                </div>

                {/* Content block */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold tracking-tight text-slate-800 leading-tight ${
                        notif.unread ? 'text-[#1a4231]' : ''
                      }`}>{notif.title}</h4>
                      {notif.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block" title="Unread Alert"></span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 font-bold shrink-0">{notif.time}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-light">{notif.message}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className={`px-1.5 py-0.5 rounded-xs text-[8px] font-bold tracking-wider uppercase border ${
                      getCategoryBadgeClass(notif.category)
                    }`}>
                      {notif.category}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {notif.unread && (
                        <button
                          onClick={() => onMarkRead(notif.id)}
                          className="px-2 py-0.5 bg-white border border-[#1a423126] text-[#1a4231] hover:bg-[#1a42310d] text-[10px] font-bold uppercase rounded-sm transition-colors cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      
                      {notif.actionLabel && (
                        <button
                          onClick={() => alert(`Invoking Action: ${notif.actionLabel} for register index ${notif.id}`)}
                          className="px-2.5 py-0.5 bg-[#1a4231] border border-[#1a4231] text-white hover:bg-slate-800 text-[10px] font-bold uppercase rounded-sm cursor-pointer whitespace-nowrap"
                        >
                          {notif.actionLabel}
                        </button>
                      )}

                      <button
                        onClick={() => onClearNotification(notif.id)}
                        className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                        title="Dismiss notification archive permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
