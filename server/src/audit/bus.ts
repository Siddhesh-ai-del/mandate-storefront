/** Audit event spine: every slice emits events here; SSE fans them to the UI. */

export type AuditSeverity = "INFO" | "OK" | "WARN" | "BLOCKED";

export interface AuditEvent {
  id: number;
  ts: string; // ISO
  actor: "user" | "agent" | "system" | "paypal" | "mandate";
  tool: string;
  verdict: AuditSeverity;
  summary: string;
  detail?: unknown;
}

type Listener = (e: AuditEvent) => void;

const BUFFER_MAX = 500;
let nextId = 1;
const buffer: AuditEvent[] = [];
const listeners = new Set<Listener>();

export function log(
  actor: AuditEvent["actor"],
  tool: string,
  verdict: AuditSeverity,
  summary: string,
  detail?: unknown
): AuditEvent {
  const event: AuditEvent = {
    id: nextId++,
    ts: new Date().toISOString(),
    actor,
    tool,
    verdict,
    summary,
    ...(detail !== undefined ? { detail } : {}),
  };
  buffer.push(event);
  if (buffer.length > BUFFER_MAX) buffer.shift();
  for (const fn of listeners) fn(event);
  return event;
}

export function replay(): AuditEvent[] {
  return [...buffer];
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function reset(): void {
  buffer.length = 0;
  nextId = 1;
}
