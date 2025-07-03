import { LitElement, html } from 'lit';
import { updateWhenLocaleChanges, msg } from '@lit/localize';
import { setLocale, getLocale } from '../../localization.js';
import { languagePickerStyles } from './language-picker-style.js';

export class LanguagePicker extends LitElement {
  static get properties() {
    return {
      selectedLang: { type: String },
    };
  }

  static get styles() {
    return languagePickerStyles;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.selectedLang = getLocale();
  }

  changeLanguage(language) {
    this.selectedLang = language;
    document.documentElement.lang = language;
    setLocale(language);
  }

  render() {
    const trFlag = html`<img
      src="/src/assets/icons/tr-flag.svg"
      alt="TR"
      width="32"
      height="32"
    />`;

    const enFlag = html`<img
      src="/src/assets/icons/en-flag.svg"
      alt="EN"
      width="32"
      height="32"
    />`;
    return html`
      <div class="lang-dropdown">
        <button class="dropbtn">
          ${getLocale() === 'tr' ? trFlag : enFlag}
        </button>
        <div class="dropdown-content">
          <a
            data-test-id="en-button"
            href="#"
            @click=${() => this.changeLanguage('en')}
          >
            ${enFlag} ${msg('English')}
          </a>
          <a
            data-test-id="tr-button"
            href="#"
            @click=${() => this.changeLanguage('tr')}
          >
            ${trFlag} ${msg('Turkish')}
          </a>
        </div>
      </div>
    `;
  }
}
customElements.define('language-picker', LanguagePicker);
