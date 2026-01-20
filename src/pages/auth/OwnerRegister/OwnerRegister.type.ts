// Types for OwnerRegister component

export interface PlanLimits {
  company: number;
  branch: number;
  manager: number;
  cook: number;
  attendant: number;
  menu: number;
  menuCategory: string | number;
  product: string | number;
  ingredient: string | number;
}

export interface Plan {
  name: string;
  label: string;
  limits: PlanLimits;
}
