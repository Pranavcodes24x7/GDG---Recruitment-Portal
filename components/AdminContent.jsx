"use client";

import { useMemo, useState } from "react";
import DataTable from "./DataTable";

export default function AdminContent({ applicants }) {
  const [records, setRecords] = useState(applicants);
  const counts = useMemo(() => ({ total: records.length, shortlisted: records.filter((record) => record.shortlisted).length, departments: new Set(records.map((record) => record.department)).size }), [records]);
  return <section className="container admin-wrap"><div className="admin-heading"><div><p className="eyebrow">Private review workspace</p><h1 className="display">Review desk.</h1></div><p className="section-copy">Applications are protected at the route and API layer. Shortlist decisions are recorded server-side.</p></div><div className="admin-kpis"><div className="kpi"><span>Applications</span><strong>{counts.total}</strong></div><div className="kpi"><span>Shortlisted</span><strong>{counts.shortlisted}</strong></div><div className="kpi"><span>Active departments</span><strong>{counts.departments}</strong></div></div><DataTable data={records} onChange={setRecords} /></section>;
}
