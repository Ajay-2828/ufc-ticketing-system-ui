'use client'

import React, { useState } from 'react'
import { X, GitBranch, ShieldCheck, ArrowRight, UserCheck, CheckCircle2, AlertCircle, FlaskConical } from 'lucide-react'
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
  const requiresHodApproval = true

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
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog-header">
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '2px',
              }}
            >
              <GitBranch size={14} /> System Change Workflow
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
              Convert to Change Request
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Use this when resolving the issue requires code updates, database scripts, or server configuration changes.
            </p>
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

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            className="modal-dialog-body"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
            }}
          >
            {/* Ticket Context Card */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: '#F8FAFC',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.02em' }}>
                  {ticket.id} &bull; {ticket.app || ticket.subClassification}
                </span>
                <p style={{ margin: '2px 0 0', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {ticket.subject}
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: '#EDE9FE',
                  color: '#6D28D9',
                  border: '1px solid #DDD6FE',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <GitBranch size={12} /> Standard Ticket &rarr; Change Request
              </span>
            </div>

            {/* Humanized Justification & Scope */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label-control" style={{ fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  What needs to be changed and why? <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Required for approvers
                </span>
              </div>
              <textarea
                rows={3}
                required
                className="form-input-control"
                placeholder="Explain what technical changes are needed (e.g., updating a database table script, fixing a software bug, modifying server configurations, or applying a system patch)..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                style={{ resize: 'vertical', fontSize: '13px', lineHeight: 1.5 }}
              />
              <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                This helps the Admin Team and Department Head understand why standard troubleshooting isn&apos;t enough.
              </p>
            </div>

            {/* Friendly Lifecycle Steps */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  What happens next
                </span>
                <span style={{ fontSize: '11px', color: '#7E22CE', fontStyle: 'italic' }}>
                  You&apos;ll be notified at every step
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
                  gap: '8px',
                }}
              >
                <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E9D5FF', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#7C3AED' }}>STEP 1</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>Admin Review</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Technical safety</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E9D5FF', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#7C3AED' }}>STEP 2</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>HOD Approval</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Business sign-off</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E9D5FF', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#7C3AED' }}>STEP 3</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>Implement Fix</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Apply code/script</div>
                </div>

                <div style={{ background: '#FDF2F8', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FBCFE8', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#BE185D' }}>STEP 4</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#9D174D', marginTop: '2px' }}>QA Testing</div>
                  <div style={{ fontSize: '10px', color: '#BE185D' }}>Verify in staging</div>
                </div>

                <div style={{ background: '#F0FDF4', padding: '8px 10px', borderRadius: '8px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#16A34A' }}>STEP 5</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#15803D', marginTop: '2px' }}>Ready to Close</div>
                  <div style={{ fontSize: '10px', color: '#16A34A' }}>User verification</div>
                </div>
              </div>
            </div>

            {/* Enterprise Governance Policy Notice */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={16} color="#7C3AED" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6D28D9' }}>
                  Mandatory Multi-Stage Authorization Chain
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#5B21B6', lineHeight: 1.5 }}>
                Under banking IT governance, all Change Requests must be reviewed by the <strong>Admin Team</strong> for technical risk assessment, and then authorized by the requester&apos;s <strong>Department Head (HOD)</strong> before technical work can begin.
              </p>
            </div>

            {/* QA Testing Reassurance */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={16} color="#16A34A" />
              </div>
              <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.45 }}>
                <strong>Quality Check Included:</strong> Once your fix is ready, our <strong>Testing Team</strong> will automatically verify it in a staging environment before anything is rolled out to the user.
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
              style={{ background: '#7C3AED', borderColor: '#6D28D9', gap: '8px' }}
            >
              <GitBranch size={15} /> Convert to Change Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

