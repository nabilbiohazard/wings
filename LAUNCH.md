# Production launch

Do not launch until the configuration and live checks below pass. A source review and dependency audit cannot certify the deployed WordPress installation or hosting.

## Configuration

Copy the setting names from `.env.example` into the hosting secret manager. Run `npm run check:launch` with the production environment loaded. The local environment at review time lacked APP_URL, WINGS_BRIDGE_URL, WINGS_BRIDGE_SECRET and TRUSTED_CLIENT_IP_HEADER.

- APP_URL must be the canonical HTTPS storefront origin. Mutating APIs reject requests when it is missing or insecure.
- Install `wordpress/wings-commerce/` on WordPress and set the same independently generated bridge secret (at least 32 random characters) on both hosts. Configure the SMS provider in WordPress. Do not reuse WooCommerce credentials as the bridge secret.
- Use read-only WooCommerce API credentials: storefront catalogue reads do not require write privileges.
- TRUSTED_CLIENT_IP_HEADER must identify a header the hosting proxy overwrites. Block direct access to the origin server if otherwise the header can be forged. Without it all users share an anonymous quota.
- Set the WordPress storefront URL and review the image hostname allowlist in next.config.ts if moving away from the existing CMS host.
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
