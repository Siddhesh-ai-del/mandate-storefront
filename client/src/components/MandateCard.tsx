import { useState } from "react";

export interface Mandate {
  mandateId: string;
  storeId: string;
  capCents: number;
  categories: string[];
  issuedAt: string;
  expiresAt: string;
  holder: string;
}

interface Props {
  mandate: Mandate | null;
  signature: string | null;
  spentCents: number;
  onMinted: (m: Mandate, sig: string) => void;
}

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function MandateCard({ mandate, signature, spentCents, onMinted }: Props) {
  const [open, setOpen] = useState(false);
  const [cap, setCap] = useState("40.00");
  const [categories, setCategories] = useState("headphones, cables");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mint() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/mandate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capCents: Math.round(parseFloat(cap) * 100),
          expiresInSec: 900,
          categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
          storeId: "aria-audio",
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      onMinted(body.mandate, body.signature);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!mandate) {
    return (
      <div className="mandate-empty">
        <p className="muted">
          No spend mandate yet. The agent cannot move money until you sign one.
        </p>
        <button className="btn" onClick={() => setOpen(true)}>
          Mint Spend Mandate
        </button>
        {open && (
          <div className="mint-form">
            <label>
              Cap (USD)
              <input value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" />
            </label>
            <label>
              Categories (comma-separated)
              <input value={categories} onChange={(e) => setCategories(e.target.value)} />
            </label>
            <div className="mint-actions">
              <button className="btn primary" onClick={mint} disabled={busy}>
                {busy ? "Signing…" : "Sign mandate"}
              </button>
              <button className="btn ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  const remaining = mandate.capCents - spentCents;
  const expired = Date.now() > Date.parse(mandate.expiresAt);

  return (
    <div className="mandate">
      <div className="mandate-head">
        <span className={`status ${expired ? "bad" : "ok"}`}>{expired ? "EXPIRED" : "ACTIVE"}</span>
        <span className="mono muted">{mandate.mandateId}</span>
      </div>
      <dl>
        <div>
          <dt>Cap</dt>
          <dd className="mono">{money(mandate.capCents)}</dd>
        </div>
        <div>
          <dt>Spent</dt>
          <dd className="mono">{money(spentCents)}</dd>
        </div>
        <div>
          <dt>Remaining</dt>
          <dd className={`mono ${remaining < mandate.capCents ? "ok-text" : ""}`}>
            {money(remaining)}
          </dd>
        </div>
        <div>
          <dt>Scope</dt>
          <dd className="mono">{mandate.categories.join(", ")}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd className="mono">{new Date(mandate.expiresAt).toLocaleTimeString("en-GB")}</dd>
        </div>
      </dl>
      <div className="sig mono" title={signature ?? ""}>
        HMAC-SHA256 · {signature?.slice(0, 24)}…
      </div>
      <button className="btn ghost" onClick={() => setOpen(true)}>
        Re-mint
      </button>
      {open && (
        <div className="mint-form">
          <label>
            Cap (USD)
            <input value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" />
          </label>
          <label>
            Categories
            <input value={categories} onChange={(e) => setCategories(e.target.value)} />
          </label>
          <div className="mint-actions">
            <button className="btn primary" onClick={mint} disabled={busy}>
              {busy ? "Signing…" : "Sign new mandate"}
            </button>
            <button className="btn ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
