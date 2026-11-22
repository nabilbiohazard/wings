# Wings Gallery

Wings Gallery is a Persian, right-to-left jewelry storefront built with Next.js App Router and React. WordPress provides the CMS and admin dashboard. WooCommerce manages the catalogue and orders, and the Wings Commerce WordPress plugin connects customer accounts, SMS login, checkout, and custom designs to the storefront.

See [LAUNCH.md](LAUNCH.md) for VPS deployment and [the WordPress setup guide](wordpress/README.md) for configuring the plugin in `wp-admin`.

## Development

Run `npm ci` and use `.env.example` to configure `.env.local` for your WordPress environment. Run `npm run dev` and open http://localhost:3000. On PowerShell with restricted script execution, use `npm.cmd`.

Validation: `npm run lint` and `npm run build`. Production: `npm start`.

## Structure

- `app/page.tsx`: homepage section composition.
- `app/globals.css`: theme tokens, editorial styles, and responsive layouts.
- `components/`: header, hero, category/product cards, editorial, services, footer, and reveal animation.
- `lib/wordpress.ts` and `lib/woocommerce.ts` fetch posts and products server-side.
- `app/api/commerce/` and `wordpress/wings-commerce/` connect the storefront to the WordPress commerce plugin.
- `public/images/` contains storefront photography served by Next.js.

Vazirmatn, Amiri, and Cormorant Garamond are bundled through Fontsource, with no third-party font requests. Licenses are in the font npm packages.

Manage products, prices, inventory, orders, customers, and WordPress posts from `wp-admin`. Storefront layout, static copy, and the bundled journal articles live in the Next.js repository. The current checkout creates on-hold orders for manual payment.

## Images

Five placeholder images were created with the built-in image generation tool. See `public/images/PROMPTS.md` for the prompt set. Replace with real product photography before launch.
