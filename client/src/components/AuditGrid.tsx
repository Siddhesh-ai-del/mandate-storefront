import { useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type BodyScrollEvent,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface AuditEvent {
  id: number;
  ts: string;
  actor: string;
  tool: string;
  verdict: "INFO" | "OK" | "WARN" | "BLOCKED";
  summary: string;
  detail?: unknown;
}

/** Theming API (v33+) — NEO-BRUTALIST params: cream paper, yellow headers, black rules. */
const theme = themeQuartz.withParams({
  backgroundColor: "#faf3e3",
  foregroundColor: "#000000",
  headerBackgroundColor: "#ffe500",
  headerTextColor: "#000000",
  borderColor: "#000000",
  chromeBackgroundColor: "#faf3e3",
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: 12,
  rowHeight: 26,
  headerHeight: 30,
  spacing: 6,
});

const colDefs: ColDef<AuditEvent>[] = [
  {
    field: "ts",
    headerName: "TIME",
    width: 105,
    valueFormatter: (p) =>
      new Date(p.value as string).toLocaleTimeString("en-GB", { hour12: false }),
    sortable: true,
  },
  { field: "actor", headerName: "ACTOR", width: 90 },
  { field: "tool", headerName: "TOOL", width: 160 },
  {
    field: "verdict",
    headerName: "VERDICT",
    width: 110,
    cellClass: (p) => `verdict-${(p.value as string).toLowerCase()}`,
  },
  { field: "summary", headerName: "SUMMARY", flex: 1, minWidth: 260 },
];

export function AuditGrid({ events }: { events: AuditEvent[] }) {
  const apiRef = useRef<GridApi<AuditEvent> | null>(null);
  const atBottomRef = useRef(true);

  const onGridReady = (params: GridReadyEvent<AuditEvent>) => {
    apiRef.current = params.api;
  };

  // Tail like a log file: keep the newest event in view — unless the reader
  // scrolled up to inspect history (then never yank them back down).
  useEffect(() => {
    const api = apiRef.current;
    if (!api || !atBottomRef.current) return;
    const last = api.getDisplayedRowCount() - 1;
    if (last >= 0) api.ensureIndexVisible(last, "bottom");
  }, [events.length]);

  const onBodyScroll = (params: BodyScrollEvent<AuditEvent>) => {
    const last = params.api.getDisplayedRowCount() - 1;
    const lastNode = last >= 0 ? params.api.getDisplayedRowAtIndex(last) : null;
    atBottomRef.current = Boolean(lastNode && params.api.getRenderedNodes().includes(lastNode));
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        theme={theme}
        rowData={events}
        columnDefs={colDefs}
        getRowId={(p) => String(p.data.id)}
        animateRows={false}
        defaultColDef={{ sortable: false, resizable: false }}
        onGridReady={onGridReady}
        onBodyScroll={onBodyScroll}
      />
    </div>
  );
}
