"use client";

import React, { useEffect, useState } from 'react';
import { useVelos } from '@/context/VelosContext';
import { createClient } from '@/lib/supabase';
import styles from './CityGate.module.css';

export default function CityGate() {
  const { setSelectedCity } = useVelos();
  const [cities, setCities] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const syncNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setCities(data || []);
      } catch (err) {
        console.error("GATE_SYNC_ERROR:", err);
      } finally {
        setSyncing(false);
      }
    };

    syncNodes();
  }, [supabase]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.systemTag}>
            {syncing ? "SYNCHRONIZING_NODES..." : "ARCHIVE_ACCESS_LZA"}
          </span>
          <h1 className={styles.title}>Velos Archive</h1>
        </div>

        <div className={styles.cityList}>
          {!syncing && cities.map((city) => (
            <button 
              key={city.id} 
              onClick={() => setSelectedCity(city.id)} 
              className={styles.cityButton}
            >
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.cityTz}>{city.tz}</span>
            </button>
          ))}
          
          {syncing && (
            <div className={styles.loaderLine}></div>
          )}
        </div>

        <div className={styles.footer}>
          <span>LZA_V.109</span>
          <span>EST_LIZA_STUDIO_2026</span>
        </div>
      </div>

      <style jsx>{`
        /* Minimal loading line for that digital atelier feel */
        .loaderLine {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          animation: scan 2s infinite linear;
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}