export interface NgccHeaderNavItem {
  id: string;
  label: string;
  href?: string;
  isCurrentPage?: boolean;
  children?: NgccHeaderNavItem[];
}

export type NgccHeaderMenuTrigger = 'click' | 'mouseover';
