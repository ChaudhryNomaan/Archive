"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function CityManagerPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', tz: '' });
  
  const supabase = createClient();

  const fetchCities = async () => {
    const { data } = await supabase.from('cities').select('*').order('name', { ascending: true });
    setCities(data || []);
  };

  useEffect(() => { fetchCities(); }, []);

  const handleUpdate = async (id: string) => {
    await supabase.from('cities').update({ 
      name: form.name.toUpperCase(), 
      tz: form.tz.toUpperCase() 
    }).eq('id', id);
    setEditingId(null);
    fetchCities();
  };

  const handleAdd = async () => {
    if (!form.id || !form.name) return alert("ID and Name required");
    await supabase.from('cities').insert([{ 
      id: form.id.toLowerCase().replace(/\s/g, '-'), 
      name: form.name.toUpperCase(), 
      tz: form.tz.toUpperCase() 
    }]);
    setIsAdding(false);
    setForm({ id: '', name: '', tz: '' });
    fetchCities();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Decommission node ${id.toUpperCase()}?`)) return;
    await supabase.from('cities').delete().eq('id', id);
    fetchCities();
  };

  return (
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      marginLeft: '250px', // Adjust this to match your sidebar width exactly
      color: '#fff',
      display: 'block'
    }}>
      <div style={{ padding: '60px 40px' }}>
        
        <header style={{ marginBottom: '60px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#444', marginBottom: '15px' }}>
            SYS-CONFIG-N02 // NODE_TOPOLOGY
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 200, letterSpacing: '-3px', margin: 0, textTransform: 'uppercase', lineHeight: '0.8' }}>
            NODE <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#444' }}>Control</span>
          </h1>
          <button className="lux-btn" style={{ marginTop: '30px' }} onClick={() => { setIsAdding(true); setEditingId(null); }}>
            [+] ADD NEW ARCHIVE NODE
          </button>
        </header>

        {isAdding && (
          <div style={{ background: '#080808', padding: '40px', border: '1px solid #111', marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <input className="lux-input" placeholder="SLUG" value={form.id} onChange={e => setForm({...form, id: e.target.value})} />
              <input className="lux-input" placeholder="NAME" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input className="lux-input" placeholder="ZONE" value={form.tz} onChange={e => setForm({...form, tz: e.target.value})} />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button onClick={handleAdd} className="commit-btn">INITIALIZE</button>
              <button onClick={() => setIsAdding(false)} className="cancel-btn">CANCEL</button>
            </div>
          </div>
        )}

        {/* --- GRID CONTAINER --- */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1px',
          background: '#1a1a1a',
          border: '1px solid #1a1a1a',
          width: '100%'
        }}>
          {cities.map((city) => (
            <div key={city.id} style={{ 
              background: '#000', 
              flex: '1 0 45%', // Forces items to grow but stay roughly 2 per row
              minWidth: '350px',
              minHeight: '250px', 
              display: 'flex', 
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}>
              {editingId === city.id ? (
                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input className="lux-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  <input className="lux-input" value={form.tz} onChange={e => setForm({...form, tz: e.target.value})} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleUpdate(city.id)} className="commit-btn" style={{ padding: '8px', flex: 1 }}>SAVE</button>
                    <button onClick={() => handleDelete(city.id)} className="cancel-btn" style={{ padding: '8px' }}>DEL</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn" style={{ padding: '8px' }}>X</button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => { setEditingId(city.id); setForm({ id: city.id, name: city.name, tz: city.tz }); }} 
                  style={{ cursor: 'pointer', padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <span style={{ fontSize: '8px', color: '#d4af37', letterSpacing: '2px', fontWeight: 'bold' }}>{city.id.toUpperCase()}</span>
                    <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{city.name}</h3>
                  <span style={{ fontSize: '13px', color: '#555', marginTop: '10px', fontStyle: 'italic', fontFamily: 'serif' }}>{city.tz}</span>
                  <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '7px', color: '#222', letterSpacing: '3px', fontWeight: 'bold' }}>RECONFIGURE_NODE_V.02</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .lux-btn { background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 10px 15px; font-size: 10px; cursor: pointer; letter-spacing: 2px; }
        .lux-input { background: transparent; border: none; border-bottom: 1px solid #222; color: #fff; width: 100%; padding: 10px 0; font-size: 14px; outline: none; }
        .lux-input:focus { border-color: #d4af37; }
        .commit-btn { background: #d4af37; color: #000; border: none; padding: 12px 20px; font-size: 10px; font-weight: bold; cursor: pointer; }
        .cancel-btn { background: transparent; border: 1px solid #222; color: #444; padding: 12px 20px; font-size: 10px; cursor: pointer; }
      `}</style>
    </div>
  );
}