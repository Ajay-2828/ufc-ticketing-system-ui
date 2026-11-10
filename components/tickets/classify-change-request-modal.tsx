'use client'

import React, { useState } from 'react'
import { X, GitBranch, ShieldCheck, ArrowRight, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ClassifyChangeRequestModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirm: (
    ticketId: string,
    justification: string,
    requiresHodApproval: boolean
  ) => void
}

export function ClassifyChangeRequestModal({
  ticket,
  onClose,
  onConfirm,
}: ClassifyChangeRequestModalProps) {
  const [justification, setJustification] = useState('')
  const [requiresHodApproval, setRequiresHodApproval] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!justification.trim()) return
    onConfirm(ticket.id, justification.trim(), requiresHodApproval)
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow" style={{ color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitBranch size={14} /> Change Request Workflow
            </div>
            <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800 }}>
              Classify / Refer Ticket as Change Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="icon-action-btn"
            style={{ width: '32px', height: '32px' }}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Ticket Info Card */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--bg-subtle, #F8FAFC)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                  {ticket.id} &bull; {ticket.app || ticket.subClassification}
                </span>
                <p style={{ margin: '2px 0 0', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {ticket.subject}
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#EDE9FE',
                  color: '#6D28D9',
                }}
              >
                Standard ➔ CR Transition
              </span>
            </div>

            {/* Technical Justification */}
            <div>
              <label className="form-label-control" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                Technical Justification & Scope <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                required
                className="form-input-control"
                placeholder="Explain why this ticket requires change management governance (e.g. core codebase modification, database schema migration, production configuration release)..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* SOW 3.6 Governance Pipeline Visual */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Change Request Lifecycle Stages
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#4C1D95', fontWeight: 600, flexWrap: 'wrap' }}>
                <span style={{ background: '#EDE9FE', padding: '2px 6px', borderRadius: '4px' }}>1. User / Intake</span>
                <span>➔</span>
                <span style={{ background: '#EDE9FE', padding: '2px 6px', borderRadius: '4px', border: '1px solid #C4B5FD', color: '#6D28D9' }}>2. Admin Review</span>
                <span>➔</span>
                <span style={{ background: '#EDE9FE', padding: '2px 6px', borderRadius: '4px' }}>3. HOD Approval</span>
                <span>➔</span>
                <span style={{ background: '#EDE9FE', padding: '2px 6px', borderRadius: '4px' }}>4. Management</span>
                <span>➔</span>
                <span style={{ background: '#EDE9FE', padding: '2px 6px', borderRadius: '4px' }}>5. Implementation</span>
                <span>➔</span>
                <span style={{ background: '#FCE7F3', padding: '2px 6px', borderRadius: '4px', color: '#BE185D' }}>6. Testing</span>
                <span>➔</span>
                <span style={{ background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px', color: '#15803D' }}>7. Closure</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>
                If rejected at any stage, all stakeholders will be automatically notified.
              </p>
            </div>

            {/* Configurable HOD Approval Flow Selection */}
            <div>
              <label className="form-label-control" style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Department Head (HOD) Approval Routing
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Option 1: Standard Multi-Stage Governance */}
                <div
                  onClick={() => setRequiresHodApproval(true)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: `2px solid ${requiresHodApproval ? 'var(--purple, #7C3AED)' : 'var(--border)'}`,
                    background: requiresHodApproval ? 'rgba(124, 58, 237, 0.05)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: requiresHodApproval ? '#6D28D9' : 'var(--text-main)' }}>
                      Standard Governance
                    </span>
                    <input
                      type="radio"
                      name="crApprovalOption"
                      checked={requiresHodApproval}
                      onChange={() => setRequiresHodApproval(true)}
                      style={{ accentColor: '#7C3AED' }}
                    />
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Routes directly to <strong>Admin Team first</strong> for technical review. Upon Admin sign-off, forwards to requester&apos;s <strong>Department Head</strong> for business sign-off.
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: '#7C3AED' }}>
                    ➔ Admin Review, then Department Head Approval
                  </div>
                </div>

                {/* Option 2: Expedited Direct Implementation */}
                <div
                  onClick={() => setRequiresHodApproval(false)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: `2px solid ${!requiresHodApproval ? 'var(--primary, #2563EB)' : 'var(--border)'}`,
                    background: !requiresHodApproval ? 'rgba(37, 99, 235, 0.05)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: !requiresHodApproval ? '#2563EB' : 'var(--text-main)' }}>
                      Pre-Approved / Expedited
                    </span>
                    <input
                      type="radio"
                      name="crApprovalOption"
                      checked={!requiresHodApproval}
                      onChange={() => setRequiresHodApproval(false)}
                      style={{ accentColor: '#2563EB' }}
                    />
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    HOD business approval is waived (routine change). Ticket is sent to <strong>Admin Team first</strong> for safety review, then directly to implementation.
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: '#2563EB' }}>
                    ➔ Admin Review, then Direct Implementation
                  </div>
                </div>
              </div>
            </div>

            {/* QA Testing Notice */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
                <strong>Quality Assurance:</strong> Once implementation work is completed, the ticket will be automatically forwarded to the <strong>Testing Team</strong> for QA validation before closure.
              </div>
            </div>
          </div>

          <div className="modal-dialog-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ background: '#7C3AED', borderColor: '#6D28D9' }}
            >
              <GitBranch size={14} /> Classify &amp; Route Change Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

