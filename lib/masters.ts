import {
  BusinessCalendar,
  IssueTypeConfig,
  PriorityMaster,
  SeverityMaster,
  SlaPolicy,
  SlaSnapshot,
} from '@/app/ticket-data'

export interface MastersData {
  severities: SeverityMaster[]
  priorities: PriorityMaster[]
  slaPolicies: SlaPolicy[]
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
export function findPolicy(m: Pick<MastersData, 'slaPolicies'>, id?: string) {
  return id ? m.slaPolicies.find((p) => p.id === id) : undefined
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
  policy?: SlaPolicy
  calendar: BusinessCalendar
  responseHours: number
  resolutionHours: number
  hodLimitHours: number
}

/**
 * Severity, priority and SLA for a new ticket, all from the masters.
 * 1. The issue type gives the severity and the SLA policy.
 * 2. The severity gives the starting priority (or the one chosen, if allowed).
 * 3. The policy may override the times for that priority.
 * Issue types that still carry old hour fields and no policy use those as a fallback.
 */
export function resolveSla(
  m: MastersData,
  issue: IssueTypeConfig | undefined,
  chosenPriorityId?: string
): ResolvedSla {
  const severityId = issue?.autoSeverity || m.severities[0]?.id || 'Medium'
  const sev = findSeverity(m, severityId)
  const priorityId =
    chosenPriorityId ||
    sev?.defaultPriorityId ||
    m.priorities.find((p) => p.active)?.id ||
    'P3'
  const policy = findPolicy(m, issue?.slaPolicyId)
  const calendar = findCalendar(m, policy?.calendarId)
  const ov = policy?.overrides[priorityId]
  const responseHours = ov?.responseHours ?? policy?.responseHours ?? issue?.slaResponseHours ?? 1
  const resolutionHours = ov?.resolutionHours ?? policy?.resolutionHours ?? issue?.slaResolutionHours ?? 4
  const hodLimitHours = policy?.hodLimitHours ?? issue?.hodApprovalLimitHours ?? 2
  return { severityId, priorityId, policy, calendar, responseHours, resolutionHours, hodLimitHours }
}

export function snapshotOf(r: ResolvedSla, now = Date.now()): SlaSnapshot {
  return {
    policyId: r.policy?.id || 'none',
    policyName: r.policy?.name || 'No SLA policy',
    calendarId: r.calendar.id,
    responseHours: r.responseHours,
    resolutionHours: r.resolutionHours,
    hodLimitHours: r.hodLimitHours,
    resolutionDue: addCalendarHours(now, r.resolutionHours, r.calendar),
  }
}

/** How many tickets, issue types and policies use a master value. Used to block deletes. */
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
  severities: SeverityMaster[],
  policies: SlaPolicy[]
) {
  return {
    tickets: tickets.filter((t) => t.priority === id).length,
    severities: severities.filter((s) => s.defaultPriorityId === id).length,
    policies: policies.filter((p) => p.overrides[id]).length,
  }
}
