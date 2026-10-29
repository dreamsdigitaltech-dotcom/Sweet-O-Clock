import { useState } from 'react'
import {
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  catalog,
  cdn,
  contact,
  formatPrice,
  whatsappLink,
  type Hamper,
  type SizeOption,
} from '@/lib/catalog'
import { cn } from '@/lib/utils'

function getSpecialBadge(slug: string) {
  switch (slug) {
    case 'signature-box':
      return 'Bestselling Laddu'
    case 'emerald-treasure-box':
      return 'Keepsake Box'
    case 'grand-bloom-basket':
      return 'Rope Basket & Diya'
    case 'royal-heritage-box':
      return 'Royal Luxury'
    case 'golden-garden-tray':
      return 'Pichwai Brass Tray'
    default:
      return null
  }
}

export function HamperCard({
  hamper,
  onOpen,
  onAddToBag,
}: {
  hamper: Hamper
  onOpen: () => void
  onAddToBag?: (hamper: Hamper, option?: SizeOption, quantity?: number) => void
}) {
  const preview = hamper.items.slice(0, 3)
  const more = hamper.items.length - preview.length
  const specialBadge = getSpecialBadge(hamper.slug)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-[0_2px_12px_-4px_oklch(0.38_0.13_20/0.08)] transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_20px_40px_-20px_oklch(0.38_0.13_20/0.3)]">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
          }
        }}
        className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-muted focus-visible:outline-none"
      >
        <img
          src={cdn(hamper.image, 640)}
          srcSet={`${cdn(hamper.image, 420)} 420w, ${cdn(hamper.image, 640)} 640w, ${cdn(hamper.image, 900)} 900w`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={hamper.name}
          loading="lazy"
          className="size-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />

        <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.2em] text-primary uppercase shadow-xs backdrop-blur">
            No. {String(hamper.page - 2).padStart(2, '0')}
          </span>
          {specialBadge && (
            <span className="flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-[0.65rem] font-medium tracking-wider text-gold shadow-sm backdrop-blur">
              <Sparkles className="size-2.5 text-gold" /> {specialBadge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen()
              }
            }}
            className="cursor-pointer font-script text-[2.1rem] leading-none text-primary hover:text-primary/90"
          >
            {hamper.name}
          </h3>
          {hamper.packaging && (
            <p className="mt-1 text-xs tracking-[0.16em] text-gold uppercase">
              {hamper.packaging}
            </p>
          )}
        </div>

        <ul className="space-y-1 font-elegant text-[1.05rem] leading-snug text-foreground/85">
          {preview.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-gold">★</span>
              <span>{item}</span>
            </li>
          ))}
          {more > 0 && (
            <li className="pl-5 text-muted-foreground italic">
              + {more} more {more === 1 ? 'item' : 'items'}
            </li>
          )}
        </ul>

        <div className="mt-auto border-t border-border/60 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[0.7rem] text-muted-foreground uppercase">
                {hamper.options ? 'Starting from' : 'Indicative price'}
              </span>
              <div className="font-display text-xl font-semibold text-primary">
                {formatPrice(hamper.price)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onAddToBag && (
                <button
                  type="button"
                  onClick={() => onAddToBag(hamper, hamper.options?.[0], 1)}
                  title="Add to Festive Inquiry Bag"
                  className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary transition hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <ShoppingBag className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onOpen}
                className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-xs transition hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HamperDialog({
  hamper,
  onOpenChange,
  onAddToBag,
}: {
  hamper: Hamper | null
  onOpenChange: (open: boolean) => void
  onAddToBag?: (hamper: Hamper, option?: SizeOption, quantity?: number) => void
}) {
  return (
    <Dialog open={hamper !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto p-0 sm:max-w-4xl">
        {hamper && (
          <HamperDetail
            key={hamper.slug}
            hamper={hamper}
            onAddToBag={onAddToBag}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function HamperDetail({
  hamper,
  onAddToBag,
}: {
  hamper: Hamper
  onAddToBag?: (hamper: Hamper, option?: SizeOption, quantity?: number) => void
}) {
  const [optionIndex, setOptionIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const option = hamper.options?.[optionIndex]
  const unitPrice = option?.price ?? hamper.price
  const totalPrice = unitPrice * quantity

  const specialBadge = getSpecialBadge(hamper.slug)

  const singleHamperEnquiry = whatsappLink(
    `Hello Sweet O'Clock! 🪔\n\nI would like to enquire about ordering:\n*${hamper.name}*${option ? ` (${option.label} · ${option.weight})` : ''}\nQuantity: ${quantity}\nEstimated Price: ${formatPrice(totalPrice)}\n\nPlease let me know about availability and delivery in Nagpur. Thank you!`,
  )

  return (
    <div className="grid md:grid-cols-[1fr_1.1fr]">
      <div className="relative bg-muted md:min-h-full">
        <img
          src={cdn(hamper.image, 900)}
          alt={hamper.name}
          className="aspect-[4/5] size-full object-cover md:aspect-auto"
        />
        {specialBadge && (
          <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-primary/95 px-3 py-1 text-xs font-medium text-gold shadow-md backdrop-blur">
            <Sparkles className="size-3 text-gold" /> {specialBadge}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <p className="text-[0.7rem] tracking-[0.25em] text-gold uppercase">
            Diwali 2026 · Catalog page {hamper.page}
          </p>
          <DialogTitle className="mt-2 font-script text-5xl leading-none font-normal text-primary">
            {hamper.name}
          </DialogTitle>
          <div className="mt-4 h-px w-16 bg-gold" />
        </div>

        <DialogDescription className="sr-only">
          Contents and price of the {hamper.name}.
        </DialogDescription>

        <ul className="space-y-2 font-elegant text-xl leading-snug">
          {hamper.packaging && (
            <li className="flex gap-3">
              <span className="text-gold">★</span>
              <span>{hamper.packaging}</span>
            </li>
          )}
          {hamper.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-gold">★</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {hamper.options && (
          <fieldset>
            <legend className="mb-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Choose a size
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {hamper.options.map((o, i) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setOptionIndex(i)}
                  aria-pressed={i === optionIndex}
                  className={cn(
                    'rounded-md border px-3 py-2 text-left text-sm transition',
                    i === optionIndex
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-gold',
                  )}
                >
                  <span className="block font-medium">{o.label}</span>
                  <span className="block opacity-80">
                    {o.weight} · {formatPrice(o.price)}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* Quantity selector */}
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Quantity:
          </span>
          <div className="flex items-center rounded-full border border-border bg-card">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="px-3 py-1.5 text-muted-foreground transition hover:text-primary"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="px-3 py-1.5 text-muted-foreground transition hover:text-primary"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <span className="ml-auto font-display text-2xl font-semibold text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          {onAddToBag && (
            <button
              type="button"
              onClick={() => onAddToBag(hamper, option, quantity)}
              className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ShoppingBag className="size-4" /> Add to Inquiry Bag
            </button>
          )}
          <a
            href={singleHamperEnquiry}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <MessageCircle className="size-4" /> Enquire on WhatsApp
          </a>
          <a
            href={`tel:+91${contact.phones[0]}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-gold hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Phone className="size-4" /> Call
          </a>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground italic">
          {catalog.priceNote}
        </p>
      </div>
    </div>
  )
}
