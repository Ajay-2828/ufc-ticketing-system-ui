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
} from 'lucide-react'
import { policySettings, auditLogEntries } from '@/app/ticket-data'

export function SecurityAndSystem() {
  const [activeTab, setActiveTab] = useState<'ad' | 'audit' | 'security'>('ad')
  const [isSyncing, setIsSyncing] = useState(false)
  const [auditSearch, setAuditSearch] = useState('')
  const [syncNotice, setSyncNotice] = useState<string | null>(null)

  // Attribute Mapping State (Section 15)
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
      setSyncNotice('Active Directory synchronization complete! 148 employee objects & HOD hierarchies updated.')
      triggerToast('Active Directory sync completed successfully!')
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
    triggerToast('Security and Directory mapping saved successfully!')
  }

  const handleDiscard = () => {
    setAttributeMappings(policySettings.activeDirectoryStatus.syncedAttributes)
    setHasUnsavedChanges(false)
    triggerToast('Changes discarded.')
  }

  const filteredAuditLogs = auditLogEntries.filter(
    (a) =>
      a.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.event.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(auditSearch.toLowerCase())
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
            <Lock size={14} /> Section 2 & 15 · Security and System
          </div>
          <h1 className="page-title-main">Security, Directory & Audit</h1>
          <p className="page-desc-sub">
            Corporate LDAP synchronization, immutable audit trails, and AES-256 database encryption at rest.
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
              background: activeTab === 'ad' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'ad' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'ad' ? 700 : 500,
            }}
            onClick={() => setActiveTab('ad')}
          >
            <Server size={14} /> Active Directory
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'audit' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'audit' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'audit' ? 700 : 500,
            }}
            onClick={() => setActiveTab('audit')}
          >
            <FileText size={14} /> Audit Log
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'security' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'security' ? 700 : 500,
            }}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={14} /> Data Security & Encryption
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="alert-card-banner alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* TAB 1: ACTIVE DIRECTORY (Section 15) */}
      {activeTab === 'ad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Status KPI Card */}
          <div className="modern-card" style={{ padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '16px', color: 'var(--text-main)' }}>LDAP Connection: Active & Synchronized</strong>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                    Connected
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Host: <code>ufc.ad.internal:636 (LDAPS TLS 1.3)</code> &bull; Base DN: <code>DC=ufc,DC=om</code> &bull; Last Synced: 2 minutes ago
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              disabled={isSyncing}
              onClick={handleSyncNow}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing Active Directory...' : 'Sync Now'}
            </button>
          </div>

          {/* Attribute Mapping Table (Section 15: Attribute mapping including Manager to HOD) */}
          <div className="modern-card">
            <div className="modern-card-header">
              <div>
                <h3 className="card-title-lg">Active Directory Schema & Attribute Mapping</h3>
                <p className="card-subtitle-sm">
                  Manager attribute automatically maps to Department Head (HOD) approval hierarchies.
                </p>
              </div>
            </div>

            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>AD Schema Attribute</th>
                    <th>UFC Desk Field Target</th>
                    <th>Sync Behavior</th>
                    <th>Mapping Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attributeMappings.map((attr, idx) => (
                    <tr key={attr.adAttr}>
                      <td>
                        <code style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                          {attr.adAttr}
                        </code>
                      </td>
                      <td>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                          {attr.ufcField}
                        </strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          {attr.adAttr === 'manager'
                            ? 'Resolves manager DN to HOD approval chain'
                            : 'Two-way synchronised every 15 mins'}
                        </span>
                      </td>
                      <td>
                        <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                          {attr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOG (Section 15) */}
      {activeTab === 'audit' && (
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
                placeholder="Search audit trail by actor, event, ticket ID..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportAudit}
            >
              <Download size={14} /> Export Audit Log (CSV)
            </button>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Audit Event ID</th>
                  <th>Timestamp</th>
                  <th>Actor / Responsible Principal</th>
                  <th>Action / Event</th>
                  <th>Target Entity</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <code style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{log.id}</code>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{log.actor}</strong>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {log.event}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{log.target}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.ip}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DATA SECURITY & ENCRYPTION (Section 2, Rule 4) */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  Database Encryption at Rest (Section 2, Rule 4)
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
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  In-Transit & Attachment Security (Section 5)
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Strict TLS 1.3 & Encrypted Blob Storage
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

      {/* UNSAVED CHANGES FLOATING BAR (Section 15) */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in Security & System settings.
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

