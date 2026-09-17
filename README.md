# Wings Gallery

Persian, right-to-left fashion accessories homepage built with Next.js App Router, React, TypeScript, Tailwind CSS 4, and Framer Motion.

## Development

Run `npm install`, then `npm run dev`. Open http://localhost:3000. On PowerShell with restricted script execution, use `npm.cmd`.

Validation: `npm run lint` and `npm run build`. Production: `npm start`.

## Structure

- `app/page.tsx`: homepage section composition.
- `app/globals.css`: theme tokens, editorial styles, and responsive layouts.
- `components/`: header, hero, category/product cards, editorial, services, footer, and reveal animation.
- `components/shop-provider.tsx`: session-only search, filters, favorites, product previews, and demo cart with native accessible dialogs.
- `lib/products.ts`: typed mock data and Persian price formatting.
- `public/images/`: locally served generated photography using `next/image`.

Vazirmatn, Amiri, and Cormorant Garamond are bundled through Fontsource, with no third-party font requests. Licenses are in the font npm packages.

Products, prices, service policies, and contact email are placeholders to replace before launch. Checkout, authentication, persistent storage, and a backend are outside the homepage scope. Favorites and cart reset on page reload.

## Images

Five placeholder images were created with the built-in image generation tool. See `public/images/PROMPTS.md` for the prompt set. Replace with real product photography before launch.
