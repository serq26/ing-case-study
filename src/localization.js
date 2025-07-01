import { configureLocalization } from '@lit/localize';
import * as tr from '../locales/tr';

export const { setLocale, getLocale } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['tr'],
  loadLocale: async(locale) => (locale === 'tr' ? tr : {}),
});
