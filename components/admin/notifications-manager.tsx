'use client'

import React, { useState } from 'react'
import {
  Bell,
  Mail,
  Smartphone,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Save,
  RotateCcw,
  Code,
  Eye,
} from 'lucide-react'
import { notificationEvents } from '@/app/ticket-data'

export function NotificationsManager() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'templates'>('matrix')
  const [events, setEvents] = useState(notificationEvents)
  const [selectedEventId, setSelectedEventId] = useState(notificationEvents[0].id)
  const [templateSubject, setTemplateSubject] = useState('[UFC Desk] Update on Ticket #{ticket_no}: {subject}')
  const [templateBody, setTemplateBody] = useState(
    'Hello {assignee},\n\nTicket #{ticket_no} ({subject}) filed under {app} has reached a new stage.\n\nPriority: {priority}\nSLA Time Remaining: {sla_time}\n\nPlease click the secure link below to review and act on this request:\nhttps://desk.ufc.om/tickets/{ticket_no}\n\nNote: You can reply directly to this notification email. Your response will be automatically added to the ticket history.\n\nBest regards,\nUFC IT Service Management Gateway'
  )

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const markDirty = () => setHasUnsavedChanges(true)

  const toggleEmail = (id: string) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, defaultEmail: !e.defaultEmail } : e)))
    markDirty()
  }

  const toggleInApp = (id: string) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, defaultInApp: !e.defaultInApp } : e)))
    markDirty()
  }

  const handleInsertVariable = (variable: string) => {
    setTemplateBody((prev) => `${prev} {${variable}} `)
    markDirty()
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    triggerToast('Notification channels & templates saved successfully!')
  }

  const handleDiscard = () => {
    setEvents(notificationEvents)
    setHasUnsavedChanges(false)
    triggerToast('Changes discarded.')
  }

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0]

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
            <Bell size={14} /> Section 11 & 15 · Administration Module
          </div>
          <h1 className="page-title-main">Notification Gateway & Templates</h1>
          <p className="page-desc-sub">
            Channels: In-app and Email. Under Section 11, if a user replies to an email notification, the response is automatically appended to the ticket history.
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
              background: activeTab === 'matrix' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'matrix' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'matrix' ? 700 : 500,
            }}
            onClick={() => setActiveTab('matrix')}
          >
            <Bell size={14} /> Event Delivery Matrix ({events.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'templates' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'templates' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'templates' ? 700 : 500,
            }}
            onClick={() => setActiveTab('templates')}
          >
            <Mail size={14} /> Template Editor
          </button>
        </div>
      </div>

      {/* TAB 1: EVENT DELIVERY MATRIX */}
      {activeTab === 'matrix' && (
        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h3 className="card-title-lg">Event Matrix ({events.length} Standard Triggers)</h3>
              <p className="card-subtitle-sm">
                Toggle delivery channels per event and configure message templates with dynamic merge tokens.
              </p>
            </div>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Lifecycle Event Trigger</th>
                  <th>Target Recipients</th>
                  <th style={{ width: '130px' }}>Email Channel</th>
                  <th style={{ width: '130px' }}>In-App Channel</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Template</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>
                        {ev.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{ev.description}</div>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {ev.recipients}
                      </span>
                    </td>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={ev.defaultEmail}
                          onChange={() => toggleEmail(ev.id)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '13px', color: ev.defaultEmail ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {ev.defaultEmail ? 'Active' : 'Disabled'}
                        </span>
                      </label>
                    </td>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={ev.defaultInApp}
                          onChange={() => toggleInApp(ev.id)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '13px', color: ev.defaultInApp ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {ev.defaultInApp ? 'Active' : 'Disabled'}
                        </span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
                        onClick={() => {
                          setSelectedEventId(ev.id)
                          setActiveTab('templates')
                        }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATE EDITOR */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
          <div className="modern-card" style={{ padding: '24px' }}>
            <div className="form-field-group">
              <label className="form-field-label">Selected Notification Event</label>
              <select
                className="form-input-control"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.recipients})
                  </option>
                ))}
              </select>
            </div>

            {/* Variable Pills */}
            <div style={{ marginBottom: '18px' }}>
              <label className="form-field-label">Available Dynamic Merge Variables (Click to Insert)</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['ticket_no', 'subject', 'assignee', 'requester', 'sla_time', 'app', 'priority', 'status'].map(
                  (v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      style={{
                        padding: '4px 10px',
                        background: 'var(--surface-muted)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      +{`{${v}}`}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Email Subject Template *</label>
              <input
                type="text"
                className="form-input-control"
                value={templateSubject}
                onChange={(e) => {
                  setTemplateSubject(e.target.value)
                  markDirty()
                }}
              />
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Email Body Template (HTML & Markdown) *</label>
              <textarea
                rows={10}
                className="form-input-control"
                style={{ fontFamily: 'monospace', fontSize: '12.5px', lineHeight: 1.5 }}
                value={templateBody}
                onChange={(e) => {
                  setTemplateBody(e.target.value)
                  markDirty()
                }}
              />
            </div>
          </div>

          {/* Right Column: Live Email Preview */}
          <div className="modern-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px' }}>
              <Eye size={16} /> Live Ingestion Preview
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', fontSize: '12.5px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '10px' }}>
                <div style={{ color: 'var(--text-muted)' }}>From: <b>UFC Service Desk &lt;notifications@desk.ufc.om&gt;</b></div>
                <div style={{ color: 'var(--text-muted)' }}>To: <b>{activeEvent.recipients}</b></div>
                <div style={{ color: 'var(--text-main)', fontWeight: 700, marginTop: '4px' }}>
                  {templateSubject.replace('{ticket_no}', 'INC-2026-8841').replace('{subject}', 'Flexcube Login Failure')}
                </div>
              </div>

              <div style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {templateBody
                  .replace(/{ticket_no}/g, 'INC-2026-8841')
                  .replace(/{subject}/g, 'Flexcube Login Failure')
                  .replace(/{assignee}/g, 'Daniel Mensah')
                  .replace(/{app}/g, 'Flexcube')
                  .replace(/{priority}/g, 'P1')
                  .replace(/{sla_time}/g, '1h 45m')}
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
              You have unsaved changes in Notifications.
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
