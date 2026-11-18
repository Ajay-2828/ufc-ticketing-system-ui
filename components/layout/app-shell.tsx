'use client'

import React, { useState, useMemo, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FilePlus2,
  Ticket as TicketIcon,
  Briefcase,
  ShieldCheck,
  GitBranch,
  FlaskConical,
  Building2,
  BarChart3,
  FolderKanban,
  FileText,
  Lock,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  Menu,
  AlertCircle,
  X,
  Sparkles,
  UserCheck,
  Sliders,
  Users,
  Plus,
  MessageSquare,
  LucideIcon,
  Tags,
} from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import { roles, departmentsData } from '@/app/ticket-data'

import { CloseTicketModal } from '@/components/tickets/close-ticket-modal'
import { ReopenTicketModal } from '@/components/tickets/reopen-ticket-modal'
import { AssignTicketModal } from '@/components/tickets/assign-ticket-modal'
import { ResolveTicketModal } from '@/components/tickets/resolve-ticket-modal'
import { ReferralModal } from '@/components/tickets/referral-modal'

interface AppShellProps {
  children: ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const {
    currentRole,
    setCurrentRole,
    currentUser,
    tickets,
    globalSearch,
    setGlobalSearch,
    toastMessage,
    ticketToClose,
    setTicketToClose,
    ticketToReopen,
    setTicketToReopen,
    ticketToAssign,
    setTicketToAssign,
    ticketToResolve,
    setTicketToResolve,
    ticketToRefer,
    setTicketToRefer,
    handleConfirmClose,
    handleConfirmReopen,
    handleConfirmAssign,
    handleConfirmResolve,
    handleConfirmReferral,
  } = useTicketContext()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAdminExpanded, setIsAdminExpanded] = useState(true)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  // Navigation by Role - Any user can create tickets
  const navItems: NavItem[] = useMemo(() => {
    switch (currentRole) {
      case 'End User':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Create Ticket', href: '/tickets/new', icon: FilePlus2 },
          { label: 'My Tickets', href: '/tickets', icon: TicketIcon },
        ]
      case 'Technician':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Create Ticket', href: '/tickets/new', icon: FilePlus2 },
          { label: 'Work Queue', href: '/work-queue', icon: Briefcase },
          { label: 'My Tickets', href: '/tickets', icon: TicketIcon },
          { label: 'Change Requests', href: '/change-requests', icon: GitBranch },
        ]
      case 'HOD':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Create Ticket', href: '/tickets/new', icon: FilePlus2 },
          {
            label: 'Approvals',
            href: '/approvals',
            icon: ShieldCheck,
            badge: tickets.filter(
              (t) =>
                t.status === 'Pending Approval' &&
                departmentsData.some((d) => d.name === t.department && d.hodName === currentUser.name)
            ).length,
          },
          { label: 'Department Tickets', href: '/department-tickets', icon: FolderKanban },
          { label: 'Reports', href: '/reports', icon: BarChart3 },
        ]
      case 'Management':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Create Ticket', href: '/tickets/new', icon: FilePlus2 },
          {
            label: 'Change Approvals',
            href: '/change-requests',
            icon: ShieldCheck,
            badge: tickets.filter((t) => t.status === 'Management Approval').length,
          },
          { label: 'Change Requests', href: '/tickets', icon: TicketIcon },
          { label: 'Reports', href: '/reports', icon: BarChart3 },
        ]
      case 'Testing Team':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Create Ticket', href: '/tickets/new', icon: FilePlus2 },
          {
            label: 'Testing Queue',
            href: '/testing',
            icon: FlaskConical,
            badge: tickets.filter((t) => t.status === 'In Testing').length,
          },
          { label: 'All Tickets', href: '/tickets', icon: TicketIcon },
        ]
      case 'External Vendor':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Vendor Portal', href: '/vendor-portal', icon: Building2 },
        ]
      case 'Other Departments':
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          {
            label: 'Clarifications',
            href: '/clarifications',
            icon: MessageSquare,
            badge: tickets.filter(
              (t) =>
                t.status === 'Awaiting Clarification' &&
                t.referral &&
                !t.referral.response &&
                t.referral.department === currentUser.dept
            ).length,
          },
        ]
      case 'Admin Team':
      default:
        return [
          { label: 'Home', href: '/', icon: LayoutDashboard },
          { label: 'Create Ticket', href: '/tickets/new', icon: FilePlus2 },
          {
            label: 'Admin Queue',
            href: '/exceptions',
            icon: AlertCircle,
            badge: tickets.filter(
              (t) => t.status === 'Reopened' || t.status === 'Admin Review'
            ).length,
          },
          { label: 'All Tickets', href: '/tickets', icon: FolderKanban },
          { label: 'Reports', href: '/reports', icon: BarChart3 },
        ]
    }
  }, [currentRole, tickets, currentUser.dept])

  // Standard Administration Pages (ITSM Industry Standard)
  const adminPages: NavItem[] = [
    { label: 'Classification', href: '/admin/classification', icon: FolderKanban },
    { label: 'Ticket Types', href: '/admin/ticket-types', icon: Tags },
    { label: 'Masters (Severity, Priority, SLA)', href: '/admin/masters', icon: Sliders },
    { label: 'Workflows & Timers', href: '/admin/workflows', icon: GitBranch },
    { label: 'Users & Access', href: '/admin/users', icon: Users },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Security & System', href: '/admin/security', icon: Lock },
  ]

  // Formatted date for topbar
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="app-container">
      {/* Toast Notification */}
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

      {/* Sidebar with exact globals.css classes */}
      <aside className={`app-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <Link href="/" className="brand-wrapper">
            <div className="brand-icon-box">
              <ShieldCheck size={20} />
            </div>
            {!sidebarCollapsed && (
              <div className="brand-text">
                <span className="brand-title">UFC Desk</span>
                <span className="brand-tag">IT Service Management</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {sidebarCollapsed ? <Menu size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {/* Sidebar Nav Scroll */}
        <div className="sidebar-scroll">
          <div className="nav-group-label">WORKSPACE</div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="nav-badge-count">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            )
          })}

          {/* Administration Section (Admin Team) */}
          {currentRole === 'Admin Team' && (
            <div style={{ marginTop: '12px' }}>
              {!sidebarCollapsed && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    padding: '8px 10px 4px',
                  }}
                  onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                >
                  <span
                    className="nav-group-label"
                    style={{ padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Sliders size={12} /> ADMINISTRATION
                  </span>
                  {isAdminExpanded ? (
                    <ChevronDown size={14} color="var(--text-muted)" />
                  ) : (
                    <ChevronRight size={14} color="var(--text-muted)" />
                  )}
                </div>
              )}

              {(isAdminExpanded || sidebarCollapsed) &&
                adminPages.map((page) => {
                  const PageIcon = page.icon
                  const isPageActive = pathname === page.href
                  return (
                    <Link
                      key={page.label}
                      href={page.href}
                      className={`nav-link-btn ${isPageActive ? 'active' : ''}`}
                      title={sidebarCollapsed ? page.label : undefined}
                      style={{
                        paddingLeft: sidebarCollapsed ? '12px' : '26px',
                        fontSize: '13px',
                      }}
                    >
                      <PageIcon size={16} />
                      {!sidebarCollapsed && <span>{page.label}</span>}
                    </Link>
                  )
                })}
            </div>
          )}
        </div>

        {/* User Profile in Footer */}
        <div className="sidebar-user-footer">
          <div className={`user-avatar-circle avatar-${currentUser.avatarColor || 'blue'}`}>
            {currentUser.initials}
          </div>
          {!sidebarCollapsed && (
            <div className="user-info-text">
              <div className="user-name-text">{currentUser.name}</div>
              <div className="user-role-text">{currentUser.dept}</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Layout Area with exact globals.css classes */}
      <div className={`app-main ${sidebarCollapsed ? 'main-expanded' : ''}`}>
        {/* Topbar with exact globals.css classes */}
        <header className="app-topbar">
          <div className="topbar-left">
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'var(--surface-muted)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
              }}
            >
              <strong style={{ color: 'var(--text-main)' }}>{currentRole}</strong> &bull; {todayFormatted}
            </span>

            {/* Global Search Bar */}
            <div className="search-input-box">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search across UFC Desk..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              {globalSearch ? (
                <button
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} color="var(--text-muted)" />
                </button>
              ) : (
                <span className="kbd-shortcut">⌘K</span>
              )}
            </div>
          </div>

          <div className="topbar-right">
            {/* Quick Create Ticket for Any User */}
            {currentRole !== 'External Vendor' && (
              <button
                type="button"
                className="btn-gold"
                style={{ height: '34px', fontSize: '12.5px', padding: '0 12px', gap: '6px' }}
                onClick={() => router.push('/tickets/new')}
                title="Create a new support ticket"
              >
                <Plus size={14} /> New Ticket
              </button>
            )}

            {/* Persona View Switcher */}
            <div className="role-switcher-container">
              <button
                type="button"
                className="role-switcher-btn"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <span className="role-indicator-pill" />
                <span>
                  Viewing as: <strong>{currentRole}</strong>
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {showRoleDropdown && (
                <div className="role-dropdown-menu">
                  <div className="dropdown-header-label">
                    Simulate Active Directory Persona
                  </div>
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className={`role-option-item ${role === currentRole ? 'selected' : ''}`}
                      onClick={() => {
                        setCurrentRole(role)
                        setShowRoleDropdown(false)
                        if (pathname.startsWith('/admin') && role !== 'Admin Team') {
                          router.push('/')
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={14} />
                        <span>{role}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="icon-action-btn"
              title="System notifications"
            >
              <Bell size={18} />
              <span className="notification-indicator-dot" />
            </button>

            {/* Profile Avatar Badge */}
            <div className={`user-avatar-circle avatar-${currentUser.avatarColor || 'blue'}`}>
              {currentUser.initials}
            </div>
          </div>
        </header>

        {/* Page Content Body with exact globals.css class */}
        <main className="app-content-body">{children}</main>
      </div>

      {/* Action Modals */}
      {ticketToClose && (
        <CloseTicketModal
          ticket={ticketToClose}
          onClose={() => setTicketToClose(null)}
          onConfirmClose={handleConfirmClose}
        />
      )}

      {ticketToReopen && (
        <ReopenTicketModal
          ticket={ticketToReopen}
          onClose={() => setTicketToReopen(null)}
          onConfirmReopen={handleConfirmReopen}
        />
      )}

      {ticketToAssign && (
        <AssignTicketModal
          ticket={ticketToAssign}
          onClose={() => setTicketToAssign(null)}
          onConfirmAssign={handleConfirmAssign}
        />
      )}

      {ticketToResolve && (
        <ResolveTicketModal
          ticket={ticketToResolve}
          onClose={() => setTicketToResolve(null)}
          onConfirmResolve={handleConfirmResolve}
        />
      )}

      {ticketToRefer && (
        <ReferralModal
          ticket={ticketToRefer}
          onClose={() => setTicketToRefer(null)}
          onConfirmReferral={handleConfirmReferral}
        />
      )}
    </div>
  )
}
