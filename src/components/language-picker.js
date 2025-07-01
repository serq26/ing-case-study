import { LitElement, html, css } from 'lit';
import { setLocale, getLocale } from '../localization.js';
import { updateWhenLocaleChanges, msg } from '@lit/localize';

export class LanguagePicker extends LitElement {
  static get properties() {
    return {
      selectedLang: { type: String },
    };
  }
  
  static get styles() {
    return css`
      button {
        outline: none;
        border: none;
        background: transparent;
        cursor: pointer;
      }
      .lang-dropdown {
        position: relative;
        display: inline-block;
      }
      .lang-dropdown .dropbtn {
        background-color: transparent;
        border: 0;
        border-radius: 8px;
        padding: 8px;
        transition: background-color 0.3s ease;
      }
      .lang-dropdown:hover .dropbtn {
        background-color: #ddd;
      }
      .lang-dropdown .dropdown-content {
        max-height: 0;
        opacity: 0;
        position: absolute;
        margin-top: 12px;
        right: 0;
        min-width: 160px;
        z-index: 1;
        background-color: #f9f9f9;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        transition: opacity 0.3s ease, max-height 0.3s ease;
        overflow: hidden;
      }
      .lang-dropdown:hover .dropdown-content {
        opacity: 1;
        max-height: 120px;
      }
      .lang-dropdown .dropdown-content a {
        display: flex;
        align-items: center;
        gap: 16px;
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      .lang-dropdown .dropdown-content a:hover {
        background-color: #ddd;
      }
    `;
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
