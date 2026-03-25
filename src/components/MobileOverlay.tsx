"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVelos } from '@/context/VelosContext';
import { createClient } from '@/lib/supabase';

// SYNC: Match these to your Nav.tsx sectors
const NAV_SECTORS = ["JEANS/PANTS", "T-SHIRTS", "JACKETS", "SHIRTS"];

export default function MobileOverlay() {
  const supabase = createClient();
  const { isMenuOpen, setIsMenuOpen } = useVelos();
  
  const [menuSettings, setMenuSettings] = useState({
    menuLabel: 'MENU',
    menuVideo: '/images/hero-section.mp4',
    project: 'VELOS ARCHIVE © 2026',
    instagram: '#',
    twitter: '#'
  });

  useEffect(() => {
    const fetchMenuSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('content')
          .eq('section_name', 'menu_assets')
          .single();

        if (error) throw error;

        if (data?.content) {
          setMenuSettings({
            menuLabel: data.content.menuLabel || 'MENU',
            menuVideo: data.content.menuVideo || '/images/hero-section.mp4',
            project: data.content.project || 'VELOS ARCHIVE © 2026',
            instagram: data.content.instagram || '#',
            twitter: data.content.twitter || '#'
          });
        }
      } catch (err) {
        console.warn("Menu sync skipped, using defaults:", err);
      }
    };

    if (isMenuOpen) {
      fetchMenuSettings();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen, supabase]);

  if (!isMenuOpen) return null;

  return (
    <div className="menu-overlay">
      <button className="menu-close-x" onClick={() => setIsMenuOpen(false)}>CLOSE</button>

      <div className="menu-visual">
        {menuSettings.menuVideo && (
          <video 
            key={menuSettings.menuVideo} 
            src={menuSettings.menuVideo} 
            autoPlay loop muted playsInline 
            className="object-cover"
          />
        )}
      </div>

      <div className="menu-content">
        <div className="menu-label-small">{menuSettings.menuLabel}</div>
        
        <nav className="menu-links">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="stagger-in" style={{ animationDelay: '0.1s' }}>
            HOME
          </Link>
          
          {/* FIXED LINK GENERATION */}
          {NAV_SECTORS.map((sector, i) => {
            // SYNC: logic must match Nav.tsx: "JEANS/PANTS" -> "jeans-pants"
            const catIdParam = sector.toLowerCase().replace('/', '-');
            
            return (
              <Link 
                key={sector} 
                href={`/category/${catIdParam}`} 
                onClick={() => setIsMenuOpen(false)} 
                className="stagger-in" 
                style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}
              >
                {sector}
              </Link>
            );
          })}
        </nav>

        <div className="menu-footer">
          <span className="menu-footer-item">{menuSettings.project}</span>
          <div className="footer-social-links">
            <a href={menuSettings.instagram} target="_blank" rel="noopener noreferrer" className="menu-footer-item">INSTAGRAM</a>
            <span className="social-separator">—</span>
            <a href={menuSettings.twitter} target="_blank" rel="noopener noreferrer" className="menu-footer-item">TWITTER</a>
          </div>
        </div>
      </div>
    </div>
  );
}