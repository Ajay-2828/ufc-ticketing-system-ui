'use client'

import React, { useState } from 'react'
import {
  ShieldAlert,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react'
import { policySettings } from '@/app/ticket-data'

interface PolicySettingsProps {
  threshold: number
  onUpdateThreshold: (newVal: number) => void
}

export function PolicySettings({ threshold, onUpdateThreshold }: PolicySettingsProps) {
  const [localThreshold, setLocalThreshold] = useState(threshold)
  const [reminderDays, setReminderDays] = useState(policySettings.hodReminderDays)
  const [dbEncryption, setDbEncryption] = useState(policySettings.databaseEncryption)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateThreshold(localThreshold)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Lock size={14} /> Service Desk Policies & Governance (ITIL Operational Governance)
          </div>
          <h1 className="page-title-main">System Policies & Closure Thresholds</h1>
          <p className="page-desc-sub">
            Enforce mandatory user ticket verification rules, automatic HOD escalation alerts, and
            database encryption parameters.
          </p>
        </div>

        {saved && (
          <div className="alert-card-banner alert-success" style={{ margin: 0, padding: '8px 14px' }}>
            <CheckCircle2 size={16} /> System policies updated successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {/* Unresolved Closure Threshold Card (Points Discussed #6) */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  Resolved Ticket Closure Threshold
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  ITIL User Governance & Verification Control
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              End users who have accumulated a specified number of resolved but unclosed tickets
              are restricted from creating new requests until outstanding tickets are verified.
            </p>

            <div className="form-field-group">
              <label className="form-field-label">Maximum Unclosed Resolved Tickets Allowed</label>
              <select
                className="form-input-control"
                value={localThreshold}
                onChange={(e) => setLocalThreshold(parseInt(e.target.value))}
              >
                <option value={2}>2 Tickets (Strict Enforce)</option>
                <option value={3}>3 Tickets (Recommended Default)</option>
                <option value={5}>5 Tickets (Moderate)</option>
                <option value={10}>10 Tickets (Relaxed)</option>
              </select>
            </div>
          </div>

          {/* HOD Unclosed Escalation Period */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  HOD Unclosed Escalation Reminder
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Automated Escalation Rule
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              If an employee does not close a resolved ticket within this configured period, an
              automated escalation notification is dispatched to their Department Head (HOD).
            </p>

            <div className="form-field-group">
              <label className="form-field-label">Reminder Period After Resolution</label>
              <select
                className="form-input-control"
                value={reminderDays}
                onChange={(e) => setReminderDays(parseInt(e.target.value))}
              >
                <option value={1}>1 Day (24 Hours)</option>
                <option value={2}>2 Days (48 Hours)</option>
                <option value={3}>3 Days (72 Hours - Standard)</option>
                <option value={5}>5 Days</option>
                <option value={7}>7 Days (1 Week)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Encryption (Section 8) */}
        <div
          className="modern-card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)',
            border: '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#059669',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '16px', color: '#065F46' }}>
                  Section 8 Database Security & Encryption
                </strong>
                <span className="badge-tag badge-tag-sm" style={{ background: '#D1FAE5', color: '#047857' }}>
                  AES-256 Enabled
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#047857' }}>
                System database tables, attachments, and Active Directory credentials are encrypted
                at rest and in transit with TLS 1.3 to guarantee data confidentiality.
              </p>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#065F46' }}>
            <input
              type="checkbox"
              checked={dbEncryption}
              onChange={() => setDbEncryption(!dbEncryption)}
              style={{ width: '18px', height: '18px' }}
            />
            Enforce TDE Encryption
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ height: '42px', padding: '0 20px' }}>
          <Save size={16} /> Save Policy Configuration
        </button>
      </form>
    </div>
  )
}

