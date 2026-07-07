import { useEffect, useState } from 'react';

export function useStore<T>(store: { hydrate: () => Promise<T>; subscribe: (listener: (state: T) => void) => () => void }) {
  const [state, setState] = useState<T | undefined>(undefined);
  useEffect(() => {
    let mounted = true;
    store.hydrate().then((value) => mounted && setState(value));
    const unsubscribe = store.subscribe((value) => mounted && setState(value));
    return () => { mounted = false; unsubscribe(); };
  }, [store]);
  return state;
}
