import { redirect } from "next/navigation";

// Preserve the old link while directing candidates to the new team selector.
export default function DevelopmentRedirect() { redirect("/departments"); }
