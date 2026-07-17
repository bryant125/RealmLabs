import { execSync } from 'node:child_process';

// Auto-detect TinaCMS credentials. If they're set (in Vercel env vars), build the
// visual editor at /admin too. If not, build the site only — the deploy NEVER
// fails just because Tina isn't configured yet.
const hasTina =
  Boolean(process.env.TINA_TOKEN) &&
  Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID);

if (hasTina) {
  console.log('✓ Tina credentials found — building visual editor (/admin) + site');
  // --skip-cloud-checks: build the admin app without failing the deploy if the
  // branch isn't registered on TinaCloud yet. The editor still connects at runtime.
  execSync('tinacms build --skip-cloud-checks && astro build', { stdio: 'inherit' });
} else {
  console.log('• No Tina credentials — building site only (visual editor off until keys are added)');
  execSync('astro build', { stdio: 'inherit' });
}
