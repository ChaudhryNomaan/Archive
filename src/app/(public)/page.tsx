"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  
  const [config, setConfig] = useState<any>({
    hero: {
      title: '',
      subtitle: '',
      videoSrc: '',
    },
    marquee: {
      text: 'OSNOVA LAB SERIES — 2026 EDITION — MODULARITY — '
    }
  });

  useEffect(() => {
    setHasMounted(true);

    const fetchHeroConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('content')
          .eq('section_name', 'hero')
          .single();

        if (error) {
          console.warn("Using default hero configuration.");
          return;
        }

        if (data?.content) {
          setConfig(data.content);
        }
      } catch (err) {
        console.error("Error loading site configuration:", err);
      }
    };

    fetchHeroConfig();
  }, []);

  if (!hasMounted) {
    return <div className="home-container bg-black min-h-screen" />;
  }

  return (
    <div className="home-container">
      <section className="h-hero">
        {config.hero?.videoSrc && (
          <video 
            src={config.hero.videoSrc} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="h-hero-img"
            key={config.hero.videoSrc}
          />
        )}
        
        <div className="h-overlay">
          <h1 
            className="reveal-text" 
            dangerouslySetInnerHTML={{ 
              __html: config.hero?.title?.replace(/\n/g, '<br/>') || "" 
            }} 
          />
          
          <p className="stagger-in" style={{ animationDelay: '0.4s' }}>
            {config.hero?.subtitle}
          </p>
          
          {/* Button removed from here */}
        </div>
      </section>

      <section className="h-marquee">
        <div className="m-track">
          {[1, 2, 3, 4].map(i => (
            <span key={i}>
              {config.marquee?.text || "OSNOVA LAB SERIES — 2026 EDITION — MODULARITY — "}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}