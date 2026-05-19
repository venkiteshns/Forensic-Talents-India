/**
 * Load Test — Enquiry Endpoint
 * Target : POST http://localhost:5000/api/contact
 * Profile: 10 simultaneous requests, 3 rounds (30 total)
 *
 * Run with: node load-test-enquiry.mjs
 * (backend must be running on :5000)
 */

const BASE_URL   = 'http://localhost:5000/api/contact';
const CONCURRENCY = 10;   // requests per round
const ROUNDS      = 3;    // total rounds
const DELAY_MS    = 1000; // ms between rounds

// ── Synthetic enquiry payload ────────────────────────────────────────────────
const makePayload = (i) => ({
  name:           `Load Tester ${i}`,
  email:          `loadtest${i}@example.com`,
  phone:          `98765${String(43210 + i).padStart(5, '0')}`,
  message:        `Automated load test enquiry #${i}`,
  enquiryType:    'Education',
  enquiryCategory:'Courses',
  nationality:    'India',
});

// ── Single request ───────────────────────────────────────────────────────────
async function fireRequest(index) {
  const start = Date.now();
  try {
    const res = await fetch(BASE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(makePayload(index)),
    });
    const latency = Date.now() - start;
    const body = await res.json().catch(() => ({}));
    return { index, status: res.status, latency, ok: res.ok, body };
  } catch (err) {
    return { index, status: 0, latency: Date.now() - start, ok: false, error: err.message };
  }
}

// ── Run one round of CONCURRENCY requests in parallel ────────────────────────
async function runRound(round, startIndex) {
  console.log(`\n── Round ${round} — firing ${CONCURRENCY} requests simultaneously ──`);
  const t0 = Date.now();
  const results = await Promise.all(
    Array.from({ length: CONCURRENCY }, (_, i) => fireRequest(startIndex + i))
  );
  const elapsed = Date.now() - t0;

  results.forEach(r => {
    const icon = r.ok ? '✓' : '✗';
    const errNote = r.error ? ` [${r.error}]` : '';
    console.log(`  ${icon} req#${r.index} → HTTP ${r.status} | ${r.latency}ms${errNote}`);
  });

  const passed  = results.filter(r => r.ok).length;
  const failed  = results.filter(r => !r.ok).length;
  const avgMs   = Math.round(results.reduce((s, r) => s + r.latency, 0) / results.length);
  console.log(`  Round ${round} done in ${elapsed}ms | ✓ ${passed} passed | ✗ ${failed} failed | avg ${avgMs}ms`);

  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n====================================================`);
  console.log(` Enquiry Load Test`);
  console.log(` Target   : ${BASE_URL}`);
  console.log(` Profile  : ${CONCURRENCY} req/round × ${ROUNDS} rounds = ${CONCURRENCY * ROUNDS} total`);
  console.log(`====================================================`);

  const all = [];
  for (let round = 1; round <= ROUNDS; round++) {
    const results = await runRound(round, (round - 1) * CONCURRENCY + 1);
    all.push(...results);
    if (round < ROUNDS) {
      console.log(`  Waiting ${DELAY_MS}ms before next round…`);
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  const totalPassed = all.filter(r => r.ok).length;
  const totalFailed = all.filter(r => !r.ok).length;
  const avgLatency  = Math.round(all.reduce((s, r) => s + r.latency, 0) / all.length);
  const minLatency  = Math.min(...all.map(r => r.latency));
  const maxLatency  = Math.max(...all.map(r => r.latency));

  console.log(`\n====================================================`);
  console.log(` SUMMARY`);
  console.log(`====================================================`);
  console.log(` Total requests : ${all.length}`);
  console.log(` ✓ Passed       : ${totalPassed}`);
  console.log(` ✗ Failed       : ${totalFailed}`);
  console.log(` Avg latency    : ${avgLatency}ms`);
  console.log(` Min latency    : ${minLatency}ms`);
  console.log(` Max latency    : ${maxLatency}ms`);
  console.log(`====================================================\n`);
})();
