"use client";
import React, { createContext, useContext, useState, useMemo } from 'react';

const VelosContext = createContext<any>(null);

export const VelosProvider = ({ children }: { children: React.ReactNode }) => {
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
        setIsBagOpen
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