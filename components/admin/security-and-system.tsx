'use client'

import React, { useState } from 'react'
import {
  Server,
  ShieldCheck,
  FileText,
  Lock,
  RefreshCw,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Shield,
  Key,
  HardDrive,
  Cpu,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react'
import { policySettings, auditLogEntries } from '@/app/ticket-data'

export function SecurityAndSystem() {
  const [activeTab, setActiveTab] = useState<'ad' | 'audit' | 'security'>('ad')
  const [isSyncing, setIsSyncing] = useState(false)
  const [auditSearch, setAuditSearch] = useState('')
  const [syncNotice, setSyncNotice] = useState<string | null>(null)

  // Attribute Mapping State
  const [attributeMappings, setAttributeMappings] = useState(
    policySettings.activeDirectoryStatus.syncedAttributes
  )

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const markDirty = () => setHasUnsavedChanges(true)

  const handleSyncNow = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setSyncNotice('Active Directory synchronization complete! 148 employee profiles & manager hierarchies updated.')
      triggerToast('Active Directory synchronization completed successfully!')
      setTimeout(() => setSyncNotice(null), 4000)
    }, 1200)
  }

  const handleExportAudit = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Timestamp,Actor,Event,Target,IP_Address',
        ...auditLogEntries.map((e) => `"${e.id}","${e.timestamp}","${e.actor}","${e.event}","${e.target}","${e.ip}"`),
      ].join('\n')

    const encoded = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encoded)
    link.setAttribute('download', 'ufc_desk_security_audit_log.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    triggerToast('Security audit log exported as CSV!')
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    triggerToast('Directory attribute mappings and security policies saved!')
  }

  const handleDiscard = () => {
    setAttributeMappings(policySettings.activeDirectoryStatus.syncedAttributes)
    setHasUnsavedChanges(false)
    triggerToast('All changes discarded.')
  }

  const filteredAuditLogs = auditLogEntries.filter(
    (a) =>
      a.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.event.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(auditSearch.toLowerCase())
  )

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
            <ShieldCheck size={13} />
            <span>Infrastructure &amp; Compliance</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>SOC 2 &amp; Central Bank Compliant</span>
          </div>
          <h1 className="page-title-main" style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0' }}>
            Security, Directory &amp; Audit
          </h1>
          <p className="page-desc-sub" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Corporate Active Directory sync health, tamper-proof security audit trails, and AES-256 database encryption at rest.
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
              padding: '0 16px',
              fontSize: '13px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'ad' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'ad' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'ad' ? 700 : 500,
              boxShadow: activeTab === 'ad' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('ad')}
          >
            <Server size={14} /> Active Directory
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '13px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'audit' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'audit' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'audit' ? 700 : 500,
              boxShadow: activeTab === 'audit' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('audit')}
          >
            <FileText size={14} /> Audit Trail ({auditLogEntries.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '13px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'security' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'security' ? 700 : 500,
              boxShadow: activeTab === 'security' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={14} /> Data Encryption
          </button>
        </div>
      </div>

      {/* Top Operational KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Server size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Directory Connection
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Connected &amp; Synced
            </div>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>LDAPS TLS 1.3 Active</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Audit Ledger
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Immutable Logging
            </div>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>Every action captured</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Database Protection
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              AES-256 at Rest
            </div>
            <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>HSM Cluster encrypted</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Transit Security
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              TLS 1.3 + HSTS
            </div>
            <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 600 }}>End-to-end encrypted</span>
          </div>
        </div>
      </div>

      {syncNotice && (
        <div className="alert-card-banner alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* TAB 1: ACTIVE DIRECTORY */}
      {activeTab === 'ad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Connection Status Card */}
          <div className="modern-card" style={{ padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '16px', color: 'var(--text-main)' }}>
                    Corporate Active Directory (LDAP) Connection
                  </strong>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                    Synchronized
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Endpoint: <code>ufc.ad.internal:636 (LDAPS TLS 1.3)</code> &bull; Base DN: <code>DC=ufc,DC=om</code> &bull; Last Synced: 2 minutes ago
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              disabled={isSyncing}
              onClick={handleSyncNow}
              style={{ gap: '6px' }}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing Directory...' : 'Sync Directory Now'}
            </button>
          </div>

          {/* Directory Attribute Mapping Card */}
          <div className="modern-card" style={{ padding: '24px 28px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Active Directory Attribute Field Mappings
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                How employee fields in your corporate directory map into UFC Desk user profiles and approval chains.
              </p>
            </div>

            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>UFC Desk User Field</th>
                    <th style={{ width: '30%' }}>Active Directory Attribute</th>
                    <th style={{ width: '25%' }}>Synchronization Mode</th>
                    <th style={{ width: '15%' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Full Name &amp; Initials</strong></td>
                    <td><code>displayName</code></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>One-way (AD is source of truth)</span></td>
                    <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>Active</span></td>
                  </tr>
                  <tr>
                    <td><strong>Corporate Email</strong></td>
                    <td><code>mail / userPrincipalName</code></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>One-way (Authentication identifier)</span></td>
                    <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>Active</span></td>
                  </tr>
                  <tr>
                    <td><strong>Business Department</strong></td>
                    <td><code>department</code></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Auto-maps to application catalog access</span></td>
                    <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>Active</span></td>
                  </tr>
                  <tr>
                    <td><strong style={{ color: 'var(--primary)' }}>Reporting Manager (HOD)</strong></td>
                    <td><code>manager (DistinguishedName)</code></td>
                    <td><span style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 600 }}>Enforces approval hierarchy automatically</span></td>
                    <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>Active</span></td>
                  </tr>
                  <tr>
                    <td><strong>Account Status</strong></td>
                    <td><code>userAccountControl (512/514)</code></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deactivates logins immediately upon termination</span></td>
                    <td><span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeTab === 'audit' && (
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
            <div className="search-input-box" style={{ width: '320px' }}>
              <Search size={15} />
              <input
                type="text"
                placeholder="Search audit trail by actor, event, ticket ID..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportAudit}
              style={{ gap: '6px' }}
            >
              <Download size={14} /> Export Audit Log (CSV)
            </button>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>Audit ID</th>
                  <th style={{ width: '18%' }}>Timestamp</th>
                  <th style={{ width: '22%' }}>Responsible Actor</th>
                  <th style={{ width: '24%' }}>Action / Security Event</th>
                  <th style={{ width: '14%' }}>Target Entity</th>
                  <th style={{ width: '10%' }}>Origin IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.id}</code>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{log.timestamp}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="user-avatar-circle avatar-indigo" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                          {log.actor.split(' ').map((x) => x[0]).join('')}
                        </span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{log.actor}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {log.event}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>{log.target}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{log.ip}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DATA ENCRYPTION */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  Database Encryption at Rest
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Hardware Security Module (HSM) Managed
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              United Finance Company enforces AES-256 transparent database encryption (TDE) for all ticket records, questionnaire answers, and customer data. Keys are rotated every 90 days.
            </p>

            <div style={{ padding: '12px 16px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cipher Suite:</span>
                <strong>AES-256-GCM Transparent Data Encryption</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Key Vault:</span>
                <strong>UFC Core HSM Cluster Active</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                  100% Encrypted
                </span>
              </div>
            </div>
          </div>

          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  In-Transit &amp; Attachment Security
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Strict TLS 1.3 &amp; Encrypted Blob Storage
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              User uploads (PNG, JPG, PDF up to 10 MB each) are scanned against antivirus signatures upon upload and stored encrypted in dedicated object vaults.
            </p>

            <div style={{ padding: '12px 16px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Max Attachment Size:</span>
                <strong>10 MB per file (PNG, JPG, PDF)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transit Security:</span>
                <strong>TLS 1.3 with HSTS Enforced</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vendor Shell:</span>
                <strong>Isolated Sandboxed Realm Active</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING UNSAVED CHANGES BAR */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in Security &amp; Directory settings.
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
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
