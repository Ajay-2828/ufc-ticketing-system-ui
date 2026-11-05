'use client'

import React, { useState } from 'react'
import {
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Eye,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react'
import { policySettings } from '@/app/ticket-data'

export function WorkflowsAndTimers() {
  const [activeTab, setActiveTab] = useState<'workflows' | 'timers'>('workflows')
  const [activeTemplate, setActiveTemplate] = useState<'standard' | 'changeRequest'>('standard')

  // Workflow stage toggles
  const [stdHodApproval, setStdHodApproval] = useState(true)
  const [stdTestingRequired, setStdTestingRequired] = useState(false)
  const [stdTimeoutAction, setStdTimeoutAction] = useState('Notify user')

  const [crHodApproval, setCrHodApproval] = useState(true)
  const [crManagementApproval, setCrManagementApproval] = useState(true)
  const [crTestingRequired, setCrTestingRequired] = useState(true)
  const [crTimeoutAction, setCrTimeoutAction] = useState('Notify and escalate to Admin')

  // Timers & Thresholds state (Section 10)
  const [hodReminderDays, setHodReminderDays] = useState(policySettings.hodReminderDays || 3)
  const [closureThreshold, setClosureThreshold] = useState(policySettings.unresolvedClosureThreshold || 5)
  const [hodDefaultTimeoutHours, setHodDefaultTimeoutHours] = useState(policySettings.hodDefaultTimeoutHours || 24)
  const [defaultTimeoutBehavior, setDefaultTimeoutBehavior] = useState('Notify user')

  // Unsaved changes tracker (Section 15)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const markDirty = () => setHasUnsavedChanges(true)

  const handleSave = () => {
    setHasUnsavedChanges(false)
    triggerToast('Workflow & Timers configuration saved successfully!')
  }

  const handleDiscard = () => {
    setStdHodApproval(true)
    setStdTestingRequired(false)
    setStdTimeoutAction('Notify user')
    setCrHodApproval(true)
    setCrManagementApproval(true)
    setCrTestingRequired(true)
    setCrTimeoutAction('Notify and escalate to Admin')
    setHodReminderDays(3)
    setClosureThreshold(5)
    setHodDefaultTimeoutHours(24)
    setDefaultTimeoutBehavior('Notify user')
    setHasUnsavedChanges(false)
    triggerToast('Changes discarded.')
  }

  return (
    <div>
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

      {/* Header */}
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <GitBranch size={14} /> Section 8 & 10 · Administration Module
          </div>
          <h1 className="page-title-main">Workflows & Timers</h1>
          <p className="page-desc-sub">
            Configure lifecycle stage approval gates, automated timeout escalations, and global SLA timers.
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
              background: activeTab === 'workflows' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'workflows' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'workflows' ? 700 : 500,
            }}
            onClick={() => setActiveTab('workflows')}
          >
            <GitBranch size={14} /> Workflow Templates
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'timers' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'timers' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'timers' ? 700 : 500,
            }}
            onClick={() => setActiveTab('timers')}
          >
            <Clock size={14} /> Timers & Thresholds
          </button>
        </div>
      </div>

      {/* TAB 1: WORKFLOW TEMPLATES (Section 8) */}
      {activeTab === 'workflows' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Template Selector Bar */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="modern-card"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  border: activeTemplate === 'standard' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: activeTemplate === 'standard' ? '#F8FAFC' : 'var(--surface)',
                  textAlign: 'left',
                }}
                onClick={() => setActiveTemplate('standard')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14.5px', color: 'var(--text-main)' }}>Standard Ticket Template</strong>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                    Published
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Default flow for Incidents, Service Requests, and general issues.
                </p>
              </button>

              <button
                type="button"
                className="modern-card"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  border: activeTemplate === 'changeRequest' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: activeTemplate === 'changeRequest' ? '#F8FAFC' : 'var(--surface)',
                  textAlign: 'left',
                }}
                onClick={() => setActiveTemplate('changeRequest')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14.5px', color: 'var(--text-main)' }}>Change Request Template</strong>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#FFFBEB', color: '#B45309', fontWeight: 700 }}>
                    Draft (Open)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Governance workflow for core banking patches, releases, and infrastructure changes.
                </p>
              </button>
            </div>

            {/* Stages Configuration Card */}
            {activeTemplate === 'standard' ? (
              <div className="modern-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Standard Template Stages & Rules</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      6-stage lifecycle. Assignment is automatic based on classification tree.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Stage 1 */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>1. Submitted</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>End user files request. Severity & SLA auto-calculated.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569' }}>Mandatory</span>
                  </div>

                  {/* Stage 2 */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>2. Department Head (HOD) Approval</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Conditional per issue type. If disabled, skips directly to Assignment.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={stdHodApproval}
                        onChange={(e) => {
                          setStdHodApproval(e.target.checked)
                          markDirty()
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>

                  {/* Stage 3 */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>3. Assignment</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automatic: 1 or 2 designated engineers pre-mapped in catalog. No approver needed.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>Automatic</span>
                  </div>

                  {/* Stage 4 */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>4. In Progress</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Technician establishes ETA, due date, exchanges clarifications, and executes fix.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569' }}>Mandatory</span>
                  </div>

                  {/* Stage 4b: Testing */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>5. Testing Verification (QA Gate)</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Optional for standard tickets. When disabled, shows as &quot;Skipped (not required)&quot;.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={stdTestingRequired}
                        onChange={(e) => {
                          setStdTestingRequired(e.target.checked)
                          markDirty()
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>

                  {/* Stage 5 */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>6. Resolved & End-User Verification</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Technician enters resolution summary & root cause. End user verifies and closes or reopens.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569' }}>Mandatory</span>
                  </div>
                </div>

                {/* Timeout Behavior */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <label className="form-field-label">On-Timeout Action (When HOD does not respond within SLA limit)</label>
                  <select
                    className="form-input-control"
                    style={{ maxWidth: '380px' }}
                    value={stdTimeoutAction}
                    onChange={(e) => {
                      setStdTimeoutAction(e.target.value)
                      markDirty()
                    }}
                  >
                    <option value="Notify user">Notify user only (Default per 24/10 notes)</option>
                    <option value="Notify and escalate to Admin">Notify user and escalate to Admin Exception Queue</option>
                    <option value="Auto-approve">Auto-approve (Bypass to assignment)</option>
                  </select>
                </div>
              </div>
            ) : (
              /* CHANGE REQUEST TEMPLATE CONFIGURATION */
              <div className="modern-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Change Request Stages & Approvals (Section 7)</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Version A (24/10 Notes Preferred Default): Technician flags CR &rarr; Admin review &rarr; Implementation &rarr; Testing.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* CR Stage 1: HOD Approval */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>1. Department Head (HOD) Approval</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Optional per CR. If disabled, routes directly to Admin Team.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={crHodApproval}
                        onChange={(e) => {
                          setCrHodApproval(e.target.checked)
                          markDirty()
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>

                  {/* CR Stage 2: Admin Review */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>2. Admin Team Architectural Review</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Evaluates rollback risk, maintenance window, and assigns certified implementation engineers.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569' }}>Mandatory</span>
                  </div>

                  {/* CR Stage 3: Management Approval */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>3. Executive Management Approval</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Scope of Work 3.6 option. Can be toggled on/off. When disabled, shows as &quot;Skipped (not required)&quot;.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={crManagementApproval}
                        onChange={(e) => {
                          setCrManagementApproval(e.target.checked)
                          markDirty()
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>

                  {/* CR Stage 4: Implementation */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>4. Implementation Assignment</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned engineers or authorized external vendors execute change within window.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569' }}>Mandatory</span>
                  </div>

                  {/* CR Stage 5: Testing Gate */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>5. Testing Team UAT Sign-Off</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quality Assurance team runs test cases and issues Pass or Fail result. Default: On.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={crTestingRequired}
                        onChange={(e) => {
                          setCrTestingRequired(e.target.checked)
                          markDirty()
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>

                  {/* CR Stage 6: Closure */}
                  <div style={{ padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', display: 'block' }}>6. Final Resolution & Closure</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Post-implementation review and closure verification.</span>
                    </div>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569' }}>Mandatory</span>
                  </div>
                </div>

                {/* Timeout Behavior */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <label className="form-field-label">On-Timeout Action for Change Approvals</label>
                  <select
                    className="form-input-control"
                    style={{ maxWidth: '380px' }}
                    value={crTimeoutAction}
                    onChange={(e) => {
                      setCrTimeoutAction(e.target.value)
                      markDirty()
                    }}
                  >
                    <option value="Notify and escalate to Admin">Notify and escalate to Admin (Recommended)</option>
                    <option value="Notify user">Notify requester only</option>
                    <option value="Auto-approve">Auto-approve (Emergency bypass)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Stepper Preview (Section 8) */}
          <div className="modern-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--primary)', fontWeight: 700 }}>
              <Eye size={16} /> End-User Stepper Live Preview
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              How users and technicians will see the stage progression on their ticket details:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>1</span>
                <span>Submitted</span>
              </div>

              {activeTemplate === 'standard' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle" style={{ width: '22px', height: '22px', fontSize: '11px', background: stdHodApproval ? '#EFF6FF' : '#F1F5F9', color: stdHodApproval ? '#1D4ED8' : '#94A3B8' }}>2</span>
                    <span style={{ color: stdHodApproval ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      HOD Approval {!stdHodApproval && '(Skipped)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>3</span>
                    <span>Assignment (Automatic)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>4</span>
                    <span>In Progress</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle" style={{ width: '22px', height: '22px', fontSize: '11px', background: stdTestingRequired ? '#EFF6FF' : '#F1F5F9', color: stdTestingRequired ? '#1D4ED8' : '#94A3B8' }}>5</span>
                    <span style={{ color: stdTestingRequired ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      Testing {!stdTestingRequired && '(Skipped)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>6</span>
                    <span>Resolved & Closure</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle" style={{ width: '22px', height: '22px', fontSize: '11px', background: crHodApproval ? '#EFF6FF' : '#F1F5F9', color: crHodApproval ? '#1D4ED8' : '#94A3B8' }}>2</span>
                    <span style={{ color: crHodApproval ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      HOD Approval {!crHodApproval && '(Skipped)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>3</span>
                    <span>Admin Architectural Review</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle" style={{ width: '22px', height: '22px', fontSize: '11px', background: crManagementApproval ? '#EFF6FF' : '#F1F5F9', color: crManagementApproval ? '#1D4ED8' : '#94A3B8' }}>4</span>
                    <span style={{ color: crManagementApproval ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      Management Approval {!crManagementApproval && '(Skipped)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>5</span>
                    <span>Implementation</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle" style={{ width: '22px', height: '22px', fontSize: '11px', background: crTestingRequired ? '#EFF6FF' : '#F1F5F9', color: crTestingRequired ? '#1D4ED8' : '#94A3B8' }}>6</span>
                    <span style={{ color: crTestingRequired ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      Testing Team QA {!crTestingRequired && '(Skipped)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span className="user-avatar-circle avatar-indigo" style={{ width: '22px', height: '22px', fontSize: '11px' }}>7</span>
                    <span>Resolved & Verified</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMERS & THRESHOLDS (Section 10) */}
      {activeTab === 'timers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {/* Card 1: HOD Escalation Timer */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  Resolved Ticket Unclosed Escalation (Days)
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Notifies Department Head if resolved ticket remains unclosed
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              When a technician marks a ticket resolved, the end user has N days to verify. If unclosed after this threshold, an escalation reminder is automatically dispatched to the user&apos;s HOD. (Nothing closes automatically).
            </p>

            <div className="form-field-group">
              <label className="form-field-label">Reminder Threshold (Days) *</label>
              <input
                type="number"
                min={1}
                max={30}
                required
                className="form-input-control"
                value={hodReminderDays}
                onChange={(e) => {
                  setHodReminderDays(parseInt(e.target.value) || 3)
                  markDirty()
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Default: 3 days</span>
            </div>
          </div>

          {/* Card 2: Creation Block Threshold */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  New Ticket Block Threshold (Unclosed Count)
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Prevents users with pending resolved tickets from filing new requests
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              If an end user accumulates N or more resolved tickets awaiting verification, new ticket submission is disabled with a prominent banner prompting them to verify outstanding tickets first.
            </p>

            <div className="form-field-group">
              <label className="form-field-label">Maximum Unclosed Resolved Tickets *</label>
              <input
                type="number"
                min={1}
                max={20}
                required
                className="form-input-control"
                value={closureThreshold}
                onChange={(e) => {
                  setClosureThreshold(parseInt(e.target.value) || 5)
                  markDirty()
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Default: 5 tickets</span>
            </div>
          </div>

          {/* Card 3: Default HOD Approval Time Limit */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FFFBEB', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  Default HOD Approval Limit (Hours)
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Fallback approval limit if not overridden per issue type
                </span>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Default Approval Limit (Hours) *</label>
              <input
                type="number"
                min={1}
                max={72}
                required
                className="form-input-control"
                value={hodDefaultTimeoutHours}
                onChange={(e) => {
                  setHodDefaultTimeoutHours(parseInt(e.target.value) || 24)
                  markDirty()
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Default: 24 hours</span>
            </div>
          </div>

          {/* Card 4: Timeout Action Policy */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                  Global Approval Timeout Behavior
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Action executed when HOD timer expires
                </span>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Default Timeout Action *</label>
              <select
                className="form-input-control"
                value={defaultTimeoutBehavior}
                onChange={(e) => {
                  setDefaultTimeoutBehavior(e.target.value)
                  markDirty()
                }}
              >
                <option value="Notify user">Notify user (Default)</option>
                <option value="Notify and escalate to Admin">Notify and escalate to Admin Exception Queue</option>
                <option value="Auto-approve">Auto-approve (Bypass to assignment)</option>
              </select>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Section 8: On-timeout notification rules
              </span>
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
              You have unsaved changes in Workflows & Timers.
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

