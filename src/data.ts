/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Meeting, CivilCell, SystemNotification, CitizenIssue } from './types';

// Standard Avatars for clean high-fidelity UI
export const AVATARS = {
  admin: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkhc0yOrm9nqcYwqUI7fouSgvqbMaFyqvBpZeFTV7Wvw1OYgvJPPz-FCC1CqKPhSAtmqxbvbClEWNX2_ABCHkCNBtTFtZvRUGcfEn9TKWs-gqFdHOWxzseRBlhq7Cjqppj5MfxlQzISHvNuYxq_M-XrKhac3gnI2RTZkZm2wD3pdgH0vYenId8faiLLEJnEiosQl35E-PiLoxZHfcPkQpJKQ58KOpJJPPq8hn38uOTFJ-WfZuW3zU99OO_-Grr6FYuQYa_siS4ZwSc',
  official: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwBmfzQA-RylA-ZQ9z5ENtQBLrOZRRMwJd1QdvF3kX3ks0ZunffU1YmZ2mwLJ4yVv3hL4pWNFFOSMUMS0pdcYdpSVtsGBPbbPSXNnnhX7j1pBLO3mcmJSp1nyjOlUdxFsiCzj7GTyLoCCsKsIiU1iEY8zNhYFUZEdN3bIohj24bLfNmbjpcqwQlxpMVDyvSCwaUeW9OpJD1XV-wIIv3JChN9QfcgPqBoLdX32yghE_aKFQRPIlC2540IILbKrKdRFqQFgs7YzfFjmq',
  secretary: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqY5Otx4gPQWj4uO8YGZw2xgnzW3Au_KHXOWDpJgRVjoR5ghzqMrDU8o8_BvtFd4BOFcpK0M-8nc_uoDwE5YOEffETO3X6uMl10LB7gTtiMGPBDQFjPDckqy_3Iqs2WD-4VnvmtCOWzZNZm1gmSHTtuqLC9hDU4-hMKx9M2ADIggPkkgwCt0qSjlPr7kNmezEAoL0lCR4zXmdoKwMRywiclDrZnuY7BsAbaUbEAKRL7PyI2R1iUkM2LOvz2P6GswXm9QFeBWMFxPYm',
  general: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY-06EXqf3ItMxSNCb_OioUtqcxonJIU__cXiV2BQEUosxtEVyBNyplIr5kThe2H5hzp6yFpaipWMKzjg4m5Ftbz5_qGSZv7QABZPrXcFzzPX0L6C5OAjhoDi0JtY7D2xvUOsvBMEF3Ke0isTViK767L3EN6KhWXddU_THC9aNn1S4HDh61k6EyMlwPt1qQDLbW0zMbip8Jh7ll_aRLo-EGHF55HL96Dvg_lasxzM89g32A5uIe9BorKRG_u0r216ZqbQk_ohJVFuY'
};

// Initial system users
export const INITIAL_USERS: User[] = [
  {
    id: 'U-001',
    name: 'Jean Paul Uwimana',
    email: 'jp.uwimana@kinyinya.gov.rw',
    role: 'Sector Official',
    status: 'Active',
    sector: 'Kinyinya',
    cell: 'Kamukina',
    village: 'Agatare',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    idNumber: '1198780012345679',
    phone: '+250 788 234 567',
    position: 'Sector Executive Secretary',
    lastActive: 'Today, 10:45 AM',
    permissions: 'Level 2 (Authorized)'
  },
  {
    id: 'U-002',
    name: 'Marie Uwera',
    email: 'm.uwera@kinyinya.gov.rw',
    role: 'Meeting Secretary',
    status: 'Active',
    sector: 'Kinyinya',
    cell: 'Kamukina',
    village: 'Agatare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    idNumber: '1198780012345682',
    phone: '+250 788 567 890',
    position: 'Meeting Secretary',
    lastActive: 'Today, 09:12 AM',
    permissions: 'Level 1 (Staff)'
  },
  {
    id: 'U-003',
    name: 'Admin System',
    email: 'admin@inteko.gov.rw',
    role: 'Administrator',
    status: 'Active',
    sector: 'HQ',
    cell: 'Kigali',
    village: 'Town',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    idNumber: '1198780012345678',
    phone: '+250 788 123 456',
    position: 'System Administrator',
    lastActive: 'Yesterday, 04:30 PM',
    permissions: 'Level 3 (Full Control)'
  },
  {
    id: 'U-004',
    name: 'Claudine Mukasine',
    email: 'c.mukasine@remera.gov.rw',
    role: 'Sector Official',
    status: 'Active',
    sector: 'Remera',
    cell: 'Rukiri I',
    village: 'Ubumwe',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    idNumber: '1198780012345680',
    phone: '+250 788 345 678',
    position: 'Sector Executive Secretary',
    lastActive: 'Today, 11:30 AM',
    permissions: 'Level 2 (Authorized)'
  }
];

// Initial meetings list
export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: '#MTG-2023-089',
    title: 'UMUGANDA PLANNING WORKSHOP',
    date: 'Oct 24, 2023',
    time: '09:00 AM CAT',
    location: 'Kigali City Hall',
    status: 'Scheduled',
    participants: 1240,
    targetCount: 1500,
    sector: 'Kigali Sector'
  },
  {
    id: '#MTG-2023-087',
    title: 'LOCAL INFRASTRUCTURE REVIEW',
    date: 'Oct 23, 2023',
    time: 'Now Active',
    location: 'Gasabo District',
    status: 'Ongoing',
    participants: 850,
    targetCount: 1000,
    sector: 'Gasabo Sector'
  },
  {
    id: '#MTG-2023-081',
    title: 'EDUCATION REFORM CONSULTATION',
    date: 'Oct 20, 2023',
    time: 'Archived',
    location: 'Nyarugenge Sector',
    status: 'Completed',
    participants: 420,
    targetCount: 500,
    sector: 'Nyarugenge Sector'
  },
  {
    id: '#MTG-2023-076',
    title: 'COMMUNITY HEALTH INITIATIVE',
    date: 'TBD',
    time: 'Was Oct 18',
    location: 'Kicukiro Center',
    status: 'Postponed',
    participants: 0,
    targetCount: 800,
    sector: 'Kicukiro Sector'
  }
];

// Cells and Villages — matches V3__seed_data.sql geographic seed data
export const INITIAL_CELLS: CivilCell[] = [
  {
    id: 'C-001',
    name: 'Kamukina Cell',
    sector: 'Kinyinya',
    villages: [
      { id: 'V-001', name: 'Agatare', cellId: 'C-001', leader: 'Jean Baptiste Mukama', population: 450, leaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: 'V-002', name: 'Kabuye', cellId: 'C-001', leader: 'Marie Claire Uwera', population: 520, leaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { id: 'V-003', name: 'Rugarama', cellId: 'C-001', leader: 'Emmanuel Niyonzima', population: 380, leaderAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' }
    ]
  },
  {
    id: 'C-002',
    name: 'Nyagahinga Cell',
    sector: 'Kinyinya',
    villages: [
      { id: 'V-004', name: 'Gahanga', cellId: 'C-002', leader: 'Grace Mukeshimana', population: 410, leaderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
      { id: 'V-005', name: 'Kimisagara', cellId: 'C-002', leader: 'Patrick Habimana', population: 495, leaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
    ]
  },
  {
    id: 'C-003',
    name: 'Rukiri Cell',
    sector: 'Kinyinya',
    villages: [
      { id: 'V-006', name: 'Nyamirambo', cellId: 'C-003', leader: 'Alice Uwimana', population: 560, leaderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
      { id: 'V-007', name: 'Kabeza', cellId: 'C-003', leader: 'Joseph Kalisa', population: 430, leaderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
    ]
  },
  {
    id: 'C-004',
    name: 'Nyabisindu Cell',
    sector: 'Remera',
    villages: [
      { id: 'V-008', name: 'Kacyiru', cellId: 'C-004', leader: 'Christine Mukamazimpaka', population: 620, leaderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
      { id: 'V-009', name: 'Kimihurura', cellId: 'C-004', leader: 'David Mugisha', population: 580, leaderAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100' }
    ]
  },
  {
    id: 'C-005',
    name: 'Kisimenti Cell',
    sector: 'Remera',
    villages: [
      { id: 'V-010', name: 'Gikondo', cellId: 'C-005', leader: 'Sarah Uwamahoro', population: 490, leaderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' }
    ]
  },
  {
    id: 'C-006',
    name: 'Kibagabaga Cell',
    sector: 'Kimironko',
    villages: []
  },
  {
    id: 'C-007',
    name: 'Bibare Cell',
    sector: 'Kimironko',
    villages: []
  }
];

// Initial notifications system list
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'N-01',
    title: 'Upcoming: Rubavu Sector Meeting in 2 hours',
    message: 'The monthly coordination meeting for forestry officials in Rubavu sector is starting soon. Location: Sector Hall A.',
    category: 'Meeting',
    time: '10:45 AM',
    unread: true,
    actionLabel: 'View Details'
  },
  {
    id: 'N-02',
    title: 'New update on Issue #ISS-2023-142',
    message: 'Senior Forester Jean Paul commented on the land encroachment report in the Virunga buffer zone.',
    category: 'Issue',
    time: '08:12 AM',
    unread: true,
    actionLabel: 'Review Comment'
  },
  {
    id: 'N-03',
    title: 'Resolution #RES-005 is overdue',
    message: "The deadline for the 'Seedling Distribution Audit' resolution has passed. Immediate action is required for compliance.",
    category: 'Resolution',
    time: 'Yesterday, 4:30 PM',
    unread: false,
    actionLabel: 'Escalate Issue'
  },
  {
    id: 'N-04',
    title: 'Weekly System Report Generated',
    message: 'The comprehensive dashboard performance report for the past week is now available for download.',
    category: 'System',
    time: 'Yesterday, 9:00 AM',
    unread: false,
    actionLabel: 'Download PDF'
  },
  {
    id: 'N-05',
    title: 'Resolution #RES-012 Marked as Completed',
    message: 'The reforestation initiative in Gishwati Forest has been finalized and verified by the local council.',
    category: 'Resolution',
    time: 'Oct 24, 2023',
    unread: false
  }
];

// Active issues distribution on the dashboard state
export const INITIAL_ISSUES: CitizenIssue[] = [
  { id: 'I-01', title: 'Road repair requests in Kacyiru', category: 'Infrastructure', status: 'Processing', reporter: 'Kamanzi Michel', time: '2 mins ago' },
  { id: 'I-02', title: 'Land dispute boundary conflict', category: 'Land', status: 'Active', reporter: 'Uwase Alice', time: '14 mins ago' },
  { id: 'I-03', title: 'Clean water point breakdown cell sum', category: 'Infrastructure', status: 'Processing', reporter: 'Automated Bot', time: '1 hour ago' },
  { id: 'I-04', title: 'Irrigation equipment missing funding', category: 'Economic', status: 'Resolved', reporter: 'Rulinda Noel', time: '2 hours ago' }
];
