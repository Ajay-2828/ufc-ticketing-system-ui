'use client'

import React, { useState } from 'react'
import { GitBranch, Plus, Tags, Trash2 } from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import { TicketTypeMaster, WorkflowTemplate, workflowTemplates } from '@/app/ticket-data'

/**
 * Ticket Types master. Each type follows a workflow template (Standard or Change Request).
 * The create ticket form lists the active types; the chosen type decides the flow.
 */
export function TicketTypesManager() {
  const { ticketTypes, setTicketTypes, tickets, triggerToast } = useTicketContext()

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [workflow, setWorkflow] = useState<WorkflowTemplate>('Standard')
  const [crRequiresHod, setCrRequiresHod] = useState(true)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const patch = (id: string, p: Partial<TicketTypeMaster>) =>
    setTicketTypes((l) => l.map((t) => (t.id === id ? { ...t, ...p } : t)))

  const dupName = (n: string, except?: string) =>
    ticketTypes.some((t) => t.id !== except && t.name.trim().toLowerCase() === n.trim().toLowerCase())
  const dupCode = (c: string, except?: string) =>
    ticketTypes.some((t) => t.id !== except && t.code.trim().toUpperCase() === c.trim().toUpperCase())
  const usage = (id: string) => tickets.filter((t) => t.type === id).length

  const cleanCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
  const nameError = name.trim() && dupName(name) ? 'That name already exists.' : ''
  const codeError = code.trim() && dupCode(code) ? 'That code already exists.' : ''
  const canAdd = !!name.trim() && code.trim().length >= 2 && !nameError && !codeError

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAdd) return
    const t: TicketTypeMaster = {
      id: name.trim(),
      name: name.trim(),
      code: cleanCode(code),
      description: description.trim(),
      workflow,
      crRequiresHod: workflow === 'Change Request' ? crRequiresHod : false,
      active: true,
    }
    setTicketTypes((l) => [...l, t])
    triggerToast(`Ticket type "${t.name}" (${t.code}) added with the ${workflow} workflow.`)
    setName('')
    setCode('')
    setDescription('')
    setWorkflow('Standard')
    setCrRequiresHod(true)
  }

  const activeCount = ticketTypes.filter((t) => t.active).length

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Tags size={14} /> Ticket Types
          </div>
          <h1 className="page-title-main">Ticket Types</h1>
          <p className="page-desc-sub">
            Each ticket type follows a workflow template. The user picks the ticket type when creating a
            ticket, and the type decides whether the ticket goes through the Standard workflow or the
            Change Request workflow.
          </p>
        </div>
      </div>

      {/* Workflow templates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {workflowTemplates.map((w) => {
          const isCR = w.id === 'Change Request'
          const count = ticketTypes.filter((t) => t.workflow === w.id).length
          return (
            <div
              key={w.id}
              className="modern-card"
              style={{ padding: '14px 16px', borderLeft: `4px solid ${isCR ? '#7C3AED' : '#16A34A'}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
                <GitBranch size={15} color={isCR ? '#7C3AED' : '#16A34A'} /> {w.name}
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {count} type{count === 1 ? '' : 's'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>{w.steps}</div>
            </div>
          )
        })}
      </div>

      <div className="modern-card" style={{ padding: '20px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          The code is the prefix of the ticket number (INC gives INC-2026-0001). A type used by tickets
          cannot be deleted, only deactivated. At least one type must stay active.
        </p>
        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Description</th>
                <th>Workflow template</th>
                <th>HOD approval (CR)</th>
                <th>Used by</th>
                <th>Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map((t) => {
                const used = usage(t.id)
                const isCR = t.workflow === 'Change Request'
                return (
                  <tr key={t.id}>
                    <td>
                      <code>{t.code}</code>
                    </td>
                    <td>
                      <input
                        className="form-input-control"
                        style={{ minWidth: '140px', borderColor: !t.name.trim() || dupName(t.name, t.id) ? '#DC2626' : undefined }}
                        value={t.name}
                        onChange={(e) => patch(t.id, { name: e.target.value })}
                        aria-label={`Name of ${t.code}`}
                      />
                    </td>
                    <td>
                      <input
                        className="form-input-control"
                        style={{ minWidth: '220px' }}
                        value={t.description}
                        onChange={(e) => patch(t.id, { description: e.target.value })}
                        aria-label={`Description of ${t.code}`}
                      />
                    </td>
                    <td>
                      <select
                        className="form-input-control"
                        value={t.workflow}
                        onChange={(e) => {
                          const wf = e.target.value as WorkflowTemplate
                          patch(t.id, { workflow: wf, crRequiresHod: wf === 'Change Request' })
                          triggerToast(`${t.name} now follows the ${wf} workflow. Existing tickets keep their workflow.`)
                        }}
                        aria-label={`Workflow of ${t.code}`}
                        style={{ color: isCR ? '#6B21A8' : '#166534', fontWeight: 600 }}
                      >
                        {workflowTemplates.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {isCR ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                          <input
                            type="checkbox"
                            checked={t.crRequiresHod}
                            onChange={(e) => patch(t.id, { crRequiresHod: e.target.checked })}
                          />
                          {t.crRequiresHod ? 'Required' : 'Skipped'}
                        </label>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>n/a</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {used} tickets
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={t.active}
                        disabled={t.active && activeCount === 1}
                        onChange={(e) => patch(t.id, { active: e.target.checked })}
                        aria-label={`Active ${t.code}`}
                      />
                    </td>
                    <td>
                      {used > 0 ? (
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>In use</span>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ color: '#DC2626', height: '30px' }}
                          disabled={t.active && activeCount === 1}
                          onClick={() => {
                            if (confirmDel === t.id) {
                              setTicketTypes((l) => l.filter((x) => x.id !== t.id))
                              setConfirmDel(null)
                              triggerToast(`Ticket type "${t.name}" deleted.`)
                            } else setConfirmDel(t.id)
                          }}
                        >
                          <Trash2 size={13} /> {confirmDel === t.id ? 'Confirm' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Add ticket type */}
        <form
          onSubmit={add}
          style={{
            marginTop: '18px',
            padding: '16px',
            border: '1px dashed var(--border)',
            borderRadius: '10px',
            background: 'var(--surface-subtle)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>New ticket type</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <label className="form-label-control" style={{ display: 'block' }}>Name *</label>
              <input
                className="form-input-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Access Request"
                style={{ borderColor: nameError ? '#DC2626' : undefined }}
              />
              {nameError && <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{nameError}</div>}
            </div>
            <div>
              <label className="form-label-control" style={{ display: 'block' }}>Code * (2 to 5 letters)</label>
              <input
                className="form-input-control"
                style={{ width: '120px', borderColor: codeError ? '#DC2626' : undefined }}
                value={code}
                onChange={(e) => setCode(cleanCode(e.target.value))}
                placeholder="e.g. ACR"
              />
              {codeError && <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{codeError}</div>}
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label className="form-label-control" style={{ display: 'block' }}>Description</label>
              <input
                className="form-input-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this type is used for"
              />
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <label className="form-label-control">Workflow template *</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {workflowTemplates.map((w) => {
                const on = workflow === w.id
                const isCR = w.id === 'Change Request'
                return (
                  <label
                    key={w.id}
                    style={{
                      flex: '1 1 260px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: on ? (isCR ? '#FAF5FF' : '#F0FDF4') : '#FFFFFF',
                      border: `1px solid ${on ? (isCR ? '#C4B5FD' : '#86EFAC') : 'var(--border)'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="workflow-template"
                      checked={on}
                      onChange={() => setWorkflow(w.id)}
                      style={{ marginTop: '3px' }}
                    />
                    <span>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{w.name}</span>
                      <br />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{w.steps}</span>
                    </span>
                  </label>
                )
              })}
            </div>
            {workflow === 'Change Request' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px' }}>
                <input type="checkbox" checked={crRequiresHod} onChange={(e) => setCrRequiresHod(e.target.checked)} />
                HOD approval after Admin approval
              </label>
            )}
          </div>

          <div style={{ marginTop: '14px' }}>
            <button type="submit" className="btn-primary" disabled={!canAdd}>
              <Plus size={14} /> Add ticket type
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
