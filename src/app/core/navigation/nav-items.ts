export type NavRouteId =
  | 'basic'
  | 'multi'
  | 'lifecycle'
  | 'comments'
  | 'modal';

export interface NavItem {
  id: NavRouteId;
  label: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'basic', label: 'Basic editor', path: '/basic' },
  { id: 'multi', label: 'Multi editors', path: '/multi-editors' },
  { id: 'lifecycle', label: 'Lifecycle', path: '/lifecycle' },
  { id: 'comments', label: 'Comments', path: '/comments' },
  { id: 'modal', label: 'Modal editor', path: '/modal' },
];
