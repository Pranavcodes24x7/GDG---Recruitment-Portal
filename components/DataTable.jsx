"use client";

import { useMemo, useState } from "react";

export default function DataTable({ data, onChange }) {
  const [query, setQuery] = useState(""); const [department, setDepartment] = useState("all"); const [status, setStatus] = useState("all"); const [updating, setUpdating] = useState("");
  const departments = useMemo(() => [...new Set(data.map((record) => record.department))].sort(), [data]);
  const filtered = useMemo(() => data.filter((record) => {
    const searchable = `${record.profile?.name || ""} ${record.email || ""} ${record.profile?.registrationNumber || ""} ${record.department || ""}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (department === "all" || record.department === department) && (status === "all" || (status === "shortlisted" ? record.shortlisted : !record.shortlisted));
  }), [data, department, query, status]);
  async function toggle(record) {
    setUpdating(record.id);
    try {
      const response = await fetch(`/api/shortlist/${record.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shortlisted: !record.shortlisted }) });
      if (!response.ok) throw new Error("Unable to update status");
      const { data: updated } = await response.json(); onChange(data.map((entry) => entry.id === record.id ? updated : entry));
    } catch { alert("The status could not be saved. Please try again."); } finally { setUpdating(""); }
  }
  return <div className="admin-table-wrap"><div className="admin-toolbar"><input aria-label="Search applications" placeholder="Search name, email, registration no…" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">All departments</option>{departments.map((departmentName) => <option value={departmentName} key={departmentName}>{departmentName}</option>)}</select><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="shortlisted">Shortlisted</option><option value="submitted">In review</option></select></div>{filtered.length ? <table className="admin-table"><thead><tr><th>Applicant</th><th>Registration</th><th>Department</th><th>Received</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><span className="table-name">{record.profile?.name || "—"}</span><span className="table-email">{record.email}</span></td><td>{record.profile?.registrationNumber || "—"}</td><td>{record.department}</td><td>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "—"}</td><td><span className={`status-pill ${record.shortlisted ? "shortlisted" : ""}`}>{record.shortlisted ? "Shortlisted" : "In review"}</span></td><td><button className="tiny-button" disabled={updating === record.id} onClick={() => toggle(record)}>{updating === record.id ? "Saving…" : record.shortlisted ? "Remove shortlist" : "Shortlist"}</button></td></tr>)}</tbody></table> : <div className="empty-table">No applications match those filters.</div>}</div>;
}
