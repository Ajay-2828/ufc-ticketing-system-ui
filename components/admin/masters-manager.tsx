'use client'

import React, { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, CheckCircle2, Layers, Plus, Trash2 } from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import {
  BusinessCalendar,
  IssueTypeConfig,
  PriorityMaster,
  SeverityMaster,
  SlaPolicy,
} from '@/app/ticket-data'
import {
  fmtHours,
  resolveSla,
  snapshotOf,
  usageOfPriority,
  usageOfSeverity,
} from '@/lib/masters'

type Tab = 'severity' | 'priority' | 'sla' | 'calendar'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ESCALATE_TO = ['Admin Team', 'HOD', 'Management']

function slug(name: string): string {
  return name.trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'
}

function uniqueId(base: string, taken: string[]): string {
  let id = base
  let n = 2
  while (taken.includes(id)) id = `${base}-${n++}`
  return id
}

function move<T extends { id: string; rank: number }>(list: T[], id: string, dir: -1 | 1): T[] {
  const sorted = [...list].sort((a, b) => a.rank - b.rank)
  const i = sorted.findIndex((x) => x.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= sorted.length) return list
  const a = sorted[i]
  const b = sorted[j]
  return list.map((x) => (x.id === a.id ? { ...x, rank: b.rank } : x.id === b.id ? { ...x, rank: a.rank } : x))
}

export function MastersManager() {
  const {
    severities,
    setSeverities,
    priorities,
    setPriorities,
    slaPolicies,
    setSlaPolicies,
    calendars,
    setCalendars,
    mastersSettings,
    setMastersSettings,
    tickets,
    classificationTreeData,
    setClassificationTreeData,
    triggerToast,
  } = useTicketContext()

  const [tab, setTab] = useState<Tab>('severity')

  const issueTypes = useMemo(
    () => classificationTreeData.flatMap((m) => m.subClassifications.flatMap((s) => s.issueTypes)),
    [classificationTreeData]
  )

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'severity', label: 'Severity', count: severities.length },
    { id: 'priority', label: 'Priority', count: priorities.length },
    { id: 'sla', label: 'SLA policies', count: slaPolicies.length },
    { id: 'calendar', label: 'Business calendars', count: calendars.length },
  ]

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Layers size={14} /> Masters
          </div>
          <h1 className="page-title-main">Severity, Priority and SLA Masters</h1>
          <p className="page-desc-sub">
            Severity, priority and SLA are set here and nowhere else. An issue type points to a
            severity and an SLA policy. The severity gives the starting priority. The policy gives
            the times, counted on a business calendar.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={tab === t.id ? 'btn-primary' : 'btn-secondary'}
            style={{ height: '36px' }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === 'severity' && (
        <SeverityTab
          severities={severities}
          setSeverities={setSeverities}
          priorities={priorities}
          tickets={tickets}
          issueTypes={issueTypes}
        />
      )}
      {tab === 'priority' && (
        <PriorityTab
          priorities={priorities}
          setPriorities={setPriorities}
          severities={severities}
          policies={slaPolicies}
          tickets={tickets}
          settings={mastersSettings}
          setSettings={setMastersSettings}
        />
      )}
      {tab === 'sla' && (
        <SlaTab
          policies={slaPolicies}
          setPolicies={setSlaPolicies}
          priorities={priorities}
          calendars={calendars}
          issueTypes={issueTypes}
          onSyncIssueTypes={(p) =>
            setClassificationTreeData((tree) =>
              tree.map((m) => ({
                ...m,
                subClassifications: m.subClassifications.map((s) => ({
                  ...s,
                  issueTypes: s.issueTypes.map((i) =>
                    i.slaPolicyId === p.id
                      ? {
                          ...i,
                          slaResponseHours: p.responseHours,
                          slaResolutionHours: p.resolutionHours,
                          hodApprovalLimitHours: p.hodLimitHours,
                        }
                      : i
                  ),
                })),
              }))
            )
          }
          toast={triggerToast}
        />
      )}
      {tab === 'calendar' && (
        <CalendarTab calendars={calendars} setCalendars={setCalendars} policies={slaPolicies} toast={triggerToast} />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- Severity */

function SeverityTab({
  severities,
  setSeverities,
  priorities,
  tickets,
  issueTypes,
}: {
  severities: SeverityMaster[]
  setSeverities: React.Dispatch<React.SetStateAction<SeverityMaster[]>>
  priorities: PriorityMaster[]
  tickets: { severity: string }[]
  issueTypes: IssueTypeConfig[]
}) {
  const sorted = [...severities].sort((a, b) => a.rank - b.rank)
  const activePriorities = priorities.filter((p) => p.active).sort((a, b) => a.rank - b.rank)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#7C3AED')
  const [defPri, setDefPri] = useState(activePriorities[0]?.id || '')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const patch = (id: string, p: Partial<SeverityMaster>) =>
    setSeverities((l) => l.map((s) => (s.id === id ? { ...s, ...p } : s)))

  const dupName = (n: string, except?: string) =>
    severities.some((s) => s.id !== except && s.name.trim().toLowerCase() === n.trim().toLowerCase())

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || dupName(name)) return
    setSeverities((l) => [
      ...l,
      {
        id: uniqueId(slug(name), l.map((s) => s.id)),
        name: name.trim(),
        rank: Math.max(0, ...l.map((s) => s.rank)) + 1,
        color,
        active: true,
        description: '',
        defaultPriorityId: defPri,
      },
    ])
    setName('')
  }

  return (
    <div className="modern-card" style={{ padding: '20px' }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Rank 1 is the most serious. A severity used by tickets or issue types cannot be deleted, only
        deactivated. The default priority is what a new ticket of that severity starts with.
      </p>
      <div className="table-responsive-container">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Code</th>
              <th>Name</th>
              <th>Colour</th>
              <th>Default priority</th>
              <th>Description</th>
              <th>Used by</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const u = usageOfSeverity(s.id, tickets, issueTypes)
              const used = u.tickets + u.issueTypes > 0
              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <strong>{s.rank}</strong>
                      <button type="button" className="icon-action-btn" disabled={i === 0} aria-label="Move up" onClick={() => setSeverities((l) => move(l, s.id, -1))}>
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" className="icon-action-btn" disabled={i === sorted.length - 1} aria-label="Move down" onClick={() => setSeverities((l) => move(l, s.id, 1))}>
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <code>{s.id}</code>
                  </td>
                  <td>
                    <input
                      className="form-input-control"
                      style={{ minWidth: '120px', borderColor: dupName(s.name, s.id) || !s.name.trim() ? '#DC2626' : undefined }}
                      value={s.name}
                      onChange={(e) => patch(s.id, { name: e.target.value })}
                      aria-label={`Name of ${s.id}`}
                    />
                  </td>
                  <td>
                    <input type="color" value={s.color} onChange={(e) => patch(s.id, { color: e.target.value })} aria-label={`Colour of ${s.id}`} />
                  </td>
                  <td>
                    <select className="form-input-control" value={s.defaultPriorityId} onChange={(e) => patch(s.id, { defaultPriorityId: e.target.value })} aria-label={`Default priority of ${s.id}`}>
                      {priorities.map((p) => (
                        <option key={p.id} value={p.id} disabled={!p.active && p.id !== s.defaultPriorityId}>
                          {p.name}
                          {p.active ? '' : ' (inactive)'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input className="form-input-control" style={{ minWidth: '200px' }} value={s.description} onChange={(e) => patch(s.id, { description: e.target.value })} aria-label={`Description of ${s.id}`} />
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {u.issueTypes} issue types
                    <br />
                    {u.tickets} tickets
                  </td>
                  <td>
                    <input type="checkbox" checked={s.active} onChange={(e) => patch(s.id, { active: e.target.checked })} aria-label={`Active ${s.id}`} />
                  </td>
                  <td>
                    {used ? (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>In use</span>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ color: '#DC2626', height: '30px' }}
                        onClick={() => {
                          if (confirmDel === s.id) {
                            setSeverities((l) => l.filter((x) => x.id !== s.id))
                            setConfirmDel(null)
                          } else setConfirmDel(s.id)
                        }}
                      >
                        <Trash2 size={13} /> {confirmDel === s.id ? 'Confirm' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '16px' }}>
        <div>
          <label className="form-label-control">New severity</label>
          <input className="form-input-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Major" />
        </div>
        <div>
          <label className="form-label-control">Colour</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div>
          <label className="form-label-control">Default priority</label>
          <select className="form-input-control" value={defPri} onChange={(e) => setDefPri(e.target.value)}>
            {activePriorities.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={!name.trim() || dupName(name)}>
          <Plus size={14} /> Add severity
        </button>
        {name.trim() && dupName(name) && <span style={{ color: '#DC2626', fontSize: '12px' }}>That name already exists.</span>}
      </form>
    </div>
  )
}

/* ---------------------------------------------------------------- Priority */

function PriorityTab({
  priorities,
  setPriorities,
  severities,
  policies,
  tickets,
  settings,
  setSettings,
}: {
  priorities: PriorityMaster[]
  setPriorities: React.Dispatch<React.SetStateAction<PriorityMaster[]>>
  severities: SeverityMaster[]
  policies: SlaPolicy[]
  tickets: { priority: string }[]
  settings: { endUserCanChangePriority: boolean }
  setSettings: React.Dispatch<React.SetStateAction<{ endUserCanChangePriority: boolean }>>
}) {
  const sorted = [...priorities].sort((a, b) => a.rank - b.rank)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#0D9488')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const patch = (id: string, p: Partial<PriorityMaster>) =>
    setPriorities((l) => l.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const dupName = (n: string, except?: string) =>
    priorities.some((p) => p.id !== except && p.name.trim().toLowerCase() === n.trim().toLowerCase())

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || dupName(name)) return
    setPriorities((l) => [
      ...l,
      {
        id: uniqueId(slug(name).toUpperCase(), l.map((p) => p.id)),
        name: name.trim(),
        rank: Math.max(0, ...l.map((p) => p.rank)) + 1,
        color,
        active: true,
        description: '',
      },
    ])
    setName('')
  }

  return (
    <div className="modern-card" style={{ padding: '20px' }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Rank 1 is the most urgent. The starting priority of a ticket comes from its severity (set in
        the Severity tab). A policy may give a priority its own response and resolution times.
      </p>
      <div className="table-responsive-container">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Code</th>
              <th>Name</th>
              <th>Colour</th>
              <th>Description</th>
              <th>Default for severity</th>
              <th>Used by</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const u = usageOfPriority(p.id, tickets, severities, policies)
              const used = u.tickets + u.severities + u.policies > 0
              const defaults = severities.filter((s) => s.defaultPriorityId === p.id).map((s) => s.name)
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <strong>{p.rank}</strong>
                      <button type="button" className="icon-action-btn" disabled={i === 0} aria-label="Move up" onClick={() => setPriorities((l) => move(l, p.id, -1))}>
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" className="icon-action-btn" disabled={i === sorted.length - 1} aria-label="Move down" onClick={() => setPriorities((l) => move(l, p.id, 1))}>
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <code>{p.id}</code>
                  </td>
                  <td>
                    <input className="form-input-control" style={{ minWidth: '120px', borderColor: dupName(p.name, p.id) || !p.name.trim() ? '#DC2626' : undefined }} value={p.name} onChange={(e) => patch(p.id, { name: e.target.value })} aria-label={`Name of ${p.id}`} />
                  </td>
                  <td>
                    <input type="color" value={p.color} onChange={(e) => patch(p.id, { color: e.target.value })} aria-label={`Colour of ${p.id}`} />
                  </td>
                  <td>
                    <input className="form-input-control" style={{ minWidth: '220px' }} value={p.description} onChange={(e) => patch(p.id, { description: e.target.value })} aria-label={`Description of ${p.id}`} />
                  </td>
                  <td style={{ fontSize: '12.5px' }}>{defaults.length ? defaults.join(', ') : <span style={{ color: 'var(--text-muted)' }}>none</span>}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {u.severities} severities
                    <br />
                    {u.policies} overrides, {u.tickets} tickets
                  </td>
                  <td>
                    <input type="checkbox" checked={p.active} onChange={(e) => patch(p.id, { active: e.target.checked })} aria-label={`Active ${p.id}`} />
                  </td>
                  <td>
                    {used ? (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>In use</span>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ color: '#DC2626', height: '30px' }}
                        onClick={() => {
                          if (confirmDel === p.id) {
                            setPriorities((l) => l.filter((x) => x.id !== p.id))
                            setConfirmDel(null)
                          } else setConfirmDel(p.id)
                        }}
                      >
                        <Trash2 size={13} /> {confirmDel === p.id ? 'Confirm' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '16px' }}>
        <div>
          <label className="form-label-control">New priority</label>
          <input className="form-input-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. P5 Planned" />
        </div>
        <div>
          <label className="form-label-control">Colour</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary" disabled={!name.trim() || dupName(name)}>
          <Plus size={14} /> Add priority
        </button>
      </form>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        <input type="checkbox" checked={settings.endUserCanChangePriority} onChange={(e) => setSettings({ ...settings, endUserCanChangePriority: e.target.checked })} />
        End users may change the starting priority when they raise a ticket (staff roles always can)
      </label>
    </div>
  )
}

/* ---------------------------------------------------------------- SLA */

function blankPolicy(calendarId: string): SlaPolicy {
  return {
    id: `sla-${Date.now().toString(36)}`,
    name: '',
    responseHours: 1,
    resolutionHours: 8,
    hodLimitHours: 4,
    pauseOnClarification: true,
    calendarId,
    warnPercent: 80,
    escalateAfterHours: 0,
    escalateTo: 'Admin Team',
    overrides: {},
    active: true,
  }
}

function SlaTab({
  policies,
  setPolicies,
  priorities,
  calendars,
  issueTypes,
  onSyncIssueTypes,
  toast,
}: {
  policies: SlaPolicy[]
  setPolicies: React.Dispatch<React.SetStateAction<SlaPolicy[]>>
  priorities: PriorityMaster[]
  calendars: BusinessCalendar[]
  issueTypes: IssueTypeConfig[]
  onSyncIssueTypes: (p: SlaPolicy) => void
  toast: (m: string) => void
}) {
  const { severities, slaPolicies } = useTicketContext()
  const [draft, setDraft] = useState<SlaPolicy | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const sortedPolicies = [...policies].sort((a, b) => a.resolutionHours - b.resolutionHours)
  const calName = (id: string) => calendars.find((c) => c.id === id)?.name || id

  // "Try it" panel
  const [tryIssue, setTryIssue] = useState(issueTypes[0]?.name || '')
  const [tryPri, setTryPri] = useState('')
  const tryIssueObj = issueTypes.find((i) => i.name === tryIssue)
  const tried = useMemo(() => {
    if (!tryIssueObj) return null
    const r = resolveSla({ severities, priorities, slaPolicies, calendars }, tryIssueObj, tryPri || undefined)
    return { r, snap: snapshotOf(r) }
  }, [tryIssueObj, tryPri, severities, priorities, slaPolicies, calendars])

  const valid =
    draft &&
    draft.name.trim() &&
    draft.responseHours > 0 &&
    draft.resolutionHours > 0 &&
    draft.hodLimitHours > 0 &&
    draft.resolutionHours >= draft.responseHours &&
    !policies.some((p) => p.id !== draft.id && p.name.trim().toLowerCase() === draft.name.trim().toLowerCase())

  const save = () => {
    if (!draft || !valid) return
    const clean: SlaPolicy = {
      ...draft,
      name: draft.name.trim(),
      overrides: Object.fromEntries(
        Object.entries(draft.overrides).filter(([, v]) => v.responseHours || v.resolutionHours)
      ),
    }
    setPolicies((l) => (isNew ? [...l, clean] : l.map((p) => (p.id === clean.id ? clean : p))))
    onSyncIssueTypes(clean)
    setDraft(null)
    toast(`SLA policy "${clean.name}" saved.`)
  }

  const num = (v: string) => (v === '' ? 0 : parseFloat(v) || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="modern-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            An issue type points to one policy. Changing a policy changes the times of every issue type that uses it. Tickets keep
            the times they were raised with.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setDraft(blankPolicy(calendars[0]?.id || ''))
              setIsNew(true)
            }}
          >
            <Plus size={14} /> New policy
          </button>
        </div>
        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Response</th>
                <th>Resolution</th>
                <th>HOD limit</th>
                <th>Calendar</th>
                <th>Clock pauses on clarification</th>
                <th>Warn at</th>
                <th>Escalation</th>
                <th>Used by</th>
                <th>Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sortedPolicies.map((p) => {
                const used = issueTypes.filter((i) => i.slaPolicyId === p.id).length
                const ovCount = Object.keys(p.overrides).length
                return (
                  <tr key={p.id}>
                    <td style={{ minWidth: '200px' }}>
                      <strong>{p.name}</strong>
                      {ovCount > 0 && <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{ovCount} priority overrides</div>}
                    </td>
                    <td>{fmtHours(p.responseHours)}</td>
                    <td>{fmtHours(p.resolutionHours)}</td>
                    <td>{fmtHours(p.hodLimitHours)}</td>
                    <td>{calName(p.calendarId)}</td>
                    <td>{p.pauseOnClarification ? 'Yes' : 'No'}</td>
                    <td>{p.warnPercent}%</td>
                    <td style={{ fontSize: '12.5px' }}>
                      {p.escalateTo}
                      {p.escalateAfterHours > 0 ? ` after ${fmtHours(p.escalateAfterHours)}` : ' at breach'}
                    </td>
                    <td>{used} issue types</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={p.active}
                        onChange={(e) => setPolicies((l) => l.map((x) => (x.id === p.id ? { ...x, active: e.target.checked } : x)))}
                        aria-label={`Active ${p.name}`}
                      />
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '30px' }}
                        onClick={() => {
                          setDraft(JSON.parse(JSON.stringify(p)))
                          setIsNew(false)
                        }}
                      >
                        Edit
                      </button>{' '}
                      {used === 0 && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ color: '#DC2626', height: '30px' }}
                          onClick={() => {
                            if (confirmDel === p.id) {
                              setPolicies((l) => l.filter((x) => x.id !== p.id))
                              setConfirmDel(null)
                            } else setConfirmDel(p.id)
                          }}
                        >
                          <Trash2 size={13} /> {confirmDel === p.id ? 'Confirm' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {draft && (
        <div className="modern-card" style={{ padding: '20px', border: '1.5px solid var(--primary)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700 }}>{isNew ? 'New SLA policy' : `Edit ${draft.name || 'policy'}`}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label-control">Policy name</label>
              <input className="form-input-control" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Core banking, critical" />
            </div>
            <div>
              <label className="form-label-control">Response (hours)</label>
              <input type="number" step="0.25" min="0.25" className="form-input-control" value={draft.responseHours || ''} onChange={(e) => setDraft({ ...draft, responseHours: num(e.target.value) })} />
            </div>
            <div>
              <label className="form-label-control">Resolution (hours)</label>
              <input type="number" step="0.5" min="0.5" className="form-input-control" value={draft.resolutionHours || ''} onChange={(e) => setDraft({ ...draft, resolutionHours: num(e.target.value) })} />
            </div>
            <div>
              <label className="form-label-control">HOD approval limit (hours)</label>
              <input type="number" step="0.5" min="0.5" className="form-input-control" value={draft.hodLimitHours || ''} onChange={(e) => setDraft({ ...draft, hodLimitHours: num(e.target.value) })} />
            </div>
            <div>
              <label className="form-label-control">Business calendar</label>
              <select className="form-input-control" value={draft.calendarId} onChange={(e) => setDraft({ ...draft, calendarId: e.target.value })}>
                {calendars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label-control">Warn at (% of resolution time)</label>
              <input type="number" min="10" max="100" className="form-input-control" value={draft.warnPercent || ''} onChange={(e) => setDraft({ ...draft, warnPercent: Math.min(100, num(e.target.value)) })} />
            </div>
            <div>
              <label className="form-label-control">Escalate to</label>
              <select className="form-input-control" value={draft.escalateTo} onChange={(e) => setDraft({ ...draft, escalateTo: e.target.value })}>
                {ESCALATE_TO.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label-control">Escalate after breach (hours, 0 = at breach)</label>
              <input type="number" step="0.5" min="0" className="form-input-control" value={draft.escalateAfterHours} onChange={(e) => setDraft({ ...draft, escalateAfterHours: num(e.target.value) })} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0', fontSize: '13px', fontWeight: 600 }}>
            <input type="checkbox" checked={draft.pauseOnClarification} onChange={(e) => setDraft({ ...draft, pauseOnClarification: e.target.checked })} />
            Stop the clock while waiting for a clarification
          </label>

          <h4 style={{ margin: '14px 0 6px', fontSize: '13px', fontWeight: 700 }}>Times for a given priority (optional, leave blank to use the policy times)</h4>
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Response (hours)</th>
                  <th>Resolution (hours)</th>
                </tr>
              </thead>
              <tbody>
                {[...priorities].sort((a, b) => a.rank - b.rank).map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        className="form-input-control"
                        style={{ width: '120px' }}
                        value={draft.overrides[p.id]?.responseHours ?? ''}
                        onChange={(e) =>
                          setDraft({ ...draft, overrides: { ...draft.overrides, [p.id]: { ...draft.overrides[p.id], responseHours: e.target.value === '' ? undefined : num(e.target.value) } } })
                        }
                        aria-label={`Response override ${p.id}`}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        className="form-input-control"
                        style={{ width: '120px' }}
                        value={draft.overrides[p.id]?.resolutionHours ?? ''}
                        onChange={(e) =>
                          setDraft({ ...draft, overrides: { ...draft.overrides, [p.id]: { ...draft.overrides[p.id], resolutionHours: e.target.value === '' ? undefined : num(e.target.value) } } })
                        }
                        aria-label={`Resolution override ${p.id}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn-primary" disabled={!valid} onClick={save}>
              <CheckCircle2 size={14} /> Save policy
            </button>
            <button type="button" className="btn-secondary" onClick={() => setDraft(null)}>
              Cancel
            </button>
            {!valid && (
              <span style={{ fontSize: '12px', color: '#B45309' }}>
                Needs a unique name, times above zero, and a resolution time not shorter than the response time.
              </span>
            )}
          </div>
        </div>
      )}

      <div className="modern-card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>Try the rules</h3>
        <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          See what a new ticket would get for an issue type and priority.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ minWidth: '260px' }}>
            <label className="form-label-control">Issue type</label>
            <select className="form-input-control" value={tryIssue} onChange={(e) => setTryIssue(e.target.value)}>
              {issueTypes.map((i) => (
                <option key={i.name} value={i.name}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label-control">Priority</label>
            <select className="form-input-control" value={tryPri} onChange={(e) => setTryPri(e.target.value)}>
              <option value="">Starting priority of the severity</option>
              {priorities.filter((p) => p.active).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {tried && (
          <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '13px' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Severity</span><br /><strong>{severities.find((s) => s.id === tried.r.severityId)?.name || tried.r.severityId}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Priority</span><br /><strong>{priorities.find((p) => p.id === tried.r.priorityId)?.name || tried.r.priorityId}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Policy</span><br /><strong>{tried.r.policy?.name || 'None'}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Response / Resolution / HOD</span><br /><strong>{fmtHours(tried.r.responseHours)} / {fmtHours(tried.r.resolutionHours)} / {fmtHours(tried.r.hodLimitHours)}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Calendar</span><br /><strong>{tried.r.calendar.name}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Resolution due if raised now</span><br /><strong>{new Date(tried.snap.resolutionDue).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</strong></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Calendars */

function CalendarTab({
  calendars,
  setCalendars,
  policies,
  toast,
}: {
  calendars: BusinessCalendar[]
  setCalendars: React.Dispatch<React.SetStateAction<BusinessCalendar[]>>
  policies: SlaPolicy[]
  toast: (m: string) => void
}) {
  const [draft, setDraft] = useState<BusinessCalendar | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [holDate, setHolDate] = useState('')
  const [holName, setHolName] = useState('')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const valid =
    draft &&
    draft.name.trim() &&
    (draft.is24x7 || (draft.workDays.length > 0 && draft.start < draft.end)) &&
    !calendars.some((c) => c.id !== draft.id && c.name.trim().toLowerCase() === draft.name.trim().toLowerCase())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="modern-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            A calendar says when the SLA clock runs. The working days, hours and holidays here are examples until UFC confirms them.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setDraft({ id: `cal-${Date.now().toString(36)}`, name: '', is24x7: false, workDays: [0, 1, 2, 3, 4], start: '08:00', end: '16:00', holidays: [] })
              setIsNew(true)
            }}
          >
            <Plus size={14} /> New calendar
          </button>
        </div>
        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Calendar</th>
                <th>Clock runs</th>
                <th>Holidays</th>
                <th>Used by</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {calendars.map((c) => {
                const used = policies.filter((p) => p.calendarId === c.id).length
                return (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ fontSize: '12.5px' }}>
                      {c.is24x7 ? 'All day, every day' : `${c.workDays.map((d) => DAYS[d]).join(', ')}, ${c.start} to ${c.end}`}
                    </td>
                    <td>{c.holidays.length}</td>
                    <td>{used} policies</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button type="button" className="btn-secondary" style={{ height: '30px' }} onClick={() => { setDraft(JSON.parse(JSON.stringify(c))); setIsNew(false) }}>
                        Edit
                      </button>{' '}
                      {used === 0 && calendars.length > 1 && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ color: '#DC2626', height: '30px' }}
                          onClick={() => {
                            if (confirmDel === c.id) {
                              setCalendars((l) => l.filter((x) => x.id !== c.id))
                              setConfirmDel(null)
                            } else setConfirmDel(c.id)
                          }}
                        >
                          <Trash2 size={13} /> {confirmDel === c.id ? 'Confirm' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {draft && (
        <div className="modern-card" style={{ padding: '20px', border: '1.5px solid var(--primary)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700 }}>{isNew ? 'New calendar' : `Edit ${draft.name}`}</h3>
          <div style={{ maxWidth: '360px' }}>
            <label className="form-label-control">Calendar name</label>
            <input className="form-input-control" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0', fontSize: '13px', fontWeight: 600 }}>
            <input type="checkbox" checked={draft.is24x7} onChange={(e) => setDraft({ ...draft, is24x7: e.target.checked })} />
            The clock runs all day, every day
          </label>
          {!draft.is24x7 && (
            <>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {DAYS.map((d, i) => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={draft.workDays.includes(i)}
                      onChange={(e) =>
                        setDraft({ ...draft, workDays: e.target.checked ? [...draft.workDays, i].sort() : draft.workDays.filter((x) => x !== i) })
                      }
                    />
                    {d}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <label className="form-label-control">Start</label>
                  <input type="time" className="form-input-control" value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} />
                </div>
                <div>
                  <label className="form-label-control">End</label>
                  <input type="time" className="form-input-control" value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} />
                </div>
              </div>
            </>
          )}

          <h4 style={{ margin: '16px 0 6px', fontSize: '13px', fontWeight: 700 }}>Holidays (the clock does not run)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            {draft.holidays.length === 0 && <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>No holidays added.</span>}
            {draft.holidays.map((h) => (
              <div key={h.date} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                <code>{h.date}</code> {h.name}
                <button type="button" className="icon-action-btn" aria-label={`Remove ${h.name}`} onClick={() => setDraft({ ...draft, holidays: draft.holidays.filter((x) => x.date !== h.date) })}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <input type="date" className="form-input-control" value={holDate} onChange={(e) => setHolDate(e.target.value)} aria-label="Holiday date" />
            <input className="form-input-control" placeholder="Holiday name" value={holName} onChange={(e) => setHolName(e.target.value)} aria-label="Holiday name" />
            <button
              type="button"
              className="btn-secondary"
              disabled={!holDate || !holName.trim() || draft.holidays.some((h) => h.date === holDate)}
              onClick={() => {
                setDraft({ ...draft, holidays: [...draft.holidays, { date: holDate, name: holName.trim() }].sort((a, b) => a.date.localeCompare(b.date)) })
                setHolDate('')
                setHolName('')
              }}
            >
              Add holiday
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              disabled={!valid}
              onClick={() => {
                if (!draft || !valid) return
                const clean = { ...draft, name: draft.name.trim() }
                setCalendars((l) => (isNew ? [...l, clean] : l.map((c) => (c.id === clean.id ? clean : c))))
                setDraft(null)
                toast(`Calendar "${clean.name}" saved.`)
              }}
            >
              <CheckCircle2 size={14} /> Save calendar
            </button>
            <button type="button" className="btn-secondary" onClick={() => setDraft(null)}>
              Cancel
            </button>
            {!valid && <span style={{ fontSize: '12px', color: '#B45309' }}>Needs a unique name, at least one working day, and an end time after the start time.</span>}
          </div>
        </div>
      )}
    </div>
  )
}
