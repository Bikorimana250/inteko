/**
 * Central API client. All requests go to the Spring Boot backend.
 */

const BASE_URL = 'http://localhost:8080/api/v1';

// Retrieve auth token from localStorage (set on login if backend auth is wired)
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('inteko_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  const json = await res.json();
  return json.data as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errText || path}`);
  }
  const json = await res.json();
  return json.data as T;
}

// --- Attendance Summary ---

export interface CellRankingItem {
  cellName: string;
  meetingCount: number;
  attendanceRate: number;
}

export interface MeetingAttendanceItem {
  meetingId: string;
  title: string;
  sectorName: string;
  participants: number;
  targetCount: number;
  attendanceRate: number;
  status: string;
}

export interface AttendanceSummaryData {
  totalParticipants: number;
  attendanceRate: number;
  topCellRankings: CellRankingItem[];
  meetingAttendances: MeetingAttendanceItem[];
}

export const fetchAttendanceSummary = (): Promise<AttendanceSummaryData> =>
  get<AttendanceSummaryData>('/attendance/summary');

// --- Sectors ---

export interface SectorItem {
  id: number;
  name: string;
  sectorCode: string;
}

export const fetchSectors = (): Promise<SectorItem[]> =>
  get<SectorItem[]>('/geography/sectors');

// --- Meetings ---

export interface MeetingApiResponse {
  id: number;             // DB primary key
  meetingCode: string;    // e.g. "MTG-2024-001"
  title: string;
  meetingDate: string;    // "2024-10-28"
  meetingTime: string;    // "09:00:00"
  location: string;
  status: string;
  participantsCount: number;
  targetCount: number;
  sectorName: string;
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  meetingDate: string;   // ISO date "YYYY-MM-DD"
  meetingTime: string;   // "HH:MM:SS"
  location: string;
  targetCount: number;
  sectorId: number;
}

export const fetchMeetings = (): Promise<MeetingApiResponse[]> =>
  get<MeetingApiResponse[]>('/meetings');

export const createMeeting = (payload: CreateMeetingPayload): Promise<MeetingApiResponse> =>
  post<MeetingApiResponse>('/meetings', payload);

// --- Participant check-in ---

export interface CheckInPayload {
  participantName: string;
  idNumber?: string;
  phone?: string;
}

export const checkInParticipant = async (meetingId: string | number, payload: CheckInPayload): Promise<void> => {
  const res = await fetch(`${BASE_URL}/meetings/${meetingId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Check-in failed: ${res.status}`);
};
