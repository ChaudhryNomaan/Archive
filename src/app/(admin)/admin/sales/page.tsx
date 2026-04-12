"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export default function SalesAnalyticsDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('30d');
  const supabase = createClient();

  useEffect(() => {
    async function fetchSales() {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    }
    fetchSales();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const filtered = orders.filter(o => {
      const diff = now.getTime() - new Date(o.created_at).getTime();
      if (timeFrame === '7d') return diff <= 7 * 24 * 60 * 60 * 1000;
      if (timeFrame === '30d') return diff <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });

    const revMap: Record<string, number> = {};
    let total = 0;
    filtered.forEach(o => {
      const d = new Date(o.created_at).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' });
      revMap[d] = (revMap[d] || 0) + Number(o.total_amount);
      total += Number(o.total_amount);
    });

    return {
      filtered,
      totalRevenue: total,
      chartData: Object.entries(revMap).map(([name, total]) => ({ name, total: total as number })).reverse()
    };
  }, [timeFrame, orders]);

  if (loading) return (
    <div style={{ background: '#484545', color: '#d4af37', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', fontStyle: 'italic' }}>
      AUTHENTICATING ARCHIVE...
    </div>
  );

  return (
    <div style={{ background: '#464242', minHeight: '100vh', color: '#fff', padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', borderBottom: '1px solid #1a1a1a', paddingBottom: '40px' }}>
        <div>
          <span style={{ fontSize: '10px', letterSpacing: '5px', color: '#444', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
            AETHER Intelligence // System 2.0
          </span>
          <h1 style={{ fontSize: '72px', fontFamily: 'serif', fontStyle: 'italic', margin: 0, letterSpacing: '-3px' }}>
            Sales Analytics
          </h1>
        </div>

        {/* TIME FILTER */}
        <div style={{ display: 'flex', background: '#665E5E', border: '1px solid #1a1a1a', padding: '4px' }}>
          {['7d', '30d', 'all'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              style={{
                padding: '8px 24px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                background: timeFrame === tf ? '#d4af37' : 'transparent',
                color: timeFrame === tf ? '#000' : '#444',
                transition: '0.3s'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* REVENUE BOX */}
        <div style={{ background: '#1B0D0D', border: '1px solid #1a1a1a', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#444', letterSpacing: '2px' }}>GROSS SETTLEMENT (₴)</span>
            <span style={{ fontSize: '28px', fontFamily: 'serif', color: '#d4af37' }}>{stats.totalRevenue.toLocaleString()} ₴</span>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} tick={{fill: '#444'}} dy={10} />
                <YAxis fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} tick={{fill: '#444'}} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222', color: '#d4af37' }} />
                <Area type="monotone" dataKey="total" stroke="#d4af37" fill="#d4af37" fillOpacity={0.05} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div style={{ padding: '25px 40px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase' }}>Transaction Manifest</span>
          <span style={{ fontSize: '10px', fontFamily: 'serif', fontStyle: 'italic', color: '#d4af37' }}>Logs: {stats.filtered.length}</span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a', color: '#444', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px' }}>
                <th style={{ padding: '25px 40px' }}>Timestamp</th>
                <th style={{ padding: '25px 40px' }}>Product Intelligence</th>
                <th style={{ padding: '25px 40px', textAlign: 'right' }}>Settlement</th>
              </tr>
            </thead>
            <tbody>
              {stats.filtered.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '30px 40px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                    <div style={{ fontSize: '10px', color: '#444', fontFamily: 'monospace' }}>{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td style={{ padding: '30px 40px' }}>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderLeft: '1px solid #d4af37', paddingLeft: '20px', marginBottom: '15px' }}>
                        <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '16px', color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase', marginTop: '5px', letterSpacing: '2px' }}>
                          Size: {item.size || 'OS'} // Qty: {item.quantity || 1}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '30px 40px', textAlign: 'right', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '22px', fontFamily: 'serif', color: '#fff' }}>{Number(order.total_amount).toLocaleString()} ₴</div>
                    <div style={{ display: 'inline-block', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', fontSize: '8px', padding: '4px 10px', marginTop: '10px', fontWeight: 'bold', border: '1px solid rgba(212,175,55,0.2)' }}>
                      {order.status || 'VERIFIED'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}