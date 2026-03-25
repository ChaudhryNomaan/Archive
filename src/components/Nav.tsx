"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVelos } from '@/context/VelosContext';
import { createClient } from '@/lib/supabase';

// These labels match your logic
const NAV_SECTORS = ["JEANS/PANTS", "T-SHIRTS", "JACKETS", "SHIRTS"];

export default function Nav() {
  const supabase = createClient();
  const { 
    isMenuOpen, 
    setIsMenuOpen, 
    bag, 
    setIsBagOpen 
  } = useVelos();
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [branding, setBranding] = useState({
    logoText: 'VELOS',
    bagLabel: 'BAG'
  });

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
            {NAV_SECTORS.map(sector => {
              // Transform "JEANS/PANTS" -> "jeans-pants"
              const catIdParam = sector.toLowerCase().replace('/', '-');
              
              return (
                <Link 
                  key={sector} 
                  href={`/category/${catIdParam}`}
                  className="nav-item"
                >
                  {sector}
                </Link>
              );
            })}
          </div>
        </div>
        
        <Link href="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-main">{branding.logoText}</span>
        </Link>
        
        <div className="nav-right" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="bag-trigger" onClick={() => setIsBagOpen(true)}>
            {branding.bagLabel} ({bag?.length || 0})
          </button>
        </div>
      </div>

      <style jsx>{`
        .logo-main {
          font-weight: 900;
          letter-spacing: -1px;
          text-transform: uppercase;
        }
        .desktop-links {
          display: flex;
          gap: 25px;
          margin-left: 40px;
        }
        .nav-item {
          font-size: 10px;
          letter-spacing: 2px;
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
          text-transform: uppercase;
        }
        .nav-item:hover {
          color: #fff;
        }
        .scroll-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: #fff;
          transition: width 0.1s ease-out;
        }
        @media (max-width: 1024px) {
          .desktop-links { display: none; }
        }
      `}</style>

      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
    </header>
  );
}