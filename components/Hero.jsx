import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-grid">
        <div>
          <p className="eyebrow">Recruitment 2026 · Applications open</p>
          <h1 className="display">Make room for your <span className="emphasis">next</span> good idea.</h1>
          <p className="hero-lede">A campus community for people who learn out loud, build with care, and turn a spark of curiosity into something others can use.</p>
          <div className="hero-actions">
            <Link className="button-primary" href="/departments">Explore departments <ArrowRight size={17} /></Link>
            <Link className="button-secondary" href="#about">What we believe</Link>
          </div>
          <div className="hero-note"><i /> Choose up to two departments. Save your draft any time.</div>
        </div>
        <div className="hero-art" aria-label="Abstract Google-coloured illustration">
          <div className="floating-tag"><Sparkles size={14} /> built by students</div>
          <div className="art-card"><div className="art-blue" /><div className="art-green" /></div>
          <div className="art-window">
            <div className="window-top"><i /><i /><i /></div>
            <p className="window-label">Your next chapter</p>
            <p className="window-name">Find your people.</p>
            <div className="window-list"><span>build</span><span>learn</span><span>belong</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
