import i18next from 'i18next';
import fs from 'fs';
import path from 'path';

const engPath = path.join(__dirname, "./assets/i18n/eng.json");
let engData: any = {};
try {
  const raw = fs.readFileSync(engPath, 'utf8');
  engData = JSON.parse(raw);
} catch (err) {
    console.error(__dirname);
    console.error(`Error loading English translations from ${engPath}:`, err);
}

const resources = {
  en: {
    translation: engData,
  },
};

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export function t(key: string, options?: any): string {
  return i18next.t(key, options) as string;
}

export default i18next;
