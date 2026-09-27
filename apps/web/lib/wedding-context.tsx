'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { WeddingResponse } from '@everafter/types';
import { useWeddings } from './hooks/use-weddings';

interface WeddingContextValue {
  weddings: WeddingResponse[];
  activeWedding: WeddingResponse | null;
  setActiveWedding: (wedding: WeddingResponse) => void;
  isLoading: boolean;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { data: weddings, isLoading } = useWeddings();
  const [activeWedding, setActiveWeddingState] =
    useState<WeddingResponse | null>(null);

  useEffect(() => {
    if (weddings?.length && !activeWedding) {
      setActiveWeddingState(weddings[0]);
    }
  }, [weddings, activeWedding]);

  const setActiveWedding = useCallback((wedding: WeddingResponse) => {
    setActiveWeddingState(wedding);
  }, []);

  return (
    <WeddingContext.Provider
      value={{
        weddings: weddings ?? [],
        activeWedding,
        setActiveWedding,
        isLoading,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWeddingContext() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWeddingContext must be used within a WeddingProvider');
  }
  return context;
}
