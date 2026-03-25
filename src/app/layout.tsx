"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { VelosProvider } from "@/context/VelosContext";
import ScrollToTop from "@/components/ScrollToTop";

function AppContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // initial mount fallback to prevent layout shift
  if (!mounted) return <div className="bg-black min-h-screen" />;

  // ARCHIVE VIEW (Unified)
  // The "Gatekeeper" logic has been removed to allow direct access to the global archive.
  return (
    <>
      <main className="relative animate-in fade-in duration-700">
        {children}
      </main>
      <ScrollToTop />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-black text-white selection:bg-white selection:text-black"> 
        <VelosProvider>
          <AppContent>{children}</AppContent>
        </VelosProvider>
      </body>
    </html>
  );
}