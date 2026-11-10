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
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Layers,
  FlaskConical,
  UserCheck,
  Building2,
  Users,
  SlidersHorizontal,
  Check,
  ToggleLeft,
  ToggleRight,
  FileCheck,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { policySettings, standardSeveritySLAs } from '@/app/ticket-data'

export function WorkflowsAndTimers() {
  // Navigation Tabs: Workflows vs Timers & SLAs (Section 15.2 Rule)
  const [activeTab, setActiveTab] = useState<'workflows' | 'timers'>('workflows')

  // Workflow Pipeline Selection: Standard Ticket vs Change Request (Section 8 Rule)
  const [selectedWorkflow, setSelectedWorkflow] = useState<'standard' | 'changeRequest'>('standard')

  // Standard Ticket Flow Stage Controls
  const [stdHodApproval, setStdHodApproval] = useState(true)
  const [stdTestingRequired, setStdTestingRequired] = useState(false)
  const [stdTimeoutAction, setStdTimeoutAction] = useState('Notify and escalate to Admin')
  const [stdHodTimeoutHours, setStdHodTimeoutHours] = useState(24)

  // Change Request Flow Stage Controls (Section 7 & User Explicit Rules)
  const [crHodApproval, setCrHodApproval] = useState(true)
  const [crManagementApproval, setCrManagementApproval] = useState(true)
  const [crTestingRequired, setCrTestingRequired] = useState(true)
  const [crTimeoutAction, setCrTimeoutAction] = useState('Notify and escalate to Admin')
  const [crHodTimeoutHours, setCrHodTimeoutHours] = useState(24)

  // Global Timers & Operational Thresholds (Section 10 Rule)
  const [closureThreshold, setClosureThreshold] = useState(policySettings.unresolvedClosureThreshold || 5)
  const [hodReminderDays, setHodReminderDays] = useState(policySettings.hodReminderDays || 3)
  const [hodDefaultTimeoutHours, setHodDefaultTimeoutHours] = useState(policySettings.hodDefaultTimeoutHours || 24)
  const [defaultTimeoutBehavior, setDefaultTimeoutBehavior] = useState('Notify and escalate to Admin')

  // System-Wide SLA Targets (P1 - P4)
  const [p1Resolution, setP1Resolution] = useState(standardSeveritySLAs.Critical.resolutionHours)
  const [p1Response, setP1Response] = useState(standardSeveritySLAs.Critical.responseHours)

  const [p2Resolution, setP2Resolution] = useState(standardSeveritySLAs.High.resolutionHours)
  const [p2Response, setP2Response] = useState(standardSeveritySLAs.High.responseHours)

  const [p3Resolution, setP3Resolution] = useState(standardSeveritySLAs.Medium.resolutionHours)
  const [p3Response, setP3Response] = useState(standardSeveritySLAs.Medium.responseHours)

  const [p4Resolution, setP4Resolution] = useState(standardSeveritySLAs.Low.resolutionHours)
  const [p4Response, setP4Response] = useState(standardSeveritySLAs.Low.responseHours)

  // Unsaved changes tracker
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const markDirty = () => setHasUnsavedChanges(true)

  const handleSave = () => {
    // Persist global policy settings
    policySettings.unresolvedClosureThreshold = closureThreshold
    policySettings.hodReminderDays = hodReminderDays
    policySettings.hodDefaultTimeoutHours = hodDefaultTimeoutHours

    // Persist system-wide severity SLAs
    standardSeveritySLAs.Critical.resolutionHours = p1Resolution
    standardSeveritySLAs.Critical.responseHours = p1Response
    standardSeveritySLAs.High.resolutionHours = p2Resolution
    standardSeveritySLAs.High.responseHours = p2Response
    standardSeveritySLAs.Medium.resolutionHours = p3Resolution
    standardSeveritySLAs.Medium.responseHours = p3Response
    standardSeveritySLAs.Low.resolutionHours = p4Resolution
    standardSeveritySLAs.Low.responseHours = p4Response

    setHasUnsavedChanges(false)
    triggerToast('Workflow pipelines & operational timers saved successfully!')
  }

  const handleDiscard = () => {
    // Revert workflow stage switches
    setStdHodApproval(true)
    setStdTestingRequired(false)
    setStdTimeoutAction('Notify and escalate to Admin')
    setStdHodTimeoutHours(24)

    setCrHodApproval(true)
    setCrManagementApproval(true)
    setCrTestingRequired(true)
    setCrTimeoutAction('Notify and escalate to Admin')
    setCrHodTimeoutHours(24)

    // Revert thresholds
    setClosureThreshold(policySettings.unresolvedClosureThreshold || 5)
    setHodReminderDays(policySettings.hodReminderDays || 3)
    setHodDefaultTimeoutHours(policySettings.hodDefaultTimeoutHours || 24)
    setDefaultTimeoutBehavior('Notify and escalate to Admin')

    // Revert SLAs
    setP1Resolution(standardSeveritySLAs.Critical.resolutionHours)
    setP1Response(standardSeveritySLAs.Critical.responseHours)
    setP2Resolution(standardSeveritySLAs.High.resolutionHours)
    setP2Response(standardSeveritySLAs.High.responseHours)
    setP3Resolution(standardSeveritySLAs.Medium.resolutionHours)
    setP3Response(standardSeveritySLAs.Medium.responseHours)
    setP4Resolution(standardSeveritySLAs.Low.resolutionHours)
    setP4Response(standardSeveritySLAs.Low.responseHours)

    setHasUnsavedChanges(false)
    triggerToast('All changes reverted to default policies.')
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
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

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title-main" style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
            Workflows &amp; Timers
          </h1>
          <p className="page-desc-sub" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            Configure lifecycle stage pipelines, approval pathways, operational thresholds, and system SLAs.
          </p>
        </div>

        {/* Tab Switcher: Workflows vs Timers & SLAs */}
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
              gap: '6px',
            }}
            onClick={() => setActiveTab('workflows')}
          >
            <GitBranch size={14} /> Workflow Pipelines
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
              gap: '6px',
            }}
            onClick={() => setActiveTab('timers')}
          >
            <Clock size={14} /> Timers &amp; SLAs
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WORKFLOW PIPELINES (Section 8 Rule) */}
      {/* ========================================================================= */}
      {activeTab === 'workflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Template Selector Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {/* Standard Ticket Workflow Card */}
            <div
              onClick={() => setSelectedWorkflow('standard')}
              style={{
                padding: '16px 18px',
                borderRadius: '10px',
                border: `2px solid ${selectedWorkflow === 'standard' ? 'var(--primary)' : 'var(--border)'}`,
                background: selectedWorkflow === 'standard' ? 'var(--primary-soft)' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: selectedWorkflow === 'standard' ? 'var(--primary)' : '#EFF6FF',
                    color: selectedWorkflow === 'standard' ? '#FFFFFF' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileCheck size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '14.5px', color: 'var(--text-main)' }}>
                      Standard Ticket Flow
                    </strong>
                    <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Published
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Standard Incidents &amp; Service Requests
                  </span>
                </div>
              </div>
              <ChevronRight size={16} color={selectedWorkflow === 'standard' ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>

            {/* Change Request Workflow Card */}
            <div
              onClick={() => setSelectedWorkflow('changeRequest')}
              style={{
                padding: '16px 18px',
                borderRadius: '10px',
                border: `2px solid ${selectedWorkflow === 'changeRequest' ? '#7C3AED' : 'var(--border)'}`,
                background: selectedWorkflow === 'changeRequest' ? '#FAF5FF' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: selectedWorkflow === 'changeRequest' ? '#7C3AED' : '#F5F3FF',
                    color: selectedWorkflow === 'changeRequest' ? '#FFFFFF' : '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GitBranch size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '14.5px', color: 'var(--text-main)' }}>
                      Change Request Flow
                    </strong>
                    <span style={{ fontSize: '10px', background: '#EDE9FE', color: '#6D28D9', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Active
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    HOD/Admin Review ➔ Testing ➔ Closure
                  </span>
                </div>
              </div>
              <ChevronRight size={16} color={selectedWorkflow === 'changeRequest' ? '#7C3AED' : 'var(--text-muted)'} />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PIPELINE 1: STANDARD TICKET FLOW */}
          {/* ========================================================================= */}
          {selectedWorkflow === 'standard' && (
            <div className="modern-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Standard Ticket Lifecycle Pipeline
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Applied automatically to all general incidents and service requests across UFC Desk.
                  </p>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                  Active Template: Standard Workflow
                </span>
              </div>

              {/* Visual Interactive Pipeline Stepper */}
              <div
                style={{
                  padding: '20px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  marginBottom: '24px',
                  overflowX: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', minWidth: '700px', justifyContent: 'space-between' }}>
                  {/* Stage 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '130px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #BFDBFE' }}>
                      1
                    </div>
                    <strong style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Ticket Created</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>End User Intake</span>
                  </div>

                  <ArrowRight size={16} color="#94A3B8" />

                  {/* Stage 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '150px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: stdHodApproval ? '#FEF3C7' : '#F1F5F9', color: stdHodApproval ? '#B45309' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: `2px solid ${stdHodApproval ? '#FDE68A' : '#CBD5E1'}` }}>
                      2
                    </div>
                    <strong style={{ fontSize: '12.5px', color: stdHodApproval ? 'var(--text-main)' : '#94A3B8' }}>
                      {stdHodApproval ? 'HOD Approval' : 'HOD Skipped'}
                    </strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {stdHodApproval ? 'Dept Manager (24h)' : 'Bypassed straight to IT'}
                    </span>
                  </div>

                  <ArrowRight size={16} color="#94A3B8" />

                  {/* Stage 3 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '140px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #BFDBFE' }}>
                      3
                    </div>
                    <strong style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Auto-Assignment</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Catalog Technicians</span>
                  </div>

                  <ArrowRight size={16} color="#94A3B8" />

                  {/* Stage 4 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '130px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #BFDBFE' }}>
                      4
                    </div>
                    <strong style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Technician Work</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>In Progress &bull; SLA</span>
                  </div>

                  <ArrowRight size={16} color="#94A3B8" />

                  {/* Stage 5 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '140px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #BBF7D0' }}>
                      5
                    </div>
                    <strong style={{ fontSize: '12.5px', color: '#15803D' }}>Resolved &amp; Closed</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>User Verifies Closure</span>
                  </div>
                </div>
              </div>

              {/* Stage Configuration Options */}
              <h4 style={{ margin: '0 0 14px', fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                Stage Rules &amp; Governance Switches
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {/* Control 1: HOD Approval Switch */}
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCheck size={18} color="var(--primary)" />
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                        Department Head (HOD) Approval
                      </strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={stdHodApproval}
                        onChange={(e) => {
                          setStdHodApproval(e.target.checked)
                          markDirty()
                        }}
                      />
                    </label>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 12px' }}>
                    Require initial sign-off from the user&apos;s manager before routing to technicians. When disabled, standard tickets skip straight to automated assignment.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Approval SLA (Hours)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={72}
                        className="form-input-control"
                        style={{ height: '32px', fontSize: '12.5px' }}
                        value={stdHodTimeoutHours}
                        disabled={!stdHodApproval}
                        onChange={(e) => {
                          setStdHodTimeoutHours(parseInt(e.target.value) || 24)
                          markDirty()
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Timeout Action
                      </label>
                      <select
                        className="form-input-control"
                        style={{ height: '32px', fontSize: '12px' }}
                        value={stdTimeoutAction}
                        disabled={!stdHodApproval}
                        onChange={(e) => {
                          setStdTimeoutAction(e.target.value)
                          markDirty()
                        }}
                      >
                        <option value="Notify and escalate to Admin">Escalate to Admin</option>
                        <option value="Notify user">Notify requester</option>
                        <option value="Auto-approve">Auto-approve</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Control 2: End-User Verification & Reopen Rule */}
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={18} color="#16A34A" />
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                      End-User Closure &amp; Reopen Guard
                    </strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 12px' }}>
                    Tickets are never auto-closed. When a technician marks resolved, the user verifies the resolution.
                  </p>
                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', fontSize: '11.5px', color: 'var(--text-main)', border: '1px solid #E2E8F0' }}>
                    &bull; <strong>Reopen Exception:</strong> If the user reopens a ticket, it bypasses the original technician and routes directly to the Admin Queue for audit.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PIPELINE 2: CHANGE REQUEST FLOW (Section 7 Rule) */}
          {/* ========================================================================= */}
          {selectedWorkflow === 'changeRequest' && (
            <div className="modern-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Change Request Governance Pipeline
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Standard Flow: Admin Review ➔ Department Head Approval ➔ Management Sign-off ➔ Implementation ➔ Testing ➔ Closure.
                  </p>
                </div>
                <span style={{ fontSize: '11.5px', color: '#6D28D9', background: '#EDE9FE', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                  Active Template: Change Governance Workflow
                </span>
              </div>

              {/* Visual Interactive Pipeline Stepper */}
              <div
                style={{
                  padding: '20px',
                  background: '#FAF5FF',
                  borderRadius: '10px',
                  border: '1px solid #E9D5FF',
                  marginBottom: '24px',
                  overflowX: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', minWidth: '860px', justifyContent: 'space-between' }}>
                  {/* Stage 1: User / Initiation */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '120px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #DDD6FE' }}>
                      1
                    </div>
                    <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>User / Intake</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Classified as CR</span>
                  </div>

                  <ArrowRight size={16} color="#C4B5FD" />

                  {/* Stage 2: Administration Team Review (FIRST!) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '130px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EDE9FE', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #C4B5FD' }}>
                      2
                    </div>
                    <strong style={{ fontSize: '12px', color: '#6D28D9' }}>Admin Team Review</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>1st Review &bull; CAB Scope</span>
                  </div>

                  <ArrowRight size={16} color="#C4B5FD" />

                  {/* Stage 3: Department Head Approval (SECOND!) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '130px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: crHodApproval ? '#EDE9FE' : '#F1F5F9', color: crHodApproval ? '#6D28D9' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: `2px solid ${crHodApproval ? '#C4B5FD' : '#CBD5E1'}` }}>
                      3
                    </div>
                    <strong style={{ fontSize: '12px', color: crHodApproval ? 'var(--text-main)' : '#94A3B8' }}>
                      {crHodApproval ? 'HOD Approval' : 'HOD Skipped'}
                    </strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {crHodApproval ? '2nd Approval &bull; Dept Head' : 'Bypassed per policy'}
                    </span>
                  </div>

                  <ArrowRight size={16} color="#C4B5FD" />

                  {/* Stage 4: Management Approval (THIRD!) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '120px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: crManagementApproval ? '#EDE9FE' : '#F1F5F9', color: crManagementApproval ? '#6D28D9' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: `2px solid ${crManagementApproval ? '#C4B5FD' : '#CBD5E1'}` }}>
                      4
                    </div>
                    <strong style={{ fontSize: '12px', color: crManagementApproval ? 'var(--text-main)' : '#94A3B8' }}>
                      {crManagementApproval ? 'Management' : 'Skipped'}
                    </strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>3rd Approval &bull; Exec</span>
                  </div>

                  <ArrowRight size={16} color="#C4B5FD" />

                  {/* Stage 5: Implementation Assignment */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '130px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #BFDBFE' }}>
                      5
                    </div>
                    <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>Implementation</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Assigned Technician</span>
                  </div>

                  <ArrowRight size={16} color="#C4B5FD" />

                  {/* Stage 6: Testing */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '120px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FCE7F3', color: '#BE185D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #FBCFE8' }}>
                      6
                    </div>
                    <strong style={{ fontSize: '12px', color: '#9D174D' }}>Testing</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Testing Team QA</span>
                  </div>

                  <ArrowRight size={16} color="#C4B5FD" />

                  {/* Stage 7: Closure */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', width: '110px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', border: '2px solid #BBF7D0' }}>
                      7
                    </div>
                    <strong style={{ fontSize: '12px', color: '#15803D' }}>Closure</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Requester Signs Off</span>
                  </div>
                </div>
              </div>

              {/* Stage Configuration Options */}
              <h4 style={{ margin: '0 0 14px', fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                Change Approval Stages &amp; Policy Settings
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {/* Control 1: Admin Team Review (1st Review) */}
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #E9D5FF', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={18} color="#7C3AED" />
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                      1. Administration Team Review (First Review)
                    </strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 10px' }}>
                    When classified as a Change Request, tickets are routed directly to the <strong>Administration Team first</strong> for technical risk assessment, rollback plan validation, and change window scheduling.
                  </p>
                  <span style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 700 }}>
                    Mandatory Initial Review &bull; Routes to Admin Queue
                  </span>
                </div>

                {/* Control 2: Department Head Approval (2nd Approval) */}
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #E9D5FF', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCheck size={18} color="#7C3AED" />
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                        2. Department Head Approval (Second)
                      </strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={crHodApproval}
                        onChange={(e) => {
                          setCrHodApproval(e.target.checked)
                          markDirty()
                        }}
                      />
                    </label>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 10px' }}>
                    Once Admin Team validates the scope, ticket routes to requester&apos;s Department Head for formal business sign-off.
                  </p>
                  <span style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 600 }}>
                    Status: {crHodApproval ? 'Enabled (Routes to HOD after Admin review)' : 'Bypassed per configuration'}
                  </span>
                </div>

                {/* Control 3: Management Approval Switch (3rd Approval) */}
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #E9D5FF', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={18} color="#7C3AED" />
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                        3. Management Approval (Third)
                      </strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={crManagementApproval}
                        onChange={(e) => {
                          setCrManagementApproval(e.target.checked)
                          markDirty()
                        }}
                      />
                    </label>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 10px' }}>
                    Require formal authorization from Executive Management (VP Ops / C-level) prior to implementation.
                  </p>
                  <span style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 600 }}>
                    Status: {crManagementApproval ? 'Executive Sign-Off Enabled' : 'Skipped for low-risk changes'}
                  </span>
                </div>

                {/* Control 4: QA Testing & Notification Rule */}
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #FBCFE8', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FlaskConical size={18} color="#BE185D" />
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                        4. Testing Team Verification &amp; Rejection Rule
                      </strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={crTestingRequired}
                        onChange={(e) => {
                          setCrTestingRequired(e.target.checked)
                          markDirty()
                        }}
                      />
                    </label>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 10px' }}>
                    Once technician deploys the change, the ticket is forwarded to the Testing Team. If rejected at any stage, appropriate notifications are dispatched.
                  </p>
                  <span style={{ fontSize: '11px', color: '#BE185D', fontWeight: 700 }}>
                    Rule: Mandatory Testing &bull; If rejected at any stage, notify all stakeholders
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TIMERS & SLAS (Section 10 Rule) */}
      {/* ========================================================================= */}
      {activeTab === 'timers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section A: Operational Governance Thresholds */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Operational Thresholds &amp; Escalation Timers
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Automated safeguards enforcing ticket closure and timely managerial follow-ups.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {/* Threshold 1: Unclosed Tickets Blocker */}
              <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary)" />
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                    Unclosed Tickets Submission Blocker
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 12px' }}>
                  Prevents users from abandoning resolved tickets. Blocks new requests if unclosed count reaches limit.
                </p>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Maximum Unclosed Tickets Threshold *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="form-input-control"
                    style={{ height: '34px', fontSize: '13px', fontWeight: 700 }}
                    value={closureThreshold}
                    onChange={(e) => {
                      setClosureThreshold(parseInt(e.target.value) || 5)
                      markDirty()
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Standard ITSM baseline: 5 tickets
                  </span>
                </div>
              </div>

              {/* Threshold 2: HOD Unclosed Escalation Reminder */}
              <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Clock size={18} color="#EA580C" />
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                    Manager Follow-Up Escalation Reminder
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 12px' }}>
                  When a ticket is marked resolved, the user has $N$ days to verify. If unverified, alerts their HOD.
                </p>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Reminder Threshold (Days) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    className="form-input-control"
                    style={{ height: '34px', fontSize: '13px', fontWeight: 700 }}
                    value={hodReminderDays}
                    onChange={(e) => {
                      setHodReminderDays(parseInt(e.target.value) || 3)
                      markDirty()
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Standard ITSM baseline: 3 days
                  </span>
                </div>
              </div>

              {/* Threshold 3: Approval Timeout Action */}
              <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={18} color="#7C3AED" />
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                    Approval SLA Timeout Fallback
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 12px' }}>
                  Action executed automatically if an approver fails to review a request within the SLA limit ({hodDefaultTimeoutHours}h).
                </p>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Timeout Escalation Behavior *
                  </label>
                  <select
                    className="form-input-control"
                    style={{ height: '34px', fontSize: '12.5px' }}
                    value={defaultTimeoutBehavior}
                    onChange={(e) => {
                      setDefaultTimeoutBehavior(e.target.value)
                      markDirty()
                    }}
                  >
                    <option value="Notify and escalate to Admin">Notify &amp; Escalate to Admin Queue (Recommended)</option>
                    <option value="Notify user">Notify requester only</option>
                    <option value="Auto-approve">Auto-approve (Bypass to IT)</option>
                  </select>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Default: Escalates to Admin Queue for audit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Universal Turnaround SLA Targets Table */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  System-Wide SLA Target Matrix by Severity
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Default turnaround targets applied across tickets. Specific issue types in Classification can override these.
                </p>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', background: '#F1F5F9', padding: '3px 8px', borderRadius: '4px' }}>
                Editable Policy Matrix
              </span>
            </div>

            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Severity Tier</th>
                    <th style={{ width: '34%' }}>Operational Criteria &amp; Target</th>
                    <th style={{ width: '22%' }}>Response SLA (Hours)</th>
                    <th style={{ width: '22%' }}>Resolution SLA (Hours)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* P1 Critical */}
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: '4px' }}>
                          P1 CRITICAL
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>
                        Total Outage / Mission-Critical Blocker
                      </strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Immediate engineer response; continuous work until restored.
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={0.25}
                          min={0.1}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p1Response}
                          onChange={(e) => {
                            setP1Response(parseFloat(e.target.value) || 0.5)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p1Response < 1 ? `(${Math.round(p1Response * 60)}m)` : `(${p1Response}h)`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={0.5}
                          min={0.5}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p1Resolution}
                          onChange={(e) => {
                            setP1Resolution(parseFloat(e.target.value) || 2)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hours target</span>
                      </div>
                    </td>
                  </tr>

                  {/* P2 High */}
                  <tr>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#EA580C', background: '#FFEDD5', padding: '2px 8px', borderRadius: '4px' }}>
                        P2 HIGH
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>
                        Severe Degradation / High Business Impact
                      </strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Significant disruption without acceptable immediate workaround.
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={0.25}
                          min={0.25}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p2Response}
                          onChange={(e) => {
                            setP2Response(parseFloat(e.target.value) || 1)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p2Response < 1 ? `(${Math.round(p2Response * 60)}m)` : `(${p2Response}h)`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={0.5}
                          min={1}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p2Resolution}
                          onChange={(e) => {
                            setP2Resolution(parseFloat(e.target.value) || 4)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hours target</span>
                      </div>
                    </td>
                  </tr>

                  {/* P3 Medium */}
                  <tr>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#854D0E', background: '#FEF9C3', padding: '2px 8px', borderRadius: '4px' }}>
                        P3 MEDIUM
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>
                        Standard Work Request / Moderate Impact
                      </strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Routine operational inquiry or non-critical issue with workaround.
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={0.5}
                          min={0.5}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p3Response}
                          onChange={(e) => {
                            setP3Response(parseFloat(e.target.value) || 2)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p3Response < 1 ? `(${Math.round(p3Response * 60)}m)` : `(${p3Response}h)`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={1}
                          min={1}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p3Resolution}
                          onChange={(e) => {
                            setP3Resolution(parseFloat(e.target.value) || 8)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hours target</span>
                      </div>
                    </td>
                  </tr>

                  {/* P4 Low */}
                  <tr>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', background: '#E2E8F0', padding: '2px 8px', borderRadius: '4px' }}>
                        P4 LOW
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>
                        Low Priority / Minor Request
                      </strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Informational question, setup guidance, or aesthetic request.
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={0.5}
                          min={0.5}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p4Response}
                          onChange={(e) => {
                            setP4Response(parseFloat(e.target.value) || 4)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p4Response < 1 ? `(${Math.round(p4Response * 60)}m)` : `(${p4Response}h)`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          step={1}
                          min={1}
                          className="form-input-control"
                          style={{ width: '90px', height: '32px', fontSize: '12.5px', fontWeight: 700 }}
                          value={p4Resolution}
                          onChange={(e) => {
                            setP4Resolution(parseFloat(e.target.value) || 24)
                            markDirty()
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hours target</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING UNSAVED-CHANGES BAR (Section 15 Rule) */}
      {/* ========================================================================= */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in Workflows &amp; Timers policy.
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
