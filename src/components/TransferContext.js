'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const Ctx = createContext({
  state: { active: false, mode: null, peers: 0, speed: 0, progress: 0 },
  setState: () => {},
});

export function TransferProvider({ children }) {
  const [state, setState] = useState({ active: false, mode: null, peers: 0, speed: 0, progress: 0 });
  const value = useMemo(() => ({ state, setState }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTransfer() {
  return useContext(Ctx);
}
