'use client'

import React, { useState } from 'react'
import {
  Users,
  Shield,
  Building2,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Search,
  Plus,
  UserCheck,
  Server,
  Lock,
  ExternalLink,
} from 'lucide-react'
import {
  usersDirectory,
  departmentsData,
  vendorAccounts,
  roles,
  Role,
  ADUser,
} from '@/app/ticket-data'

export function UsersAndAccess() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'departments' | 'vendors'>('users')
  const [userSearch, setUserSearch] = useState('')
  const [usersList, setUsersList] = useState<ADUser[]>(usersDirectory)

  // Unsaved changes tracker
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const markDirty = () => setHasUnsavedChanges(true)

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsersList(usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    markDirty()
    triggerToast(`Role updated for user ${userId}. Remember to save changes.`)
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    triggerToast('Users & Access assignments saved successfully!')
  }

  const handleDiscard = () => {
    setUsersList(usersDirectory)
    setHasUnsavedChanges(false)
    triggerToast('Changes discarded.')
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 1000,
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Sparkles size={16} color="#60A5FA" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Users size={14} /> Section 15 · Administration Module
          </div>
          <h1 className="page-title-main">Users & Access Governance</h1>
          <p className="page-desc-sub">
            Manage enterprise accounts synced from corporate Active Directory, review manager hierarchies, and configure role entitlements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '3px',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'users' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'users' ? 700 : 500,
            }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={14} /> Users ({usersList.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'roles' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'roles' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'roles' ? 700 : 500,
            }}
            onClick={() => setActiveTab('roles')}
          >
            <Shield size={14} /> Roles (7)
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'departments' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'departments' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'departments' ? 700 : 500,
            }}
            onClick={() => setActiveTab('departments')}
          >
            <Building2 size={14} /> Departments ({departmentsData.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'vendors' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'vendors' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'vendors' ? 700 : 500,
            }}
            onClick={() => setActiveTab('vendors')}
          >
            <Briefcase size={14} /> Vendors ({vendorAccounts.length})
          </button>
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="modern-card">
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div className="search-input-box" style={{ width: '320px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, email, department, role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Server size={14} color="#059669" />
              <span>
                <b>148 AD Accounts</b> · Manager (HOD) read directly from Active Directory
              </span>
            </div>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>User ID & Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Manager (HOD from AD)</th>
                  <th>Directory Status</th>
                  <th>UFC Desk Role</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{u.id}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{u.department}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                          {u.manager}
                        </span>
                      </div>
                    </td>
                    <td>
                      {u.syncedFromAD ? (
                        <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                          Synced from Active Directory
                        </span>
                      ) : (
                        <span className="badge-tag badge-tag-sm" style={{ background: '#F5F3FF', color: '#6D28D9', fontWeight: 600 }}>
                          External Vendor Account
                        </span>
                      )}
                    </td>
                    <td>
                      <select
                        className="form-input-control"
                        style={{ height: '32px', fontSize: '12px', width: '150px' }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & CAPABILITIES (Section 3) */}
      {activeTab === 'roles' && (
        <div className="modern-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>
            Role-Based Access Control (RBAC) Matrix (Section 3)
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Strict role segregation: users only see tickets and applications they are entitled to.
          </p>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Primary Capabilities (Can Do)</th>
                  <th>Referral Authority</th>
                  <th>Visibility Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>End User</strong></td>
                  <td>Create tickets, track own tickets, answer clarifications, close or reopen resolved tickets.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#FEF2F2', color: '#B91C1C' }}>No Referrals</span></td>
                  <td>Own tickets and assigned departmental applications only.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>Technician (IT User)</strong></td>
                  <td>Work assigned tickets, update ETA and progress, resolve, flag or refer ticket as Change Request to Admin, raise technical tickets.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>To Admin Team Only</span></td>
                  <td>Work queue, assigned systems, and collaborative tickets.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>Department Head (HOD)</strong></td>
                  <td>Approve or reject tickets from own department, refer to other departments for clarification, receives reminders & reports.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>All Departments (Section 3)</span></td>
                  <td>Department requests, pending approvals, and operational reports.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>Admin Team</strong></td>
                  <td>Handles exceptions, reassigns, classifies manually, refers to department or vendor, monitors SLA, configures system.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>Full Authority</span></td>
                  <td>System-wide tickets, exceptions queue, and administration module.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>Management</strong></td>
                  <td>Approves architectural Change Requests where workflow includes management stage.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#64748B' }}>In-Workflow Approvals</span></td>
                  <td>Executive approvals, governance metrics, and high-level reports.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>Testing Team</strong></td>
                  <td>Validates completed work where testing is enabled, passes or fails QA verification.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#64748B' }}>Feedback on Ticket</span></td>
                  <td>Testing queue tickets awaiting deployment verification.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)' }}>External Vendor</strong></td>
                  <td>Separate secure login, sees only assigned tickets, updates progress, uploads files, requests clarification, resolves.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#FEF2F2', color: '#B91C1C' }}>No Referrals</span></td>
                  <td>Strictly assigned vendor tickets. Zero access to internal data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS (Section 4) */}
      {activeTab === 'departments' && (
        <div className="modern-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>
            Organizational Departments & Application Entitlement (Section 4)
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Each department has an assigned HOD from AD. Users can only create tickets for applications mapped to their department.
          </p>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Designated HOD (From AD)</th>
                  <th>HOD Email Address</th>
                  <th>Permitted Applications</th>
                </tr>
              </thead>
              <tbody>
                {departmentsData.map((d) => (
                  <tr key={d.name}>
                    <td>
                      <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{d.name}</strong>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {d.hodName}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{d.hodEmail}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {d.assignedApplications.map((app) => (
                          <span key={app} className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#475569' }}>
                            {app}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VENDORS (Section 12) */}
      {activeTab === 'vendors' && (
        <div className="modern-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>
            Authorized External Vendors (Section 12)
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            External partner organizations with secure, isolated portal access to tickets forwarded by Admin or HOD.
          </p>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Vendor Partner</th>
                  <th>Contract Reference</th>
                  <th>Designated Representative</th>
                  <th>Direct Email</th>
                  <th>Active Workload</th>
                  <th>Partner Status</th>
                </tr>
              </thead>
              <tbody>
                {vendorAccounts.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{v.name}</strong>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{v.id}</div>
                    </td>
                    <td>
                      <code style={{ fontSize: '12px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                        {v.contractRef}
                      </code>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13px' }}>{v.leadContact}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{v.email}</span>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 700 }}>
                        {v.activeTickets} Assigned Tickets
                      </span>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UNSAVED CHANGES FLOATING BAR (Section 15) */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in Users & Access.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                height: '32px',
                fontSize: '12px',
                padding: '0 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
              }}
              onClick={handleDiscard}
            >
              Discard
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ height: '32px', fontSize: '12px', padding: '0 14px' }}
              onClick={handleSave}
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

