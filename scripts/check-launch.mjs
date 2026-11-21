import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd(), false);
const failures = [];
for (const name of ['APP_URL', 'WP_API_URL', 'WC_API_URL', 'WINGS_BRIDGE_URL']) {
  try {
    const url = new URL(process.env[name] || '');
    if (url.protocol !== 'https:' || url.username || url.password || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error();
  } catch { failures.push(`${name}: set a public HTTPS URL without embedded credentials`); }
}
for (const name of ['WC_CONSUMER_KEY', 'WC_CONSUMER_SECRET']) {
  if (!process.env[name]) failures.push(`${name}: required`);
}
if ((process.env.WINGS_BRIDGE_SECRET || '').length < 32) failures.push('WINGS_BRIDGE_SECRET: at least 32 random characters required; must match WordPress');
if (!process.env.TRUSTED_CLIENT_IP_HEADER) failures.push('TRUSTED_CLIENT_IP_HEADER: configure a header your hosting proxy overwrites; otherwise visitors share rate limits');
for (const name of Object.keys(process.env)) {
  if (/^NEXT_PUBLIC_.*(SECRET|PASSWORD|PRIVATE_KEY|CONSUMER_KEY)/i.test(name)) failures.push(`${name}: secret must not be exposed to browsers`);
}
if (failures.length) {
  console.error('Launch configuration incomplete:\n' + failures.map(x => `- ${x}`).join('\n'));
  process.exitCode = 1;
} else console.log('Configuration checks passed. Complete the live checks in LAUNCH.md before opening the store.');
