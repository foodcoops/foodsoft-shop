import i18n from 'i18n-js';
import locales from '../../locales';

// Initialize i18n
export default function i18nInit() {
  i18n.reset();
  i18n.translations = locales;

  // Somehow this is necessary.
  // thanks https://github.com/chrome/webpack-rails-i18n-js-plugin
  for (var key in i18n) {
    if (typeof i18n[key] == 'function') {
      i18n[key] = i18n[key].bind(i18n);
    }
  }
}
