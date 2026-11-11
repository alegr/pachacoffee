import es from './es.json';
import en from './en.json';

const translations: Record<string, Record<string, any>> = { es, en };

export function t(lang: string, key: string): string {
  const keys = key.split('.');
  let val: any = translations[lang];
  for (const k of keys) {
    val = val?.[k];
  }
  return val ?? key;
}

export function getLang(url: URL): 'es' | 'en' {
  return url.pathname.startsWith('/en') ? 'en' : 'es';
}
