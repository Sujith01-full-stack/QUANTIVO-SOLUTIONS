import {
  ShoppingCart,
  Globe,
  Cloud,
  ShieldCheck,
  ShoppingBag,
  Code2,
  Server,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'

export const iconMap: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'globe': Globe,
  'cloud': Cloud,
  'shield-check': ShieldCheck,
  'shopping-bag': ShoppingBag,
  'code': Code2,
  'server': Server,
  'support': LifeBuoy,
}

export function getServiceIcon(name: string): LucideIcon {
  return iconMap[name] ?? Globe
}
