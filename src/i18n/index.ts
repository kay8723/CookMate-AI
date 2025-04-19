import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import translations
import en from './translations/en';
import fr from './translations/fr';
import ja from './translations/ja';

const i18n = new I18n({
  en,
  fr,
  ja,
});

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n; 