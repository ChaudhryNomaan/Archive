"use client";

import { usePathname } from "next/navigation";
import { VelosProvider } from "@/context/VelosContext";
import Nav from "@/components/Nav";
import ShoppingBag from "@/components/ShoppingBag";
import MobileOverlay from "@/components/MobileOverlay";
import MinimalCursor from "@/components/MinimalCursor";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Detects if we are in the admin dashboard to strip away public-facing UI
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <VelosProvider>
      {!isAdmin && (
        <>
          <MinimalCursor />
          <Nav />
          <MobileOverlay />
          <ShoppingBag />
          <ScrollToTop />
        </>
      )}
      
      <main className={!isAdmin ? "min-h-screen" : ""}>
        {children}
      </main>

      {!isAdmin && <Footer />}
    </VelosProvider>
  );
}