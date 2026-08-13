export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export const SHARED_NAVIGATION: NavItem[] = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Research', href: '#research', id: 'research' },
  { label: 'Capabilities', href: '#capabilities', id: 'capabilities' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];
