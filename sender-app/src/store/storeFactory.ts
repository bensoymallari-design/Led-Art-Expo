import AsyncStorage from '@react-native-async-storage/async-storage';

type Listener<T> = (state: T) => void;

export function createPersistentStore<T extends object>(key: string, initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener<T>>();

  const notify = () => listeners.forEach((listener) => listener(state));

  return {
    getState: () => state,
    setState: async (patch: Partial<T>) => {
      state = { ...state, ...patch };
      await AsyncStorage.setItem(key, JSON.stringify(state));
      notify();
    },
    replaceState: async (next: T) => {
      state = next;
      await AsyncStorage.setItem(key, JSON.stringify(state));
      notify();
    },
    hydrate: async () => {
      const raw = await AsyncStorage.getItem(key);
      if (raw) state = { ...state, ...JSON.parse(raw) };
      notify();
      return state;
    },
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
}
