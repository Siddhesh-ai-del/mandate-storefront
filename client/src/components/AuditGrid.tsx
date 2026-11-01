import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, type ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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
  return (
    <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={events}
        columnDefs={colDefs}
        getRowId={(p) => String(p.data.id)}
        animateRows={false}
        suppressCellFocus={false}
        rowHeight={26}
        headerHeight={30}
        defaultColDef={{ sortable: false, resizable: false, suppressHeaderMenuButton: true }}
      />
    </div>
  );
}
