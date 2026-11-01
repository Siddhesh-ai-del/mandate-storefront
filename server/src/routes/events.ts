import { Router } from "express";
import { replay, subscribe, type AuditEvent } from "../audit/bus";

export const eventsRouter = Router();

/** SSE stream with initial ring-buffer replay (reconnect-safe). */
eventsRouter.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (e: AuditEvent) => res.write(`data: ${JSON.stringify(e)}\n\n`);
  for (const e of replay()) send(e);
  const unsubscribe = subscribe(send);

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);
  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});
