import { describe, expect, it } from 'vitest'
import {
  consolidatedEnquiryMessage,
  enquiryMessage,
  formatPrice,
  getHamperCategory,
  hampers,
  whatsappLink,
} from '@/lib/catalog'

describe('catalog helpers & data integrity', () => {
  it('contains exactly 15 authentic Diwali 2026 hampers from the catalog', () => {
    expect(hampers).toHaveLength(15)
    for (const hamper of hampers) {
      expect(hamper.name).toBeTruthy()
      expect(hamper.slug).toBeTruthy()
      expect(hamper.image).toMatch(/^\/img\/.*\.jpg$/)
      expect(hamper.price).toBeGreaterThan(0)
      expect(hamper.items.length).toBeGreaterThan(0)
      expect(hamper.page).toBeGreaterThanOrEqual(3)
      expect(hamper.page).toBeLessThanOrEqual(18)
    }
  })

  it('correctly formats INR prices', () => {
    expect(formatPrice(180)).toBe('₹180')
    expect(formatPrice(1000)).toBe('₹1,000')
    expect(formatPrice(2500)).toBe('₹2,500')
  })

  it('categorizes hampers into sensible festive collections', () => {
    const signature = hampers.find((h) => h.slug === 'signature-box')!
    const tray = hampers.find((h) => h.slug === 'signature-golden-tray-hamper')!
    const basket = hampers.find((h) => h.slug === 'grand-bloom-basket')!
    const keepsake = hampers.find((h) => h.slug === 'emerald-treasure-box')!

    expect(getHamperCategory(signature)).toBe('boxes')
    expect(getHamperCategory(tray)).toBe('trays')
    expect(getHamperCategory(basket)).toBe('baskets')
    expect(getHamperCategory(keepsake)).toBe('keepsakes')
  })

  it('builds a single hamper WhatsApp inquiry message', () => {
    const hamper = hampers[0]
    const msg = enquiryMessage(hamper)
    expect(msg).toContain(hamper.name)
    expect(msg).toContain('Diwali 2026 catalog')

    const link = whatsappLink(msg)
    expect(link).toContain('https://wa.me/918265000818')
    expect(link).toContain('text=')
  })

  it('builds a consolidated WhatsApp enquiry message with itemized total', () => {
    const item1 = { hamper: hampers[0], quantity: 2 } // 180 x 2 = 360
    const item2 = { hamper: hampers[1], quantity: 1 } // 550 x 1 = 550

    const message = consolidatedEnquiryMessage([item1, item2])
    expect(message).toContain(hampers[0].name)
    expect(message).toContain(hampers[1].name)
    expect(message).toContain('₹910') // 360 + 550
  })
})
