import { SITE_UI_TRANSLATIONS } from '../data/uiTranslations';

export function initLanguageSystem() {
  function applyLanguage(lang: string) {
    const dict = SITE_UI_TRANSLATIONS[lang] || SITE_UI_TRANSLATIONS.en;
    if (!dict) return;

    // 1. Update HTML document lang and direction (RTL for Arabic)
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // 2. Update global lang select element if present
    const select = document.getElementById('global-lang-select') as HTMLSelectElement | null;
    if (select && select.value !== lang) {
      select.value = lang;
    }

    // 3. Update all data-i18n text nodes
    const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n') as keyof typeof dict;
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 4. Update any data-i18n-placeholder attributes
    const placeholderEls = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]');
    placeholderEls.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder') as keyof typeof dict;
      if (key && dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  // Initial load from localStorage or browser language
  const savedLang = (typeof window !== 'undefined' && localStorage.getItem('site_language')) || 'en';
  applyLanguage(savedLang);

  // Listen to changes from Header select
  const select = document.getElementById('global-lang-select') as HTMLSelectElement | null;
  if (select) {
    select.value = savedLang;
    select.addEventListener('change', (e) => {
      const newLang = (e.target as HTMLSelectElement).value;
      try {
        localStorage.setItem('site_language', newLang);
      } catch {}
      applyLanguage(newLang);
      window.dispatchEvent(new CustomEvent('site-language-changed', { detail: { lang: newLang } }));
    });
  }

  // Listen to site-language-changed events from React QuoteApp / Toolbar
  window.addEventListener('site-language-changed', ((e: CustomEvent<{ lang: string }>) => {
    if (e.detail?.lang) {
      applyLanguage(e.detail.lang);
    }
  }) as EventListener);
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSystem);
  } else {
    initLanguageSystem();
  }
}
