/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Administrator' | 'Sector Official' | 'Meeting Secretary';

export interface User {
  id: string; // e.g., "U-001"
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  sector: string;
  cell: string;
  village: string;
  avatar: string;
  idNumber: string; // 16 digits
  phone: string; // +250 788 ...
  position: string; // e.g., "Cell Executive Secretary"
  lastActive: string;
  permissions: string;
}

export interface Meeting {
  id: string; // e.g., "#MTG-2023-089"
  dbId?: number; // numeric DB primary key, populated when loaded from backend
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Postponed';
  participants: number;
  targetCount: number;
  sector: string;
}

export interface Village {
  id: string;
  name: string;
  cellId: string;
  leader: string;
  population: number;
  leaderAvatar: string;
}

export interface CivilCell {
  id: string;
  name: string;
  sector: string;
  villages: Village[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: 'Meeting' | 'Issue' | 'Resolution' | 'System';
  time: string;
  unread: boolean;
  actionLabel?: string;
}

export interface CitizenIssue {
  id: string;
  dbId?: number; // numeric DB primary key, populated when loaded from backend
  title: string;
  category: 'Infrastructure' | 'Governance' | 'Social' | 'Economic' | 'Land';
  status: 'Active' | 'Resolved' | 'Processing' | 'Success';
  reporter: string;
  time: string;
}
