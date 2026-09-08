import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { reviews, SITE } from "@/constants";

export default function Home() {
  return (
    <main className="site-shell">
      <NavBar />
      <Hero />
      <section className="stat-strip" aria-label="Recruitment highlights">
        <div className="container stats">
          <div className="stat"><strong>12</strong><span>ways to contribute</span></div>
          <div className="stat"><strong>02</strong><span>departments you can choose</span></div>
          <div className="stat"><strong>01</strong><span>community to grow with</span></div>
        </div>
      </section>
      <section className="section container" id="departments">
        <div className="section-top">
          <div><p className="eyebrow">Find your lane</p><h2 className="section-heading">Different crafts. Shared curiosity.</h2></div>
          <p className="section-copy">You do not need a polished portfolio to begin. Pick the work that energises you, tell us how you think, and we will take it from there.</p>
        </div>
        <div className="department-grid">
          {reviews.map((department) => {
            const Icon = department.icon;
            return <Link href="/departments" className={`department-card ${department.accent}`} key={department.id}>
              <span className="department-icon"><Icon size={22} strokeWidth={1.8} /></span>
              <h3>{department.name}</h3><p>{department.description}</p><ArrowRight className="department-arrow" size={19} />
            </Link>;
          })}
        </div>
      </section>
      <section className="section container" id="about">
        <div className="principles">
          <div><p className="eyebrow">A better kind of club</p><h2 className="section-heading">Bring your questions. Leave with momentum.</h2><p className="section-copy">{SITE.name} is designed around doing—not collecting titles. We make room for first attempts, honest feedback, and work worth showing.</p></div>
          <div className="principle-list">
            <article className="principle"><span className="principle-number">01</span><div><h3>Learn in public</h3><p>Ask generously, share your process, and make every project an invitation for someone else to grow.</p></div></article>
            <article className="principle"><span className="principle-number">02</span><div><h3>Make useful things</h3><p>Move beyond tutorials with work that helps a real person, event, or campus community.</p></div></article>
            <article className="principle"><span className="principle-number">03</span><div><h3>Leave it better</h3><p>Good systems, kind collaboration, and clear handovers are part of the craft—not afterthoughts.</p></div></article>
          </div>
        </div>
      </section>
      <section className="container cta-band"><div className="cta-inner"><p className="eyebrow" style={{ color: "#fbbc04" }}>Your first move</p><h2>Something here might be yours to make.</h2><p>Take a look at the departments, choose up to two, and send us a considered application when you are ready.</p><Link className="button-primary" href="/departments">Start your application <ArrowRight size={17} /></Link></div></section>
      <Footer />
    </main>
  );
}
