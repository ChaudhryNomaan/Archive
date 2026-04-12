"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function HeroAdmin() {
  const supabase = createClient();
  const [config, setConfig] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('content')
        .eq('section_name', 'hero')
        .single();

      if (data && !error) {
        const content = data.content;
        if (!content.hero) content.hero = { videoSrc: "", subtitle: "", title: "" };
        if (!content.marquee) content.marquee = { text: "" };
        setConfig(content);
      } else {
        setConfig({
          hero: { videoSrc: "", subtitle: "", title: "" },
          marquee: { text: "" }
        });
      }
    };
    loadConfig();
  }, [supabase]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    setStatus("UPLOADING_TO_VAULT...");
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('vault')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vault')
        .getPublicUrl(filePath);

      setConfig({ ...config, hero: { ...config.hero, videoSrc: publicUrl } });
      setStatus("VIDEO_UPLOADED_SUCCESSFULLY");
    } catch (err) {
      console.error(err);
      setStatus("UPLOAD_ERROR_CHECK_STORAGE_POLICIES");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("SYNCING_TO_SUPABASE...");
    
    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        section_name: 'hero', 
        content: config 
      }, { onConflict: 'section_name' });

    if (!error) {
      setStatus("CHANGES_LIVE_ON_HOME_PAGE");
      setTimeout(() => setStatus(""), 4000);
    } else {
      console.error(error);
      setStatus("SAVE_FAILED_DATABASE_ERROR");
    }
  };

  if (!config) return <div className="p-10 md:p-20 text-[10px] tracking-[5px] animate-pulse">INITIALIZING_HERO_ENGINE...</div>;

  return (
    <div className="admin-root">
      <div className="admin-header">
        <div className="status-box">
          <div className="status-dot"></div>
        </div>
        <h2 className="admin-title">HERO_COMMAND_CENTER</h2>
      </div>

      <form onSubmit={handleSave}>
        <div className="form-grid">
          
          {/* Video Section */}
          <div className="form-group">
            <label className="input-label">VIDEO SOURCE (URL)</label>
            <input 
              type="text"
              className="admin-input"
              value={config.hero.videoSrc || ""}
              onChange={e => setConfig({...config, hero: {...config.hero, videoSrc: e.target.value}})}
            />
            <div style={{ marginTop: '15px' }}>
              <label className="upload-btn">
                {uploading ? "UPLOADING..." : "UPLOAD_TO_SUPABASE_VAULT"}
                <input type="file" accept="video/*" onChange={handleVideoUpload} hidden disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Subtitle Section */}
          <div className="form-group">
            <label className="input-label">HERO SUBTITLE</label>
            <input 
              type="text" 
              className="admin-input"
              value={config.hero.subtitle || ""}
              onChange={e => setConfig({...config, hero: {...config.hero, subtitle: e.target.value}})}
            />
          </div>

          {/* Headline Section */}
          <div className="form-group span-2">
            <label className="input-label">MAIN HEADLINE</label>
            <textarea 
              className="admin-input textarea" 
              value={config.hero.title || ""}
              onChange={e => setConfig({...config, hero: {...config.hero, title: e.target.value}})}
            />
          </div>

          {/* MARQUEE SECTION */}
          <div className="form-group span-2 marquee-divider">
            <label className="input-label highlight">MARQUEE TRACK TEXT</label>
            <input 
              type="text" 
              className="admin-input"
              placeholder="Enter marquee text..."
              value={config.marquee?.text || ""}
              onChange={e => setConfig({
                ...config, 
                marquee: { ...config.marquee, text: e.target.value }
              })}
            />
          </div>
        </div>

        <button type="submit" className="save-btn" disabled={uploading}>
          {uploading ? "WAITING_FOR_UPLOAD..." : "SAVE_ALL_HERO_CHANGES"}
        </button>
        
        {status && (
          <p className="status-message">
            {status}
          </p>
        )}
      </form>

      <style jsx>{`
        .admin-root { padding: clamp(20px, 5vw, 60px); max-width: 1200px; margin: 0 auto; }
        .admin-header { display: flex; align-items: center; gap: 15px; margin-bottom: 40px; }
        .status-box { width: 18px; height: 18px; border: 2px solid #d4af37; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .status-dot { width: 6px; height: 6px; background: #d4af37; }
        .admin-title { font-size: clamp(10px, 2vw, 12px); letter-spacing: 3px; font-weight: 900; margin: 0; white-space: nowrap; }
        
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(20px, 4vw, 40px); margin-bottom: 40px; }
        .span-2 { grid-column: span 2; }
        
        .input-label { font-size: 9px; color: #555; letter-spacing: 2px; text-transform: uppercase; display: block; }
        .input-label.highlight { color: #d4af37; font-weight: bold; }
        
        .admin-input { width: 100%; background: #A39F9F; border: 1px solid #111; padding: clamp(15px, 3vw, 20px); color: #fff; font-size: 13px; margin-top: 10px; outline: none; border-radius: 0; box-sizing: border-box; }
        .admin-input:focus { border-color: #d4af37; }
        .admin-input.textarea { height: 120px; padding-top: 15px; resize: vertical; }
        
        .upload-btn { display: inline-block; padding: 10px 20px; border: 1px solid #333; color: #888; font-size: 8px; letter-spacing: 2px; cursor: pointer; transition: 0.3s; text-align: center; width: 100%; box-sizing: border-box; }
        .upload-btn:hover { border-color: #d4af37; color: #fff; }
        
        .marquee-divider { border-top: 1px solid #111; padding-top: 40px; }
        
        .save-btn { background: #d4af37; color: #000; border: none; padding: 18px 40px; font-size: 10px; font-weight: 900; letter-spacing: 2px; cursor: pointer; width: 100%; max-width: 300px; transition: opacity 0.3s; }
        .save-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .status-message { color: #d4af37; font-size: 9px; margin-top: 20px; letter-spacing: 2px; line-height: 1.5; }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; gap: 25px; }
          .span-2 { grid-column: span 1; }
          .save-btn { max-width: 100%; }
          .admin-header { margin-bottom: 30px; }
          .marquee-divider { padding-top: 30px; }
        }
      `}</style>
    </div>
  );
}