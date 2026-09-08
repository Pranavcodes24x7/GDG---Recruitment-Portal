"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const SubmissionsContext = createContext({ submittedDepartments: [], isLoadingSubmissions: false, markDepartmentsSubmitted: () => {}, refreshSubmissions: async () => {} });
export function SubmissionsProvider({ children }) {
  const { data: session } = authClient.useSession();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const refreshSubmissions = useCallback(async () => {
    if (!session?.user) { setSubmittedDepartments([]); return; }
    setIsLoadingSubmissions(true);
    try {
      const response = await fetch("/api/check-applications", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load applications");
      const payload = await response.json();
      setSubmittedDepartments(payload.submittedDepartments || []);
    } catch (error) {
      console.error("Unable to refresh applications", error);
    } finally { setIsLoadingSubmissions(false); }
  }, [session?.user?.id]);

  useEffect(() => { refreshSubmissions(); }, [refreshSubmissions]);
  const markDepartmentsSubmitted = useCallback((departments) => setSubmittedDepartments((current) => [...new Set([...current, ...departments])]), []);

  return <SubmissionsContext.Provider value={{ submittedDepartments, isLoadingSubmissions, markDepartmentsSubmitted, refreshSubmissions }}>{children}</SubmissionsContext.Provider>;
}

export const useSubmissions = () => useContext(SubmissionsContext);
