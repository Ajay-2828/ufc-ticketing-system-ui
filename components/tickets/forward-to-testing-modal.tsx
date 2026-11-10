'use client'

import React, { useState } from 'react'
import { X, FlaskConical, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ForwardToTestingModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirm: (
    ticketId: string,
    notes: string,
    environment: string,
    tester: string
  ) => void
}

export function ForwardToTestingModal({
  ticket,
  onClose,
  onConfirm,
}: ForwardToTestingModalProps) {
  const [notes, setNotes] = useState('')
  const [environment, setEnvironment] = useState('UAT / Staging (Default)')
  const [tester, setTester] = useState('Fatima Al-Zadjali')

  const environments = [
    'UAT / Staging (Default)',
    'Sandbox / Pre-Prod',
    'Core Banking DR Environment',
    'Branch Pilot Testbed',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim()) return
    onConfirm(ticket.id, notes.trim(), environment, tester)
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow" style={{ color: '#BE185D', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FlaskConical size={14} /> Quality Assurance Hand-off
            </div>
            <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800 }}>
              Complete Work &amp; Forward to Testing Team
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
            {/* Ticket Summary */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--bg-subtle, #F8FAFC)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
                {ticket.id} &bull; {ticket.app || ticket.subClassification}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                {ticket.subject}
              </p>
            </div>

            {/* Implementation Notes */}
            <div>
              <label className="form-label-control" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                Implementation Notes &amp; Artifacts Deployed <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                required
                className="form-input-control"
                placeholder="Detail the code hotfix, database schema updates, or configuration parameters deployed for QA verification..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Target QA Environment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label-control">Target QA Environment</label>
                <select
                  className="form-input-control"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                >
                  {environments.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-control">Assigned QA Tester</label>
                <select
                  className="form-input-control"
                  value={tester}
                  onChange={(e) => setTester(e.target.value)}
                >
                  <option value="Fatima Al-Zadjali">Fatima Al-Zadjali (QA Lead)</option>
                  <option value="Maya Patel">Maya Patel (Peer QA)</option>
                  <option value="SecureNet Ops">SecureNet Ops (Security QA)</option>
                </select>
              </div>
            </div>

            {/* Workflow Notice */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FDF2F8',
                border: '1px solid #FBCFE8',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ShieldCheck size={18} color="#BE185D" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: '#9D174D', lineHeight: 1.4 }}>
                The ticket status will transition to <strong>In Testing</strong> and appear in the Testing Queue. If QA verification passes, the ticket will advance to <strong>Resolved</strong>. If defects are found, it will return to your queue.
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
              style={{ background: '#BE185D', borderColor: '#9D174D' }}
            >
              <FlaskConical size={14} /> Complete Work &amp; Forward to Testing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

