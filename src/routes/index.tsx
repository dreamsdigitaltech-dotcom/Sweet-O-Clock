import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Award,
  Camera,
  ChevronRight,
  Download,
  Gift,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'

import { HamperCard, HamperDialog } from '@/components/hamper'
import { InquiryBagSheet, type BagItem } from '@/components/inquiry-bag'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  about,
  catalog,
  cdn,
  contact,
  formatPrice,
  getHamperCategory,
  hamperCategories,
  hampers,
  priceBands,
  whatsappLink,
  type Hamper,
  type SizeOption,
} from '@/lib/catalog'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

type CategoryId = (typeof hamperCategories)[number]['id']
type BandId = (typeof priceBands)[number]['id']
type SortOrder = 'price-asc' | 'price-desc' | 'page-asc'

const instagramUrl = `https://instagram.com/${contact.instagram}`
const generalEnquiry = whatsappLink(
  "Hello Sweet O'Clock! I'd like to know more about your Diwali 2026 gift hampers.",
)
const corporateEnquiry = whatsappLink(
  "Hello Sweet O'Clock! 🪔 I'd like a quote for corporate / bulk Diwali gifting.",
)

const faqs = [
  {
    q: 'How do I place an order for Diwali hampers?',
    a: 'You can browse our collection here, add hampers to your Festive Inquiry Bag, or click "Enquire on WhatsApp" on any hamper. Orders and customisation details are finalised seamlessly with our team on WhatsApp or phone call.',
  },
  {
    q: "What makes Sweet O'Clock laddus healthy and distinct?",
    a: "Sweet O'Clock is founded by women Doctorates from agricultural backgrounds under Cosmos Greens, Nagpur. Every laddu is handmade in small batches using whole dry fruits and ingredients, with strictly zero refined sugar and zero chemical preservatives.",
  },
  {
    q: 'Can hampers be customised with preferred sweets or namkeens?',
    a: 'Yes! Every hamper can be customised to your taste, dietary preferences, and budget. You can select your preferred laddu varieties, traditional namkeens (Chivda, Chakali, Mathari), dry fruits, and handcrafted Pichwai diyas.',
  },
  {
    q: 'Do you provide bulk corporate gifting and custom branding?',
    a: 'Absolutely. We cater to bulk orders for corporate teams, client appreciation, and family events. Personalised greeting cards and corporate company branding are available upon request.',
  },
  {
    q: 'Where are your branches located in Nagpur, and do you deliver?',
    a: "Sweet O'Clock is based in Nagpur with presence across Pannase Layout, Amravati Road, and Omkar Nagar. Orders can be picked up locally or delivered. Please message us on WhatsApp at +91 8265000818 to coordinate delivery.",
  },
]

function Home() {
  const [category, setCategory] = useState<CategoryId>('all')
  const [band, setBand] = useState<BandId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('page-asc')
  const [selected, setSelected] = useState<Hamper | null>(null)

  // Bag State
  const [bagItems, setBagItems] = useState<BagItem[]>([])
  const [bagOpen, setBagOpen] = useState(false)

  const handleAddToBag = (
    hamper: Hamper,
    option?: SizeOption,
    quantity = 1,
  ) => {
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.hamper.slug === hamper.slug &&
          item.option?.label === option?.label,
      )
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }
      const newItem: BagItem = {
        id: `${hamper.slug}-${option?.label || 'standard'}-${Date.now()}`,
        hamper,
        option,
        quantity,
      }
      return [...prev, newItem]
    })

    toast.success(`Added ${hamper.name} to Festive Bag`, {
      description: option
        ? `${option.label} · Quantity: ${quantity}`
        : `Quantity: ${quantity}`,
      action: {
        label: 'View Bag',
        onClick: () => setBagOpen(true),
      },
    })
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta
            return nextQty > 0 ? { ...item, quantity: nextQty } : null
          }
          return item
        })
        .filter((item): item is BagItem => item !== null),
    )
  }

  const handleRemoveItem = (id: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id))
    toast('Item removed from inquiry bag')
  }

  const handleClearBag = () => {
    setBagItems([])
    toast('Inquiry bag cleared')
  }

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0)

  // Filter and sort visible hampers
  const visible = useMemo(() => {
    const { min, max } = priceBands.find((b) => b.id === band)!
    const query = searchQuery.trim().toLowerCase()

    return hampers
      .filter((h) => {
        // Price band filter
        if (h.price < min || h.price > max) return false

        // Category filter
        if (category !== 'all') {
          const itemCat = getHamperCategory(h)
          if (itemCat !== category) return false
        }

        // Search query
        if (query) {
          const matchName = h.name.toLowerCase().includes(query)
          const matchPackaging = (h.packaging || '')
            .toLowerCase()
            .includes(query)
          const matchItems = h.items.some((item) =>
            item.toLowerCase().includes(query),
          )
          if (!matchName && !matchPackaging && !matchItems) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        return a.page - b.page
      })
  }, [band, category, searchQuery, sort])

  const lowest = Math.min(...hampers.map((h) => h.price))
  const highest = Math.max(...hampers.map((h) => h.price))

  const isFiltered =
    category !== 'all' || band !== 'all' || searchQuery.trim().length > 0

  const resetFilters = () => {
    setCategory('all')
    setBand('all')
    setSearchQuery('')
    setSort('page-asc')
  }

  return (
    <div className="min-h-svh bg-background text-foreground antialiased selection:bg-gold/25 selection:text-primary">
      {/* 1. Festive Announcement Bar */}
      <div className="relative z-50 border-b border-gold/40 bg-primary px-4 py-2 text-center text-xs tracking-wide text-primary-foreground sm:text-sm">
        <div className="mx-auto flex max-w-content items-center justify-center gap-2">
          <Sparkles className="size-3.5 text-gold shrink-0" />
          <span>
            <strong className="text-gold">Diwali 2026 Gifting:</strong>{' '}
            Handcrafted dry fruit laddu hampers in Nagpur. Zero refined sugar,
            zero preservatives. Bespoke corporate &amp; family orders open!
          </span>
          <a
            href={generalEnquiry}
            target="_blank"
            rel="noreferrer"
            className="ml-2 hidden rounded-full bg-gold/20 px-2.5 py-0.5 text-[0.7rem] font-semibold text-gold underline-offset-4 hover:underline md:inline"
          >
            Enquire Now →
          </a>
        </div>
      </div>

      {/* 2. Responsive Header */}
      <SiteHeader
        bagItemCount={totalBagCount}
        onOpenBag={() => setBagOpen(true)}
      />

      <main>
        {/* 3. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-card/80 to-background pt-8 pb-16 sm:pt-14 sm:pb-24">
          <div className="mx-auto grid max-w-content items-center gap-12 px-5 sm:px-8 md:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                <Sparkles className="size-3 text-gold" />
                <span>{catalog.season} Festive Collection</span>
              </div>

              <h1 className="mt-6 font-display text-4xl leading-[1.1] font-normal text-primary sm:text-5xl lg:text-6xl">
                Sweet O&apos;Clock
                <span className="block font-script text-5xl sm:text-6xl lg:text-7xl text-accent">
                  Diwali Gifting
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl">
                  Catalog 2026
                </span>
              </h1>

              <p className="mt-6 max-w-xl font-elegant text-xl leading-relaxed text-foreground/85 sm:text-2xl">
                Homemade dry fruit laddus and artisanal festive hampers from
                Nagpur. Handcrafted by women Doctorates in agricultural sciences
                — {hampers.length} curated gifts from {formatPrice(lowest)} to{' '}
                {formatPrice(highest)}.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#hampers"
                  className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Browse the Hampers ({hampers.length})
                </a>
                <a
                  href={generalEnquiry}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary bg-card px-6 py-3.5 text-sm font-medium text-primary shadow-xs transition hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MessageCircle className="size-4" /> Order on WhatsApp
                </a>
                <a
                  href="/downloads/sweet-oclock-diwali-2026-catalog.pdf"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3.5 text-sm text-muted-foreground transition hover:border-gold hover:text-primary"
                >
                  <Download className="size-4" /> Catalog PDF
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/80 pt-6 sm:grid-cols-4">
                <div>
                  <p className="font-display text-xl font-semibold text-primary">
                    100%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Refined Sugar Free
                  </p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-primary">
                    Zero
                  </p>
                  <p className="text-xs text-muted-foreground">Preservatives</p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-primary">
                    3
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nagpur Branches
                  </p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-primary">
                    {formatPrice(lowest)}+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Budget Options
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-gold/30 via-primary/10 to-accent/20 blur-xl" />
              <figure className="relative border border-gold/70 bg-card p-3.5 shadow-[0_25px_60px_-20px_oklch(0.38_0.13_20/0.4)] transition md:rotate-[1.2deg] hover:rotate-0">
                <img
                  src={cdn('/img/cover.jpg', 900)}
                  srcSet={`${cdn('/img/cover.jpg', 600)} 600w, ${cdn('/img/cover.jpg', 900)} 900w`}
                  sizes="(min-width: 768px) 28rem, 100vw"
                  alt="Sweet O'Clock Signature Box of assorted laddus surrounded by Diwali diyas"
                  className="aspect-[4/5] w-full rounded-sm object-cover"
                  fetchPriority="high"
                />
                <figcaption className="pt-3.5 pb-1 text-center font-display text-sm tracking-wide text-primary">
                  Sweet O&apos;Clock Signature Box · Diwali 2026
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 4. Promise Strip */}
        <div className="border-y border-gold/50 bg-card/90 shadow-xs">
          <ul className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-5 py-4 text-sm font-medium tracking-[0.15em] text-primary sm:text-base">
            {catalog.tagline.map((t, i) => (
              <li key={t} className="flex items-center gap-8">
                {i > 0 && <span className="text-gold">✦</span>}
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Why Choose Sweet-O-Clock Section */}
        <section
          id="why-us"
          className="mx-auto max-w-content scroll-mt-20 px-5 py-20 sm:px-8"
        >
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] text-gold uppercase">
              The Sweet O&apos;Clock Difference
            </p>
            <h2 className="mt-3 font-display text-3xl text-primary sm:text-4xl lg:text-5xl">
              Nourishing Festivities, Crafted With Scientific Care
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-elegant text-lg text-foreground/80 sm:text-xl">
              From our kitchen in Nagpur to your festive table, discover why
              families and corporate organisations trust Sweet O&apos;Clock for
              thoughtful Diwali gifting.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <WhyUsCard
              icon={Heart}
              title="No Refined Sugar"
              description="Naturally sweetened with dates, dry fruits, and honest wholesome ingredients. Wholesome for children, elders, and new mothers alike."
            />
            <WhyUsCard
              icon={Award}
              title="Agricultural Doctorates"
              description="Founded in 2025 by women Doctorates from agricultural backgrounds under Cosmos Greens, ensuring strict quality control from farm to hamper."
            />
            <WhyUsCard
              icon={Gift}
              title="Artisanal Keepsakes"
              description="Reusable wooden trays, handwoven rope baskets, and handcrafted Pichwai diyas designed to bring warmth beyond the festive season."
            />
            <WhyUsCard
              icon={ShieldCheck}
              title="Tailored Customisation"
              description="Personalised greeting cards, bespoke corporate branding, and flexible hamper configurations tailored to your exact budget."
            />
          </div>
        </section>

        {/* 6. Hampers Collection Section */}
        <section
          id="hampers"
          className="mx-auto max-w-content scroll-mt-20 px-5 py-16 sm:px-8"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-[0.35em] text-gold uppercase">
                Browse The Collection
              </p>
              <h2 className="mt-2 font-display text-4xl text-primary sm:text-5xl">
                Diwali Gift Hampers
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Showing {visible.length} of {hampers.length} hampers
              </p>
            </div>

            {/* Sort & Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-56 flex-1 sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search sweets, nuts, diyas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-input bg-card py-2 pr-8 pl-9 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <option value="page-asc">Catalog order</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-border/80 pb-4">
            {hamperCategories.map((cat) => {
              const count =
                cat.id === 'all'
                  ? hampers.length
                  : hampers.filter((h) => getHamperCategory(h) === cat.id)
                      .length
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-medium tracking-wide transition sm:text-sm',
                    category === cat.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-card text-foreground/80 hover:border-gold hover:text-primary',
                  )}
                >
                  {cat.label} ({count})
                </button>
              )
            })}
          </div>

          {/* Price Bands Filter */}
          <div
            role="group"
            aria-label="Filter by price band"
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-muted-foreground">Price range:</span>
            {priceBands.map((b) => {
              const count = hampers.filter(
                (h) => h.price >= b.min && h.price <= b.max,
              ).length
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={band === b.id}
                  onClick={() => setBand(b.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition',
                    band === b.id
                      ? 'border-primary bg-primary/10 font-semibold text-primary'
                      : 'border-border/70 bg-card text-muted-foreground hover:border-gold hover:text-foreground',
                  )}
                >
                  {b.label} <span className="opacity-60">({count})</span>
                </button>
              )
            })}

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-auto text-xs text-accent underline-offset-4 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {visible.length === 0 ? (
            <div className="mt-12 rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <Sparkles className="mx-auto size-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-primary">
                No hampers found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No hampers match the selected filters or search query.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((h) => (
                <li key={h.slug}>
                  <HamperCard
                    hamper={h}
                    onOpen={() => setSelected(h)}
                    onAddToBag={handleAddToBag}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 rounded-lg border border-gold/40 bg-card p-4 text-center sm:p-6">
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm italic">
              {catalog.priceNote}
            </p>
          </div>
        </section>

        {/* 7. Brand Story Section */}
        <section
          id="story"
          className="scroll-mt-20 bg-primary text-primary-foreground"
        >
          <div className="mx-auto grid max-w-content gap-12 px-5 py-20 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="rounded-full bg-background p-3 shadow-md">
                <img
                  src="/img/logo.png"
                  alt="Sweet O'Clock logo"
                  width={140}
                  height={126}
                  className="size-28 object-contain"
                />
              </div>
              <p className="mt-6 text-xs tracking-[0.35em] text-gold uppercase">
                {about.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                {about.heading}
              </h2>
              <div className="mt-4 h-px w-20 bg-gold" />
            </div>

            <div className="space-y-6 font-elegant text-xl leading-relaxed text-primary-foreground/90 sm:text-2xl">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}

              <div className="mt-6 flex flex-wrap gap-2 pt-2">
                {contact.branches.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-sans tracking-wide text-gold"
                  >
                    <MapPin className="size-3" /> Nagpur · {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Custom & Corporate Orders */}
        <section
          id="corporate"
          className="mx-auto max-w-content scroll-mt-20 px-5 py-20 sm:px-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gold/70 bg-gradient-to-r from-card via-card to-gold/10 p-8 shadow-sm sm:p-12 md:grid-cols-[1.4fr_1fr] md:items-center lg:p-16">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
                Corporate &amp; Bulk Gifting
              </span>
              <h2 className="mt-3 font-script text-5xl leading-tight text-primary sm:text-6xl">
                Customise for Your Organisation
              </h2>
              <p className="mt-4 font-elegant text-xl leading-relaxed text-foreground/85">
                Every hamper can be customised to your exact requirements,
                dietary preferences, and budget. Personalisation, bespoke
                festive greeting cards, and corporate company branding are
                available.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={corporateEnquiry}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-md transition hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MessageCircle className="size-4" /> Request Corporate Quote
                </a>
                <a
                  href={`tel:+91${contact.phones[0]}`}
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3.5 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  <Phone className="size-4" /> Call: {contact.phones[0]}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Festive FAQ Section */}
        <section
          id="faq"
          className="mx-auto max-w-reading scroll-mt-20 px-5 py-20 sm:px-8"
        >
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] text-gold uppercase">
              Frequently Asked Questions
            </p>
            <h2 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
              Everything You Need to Know
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Clear, authentic answers about ordering, ingredients, and delivery
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="mt-10 divide-y divide-border"
          >
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-base font-medium text-primary hover:text-accent">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-elegant text-lg leading-relaxed text-foreground/80">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 10. Contact Section */}
        <section
          id="contact"
          className="scroll-mt-20 border-t border-border bg-card/60"
        >
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs tracking-[0.35em] text-gold uppercase">
                  Celebrate With Sweet O&apos;Clock
                </p>
                <h2 className="mt-2 font-display text-4xl text-primary sm:text-5xl">
                  Get in Touch
                </h2>
              </div>
              <p className="max-w-md font-elegant text-xl text-foreground/80">
                {catalog.closingNote}
              </p>
            </div>

            <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <ContactItem label="Phone Enquiries">
                {contact.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:+91${p}`}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Phone className="size-4 text-gold shrink-0" />
                    <span>+91 {p}</span>
                  </a>
                ))}
              </ContactItem>

              <ContactItem label="WhatsApp Order">
                <a
                  href={generalEnquiry}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <MessageCircle className="size-4 text-gold shrink-0" />
                  <span>+91 {contact.whatsapp}</span>
                </a>
              </ContactItem>

              <ContactItem label="Instagram">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Camera className="size-4 text-gold shrink-0" />
                  <span>@{contact.instagram}</span>
                </a>
              </ContactItem>

              <ContactItem label="City & Locations">
                <span className="flex items-center gap-2 font-medium">
                  <MapPin className="size-4 text-gold shrink-0" />
                  <span>{contact.city}, Maharashtra</span>
                </span>
                <span className="block text-xs text-muted-foreground">
                  3 Pickup Points
                </span>
              </ContactItem>
            </dl>

            <div className="mt-12 border-t border-border pt-8">
              <p className="text-xs tracking-[0.25em] text-gold uppercase">
                Nagpur Branches
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {contact.branches.map((b) => (
                  <span
                    key={b}
                    className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-2xs"
                  >
                    📍 {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 11. Downloads Section */}
        <section className="border-t border-border bg-muted/60">
          <div className="mx-auto flex max-w-content flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="font-display text-base text-primary">
                Official Catalog &amp; Data Downloads
              </p>
              <p className="text-xs text-muted-foreground">
                Download the complete 18-page original Diwali 2026 PDF catalogue
                or data files
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <DownloadLink href="/downloads/sweet-oclock-diwali-2026-catalog.pdf">
                Catalog PDF (18 pgs)
              </DownloadLink>
              
            </div>
          </div>
        </section>
      </main>

      {/* 12. Rich Footer */}
      <footer className="border-t border-gold/50 bg-card">
        <div className="mx-auto max-w-content px-5 py-12 sm:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/img/logo.png"
                  alt="Sweet O'Clock"
                  width={48}
                  height={44}
                  className="size-12 object-contain"
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary">
                    Sweet O&apos;Clock
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    A brand of Cosmos Greens · Nagpur
                  </p>
                </div>
              </div>
              <p className="max-w-md font-elegant text-base leading-relaxed text-foreground/80">
                Homemade dry fruit laddu brand founded in 2025 by women
                Doctorates in agriculture. 100% natural, no refined sugar, no
                preservatives.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-gold uppercase">
                Quick Navigation
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#hampers" className="hover:text-primary">
                    Diwali Hampers
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-primary">
                    Why Sweet O&apos;Clock
                  </a>
                </li>
                <li>
                  <a href="#story" className="hover:text-primary">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#corporate" className="hover:text-primary">
                    Corporate Gifting
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-primary">
                    Contact &amp; Branches
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-gold uppercase">
                Get in Touch
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href={generalEnquiry}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <MessageCircle className="size-4 text-gold" /> WhatsApp: +91{' '}
                    {contact.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:+91${contact.phones[0]}`}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Phone className="size-4 text-gold" /> +91{' '}
                    {contact.phones[0]}
                  </a>
                </li>
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Camera className="size-4 text-gold" /> @{contact.instagram}
                  </a>
                </li>
                <li className="pt-2 text-xs text-muted-foreground">
                  Nagpur: Pannase Layout · Amravati Rd · Omkar Nagar
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <span>
              &copy; {new Date().getFullYear()} Sweet O&apos;Clock · All rights
              reserved · Diwali 2026 Edition
            </span>
            <span>Handcrafted with love in Nagpur</span>
          </div>
        </div>
      </footer>

      {/* 13. Dialogs & Drawers */}
      <HamperDialog
        hamper={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onAddToBag={handleAddToBag}
      />

      <InquiryBagSheet
        open={bagOpen}
        onOpenChange={setBagOpen}
        items={bagItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={handleClearBag}
      />
    </div>
  )
}

function SiteHeader({
  bagItemCount,
  onOpenBag,
}: {
  bagItemCount: number
  onOpenBag: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="#" className="flex items-center gap-3">
          <img
            src="/img/logo.png"
            alt="Sweet O'Clock"
            width={44}
            height={40}
            className="size-11 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase sm:text-sm">
              Sweet O&apos;Clock
            </span>
            <span className="text-[0.65rem] tracking-wider text-gold uppercase">
              Diwali Gifting 2026
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <a href="#hampers" className="text-foreground/80 hover:text-primary">
            Hampers
          </a>
          <a href="#why-us" className="text-foreground/80 hover:text-primary">
            Why Us
          </a>
          <a href="#story" className="text-foreground/80 hover:text-primary">
            Our Story
          </a>
          <a
            href="#corporate"
            className="text-foreground/80 hover:text-primary"
          >
            Corporate
          </a>
          <a href="#faq" className="text-foreground/80 hover:text-primary">
            FAQs
          </a>
          <a href="#contact" className="text-foreground/80 hover:text-primary">
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Inquiry Bag Trigger */}
          <button
            type="button"
            onClick={onOpenBag}
            className="relative flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-primary shadow-2xs transition hover:border-gold hover:bg-gold/5"
            title="Open Festive Inquiry Bag"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Inquiry Bag</span>
            {bagItemCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-accent-foreground">
                {bagItemCount}
              </span>
            )}
          </button>

          {/* Quick WhatsApp Link */}
          <a
            href={generalEnquiry}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 sm:inline-flex"
          >
            <MessageCircle className="size-4" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground lg:hidden"
            aria-label="Open mobile navigation"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="flex w-full flex-col bg-background sm:max-w-xs"
        >
          <SheetHeader className="border-b border-border pb-4 text-left">
            <div className="flex items-center gap-3">
              <img
                src="/img/logo.png"
                alt="Sweet O'Clock"
                className="size-10 object-contain"
              />
              <div>
                <SheetTitle className="font-display text-lg text-primary">
                  Sweet O&apos;Clock
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Diwali Gifting 2026
                </p>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 space-y-1 py-4 text-base font-medium">
            <MobileNavLink
              href="#hampers"
              onClick={() => setMobileMenuOpen(false)}
            >
              Diwali Hampers
            </MobileNavLink>
            <MobileNavLink
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why Sweet O&apos;Clock
            </MobileNavLink>
            <MobileNavLink
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Story
            </MobileNavLink>
            <MobileNavLink
              href="#corporate"
              onClick={() => setMobileMenuOpen(false)}
            >
              Corporate Orders
            </MobileNavLink>
            <MobileNavLink href="#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQs
            </MobileNavLink>
            <MobileNavLink
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact &amp; Branches
            </MobileNavLink>
          </nav>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold tracking-wider text-gold uppercase">
              Nagpur Branches
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {contact.branches.join(' · ')}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={generalEnquiry}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-medium text-primary-foreground"
              >
                <MessageCircle className="size-4" /> Message on WhatsApp
              </a>
              <a
                href="/downloads/sweet-oclock-diwali-2026-catalog.pdf"
                download
                className="flex items-center justify-center gap-2 rounded-full border border-border py-2 text-xs font-medium text-foreground hover:border-gold"
              >
                <Download className="size-3.5" /> Download PDF (18 Pgs)
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-md px-3 py-2.5 text-foreground/90 transition hover:bg-primary/5 hover:text-primary"
    >
      <span>{children}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </a>
  )
}

function WhyUsCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-md">
      <div className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-primary">
        <Icon className="size-6 text-gold" />
      </div>
      <h3 className="mt-5 font-display text-xl text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function ContactItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-xs tracking-[0.25em] text-gold uppercase">{label}</dt>
      <dd className="mt-3 space-y-1.5 text-base sm:text-lg">{children}</dd>
    </div>
  )
}

function DownloadLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium transition hover:border-gold hover:text-primary"
    >
      <Download className="size-3.5" /> {children}
    </a>
  )
}
