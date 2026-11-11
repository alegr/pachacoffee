import es from './es.json';
import en from './en.json';
import ja from './ja.json';

const translations: Record<string, Record<string, any>> = { es, en, ja };

export type Lang = 'es' | 'en' | 'ja';

export function t(lang: string, key: string): string {
  const keys = key.split('.');
  let val: any = translations[lang];
  for (const k of keys) {
    val = val?.[k];
  }
  return val ?? key;
}

export function getLang(url: URL): Lang {
  if (url.pathname.startsWith('/ja')) return 'ja';
  if (url.pathname.startsWith('/en')) return 'en';
  return 'es';
}
