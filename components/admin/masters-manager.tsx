'use client'

import React, { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, CheckCircle2, Layers, Plus, Trash2 } from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import {
  BusinessCalendar,
  IssueTypeConfig,
  PriorityMaster,
  SeverityMaster,
} from '@/app/ticket-data'
import { fmtHours, usageOfPriority, usageOfSeverity } from '@/lib/masters'

type Tab = 'severity' | 'priority' | 'calendar'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

/** Hours box: 0.25 = 15 min. Red when empty or zero. */
function HoursInput({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
      <input
        type="number"
        min={0}
        step={0.25}
        className="form-input-control"
        style={{ width: '80px', borderColor: value > 0 ? undefined : '#DC2626' }}
        value={value || ''}
        aria-label={label}
        onChange={(e) => {
          const n = parseFloat(e.target.value)
          onChange(Number.isFinite(n) && n > 0 ? n : 0)
        }}
      />
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{value > 0 ? fmtHours(value) : ''}</span>
    </div>
  )
}

export function MastersManager() {
  const {
    severities,
    setSeverities,
    priorities,
    setPriorities,
    calendars,
    setCalendars,
    tickets,
    classificationTreeData,
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
    { id: 'calendar', label: 'Business calendars', count: calendars.length },
  ]

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Layers size={14} /> Masters
          </div>
          <h1 className="page-title-main">Severity and Priority Masters</h1>
          <p className="page-desc-sub">
            Severity and priority are not linked. The severity sets the Reply within time. The priority
            sets the Fix within time and the HOD approval limit. When Admin creates an issue type
            (Administration &gt; Classification) it picks a severity and a priority, and a ticket gets its times from them.
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
          tickets={tickets}
          issueTypes={issueTypes}
        />
      )}
      {tab === 'priority' && (
        <PriorityTab
          priorities={priorities}
          setPriorities={setPriorities}
          calendars={calendars}
          tickets={tickets}
          issueTypes={issueTypes}
        />
      )}
      {tab === 'calendar' && (
        <CalendarTab calendars={calendars} setCalendars={setCalendars} priorities={priorities} toast={triggerToast} />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- Severity */

function SeverityTab({
  severities,
  setSeverities,
  tickets,
  issueTypes,
}: {
  severities: SeverityMaster[]
  setSeverities: React.Dispatch<React.SetStateAction<SeverityMaster[]>>
  tickets: { severity: string }[]
  issueTypes: IssueTypeConfig[]
}) {
  const sorted = [...severities].sort((a, b) => a.rank - b.rank)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#7C3AED')
  const [reply, setReply] = useState(2)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const patch = (id: string, p: Partial<SeverityMaster>) =>
    setSeverities((l) => l.map((s) => (s.id === id ? { ...s, ...p } : s)))

  const dupName = (n: string, except?: string) =>
    severities.some((s) => s.id !== except && s.name.trim().toLowerCase() === n.trim().toLowerCase())

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || dupName(name) || !(reply > 0)) return
    setSeverities((l) => [
      ...l,
      {
        id: uniqueId(slug(name), l.map((s) => s.id)),
        name: name.trim(),
        rank: Math.max(0, ...l.map((s) => s.rank)) + 1,
        color,
        active: true,
        description: '',
        responseHours: reply,
      },
    ])
    setName('')
  }

  return (
    <div className="modern-card" style={{ padding: '20px' }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Rank 1 is the most serious. Reply within is how soon a technician must first respond to a ticket of this severity. A severity used by tickets or issue types cannot be deleted, only
        deactivated. Severity is not linked to priority; each issue type picks both.
      </p>
      <div className="table-responsive-container">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Code</th>
              <th>Name</th>
              <th>Colour</th>
              <th>Reply within (hours)</th>
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
                    <HoursInput value={s.responseHours} onChange={(n) => patch(s.id, { responseHours: n })} label={`Reply within for ${s.name}`} />
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
          <label className="form-label-control">Reply within (hours)</label>
          <HoursInput value={reply} onChange={setReply} label="Reply within for the new severity" />
        </div>
        <button type="submit" className="btn-primary" disabled={!name.trim() || dupName(name) || !(reply > 0)}>
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
  calendars,
  tickets,
  issueTypes,
}: {
  priorities: PriorityMaster[]
  setPriorities: React.Dispatch<React.SetStateAction<PriorityMaster[]>>
  calendars: BusinessCalendar[]
  tickets: { priority: string }[]
  issueTypes: IssueTypeConfig[]
}) {
  const sorted = [...priorities].sort((a, b) => a.rank - b.rank)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#0D9488')
  const [fix, setFix] = useState(8)
  const [hod, setHod] = useState(4)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const patch = (id: string, p: Partial<PriorityMaster>) =>
    setPriorities((l) => l.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const dupName = (n: string, except?: string) =>
    priorities.some((p) => p.id !== except && p.name.trim().toLowerCase() === n.trim().toLowerCase())

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || dupName(name) || !(fix > 0 && hod > 0)) return
    setPriorities((l) => [
      ...l,
      {
        id: uniqueId(slug(name).toUpperCase(), l.map((p) => p.id)),
        name: name.trim(),
        rank: Math.max(0, ...l.map((p) => p.rank)) + 1,
        color,
        active: true,
        description: '',
        resolutionHours: fix,
        hodLimitHours: hod,
        calendarId: calendars[0]?.id || 'cal-24x7',
      },
    ])
    setName('')
  }

  return (
    <div className="modern-card" style={{ padding: '20px' }}>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Rank 1 is the most urgent. Fix within is how soon a ticket of this priority must be resolved. HOD limit is how
        long the HOD has to approve. The calendar says when the clock runs. Priority is not linked to severity.
      </p>
      <div className="table-responsive-container">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Code</th>
              <th>Name</th>
              <th>Colour</th>
              <th>Fix within (hours)</th>
              <th>HOD limit (hours)</th>
              <th>Description</th>
              <th>Clock runs on</th>
              <th>Used by</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const u = usageOfPriority(p.id, tickets, issueTypes)
              const used = u.tickets + u.issueTypes > 0
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
                    <HoursInput value={p.resolutionHours} onChange={(n) => patch(p.id, { resolutionHours: n })} label={`Fix within for ${p.name}`} />
                  </td>
                  <td>
                    <HoursInput value={p.hodLimitHours} onChange={(n) => patch(p.id, { hodLimitHours: n })} label={`HOD limit for ${p.name}`} />
                  </td>
                  <td>
                    <input className="form-input-control" style={{ minWidth: '220px' }} value={p.description} onChange={(e) => patch(p.id, { description: e.target.value })} aria-label={`Description of ${p.id}`} />
                  </td>
                  <td>
                    <select className="form-input-control" value={p.calendarId} onChange={(e) => patch(p.id, { calendarId: e.target.value })} aria-label={`Calendar for ${p.name}`}>
                      {calendars.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {u.issueTypes} issue types
                    <br />
                    {u.tickets} tickets
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
        <div>
          <label className="form-label-control">Fix within (hours)</label>
          <HoursInput value={fix} onChange={setFix} label="Fix within for the new priority" />
        </div>
        <div>
          <label className="form-label-control">HOD limit (hours)</label>
          <HoursInput value={hod} onChange={setHod} label="HOD limit for the new priority" />
        </div>
        <button type="submit" className="btn-primary" disabled={!name.trim() || dupName(name) || !(fix > 0 && hod > 0)}>
          <Plus size={14} /> Add priority
        </button>
      </form>

    </div>
  )
}

/* ---------------------------------------------------------------- Calendars */

function CalendarTab({
  calendars,
  setCalendars,
  priorities,
  toast,
}: {
  calendars: BusinessCalendar[]
  setCalendars: React.Dispatch<React.SetStateAction<BusinessCalendar[]>>
  priorities: PriorityMaster[]
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
                const used = priorities.filter((p) => p.calendarId === c.id).length
                return (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ fontSize: '12.5px' }}>
                      {c.is24x7 ? 'All day, every day' : `${c.workDays.map((d) => DAYS[d]).join(', ')}, ${c.start} to ${c.end}`}
                    </td>
                    <td>{c.holidays.length}</td>
                    <td>{used} priorities</td>
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
