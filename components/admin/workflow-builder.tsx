'use client'

import React, { useState } from 'react'
import {
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react'

export function WorkflowBuilder() {
  const [activeWorkflow, setActiveWorkflow] = useState<'Standard' | 'Change Request'>('Change Request')
  const [hodApprovalRequired, setHodApprovalRequired] = useState(true)
  const [qaTestingRequired, setQaTestingRequired] = useState(true)
  const [saved, setSaved] = useState(false)

  const [crStages, setCrStages] = useState([
    { id: 1, name: 'Admin Review', role: 'Admin Team', timeout: '4h', enabled: true },
    { id: 2, name: 'Department Head (HOD) Approval', role: 'Department Head', timeout: '24h', enabled: true },
    { id: 3, name: 'Management Team Review', role: 'Management', timeout: '48h', enabled: true },
    { id: 4, name: 'Technical Implementation', role: 'Technician / Vendor', timeout: '48h', enabled: true },
    { id: 5, name: 'QA Testing & Verification', role: 'Testing Team', timeout: '12h', enabled: true },
    { id: 6, name: 'Verification & Closure', role: 'End User / System', timeout: '3 days', enabled: true },
  ])

  const handleToggleHOD = () => {
    const newVal = !hodApprovalRequired
    setHodApprovalRequired(newVal)
    setCrStages((prev) =>
      prev.map((s) => (s.id === 2 ? { ...s, enabled: newVal } : s))
    )
    showSaved()
  }

  const handleToggleTesting = () => {
    const newVal = !qaTestingRequired
    setQaTestingRequired(newVal)
    setCrStages((prev) =>
      prev.map((s) => (s.id === 5 ? { ...s, enabled: newVal } : s))
    )
    showSaved()
  }

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <GitBranch size={14} /> Workflow Engine (ITIL Change & Request Governance)
          </div>
          <h1 className="page-title-main">Workflow & Lifecycle Builder</h1>
          <p className="page-desc-sub">
            Configure approval stages, skip conditions, role responsibilities, and timeout actions
            without code changes.
          </p>
        </div>

        {saved && (
          <div className="alert-card-banner alert-success" style={{ margin: 0, padding: '8px 14px' }}>
            <CheckCircle2 size={16} /> Workflow updated successfully!
          </div>
        )}
      </div>

      {/* Select Workflow */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['Standard Incident Workflow', 'Change Request Workflow'].map((wf) => {
          const isCR = wf.includes('Change Request')
          const isSelected = isCR
            ? activeWorkflow === 'Change Request'
            : activeWorkflow === 'Standard'
          return (
            <button
              key={wf}
              type="button"
              className="btn-secondary"
              style={{
                height: '36px',
                background: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                borderColor: isSelected ? 'var(--primary-border)' : 'var(--border)',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 700 : 500,
              }}
              onClick={() => setActiveWorkflow(isCR ? 'Change Request' : 'Standard')}
            >
              {wf}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Left: Stage Configuration */}
        <div className="modern-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 700 }}>
                {activeWorkflow} Pipeline Stages
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Enable or disable optional gates. Skipped stages are bypassed in the user interface.
              </p>
            </div>
            <button type="button" className="btn-secondary" style={{ height: '32px', fontSize: '12.5px' }}>
              <Plus size={14} /> Add Stage
            </button>
          </div>

          {/* Quick Rules Toggles (Points Discussed #3) */}
          <div
            style={{
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                  Require Department Head (HOD) Approval for Change Requests
                </strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  If disabled, change requests bypass department approval and route directly to Admin.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hodApprovalRequired}
                onChange={handleToggleHOD}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                  Require QA Verification Before Final Closure (Section 3.11)
                </strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Assigned solutions must be tested and passed by QA team prior to resolution.
                </span>
              </div>
              <input
                type="checkbox"
                checked={qaTestingRequired}
                onChange={handleToggleTesting}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Stages List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {crStages.map((stage, idx) => (
              <div
                key={stage.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: stage.enabled ? 'var(--surface)' : '#F8FAFC',
                  opacity: stage.enabled ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: stage.enabled ? 'var(--primary-soft)' : '#E2E8F0',
                    color: stage.enabled ? 'var(--primary)' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Responsible: <b>{stage.role}</b> · Max SLA Timeout: <b>{stage.timeout}</b>
                  </div>
                </div>

                <span
                  className="badge-tag badge-tag-sm"
                  style={{
                    background: stage.enabled ? '#ECFDF5' : '#F1F5F9',
                    color: stage.enabled ? '#047857' : '#64748B',
                  }}
                >
                  {stage.enabled ? 'Active Gate' : 'Skipped'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: End-User Live Preview */}
        <div className="modern-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Eye size={16} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
              Live End-User Stepper Preview
            </h4>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            This is how the progression bar will render for employees viewing a ticket under this
            workflow:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {crStages
              .filter((s) => s.enabled)
              .map((st, i) => (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--emerald)' : i === 1 ? 'var(--primary)' : '#E2E8F0',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {i === 0 ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: i === 1 ? 700 : 500, color: i === 1 ? 'var(--primary)' : 'var(--text-main)' }}>
                    {st.name}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

