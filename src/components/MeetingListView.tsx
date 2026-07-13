/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Plus, 
  Check, AlertCircle, X, SlidersHorizontal, Loader 
} from 'lucide-react';
import { Meeting } from '../types';
import { checkInParticipant, createMeeting, fetchSectors, SectorItem } from '../api';

interface AttendeeEntry {
  name: string;
  idNumber: string;
  phone: string;
}

interface MeetingListViewProps {
  meetings: Meeting[];
  onMeetingCreated: (meeting: Meeting) => void;
  onUpdateMeetingStatus: (meetingId: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Postponed') => void;
  onCheckInAttendee: (meetingId: string, attendee: AttendeeEntry) => void;
  userRole?: string;
  onNavigateToView?: (view: string) => void;
}

export const MeetingListView: React.FC<MeetingListViewProps> = ({
  meetings,
  onMeetingCreated,
  onUpdateMeetingStatus,
  onCheckInAttendee,
  userRole,
  onNavigateToView,
}) => {
  const isSectorOfficial = userRole === 'Sector Official';
  const isSecretary = userRole === 'Meeting Secretary';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Check-in modal state
  const [checkInMeetingId, setCheckInMeetingId] = useState<string | null>(null);
  const [checkedInList, setCheckedInList] = useState<AttendeeEntry[]>([]);
  const [ciName, setCiName] = useState('');
  const [ciId, setCiId] = useState('');
  const [ciPhone, setCiPhone] = useState('');
  const [ciError, setCiError] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [targetCount, setTargetCount] = useState(100);
  const [sector, setSector] = useState('Gasabo Sector');
  const [errorCode, setErrorCode] = useState('');

  // Sectors for dropdown
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const [sectorId, setSectorId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSectors()
      .then((data) => {
        setSectors(data);
        if (data.length > 0) {
          setSectorId(data[0].id);
          setSector(data[0].name);
        }
      })
      .catch(() => {
        // fallback: no sectors loaded, user can type sector name manually
      });
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) {
      setErrorCode('Missing critical credentials. Title, Date and Location required.');
      return;
    }
    // Only require sectorId if sectors were loaded from backend
    if (sectors.length > 0 && !sectorId) {
      setErrorCode('Please select a sector.');
      return;
    }

    // Verify JWT is present before attempting the request
    const token = localStorage.getItem('inteko_jwt_token');
    if (!token) {
      setErrorCode('Your session has expired. Please log out and log back in to create a meeting.');
      return;
    }

    // type="date" always gives YYYY-MM-DD directly — no parsing needed
    const isoDate = date;

    // type="time" always gives HH:MM — append seconds for backend LocalTime
    const isoTime = time ? `${time}:00` : '09:00:00';

    setSubmitting(true);
    setErrorCode('');

    try {
      const created = await createMeeting({
        title: title.toUpperCase(),
        meetingDate: isoDate,
        meetingTime: isoTime,
        location,
        targetCount: Number(targetCount),
        sectorId: sectorId ?? 1,
      });

      // Map backend response to frontend Meeting type
      const newMeeting: Meeting = {
        id: created.meetingCode ? `#${created.meetingCode}` : `#MTG-${created.id}`,
        dbId: created.id,
        title: created.title,
        date: created.meetingDate,
        time: created.meetingTime,
        location: created.location,
        status: 'Scheduled',
        participants: created.participantsCount ?? 0,
        targetCount: created.targetCount,
        sector: created.sectorName ?? sector,
      };

      onMeetingCreated(newMeeting);

      // Reset fields
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setTargetCount(100);
      setErrorCode('');
      setShowScheduleForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('401') || msg.toLowerCase().includes('session expired')) {
        setErrorCode('Session expired. Please log out and log back in, then try again.');
      } else {
        setErrorCode(`Failed to save meeting: ${msg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciName.trim()) { setCiError('Full name is required.'); return; }
    const attendee: AttendeeEntry = { name: ciName.trim(), idNumber: ciId.trim(), phone: ciPhone.trim() };

    // Persist to backend if meeting has a DB id
    const meeting = meetings.find(m => m.id === checkInMeetingId);
    if (meeting?.dbId) {
      try {
        await checkInParticipant(meeting.dbId, {
          participantName: attendee.name,
          idNumber: attendee.idNumber || undefined,
          phone: attendee.phone || undefined,
        });
      } catch (err) {
        setCiError('Failed to save check-in to server. Please try again.');
        return;
      }
    }

    onCheckInAttendee(checkInMeetingId!, attendee);
    setCheckedInList(prev => [attendee, ...prev]);
    setCiName(''); setCiId(''); setCiPhone(''); setCiError('');
  };

  const openCheckIn = (meetingId: string) => {
    setCheckInMeetingId(meetingId);
    setCheckedInList([]);
    setCiName(''); setCiId(''); setCiPhone(''); setCiError('');
  };

  const closeCheckIn = () => setCheckInMeetingId(null);

  const activeCheckInMeeting = meetings.find(m => m.id === checkInMeetingId);

  return (
    <>
    {/* Check-in modal overlay */}
    {checkInMeetingId && activeCheckInMeeting && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-sm shadow-xl w-full max-w-lg border border-[#1a423126] flex flex-col max-h-[90vh]">
          
          {/* Modal header */}
          <div className="flex items-start justify-between p-4 border-b border-slate-100">
            <div>
              <span className="text-[8px] uppercase tracking-widest text-emerald-700 font-bold block">Live Check-in</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-snug">{activeCheckInMeeting.title}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{activeCheckInMeeting.location} · {activeCheckInMeeting.date}</p>
            </div>
            <button onClick={closeCheckIn} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Attendance counter */}
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Session check-ins</span>
            <span className="text-lg font-black text-[#1a4231] font-mono">{checkedInList.length}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckInSubmit} className="p-4 space-y-3 border-b border-slate-100">
            {ciError && (
              <div className="text-[10px] font-bold text-red-700 bg-red-50 p-2 border-l-[3px] border-red-500 rounded-xs flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />{ciError}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name *</label>
              <input
                type="text"
                value={ciName}
                onChange={e => setCiName(e.target.value)}
                placeholder="e.g. Kamanzi Jean Pierre"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">ID Number</label>
                <input
                  type="text"
                  value={ciId}
                  onChange={e => setCiId(e.target.value)}
                  placeholder="16-digit national ID"
                  maxLength={16}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</label>
                <input
                  type="text"
                  value={ciPhone}
                  onChange={e => setCiPhone(e.target.value)}
                  placeholder="+250 788 ..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-[#1a4231] text-white hover:bg-slate-800 text-[11px] font-bold uppercase rounded-sm tracking-wide cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Record Attendance
            </button>
          </form>

          {/* Checked-in list this session */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {checkedInList.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center py-4">No attendees recorded in this session yet.</p>
            ) : (
              checkedInList.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 px-3 bg-emerald-50 border border-emerald-100 rounded-xs">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{a.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{a.idNumber || '—'} · {a.phone || '—'}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 flex justify-end">
            <button onClick={closeCheckIn} className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-sm cursor-pointer">
              Close Session
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="space-y-6">
      
      {/* 1. Header showing controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1a42310d]">
        <div className="space-y-0.5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Citizen Assembly Calendars (Inteko y'Abaturage)</h2>
          <p className="text-[10px] text-slate-400 font-medium">Schedule, modify, and monitor active council assemblies.</p>
        </div>

        {isSectorOfficial && (
          <button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="py-1.5 px-3 bg-[#1a4231] text-white hover:bg-slate-800 text-[11px] font-bold rounded-sm tracking-wide uppercase cursor-pointer flex items-center gap-1 shadow-sm"
          >
            {showScheduleForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showScheduleForm ? 'Exit Schedule Forms' : 'Schedule Assembly'}</span>
          </button>
        )}
      </div>

      {/* 2. Schedule meeting slider form drawer */}
      {showScheduleForm && isSectorOfficial && (
        <div className="bg-white p-5 rounded-sm border border-[#1a423126] hover:shadow-md transition-all max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-start pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Draft Assembly Registry</h3>
              <p className="text-[10px] text-slate-400">Initialize a regional citizen assembly request within the local queue.</p>
            </div>
            <button onClick={() => setShowScheduleForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorCode && (
            <div className="text-[10px] font-bold text-red-700 bg-red-50 p-2 border-l-[3px] border-red-600 rounded-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{errorCode}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs select-none">
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Assembly Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UMUGANDA PLANNING ASSEMBLY"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Target Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Targeted Civil attendance count</label>
                  <input
                    type="number"
                    value={targetCount}
                    onChange={(e) => setTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sector unit</label>
                  {sectors.length > 0 ? (
                    <select
                      value={sectorId ?? ''}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setSectorId(id);
                        const found = sectors.find(s => s.id === id);
                        if (found) setSector(found.name);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                    >
                      {sectors.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Assembly Location Site</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kigali City Hall Auditorium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-sm cursor-pointer"
              >
                Cancel Draft
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-[#1a4231] text-white hover:bg-[#1a2d21] text-[10px] font-bold uppercase rounded-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
              >
                {submitting && <Loader className="w-3 h-3 animate-spin" />}
                {submitting ? 'Saving...' : 'Publish Assembly'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 3. Search and filter tools */}
      <div className="bg-white p-4 rounded-sm border border-[#1a42310d] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-100">
          
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search assemblies by title, index code or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            
            {/* Status filters selection */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] uppercase text-slate-500 font-mono">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1 px-2 border border-slate-200 bg-slate-50/50 rounded-sm text-xs focus:outline-none"
              >
                <option value="All">All Assemblies</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>
          </div>

        </div>

        {/* 4. Calendars listings output */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium select-none border border-dashed border-slate-100">
              No planned citizen assemblies matched your active criteria filters.
            </div>
          ) : (
            filteredMeetings.map((meeting) => {
              const ratio = Math.round((meeting.participants / (meeting.targetCount || 1)) * 100);

              return (
                <div 
                  key={meeting.id}
                  className="p-4 border border-slate-100 hover:border-[#1a423126] hover:shadow-xs transition-all bg-slate-50/25 hover:bg-slate-50 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    
                    {/* Status header */}
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-wider uppercase border ${
                        meeting.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                        meeting.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-805 border-indigo-100' :
                        meeting.status === 'Completed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-red-50 text-red-800 border-red-100'
                      }`}>
                        {meeting.status}
                      </span>
                      
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">System ID: {meeting.id}</span>
                      <span className="text-[9px] text-slate-400">•</span>
                      <span className="text-[9px] text-[#1a4231] font-bold uppercase">{meeting.sector}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{meeting.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-light">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Site Site: <strong>{meeting.location}</strong></span>
                      </p>
                    </div>

                  </div>

                  {/* Targets bar */}
                  <div className="md:w-48 space-y-1 shrink-0">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Target progress</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[#1a42310c] h-1.5 rounded-xs overflow-hidden shrink-0">
                        <div className="bg-[#1a4231] h-full" style={{ width: `${ratio}%` }}></div>
                      </div>
                      <span className="text-[11px] font-bold font-mono text-slate-600">{meeting.participants}/{meeting.targetCount} ({ratio}%)</span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-400 block tracking-tight">{meeting.date} at {meeting.time}</span>
                  </div>

                  {/* Actions switcher */}
                  <div className="flex items-center justify-end gap-1 shrink-0 pt-2 md:pt-0 border-t border-slate-100 md:border-none">
                    {meeting.status !== 'Ongoing' && meeting.status !== 'Completed' && (
                      <button
                        onClick={() => onUpdateMeetingStatus(meeting.id, 'Ongoing')}
                        className="py-1 px-2 bg-white border border-[#10b98133] hover:bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-colors"
                        title="Commence active assembly citizen check-in"
                      >
                        Activate Check-in
                      </button>
                    )}

                    {meeting.status === 'Ongoing' && (
                      <>
                        <button
                          onClick={() => openCheckIn(meeting.id)}
                          className="py-1 px-2 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-colors flex items-center gap-1"
                          title="Record attendee check-in"
                        >
                          <Check className="w-3 h-3" /> Check In
                        </button>
                        {isSecretary && onNavigateToView && (
                          <button
                            onClick={() => onNavigateToView('Citizen Issues')}
                            className="py-1 px-2 bg-white border border-amber-200 hover:bg-amber-50 text-amber-800 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-colors"
                            title="Register a citizen issue raised during this meeting"
                          >
                            Log Issue
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateMeetingStatus(meeting.id, 'Completed')}
                          className="py-1 px-2 bg-[#1a4231] text-white hover:bg-slate-800 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-colors"
                          title="Audit citizen list and archive file"
                        >
                          Archive Complete
                        </button>
                      </>
                    )}

                    {meeting.status !== 'Postponed' && meeting.status !== 'Completed' && (
                      <button
                        onClick={() => onUpdateMeetingStatus(meeting.id, 'Postponed')}
                        className="py-1 px-2.5 bg-white border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-800 text-[10px] font-semibold uppercase rounded-sm cursor-pointer"
                        title="Postpone assembly file"
                      >
                        Postpone
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
    </>
  );
};
