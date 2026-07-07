import { useCallback, useState } from 'react';
import { cacheService } from '../services/CacheService';
export function useContentCache() {
  const [cacheSize, setCacheSize] = useState(0);
  const refresh = useCallback(async () => setCacheSize(await cacheService.getCacheSize()), []);
  const clear = useCallback(async () => { await cacheService.clearCache(); await refresh(); }, [refresh]);
  return { cacheSize, availableSpace: cacheService.getAvailableSpace(), refresh, clear };
}
