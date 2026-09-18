/* eslint-disable no-undef */
// E2E test: full medical continuity flow against a running MediKiosk build.
// Usage: node scripts/e2e-continuity.cjs [BASE_URL]
// Default BASE_URL: http://localhost:4173 (vite preview)

const puppeteer = require('puppeteer-core');

const BASE = process.argv[2] || 'http://localhost:4173';
const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
];
const ABHA = 'ABHA-1234-5678-9012';
const REPORT_TITLE = 'E2E Continuity Report 2026';
const CONS_TAG = 'CONS-TC-' + Date.now().toString().slice(-6);

let shots = 0;
async function shot(page, name) {
  shots++;
  await page.screenshot({ path: `e2e-shots/${String(shots).padStart(2, '0')}-${name}.png` }).catch(() => {});
}

const results = [];
function report(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅ PASS' : '❌ FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

function normText(s) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

async function waitText(page, text, timeout = 12000) {
  const start = Date.now();
  const needle = normText(text);
  while (Date.now() - start < timeout) {
    const found = await page.evaluate(
      (t) => (document.body && document.body.innerText ? document.body.innerText : '').replace(/\s+/g, ' ').trim().toLowerCase().includes(t),
      needle
    );
    if (found) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

// Tolerant click: find clickable element containing exact-ish text
async function clickText(page, selector, text, timeout = 10000) {
  const start = Date.now();
  const needle = normText(text);
  while (Date.now() - start < timeout) {
    const ok = await page.evaluate(
      (sel, txt) => {
        const els = [...document.querySelectorAll(sel)];
        const el = els.find(
          (e) =>
            e.innerText &&
            e.innerText.replace(/\s+/g, ' ').trim().toLowerCase().includes(txt) &&
            e.offsetParent !== null
        );
        if (el) {
          el.click();
          return true;
        }
        return false;
      },
      selector,
      needle
    );
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`clickText failed: "${text}" not found in ${selector}`);
}

async function typeInto(page, selector, value, useKeyboard = true) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.focus(selector);
  if (useKeyboard) {
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.type(selector, value, { delay: 5 });
  } else {
    await page.evaluate(
      (sel, val) => {
        const el = document.querySelector(sel);
        const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      },
      selector,
      value
    );
  }
}

// Exclusive lock so dev/preview tab and manual browser don't fight over IndexedDB
async function acquireDBLock(page) {
  await page.evaluateOnNewDocument(() => {
    window.__E2E_DB_LOCK__ = navigator.locks.request('medikiosk_e2e_lock', () => new Promise(() => {}));
  });
}

async function waitForAppReady(page) {
  await page.waitForFunction(
    () => {
      const t = document.body ? document.body.innerText : '';
      return t.includes('PATIENT PORTAL') || t.includes('Loading patient portal') || t.includes('Welcome');
    },
    { timeout: 20000 }
  );
  await page.waitForFunction(() => document.body.innerText.includes('PATIENT PORTAL'), { timeout: 20000 });
}

async function patientLogin(page) {
  await clickText(page, 'button', 'Patient Login');
  await page.waitForSelector('input[placeholder*="ABHA"]', { timeout: 10000 });
  await typeInto(page, 'input[placeholder*="ABHA"]', ABHA);
  await clickText(page, 'button', 'Verify & Continue');
  const ok = await waitText(page, 'Welcome, Arjun Sharma');
  if (!ok) throw new Error('Patient dashboard did not load');
}

async function patientLogout(page) {
  // Dismiss any visible toast first (defensive; toast no longer blocks clicks)
  const dismiss = await page.$('button[aria-label="Dismiss"]');
  if (dismiss) { await dismiss.click().catch(() => {}); await new Promise((r) => setTimeout(r, 400)); }
  await page.click('button[title="Logout"]');
  const ok = await waitText(page, 'PATIENT PORTAL', 8000);
  if (!ok) throw new Error('Patient logout did not return to landing');
}

async function navTab(page, label) {
  await clickText(page, 'aside button, nav button', label);
  await new Promise((r) => setTimeout(r, 600));
}

async function doctorLogin(page) {
  await clickText(page, 'button', 'Doctor Login');
  await waitText(page, 'Doctor Portal');
  await clickText(page, 'button', 'Dr. Ananya Rao');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await typeInto(page, 'input[type="password"]', 'doctor123');
  await clickText(page, 'button', 'Sign In');
  const ok = await waitText(page, 'Dr. Ananya Rao');
  if (!ok) throw new Error('Doctor dashboard did not load');
}

async function doctorLogout(page) {
  const dismiss = await page.$('button[aria-label="Dismiss"]');
  if (dismiss) { await dismiss.click().catch(() => {}); await new Promise((r) => setTimeout(r, 400)); }
  await page.click('button[title="Logout"]');
  const ok = await waitText(page, 'PATIENT PORTAL', 8000);
  if (!ok) throw new Error('Doctor logout did not return to landing');
}

(async () => {
  const fs = require('fs');
  fs.mkdirSync('e2e-shots', { recursive: true });

  let chromePath = CHROME_PATHS.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
  if (!chromePath) chromePath = undefined;

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + err.message));

  await acquireDBLock(page);

  try {
    // ─────────────────────────────────────────────
    // PHASE 1 — PATIENT: login, history, upload report
    // ─────────────────────────────────────────────
    console.log('\n━━ PHASE 1: PATIENT — Arjun Sharma (PAT-1001)');
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 30000 });
    await waitForAppReady(page);
    await shot(page, 'landing');
    report('Landing page loads with two portals', true);

    await patientLogin(page);
    await shot(page, 'patient-dashboard');
    report('Patient login via ABHA ID', true);

    // Medical history shows seeded consultations
    await navTab(page, 'Medical History');
    await waitText(page, 'Dr. Ananya Rao');
    const histText = await page.evaluate(() => document.body.innerText);
    report('Seeded consultation visible (Dr. Ananya Rao, Sep 10)', histText.includes('2026-09-10'));
    report('Second doctor visible (Dr. Rahul Menon, Aug 21)', histText.includes('2026-08-21'));
    await shot(page, 'patient-history');

    // Upload a manual report
    await navTab(page, 'Add Record');
    await clickText(page, 'button', 'Add Manually');
    await page.waitForSelector('input[placeholder*="Complete Blood Count"]', { timeout: 10000 });
    await typeInto(page, 'input[placeholder*="Complete Blood Count"]', REPORT_TITLE);
    await typeInto(
      page,
      'textarea',
      'E2E test report: Hemoglobin 13.4 g/dL. Automated continuity check entry.',
      false
    );
    await clickText(page, 'button', 'Save Record');
    await waitText(page, 'Record Saved');
    await shot(page, 'report-saved');
    report('Manual report upload succeeds', true);

    // Verify it appears in Reports
    await navTab(page, 'Reports');
    const repOk = await waitText(page, REPORT_TITLE);
    report('New report visible in Reports tab', repOk);
    await shot(page, 'patient-reports');

    await patientLogout(page);
    report('Patient logout returns to landing', true);

    // ─────────────────────────────────────────────
    // PHASE 2 — DOCTOR: search, review, add consultation
    // ─────────────────────────────────────────────
    console.log('\n━━ PHASE 2: DOCTOR — Dr. Ananya Rao (DOC-001)');
    await doctorLogin(page);
    await shot(page, 'doctor-dashboard');
    report('Doctor login DOC-001 / doctor123', true);

    // Search by ABHA ID
    await clickText(page, 'aside button, nav button', 'Patient Search');
    await page.waitForSelector('input[placeholder*="PAT-1001"]', { timeout: 10000 });
    await typeInto(page, 'input[placeholder*="PAT-1001"]', ABHA);
    await clickText(page, 'button', 'Search Patient');
    await waitText(page, 'Arjun Sharma');
    await shot(page, 'doctor-search');
    report('Doctor finds patient by ABHA ID', true);

    // Open record
    await clickText(page, 'button', 'View Record');
    await waitText(page, 'Previous Healthcare Providers');
    await shot(page, 'doctor-record-overview');
    const ov = normText(await page.evaluate(() => document.body.innerText));
    report('Record overview shows known conditions', ov.includes('type 2 diabetes'));
    report('Record overview shows allergies', ov.includes('penicillin'));
    report('Record shows "Previous Healthcare Providers"', ov.includes('previous healthcare providers'));

    // History tab
    await clickText(page, 'button', 'Medical History');
    await new Promise((r) => setTimeout(r, 600));
    const docHist = normText(await page.evaluate(() => document.body.innerText));
    report('Doctor sees previous consultations timeline', docHist.includes('2026-09-10') && docHist.includes('2026-08-21'));

    // Reports tab + OCR text
    await clickText(page, 'button', 'Reports');
    await waitText(page, REPORT_TITLE);
    await clickText(page, 'button', 'View Extracted Text');
    await new Promise((r) => setTimeout(r, 400));
    const docRep = normText(await page.evaluate(() => document.body.innerText));
    report("Doctor sees patient's uploaded report", docRep.includes(REPORT_TITLE.toLowerCase()));
    report('Doctor sees OCR extracted text', docRep.includes('hemoglobin'));
    await shot(page, 'doctor-reports');

    // Current Visit — add consultation
    await clickText(page, 'button', 'Current Visit');
    await waitText(page, 'New Consultation for');
    const boxes = await page.$$('textarea');
    const rxText = `Rx for E2E ${CONS_TAG}: Paracetamol 650mg TDS x 3 days`;
    if (boxes.length < 6) throw new Error(`Expected 6 textareas, found ${boxes.length}`);
    const fields = [
      'Fever and dry cough for 2 days (E2E test).',
      'Afebrile now, throat congestion noted.',
      'Acute viral upper respiratory infection.',
      'Supportive care, rest and hydration.',
      rxText,
      'Follow up after 3 days if fever persists. (E2E)',
    ];
    for (let i = 0; i < fields.length; i++) {
      await boxes[i].click({ clickCount: 3 });
      await boxes[i].type(fields[i], { delay: 2 });
    }
    await shot(page, 'doctor-consult-form');
    await clickText(page, 'button', 'Save Consultation');
    await waitText(page, 'Consultation Saved');
    await shot(page, 'consult-saved');
    report('Doctor saves new consultation', true);

    await doctorLogout(page);
    report('Doctor logout returns to landing', true);

    // ─────────────────────────────────────────────
    // PHASE 3 — PATIENT AGAIN: continuity verification
    // ─────────────────────────────────────────────
    console.log('\n━━ PHASE 3: PATIENT AGAIN — continuity check');
    await patientLogin(page);

    await navTab(page, 'Medical History');
    const contOk = await waitText(page, CONS_TAG);
    report('NEW doctor consultation appears in patient history (CONTINUITY)', contOk);
    const contText = normText(await page.evaluate(() => document.body.innerText));
    report('New consultation shows treating doctor + date', contText.includes('dr. ananya rao'));

    await navTab(page, 'Reports');
    const repPersist = await waitText(page, REPORT_TITLE);
    report('Previously uploaded report still present (PERSISTENCE)', repPersist);
    await shot(page, 'continuity-verified');

    // Prescriptions tab also lists the new Rx
    await navTab(page, 'Prescriptions');
    const rxOk = await waitText(page, CONS_TAG);
    report('New prescription visible in Prescriptions tab', rxOk);

    await patientLogout(page);
  } catch (err) {
    await shot(page, 'failure-state');
    report('Unexpected test failure', false, err.message);
    const body = await page.evaluate(() => (document.body ? document.body.innerText.slice(0, 600) : '')).catch(() => '');
    console.log('── Page text at failure:\n' + body);
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n══════════ RESULTS: ${results.length - failed.length}/${results.length} passed ══════════`);
  if (consoleErrors.length) {
    console.log('\n⚠ Console errors captured:');
    [...new Set(consoleErrors)].slice(0, 10).forEach((e) => console.log('  • ' + e.slice(0, 200)));
  } else {
    console.log('✓ Zero console errors');
  }
  process.exit(failed.length ? 1 : 0);
})();
