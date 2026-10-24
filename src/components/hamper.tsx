import { useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'

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
  enquiryMessage,
  formatPrice,
  whatsappLink,
  type Hamper,
} from '@/lib/catalog'
import { cn } from '@/lib/utils'

export function HamperCard({
  hamper,
  onOpen,
}: {
  hamper: Hamper
  onOpen: () => void
}) {
  const preview = hamper.items.slice(0, 3)
  const more = hamper.items.length - preview.length

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-left shadow-[0_1px_0_var(--border)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_oklch(0.38_0.13_20/0.45)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={cdn(hamper.image, 640)}
          srcSet={`${cdn(hamper.image, 420)} 420w, ${cdn(hamper.image, 640)} 640w, ${cdn(hamper.image, 900)} 900w`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={hamper.name}
          loading="lazy"
          className="size-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] tracking-[0.2em] text-primary uppercase backdrop-blur">
          No. {String(hamper.page - 2).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-script text-[2rem] leading-none text-primary">
          {hamper.name}
        </h3>
        {hamper.packaging && (
          <p className="text-xs tracking-[0.16em] text-gold uppercase">
            {hamper.packaging}
          </p>
        )}
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
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            {hamper.options ? 'from ' : ''}
            {formatPrice(hamper.price)}
          </span>
          <span className="text-sm text-primary underline-offset-4 group-hover:underline">
            View hamper →
          </span>
        </div>
      </div>
    </button>
  )
}

export function HamperDialog({
  hamper,
  onOpenChange,
}: {
  hamper: Hamper | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={hamper !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto p-0 sm:max-w-4xl">
        {hamper && <HamperDetail key={hamper.slug} hamper={hamper} />}
      </DialogContent>
    </Dialog>
  )
}

function HamperDetail({ hamper }: { hamper: Hamper }) {
  const [optionIndex, setOptionIndex] = useState(0)
  const option = hamper.options?.[optionIndex]
  const price = option?.price ?? hamper.price

  return (
    <div className="grid md:grid-cols-[1fr_1.1fr]">
      <div className="bg-muted md:min-h-full">
        <img
          src={cdn(hamper.image, 900)}
          alt={hamper.name}
          className="aspect-[4/5] size-full object-cover md:aspect-auto"
        />
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

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <span className="rounded-full bg-accent px-5 py-2 text-xl font-semibold text-accent-foreground">
            {formatPrice(price)}
          </span>
          <a
            href={whatsappLink(enquiryMessage(hamper, option))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <MessageCircle className="size-4" /> Enquire on WhatsApp
          </a>
          <a
            href={`tel:+91${contact.phones[0]}`}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5"
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
