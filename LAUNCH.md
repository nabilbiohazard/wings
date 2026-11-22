# Production launch

Do not launch until the configuration and live checks below pass. A source review and dependency audit cannot certify the deployed WordPress installation or hosting.

## VPS layout

| Address | Service | Purpose |
| --- | --- | --- |
| `shop.example.com` | Next.js and React on Node.js | Public storefront, cart, checkout, account, and design studio |
| `cms.example.com/wp-admin` | WordPress on PHP-FPM | Edit posts and media. Manage products, stock, customers, and orders in WooCommerce. |
| `cms.example.com/wp-json` | WordPress, WooCommerce, and Wings Commerce APIs | Supply data and handle commerce requests from Next.js. |

A Linux VPS can run both services behind Nginx, with MariaDB listening locally. If the existing WordPress installation stays on its current host, deploy only the Next.js service to the VPS and point its API settings to that host. [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting) · [WordPress server requirements](https://wordpress.org/about/requirements/)

### Set up WordPress

1. If moving an existing store, restore its database and `wp-content` on the VPS so products, orders, customers, plugin settings, and media move together. If changing the CMS domain, use a serialization-aware URL replacement and verify that media and product links use the new HTTPS address. [WordPress migration guide](https://developer.wordpress.org/advanced-administration/upgrade/migrating/)
2. Point the CMS hostname at the WordPress server and configure HTTPS. For WordPress on this VPS, give Nginx a separate server block using the WordPress document root and PHP-FPM. In WordPress, choose a permalink structure other than **Plain** and confirm `/wp-json/` returns JSON. [WordPress Nginx configuration](https://developer.wordpress.org/advanced-administration/server/web-server/nginx/)
3. Enable WooCommerce and install the `wordpress/wings-commerce/` source directory as a WordPress plugin. In **WooCommerce → Settings → Advanced → REST API**, create a **Read** key for Next.js. Configure the Wings connection secret, storefront URL, SMS provider, and WooCommerce shipping settings. If migrating, preserve the plugin or custom code that registers `/wp-json/wp/v2/contact_message`. The contact form depends on that route. [WooCommerce API key setup](https://woocommerce.com/document/woocommerce-rest-api/) · [Wings plugin setup](wordpress/README.md)

### Set up the storefront

1. Point `shop.example.com` at the VPS and configure HTTPS in Nginx. Put the repository in a private directory such as `/srv/wings`, owned by a dedicated service user. Install a supported Node.js LTS release and populate `.env.production.local` from `.env.example` with the production values. Set `TRUSTED_CLIENT_IP_HEADER=x-real-ip` if Nginx receives visitor traffic directly and uses the proxy configuration below.
2. From `/srv/wings`, run `npm ci`, `npm run check:launch`, and `npm run build` as the service user. Make the same environment available to the service at startup. Use systemd to run `npm run start -- --hostname 127.0.0.1 --port 3000` with `/srv/wings` as its working directory, the same user, and automatic restart on failure.
3. Put this `location` block in the HTTPS storefront server block. If a CDN is upstream, configure Nginx's real IP module for that CDN's trusted proxies before using `X-Real-IP` for per-visitor limits. Run `nginx -t` before reloading Nginx. [Nginx reverse proxy directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

   ```nginx
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_buffering off;
   }
   ```

4. On staging, edit a WooCommerce product and verify the change on a fresh `/shop` request. Publish a WordPress post and check the journal after its 60-second revalidation window. Then run the release checks below before pointing production traffic at the new setup.

## Configuration

Copy the setting names from `.env.example` into the hosting secret manager. Run `npm run check:launch` with the production environment loaded. The local environment at review time lacked APP_URL, WINGS_BRIDGE_URL, WINGS_BRIDGE_SECRET and TRUSTED_CLIENT_IP_HEADER.

- APP_URL must be the canonical HTTPS storefront origin. Mutating APIs reject requests when it is missing or insecure.
- Install `wordpress/wings-commerce/` on WordPress and set the same independently generated bridge secret (at least 32 random characters) on both hosts. Configure the SMS provider in WordPress. Do not reuse WooCommerce credentials as the bridge secret.
- Use read-only WooCommerce API credentials: storefront catalogue reads do not require write privileges.
- TRUSTED_CLIENT_IP_HEADER must identify a header the hosting proxy overwrites. Block direct access to the origin server if otherwise the header can be forged. Without it all users share an anonymous quota.
- Set `WINGS_STOREFRONT_URL` in the WordPress plugin to match `APP_URL`. Next.js allows optimized images from the HTTPS `WC_API_URL` host at build time. Review `next.config.ts` if a separate host serves product images.
- Deploy through Next.js, never expose the repository root as a static directory. Keep .env files, .git, .backups, exports and WordPress archives outside the web root. Existing tracked backups remain in Git; the new ignore rule only protects new backups.

## Hosting controls

- Enable HTTPS on both hosts and redirect HTTP. Ensure WordPress correctly recognizes HTTPS behind its proxy.
- Rate-limit `/api/contact`, `/api/commerce/auth/*`, and public catalogue endpoints at the CDN/proxy. Contact protection in the app is per-process (five requests per ten minutes); it is not a distributed quota and resets on restart. Apply equivalent protection or authentication to the WordPress contact endpoint so direct calls cannot bypass the storefront limit.
- Exclude `/api/commerce/*`, `/api/contact`, and `/wp-json/wings/v1/*` from public CDN caching. Never log cookies, Authorization headers, bridge headers, OTP codes or form contents.
- The included CSP blocks framing, plugins and external base URLs; it is not a nonce-based script policy. HTML sanitization protects the existing CMS HTML sinks.
- Update WordPress, WooCommerce and installed plugins; enable administrator MFA, database backups and restore testing. Keep WP-Cron working for expired token cleanup.

## Release checks

Run `npm ci`, `npm audit`, `npm run lint`, `npm run test:commerce`, `npm run build`, and `npm run check:launch`. PHP is needed for `npm run test:wordpress` and `php tests/wordpress-commerce.php`; JavaScript tests only parse PHP syntax.

On staging, run the Playwright suite against the running app using TEST_BASE_URL. Then test real SMS login/logout, two separate customers, order isolation, addresses, product variations, custom designs, stock changes, shipping, discounts, duplicate checkout retries and cancellation against the actual WordPress instance. Verify contact delivery and spam throttling. Existing checkout creates orders without online payment; confirm that this matches the launch requirements.

Verify HTTPS/security headers on the deployed domain and that a cross-origin POST returns 403. Confirm oversized JSON returns 413 and missing/wrong JSON content type returns 415. Confirm unpublished products cannot be retrieved by slug. Do not treat mocked browser tests as proof that live SMS, fulfilment or payment integrations work.

## Verification recorded during this review

- Dependency audit: 0 reported vulnerabilities after upgrading Next.js to 16.4.6 and applying compatible dependency patches.
- ESLint and TypeScript production build passed. The build's journal fetch failed with a CMS TLS connection reset even with network access; restore CMS connectivity and rebuild before release.
- 18 Node tests passed, covering commerce/design rules, PHP parsing, origin checks, HTML sanitization, rate limits and streamed request limits.
- All 12 desktop cases in tests/browser/commerce.spec.ts passed across reruns after updating stale UI selectors and production-origin configuration. Other browser suites and mobile cases were not run during this review. For production-server tests set TEST_APP_ORIGIN to the server's APP_URL in addition to TEST_BASE_URL.
- Live local production HTTP checks passed for security headers and 403/415/413/400 rejection cases, without sending messages or creating orders.
- Current local API credential values were absent from 190 tracked text files checked. This was not a complete historical secret scan.
- PHP runtime tests and real WordPress/SMS integration tests remain outstanding. Production settings and edge rate limiting remain required.
