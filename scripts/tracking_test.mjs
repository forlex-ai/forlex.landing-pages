#!/usr/bin/env node
/** Tracking regression tests with isolated browser mocks; no network or real keys.
 * Usage: node --test scripts/tracking_test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const template = readFileSync(new URL('../shared/tracking/tracking.js', import.meta.url), 'utf8');
const href = 'https://app.forlex.ai/login?utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_a';

function setup({ slug = 'advogados', block = '02 Hero', plan = '', disabled = false,
  pixel = 'test-pixel', fbq = true, dnt = false, target = null, download = false,
  explicit = null, loading = false, beacon = true } = {}) {
  const calls = [], captures = [], timers = [], navigation = [], listeners = new Map();
  const storage = new Map();
  const anchor = {
    href, innerText: 'Criar conta',
    getAttribute: (key) => ({ target, 'data-meta-cta': explicit })[key] || null,
    hasAttribute: (key) => key === 'download' && download,
    closest: (selector) => {
      if (selector === '[data-figma]') {
        return { getAttribute: () => block };
      }
      if (selector === '.plan' && plan) {
        return { querySelector: () => ({ textContent: plan }) };
      }
      return null;
    },
    addEventListener: (name, handler) => listeners.set(name, handler),
  };
  const document = {
    title: 'Test LP', referrer: '', readyState: loading ? 'loading' : 'complete',
    querySelectorAll: () => [anchor],
    addEventListener: (name, handler) => listeners.set(name, handler),
  };
  const window = {
    location: { search: '', pathname: '/' + slug, href: 'https://go.forlex.ai/' + slug,
      origin: 'https://go.forlex.ai', assign: (url) => navigation.push(url) },
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    crypto: { randomUUID: () => 'test-journey' },
    setTimeout: (callback, delay) => { timers.push({ callback, delay }); },
  };
  if (fbq) {
    window.fbq = typeof fbq === 'function' ? fbq : (...args) => calls.push(args);
  }
  const source = template.replaceAll('__LP_SLUG__', slug)
    .replaceAll('__LP_VERSION__', 'test-version').replaceAll('__POSTHOG_KEY__', 'test-key')
    .replaceAll('__POSTHOG_HOST__', 'https://example.invalid').replaceAll('__META_PIXEL_ID__', pixel)
    .replaceAll('__TRACKING_DISABLED__', String(disabled));
  runInNewContext(source, { window, document, URL, URLSearchParams, Blob, navigator: {
    doNotTrack: dnt ? '1' : '0', sendBeacon: (url, body) => {
      if (beacon) {
        captures.push({ url, body });
      }
      return beacon;
    },
  }, fetch: (url, options) => { captures.push({ url, body: options.body }); return Promise.resolve(); } });
  const click = (extra = {}) => {
    const event = { currentTarget: anchor, defaultPrevented: false, cancelable: true, button: 0,
      preventDefault() { this.defaultPrevented = true; }, ...extra };
    listeners.get('click')(event);
    return event;
  };
  return { calls, captures, timers, navigation, listeners, anchor, click };
}

for (const [slug, content, event] of [
  ['advogados', 'lp_advogados', 'Lead'],
  ['upgrade-premium', 'lp_upgrade_premium', 'InitiateCheckout'],
]) {
  test(`${slug}: page and intent events, not completed conversions`, () => {
    const state = setup({ slug });
    assert.deepEqual(state.calls.map((c) => c.slice(0, 2)), [['track', 'PageView'], ['track', 'ViewContent']]);
    assert.equal(state.calls[1][2].content_name, content);
    const click = state.click();
    assert.equal(state.calls[2][1], event);
    assert.equal(state.calls[2][2].content_name, content);
    assert.equal(state.calls[2][2].cta, 'hero');
    assert.equal(state.calls[3][1], 'LpCtaClicked');
    assert.equal(state.captures.length, 3);
    assert.equal(click.defaultPrevented, true);
    assert.equal(state.timers[0].delay, 200);
    assert.deepEqual(state.navigation, []);
    state.timers[0].callback();
    assert.deepEqual(state.navigation, [href]);
    assert.equal(state.anchor.href, href);
    assert.ok(!state.calls.some((c) => ['Purchase', 'Subscribe', 'CompleteRegistration'].includes(c[1])));
    assert.ok(!('value' in state.calls[2][2]));
  });
}

for (const [block, plan, position] of [
  ['01 Header', '', 'header'], ['02 Hero', '', 'hero'],
  ['06 Funcionalidades escritorio', '', 'funcionalidades'],
  ['07 Comparativo', '', 'comparativo'], ['03 Comparativo Starter x Premium', '', 'comparativo'],
  ['04 Beneficios do Premium', '', 'beneficios'],
  ['09 Oferta', 'Forlex Starter', 'oferta_starter'],
  ['09 Oferta', 'Forlex Premium', 'oferta_premium'], ['07 Oferta', '', 'oferta_premium'],
  ['12 CTA final', '', 'final'], ['09 CTA final', '', 'final'],
]) {
  test(`CTA position: ${block} ${plan}`, () => {
    const state = setup({ block, plan });
    state.click();
    assert.equal(state.calls[2][2].cta, position);
    assert.equal(state.calls[3][2].cta_block, block);
  });
}

test('explicit Meta position wins without changing PostHog block', () => {
  const state = setup({ explicit: 'oferta_starter' });
  state.click();
  assert.equal(state.calls[2][2].cta, 'oferta_starter');
  assert.equal(state.calls[3][2].cta_block, '02 Hero');
});

for (const extra of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true },
  { altKey: true }, { button: 1 }, { cancelable: false }]) {
  test(`native navigation preserved: ${JSON.stringify(extra)}`, () => {
    const state = setup();
    assert.equal(state.click(extra).defaultPrevented, false);
    assert.equal(state.timers.length, 0);
    assert.equal(state.calls[2][1], 'Lead');
  });
}

for (const options of [{ target: '_blank' }, { download: true }, { pixel: '' },
  { pixel: '__UNSET__' }, { fbq: false }, { disabled: true }]) {
  test(`no delay when navigation should remain native: ${JSON.stringify(options)}`, () => {
    const state = setup(options);
    assert.equal(state.click().defaultPrevented, false);
    assert.equal(state.timers.length, 0);
  });
}

test('already canceled clicks do not track or navigate', () => {
  const state = setup();
  state.click({ defaultPrevented: true });
  assert.equal(state.calls.length, 2);
  assert.equal(state.captures.length, 2);
  assert.equal(state.timers.length, 0);
});

test('rapid duplicate click does not emit another intent event', () => {
  const state = setup();
  state.click();
  assert.equal(state.click().defaultPrevented, true);
  assert.equal(state.calls.length, 4);
  assert.equal(state.timers.length, 1);
});

test('DNT still suppresses PostHog; disabled mode suppresses all events', () => {
  const dnt = setup({ dnt: true });
  dnt.click();
  assert.equal(dnt.captures.length, 0);
  assert.equal(dnt.calls.length, 4);
  const disabled = setup({ disabled: true });
  disabled.click();
  assert.equal(disabled.captures.length, 0);
  assert.equal(disabled.calls.length, 0);
});

test('DOMContentLoaded binds once and records initial events', () => {
  const state = setup({ loading: true });
  assert.equal(state.calls.length, 0);
  state.listeners.get('DOMContentLoaded')();
  state.click();
  assert.equal(state.calls.length, 4);
});

test('PostHog CTA schema and UTMs remain unchanged with fetch fallback', async () => {
  const state = setup({ beacon: false });
  state.click();
  const payload = JSON.parse(state.captures[2].body);
  assert.equal(payload.event, 'lp_cta_clicked');
  assert.equal(payload.properties.cta_block, '02 Hero');
  assert.equal(payload.properties.cta_href, href);
  assert.equal(payload.properties.cta_utm_content, 'lp_a');
  assert.equal(payload.properties.journey_id, 'test-journey');
});

test('Meta exceptions remain best-effort and never strand navigation', () => {
  const state = setup({ fbq() { throw new Error('blocked'); } });
  assert.equal(state.click().defaultPrevented, true);
  state.timers[0].callback();
  assert.deepEqual(state.navigation, [href]);
});
