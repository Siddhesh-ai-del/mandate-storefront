import { useEffect, useState } from "react";

export interface GoalInfo {
  label: string;
  narration: string;
}

interface Goals {
  compliant: GoalInfo;
  violation: GoalInfo;
}

export interface RunOutcome {
  goalId: "compliant" | "violation";
  runId: string;
  status: "AWAITING_APPROVAL" | "BLOCKED" | "ERROR";
  orderId?: string;
  blockedReason?: string;
  pickedSku?: string;
  amountCents?: number;
}

const REASON_COPY: Record<string, string> = {
  NO_MANDATE: "no signed mandate was presented",
  OVER_CAP: "the amount exceeded the mandate cap",
  OUT_OF_SCOPE: "the item category was outside mandate scope",
  EXPIRED: "the mandate had expired",
  BAD_SIGNATURE: "the mandate signature failed verification",
  NOTHING_IN_SCOPE: "nothing in stock fit the mandate",
};

const reasonText = (code?: string) =>
  code ? (REASON_COPY[code] ?? code) : "unknown reason";

interface Props {
  mandateId: string | null;
  onApproved: (remainingCents: number) => void;
  onBlocked: (outcome: RunOutcome) => void;
  onOutcome: (outcome: RunOutcome) => void;
}

export function AgentConsole({ mandateId, onApproved, onBlocked, onOutcome }: Props) {
  const [goals, setGoals] = useState<Goals | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetch("/api/agent/goals")
      .then((r) => r.json())
      .then(setGoals)
      .catch(() => setGoals(null));
  }, []);

  async function run(goalId: "compliant" | "violation") {
    if (!mandateId || running) return;
    setRunning(goalId);
    setOutcome(null);
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, mandateId }),
      });
      const body = (await res.json()) as RunOutcome;
      setOutcome(body);
      onOutcome(body);
      if (body.status === "BLOCKED") onBlocked(body);
    } finally {
      setRunning(null);
    }
  }

  async function approve() {
    if (!outcome?.orderId) return;
    setApproving(true);
    try {
      const res = await fetch("/api/agent/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: outcome.orderId }),
      });
      const body = await res.json();
      if (res.ok) {
        onApproved(body.captured.remainingCents);
        setOutcome(null); // completion story lives in audit log + mandate card
      }
    } finally {
      setApproving(false);
    }
  }

  const disabled = !mandateId;

  return (
    <div className="console">
      <p className="console-goal muted">
        {goals?.compliant.narration ?? "Loading agent goals…"}
      </p>
      <div className="console-buttons">
        <button
          className="btn primary"
          disabled={disabled || running !== null}
          onClick={() => run("compliant")}
        >
          {running === "compliant" ? "Agent working…" : "Run: compliant goal"}
        </button>
        <button
          className="btn danger"
          disabled={disabled || running !== null}
          onClick={() => run("violation")}
        >
          {running === "violation" ? "Agent working…" : "Run: violation goal"}
        </button>
      </div>
      {disabled && (
        <p className="muted console-hint">
          Mint a mandate first — the agent refuses to act without one.
        </p>
      )}

      {outcome?.status === "AWAITING_APPROVAL" && (
        <div className="approve-sheet">
          <div className="approve-head">
            <span className="status ok">PAYER APPROVAL REQUIRED</span>
          </div>
          <p>
            Order <span className="mono">{outcome.orderId}</span> ·{" "}
            <span className="mono">${((outcome.amountCents ?? 0) / 100).toFixed(2)}</span> ·{" "}
            {outcome.pickedSku}
          </p>
          <p className="muted">
            The agent cannot capture funds. Only you — the payer — can approve.
          </p>
          <button className="btn primary" disabled={approving} onClick={approve}>
            {approving ? "Capturing…" : "Approve & capture (sandbox buyer)"}
          </button>
        </div>
      )}

      {outcome?.status === "BLOCKED" && (
        <div className="blocked-detail">
          <p>
            <span className="bad-text">BLOCKED</span> — {reasonText(outcome.blockedReason)}.
            No PayPal order was created.
          </p>
        </div>
      )}
    </div>
  );
}
