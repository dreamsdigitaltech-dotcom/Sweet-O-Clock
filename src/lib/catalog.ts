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

/** Return the original image URL or Netlify Image CDN URL when available. */
export function cdn(src: string, width?: number) {
  if (
    width &&
    typeof window !== 'undefined' &&
    window.location.hostname.includes('netlify.app')
  ) {
    return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=80`
  }
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

export interface InquiryItem {
  hamperSlug: string
  optionLabel?: string
  quantity: number
}

export function getHamperCategory(
  hamper: Hamper,
): 'boxes' | 'trays' | 'baskets' | 'keepsakes' {
  const packaging = (hamper.packaging || '').toLowerCase()
  const name = hamper.name.toLowerCase()
  if (packaging.includes('basket') || name.includes('basket')) return 'baskets'
  if (packaging.includes('tray') || name.includes('tray')) return 'trays'
  if (
    packaging.includes('keepsake') ||
    name.includes('emerald') ||
    name.includes('heritage') ||
    name.includes('delight')
  )
    return 'keepsakes'
  return 'boxes'
}

export const hamperCategories = [
  { id: 'all', label: 'All Collections' },
  { id: 'boxes', label: 'Festive Gift Boxes' },
  { id: 'trays', label: 'Wooden & Metallic Trays' },
  { id: 'baskets', label: 'Handwoven Baskets' },
  { id: 'keepsakes', label: 'Luxury Keepsakes' },
] as const

export const priceBands = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: 'under-1000', label: 'Under ₹1,000', min: 0, max: 999 },
  { id: '1000-1500', label: '₹1,000 – ₹1,500', min: 1000, max: 1500 },
  { id: 'premium', label: '₹1,800 & above', min: 1800, max: Infinity },
] as const

export function consolidatedEnquiryMessage(
  items: Array<{ hamper: Hamper; option?: SizeOption; quantity: number }>,
) {
  if (items.length === 0) {
    return "Hello Sweet O'Clock! I'd like to know more about your Diwali 2026 gift hampers."
  }
  let total = 0
  const lines = items.map((item, idx) => {
    const unitPrice = item.option?.price ?? item.hamper.price
    const itemTotal = unitPrice * item.quantity
    total += itemTotal
    const optLabel = item.option
      ? ` [${item.option.label} · ${item.option.weight}]`
      : ''
    return `${idx + 1}. *${item.hamper.name}*${optLabel} x ${item.quantity} = ${formatPrice(itemTotal)}`
  })
  return `Hello Sweet O'Clock! 🪔\n\nI would like to place an enquiry for the following Diwali 2026 hampers:\n\n${lines.join('\n')}\n\n*Estimated Total: ${formatPrice(total)}*\n\nPlease confirm availability and delivery timeline. Thank you!`
}
