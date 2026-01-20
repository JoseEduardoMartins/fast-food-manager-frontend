/**
 * Subscription plans constants
 * Plans available for owner registration
 */

export type PlanName = 'preta' | 'ouro' | 'diamante';

export interface PlanLimits {
  company: number;
  branch: number;
  manager: number;
  cook: number;
  attendant: number;
  menu: number;
  menuCategory: number | '∞';
  product: number | '∞';
  ingredient: number | '∞';
}

export interface Plan {
  name: PlanName;
  label: string;
  limits: PlanLimits;
}

export const PLANS: Plan[] = [
  {
    name: 'preta',
    label: 'Preta',
    limits: {
      company: 1,
      branch: 2,
      manager: 2,
      cook: 4,
      attendant: 4,
      menu: 1,
      menuCategory: '∞',
      product: '∞',
      ingredient: '∞',
    },
  },
  {
    name: 'ouro',
    label: 'Ouro',
    limits: {
      company: 2,
      branch: 4,
      manager: 4,
      cook: 8,
      attendant: 8,
      menu: 2,
      menuCategory: '∞',
      product: '∞',
      ingredient: '∞',
    },
  },
  {
    name: 'diamante',
    label: 'Diamante',
    limits: {
      company: 3,
      branch: 6,
      manager: 6,
      cook: 12,
      attendant: 12,
      menu: 3,
      menuCategory: '∞',
      product: '∞',
      ingredient: '∞',
    },
  },
] as const;

export const DEFAULT_PLAN: PlanName = 'preta';
