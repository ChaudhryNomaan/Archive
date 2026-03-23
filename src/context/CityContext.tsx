"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CityContextType = {
  selectedCity: string | null;
  setCity: (city: string) => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem('velos-city');
    if (savedCity) {
      setSelectedCity(savedCity);
    } else {
      setShowGate(true);
    }
  }, []);

  const setCity = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('velos-city', city);
    setShowGate(false);
  };

  return (
    <CityContext.Provider value={{ selectedCity, setCity }}>
      {showGate && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white px-6">
          <h2 className="text-2xl font-serif mb-8 tracking-widest uppercase">Select Your Archive Location</h2>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {['London', 'Paris', 'New York'].map((city) => (
              <button
                key={city}
                onClick={() => setCity(city)}
                className="border border-white/20 py-4 hover:bg-white hover:text-black transition-all duration-500 uppercase text-xs tracking-[0.2em]"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used within a CityProvider");
  return context;
};