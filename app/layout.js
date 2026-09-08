import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SubmissionsProvider } from "@/components/SubmissionsProvider";
import "./globals.css";

export const metadata = {
  title: "GDG on Campus — Recruitment 2026",
  description: "A thoughtful first step into a community that builds, learns, and shares.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SubmissionsProvider>{children}</SubmissionsProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
