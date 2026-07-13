/**
 * Central API client. All requests go to the Spring Boot backend.
 */

const BASE_URL = 'http://localhost:8080/api/v1';

// Retrieve auth token from localStorage (set on login if backend auth is wired)
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('inteko_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Called when any API response is 401 — clears stale session
// Does NOT reload the page — lets React re-render naturally based on localStorage state
function handleUnauthorized(): void {
  localStorage.removeItem('inteko_jwt_token');
  localStorage.removeItem('inteko_auth_state');
  localStorage.removeItem('inteko_current_user');
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: getAuthHeaders() });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Session expired. Please log in again.'); }
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
  if (res.status === 401) { handleUnauthorized(); throw new Error('Session expired. Please log in again.'); }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errText || path}`);
  }
  const json = await res.json();
  return json.data as T;
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Session expired. Please log in again.'); }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errText || path}`);
  }
  const json = await res.json();
  return json.data as T;
}

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

export const updateMeetingStatus = (dbId: number, status: string): Promise<MeetingApiResponse> =>
  patch<MeetingApiResponse>(`/meetings/${dbId}/status?status=${status}`);

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

// --- Issues ---

export interface IssueApiResponse {
  id: number;
  issueCode: string;
  title: string;
  category: string;   // e.g. "Infrastructure"
  status: string;     // e.g. "Active", "Resolved", "Processing"
  reporterName: string;
  createdAt: string;
}

export const fetchIssues = (): Promise<IssueApiResponse[]> =>
  get<IssueApiResponse[]>('/issues');

// Create a new issue (POST /issues — public, no auth required per SecurityConfig)
export interface CreateIssuePayload {
  title: string;
  description?: string;
  category: string;
  priority?: string;
  reporterName: string;
  reporterPhone?: string;
  reporterIdNumber?: string;
  sectorId?: number;
}

export const createIssue = (payload: CreateIssuePayload): Promise<IssueApiResponse> =>
  post<IssueApiResponse>('/issues', payload);

// Resolve an issue (PATCH /issues/{id}/resolve — SECTOR_OFFICIAL only)
export const resolveIssue = (issueId: number): Promise<IssueApiResponse> =>
  patch<IssueApiResponse>(`/issues/${issueId}/resolve`);

// --- Resolutions ---

export interface ResolutionActionItem {
  id: number;
  itemLabel: string;
  isCompleted: boolean;
  displayOrder: number;
}

export interface ResolutionComment {
  id: number;
  commentText: string;
  authorName: string;
  createdAt: string;
}

export interface ResolutionApiResponse {
  id: number;
  resolutionCode: string;
  title: string;
  summary: string;
  assignedUnit: string;
  responsibleOfficer: string;
  status: string;         // "Active" | "Concluded"
  progressPercentage: number;
  dueDate: string;
  createdAt: string;
  actionItems: ResolutionActionItem[];
  comments: ResolutionComment[];
}

export const fetchResolutions = (): Promise<ResolutionApiResponse[]> =>
  get<ResolutionApiResponse[]>('/resolutions');

// --- Notifications ---

export interface NotificationApiResponse {
  id: number;
  title: string;
  message: string;
  category: string;   // "Meeting" | "Issue" | "Resolution" | "System"
  isRead: boolean;
  actionLabel?: string;
  createdAt: string;
}

export const fetchNotifications = (): Promise<NotificationApiResponse[]> =>
  get<NotificationApiResponse[]>('/notifications');

// --- Resolution actions ---

export const concludeResolution = (dbId: number): Promise<void> =>
  patch<void>(`/resolutions/${dbId}/conclude`);

export const toggleResolutionActionItem = (resolutionDbId: number, itemDbId: number): Promise<void> =>
  patch<void>(`/resolutions/${resolutionDbId}/action-item/${itemDbId}/toggle`);

export const addResolutionComment = (resolutionDbId: number, commentText: string): Promise<void> =>
  post<void>(`/resolutions/${resolutionDbId}/comments?commentText=${encodeURIComponent(commentText)}`, null);

// --- Documents ---

export interface DocumentApiResponse {
  id: number;
  documentCode: string;
  title: string;
  description: string;
  category: string;
  fileSize: number;
  fileName: string;
  createdAt: string;
}

export const fetchDocuments = (): Promise<DocumentApiResponse[]> =>
  get<DocumentApiResponse[]>('/documents');

// --- Users ---

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  idNumber: string;
  phone: string;
  position: string;
  role: string;       // "ADMINISTRATOR" | "SECTOR_OFFICIAL" | "MEETING_SECRETARY"
  permissions: string;
  sectorId?: number;
}

export interface UserApiResponse {
  id: number;
  userCode: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export const createUser = (payload: CreateUserPayload): Promise<UserApiResponse> =>
  post<UserApiResponse>('/users', payload);

export const fetchUsers = (): Promise<UserApiResponse[]> =>
  get<UserApiResponse[]>('/users');
