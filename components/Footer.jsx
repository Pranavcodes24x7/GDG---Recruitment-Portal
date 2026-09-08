import Link from "next/link";
import { Brand } from "./NavBar";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div><Brand /><p>Built for curious people who make things happen.</p></div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/departments">Departments</Link>
          <Link href="/auth/signin">Sign in</Link>
          <span>© {new Date().getFullYear()}</span>
        </nav>
      </div>
    </footer>
  );
}
