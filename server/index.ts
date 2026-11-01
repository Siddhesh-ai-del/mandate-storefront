import express from "express";
import cors from "cors";
import { eventsRouter } from "./src/routes/events";
import { log, reset as resetAudit } from "./src/audit/bus";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", eventsRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    paypalMode: process.env.PAYPAL_CLIENT_ID ? "SANDBOX" : "DEMO MODE",
    llmMode: process.env.LLM_API_KEY ? "LIVE" : "SCRIPTED FALLBACK",
  });
});

/** Judges break demos — reset endpoint exists from day one (button lands in P11). */
app.post("/api/demo/reset", (_req, res) => {
  resetAudit();
  log("system", "demo", "INFO", "Demo state reset");
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  log("system", "boot", "INFO", `Mandate Storefront API listening on :${port}`);
});
