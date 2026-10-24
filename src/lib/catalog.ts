import data from '@/data/catalog.json'

export interface SizeOption {
  label: string
  weight: string
  price: number
}

export interface Hamper {
  page: number
  slug: string
  name: string
  image: string
  packaging: string | null
  items: string[]
  /** Starting price in INR. */
  price: number
  options?: SizeOption[]
}

export const catalog = data.catalog
export const about = data.about
export const contact = data.contact
export const hampers: Hamper[] = data.hampers

export function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

/** Return the original image URL for local development. */
export function cdn(src: string, width: number) {
return src
}


export function whatsappLink(message: string) {
  return `https://wa.me/91${contact.whatsapp}?text=${encodeURIComponent(message)}`
}

export function enquiryMessage(hamper: Hamper, option?: SizeOption) {
  const detail = option
    ? `${hamper.name} – ${option.label} (${option.weight}), ${formatPrice(option.price)}`
    : `${hamper.name} (${formatPrice(hamper.price)})`
  return `Hello Sweet O'Clock! I'd like to enquire about the ${detail} from your Diwali 2026 catalog.`
}

export const priceBands = [
  { id: 'all', label: 'All hampers', min: 0, max: Infinity },
  { id: 'under-1000', label: 'Under ₹1,000', min: 0, max: 999 },
  { id: '1000-1500', label: '₹1,000 – ₹1,500', min: 1000, max: 1500 },
  { id: 'premium', label: '₹1,800 & above', min: 1800, max: Infinity },
] as const
