"use client";

import Link from 'next/link';
import React, { useState, useEffect, use, useMemo } from 'react';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

export default function CategoryPage({ params }: { params: Promise<{ catId: string }> }) {
  const resolvedParams = use(params);
  const catId = resolvedParams?.catId;  
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const dbCategoryMatch = useMemo(() => {
    if (!catId) return "";
    return decodeURIComponent(catId).toUpperCase();
  }, [catId]);

  useEffect(() => {
    async function fetchCategoryData() {
      if (!dbCategoryMatch) return;
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        if (dbCategoryMatch.includes("JEAN") || dbCategoryMatch.includes("PANT")) {
          query = query.ilike('sub_category', '%JEAN%');
        } else if (dbCategoryMatch.includes("TSHIRT") || dbCategoryMatch.includes("T-SHIRT")) {
          query = query.ilike('sub_category', '%T%SHIRT%');
        } else {
          query = query.ilike('sub_category', `%${dbCategoryMatch}%`);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Fetch Error:", String(err));
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    }
    fetchCategoryData();
  }, [dbCategoryMatch]);

  const categoryTitle = decodeURIComponent(catId || "").toUpperCase().replace('-', ' / ');

  return (
    // min-h-[100vh] prevents the footer from jumping up
    <div className="cat-root min-h-screen">
      
      <div className="cat-sidebar">
        <span className="cat-breadcrumb stagger-in">{categoryTitle}</span>
      </div>

      <div className="cat-grid">
        {loading ? (
          // SKELETON STATE: 6 Empty cards to hold the space during fetch
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="cat-card animate-pulse">
              <div className="cc-media bg-gray-100" />
              <div className="cc-info">
                <div className="h-2 w-12 bg-gray-100 mb-4" />
                <div className="h-4 w-32 bg-gray-100" />
              </div>
            </div>
          ))
        ) : (
          products.map((product) => {
            const hasMedia = product.image_url && product.image_url.trim() !== "";
            const isVideo = hasMedia && product.image_url.match(/\.(mp4|webm|mov)$/i);

            return (
              <Link key={product.id} href={`/product/${product.id}`} className="cat-card stagger-in">
                <div className="cc-media">
                  {!hasMedia ? (
                    <div className="flex items-center justify-center h-full text-[10px] tracking-widest text-gray-300 font-bold">MISSING_ASSET</div>
                  ) : isVideo ? (
                    <video src={product.image_url} autoPlay loop muted playsInline />
                  ) : (
                    <img src={product.image_url} alt={product.name} />
                  )}
                </div>
                <div className="cc-info">
                  <span className="sku">{product.sku || 'AETHER-ARCHIVE'}</span>
                  <h4>{product.name}</h4>
                  <p className="price-tag">₽ {Number(product.price).toLocaleString()}</p>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {hasFetched && !loading && products.length === 0 && (
        <div className="w-full text-center py-60 text-[10px] tracking-[6px] font-black text-gray-400 uppercase">
          Archive Empty for {categoryTitle}
        </div>
      )}
    </div>
  );
}