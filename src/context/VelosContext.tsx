"use client";
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const VelosContext = createContext<any>(null);

export const VelosProvider = ({ children }: { children: React.ReactNode }) => {
  const [bag, setBag] = useState<any[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // New State: selectedCity (Defaults to null until user picks via City Gate)
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Sync city with localStorage so the "Archive" preference persists
  useEffect(() => {
    const savedCity = localStorage.getItem('velos_selected_city');
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  // UPDATED: handleSetCity now handles both selecting and clearing (Relocating)
  const handleSetCity = (city: string | null) => {
    setSelectedCity(city);
    
    if (city) {
      // Save to storage if a city is picked
      localStorage.setItem('velos_selected_city', city);
    } else {
      // Remove from storage if relocating (city is null)
      localStorage.removeItem('velos_selected_city');
    }
  };

  const addToBag = (item: any) => {
    const uniqueItem = { 
      ...item, 
      cartId: `${item.id}-${Date.now()}-${Math.random()}` 
    };
    setBag((prev) => [...prev, uniqueItem]);
    setIsBagOpen(true);
  };

  const removeFromBag = (cartId: string) => {
    setBag((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearBag = () => setBag([]);

  const bagTotal = useMemo(() => {
    return bag.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [bag]);

  return (
    <VelosContext.Provider 
      value={{ 
        isMenuOpen, 
        setIsMenuOpen, 
        bag,
        bagTotal,
        addToBag, 
        removeFromBag, 
        clearBag,
        isBagOpen, 
        setIsBagOpen,
        // City Gate Values
        selectedCity,
        setSelectedCity: handleSetCity 
      }}
    >
      {children}
    </VelosContext.Provider>
  );
};

export const useVelos = () => {
  const context = useContext(VelosContext);
  if (!context) {
    throw new Error("useVelos must be used within a VelosProvider");
  }
  return context;
};