import {
  BusinessCalendar,
  IssueTypeConfig,
  PriorityMaster,
  SeverityMaster,
  SlaSnapshot,
} from '@/app/ticket-data'

export interface MastersData {
  severities: SeverityMaster[]
  priorities: PriorityMaster[]
  calendars: BusinessCalendar[]
}

export function fmtHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`
  return Number.isInteger(h) ? `${h} h` : `${h} h`
}

export function findSeverity(m: Pick<MastersData, 'severities'>, id: string) {
  return m.severities.find((s) => s.id === id)
}
export function findPriority(m: Pick<MastersData, 'priorities'>, id: string) {
  return m.priorities.find((p) => p.id === id)
}
export function findCalendar(m: Pick<MastersData, 'calendars'>, id?: string) {
  return (id && m.calendars.find((c) => c.id === id)) || m.calendars[0]
}

/** Name for a severity or priority id. Falls back to the id so old tickets still read well. */
export function severityName(m: Pick<MastersData, 'severities'>, id: string) {
  return findSeverity(m, id)?.name || id
}
export function priorityName(m: Pick<MastersData, 'priorities'>, id: string) {
  return findPriority(m, id)?.name || id
}

function parseHm(s: string): number {
  const [h, m] = s.split(':').map((x) => parseInt(x, 10))
  return (h || 0) * 60 + (m || 0)
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Add working hours to a start time on a calendar.
 * A 24x7 calendar is plain addition. Otherwise only the working window of working days,
 * minus holidays, counts. Gives up after a year so a bad calendar cannot loop.
 */
export function addCalendarHours(startMs: number, hours: number, cal: BusinessCalendar): number {
  if (cal.is24x7) return startMs + hours * 3600 * 1000
  const open = parseHm(cal.start)
  const close = parseHm(cal.end)
  if (close <= open || cal.workDays.length === 0) return startMs + hours * 3600 * 1000
  let remaining = hours * 60 // minutes
  const d = new Date(startMs)
  for (let i = 0; i < 366 && remaining > 0; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (i === 0 ? 0 : i))
    const isWork = cal.workDays.includes(day.getDay()) && !cal.holidays.some((h) => h.date === ymd(day))
    if (!isWork) continue
    const dayOpen = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, open).getTime()
    const dayClose = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, close).getTime()
    const from = Math.max(startMs, dayOpen)
    if (from >= dayClose) continue
    const availMin = (dayClose - from) / 60000
    if (remaining <= availMin) return from + remaining * 60000
    remaining -= availMin
  }
  return startMs + hours * 3600 * 1000
}

export interface ResolvedSla {
  severityId: string
  priorityId: string
  priorityName: string
  calendar: BusinessCalendar
  responseHours: number
  resolutionHours: number
  hodLimitHours: number
}

/**
 * Severity, priority and SLA for a new ticket.
 * The issue type gives the severity and the priority (picked separately by Admin, not linked).
 * Reply within comes from the severity. Fix within, the HOD limit and the calendar come from the priority.
 */
export function resolveSla(
  m: Pick<MastersData, 'severities' | 'priorities' | 'calendars'>,
  issue: IssueTypeConfig | undefined
): ResolvedSla {
  const severityId = issue?.autoSeverity || m.severities[0]?.id || 'Medium'
  const priorityId = issue?.autoPriority || m.priorities.find((p) => p.active)?.id || 'P3'
  const sev = findSeverity(m, severityId)
  const pri = findPriority(m, priorityId)
  return {
    severityId,
    priorityId,
    priorityName: pri?.name || priorityId,
    calendar: findCalendar(m, pri?.calendarId),
    responseHours: sev?.responseHours || 1,
    resolutionHours: pri?.resolutionHours || 4,
    hodLimitHours: pri?.hodLimitHours || 2,
  }
}

export function snapshotOf(r: ResolvedSla, now = Date.now()): SlaSnapshot {
  return {
    priorityId: r.priorityId,
    priorityName: r.priorityName,
    calendarId: r.calendar.id,
    responseHours: r.responseHours,
    resolutionHours: r.resolutionHours,
    hodLimitHours: r.hodLimitHours,
    resolutionDue: addCalendarHours(now, r.resolutionHours, r.calendar),
  }
}

/** How many tickets and issue types use a master value. Used to block deletes. */
export function usageOfSeverity(
  id: string,
  tickets: { severity: string }[],
  issueTypes: IssueTypeConfig[]
) {
  return {
    tickets: tickets.filter((t) => t.severity === id).length,
    issueTypes: issueTypes.filter((i) => i.autoSeverity === id).length,
  }
}
export function usageOfPriority(
  id: string,
  tickets: { priority: string }[],
  issueTypes: IssueTypeConfig[]
) {
  return {
    tickets: tickets.filter((t) => t.priority === id).length,
    issueTypes: issueTypes.filter((i) => i.autoPriority === id).length,
  }
}
