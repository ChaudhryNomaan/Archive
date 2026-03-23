"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { VelosProvider, useVelos } from "@/context/VelosContext";
import ScrollToTop from "@/components/ScrollToTop";
import CityGate from "@/components/CityGate";

function AppContent({ children }: { children: React.ReactNode }) {
  const { selectedCity } = useVelos();
  const [mounted, setMounted] = useState(false);

  // 1. Prevent hydration mismatch by waiting for mount
  // This ensures the client-side localStorage check has finished
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a blank black screen during initial mount to prevent a flash of the wrong state
  if (!mounted) return <div className="bg-black min-h-screen" />;

  // 2. THE GATEKEEPER LOGIC
  // If no city is selected (e.g., after clicking RELOCATE), show ONLY the gate.
  // This replaces the entire page content instantly.
  if (!selectedCity) {
    return (
      <div className="animate-in fade-in duration-1000">
        <CityGate />
      </div>
    );
  }

  // 3. ARCHIVE VIEW
  // If a city is selected, show the archive content + scroll helpers.
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