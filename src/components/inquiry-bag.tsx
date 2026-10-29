import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  consolidatedEnquiryMessage,
  formatPrice,
  whatsappLink,
  type Hamper,
  type SizeOption,
} from '@/lib/catalog'

export interface BagItem {
  id: string
  hamper: Hamper
  option?: SizeOption
  quantity: number
}

export function InquiryBagSheet({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: BagItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  onClearBag: () => void
}) {
  const totalAmount = items.reduce((sum, item) => {
    const unitPrice = item.option?.price ?? item.hamper.price
    return sum + unitPrice * item.quantity
  }, 0)

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const whatsappUrl = whatsappLink(consolidatedEnquiryMessage(items))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col bg-background sm:max-w-md"
      >
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <SheetTitle className="font-display text-2xl text-primary">
                Festive Inquiry Bag
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {items.length === 0
                  ? 'Your bag is currently empty'
                  : `${totalCount} ${totalCount === 1 ? 'hamper' : 'hampers'} selected for enquiry`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-gold/40 bg-card shadow-inner">
              <Sparkles className="size-8 text-gold" />
            </div>
            <h3 className="mt-4 font-display text-lg text-primary">
              No hampers added yet
            </h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Browse our Diwali 2026 collection and click &ldquo;Add to Inquiry
              Bag&rdquo; to compile a list and order together on WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Browse Diwali Hampers
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-3 divide-y divide-border/60">
                {items.map((item) => {
                  const unitPrice = item.option?.price ?? item.hamper.price
                  const itemTotal = unitPrice * item.quantity

                  return (
                    <li key={item.id} className="flex gap-3 pt-3 first:pt-0">
                      <img
                        src={item.hamper.image}
                        alt={item.hamper.name}
                        className="size-20 shrink-0 rounded-md border border-border/80 object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-serif text-base leading-snug font-medium text-primary">
                              {item.hamper.name}
                            </h4>
                            {item.option && (
                              <p className="text-xs text-muted-foreground">
                                {item.option.label} ({item.option.weight})
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${item.hamper.name}`}
                            className="text-muted-foreground transition hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border bg-card">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="px-2.5 py-1 text-muted-foreground transition hover:text-primary"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="min-w-6 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                              className="px-2.5 py-1 text-muted-foreground transition hover:text-primary"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-accent">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Total:</span>
                <span className="font-display text-2xl font-semibold text-primary">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <p className="mt-1 text-[0.7rem] text-muted-foreground italic">
                *Prices are indicative and subject to final customisation and
                branding.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  <MessageCircle className="size-4" />
                  Send Order via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClearBag}
                  className="py-1 text-center text-xs text-muted-foreground transition hover:text-foreground"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
