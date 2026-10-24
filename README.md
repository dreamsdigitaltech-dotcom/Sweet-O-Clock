# Sweet O'Clock · Diwali Gifting Catalog 2026

A website version of Sweet O'Clock's Diwali 2026 gifting catalog. Sweet O'Clock (a brand of Cosmos Greens) makes homemade dry fruit laddus in Nagpur with no refined sugar and no preservatives.

All content from the original 18-page PDF is on the site: the brand story, 15 gift hampers with their photos, packaging, full contents and prices (₹180–₹2,500, including the three Signature Box sizes), the pricing fine print, phone/WhatsApp/Instagram contacts and the three Nagpur branches.

## Features

- Hamper grid with price filters and low/high sorting
- Detail view for each hamper with complete contents, size picker and a pre-filled WhatsApp enquiry
- Custom and corporate order call-to-action
- Downloads: original catalog PDF, hampers CSV and full JSON data

## Tech

TanStack Start (React 19), Tailwind CSS 4, shadcn/ui, deployed on Netlify with images served through the Netlify Image CDN.

## Run locally

```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Updating the catalog

Edit `src/data/catalog.json` (prices, contents, contacts). Product photos live in `public/img/<hamper-slug>.jpg`. If you change the data, update the copies in `public/downloads/` too.
