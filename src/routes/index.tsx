import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Download,
  Camera,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'

import { HamperCard, HamperDialog } from '@/components/hamper'
import {
  about,
  catalog,
  cdn,
  contact,
  formatPrice,
  hampers,
  priceBands,
  whatsappLink,
  type Hamper,
} from '@/lib/catalog'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

type BandId = (typeof priceBands)[number]['id']
type SortOrder = 'asc' | 'desc'

const instagramUrl = `https://instagram.com/${contact.instagram}`
const generalEnquiry = whatsappLink(
  "Hello Sweet O'Clock! I'd like to know more about your Diwali 2026 gift hampers.",
)

function Home() {
  const [band, setBand] = useState<BandId>('all')
  const [sort, setSort] = useState<SortOrder>('asc')
  const [selected, setSelected] = useState<Hamper | null>(null)

  const visible = useMemo(() => {
    const { min, max } = priceBands.find((b) => b.id === band)!
    return hampers
      .filter((h) => h.price >= min && h.price <= max)
      .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price))
  }, [band, sort])

  const lowest = Math.min(...hampers.map((h) => h.price))
  const highest = Math.max(...hampers.map((h) => h.price))

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-content items-center gap-12 px-5 pt-10 pb-16 sm:px-8 md:grid-cols-[1.05fr_1fr] md:pt-16 md:pb-24">
          <div>
            <p className="text-xs tracking-[0.35em] text-gold uppercase">
              {catalog.season}
            </p>
            <div className="mt-4 h-px w-16 bg-gold" />
            <h1 className="mt-6 font-display text-5xl leading-[1.08] font-normal text-primary sm:text-6xl lg:text-7xl">
              Sweet O'Clock
              <span className="block">Diwali Gifting</span>
              <span className="block">Catalog 2026</span>
            </h1>
            <p className="mt-6 max-w-md font-elegant text-xl leading-relaxed text-foreground/80">
              Handmade dry fruit laddus and festive hampers from Nagpur — {hampers.length}{' '}
              gifts from {formatPrice(lowest)} to {formatPrice(highest)}, each
              one customisable for family, friends and corporate gifting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#hampers"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Browse the hampers
              </a>
              <a
                href={generalEnquiry}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
              >
                <MessageCircle className="size-4" /> Order on WhatsApp
              </a>
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-md border border-gold/60 bg-card p-3 shadow-[0_30px_60px_-30px_oklch(0.38_0.13_20/0.5)] md:rotate-[1.5deg]">
            <img
              src={cdn('/img/cover.jpg', 900)}
              srcSet={`${cdn('/img/cover.jpg', 600)} 600w, ${cdn('/img/cover.jpg', 900)} 900w`}
              sizes="(min-width: 768px) 28rem, 100vw"
              alt="Sweet O'Clock Signature Box of assorted laddus surrounded by Diwali diyas"
              className="aspect-[4/5] w-full object-cover"
              fetchPriority="high"
            />
            <figcaption className="pt-3 pb-1 text-center font-display text-sm text-primary">
              Sweet O'Clock Signature Box
            </figcaption>
          </figure>
        </section>

        {/* Promise strip */}
        <div className="border-y border-gold/50 bg-card">
          <ul className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-4 text-sm font-medium tracking-[0.12em] text-primary sm:text-base">
            {catalog.tagline.map((t, i) => (
              <li key={t} className="flex items-center gap-6">
                {i > 0 && <span className="text-gold">·</span>}
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Catalog */}
        <section
          id="hampers"
          className="mx-auto max-w-content scroll-mt-20 px-5 py-20 sm:px-8"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-[0.35em] text-gold uppercase">
                The collection
              </p>
              <h2 className="mt-3 font-display text-4xl text-primary sm:text-5xl">
                Diwali gift hampers
              </h2>
            </div>
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              Sort by price
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                className="rounded-md border border-input bg-card px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <option value="asc">Low to high</option>
                <option value="desc">High to low</option>
              </select>
            </label>
          </div>

          <div
            role="group"
            aria-label="Filter by price"
            className="mt-8 flex flex-wrap gap-2"
          >
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
                    'rounded-full border px-4 py-2 text-sm transition',
                    band === b.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-gold',
                  )}
                >
                  {b.label}{' '}
                  <span className="opacity-60">({count})</span>
                </button>
              )
            })}
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((h) => (
              <li key={h.slug}>
                <HamperCard hamper={h} onOpen={() => setSelected(h)} />
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted-foreground italic">
            {catalog.priceNote}
          </p>
        </section>

        {/* About */}
        <section id="story" className="scroll-mt-20 bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-content gap-12 px-5 py-20 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <img
                src="/img/logo.png"
                alt="Sweet O'Clock logo"
                width={144}
                height={130}
                className="rounded-full bg-background p-2"
              />
              <p className="mt-8 text-xs tracking-[0.35em] text-gold uppercase">
                {about.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                {about.heading}
              </h2>
            </div>
            <div className="space-y-5 font-elegant text-xl leading-relaxed text-primary-foreground/90 sm:text-2xl">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Custom & corporate */}
        <section className="mx-auto max-w-content px-5 py-20 sm:px-8">
          <div className="grid gap-8 rounded-lg border border-gold/60 bg-card p-8 sm:p-12 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="font-script text-5xl leading-none text-primary sm:text-6xl">
                Custom & corporate orders
              </h2>
              <p className="mt-5 max-w-xl font-elegant text-xl leading-relaxed text-foreground/80">
                Every hamper can be customised to your requirements and budget.
                Personalisation and corporate branding are available at an
                additional cost — just tell us the quantity and the occasion.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a
                href={whatsappLink(
                  "Hello Sweet O'Clock! I'd like a quote for custom / corporate Diwali hampers.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
              >
                <MessageCircle className="size-4" /> Request a quote
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8">
            <h2 className="font-display text-4xl text-primary sm:text-5xl">
              Celebrate with Sweet O'Clock
            </h2>
            <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <ContactItem label="Contact">
                {contact.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:+91${p}`}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Phone className="size-4 text-gold" /> {p}
                  </a>
                ))}
              </ContactItem>
              <ContactItem label="WhatsApp">
                <a
                  href={generalEnquiry}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <MessageCircle className="size-4 text-gold" />{' '}
                  {contact.whatsapp}
                </a>
              </ContactItem>
              <ContactItem label="Instagram">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Camera className="size-4 text-gold" /> {contact.instagram}
                </a>
              </ContactItem>
              <ContactItem label="City">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-gold" /> {contact.city}
                </span>
              </ContactItem>
            </dl>
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-xs tracking-[0.25em] text-gold uppercase">
                Branches
              </p>
              <p className="mt-3 text-xl">
                {contact.branches.join('   ·   ')}
              </p>
            </div>
            <p className="mt-10 font-elegant text-xl text-gold">
              {catalog.closingNote}
            </p>
          </div>
        </section>

        {/* Downloads */}
        <section className="bg-muted">
          <div className="mx-auto flex max-w-content flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-sm text-muted-foreground">
              Download the catalog or its data
            </p>
            <div className="flex flex-wrap gap-2">
              <DownloadLink href="/downloads/sweet-oclock-diwali-2026-catalog.pdf">
                Catalog PDF
              </DownloadLink>
              <DownloadLink href="/downloads/sweet-oclock-diwali-2026.csv">
                Hampers CSV
              </DownloadLink>
              <DownloadLink href="/downloads/sweet-oclock-diwali-2026.json">
                Full data JSON
              </DownloadLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gold/50">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-8">
          <span>Sweet O'Clock · a brand of Cosmos Greens · Nagpur</span>
          <span>{catalog.season}</span>
        </div>
      </footer>

      <HamperDialog
        hamper={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="#" className="flex items-center gap-3">
          <img
            src="/img/logo.png"
            alt=""
            width={44}
            height={40}
            className="size-11 object-contain"
          />
          <span className="hidden text-[0.7rem] font-semibold tracking-[0.3em] text-primary uppercase sm:inline">
            Sweet O'Clock · Diwali 2026
          </span>
        </a>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <a href="#hampers" className="px-2 py-1 hover:text-primary">
            Hampers
          </a>
          <a href="#story" className="hidden px-2 py-1 hover:text-primary sm:inline">
            Our story
          </a>
          <a href="#contact" className="px-2 py-1 hover:text-primary">
            Contact
          </a>
          <a
            href={generalEnquiry}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/90"
          >
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
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
      <dd className="mt-3 space-y-1 text-lg">{children}</dd>
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
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-gold hover:text-primary"
    >
      <Download className="size-4" /> {children}
    </a>
  )
}
