export type NavigationItem =
  | {
      type: 'link';
      id: string;
      label: string;
      path: string;
      /** Optional permission code used by frontend for UI gating */
      permission?: string;
      /** Icon identifier (frontend maps to lucide icon) */
      icon?: string;
    }
  | {
      type: 'group';
      id: string;
      label: string;
      icon?: string;
      children: NavigationItem[];
    };

export interface GetNavigationResponse {
  items: NavigationItem[];
}

