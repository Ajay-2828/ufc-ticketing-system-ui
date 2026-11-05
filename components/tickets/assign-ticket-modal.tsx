'use client'

import React, { useState } from 'react'
import { X, UserCheck, Calendar, Clock } from 'lucide-react'
import { Ticket, TicketPriority } from '@/app/ticket-data'

interface AssignTicketModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirmAssign: (
    ticketId: string,
    assignee: string,
    priority: TicketPriority,
    eta: string,
    dueDate: string,
    remarks: string,
    vendor?: string
  ) => void
}

export function AssignTicketModal({
  ticket,
  onClose,
  onConfirmAssign,
}: AssignTicketModalProps) {
  const [assignee, setAssignee] = useState(
    ticket.assignee !== 'Unassigned' ? ticket.assignee : 'Daniel Mensah'
  )
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority || 'P2')
  const [eta, setEta] = useState(ticket.eta || 'Today, 17:00')
  const [dueDate, setDueDate] = useState(ticket.dueDate || '5 Nov 2026')
  const [vendor, setVendor] = useState(ticket.vendor || '—')
  const [remarks, setRemarks] = useState('')

  const techniciansList = [
    { name: 'Daniel Mensah', title: 'Senior Support Engineer (L2)', role: 'Internal IT Engineer' },
    { name: 'Maya Patel', title: 'Core Banking Technical Consultant', role: 'Technical Consultant' },
    { name: 'Ibrahim Sani', title: 'Infrastructure & EUC Specialist', role: 'Infrastructure Engineer' },
    { name: 'TechServe Ltd', title: 'Authorized External Partner', role: 'External Vendor' },
    { name: 'SecureNet Ops', title: 'Firewall & SOC Vendor', role: 'External Vendor' },
    { name: 'Fatima Al-Zadjali', title: 'QA & Testing Lead', role: 'Testing Team' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirmAssign(ticket.id, assignee, priority, eta, dueDate, remarks, vendor !== '—' ? vendor : undefined)
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
            <div className="page-eyebrow">
              <UserCheck size={14} /> Admin Assignment (Section 3.7)
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              Assign Ticket {ticket.id}
            </h2>
          </div>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body">
            <div style={{ background: 'var(--surface-subtle)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Request Details
              </div>
              <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block', margin: '3px 0' }}>
                {ticket.subject}
              </strong>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Application: <b>{ticket.app}</b> · Department: <b>{ticket.department}</b> · Auto Severity: <b>{ticket.severity}</b>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Assigned Technician / Consultant / Vendor *</label>
              <select
                className="form-input-control"
                value={assignee}
                onChange={(e) => {
                  setAssignee(e.target.value)
                  if (e.target.value.includes('TechServe') || e.target.value.includes('SecureNet')) {
                    setVendor(e.target.value)
                  }
                }}
              >
                {techniciansList.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} — {t.title} ({t.role})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="form-field-group">
                <label className="form-field-label">Priority Level *</label>
                <select
                  className="form-input-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                >
                  <option value="P1">P1 - Critical / Outage</option>
                  <option value="P2">P2 - High Urgency</option>
                  <option value="P3">P3 - Medium Standard</option>
                  <option value="P4">P4 - Low / Minor</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Target ETA *</label>
                <input
                  type="text"
                  className="form-input-control"
                  placeholder="e.g. Today, 16:30"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Due Date *</label>
                <input
                  type="text"
                  className="form-input-control"
                  placeholder="e.g. 6 Nov 2026"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">External Vendor Assignment (If applicable)</label>
              <select
                className="form-input-control"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              >
                <option value="—">None (Internal UFC Staff)</option>
                <option value="TechServe Ltd">TechServe Ltd (Infrastructure & Network)</option>
                <option value="SecureNet">SecureNet (Firewall & Cyber)</option>
              </select>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Assignment Remarks / Instructions</label>
              <textarea
                rows={3}
                className="form-textarea-control"
                placeholder="Specific guidance, troubleshooting suggestions, or priority context for the engineer..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-dialog-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <UserCheck size={16} /> Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

