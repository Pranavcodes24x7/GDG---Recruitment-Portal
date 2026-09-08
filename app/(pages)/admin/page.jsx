import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminContent from "@/components/AdminContent";
import { connect, serializeFirestoreData } from "@/lib/db";
import { getSession } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin");
  if (session.user.role !== "admin") redirect("/");
  const snapshot = await (await connect()).collection("applications").orderBy("createdAt", "desc").limit(100).get();
  const applicants = snapshot.docs.map((document) => ({ id: document.id, ...serializeFirestoreData(document.data()) }));
  return <main className="site-shell"><NavBar /><AdminContent applicants={applicants} /><Footer /></main>;
}
