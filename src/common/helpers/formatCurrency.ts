/**
 * Formata valor em centavos para moeda brasileira (R$ X.XXX,XX)
 */
export function formatCurrency(centavos: number): string {
  return `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`;
}
