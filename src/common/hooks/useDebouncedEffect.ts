/**
 * useDebouncedEffect
 * Executa um efeito após um delay quando as dependências mudam.
 * Útil para busca em tempo real com debounce (ex: input de pesquisa).
 */

import { useEffect } from 'react';

export function useDebouncedEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay: number,
) {
  useEffect(() => {
    const timer = setTimeout(effect, delay);
    return () => clearTimeout(timer);
  }, deps);
}
