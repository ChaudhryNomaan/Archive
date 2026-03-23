"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVelos } from '@/context/VelosContext';
import { CAT_MAP } from '@/lib/constants';
import { createClient } from '@/lib/supabase';

export default function Nav() {
  const supabase = createClient();
  const { 
    isMenuOpen, 
    setIsMenuOpen, 
    bag, 
    setIsBagOpen, 
    selectedCity, 
    setSelectedCity // Ensure this is destructured from your context
  } = useVelos();
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [branding, setBranding] = useState({
    logoText: 'VELOS',
    bagLabel: 'BAG'
  });

  // THE RELOCATE LOGIC
  const handleRelocate = () => {
    setSelectedCity(null); // This triggers the CityGate to show
    localStorage.removeItem('velos-city'); // Clear from memory
    setIsMenuOpen(false); // Close mobile menu if open
  };

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('content')
          .eq('section_name', 'identity')
          .single();

        if (error) throw error;

        if (data?.content) {
          setBranding({
            logoText: data.content.logoText || 'VELOS',
            bagLabel: data.content.bagLabel || 'BAG'
          });
        }
      } catch (err) {
        console.warn("Branding sync skipped, using defaults:", err);
      }
    };

    fetchBranding();

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / (totalScroll || 1)) * 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [supabase]);

  return (
    <header className="site-nav">
      <div className="nav-container">
        <div className="nav-left">
          <button 
            className="menu-trigger" 
            aria-label="Toggle Menu" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
            <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
          </button>
          <div className="desktop-links">
            {Object.keys(CAT_MAP).map(c => (
              <Link key={c} href={`/category/${c}`}>{c}</Link>
            ))}
          </div>
        </div>
        
        <Link href="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-main">{branding.logoText}</span>
          {selectedCity && (
            <span className="logo-city"> // {selectedCity.toUpperCase()}</span>
          )}
        </Link>
        
        <div className="nav-right" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* THE RELOCATE BUTTON */}
          {selectedCity && (
            <button 
              className="relocate-nav-link" 
              onClick={handleRelocate}
            >
              RELOCATE
            </button>
          )}

          <button className="bag-trigger" onClick={() => setIsBagOpen(true)}>
            {branding.bagLabel} ({bag?.length || 0})
          </button>
        </div>
      </div>

      <style jsx>{`
        .logo-main {
          font-weight: 900;
          letter-spacing: -1px;
        }
        .logo-city {
          font-size: 10px;
          letter-spacing: 2px;
          font-weight: 400;
          opacity: 0.5;
          margin-left: 8px;
        }
        .relocate-nav-link {
          background: none;
          border: none;
          color: #fff;
          font-size: 9px;
          letter-spacing: 2px;
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.3s ease;
          padding: 0;
          text-transform: uppercase;
        }
        .relocate-nav-link:hover {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .logo-city {
            display: none;
          }
        }
      `}</style>

      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
    </header>
  );
}