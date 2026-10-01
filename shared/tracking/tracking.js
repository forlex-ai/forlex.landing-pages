/**
 * Forlex Landing Pages — shared tracking.
 *
 * Vanilla JS (no dependencies). Injected at build time by scripts/build.mjs.
 *
 * What it does:
 * - Sends `lp_page_viewed` to PostHog (via lightweight capture API, no posthog-js bundle).
 * - Sends `PageView` to Meta Pixel (fbq) when LP_META_PIXEL_ID is configured.
 * - Listens for clicks on app CTAs (a[href*="app.forlex.ai"]) and sends:
 *     - PostHog `lp_cta_clicked` with lp_slug, cta_block, cta_text, cta_href + UTMs
 *     - Meta Pixel `Lead` + `LpCtaClicked` custom event
 * - Reuses `forlex_journey_id` from localStorage for site→app attribution
 *   (same key as forlex.site, ENG-3746 convention).
 * - Preserves UTMs: never rewrites hrefs, only reads them.
 *
 * Build-time placeholders (replaced by scripts/build.mjs):
 *   __LP_SLUG__, __LP_VERSION__, __POSTHOG_KEY__, __POSTHOG_HOST__,
 *   __META_PIXEL_ID__, __BASE_URL__, __TRACKING_DISABLED__
 *
 * Respects:
 * - `?static=1` still tracks (animation flag only, not a tracking opt-out).
 * - `navigator.doNotTrack=1` skips PostHog (matches forlex.site respect_dnt).
 * - `LP_DISABLE_TRACKING=true` skips everything (local dev without keys).
 */
(function () {
  'use strict';

  var LP_SLUG = '__LP_SLUG__';
  var LP_VERSION = '__LP_VERSION__';
  var POSTHOG_KEY = '__POSTHOG_KEY__';
  var POSTHOG_HOST = '__POSTHOG_HOST__';
  var META_PIXEL_ID = '__META_PIXEL_ID__';
  var TRACKING_DISABLED = '__TRACKING_DISABLED__' === 'true';

  var JOURNEY_KEY = 'forlex_journey_id';
  var DISTINCT_KEY = 'forlex_lp_distinct_id';

  function isDnt() {
    try {
      return navigator.doNotTrack === '1' || window.doNotTrack === '1';
    } catch (e) {
      return false;
    }
  }

  function getQueryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || undefined;
    } catch (e) {
      return undefined;
    }
  }

  function getUtmsFromUrl(url) {
    var out = {};
    try {
      var u = new URL(url, window.location.origin);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
        var v = u.searchParams.get(k);
        if (v) out[k] = v;
      });
    } catch (e) {
      /* ignore */
    }
    return out;
  }

  function getPageUtms() {
    var out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var v = getQueryParam(k);
      if (v) out[k] = v;
    });
    return out;
  }

  function uuid() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch (e) {
      /* fallthrough */
    }
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* private mode */
    }
  }

  function getJourneyId() {
    var existing = storageGet(JOURNEY_KEY);
    if (existing) return existing;
    var generated = uuid();
    storageSet(JOURNEY_KEY, generated);
    return generated;
  }

  function getDistinctId() {
    var existing = storageGet(DISTINCT_KEY);
    if (existing) return existing;
    var generated = uuid();
    storageSet(DISTINCT_KEY, generated);
    return generated;
  }

  function baseProps(extra) {
    var props = {
      source: 'lp',
      app: 'forlex-landing-pages',
      service: 'platform',
      environment: 'production',
      lp_slug: LP_SLUG,
      lp_version: LP_VERSION,
      page_path: window.location.pathname,
      page_title: document.title,
      current_url: window.location.href.slice(0, 512),
      referrer_domain: referrerDomain(),
      journey_id: getJourneyId(),
    };
    var utms = getPageUtms();
    Object.keys(utms).forEach(function (k) {
      props[k] = utms[k];
    });
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        props[k] = extra[k];
      });
    }
    return props;
  }

  function referrerDomain() {
    try {
      if (!document.referrer) return undefined;
      return new URL(document.referrer).hostname.replace(/^www\./, '');
    } catch (e) {
      return undefined;
    }
  }

  function posthogCapture(event, properties) {
    if (TRACKING_DISABLED) return;
    if (!POSTHOG_KEY || POSTHOG_KEY.indexOf('__') === 0) return;
    if (isDnt()) return;
    var host = (POSTHOG_HOST && POSTHOG_HOST.indexOf('__') !== 0 ? POSTHOG_HOST : 'https://b.forlex.ai').replace(/\/+$/, '');
    var payload = {
      api_key: POSTHOG_KEY,
      event: event,
      distinct_id: getDistinctId(),
      properties: properties,
      timestamp: new Date().toISOString(),
    };
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(host + '/capture/', blob)) return;
      }
      fetch(host + '/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
        mode: 'cors',
        credentials: 'omit',
      }).catch(function () {
        /* best-effort */
      });
    } catch (e) {
      /* best-effort */
    }
  }

  function fbqTrack(event, params) {
    if (TRACKING_DISABLED) return;
    if (!META_PIXEL_ID || META_PIXEL_ID.indexOf('__') === 0) return;
    try {
      if (typeof window.fbq === 'function') {
        if (params) window.fbq('track', event, params);
        else window.fbq('track', event);
      }
    } catch (e) {
      /* best-effort */
    }
  }

  function fbqTrackCustom(event, params) {
    if (TRACKING_DISABLED) return;
    if (!META_PIXEL_ID || META_PIXEL_ID.indexOf('__') === 0) return;
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', event, params || {});
      }
    } catch (e) {
      /* best-effort */
    }
  }

  function inferCtaBlock(anchor) {
    try {
      var figma = anchor.closest('[data-figma]');
      if (figma && figma.getAttribute('data-figma')) return figma.getAttribute('data-figma');
      var section = anchor.closest('header, footer, section, [id]');
      if (section) {
        if (section.tagName === 'HEADER') return 'header';
        if (section.tagName === 'FOOTER') return 'footer';
        if (section.id) return section.id;
        var cls = (section.className && section.className.baseVal !== undefined
          ? section.className.baseVal
          : String(section.className || '')).split(/\s+/).slice(0, 2).join('.');
        if (cls) return cls;
      }
    } catch (e) {
      /* ignore */
    }
    return 'unknown';
  }

  function ctaText(anchor) {
    try {
      var text = (anchor.innerText || anchor.textContent || '').replace(/\s+/g, ' ').trim();
      return text.slice(0, 120);
    } catch (e) {
      return '';
    }
  }

  function onCtaClick(event) {
    var anchor = event.currentTarget;
    if (!anchor || !anchor.href) return;
    var href = anchor.href;
    var block = anchor.getAttribute('data-cta-block') || inferCtaBlock(anchor);
    var text = ctaText(anchor);
    var hrefUtms = getUtmsFromUrl(href);
    var props = baseProps({
      cta_block: block,
      cta_text: text,
      cta_href: href.slice(0, 512),
      cta_utm_content: hrefUtms.utm_content,
      cta_utm_campaign: hrefUtms.utm_campaign,
    });
    posthogCapture('lp_cta_clicked', props);
    fbqTrack('Lead', {
      content_name: LP_SLUG + ':' + block,
      content_category: 'lp_cta',
    });
    fbqTrackCustom('LpCtaClicked', {
      lp_slug: LP_SLUG,
      cta_block: block,
      cta_text: text,
    });
  }

  function bindCtaTracking() {
    try {
      var ctas = document.querySelectorAll('a[href*="app.forlex.ai"]');
      ctas.forEach(function (a) {
        if (a.__lpTracked) return;
        a.__lpTracked = true;
        a.addEventListener('click', onCtaClick, { passive: true });
      });
    } catch (e) {
      /* best-effort */
    }
  }

  function pageView() {
    posthogCapture('lp_page_viewed', baseProps());
    posthogCapture('$pageview', baseProps());
    fbqTrack('PageView');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindCtaTracking();
      pageView();
    });
  } else {
    bindCtaTracking();
    pageView();
  }

  // Expose for QA / debugging (not part of the public API).
  window.__forlexLp = window.__forlexLp || {};
  window.__forlexLp.slug = LP_SLUG;
  window.__forlexLp.version = LP_VERSION;
})();
