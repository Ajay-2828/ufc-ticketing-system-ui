import {
  ClassificationConfig,
  Ticket,
  TicketType,
  policySettings,
} from '@/app/ticket-data'

const PREFIX: Record<TicketType, string> = {
  Incident: 'INC',
  'Service Request': 'SRQ',
  Issue: 'ISS',
  'Change Request': 'CR',
}

/** Next ticket number for a type: highest existing number of that prefix plus one. */
export function nextTicketId(tickets: Ticket[], type: TicketType): string {
  const prefix = PREFIX[type]
  let max = 0
  for (const t of tickets) {
    const m = new RegExp(`^${prefix}-\\d{4}-(\\d+)$`).exec(t.id)
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(max + 1).padStart(4, '0')}`
}

export function findSubClass(tree: ClassificationConfig[], ticket: Pick<Ticket, 'app' | 'subClassification'>) {
  const name = (ticket.subClassification || ticket.app || '').toLowerCase()
  for (const main of tree) {
    const sub = main.subClassifications.find((s) => s.name.toLowerCase() === name)
    if (sub) return sub
  }
  return undefined
}

export interface AssignmentResult {
  assignee?: string
  note: string
}

/**
 * Round robin among the sub-class technicians who are not on leave.
 * The position is the number of tickets already given to this sub-class.
 * Returns no assignee when nobody is available: the ticket then goes to Admin.
 */
export function pickTechnician(
  tree: ClassificationConfig[],
  ticket: Ticket,
  allTickets: Ticket[]
): AssignmentResult {
  const sub = findSubClass(tree, ticket)
  if (!sub || sub.technicians.length === 0) {
    return { note: 'No technician is set for this sub-classification.' }
  }
  const available = sub.technicians.filter((n) => !policySettings.techniciansOnLeave.includes(n))
  if (available.length === 0) {
    return { note: 'All technicians of this sub-classification are on leave.' }
  }
  const given = allTickets.filter(
    (t) =>
      t.id !== ticket.id &&
      (t.subClassification || t.app) === (ticket.subClassification || ticket.app) &&
      sub.technicians.includes(t.assignee)
  ).length
  const assignee = available[given % available.length]
  return {
    assignee,
    note: `Round robin over ${available.length} technician${available.length > 1 ? 's' : ''} of ${sub.name}.`,
  }
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Time limit passed'
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`
}

/** HOD approval time left. Tickets without a live deadline show their stored text. */
export function hodRemaining(ticket: Ticket, now = Date.now()): string {
  if (ticket.hodDeadline) return formatRemaining(ticket.hodDeadline - now)
  return ticket.hodTimeRemaining ? `${ticket.hodTimeRemaining} remaining` : ''
}

export const MS_HOUR = 3600 * 1000
export const MS_DAY = 24 * MS_HOUR
