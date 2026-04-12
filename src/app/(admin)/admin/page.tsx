"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modules = [
    { title: "HERO_CONFIG", path: "/admin/hero", desc: "Main landing visuals" },
    { title: "IDENTITY", path: "/admin/identity", desc: "Branding and site name" },
    { title: "ARCHIVE", path: "/admin/archive", desc: "Project management" },
    { title: "NODE_CONTROL", path: "/admin/cities", desc: "Global archive locations" },
    { title: "FOOTER", path: "/admin/footer", desc: "Global site links" }
  ];

  return (
    <div className="admin-container" style={{ background: '#000', minHeight: '100vh', color: '#fff', padding: 'clamp(20px, 6vw, 60px)' }}>
      {/* SYSTEM HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <div style={{ height: '1px', width: 'clamp(20px, 5vw, 40px)', background: '#d4af37' }}></div>
        <span style={{ color: '#d4af37', fontSize: '10px', letterSpacing: '5px', fontWeight: 'bold' }}>SYSTEM OVERVIEW</span>
      </div>

      <h1 style={{ 
        fontSize: 'clamp(60px, 15vw, 120px)', 
        fontWeight: '300', 
        margin: '0 0 clamp(40px, 8vw, 80px) 0', 
        letterSpacing: '-0.05em',
        lineHeight: '0.9'
      }}>
        <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#444' }}>control</span>
      </h1>

      {/* MODULE GRID */}
      <div className="module-grid">
        {modules.map(mod => (
          <Link href={mod.path} key={mod.title} style={{ textDecoration: 'none' }}>
            <div className="module-card">
              <h2 className="module-title">{mod.title}</h2>
              <p className="module-desc">{mod.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .module-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr)); 
          gap: 20px; 
        }

        .module-card { 
          border: 1px solid #111; 
          padding: clamp(30px, 5vw, 50px); 
          background: #050505; 
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          cursor: pointer;
          height: 100%;
        }

        .module-title { 
          fontSize: 12px; 
          color: #d4af37; 
          letter-spacing: 3px; 
          margin-bottom: 10px; 
          font-weight: 900;
        }

        .module-desc { 
          fontSize: 10px; 
          color: #666; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
          margin: 0;
        }

        .module-card:hover {
          border-color: #d4af37;
          background: #0a0a0a;
          transform: translateY(-5px);
        }

        @media (max-width: 480px) {
          .module-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}