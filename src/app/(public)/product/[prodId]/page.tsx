"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVelos } from '@/context/VelosContext';
import { createClient } from '@/lib/supabase';

export default function ProductPage() {
  const { prodId } = useParams(); 
  const router = useRouter();
  const { addToBag } = useVelos(); 
  const supabase = createClient(); 
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!prodId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', prodId) 
          .maybeSingle();  

        if (error) throw error;

        if (data) {
          setProduct(data);
          const sizeString = data.specifications?.size || "";
          const sizeArray = sizeString.split(',').map((s: string) => s.trim()).filter(Boolean);
          if (sizeArray.length > 0) setSelectedSize(sizeArray[0]);
        } else {
          setProduct(null);
        }
      } catch (error: any) {
        console.error("Supabase fetch error:", error.message || error, error.details || "");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [prodId]);

  const mediaItems = product ? [product.image_url, ...(product.media || [])].filter(Boolean) : [];
  
  const nextImage = () => {
    if (mediaItems.length > 0) setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };
  const prevImage = () => {
    if (mediaItems.length > 0) setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video');
  };

  const availableSizes = product?.specifications?.size 
    ? product.specifications.size.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="pd-root min-h-screen">
      <style jsx>{`
        .pd-root { 
          display: flex; 
          min-height: 100vh; 
          background: #fff; 
          color: #000; 
          padding-top: 100px;
        }
        
        .pd-visual { 
          flex: 1.2; 
          position: sticky; 
          top: 100px;
          background: #f9f9f9; 
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: w-resize;
          height: calc(100vh - 100px);
          overflow: hidden;
        }

        .pd-gallery-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
        }

        .pd-gallery-item { 
          grid-area: 1 / 1;
          width: 100%;
          height: 100%;
          display: flex; 
          align-items: center; 
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.6s ease;
          padding: 60px;
        }

        .pd-gallery-item.active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
        }

        .pd-gallery-item img, .pd-gallery-item video {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .gallery-controls {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
          z-index: 10;
        }

        .control-dot {
          width: 40px;
          height: 2px;
          background: #000;
          opacity: 0.1;
          cursor: pointer;
          transition: 0.3s;
        }

        .control-dot.active { opacity: 1; }

        .pd-sidebar { 
          flex: 0 0 500px; 
          background: #fff;
          border-left: 1px solid #eee;
          min-height: calc(100vh - 100px);
        }

        .pd-sticky-wrap { 
          padding: 60px 50px 120px 50px;
          display: flex; 
          flex-direction: column; 
          gap: 40px; 
        }
        
        .pd-back-link { 
          background: none; 
          border: none; 
          font-weight: 900; 
          font-size: 10px; 
          letter-spacing: 2px; 
          text-align: left; 
          opacity: 0.4; 
          transition: 0.3s; 
          margin-bottom: -20px; 
          cursor: pointer;
          width: fit-content;
          text-transform: uppercase;
        }
        .pd-back-link:hover { opacity: 1; transform: translateX(-5px); }

        .pd-top h1 { font-size: clamp(32px, 4vw, 48px); font-weight: 900; letter-spacing: -2px; margin: 20px 0; line-height: 1.1; text-transform: uppercase; }
        .pd-sku { font-size: 10px; color: #aaa; font-weight: 800; letter-spacing: 1.5px; }
        .pd-price { font-size: 20px; font-weight: 500; }

        .pd-cta-block { display: flex; flex-direction: column; gap: 10px; }
        .pd-add-btn { width: 100%; background: #000; color: #fff; border: 1px solid #000; padding: 24px; font-weight: 900; font-size: 11px; letter-spacing: 3px; cursor: pointer; transition: 0.4s; text-transform: uppercase; }
        .pd-add-btn:hover { background: #333; }
        
        .size-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 1px; background: #eee; border: 1px solid #eee; }
        .size-btn { background: #fff; border: none; padding: 15px; font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .size-btn.active { background: #000; color: #fff; }

        .skeleton-shimmer {
          background: #f6f7f8;
          background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite linear;
        }

        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }

        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @media (max-width: 1024px) {
          .pd-root { flex-direction: column; height: auto; padding-top: 80px; }
          .pd-visual { height: 70vh; width: 100%; position: relative; top: 0; }
          .pd-sidebar { width: 100%; border-left: none; }
          .pd-sticky-wrap { padding: 40px 30px; }
        }
      `}</style>

      {/* VISUAL SECTION */}
      <div 
        className="pd-visual" 
        onClick={() => { if (!touchEnd.current) nextImage(); }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {loading ? (
          <div className="w-full h-full skeleton-shimmer" />
        ) : product ? (
          <>
            <div className="pd-gallery-container">
              {mediaItems.map((url, idx) => (
                <div 
                  key={idx} 
                  className={`pd-gallery-item ${activeIndex === idx ? 'active' : ''}`}
                >
                  {isVideo(url) ? (
                    <video src={url} autoPlay muted loop playsInline />
                  ) : (
                    <img src={url} alt={`${product.name}`} />
                  )}
                </div>
              ))}
            </div>

            {mediaItems.length > 1 && (
              <div className="gallery-controls">
                {mediaItems.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`control-dot ${activeIndex === idx ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="sku" style={{ color: '#000', fontWeight: 900 }}>404 // NOT FOUND</p>
        )}
      </div>

      {/* SIDEBAR SECTION */}
      <div className="pd-sidebar">
        <div className="pd-sticky-wrap">
          <button className="pd-back-link" onClick={() => router.back()}>← BACK TO ARCHIVE</button>
          
          {loading ? (
            <div className="flex flex-col gap-8">
              <div className="h-4 w-24 skeleton-shimmer" />
              <div className="h-16 w-full skeleton-shimmer" />
              <div className="h-8 w-32 skeleton-shimmer" />
              <div className="h-48 w-full skeleton-shimmer mt-10" />
            </div>
          ) : product ? (
            <>
              <div className="pd-top">
                <span className="pd-sku">SKU: {product.sku || 'AETHER-ARCHIVE'}</span>
                <h1>{product.name}</h1>
                <p className="pd-price">{product.currency || '₽'}{product.price?.toLocaleString()}</p>
              </div>

              {availableSizes.length > 0 && (
                <div className="size-block">
                  <span style={{fontSize: '9px', fontWeight: 900, color: '#bbb', letterSpacing: '1.5px', marginBottom: '15px', display: 'block', textTransform: 'uppercase'}}>Dimensions</span>
                  <div className="size-grid">
                    {availableSizes.map((s: string) => (
                      <button 
                        key={s}
                        className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pd-cta-block">
                <button 
                  className="pd-add-btn" 
                  onClick={() => addToBag({ ...product, media: product.image_url, selectedSize })}
                >
                  ADD TO ARCHIVE
                </button>
                <button 
                  style={{
                    width: '100%', background: '#fff', color: '#000', border: '1px solid #000', padding: '24px', fontWeight: 900, fontSize: '11px', letterSpacing: '3px', cursor: 'pointer', textTransform: 'uppercase'
                  }}
                  onClick={() => {
                    addToBag({ ...product, media: product.image_url, selectedSize });
                    router.push('/checkout');
                  }}
                >
                  BUY IT NOW
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: '#eee', border: '1px solid #eee' }}>
                <div className="info-cell" style={{ background: '#fff', padding: '25px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#bbb', letterSpacing: '1.5px', display: 'block', textTransform: 'uppercase' }}>Availability</span>
                  <span style={{ fontSize: '11px', fontWeight: 800 }}>{product.availability || "IN STOCK"}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
               <p className="sku" style={{ color: '#000', fontWeight: 900 }}>404 // PRODUCT NOT FOUND</p>
               <button onClick={() => router.push('/')} className="text-[10px] tracking-[2px] border-b border-black uppercase font-bold w-fit">Return to Archive</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}