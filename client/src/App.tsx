import { useEffect, useState } from "react";
import { AuditGrid, type AuditEvent } from "./components/AuditGrid";
import { Storefront } from "./components/Storefront";
import { MandateCard, type Mandate } from "./components/MandateCard";

interface Health {
  ok: boolean;
  paypalMode: string;
  llmMode: string;
}

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [conn, setConn] = useState<"connecting" | "live" | "down">("connecting");
  const [mandate, setMandate] = useState<Mandate | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [spentCents, setSpentCents] = useState(0);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, paypalMode: "OFFLINE", llmMode: "OFFLINE" }));

    const source = new EventSource("/api/events");
    source.onopen = () => setConn("live");
    source.onmessage = (msg) => {
      const e = JSON.parse(msg.data) as AuditEvent;
      setEvents((prev) => [...prev.slice(-499), e]);
    };
    source.onerror = () => setConn("down");
    return () => source.close();
  }, []);

  const paypalTone = health?.paypalMode === "SANDBOX" ? "ok" : "warn";
  const llmTone = health?.llmMode === "LIVE" ? "ok" : "warn";

  return (
    <div className="app">
      <header className="topbar">
        <h1>MANDATE&nbsp;STOREFRONT</h1>
        <span className="sub">agent-ready shopping · provable permission</span>
        <span className="spacer" />
        <span className="chip" data-tone={paypalTone}>
          PayPal: {health?.paypalMode ?? "…"}
        </span>
        <span className="chip" data-tone={llmTone}>
          LLM: {health?.llmMode ?? "…"}
        </span>
        <span className="chip" data-tone={conn === "live" ? "ok" : "warn"}>
          audit: {conn}
        </span>
      </header>

      <main className="panels">
        <section className="panel">
          <h2>Storefront — agent-readable catalog</h2>
          <Storefront />
        </section>
        <section className="panel">
          <h2>Spend Mandate — signed consent</h2>
          <MandateCard
            mandate={mandate}
            signature={signature}
            spentCents={spentCents}
            onMinted={(m, sig) => {
              setMandate(m);
              setSignature(sig);
              setSpentCents(0);
            }}
          />
        </section>
        <section className="panel">
          <h2>Agent Console</h2>
          <div className="placeholder">Tool loop + the BLOCK lands in P5–P6.</div>
        </section>
      </main>

      <section className="audit-dock">
        <div className="dock-head">
          <span>Audit log — AG Grid Community</span>
          <span className="count">{events.length} events</span>
          <span className="spacer" />
          <span className="chip">every tool call · every verdict</span>
        </div>
        <div className="grid-wrap">
          <AuditGrid events={events} />
        </div>
      </section>
    </div>
  );
}
