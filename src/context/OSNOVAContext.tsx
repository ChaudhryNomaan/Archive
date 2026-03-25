"use client";
import React, { createContext, useContext, useState, useMemo } from 'react';

const OSNOVAContext = createContext<any>(null);

export const OSNOVAProvider = ({ children }: { children: React.ReactNode }) => {
  const [bag, setBag] = useState<any[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <OSNOVAContext.Provider 
      value={{ 
        isMenuOpen, 
        setIsMenuOpen, 
        bag,
        bagTotal,
        addToBag, 
        removeFromBag, 
        clearBag,
        isBagOpen, 
        setIsBagOpen
      }}
    >
      {children}
    </OSNOVAContext.Provider>
  );
};

export const useOSNOVA = () => {
  const context = useContext(OSNOVAContext);
  if (!context) {
    throw new Error("useOSNOVA must be used within a OSNOVAProvider");
  }
  return context;
};