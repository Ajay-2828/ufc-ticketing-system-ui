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
  Send,
  MessageSquare,
  Check,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
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
    triggerToast('Notification delivery preferences & templates saved!')
  }

  const handleDiscard = () => {
    setEvents(notificationEvents)
    setHasUnsavedChanges(false)
    triggerToast('All changes discarded.')
  }

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0]

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '90px' }}>
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

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div className="page-eyebrow">
            <Bell size={13} />
            <span>Communications Gateway</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>2-Way Email Sync Active</span>
          </div>
          <h1 className="page-title-main" style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0' }}>
            Notifications &amp; Alert Delivery
          </h1>
          <p className="page-desc-sub" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Configure automatic email alerts and in-app notifications. When users reply to notification emails, their responses sync directly into the ticket timeline.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '13px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'matrix' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'matrix' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'matrix' ? 700 : 500,
              boxShadow: activeTab === 'matrix' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('matrix')}
          >
            <Bell size={14} /> Event Matrix ({events.length})
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '13px',
              border: 'none',
              borderRadius: '7px',
              background: activeTab === 'templates' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'templates' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'templates' ? 700 : 500,
              boxShadow: activeTab === 'templates' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              gap: '6px',
            }}
            onClick={() => setActiveTab('templates')}
          >
            <Mail size={14} /> Template Editor &amp; Preview
          </button>
        </div>
      </div>

      {/* Top Operational KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Lifecycle Triggers
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {events.length} Active Events
            </div>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Real-time event capture</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Dual Channels
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Email &amp; In-App Push
            </div>
            <span style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>Omnichannel delivery</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Two-Way Email Sync
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Active &amp; Parsed
            </div>
            <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>Replies post to timeline</span>
          </div>
        </div>

        <div className="modern-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Average Dispatch
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              &lt; 1.5 Seconds
            </div>
            <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 600 }}>High-throughput gateway</span>
          </div>
        </div>
      </div>

      {/* TAB 1: EVENT DELIVERY MATRIX */}
      {activeTab === 'matrix' && (
        <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '16px 22px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Lifecycle Event Delivery Matrix
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Toggle which delivery channels fire for each lifecycle trigger.
              </p>
            </div>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Lifecycle Event Trigger</th>
                  <th style={{ width: '28%' }}>Target Stakeholders</th>
                  <th style={{ width: '15%' }}>Email Alert</th>
                  <th style={{ width: '15%' }}>In-App Alert</th>
                  <th style={{ width: '4%', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>
                        {ev.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {ev.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {ev.recipients}
                      </span>
                    </td>
                    <td>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={ev.defaultEmail}
                          onChange={() => toggleEmail(ev.id)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '12.5px', color: ev.defaultEmail ? '#15803D' : 'var(--text-muted)', fontWeight: 600 }}>
                          {ev.defaultEmail ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </td>
                    <td>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={ev.defaultInApp}
                          onChange={() => toggleInApp(ev.id)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '12.5px', color: ev.defaultInApp ? '#15803D' : 'var(--text-muted)', fontWeight: 600 }}>
                          {ev.defaultInApp ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '30px', padding: '0 10px', fontSize: '11.5px', gap: '4px' }}
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

      {/* TAB 2: TEMPLATE EDITOR & LIVE PREVIEW */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Left: Editor Controls */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Template Content Editor
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Customize email subject and body with dynamic merge variables.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Event Selector */}
              <div className="form-field-group">
                <label className="form-field-label">Target Trigger Event</label>
                <select
                  className="form-input-control"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.recipients})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clickable Merge Variables */}
              <div>
                <label className="form-field-label">
                  Dynamic Merge Variables (Click to Insert)
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {[
                    'ticket_no',
                    'subject',
                    'assignee',
                    'requester',
                    'app',
                    'priority',
                    'status',
                    'sla_time',
                    'hod_name',
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className="btn-secondary"
                      style={{
                        height: '26px',
                        padding: '0 8px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        background: '#F1F5F9',
                        color: 'var(--primary)',
                        borderColor: '#E2E8F0',
                      }}
                      onClick={() => handleInsertVariable(v)}
                    >
                      +{'{' + v + '}'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Line */}
              <div className="form-field-group">
                <label className="form-field-label">Email Subject Line</label>
                <input
                  type="text"
                  className="form-input-control"
                  value={templateSubject}
                  onChange={(e) => {
                    setTemplateSubject(e.target.value)
                    markDirty()
                  }}
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Body Text */}
              <div className="form-field-group">
                <label className="form-field-label">Message Body (Plain Text &amp; Variables)</label>
                <textarea
                  className="form-input-control"
                  rows={9}
                  value={templateBody}
                  onChange={(e) => {
                    setTemplateBody(e.target.value)
                    markDirty()
                  }}
                  style={{ fontSize: '12.5px', lineHeight: 1.55, fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>
          </div>

          {/* Right: Live Email Preview Pane */}
          <div className="modern-card" style={{ padding: '24px', background: '#F8FAFC', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Eye size={18} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                Live Stakeholder Email Preview
              </h3>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Fake Email Client Header */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: '#FAFAFA' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong>From:</strong> UFC Desk Notifications &lt;no-reply@desk.ufc.om&gt;
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong>To:</strong> {activeEvent.recipients}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  <strong>Subject:</strong>{' '}
                  {templateSubject
                    .replace('{ticket_no}', 'INC-2026-8842')
                    .replace('{subject}', 'Flexcube Database Lockout')}
                </div>
              </div>

              {/* Fake Email Body */}
              <div style={{ padding: '20px 22px', fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {templateBody
                  .replace(/\{ticket_no\}/g, 'INC-2026-8842')
                  .replace(/\{subject\}/g, 'Flexcube Database Lockout')
                  .replace(/\{assignee\}/g, 'Daniel Mensah')
                  .replace(/\{requester\}/g, 'Tariq Bello')
                  .replace(/\{app\}/g, 'Flexcube')
                  .replace(/\{priority\}/g, 'P1 - Critical')
                  .replace(/\{status\}/g, 'In Progress')
                  .replace(/\{sla_time\}/g, '01:45:00 remaining')
                  .replace(/\{hod_name\}/g, 'Grace Nwosu')}
              </div>

              {/* Action Button Preview */}
              <div style={{ padding: '0 22px 20px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'var(--primary)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                  }}
                >
                  View Ticket INC-2026-8842 &rarr;
                </div>
              </div>

              {/* Footer Note */}
              <div style={{ padding: '12px 22px', background: '#F8FAFC', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>
                Direct email replies to this alert are automatically parsed and appended to the ticket timeline.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING UNSAVED CHANGES BAR */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in notification channels or templates.
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
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
