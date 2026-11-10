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
  ShieldCheck,
  Mail,
  User,
  Check,
  ChevronRight,
  SlidersHorizontal,
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
  const [roleFilter, setRoleFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
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
    triggerToast(`Role updated for ${userId}. Remember to save your changes.`)
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    triggerToast('User roles & access permissions saved successfully!')
  }

  const handleDiscard = () => {
    setUsersList(usersDirectory)
    setHasUnsavedChanges(false)
    triggerToast('All changes reverted to directory defaults.')
  }

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())

    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    const matchesDept = deptFilter === 'All' || u.department === deptFilter

    return matchesSearch && matchesRole && matchesDept
  })

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '90px' }}>
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

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div className="page-eyebrow">
            <Users size={13} />
            <span>Identity &amp; Team Directory</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>Active Directory Synced</span>
          </div>
          <h1 className="page-title-main" style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0' }}>
            Users &amp; Access Control
          </h1>
          <p className="page-desc-sub" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Review team member profiles, managerial reporting lines, role-based access rights, and external vendor partners.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 14px',
              fontSize: '12.5px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'users' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'users' ? 700 : 500,
              boxShadow: activeTab === 'users' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={14} /> Team Members ({usersList.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 14px',
              fontSize: '12.5px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'roles' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'roles' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'roles' ? 700 : 500,
              boxShadow: activeTab === 'roles' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('roles')}
          >
            <Shield size={14} /> Roles &amp; Rights ({roles.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 14px',
              fontSize: '12.5px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'departments' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'departments' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'departments' ? 700 : 500,
              boxShadow: activeTab === 'departments' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('departments')}
          >
            <Building2 size={14} /> Departments ({departmentsData.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 14px',
              fontSize: '12.5px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'vendors' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'vendors' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'vendors' ? 700 : 500,
              boxShadow: activeTab === 'vendors' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('vendors')}
          >
            <Briefcase size={14} /> Vendors ({vendorAccounts.length})
          </button>
        </div>
      </div>

      {/* Top Operational KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Organization Accounts
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {usersList.length} Active Staff
            </div>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>100% Synced from Active Directory</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Business Departments
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {departmentsData.length} Operational Units
            </div>
            <span style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>Designated Department Heads</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Role Security Profiles
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {roles.length} Access Tiers
            </div>
            <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>Strict Scope Segregation</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              External Partners
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {vendorAccounts.length} Verified Vendors
            </div>
            <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 600 }}>Sandboxed External Access</span>
          </div>
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              background: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div className="search-input-box" style={{ width: '280px' }}>
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search by name, email, department..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <select
                className="form-input-control"
                style={{ width: '160px', height: '36px', fontSize: '12.5px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                className="form-input-control"
                style={{ width: '180px', height: '36px', fontSize: '12.5px' }}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                {departmentsData.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredUsers.length}</strong> of <strong>{usersList.length}</strong> team members
            </div>
          </div>

          {/* Users Table */}
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Department</th>
                  <th>Reporting Manager (HOD)</th>
                  <th>Identity Source</th>
                  <th style={{ width: '180px' }}>Assigned Access Role</th>
                  <th style={{ width: '100px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="user-avatar-circle avatar-indigo" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {u.name.split(' ').map((x) => x[0]).join('')}
                        </span>
                        <div>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                            {u.name}
                          </strong>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {u.email}
                          </span>
                        </div>
                      </div>
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
                          Active Directory Sync
                        </span>
                      ) : (
                        <span className="badge-tag badge-tag-sm" style={{ background: '#F5F3FF', color: '#6D28D9', fontWeight: 600 }}>
                          External Partner Account
                        </span>
                      )}
                    </td>
                    <td>
                      <select
                        className="form-input-control"
                        style={{ height: '32px', fontSize: '12px', width: '100%' }}
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

      {/* TAB 2: ROLES & RIGHTS */}
      {activeTab === 'roles' && (
        <div className="modern-card" style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Strict role segregation: users only see tickets and applications they are explicitly entitled to.
            </p>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Role Profile</th>
                  <th style={{ width: '40%' }}>Core Responsibilities &amp; Capabilities</th>
                  <th style={{ width: '18%' }}>Referral Authority</th>
                  <th style={{ width: '22%' }}>Visibility Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>End User</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Create tickets, track own tickets, answer clarifications, verify and close or reopen resolved tickets.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#FEF2F2', color: '#B91C1C' }}>No Referrals</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Own tickets and assigned departmental applications only.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>Technician</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Accept assigned tickets, update ETA and progress, resolve, classify as Change Request, raise technical tickets.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>To Admin Team</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Work queue, assigned systems, and collaborative tickets.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>Department Head (HOD)</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Approve or reject tickets from own department, refer to other departments for clarification, review team SLA compliance.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>All Departments</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Department requests, pending approvals, and operational reports.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>Admin Team</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Handles exception queues, reassigns specialists, classifies change requests, monitors SLAs, manages system settings.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>Full Authority</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>System-wide tickets, exceptions queue, and administration settings.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>Management</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Reviews and approves architectural Change Requests, reviews executive performance dashboards.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#64748B' }}>Stage Approval</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Executive approvals, governance metrics, and high-level reports.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>Testing Team</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Validates deployed changes on staging/UAT, records defect notes, passes or fails QA verification.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#64748B' }}>QA Verification</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Testing queue tickets awaiting deployment verification.</td>
                </tr>
                <tr>
                  <td><strong style={{ color: 'var(--primary)', fontSize: '13.5px' }}>External Vendor</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Accesses sandboxed portal, updates progress on assigned tickets, uploads patches, requests clarifications.</td>
                  <td><span className="badge-tag badge-tag-sm" style={{ background: '#FEF2F2', color: '#B91C1C' }}>No Referrals</span></td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Strictly assigned vendor tickets. Zero access to internal data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {departmentsData.map((d) => (
            <div key={d.name} className="modern-card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                      {d.name}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {usersList.filter((u) => u.department === d.name).length || 18} Synced Staff
                    </span>
                  </div>
                </div>
                <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                  Active
                </span>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '14px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department Head (HOD):</span>{' '}
                <strong style={{ color: 'var(--text-main)' }}>{d.hodName}</strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Permitted Applications
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {d.assignedApplications.map((app) => (
                    <span key={app} className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: VENDORS */}
      {activeTab === 'vendors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {vendorAccounts.map((v) => (
            <div key={v.id} className="modern-card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FAF5FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                      {v.name}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Contact: {v.leadContact} • Ref: {v.contractRef}
                    </span>
                  </div>
                </div>
                <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                  {v.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', background: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '14px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{v.email}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Security Realm:</span>{' '}
                  <span style={{ color: '#7C3AED', fontWeight: 700 }}>Isolated External Sandbox</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Active Tickets:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{v.activeTickets} assigned</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Supported Service Areas
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['L3 Engineering Escalations', 'Contract SLA Support', 'Third-Party Hardware'].map((area) => (
                    <span key={area} className="badge-tag badge-tag-sm" style={{ background: '#EDE9FE', color: '#6D28D9', fontWeight: 600 }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING UNSAVED CHANGES BAR */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in user role assignments.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
              onClick={handleDiscard}
            >
              <RotateCcw size={14} /> Discard Changes
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{
                background: 'var(--primary)',
                borderColor: 'var(--primary)',
              }}
              onClick={handleSave}
            >
              <Save size={14} /> Save Assignments
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
