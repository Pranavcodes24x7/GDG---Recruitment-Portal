"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { reviews, SITE } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";

export default function DepartmentsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const { submittedDepartments, isLoadingSubmissions } = useSubmissions();
  const availableSlots = Math.max(0, SITE.applicationLimit - submittedDepartments.length);
  const selectedRecords = useMemo(() => reviews.filter((department) => selected.includes(department.id)), [selected]);

  function toggle(department) {
    if (submittedDepartments.includes(department.name)) return;
    setSelected((current) => current.includes(department.id)
      ? current.filter((id) => id !== department.id)
      : current.length >= availableSlots ? current : [...current, department.id]);
  }

  function continueToForm() { if (selected.length) router.push(`/join/${selected.join("/")}`); }

  return <main className="site-shell"><NavBar />
    <section className="container page-hero"><p className="eyebrow">Step 01 · Choose your direction</p><h1 className="display">A team is a place to start.</h1><p>Choose up to two departments that feel like a good fit right now. You can bring experience, enthusiasm, or simply a question worth following.</p><div className="stepper" aria-label="Application steps"><span className="step active"><i>1</i>Choose departments</span><span className="step"><i>2</i>Tell your story</span><span className="step"><i>3</i>Review</span></div></section>
    <section className="container selection-layout" id="how-it-works">
      <div className="selection-grid" aria-label="Department selection">
        {reviews.map((department) => {
          const isSelected = selected.includes(department.id); const submitted = submittedDepartments.includes(department.name); const Icon = department.icon;
          return <button type="button" className={`select-card ${isSelected ? "selected" : ""} ${submitted ? "submitted" : ""}`} onClick={() => toggle(department)} disabled={submitted || (!isSelected && selected.length >= availableSlots)} key={department.id} aria-pressed={isSelected}>
            <span className={`department-icon ${department.accent}`}><Icon size={21} /></span><span className="select-check"><Check size={15} /></span><h2>{department.name}</h2><p>{submitted ? "Application received" : department.description}</p><span className="tag-list">{department.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</span>
          </button>;
        })}
      </div>
      <aside className="selection-panel"><p className="eyebrow">Your selection</p><h2>{isLoadingSubmissions ? "Checking…" : `${selected.length} of ${availableSlots} chosen`}</h2><p>You may apply to a maximum of {SITE.applicationLimit} departments. Each application gets its own tailored questions.</p><div className="chosen-list">{selectedRecords.length ? selectedRecords.map((record) => <span className="chosen-item" key={record.id}>{record.shortName}<Check size={14} /></span>) : <span className="chosen-empty">Nothing selected yet.</span>}</div><button type="button" className="button-primary" disabled={!selected.length} onClick={continueToForm}>Continue <ArrowRight size={16} /></button></aside>
    </section>
    <Footer />
  </main>;
}
