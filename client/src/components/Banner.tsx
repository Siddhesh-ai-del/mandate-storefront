import type { RunOutcome } from "./AgentConsole";

const REASON_COPY: Record<string, string> = {
  NO_MANDATE: "no signed mandate was presented",
  OVER_CAP: "the amount exceeded the mandate cap",
  OUT_OF_SCOPE: "the item category was outside mandate scope",
  EXPIRED: "the mandate had expired",
  BAD_SIGNATURE: "the mandate signature failed verification",
  NOTHING_IN_SCOPE: "nothing in stock fit the mandate",
};

/** The slam: full-width red banner when the mandate gate stops money movement. */
export function Banner({ outcome, onDismiss }: { outcome: RunOutcome | null; onDismiss: () => void }) {
  if (!outcome || outcome.status !== "BLOCKED") return null;
  const reason = REASON_COPY[outcome.blockedReason ?? ""] ?? outcome.blockedReason ?? "unknown";
  return (
    <div className="banner" role="alert">
      <span className="banner-tag">SPEND MANDATE VIOLATION</span>
      <span className="banner-text">
        create_order was never invoked — {reason}. The server-side gate rejected this cart.
      </span>
      <button className="banner-x" onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
