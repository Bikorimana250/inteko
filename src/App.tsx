/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Calendar, AlertTriangle, FileText, CheckSquare, 
  Bell, LogOut, Search, ChevronDown, Shield, Menu, X, HelpCircle, 
  Layers, Lock, Sparkles, ShieldCheck, Check, Info, FileSpreadsheet, KeyRound,
  Download
} from 'lucide-react';

import { User, Meeting, CivilCell, SystemNotification, CitizenIssue, UserRole } from './types';
import { 
  INITIAL_USERS, INITIAL_MEETINGS, INITIAL_CELLS, 
  INITIAL_NOTIFICATIONS, INITIAL_ISSUES, AVATARS 
} from './data';

// import sub-views
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { ManageUsersView } from './components/ManageUsersView';
import { CreateUserView } from './components/CreateUserView';
import { EditUserView } from './components/EditUserView';
import { CellsVillagesView } from './components/CellsVillagesView';
import { ReportsAnalyticsView } from './components/ReportsAnalyticsView';
import { NotificationCenterView } from './components/NotificationCenterView';
import { AttendanceSummaryView } from './components/AttendanceSummaryView';
import { MeetingListView } from './components/MeetingListView';
import { IssueTrackingView } from './components/IssueTrackingView';
import { EditIssueView } from './components/EditIssueView';
import { ResolutionTrackingView } from './components/ResolutionTrackingView';
import { ResolutionDetailsView } from './components/ResolutionDetailsView';
import { SectorOfficialDashboardView } from './components/SectorOfficialDashboardView';
import { DocumentLibraryView } from './components/DocumentLibraryView';

export default function App() {
  // 1. Core Reactive States backed by LocalStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('inteko_auth_state') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<Partial<User>>(() => {
    const saved = localStorage.getItem('inteko_current_user');
    return saved ? JSON.parse(saved) : {};
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('inteko_users_registry');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('inteko_meetings_registry');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [cells, setCells] = useState<CivilCell[]>(() => {
    const saved = localStorage.getItem('inteko_cells_registry');
    return saved ? JSON.parse(saved) : INITIAL_CELLS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('inteko_notifications_registry');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [issues, setIssues] = useState<CitizenIssue[]>(() => {
    const saved = localStorage.getItem('inteko_issues_registry');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [resolutions, setResolutions] = useState<any[]>(() => {
    const saved = localStorage.getItem('inteko_resolutions_registry');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'RES-012',
        title: 'Seedling Reforestation Directive',
        summary: 'Concluded audit parameters across Kacyiru and Gishwati territories, successfully distributing 45,000 pine seedlings to local farmers to optimize reforestation parameters.',
        status: 'Concluded',
        progress: 100,
        linkedIssueId: 'I-04',
        linkedIssueTitle: 'Irrigation equipment missing funding',
        assignedUnit: 'Environmental & Forestry Unit',
        dueDate: 'Oct 24, 2023',
        dateCreated: 'Oct 12, 2023',
        responsibleOfficer: 'Jean Damascene M.',
        actionItems: [
          { label: 'Confirm seedling logistics with cell forestry operators', checked: true },
          { label: 'Map physical seedling layout boundaries', checked: true },
          { label: 'Distribute 45,000 pine seedlings securely', checked: true }
        ],
        comments: [
          { author: 'Marie-Rose Mutoni', role: 'Meeting Secretary', text: 'Completed distributing all Q3 pine seedlings to village elders.', time: 'Today, 09:12 AM' }
        ],
        supportingDocuments: ['Seedling Distribution Audit.pdf']
      },
      {
        id: 'RES-005',
        title: 'Local Security Patrol Funding',
        summary: 'Pending physical verification logs by regional executive board secretaries. Security levy parameters require additional resident consensus audits to authorize patrol funding.',
        status: 'Active',
        progress: 60,
        linkedIssueId: 'I-02',
        linkedIssueTitle: 'Land dispute boundary conflict',
        assignedUnit: 'Security Oversight Unit',
        dueDate: 'Nov 15, 2023',
        dateCreated: 'Oct 18, 2023',
        responsibleOfficer: 'Jean-Claude Kabera',
        actionItems: [
          { label: 'Confirm security levy amounts with cell officials', checked: true },
          { label: 'Audit security patrol schedules with police marshals', checked: false },
          { label: 'Review final patrol reports at assembly', checked: false }
        ],
        comments: [
          { author: 'Jean-Claude Kabera', role: 'Sector Official', text: 'Allocated 2.1M RWF from community development reserves.', time: 'Yesterday, 04:30 PM' }
        ],
        supportingDocuments: ['Security Patrol Levies Draft.pdf', 'Patrol Schedules.pdf']
      }
    ];
  });

  // Navigation state values
  const [currentView, setCurrentView] = useState<string>(() => {
    const savedUser = localStorage.getItem('inteko_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role === 'Meeting Secretary') return 'Meeting List';
    }
    return 'Dashboard';
  });
  const [selectedUserIdToEdit, setSelectedUserIdToEdit] = useState<string | null>(null);
  const [selectedIssueIdToEdit, setSelectedIssueIdToEdit] = useState<string | null>(null);
  const [selectedResolutionId, setSelectedResolutionId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('inteko_auth_state', String(isAuthenticated));
    localStorage.setItem('inteko_current_user', JSON.stringify(currentUser));
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    localStorage.setItem('inteko_users_registry', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('inteko_meetings_registry', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('inteko_cells_registry', JSON.stringify(cells));
  }, [cells]);

  useEffect(() => {
    localStorage.setItem('inteko_notifications_registry', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('inteko_issues_registry', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('inteko_resolutions_registry', JSON.stringify(resolutions));
  }, [resolutions]);

  // Auth controllers
  const handleLogin = (userMatched: Partial<User>) => {
    setCurrentUser(userMatched);
    setIsAuthenticated(true);
    if (userMatched.role === 'Meeting Secretary') {
      setCurrentView('Meeting List');
    } else {
      setCurrentView('Dashboard');
    }
    setGlobalSearchQuery('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({});
    setShowProfileDropdown(false);
    localStorage.removeItem('inteko_auth_state');
    localStorage.removeItem('inteko_current_user');
  };

  // Direct user modifications
  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u, 
      status: u.status === 'Active' ? 'Inactive' : 'Active',
      lastActive: 'Just now'
    } : u));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(`Revoke security credentials and delete administrative user account file permanently?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleTriggerEdit = (userId: string) => {
    setSelectedUserIdToEdit(userId);
    setCurrentView('Edit User');
  };

  const handleUpdateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData, lastActive: 'Just now' } : u));
    alert('User administrative file modified and committed to the security database successfully!');
    setCurrentView('User Management');
    setSelectedUserIdToEdit(null);
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'avatar' | 'lastActive'>) => {
    const nextId = `U-0${users.length + 1}`;
    const newUser: User = {
      ...userData,
      id: nextId,
      avatar: AVATARS.general,
      lastActive: 'Never logged in'
    };
    setUsers(prev => [...prev, newUser]);
    alert(`Success! Committed new staff account: ${newUser.name} assigned with system ID ${newUser.id}`);
    setCurrentView('User Management');
  };

  const handleAddSimulatedVillage = (cellId: string) => {
    setCells(prev => prev.map(cell => {
      if (cell.id === cellId) {
        const nextIdx = cell.villages.length + 1;
        const newVill: any = {
          id: `V-0${nextIdx + cell.villages.length}`,
          name: `Village Alpha-${nextIdx}`,
          cellId,
          leader: 'Simulated community elder',
          population: Math.floor(Math.random() * 500) + 800,
          leaderAvatar: AVATARS.general
        };
        return {
          ...cell,
          villages: [...cell.villages, newVill]
        };
      }
      return cell;
    }));
  };

  const handleAddLiveIssue = () => {
    const names = ['Kamanzi Michel', 'Uwase Alice', 'Rulinda Noel', 'Ntaganda Paul', 'Mucyo Claudine'];
    const titles = [
      'Clean water point pipeline maintenance Request',
      'Erosion buffer zone community dispute',
      'Umuganda seed collection request',
      'Localized trail boundary overlap'
    ];
    const categories = ['Infrastructure', 'Land', 'Economic', 'Governance'] as const;

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];

    const newIssue: CitizenIssue = {
      id: `I-${Date.now().toString().slice(-4)}`,
      title: randomTitle,
      category: randomCat,
      status: 'Active',
      reporter: randomName,
      time: 'Just now'
    };

    setIssues(prev => [newIssue, ...prev]);

    // Also trigger system notification
    const newNotif: SystemNotification = {
      id: `N-${Date.now().toString().slice(-3)}`,
      title: `Simulated: New Claim registered`,
      message: `Citizen ${randomName} filed a regional claim ticket: "${randomTitle}" in cell sector coordinates.`,
      category: 'Issue',
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddSimulatedMeeting = (meetingData: Omit<Meeting, 'id' | 'participants'>) => {
    const nextId = `#MTG-2023-0${meetings.length + 90}`;
    const newMtg: Meeting = {
      ...meetingData,
      id: nextId,
      participants: 0
    };
    setMeetings(prev => [newMtg, ...prev]);
    alert(`Committed new community assembly: '${newMtg.title}' successfully.`);
  };

  const handleUpdateMeetingStatus = (meetingId: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Postponed') => {
    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        // If transitioning to Completed, simulate random participants count
        const pts = status === 'Completed' ? Math.floor(m.targetCount * (0.75 + Math.random() * 0.2)) : m.participants;
        return { ...m, status, participants: pts };
      }
      return m;
    }));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Role Checker Access boundaries
  const isAdmin = currentUser.role === 'Administrator';

  // Dynamic role-based sidebar items definition
  const getSidebarItems = () => {
    switch (currentUser.role) {
      case 'Administrator':
        return [
          { group: 'Main Administrative Gate', items: [{ view: 'Dashboard', label: 'System Dashboard', icon: Layers }] },
          { group: 'Staff Directory', items: [
              { view: 'User Management', label: 'Manage User Access', icon: Users },
              { view: 'Create User', label: 'Create User account', icon: ShieldCheck }
            ] 
          },
          { group: 'Jurisdictions', items: [{ view: 'Cells & Villages', label: 'Cells & Villages grid', icon: Building2 }] },
          { group: 'Analytics & Policy Library', items: [
              { view: 'Notifications', label: 'Portal Notification Center', icon: Bell },
              { view: 'Reports & Analytics', label: 'National Performance reports', icon: Layers },
              { view: 'Documents', label: 'Document Library', icon: FileText },
              { view: 'Settings', label: 'System Settings', icon: Building2 }
            ] 
          }
        ];
      
      case 'Sector Official':
        return [
          { group: 'Main Administrative Gate', items: [{ view: 'Dashboard', label: 'Sector Official Dashboard', icon: Layers }] },
          { group: 'Assembly management', items: [
              { view: 'Meeting List', label: 'Meetings Calendar list', icon: Calendar },
              { view: 'Attendance Summary', label: 'Attendance Summary', icon: Users }
            ] 
          },
          { group: 'Citizen tracking queue', items: [
              { view: 'Citizen Issues', label: 'Issue Tracking', icon: AlertTriangle },
              { view: 'Resolutions', label: 'Resolution Tracking', icon: FileText }
            ] 
          },
          { group: 'Analytics & Policy Library', items: [
              { view: 'Notifications', label: 'Portal Notification Center', icon: Bell },
              { view: 'Reports & Analytics', label: 'National Performance reports', icon: Layers },
              { view: 'Documents', label: 'Document Library', icon: FileText },
              { view: 'Settings', label: 'System Settings', icon: Building2 }
            ] 
          }
        ];

      case 'Meeting Secretary':
        return [
          { group: 'Assembly management', items: [
              { view: 'Meeting List', label: 'Meetings Calendar list', icon: Calendar },
              { view: 'Attendance Summary', label: 'Attendance Summary', icon: Users }
            ] 
          },
          { group: 'Citizen tracking queue', items: [
              { view: 'Citizen Issues', label: 'Issue Tracking', icon: AlertTriangle },
              { view: 'Resolutions', label: 'Resolution Tracking', icon: FileText }
            ] 
          },
          { group: 'Analytics & Policy Library', items: [
              { view: 'Notifications', label: 'Portal Notification Center', icon: Bell },
              { view: 'Documents', label: 'Document Library', icon: FileText }
            ] 
          }
        ];

      default:
        return [];
    }
  };

  // Rendering matching views
  const renderActiveView = () => {
    // Standard Global Search Filter wrapper context for lists depending on active section:
    const query = globalSearchQuery.trim().toLowerCase();

    switch (currentView) {
      case 'Dashboard':
        if (currentUser.role === 'Sector Official') {
          return (
            <SectorOfficialDashboardView
              currentUser={currentUser}
              users={users}
              meetings={meetings}
              issues={issues}
              resolutions={resolutions}
              onNavigateToView={(view) => setCurrentView(view)}
              onApproveQuickResolution={(resId) => {
                setResolutions(prev => prev.map(r => r.id === resId ? { ...r, status: 'Concluded', progress: 100 } : r));
              }}
            />
          );
        }
        return (
          <DashboardView
            currentUser={currentUser}
            users={users}
            meetings={meetings}
            issues={issues}
            onCreateMeetingTrigger={() => {
              setCurrentView('Meeting List');
              setShowProfileDropdown(false);
            }}
            onCreateUserTrigger={() => {
              if (!isAdmin) {
                alert('Access restricted. Only system Administrators are authorized to initialize staff directory profiles.');
                return;
              }
              setCurrentView('Create User');
            }}
            onNavigateToView={(view) => setCurrentView(view)}
            onAddSimulatedIssue={() => {
              handleAddLiveIssue();
            }}
          />
        );

      case 'User Management':
        if (!isAdmin) {
          return (
            <div className="bg-white p-8 rounded-sm ring-1 ring-amber-200 border-l-[4px] border-amber-600 shadow-sm max-w-2xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Security Privilege Access Restriction</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    You are currently authenticated representing the <strong className="text-slate-700">{currentUser.role}</strong> credential group. Active directory adjustments, personnel deactivations, and staff creations require <strong>Level 3 (Administrator)</strong> ERP clearance.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button 
                  onClick={() => handleLogin(users.find(u => u.role === 'Administrator') || users[2])}
                  className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase rounded-sm cursor-pointer border border-slate-200"
                >
                  Assume Admin Clearance (Developer Key)
                </button>
                <button 
                  onClick={() => setCurrentView('Dashboard')}
                  className="py-1 px-3 bg-[#1a4231] text-white hover:bg-slate-800 font-bold text-[10px] uppercase rounded-sm cursor-pointer"
                >
                  Return safely
                </button>
              </div>
            </div>
          );
        }

        // Apply searching locally
        const searchedUsers = query 
          ? users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query) || u.phone.includes(query))
          : users;

        return (
          <ManageUsersView
            users={searchedUsers}
            onToggleStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
            onTriggerEdit={handleTriggerEdit}
            onTriggerCreate={() => setCurrentView('Create User')}
          />
        );

      case 'Create User':
        if (!isAdmin) {
          setCurrentView('User Management');
          return null;
        }
        return (
          <CreateUserView
            onCancel={() => setCurrentView('User Management')}
            onSaveUser={handleSaveUser}
          />
        );

      case 'Edit User':
        const targetUserToEdit = users.find(u => u.id === selectedUserIdToEdit);
        return (
          <EditUserView
            userToEdit={targetUserToEdit}
            onCancel={() => {
              setCurrentView('User Management');
              setSelectedUserIdToEdit(null);
            }}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'Cells & Villages':
        return (
          <CellsVillagesView
            cells={cells}
            onAddSimulatedVillage={handleAddSimulatedVillage}
          />
        );

      case 'Meeting List':
        const searchedMeetings = query
          ? meetings.filter(m => m.title.toLowerCase().includes(query) || m.id.toLowerCase().includes(query) || m.location.toLowerCase().includes(query))
          : meetings;

        return (
          <MeetingListView
            meetings={searchedMeetings}
            onAddSimulatedMeeting={handleAddSimulatedMeeting}
            onUpdateMeetingStatus={handleUpdateMeetingStatus}
          />
        );

      case 'Attendance Summary':
        return (
          <AttendanceSummaryView
            meetings={meetings}
          />
        );

      case 'Notifications':
        const searchedNotifs = query
          ? notifications.filter(n => n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query))
          : notifications;

        return (
          <NotificationCenterView
            notifications={searchedNotifs}
            onMarkRead={handleMarkRead}
            onClearNotification={handleClearNotification}
            onMarkAllRead={handleMarkAllRead}
          />
        );

      case 'Reports & Analytics':
        return (
          <ReportsAnalyticsView
            currentUser={currentUser}
          />
        );

      // High-fidelity integrated modules
      case 'Citizen Issues':
        return (
          <IssueTrackingView
            currentUser={currentUser}
            issues={issues}
            onTriggerEditIssue={(issueId) => {
              setSelectedIssueIdToEdit(issueId);
              setCurrentView('Edit Issue');
            }}
            onTriggerViewIssue={(issueId) => {
              alert(`Selected Issue Reference ID: ${issueId}. Accessing standard system files...`);
            }}
            onNavigateToView={(view) => setCurrentView(view)}
          />
        );

      case 'Edit Issue':
        const targetIssueToEdit = issues.find(i => i.id === selectedIssueIdToEdit);
        return (
          <EditIssueView
            issueToEdit={targetIssueToEdit}
            onCancel={() => {
              setCurrentView('Citizen Issues');
              setSelectedIssueIdToEdit(null);
            }}
            onUpdateIssueToState={(issueId, updatedFields) => {
              setIssues(prev => prev.map(i => i.id === issueId ? { ...i, ...updatedFields } : i));
              alert('Administrative issue files successfully updated in regional records.');
              setCurrentView('Citizen Issues');
              setSelectedIssueIdToEdit(null);
            }}
          />
        );

      case 'Resolutions':
        return (
          <ResolutionTrackingView
            currentUser={currentUser}
            resolutions={resolutions}
            onTriggerViewDetails={(resId) => {
              setSelectedResolutionId(resId);
              setCurrentView('Resolution Details');
            }}
            onNavigateToView={(view) => setCurrentView(view)}
          />
        );

      case 'Resolution Details':
        const currentRes = resolutions.find(r => r.id === selectedResolutionId);
        return (
          <ResolutionDetailsView
            currentUser={currentUser}
            resolution={currentRes}
            onBackToGrid={() => {
              setCurrentView('Resolutions');
              setSelectedResolutionId(null);
            }}
            onApproveAndClose={(resId) => {
              setResolutions(prev => prev.map(r => r.id === resId ? { ...r, status: 'Concluded', progress: 100 } : r));
            }}
            onAddComment={(resId, comment) => {
              setResolutions(prev => prev.map(r => r.id === resId ? {
                ...r,
                comments: [comment, ...(r.comments || [])]
              } : r));
            }}
            onToggleActionItem={(resId, itemIdx) => {
              setResolutions(prev => prev.map(r => {
                if (r.id === resId) {
                  const items = [...(r.actionItems || [])];
                  if (items[itemIdx]) {
                    items[itemIdx] = { ...items[itemIdx], checked: !items[itemIdx].checked };
                  }
                  const checkedCount = items.filter(i => i.checked).length;
                  const progressVal = Math.round((checkedCount / items.length) * 100);
                  return { ...r, actionItems: items, progress: progressVal };
                }
                return r;
              }));
            }}
          />
        );

      case 'Documents':
        return (
          <DocumentLibraryView currentUser={currentUser} />
        );

      case 'Settings':
        return (
          <div className="bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
            <div className="pb-2 border-b border-light">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Metadata Settings</h3>
              <p className="text-[10px] text-slate-400">Configure core administrative units, default target counts, and sync rates.</p>
            </div>

            <div className="max-w-xl text-xs space-y-3 font-sans opacity-90 select-none">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Regional Administrative District</label>
                <input type="text" disabled value="Kigali City Council District Zone" className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-sm font-semibold" />
              </div>
              
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Default citizen attendance targets</label>
                <input type="number" defaultValue={100} className="w-full px-3 py-1.5 border border-slate-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      default:
        return <DashboardView currentUser={currentUser} users={users} meetings={meetings} issues={issues} onCreateMeetingTrigger={() => setCurrentView('Meeting List')} onCreateUserTrigger={() => setCurrentView('Create User')} onNavigateToView={(view) => setCurrentView(view)} onAddSimulatedIssue={handleAddLiveIssue} />;
    }
  };

  // Render Login state check
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLogin} availableUsers={users} />;
  }

  // Active unread alerts badge
  const unreadAlertsCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex flex-col font-sans select-none antialiased text-[#1a4231]">
      
      {/* ----------------- TOP NAVBAR STANDARDIZATION ----------------- */}
      <header className="bg-[#1a4231] text-white h-16 shrink-0 flex items-center justify-between px-4 md:px-6 relative z-50 shadow-md border-b border-[#1a423126]">
        
        {/* LEFT SECTION: Standard system logo and name */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1 text-white hover:text-emerald-300 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1 px-1.5 bg-white/10 rounded-sm border border-white/5 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[8px] tracking-widest text-emerald-300 font-bold block uppercase leading-none">REPUBLIC OF RWANDA</span>
              <h1 className="text-xs md:text-sm font-black tracking-tight uppercase leading-snug">Inteko y'Abaturage</h1>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: Global Standardized Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-250">
            <Search className="w-4 h-4 text-emerald-300/80" />
          </span>
          <input
            type="text"
            placeholder={`Global Search system archives (active view filter)...`}
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/10 border border-white/10 rounded-sm focus:bg-white focus:text-[#1a4231] focus:outline-none focus:ring-1 focus:ring-[#1a4231] placeholder-emerald-200/50 transition-all text-white"
          />
        </div>

        {/* RIGHT SECTION: Notification details, counters and standard profile selection */}
        <div className="flex items-center gap-3">
          
          {/* Notification bell trigger */}
          <button
            onClick={() => setCurrentView('Notifications')}
            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm relative transition-all cursor-pointer"
            title="Notification Center updates"
          >
            <Bell className="w-4 h-4 text-white" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#10b981] text-white font-mono font-bold text-[8px] px-1 rounded-sm min-w-4 text-center ring-2 ring-[#1a4231]">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User parameters dropdown switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 py-1 px-2.5 rounded-sm transition-all focus:outline-none cursor-pointer"
            >
              <img 
                src={currentUser.avatar || AVATARS.admin} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className="w-6.5 h-6.5 rounded-full border border-white/15 object-cover"
              />
              <div className="text-left hidden lg:block">
                <p className="text-[10px] font-bold text-white leading-none truncate">{currentUser.name}</p>
                <span className="text-[8px] text-emerald-300 font-semibold uppercase tracking-wider block mt-0.5 leading-none">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#1a423126] text-[#1a4231] rounded-sm shadow-md overflow-hidden z-50 max-h-96">
                <div className="p-3 bg-[#1a423105] border-b border-light">
                  <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-[#1a4231] font-semibold tracking-wider uppercase mt-0.5">{currentUser.role} Credentials</p>
                  <p className="text-[8px] text-slate-400 font-mono mt-1 break-all">{currentUser.email}</p>
                </div>

                {/* Tester switch role shortcut */}
                <div className="p-1 bg-slate-50 border-b border-light">
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1">Quick-access tester override</p>
                  {users.map((item) => {
                    const isSelected = item.id === currentUser.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentUser(item);
                          setShowProfileDropdown(false);
                          setGlobalSearchQuery('');
                          if (item.role === 'Meeting Secretary') {
                            setCurrentView('Meeting List');
                          } else {
                            setCurrentView('Dashboard');
                          }
                        }}
                        className={`w-full px-2 py-1.5 text-left text-[11px] rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-[#1a42310d] font-bold text-[#1a4231]' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{item.name} • <span className="text-[9px] uppercase font-mono">{item.role.split(' ')[0]}</span></span>
                        {isSelected && <Check className="w-3 h-3 text-[#1a4231] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setCurrentView('Settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-[#1a423105] rounded-xs cursor-pointer"
                  >
                    Portal Configuration
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Conclude Authenticated Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* ----------------- CORE INTERFACE LAYOUT WITH FIXED SIDEBAR ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* FIXED UNIFIED SIDEBAR STANDARDIZATION */}
        <aside className={`bg-white border-r border-[#1a42311a] w-64 flex flex-col justify-between shrink-0 fixed inset-y-16 left-0 z-40 transition-transform md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 select-none">
            
            {/* Primary navigation loop */}
            <div className="space-y-4">
              {getSidebarItems().map((group, gIdx) => (
                <div key={gIdx} className="px-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold px-3">
                    {group.group}
                  </span>
                  <div className="space-y-1 mt-1.5">
                    {group.items.map((item) => {
                      const IconComp = item.icon;
                      const isActive = currentView === item.view || 
                        (item.view === 'User Management' && currentView === 'Edit User') ||
                        (item.view === 'Citizen Issues' && currentView === 'Edit Issue') ||
                        (item.view === 'Resolutions' && currentView === 'Resolution Details');

                      return (
                        <button
                          key={item.view}
                          onClick={() => {
                            setCurrentView(item.view);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 text-xs font-bold rounded-sm cursor-pointer transition-colors ${
                            isActive 
                              ? 'bg-[#1a423108] text-[#1a4231] font-extrabold border-l-[3px] border-[#1a4231] pl-[10px]' 
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <IconComp className="w-4 h-4 text-slate-500" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* User Signout footer lock */}
          <div className="p-3 border-t border-[#1a423111] bg-slate-50/50">
            <div className="flex gap-2 items-center mb-2 px-1 text-slate-600">
              <KeyRound className="w-3.5 h-3.5 text-[#1a4231]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">ERP Access: {currentUser.role?.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-1.5 bg-[#1a42310c] hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-[10px] uppercase tracking-wider rounded-sm transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Sign Out completely</span>
            </button>
          </div>

        </aside>

        {/* Dynamic Mobile Menu Backdrop overlay for smaller screens */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-30 pt-16"
          ></div>
        )}

        {/* ----------------- PRIMARY INTERACTIVE VIEWS WRAPPER ----------------- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 ml-0 md:ml-64 space-y-6 select-none bg-[#f6f8f7]">
          
          {/* Global filter tags inside view wrapper if search is written */}
          {globalSearchQuery && (
            <div className="bg-[#1a423108] border border-[#1a423111] p-3 text-xs text-slate-750 font-bold flex items-center justify-between rounded-sm">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-600" />
                <span>Standardized Filter Active: matching <strong>"{globalSearchQuery}"</strong> queries.</span>
              </div>
              <button 
                onClick={() => setGlobalSearchQuery('')}
                className="text-[10px] text-red-600 font-extrabold uppercase hover:underline"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Active rendering block */}
          <div className="transition-all animate-fade-in duration-300">
            {renderActiveView()}
          </div>

        </main>

      </div>

    </div>
  );
}
