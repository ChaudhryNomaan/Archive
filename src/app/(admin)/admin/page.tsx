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
    { title: "NODE_CONTROL", path: "/admin/cities", desc: "Global archive locations" }, // New Module Added
    { title: "FOOTER", path: "/admin/footer", desc: "Global site links" }
  ];

  return (
    <div className="p-10" style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <div style={{ height: '1px', width: '40px', background: '#d4af37' }}></div>
        <span style={{ color: '#d4af37', fontSize: '10px', letterSpacing: '5px', fontWeight: 'bold' }}>SYSTEM OVERVIEW</span>
      </div>

      <h1 style={{ fontSize: '80px', fontWeight: '300', margin: '0 0 60px 0', letterSpacing: '-5px' }}>
<span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#444' }}>control</span>      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
        {modules.map(mod => (
          <Link href={mod.path} key={mod.title} style={{ textDecoration: 'none' }}>
            <div className="module-card" style={{ border: '1px solid #111', padding: '40px', background: '#050505', transition: '0.3s', cursor: 'pointer' }}>
              <h2 style={{ fontSize: '12px', color: '#d4af37', letterSpacing: '3px', marginBottom: '10px' }}>{mod.title}</h2>
              <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{mod.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .module-card:hover {
          border-color: #d4af37;
          background: #0a0a0a;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}